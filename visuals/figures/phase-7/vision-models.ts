import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Pipeline: patches -> linear embedding + position (sources/dosovitskiy-vit.md, Figure 1),
// encoder -> projection W -> visual tokens next to text tokens -> LLM (sources/liu-llava.md,
// section 4.1). 1000x1000 at 28 px = 36 x 36 = 1,296 tokens: sources/anthropic-vision.md.
const pipeline: Figure = {
  slug: "pipeline",
  alt: "The path from an image to an answer. A photo is cut into a grid of square patches. Each patch goes through the vision encoder, a transformer, and comes out as a vector. A projection maps each vector to the size of the LLM's word embeddings, making it a visual token. The visual tokens sit in one sequence with the text tokens of the question, and the LLM reads them all together to write the answer. Example: a 1000×1000 image in 28-pixel patches is 36×36 = 1,296 visual tokens.",
  render() {
    let b = "";
    // 1. Image as a patch grid
    const gx = 24, gy = 40, n = 6, c = 22;
    b += text(gx, 12, "1. Cut into patches", { size: 14, weight: 700, tone: "blue" });
    const tones: Tone[] = ["blue", "orange", "green", "purple"];
    for (let i = 0; i < n; i++)
      for (let j = 0; j < n; j++)
        b += rect(gx + j * c, gy + i * c, c, c, { tone: tones[(i + j) % 4], fill: "soft", r: 0, sw: 1 });
    b += text(gx, gy + n * c + 22, "1000×1000 image,", { size: 12.5, tone: "muted" });
    b += text(gx, gy + n * c + 40, "28-px patches: 36×36", { size: 12.5, tone: "muted" });
    b += text(gx, gy + n * c + 58, "= 1,296 patches", { size: 12.5, tone: "muted" });

    // 2. Encoder
    const ex = 200;
    b += arrow(gx + n * c + 8, gy + (n * c) / 2, ex - 6, gy + (n * c) / 2, { tone: "muted" });
    b += text(ex, 12, "2. Vision encoder", { size: 14, weight: 700, tone: "orange" });
    b += box(ex, gy + 6, 150, 120, ["flatten + linear", "layer, add", "position, then a", "transformer"], { tone: "orange", size: 12.5 });
    b += text(ex, gy + 150, "one vector per patch", { size: 12.5, tone: "muted" });

    // 3. Projection
    const px = 400;
    b += arrow(ex + 150 + 6, gy + 66, px - 6, gy + 66, { tone: "muted" });
    b += text(px, 12, "3. Projection", { size: 14, weight: 700, tone: "purple" });
    b += box(px, gy + 36, 120, 60, ["maps to word-", "embedding size"], { tone: "purple", size: 12.5 });

    // 4. Sequence into the LLM
    const sx = 570;
    b += arrow(px + 120 + 6, gy + 66, sx - 6, gy + 66, { tone: "muted" });
    b += text(sx, 12, "4. One sequence into the LLM", { size: 14, weight: 700, tone: "green" });
    const tw = 26;
    for (let k = 0; k < 5; k++) b += rect(sx + k * (tw + 4), gy + 50, tw, 32, { tone: "purple", fill: "soft", r: 3, sw: 1.2 });
    b += text(sx + 5 * (tw + 4) + 2, gy + 66, "…", { size: 14, baseline: "middle", tone: "muted" });
    const tx = sx + 5 * (tw + 4) + 20;
    for (const [k, w] of ["What's", "in", "this?"].entries()) {
      const wx = tx + [0, 58, 90][k]!;
      b += box(wx, gy + 50, [54, 28, 46][k]!, 32, w, { tone: "grey", size: 12 });
    }
    b += text(sx, gy + 104, "visual tokens", { size: 12.5, tone: "purple" });
    b += text(tx, gy + 104, "text tokens", { size: 12.5, tone: "muted" });
    b += arrow(sx + 150, gy + 116, sx + 150, gy + 142, { tone: "muted" });
    b += box(sx + 60, gy + 146, 180, 36, "LLM writes the answer", { tone: "green", size: 12.5, weight: 600 });

    return svg(
      {
        width: 900,
        height: gy + 200,
        title: "An image becomes tokens the LLM reads next to your text",
        credit: "Mechanism from ViT (Dosovitskiy et al., 2020) and LLaVA (Liu et al., 2023). Patch count from Anthropic's vision docs.",
        desc: pipeline.alt,
      },
      b,
    );
  },
};

