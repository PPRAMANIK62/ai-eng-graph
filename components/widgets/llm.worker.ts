/// <reference lib="webworker" />
// Runs the open tokenizers and SmolLM2 off the main thread, for every widget on the page.
// Transformers.js downloads each file from the Hugging Face Hub once and caches it in the browser.

import {
  AutoModelForCausalLM,
  AutoTokenizer,
  BaseStreamer,
  Tensor,
  type TextStreamer,
  env,
  type PreTrainedModel,
  type PreTrainedTokenizer,
} from "@huggingface/transformers";
import { MODEL, TOKENIZERS, type TokenizerId } from "./models";
import type { Backend, FromWorker, Progress, Reply, Request, TokenPiece } from "./protocol";

env.allowLocalModels = false;

const MAX_CONTEXT = 512; // tokens the explorer keeps; plenty for a demo, keeps each pass quick
const post = (msg: FromWorker, transfer: Transferable[] = []) => self.postMessage(msg, transfer);

const tokenizers = new Map<TokenizerId, Promise<PreTrainedTokenizer>>();
function tokenizer(id: TokenizerId, onProgress?: (p: Progress) => void) {
  if (!tokenizers.has(id)) {
    const repo = TOKENIZERS.find(t => t.id === id)!.repo;
    const loading = AutoTokenizer.from_pretrained(repo, { progress_callback: downloadProgress(onProgress) });
    loading.catch(() => tokenizers.delete(id)); // let a later request retry
    tokenizers.set(id, loading);
  }
  return tokenizers.get(id)!;
}

let model: Promise<{ model: PreTrainedModel; tok: PreTrainedTokenizer; backend: Backend }> | null = null;

async function pickBackend(): Promise<Backend> {
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<{ features: Set<string> } | null> } }).gpu;
  const adapter = await gpu?.requestAdapter().catch(() => null);
  if (adapter) return adapter.features.has("shader-f16")
    ? { device: "webgpu", dtype: "q4f16", mb: MODEL.mb.q4f16 }
    : { device: "webgpu", dtype: "q4", mb: MODEL.mb.q4 };
  return { device: "wasm", dtype: "q8", mb: MODEL.mb.q8 };
}

function loadModel(onProgress: (p: Progress) => void) {
  model ??= (async () => {
    const tok = await tokenizer("smollm2", onProgress);
    let backend = await pickBackend();
    const load = (b: Backend) =>
      AutoModelForCausalLM.from_pretrained(MODEL.repo, { device: b.device, dtype: b.dtype, progress_callback: downloadProgress(onProgress) });
    let m: PreTrainedModel;
    try {
      m = await load(backend);
    } catch (e) {
      if (backend.device === "wasm") throw e;
      backend = { device: "wasm", dtype: "q8", mb: MODEL.mb.q8 }; // a GPU that can't run it
      m = await load(backend);
    }
    // One throwaway token, so the first timed run doesn't pay for compiling GPU shaders.
    const warm = tok("Hi");
    await m.generate({ ...warm, max_new_tokens: 1, do_sample: false });
    return { model: m, tok, backend };
  })();
  model.catch(() => (model = null));
  return model;
}

function downloadProgress(onProgress?: (p: Progress) => void) {
  return (info: { status: string; file?: string; loaded?: number; total?: number }) => {
    if (onProgress && info.status === "progress" && info.file && info.total)
      onProgress({ kind: "download", file: info.file, loaded: info.loaded ?? 0, total: info.total });
  };
}

/** Each token's own text. Decoding a small window and diffing handles tokenizers that drop a leading space. */
function pieces(tok: PreTrainedTokenizer, ids: number[]): TokenPiece[] {
  const out: TokenPiece[] = [];
  for (let i = 0; i < ids.length; i++) {
    const from = Math.max(0, i - 8);
    const before = i > from ? tok.decode(ids.slice(from, i), { skip_special_tokens: false }) : "";
    const after = tok.decode(ids.slice(from, i + 1), { skip_special_tokens: false });
    out.push({ id: ids[i], text: after.startsWith(before) ? after.slice(before.length) : tok.decode([ids[i]]) });
  }
  return out;
}

