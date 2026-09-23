import { columns } from "../../lib/chart.ts";
import { box, line, path, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Tree numbers: nodes/phase-1/sampling.md and sources/huggingface-how-to-generate.md
// (nice 0.5, dog 0.4, car 0.1; woman 0.4 after "nice", has 0.9 after "dog").
// Bar numbers: Holtzman et al. Table 1, in sources/holtzman-neural-text-degeneration.md.

const BW = 92, BH = 34;

function edge(x1: number, y1: number, x2: number, y2: number, label: string, o: { tone: Tone; sw?: number; dash?: boolean; above?: boolean }) {
  // Straight edge from the right side of one box to the left side of the next.
  let s = path(`M${x1},${y1} L${x2},${y2}`, { tone: o.tone, sw: o.sw ?? 1.5, dash: o.dash, arrow: true });
  if (label) {
    const mx = x1 + (x2 - x1) * 0.5;
    const my = y1 + (y2 - y1) * 0.5;
    const w = label.length * 8 + 12;
    s += `<rect x="${mx - w / 2}" y="${my - 11}" width="${w}" height="22" rx="4" class="bg"/>`;
    s += text(mx, my, label, { anchor: "middle", baseline: "middle", size: 13, weight: 600, tone: o.tone === "grey" ? "muted" : o.tone });
  }
  return s;
}

const tree: Figure = {
  slug: "tree",
  alt: "A probability tree. After \"The\", the model gives nice 0.5, dog 0.4 and car 0.1. After \"nice\" the best word is woman at 0.4; after \"dog\" it is has at 0.9. Greedy follows The, nice, woman for a total of 0.2. The path The, dog, has totals 0.36 but greedy never sees it. A dashed path shows random sampling sometimes picking car.",
  render() {
    const x0 = 30, x1 = 250, x2 = 490, xr = 612;
    const yRoot = 165;
    const yNice = 55, yDog = 175, yCar = 290;
    const kids = { woman: yNice - 32, niceOther: yNice + 32, has: yDog - 32, dogOther: yDog + 32, carNext: yCar };
    let b = "";
    // edges level 1
    b += edge(x0 + BW, yRoot, x1, yNice, "0.5", { tone: "orange", sw: 2.5 });
    b += edge(x0 + BW, yRoot, x1, yDog, "0.4", { tone: "blue", sw: 2.5 });
    b += edge(x0 + BW, yRoot, x1, yCar, "0.1", { tone: "purple", sw: 2, dash: true });
    // edges level 2
    b += edge(x1 + BW, yNice, x2, kids.woman, "0.4", { tone: "orange", sw: 2.5 });
    b += edge(x1 + BW, yNice, x2, kids.niceOther, "", { tone: "grey" });
    b += edge(x1 + BW, yDog, x2, kids.has, "0.9", { tone: "blue", sw: 2.5 });
    b += edge(x1 + BW, yDog, x2, kids.dogOther, "", { tone: "grey" });
    b += edge(x1 + BW, yCar, x2, kids.carNext, "", { tone: "purple", sw: 2, dash: true });
    // nodes
    const node = (x: number, y: number, s: string, tone: Tone, fill: "soft" | "none" = "soft", dash = false) =>
      box(x, y - BH / 2, BW, BH, s, { tone, fill, size: 15, weight: 600, dash });
    b += node(x0, yRoot, "The", "grey");
    b += node(x1, yNice, "nice", "orange");
    b += node(x1, yDog, "dog", "blue");
    b += node(x1, yCar, "car", "purple", "soft", true);
    b += node(x2, kids.woman, "woman", "orange");
    b += box(x2, kids.niceOther - BH / 2, BW, BH, "other words", { tone: "grey", fill: "none", size: 12.5, textTone: "muted" });
    b += node(x2, kids.has, "has", "blue");
    b += box(x2, kids.dogOther - BH / 2, BW, BH, "other words", { tone: "grey", fill: "none", size: 12.5, textTone: "muted" });
    b += box(x2, kids.carNext - BH / 2, BW, BH, "…", { tone: "purple", fill: "none", size: 15, dash: true, textTone: "purple" });
    // path totals
    const note = (y: number, head: string, sub: string, tone: Tone) =>
      text(xr, y - 7, head, { size: 14, weight: 600, tone }) + text(xr, y + 12, sub, { size: 13, tone: "muted" });
    b += note(kids.woman, "Greedy: The nice woman", "0.5 × 0.4 = 0.20", "orange");
    b += note(kids.has, "Better: The dog has", "0.4 × 0.9 = 0.36, greedy never sees it", "blue");
    b += note(kids.carNext, "Sampling: sometimes The car …", "a weighted die picks car 1 time in 10", "purple");
    return svg(
      {
        width: 900,
        height: 330,
        title: "Greedy takes the top word at each step and misses a better sentence",
        credit: "Adapted from the probability tree in Hugging Face's \"How to generate text\" (von Platen, 2020). Toy probabilities.",
        desc: tree.alt,
      },
      b,
    );
  },
};

const METHODS = ["Greedy", "Beam", "Pure", "Top-p", "Human"] as const;
const REPEAT = [73.66, 28.94, 0.22, 0.36, 0.28];
const PPL = [1.5, 1.48, 22.73, 13.13, 12.38];

const table: Figure = {
  slug: "holtzman-table",
  alt: "Two bar charts from Holtzman et al. on GPT-2 Large. Share of passages stuck repeating: greedy 73.66%, beam search 28.94%, pure sampling 0.22%, top-p 0.36%, human text 0.28%. Perplexity: greedy 1.50, beam 1.48, pure sampling 22.73, top-p 13.13, against human text at 12.38. Only top-p lands near the human value on both.",
  render() {
    const pw = 360, ph = 210, top = 58, gap = 100, left = 70;
    const tone = (i: number): Tone => (METHODS[i] === "Human" ? "green" : METHODS[i] === "Top-p" ? "blue" : "grey");
    let b = "";
    // left: repetition
    b += text(left + pw / 2, 14, "Passages stuck repeating", { anchor: "middle", size: 14.5, weight: 600 });
    b += text(left + pw / 2, 34, "lower is better, down to the human level", { anchor: "middle", size: 12.5, tone: "muted" });
    b += columns(
      { x: left, y: top, w: pw, h: ph },
      METHODS.map((m, i) => ({ label: m, value: REPEAT[i]!, valueLabel: `${REPEAT[i]!.toFixed(2)}%`, tone: tone(i) })),
      { max: 80, ticks: [0, 20, 40, 60, 80], tickFormat: (n) => `${n}%`, padding: 0.3 },
    ).svg;
    // right: perplexity
    const rx = left + pw + gap;
    b += text(rx + pw / 2, 14, "How surprising the text is (perplexity)", { anchor: "middle", size: 14.5, weight: 600 });
    b += text(rx + pw / 2, 34, "closest to the dashed human line is best", { anchor: "middle", size: 12.5, tone: "muted" });
    const c = columns(
      { x: rx, y: top, w: pw, h: ph },
      METHODS.map((m, i) => ({ label: m, value: PPL[i]!, valueLabel: PPL[i]!.toFixed(2), tone: tone(i) })),
      { max: 25, ticks: [0, 5, 10, 15, 20, 25], padding: 0.3 },
    );
    b += c.svg;
    const hy = c.y(12.38);
    b += line(rx, hy, rx + pw, hy, { tone: "green", dash: true, sw: 1.5 });
    b += text(rx + pw + 6, hy, "human", { baseline: "middle", size: 12, tone: "green", weight: 600 });
    // method key
    b += text(left, top + ph + 48, "Beam = beam search with 16 beams. Pure = sampling from the full list. Top-p = sampling from the smallest set covering 95% of the probability.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: 2 * left + 2 * pw + gap,
        height: top + ph + 58,
        title: "Too predictable, too random, or close to human: 5,000 GPT-2 Large passages",
        credit: "Data: Holtzman et al., \"The Curious Case of Neural Text Degeneration\" (2020), Table 1. GPT-2 Large, 2019.",
        desc: table.alt,
      },
      b,
    );
  },
};

export default [tree, table];
