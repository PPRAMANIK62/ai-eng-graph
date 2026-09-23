import { arrow, box, line, measure, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// "Time flies fast" example from sources/raschka-kv-cache.md.
// Memory numbers from sources/baseten-inference-guide.md: A10 has 24 GB, Llama 2 7B
// weights take 14 GB (2 bytes x 7B), about 0.00052 GB of cache per token, room for
// about 19,230 tokens, a batch of 4 full 4,096-token sequences.
// Head counts in the GQA figure are a made-up example of 8 query heads.

const WORDS = ["Time", "flies", "fast"];

/** One token cell: the word, and K/V (plus Q when fresh) chips under it. */
function tokenCell(x: number, y: number, word: string, state: "new" | "redo" | "cached") {
  const tone: Tone = state === "new" ? "blue" : state === "redo" ? "red" : "grey";
  const w = 92;
  let s = rect(x, y, w, 58, { tone, fill: "soft", r: 6, sw: state === "cached" ? 1 : 1.5, dash: state === "cached" });
  s += text(x + w / 2, y + 16, word, { anchor: "middle", baseline: "middle", size: 13, weight: 600 });
  const chips = state === "new" ? ["Q", "K", "V"] : ["K", "V"];
  const cw = 22;
  const gap = 5;
  const total = chips.length * cw + (chips.length - 1) * gap;
  chips.forEach((c, k) => {
    const cx = x + (w - total) / 2 + k * (cw + gap);
    s += `<rect x="${cx}" y="${y + 30}" width="${cw}" height="20" rx="3" class="bg s-${tone}" stroke-width="1"/>`;
    s += text(cx + cw / 2, y + 40, c, {
      anchor: "middle",
      baseline: "middle",
      size: 12,
      weight: 600,
      tone: state === "cached" ? "muted" : tone,
    });
  });
  return s;
}

const recompute: Figure = {
  slug: "recompute",
  alt: "Two panels for the prompt Time, generating flies then fast. Without a cache, each step recomputes keys and values for every token so far, and the repeated work is shaded red: 6 token computations in three steps. With a cache, keys and values for earlier tokens are read from the cache and only the newest token gets a fresh query, key and value: 3 computations.",
  render() {
    const cellW = 92;
    const gap = 8;
    const rowH = 84;
    const top = 50;
    const panelW = 3 * cellW + 2 * gap + 110;
    const px = [80, 80 + panelW + 50];
    const outputs = ["flies", "fast", "next"];
    let b = "";

    const heads = [
      ["Without a cache", "rerun every token, every step", "red"],
      ["With a KV cache", "compute only the newest token", "blue"],
    ] as const;
    heads.forEach(([h, sub, tone], p) => {
      b += text(px[p]!, 8, h, { size: 15, weight: 600, tone });
      b += text(px[p]!, 28, sub, { size: 12.5, tone: "muted" });
    });

    for (let step = 0; step < 3; step++) {
      const y = top + step * rowH;
      b += text(px[0]! - 16, y + 29, `step ${step + 1}`, { anchor: "end", baseline: "middle", size: 12.5, tone: "muted" });
      for (let p = 0; p < 2; p++) {
        for (let t = 0; t <= step; t++) {
          const x = px[p]! + t * (cellW + gap);
          const state = t === step ? "new" : p === 0 ? "redo" : "cached";
          b += tokenCell(x, y, WORDS[t]!, state);
        }
        const ex = px[p]! + (step + 1) * (cellW + gap);
        b += arrow(ex - gap + 6, y + 29, ex + 24, y + 29, { tone: "muted", sw: 1.3 });
        b += text(ex + 30, y + 29, outputs[step]!, { baseline: "middle", size: 13, italic: step === 2, tone: step === 2 ? "muted" : "ink" });
      }
    }

    // Tally
    const ty = top + 3 * rowH + 8;
    b += text(px[0]!, ty, "Tokens projected to K and V: 1 + 2 + 3 = 6", { size: 13, weight: 600, tone: "red" });
    b += text(px[0]!, ty + 18, "grows with the square of the length", { size: 12.5, tone: "muted" });
    b += text(px[1]!, ty, "Tokens projected to K and V: 1 + 1 + 1 = 3", { size: 13, weight: 600, tone: "blue" });
    b += text(px[1]!, ty + 18, "grows in step with the length", { size: 12.5, tone: "muted" });

    // Legend
    const ly = ty + 50;
    const legend: [Tone, string, boolean][] = [
      ["blue", "computed fresh", false],
      ["red", "recomputed, same result as last step", false],
      ["grey", "read from the cache", true],
    ];
    let lx = px[0]!;
    for (const [tone, label, dash] of legend) {
      b += rect(lx, ly - 7, 18, 14, { tone, fill: "soft", r: 3, dash, sw: dash ? 1 : 1.5 });
      b += text(lx + 26, ly, label, { baseline: "middle", size: 12.5 });
      lx += 26 + measure(label, 12.5) + 36;
    }

    return svg(
      {
        width: px[1]! + panelW + 20,
        height: ly + 32,
        title: "The KV cache turns “redo everything” into “add one row”",
        credit: "Example from Raschka, “Understanding and Coding the KV Cache in LLMs from Scratch” (2025). Adapted from his figure.",
        desc: recompute.alt,
      },
      `<g transform="translate(0 14)">${b}</g>`,
    );
  },
};

// ---- GPU memory ----
const GB_TOTAL = 24;
const GB_WEIGHTS = 14;
const GB_PER_TOKEN = 0.00052;

const memory: Figure = {
  slug: "gpu-memory",
  alt: "Two bars for the 24 GB of memory on an NVIDIA A10 running Llama 2 7B. The model weights take a fixed 14 GB. The 10 GB left holds the KV cache: either 4 requests of 4,096 tokens, about 2.1 GB each, or about 38 requests of 500 tokens, about 0.26 GB each. Total cache room is about 19,230 tokens either way.",
  render() {
    const x0 = 40;
    const W = 860;
    const scale = W / GB_TOTAL;
    const barH = 54;
    let b = "";

    // GB axis
    const axisY = 10;
    for (let g = 0; g <= GB_TOTAL; g += 2) {
      const x = x0 + g * scale;
      b += line(x, axisY + 18, x, axisY + 24, { tone: "axis" });
      b += text(x, axisY + 8, `${g}`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(x0 + W, axisY - 10, "GB", { anchor: "end", size: 11.5, tone: "muted" });

    const scenarios = [
      { label: "4 long requests: 4,096 tokens each", n: 4, tokens: 4096 },
      { label: "38 short requests: 500 tokens each", n: 38, tokens: 500 },
    ];
    scenarios.forEach((sc, k) => {
      const y = 56 + k * 116;
      b += text(x0, y, sc.label, { size: 14, weight: 600 });
      const by = y + 12;
      b += rect(x0, by, W, barH, { tone: "grey", fill: "none", r: 4, sw: 1.2 });
      b += box(x0, by, GB_WEIGHTS * scale, barH, ["model weights", "14 GB, fixed"], { tone: "purple", size: 13, r: 4 });
      let x = x0 + GB_WEIGHTS * scale;
      const each = sc.tokens * GB_PER_TOKEN;
      for (let i = 0; i < sc.n; i++) {
        const w = each * scale;
        b += rect(x + 0.8, by + 3, w - 1.6, barH - 6, { tone: "orange", fill: "soft", r: 2, sw: 1 });
        if (sc.n <= 4) b += text(x + w / 2, by + barH / 2, `${(each).toFixed(1)} GB`, { anchor: "middle", baseline: "middle", size: 12 });
        x += w;
      }
      const used = sc.n * sc.tokens;
      b += text(x0 + GB_WEIGHTS * scale, by + barH + 18, `KV cache: ${used.toLocaleString("en-US")} tokens, ${(used * GB_PER_TOKEN).toFixed(1)} GB`, { size: 12.5, tone: "orange" });
      b += text(x0 + W, by + barH + 18, `free: ${(GB_TOTAL - GB_WEIGHTS - used * GB_PER_TOKEN).toFixed(1)} GB`, { anchor: "end", size: 12.5, tone: "muted" });
    });

    const ny = 56 + 2 * 116 - 6;
    b += text(x0, ny, "Room for about 19,230 tokens of cache in total. Long contexts and many users draw on the same 10 GB.", { size: 13 });

    return svg(
      {
        width: x0 * 2 + W,
        height: ny + 22,
        title: "One A10 GPU running Llama 2 7B: the weights are fixed, the cache is what's left",
        credit: "Numbers from Baseten, “A guide to LLM inference and performance” (2025): 24 GB GPU, 14 GB of 16-bit weights, about 0.5 MB of cache per token.",
        desc: memory.alt,
      },
      `<g transform="translate(0 14)">${b}</g>`,
    );
  },
};

// ---- MHA / GQA / MQA ----
const sharing: Figure = {
  slug: "gqa",
  alt: "Three diagrams, each with 8 query heads on top. Multi-head attention gives each query head its own key-value head, 8 in all. Grouped-query attention has 2 key-value heads, each shared by 4 query heads. Multi-query attention has 1 key-value head shared by all 8. Fewer key-value heads means less to store in the cache.",
  render() {
    const variants = [
      { name: "Multi-head", kv: 8, cache: "8 K/V sets: full cache" },
      { name: "Grouped-query (GQA)", kv: 2, cache: "2 K/V sets: 1/4 of the cache" },
      { name: "Multi-query (MQA)", kv: 1, cache: "1 K/V set: 1/8 of the cache" },
    ];
    const pw = 270;
    const gap = 30;
    const qY = 44;
    const kvY = 170;
    let b = "";
    variants.forEach((v, p) => {
      const x0 = 24 + p * (pw + gap);
      b += text(x0 + pw / 2, 8, v.name, { anchor: "middle", size: 14.5, weight: 600 });
      const qw = 24;
      const qStep = (pw - qw) / 7;
      const qx = (i: number) => x0 + i * qStep + qw / 2;
      const kvStep = pw / v.kv;
      const kvx = (j: number) => x0 + kvStep * j + kvStep / 2;
      const group = 8 / v.kv;
      for (let i = 0; i < 8; i++) {
        const j = Math.floor(i / group);
        b += line(qx(i), qY + 24, kvx(j), kvY, { tone: "muted", sw: 1.2 });
      }
      for (let i = 0; i < 8; i++) b += box(qx(i) - qw / 2, qY, qw, 24, "Q", { tone: "blue", size: 12, r: 4 });
      const kw = v.kv === 8 ? 28 : 64;
      for (let j = 0; j < v.kv; j++) b += box(kvx(j) - kw / 2, kvY, kw, 28, v.kv === 8 ? "KV" : "K V", { tone: "orange", size: 12, r: 4, weight: 600 });
      b += text(x0 + pw / 2, qY - 10, "8 query heads", { anchor: "middle", size: 12, tone: "muted" });
      b += text(x0 + pw / 2, kvY + 48, v.cache, { anchor: "middle", size: 13, weight: 600, tone: "orange" });
    });
    return svg(
      {
        width: 24 * 2 + 3 * pw + 2 * gap,
        height: kvY + 72,
        title: "Fewer key-value heads, smaller cache",
        credit: "Illustrative example with 8 query heads. Cache size relative to multi-head. GQA from Ainslie et al. (Google, 2023).",
        desc: sharing.alt,
      },
      `<g transform="translate(0 14)">${b}</g>`,
    );
  },
};

export default [recompute, memory, sharing];