function topK(row: Float32Array, k: number): number[] {
  const best: number[] = [];
  for (let i = 0; i < row.length; i++) {
    if (best.length < k || row[i] > row[best[best.length - 1]]) {
      let j = Math.min(best.length, k - 1);
      best[j] = i;
      while (j > 0 && row[best[j]] > row[best[j - 1]]) {
        [best[j], best[j - 1]] = [best[j - 1], best[j]];
        j--;
      }
    }
  }
  return best;
}

/** Collects when each new token arrives. generate() calls put() once with the prompt, then once per token. */
class TimingStreamer extends BaseStreamer {
  private sawPrompt = false;
  private ids: number[] = [];
  private printed = "";
  tokens: { text: string; t: number }[] = [];
  constructor(
    private tok: PreTrainedTokenizer,
    private onToken: (text: string, t: number) => void,
  ) {
    super();
  }
  put(value: bigint[][]) {
    if (!this.sawPrompt) {
      this.sawPrompt = true;
      return;
    }
    const t = performance.now();
    this.ids.push(...value[0].map(Number));
    const text = this.tok.decode(this.ids, { skip_special_tokens: true });
    const piece = text.slice(this.printed.length);
    this.printed = text;
    this.tokens.push({ text: piece, t });
    this.onToken(piece, t);
  }
  end() {}
}

async function handle(req: Request, progress: (p: Progress) => void): Promise<[Reply, Transferable[]]> {
  switch (req.kind) {
    case "tokenize": {
      const tok = await tokenizer(req.tokenizer, progress);
      const ids = tok.encode(req.text, { add_special_tokens: false });
      return [{ kind: "tokenized", tokens: pieces(tok, ids) }, []];
    }
    case "load": {
      const { backend } = await loadModel(progress);
      return [{ kind: "loaded", backend }, []];
    }
    case "step": {
      const { model: m, tok } = await loadModel(progress);
      let ids = req.ids ?? tok.encode(req.prompt ?? "", { add_special_tokens: false });
      ids = ids.slice(-MAX_CONTEXT);
      if (!ids.length) throw new Error("Type a few words first.");
      const input_ids = new Tensor("int64", BigInt64Array.from(ids, BigInt), [1, ids.length]);
      const attention_mask = new Tensor("int64", new BigInt64Array(ids.length).fill(BigInt(1)), [1, ids.length]);
      const t0 = performance.now();
      const out = await m({ input_ids, attention_mask });
      const ms = performance.now() - t0;
      const logits = (out.logits as Tensor).to("float32");
      const vocab = logits.dims[2];
      const all = logits.data as Float32Array;
      const row = all.slice((ids.length - 1) * vocab, ids.length * vocab);
      const top = topK(row, req.top).map(id => ({ id, text: tok.decode([id], { skip_special_tokens: false }) }));
      const text = tok.decode(ids, { skip_special_tokens: true });
      return [{ kind: "stepped", ids, text, logits: row, top, ms }, [row.buffer]];
    }
    case "generate": {
      const { model: m, tok } = await loadModel(progress);
      const inputs = tok.apply_chat_template([{ role: "user", content: req.prompt }], {
        add_generation_prompt: true,
        return_dict: true,
      }) as { input_ids: Tensor; attention_mask: Tensor };
      const promptTokens = inputs.input_ids.dims[1];
      const start = performance.now();
      const streamer = new TimingStreamer(tok, (text, t) => progress({ kind: "token", text, t, start, promptTokens }));
      await m.generate({ ...inputs, max_new_tokens: req.maxTokens, do_sample: false, streamer: streamer as unknown as TextStreamer });
      return [{ kind: "generated", promptTokens, tokens: streamer.tokens, start, end: performance.now() }, []];
    }
  }
}

// One request at a time: the GPU session isn't safe to run twice at once.
let queue: Promise<unknown> = Promise.resolve();
self.onmessage = (e: MessageEvent<{ id: number; req: Request }>) => {
  const { id, req } = e.data;
  queue = queue.then(async () => {
    try {
      const [reply, transfer] = await handle(req, progress => post({ id, progress }));
      post({ id, ok: true, reply }, transfer);
    } catch (err) {
      post({ id, ok: false, error: err instanceof Error ? err.message : String(err) });
    }
  });
};
