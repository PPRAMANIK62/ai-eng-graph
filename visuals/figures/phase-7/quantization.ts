import { barsH, scaleBand, scaleLinear, yAxis } from "../../lib/chart.ts";
import { line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Mechanism: round-to-nearest over a block with one scale, as in Q4_0
// ("Each block has 32 weights. Weight formula: w = q * block_scale",
// sources/hf-gguf-quant-types.md) and RTN in sources/huang-llama3-quantization.md.
// The eight weights are made-up example values, not from a real model; the
// integers and rebuilt values are computed from them below. Outlier problem:
// sources/dettmers-llm-int8.md.
const BLOCK = [0.021, -0.118, 0.074, -0.035, 0.052, 0.009, -0.087, 0.11];
const OUTLIER = [0.021, -0.118, 0.074, -0.035, 1.2, 0.009, -0.087, 0.11];

function quantize(ws: number[]) {
  const maxAbs = Math.max(...ws.map(Math.abs));
  // Symmetric 4-bit: integers −8 … 7. Scale so the largest magnitude maps to ±7.
  const scale = maxAbs / 7;
  const q = ws.map((w) => Math.max(-8, Math.min(7, Math.round(w / scale))));
  return { scale, q, back: q.map((v) => v * scale) };
}

const f3 = (n: number) => (n < 0 ? "−" : "") + Math.abs(n).toFixed(3);

function blockTable(x0: number, y0: number, ws: number[], title: string, sub: string, highlight?: number) {
  const { scale, q, back } = quantize(ws);
  const cw = 86;
  const lw = 118;
  let b = "";
  b += text(x0, y0, title, { size: 14, weight: 700 });
  b += text(x0, y0 + 20, sub, { size: 12.5, tone: "muted" });
  const rows: { label: string; vals: string[]; tone: Tone }[] = [
    { label: "16-bit weight", vals: ws.map(f3), tone: "ink" },
    { label: "÷ scale, round", vals: q.map((v) => (v < 0 ? "−" : "") + Math.abs(v)), tone: "blue" },
    { label: "× scale again", vals: back.map(f3), tone: "orange" },
  ];
  rows.forEach((r, ri) => {
    const ry = y0 + 40 + ri * 36;
    b += text(x0 + lw - 10, ry + 14, r.label, { anchor: "end", size: 12.5, tone: "muted", baseline: "middle" });
    r.vals.forEach((v, i) => {
      const cx = x0 + lw + i * cw;
      const hot = highlight === i;
      b += rect(cx, ry, cw - 6, 28, { tone: hot ? "red" : r.tone === "ink" ? "grey" : (r.tone as Tone), fill: "soft", stroke: hot, r: 4 });
      b += text(cx + (cw - 6) / 2, ry + 14, v, { anchor: "middle", baseline: "middle", size: 12.5, mono: true, tone: r.tone });
    });
  });
  const collapsed = q.filter((v) => v === 0).length;
  b += text(x0 + lw, y0 + 40 + 3 * 36 + 10, `scale = ${f3(scale)}  ·  4-bit integers from −8 to 7${highlight !== undefined ? `  ·  ${collapsed} of 8 weights rounded to 0` : ""}`, {
    size: 12.5,
    tone: highlight !== undefined ? "red" : "muted",
  });
  return b;
}

const rounding: Figure = {
  slug: "rounding",
  alt: "Diagram of round-to-nearest quantization on one block of eight example weights. The weights, such as 0.021, −0.118 and 0.074, are divided by a single block scale and rounded to the nearest of 16 levels, giving small integers from −8 to 7. To use them, each integer is multiplied back by the scale. The rebuilt values are close to the originals but not equal; the difference is the rounding error. A second row shows the same block with one large outlier weight: the scale stretches to fit it, and the other weights collapse onto just a few levels, so their error grows.",
  render() {
    let b = "";
    b += blockTable(20, 10, BLOCK, "One block, one scale", "Each weight becomes a 4-bit integer. Multiplying back gives a close, not exact, value.");
    b += line(20, 200, 830, 200, { tone: "grid", sw: 1 });
    b += blockTable(20, 222, OUTLIER, "Same block with one outlier", "The outlier stretches the scale, and the ordinary weights lose almost all their precision.", 4);
    return svg(
      {
        width: 850,
        height: 400,
        title: "Quantizing a block of weights by rounding",
        credit: "Illustrative weights, computed with symmetric 4-bit round-to-nearest. Real formats use bigger blocks: 32 weights in Q4_0.",
        desc: rounding.alt,
      },
      b,
    );
  },
};

// sources/ggml-llama-cpp-quantize.md, Llama-3.1-8B table: size (GiB) and text
// generation t/s @ 128. Prompt processing range for the four quantized types
// shown: 784.45 (Q2_K) to 865.09 (Q8_0); F16 923.49.
const TYPES = [
  { label: "F16", size: 14.96, tg: 29.17, bits: "16.0" },
  { label: "Q8_0", size: 7.95, tg: 50.93, bits: "8.5" },
  { label: "Q6_K", size: 6.14, tg: 58.67, bits: "6.6" },
  { label: "Q4_K_M", size: 4.58, tg: 71.93, bits: "4.9" },
  { label: "Q2_K", size: 2.95, tg: 79.85, bits: "3.2" },
];

const sizeSpeed: Figure = {
  slug: "size-speed",
  alt: "Two bar charts for Llama 3.1 8B in llama.cpp at five quantization levels. File size: F16 14.96 GiB, Q8_0 7.95, Q6_K 6.14, Q4_K_M 4.58, Q2_K 2.95. Text generation speed: F16 29 tokens per second, Q8_0 51, Q6_K 59, Q4_K_M 72, Q2_K 80. Prompt processing barely changes, from 923 tokens per second at F16 to between 784 and 865 for the quantized types.",
  render() {
    let b = "";
    b += text(20, 8, "File size (GiB)", { size: 14, weight: 700 });
    b += text(20, 28, "bits per weight in brackets", { size: 12.5, tone: "muted" });
    b += barsH(
      { x: 20, y: 44, w: 400, h: 200 },
      TYPES.map((t) => ({ label: `${t.label} (${t.bits})`, value: t.size, tone: "blue" as Tone, valueLabel: t.size.toFixed(2) })),
      { labelWidth: 120, max: 16 },
    ).svg;
    b += text(470, 8, "Text generation (tokens/s)", { size: 14, weight: 700 });
    b += text(470, 28, "one token at a time", { size: 12.5, tone: "muted" });
    b += barsH(
      { x: 470, y: 44, w: 380, h: 200 },
      TYPES.map((t) => ({ label: t.label, value: t.tg, tone: "green" as Tone, valueLabel: String(Math.round(t.tg)) })),
      { labelWidth: 80, max: 85 },
    ).svg;
    b += line(20, 262, 850, 262, { tone: "grid", sw: 1 });
    b += text(20, 284, "Prompt processing barely moves: 923 tokens/s at F16, 784 to 865 for the quantized types.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: 870,
        height: 296,
        title: "Fewer bits: a smaller file and faster decode",
        credit: "Data: llama.cpp quantize README, Llama 3.1 8B (hardware not stated).",
        desc: sizeSpeed.alt,
      },
      b,
    );
  },
};