// Claude numbers: sources/anthropic-vision.md (table). OpenAI numbers: worked by hand from the
// formulas in sources/openai-images-vision.md, recorded in that note's "My notes".
const GROUPS = [
  {
    name: "1000×1000 photo",
    bars: [
      { label: "Claude (both tiers)", v: 1296, tone: "orange" as Tone },
      { label: "gpt-5.5, detail high", v: 1229, tone: "green" as Tone },
      { label: "gpt-4o, detail high", v: 765, tone: "blue" as Tone },
    ],
  },
  {
    name: "1920×1080 screenshot",
    bars: [
      { label: "Claude, standard tier", v: 1560, tone: "orange" as Tone, note: "shrunk to 1456×819" },
      { label: "Claude, high-res tier", v: 2691, tone: "red" as Tone },
      { label: "gpt-5.5, detail high", v: 2448, tone: "green" as Tone },
      { label: "gpt-4o, detail high", v: 1105, tone: "blue" as Tone },
    ],
  },
];

const costs: Figure = {
  slug: "costs",
  alt: "Grouped bar chart of the input tokens for two images under four counting schemes. A 1000×1000 image: Claude, both tiers, 1,296 tokens; gpt-5.5 at detail high, 1,229; gpt-4o at detail high, 765. A 1920×1080 screenshot: Claude standard tier (shrunk to 1456×819), 1,560; Claude high-resolution tier, 2,691; gpt-5.5 high, 2,448; gpt-4o high, 1,105.",
  render() {
    const LW = 190, x0 = 24 + LW, W = 470;
    const xs = scaleLinear().domain([0, 3000]).range([x0, x0 + W]);
    const BH = 22, GAP = 8;
    let b = "";
    let y = 6;
    for (const t of [0, 1000, 2000, 3000]) {
      b += line(xs(t), 0, xs(t), 290, { tone: "grid", sw: 1 });
      b += text(xs(t), 306, t.toLocaleString("en-US"), { anchor: "middle", size: 11.5, tone: "muted" });
    }
    for (const g of GROUPS) {
      b += text(24, y + 8, g.name, { size: 13.5, weight: 700, baseline: "middle" });
      y += 24;
      for (const bar of g.bars) {
        b += text(x0 - 10, y + BH / 2, bar.label, { anchor: "end", baseline: "middle", size: 12.5 });
        b += rect(x0, y, xs(bar.v) - x0, BH, { tone: bar.tone, fill: "solid", stroke: false, r: 2 });
        const lab = bar.v.toLocaleString("en-US") + ("note" in bar && bar.note ? `  (${bar.note})` : "");
        b += text(xs(bar.v) + 8, y + BH / 2, lab, { baseline: "middle", size: 12.5, weight: 600, tone: bar.tone });
        y += BH + GAP;
      }
      y += 14;
    }
    b += line(x0, 0, x0, 290, { tone: "axis" });
    b += text(x0 + W / 2, 326, "input tokens for one image", { anchor: "middle", size: 12, tone: "muted" });
    return svg(
      {
        width: x0 + W + 170,
        height: 336,
        title: "The same image costs a different number of tokens on each provider",
        credit: "As of 2026-09. Claude: Anthropic vision docs. OpenAI: worked from the formulas in OpenAI's vision docs.",
        desc: costs.alt,
      },
      b,
    );
  },
};

export default [pipeline, costs];
