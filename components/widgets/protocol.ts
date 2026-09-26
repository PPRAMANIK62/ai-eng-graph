// Messages between the widgets and the model worker (llm.worker.ts).

import type { TokenizerId } from "./models";

export type Backend = { device: "webgpu" | "wasm"; dtype: "q4f16" | "q4" | "q8"; mb: number };

export type Request =
  | { kind: "tokenize"; tokenizer: TokenizerId; text: string }
  | { kind: "load" }
  /** One forward pass. Give the prompt the first time, then the ids so far. */
  | { kind: "step"; prompt?: string; ids?: number[]; top: number }
  | { kind: "generate"; prompt: string; maxTokens: number };

export type TokenPiece = { id: number; text: string };

export type Reply =
  | { kind: "tokenized"; tokens: TokenPiece[] }
  | { kind: "loaded"; backend: Backend }
  | {
      kind: "stepped";
      ids: number[];
      text: string;
      /** The logit for every token in the vocabulary, for the last position. */
      logits: Float32Array;
      /** The `top` highest-logit tokens, decoded. */
      top: TokenPiece[];
      ms: number;
    }
  | { kind: "generated"; promptTokens: number; tokens: { text: string; t: number }[]; start: number; end: number };

/** Sent while a request runs: download progress, or one streamed token. */
export type Progress =
  | { kind: "download"; file: string; loaded: number; total: number }
  | { kind: "token"; text: string; t: number; start: number; promptTokens: number };

export type FromWorker =
  | { id: number; ok: true; reply: Reply }
  | { id: number; ok: false; error: string }
  | { id: number; progress: Progress };