// sources/huang-llama3-quantization.md, Table 1: LLaMA3-8B WikiText2 perplexity,
// weights only, group size 128.
const GROUPS: { bits: string; bars: { m: string; v: number }[] }[] = [
  { bits: "16-bit", bars: [{ m: "original", v: 6.1 }] },
  { bits: "4-bit", bars: [{ m: "RTN", v: 8.5 }, { m: "GPTQ", v: 6.5 }, { m: "AWQ", v: 6.6 }] },
  { bits: "3-bit", bars: [{ m: "RTN", v: 27.9 }, { m: "GPTQ", v: 8.2 }, { m: "AWQ", v: 8.2 }] },
];
const TONE: Record<string, Tone> = { original: "grey", RTN: "red", GPTQ: "blue", AWQ: "purple" };

const perplexity: Figure = {
  slug: "perplexity",
  alt: "Grouped bar chart of WikiText2 perplexity for LLaMA3-8B, lower is better. The 16-bit model scores 6.1. At 4 bits: round-to-nearest 8.5, GPTQ 6.5, AWQ 6.6. At 3 bits: round-to-nearest 27.9, GPTQ 8.2, AWQ 8.2. At 2 bits all three are far off the chart: round-to-nearest about 1,900, GPTQ about 210, AWQ about 1.7 million.",
  render() {
    const p = { x: 70, y: 20, w: 660, h: 260 };
    const y = scaleLinear().domain([0, 30]).range([p.y + p.h, p.y]);
    const gx = scaleBand<string>().domain([...GROUPS.map((g) => g.bits), "2-bit"]).range([p.x, p.x + p.w]).padding(0.18);
    let b = yAxis(p, y, [0, 5, 10, 15, 20, 25, 30], String, "perplexity (lower is better)");
    // baseline
    b += line(p.x, y(6.1), p.x + p.w, y(6.1), { tone: "grey", dash: true, sw: 1.2 });
    b += text(p.x + p.w + 6, y(6.1), "16-bit: 6.1", { size: 12, tone: "muted", baseline: "middle" });
    for (const g of GROUPS) {
      const gw = gx.bandwidth();
      const bw = Math.min(46, gw / 3 - 6);
      const total = g.bars.length * bw + (g.bars.length - 1) * 6;
      let bx = gx(g.bits)! + (gw - total) / 2;
      for (const bar of g.bars) {
        const tone = TONE[bar.m];
        b += rect(bx, y(bar.v), bw, p.y + p.h - y(bar.v), { tone, fill: "solid", stroke: false, r: 2 });
        b += text(bx + bw / 2, y(bar.v) - 6, String(bar.v), { anchor: "middle", size: 12.5, weight: 600, tone });
        b += text(bx + bw / 2, p.y + p.h + 16, bar.m, { anchor: "middle", size: 11.5, tone: "muted" });
        bx += bw + 6;
      }
      b += text(gx(g.bits)! + gw / 2, p.y + p.h + 38, g.bits, { anchor: "middle", size: 13, weight: 700 });
    }
    // 2-bit: off the chart
    const x2 = gx("2-bit")!;
    const w2 = gx.bandwidth();
    b += rect(x2 - 10, p.y + 40, w2 + 20, 112, { tone: "red", fill: "soft", dash: true, r: 4 });
    b += text(x2 + w2 / 2, p.y + 62, "off the chart", { anchor: "middle", size: 12.5, weight: 700, tone: "red" });
    b += text(x2 + w2 / 2, p.y + 86, "RTN ≈ 1,900", { anchor: "middle", size: 11.5, tone: "red" });
    b += text(x2 + w2 / 2, p.y + 106, "GPTQ ≈ 210", { anchor: "middle", size: 11.5, tone: "red" });
    b += text(x2 + w2 / 2, p.y + 126, "AWQ ≈ 1.7 million", { anchor: "middle", size: 11.5, tone: "red" });
    b += text(x2 + w2 / 2, p.y + p.h + 38, "2-bit", { anchor: "middle", size: 13, weight: 700 });
    b += line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, { tone: "axis" });
    return svg(
      {
        width: p.x + p.w + 90,
        height: p.y + p.h + 50,
        title: "At 4 bits the method matters a little; at 3 bits it matters a lot",
        credit: "Data: Huang et al. (2024), Table 1. LLaMA3-8B, WikiText2, weights only, groups of 128. RTN = plain round-to-nearest.",
        desc: perplexity.alt,
      },
      b,
    );
  },
};

export default [rounding, sizeSpeed, perplexity];
