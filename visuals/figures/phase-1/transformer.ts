import { arrow, box, circle, line, path, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Sizes are GPT-2 small's, from nodes/phase-1/transformer.md and
// sources/poloclub-transformer-explainer.md: vocabulary 50,257, vectors of 768,
// 12 blocks, MLP 768 -> 3,072 -> 768. The prompt is the Transformer Explainer's.
const WORDS = ["Data", "visualization", "empowers", "users", "to"];

const plus = (x: number, y: number, tone: Tone = "ink") =>
  circle(x, y, 9, { tone: "grey", fill: "soft", stroke: true }) +
  line(x - 5, y, x + 5, y, { tone, sw: 2 }) +
  line(x, y - 5, x, y + 5, { tone, sw: 2 });

const pipeline: Figure = {
  slug: "pipeline",
  alt: "GPT-2 small from left to right. The prompt Data visualization empowers users to is split into tokens, each token becomes a vector of 768 numbers, all vectors go through 12 blocks of attention then MLP, only the last token's vector goes on to become 50,257 probabilities, one token is picked and appended to the text, and the loop starts again.",
  render() {
    const rowH = 40;
    const top = 62;
    const rows = WORDS.length;
    const mid = (i: number) => top + i * rowH + rowH / 2;
    const stackH = rows * rowH;
    let b = "";

    // Stage headers
    const heads: [number, string, string][] = [
      [85, "1. Tokens", "one box per word here"],
      [220, "2. Embeddings", "768 numbers each"],
      [404, "3. The stack", "12 blocks, same shape"],
      [735, "4. Scores", "50,257 probabilities"],
      [916, "5. Pick one", "append, run again"],
    ];
    for (const [x, h, sub] of heads) {
      b += text(x, 14, h, { anchor: "middle", size: 14, weight: 600 });
      b += text(x, 32, sub, { anchor: "middle", size: 12, tone: "muted" });
    }

    // 1. tokens
    WORDS.forEach((w, i) => {
      b += box(30, mid(i) - 14, 110, 28, w, { tone: "grey", size: 13 });
      b += arrow(144, mid(i), 196, mid(i), { tone: "muted", sw: 1.2 });
      // 2. vectors: a horizontal strip
      b += hvec(200, mid(i) - 8, 40, i === rows - 1 ? "blue" : "grey");
      b += arrow(244, mid(i), 296, mid(i), { tone: "muted", sw: 1.2 });
    });

    // 3. blocks
    const bx1 = 290;
    const bw = 88;
    b += box(bx1, top, bw, stackH, ["block 1", "", "attention", "↓", "MLP"], { tone: "purple", size: 13 });
    for (let k = 0; k < 3; k++) b += circle(bx1 + bw + 20 + k * 10, top + stackH / 2, 2.5, { tone: "muted" });
    const bx2 = bx1 + bw + 52;
    const lastX = bx2 + bw;
    b += box(bx2, top, bw, stackH, ["block 12", "", "attention", "↓", "MLP"], { tone: "purple", size: 13 });

    // Only the last row continues
    for (let i = 0; i < rows - 1; i++) b += line(bx2 + bw, mid(i), bx2 + bw + 14, mid(i), { tone: "grey", sw: 1.2, dash: true });
    const ly = mid(rows - 1);
    b += arrow(bx2 + bw, ly, bx2 + bw + 40, ly, { tone: "blue", sw: 2 });
    b += hvec(bx2 + bw + 44, ly - 8, 40, "blue");
    b += text(bx2 + bw + 64, ly + 24, "last token only", { anchor: "middle", size: 12, tone: "blue" });
    b += arrow(bx2 + bw + 88, ly, bx2 + bw + 110, ly, { tone: "blue", sw: 2 });

    // 4. probability bars (shape only)
    const cx0 = 650;
    const cw = 170;
    const cBase = top + stackH;
    const heights = [0.9, 0.25, 0.55, 0.15, 0.1, 0.35, 0.08, 0.05, 0.2, 0.06, 0.12, 0.04, 0.07, 0.03, 0.05, 0.02];
    b += line(cx0, cBase, cx0 + cw, cBase, { tone: "axis" });
    heights.forEach((h, k) => {
      const bwid = cw / heights.length - 3;
      const x = cx0 + k * (cw / heights.length) + 1.5;
      b += rect(x, cBase - h * (stackH - 30), bwid, h * (stackH - 30), { tone: k === 0 ? "orange" : "grey", fill: "solid", stroke: false, r: 1 });
    });
    b += text(cx0 + cw / 2, cBase + 18, "one bar per vocabulary token", { anchor: "middle", size: 12, tone: "muted" });
    b += text(cx0 + cw / 2, cBase + 34, "(illustrative shape, not data)", { anchor: "middle", size: 11.5, tone: "muted", italic: true });

    // 5. chosen token
    b += arrow(cx0 + cw + 12, top + stackH / 2, cx0 + cw + 50, top + stackH / 2, { tone: "orange", sw: 2 });
    b += box(866, top + stackH / 2 - 18, 100, 36, "next token", { tone: "orange", size: 13, weight: 600 });

    // Loop back
    const by = top + stackH + 62;
    b += path(`M916,${top + stackH / 2 + 18} L916,${by} L85,${by} L85,${mid(rows - 1) + 18}`, { tone: "orange", sw: 1.8, dash: true, arrow: true });
    b += text(500, by - 8, "appended to the text; the whole trip runs again", { anchor: "middle", size: 12.5, tone: "orange" });

    return svg(
      {
        width: 990,
        height: by + 12,
        title: "One trip through GPT-2 small: text in, one next token out",
        credit: "Sizes from GPT-2 small (2019). Adapted from the Transformer Explainer (Cho et al., Georgia Tech, 2024).",
        desc: pipeline.alt,
      },
      b,
    );
  },
};

/** Horizontal vector strip. */
function hvec(x: number, y: number, w: number, tone: Tone, cells = 6) {
  let s = rect(x, y, w, 16, { tone, fill: "soft", r: 2, sw: 1.2 });
  for (let i = 1; i < cells; i++) s += line(x + (i * w) / cells, y, x + (i * w) / cells, y + 16, { tone, sw: 0.8 });
  return s;
}

const block: Figure = {
  slug: "block",
  alt: "One transformer block drawn as a column per token. In the attention band, arrows run from earlier tokens to later ones, never backward. In the MLP band above it, each column has its own identical box and nothing crosses between columns.",
  render() {
    const cols = WORDS.length;
    const colW = 150;
    const x0 = 120;
    const cx = (i: number) => x0 + i * colW + colW / 2;
    const yBottom = 330;
    const attY = 170; // attention band top
    const attH = 128;
    const mlpY = 60;
    const mlpH = 64;
    const xEnd = x0 + cols * colW;
    let b = "";

    // Bands
    b += rect(x0 - 10, attY, cols * colW + 20, attH, { tone: "blue", fill: "soft", stroke: false, r: 10 });
    b += rect(x0 - 10, mlpY, cols * colW + 20, mlpH, { tone: "green", fill: "soft", stroke: false, r: 10 });
    b += text(x0 - 22, attY + attH / 2 - 9, "attention", { anchor: "end", size: 14, weight: 600, tone: "blue", baseline: "middle" });
    b += text(x0 - 22, attY + attH / 2 + 9, "across tokens", { anchor: "end", size: 12, tone: "blue", baseline: "middle" });
    b += text(x0 - 22, mlpY + mlpH / 2 - 9, "MLP", { anchor: "end", size: 14, weight: 600, tone: "green", baseline: "middle" });
    b += text(x0 - 22, mlpY + mlpH / 2 + 9, "each token alone", { anchor: "end", size: 12, tone: "green", baseline: "middle" });

    // Token columns
    for (let i = 0; i < cols; i++) {
      b += line(cx(i), yBottom - 8, cx(i), 18, { tone: "grey", sw: 2 });
      b += text(cx(i), yBottom + 10, WORDS[i]!, { anchor: "middle", size: 13, baseline: "hanging" });
      b += box(cx(i) - 40, mlpY + 14, 80, mlpH - 28, "MLP", { tone: "green", size: 12.5, weight: 600 });
    }

    // Attention arcs: every earlier token feeds every later one
    const pairs: [number, number][] = [];
    for (let j = 1; j < cols; j++) for (let i = 0; i < j; i++) pairs.push([i, j]);
    for (const [i, j] of pairs) {
      const d = j - i;
      const baseY = attY + attH - 14;
      const peak = baseY - 14 - d * 20;
      const x1 = cx(i) + 4;
      const x2 = cx(j) - 4;
      const tone: Tone = j === 3 ? "blue" : "grey";
      b += path(`M${x1},${baseY} C${x1 + 20},${peak} ${x2 - 20},${peak} ${x2},${baseY - 2}`, { tone, sw: j === 3 ? 2 : 1.2, arrow: true });
    }

    // Up arrow at top
    b += text(xEnd + 16, 24, "to the next block", { size: 12, tone: "muted", baseline: "middle" });
    b += text(xEnd + 16, yBottom - 4, "from the block below", { size: 12, tone: "muted", baseline: "middle" });

    return svg(
      {
        width: xEnd + 160,
        height: yBottom + 34,
        title: "Attention works across tokens. The MLP works on each token alone.",
        credit: "Arrows into “users” in blue. Arrows only go left to right: a token sees earlier tokens, never later ones.",
        desc: block.alt,
      },
      b,
    );
  },
};

const stream: Figure = {
  slug: "running-vector",
  alt: "Four tokens, a fluffy blue creature, each drawn as a vertical line running from embedding at the bottom to scores at the top. Along each line, attention and MLP boxes read from the line and add their result back with a plus sign. Attention boxes also take arrows from earlier tokens' lines; MLP boxes don't.",
  render() {
    const words = ["a", "fluffy", "blue", "creature"];
    const colW = 200;
    const x0 = 70;
    const lx = (i: number) => x0 + i * colW + 20;
    const yBot = 526;
    const yTop = 60;
    const steps: { kind: "attention" | "MLP"; y: number }[] = [
      { kind: "attention", y: 458 },
      { kind: "MLP", y: 358 },
      { kind: "attention", y: 236 },
      { kind: "MLP", y: 136 },
    ];
    let b = "";

    // Layer labels on the far right
    const xEnd = lx(words.length - 1) + 170;
    b += text(xEnd, 411, "block 1", { size: 12.5, tone: "muted", anchor: "end" });
    b += text(xEnd, 191, "block 2", { size: 12.5, tone: "muted", anchor: "end" });
    b += line(x0 - 20, 287, xEnd, 287, { tone: "grid", sw: 1, dash: true });

    b += text(24, 12, "Dashed arrows: what creature's attention reads from earlier tokens.", { size: 12.5, tone: "muted" });
    b += text(24, 30, "Every token's attention does the same; only creature's is drawn.", { size: 12.5, tone: "muted" });
    words.forEach((w, i) => {
      const x = lx(i);
      const main = i === words.length - 1;
      b += arrow(x, yBot, x, main ? yTop - 14 : yTop + 6, { tone: main ? "ink" : "grey", sw: main ? 2.5 : 2 });
      b += box(x - 40, yBot + 6, 80, 26, "embedding", { tone: "grey", size: 12 });
      b += text(x, yBot + 50, w, { anchor: "middle", size: 14, weight: 600, tone: main ? "orange" : "ink" });
      if (main) b += box(x - 34, yTop - 40, 68, 26, "scores", { tone: "orange", size: 12 });

      for (const s of steps) {
        const tone: Tone = s.kind === "attention" ? "blue" : "green";
        const bx = x + 30;
        const bw = 88;
        const byTop = s.y - 44;
        // read from the line
        b += path(`M${x},${s.y} L${bx},${s.y}`, { tone, sw: 1.5, arrow: true });
        b += box(bx, byTop, bw, 56, s.kind, { tone, size: 12.5, weight: 600 });
        // add back into the line
        b += path(`M${bx + bw / 2},${byTop} L${bx + bw / 2},${byTop - 16} L${x + 12},${byTop - 16}`, { tone, sw: 1.5, arrow: true });
        b += plus(x, byTop - 16, tone);
      }
    });

    // Cross-token reads into creature's attention boxes
    const last = words.length - 1;
    for (const s of steps.filter((t) => t.kind === "attention")) {
      for (let i = 0; i < last; i++) {
        const y0 = s.y + 42 - i * 10;
        const tx = lx(last) + 30 + 22 + i * 22;
        b += circle(lx(i), y0, 3, { tone: "blue" });
        b += path(`M${lx(i)},${y0} L${tx},${y0} L${tx},${s.y + 14}`, { tone: "blue", sw: 1.3, dash: true, arrow: true });
      }
    }


    return svg(
      {
        width: xEnd + 24,
        height: yBot + 56,
        title: "Each token is one running vector that every part adds to",
        credit: "Idea adapted from Elhage et al., “A Mathematical Framework for Transformer Circuits” (Anthropic, 2021).",
        desc: stream.alt,
      },
      b,
    );
  },
};

export default [pipeline, block, stream];
