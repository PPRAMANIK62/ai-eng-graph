import { line, rect, svg, text, wrap, type Figure, type Tone } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// 1. The same made-up document split three ways. Illustrative: the text and
// the cut points are ours, chosen to show how each method places borders.
// ---------------------------------------------------------------------------
type Chunk = { text: string; note?: string; bad?: boolean };
const PANELS: { head: string; sub: string; chunks: Chunk[] }[] = [
  {
    head: "Fixed-size",
    sub: "cut every N tokens",
    chunks: [
      { text: "Q2 results. Revenue grew 3% over the previous", bad: true },
      { text: "quarter. Most of the growth came from the cloud unit. Operating", bad: true },
      { text: "costs were flat, so margins improved. Outlook. The company expects", bad: true },
      { text: "slower growth in Q3 as two large contracts end." },
    ],
  },
  {
    head: "Recursive",
    sub: "paragraphs first, then smaller breaks",
    chunks: [
      { text: "Q2 results. Revenue grew 3% over the previous quarter. Most of the growth came from the cloud unit." },
      { text: "Operating costs were flat, so margins improved. Outlook. The company expects slower growth in Q3 as two large contracts end.", note: "ends on boundaries, but mixes two sections" },
    ],
  },
  {
    head: "Structure-aware",
    sub: "one section per chunk",
    chunks: [
      { text: "Q2 results. Revenue grew 3% over the previous quarter. Most of the growth came from the cloud unit. Operating costs were flat, so margins improved." },
      { text: "Outlook. The company expects slower growth in Q3 as two large contracts end." },
    ],
  },
];
const TONES: Tone[] = ["blue", "orange", "green", "purple"];

const threeWays: Figure = {
  slug: "three-ways",
  alt: "The same short document split three ways. Fixed-size chunks cut every N tokens, so a border falls in the middle of a sentence. Recursive splitting tries paragraph breaks first, then sentence ends, so each chunk ends on a boundary. Structure-aware splitting follows the headings, so each chunk is one section with its heading.",
  render() {
    const PW = 236, G = 22, L = 24, SIZE = 12.5, LH = 17;
    let b = "";
    let maxY = 0;
    PANELS.forEach((p, i) => {
      const x = L + i * (PW + G);
      b += text(x, 10, p.head, { size: 14, weight: 700 });
      b += text(x, 28, p.sub, { size: 12, tone: "muted" });
      let y = 44;
      p.chunks.forEach((c, j) => {
        const ls = wrap(c.text, PW - 20, SIZE);
        const h = ls.length * LH + 14;
        const tone = TONES[j % TONES.length]!;
        b += rect(x, y, PW, h, { tone, fill: "soft", r: 5 });
        ls.forEach((l, k) => (b += text(x + 10, y + 19 + k * LH, l, { size: SIZE })));
        y += h;
        if (c.bad) {
          b += line(x - 4, y + 4, x + PW + 4, y + 4, { tone: "red", dash: true, sw: 1.5 });
          y += 8;
        } else y += 8;
        if (c.note) {
          b += text(x, y + 10, c.note, { size: 12, tone: "muted", italic: true });
          y += 20;
        }
      });
      maxY = Math.max(maxY, y);
    });
    b += line(L, maxY + 10, L + 18, maxY + 10, { tone: "red", dash: true });
    b += text(L + 26, maxY + 14, "border falls mid-sentence", { size: 12, tone: "red" });
    return svg(
      {
        width: L * 2 + PW * 3 + G * 2,
        height: maxY + 24,
        title: "One document, three ways to cut it",
        credit: "Illustrative: made-up text and cut points, not measured data.",
        desc: threeWays.alt,
      },
      b,
    );
  },
};

// ---------------------------------------------------------------------------
// 2. Recall vs IoU. Source: sources/chroma-evaluating-chunking.md, results
// table for text-embedding-3-large (mean over all queries, top 5 chunks).
// ---------------------------------------------------------------------------
const ROWS = [
  { label: "Fixed 800 tokens, 400 overlap", recall: 87.9, iou: 1.4 },
  { label: "Semantic, default settings", recall: 83.6, iou: 1.5 },
  { label: "Recursive 400, no overlap", recall: 89.5, iou: 3.6 },
  { label: "LLM decides the cuts", recall: 91.9, iou: 3.9 },
  { label: "Recursive 200, no overlap", recall: 88.1, iou: 6.9 },
  { label: "Cluster semantic, 200", recall: 87.3, iou: 8.0 },
];

const recallIou: Figure = {
  slug: "recall-vs-iou",
  alt: "Paired bars for six chunking settings, measured with text-embedding-3-large. Recall stays between 84% and 92% for all of them. IoU, the share of retrieved text that is actually answer, ranges from 1.4% for 800-token chunks with 400 overlap up to 6.9% for recursive 200-token chunks with no overlap and 8.0% for a cluster-based semantic chunker.",
  render() {
    const LW = 230, BW = 230, G = 80, RH = 34, TOP = 40;
    const x1 = 24 + LW, x2 = x1 + BW + G;
    let b = "";
    b += text(x1, 12, "Recall: share of the answer retrieved", { size: 13, weight: 600 });
    b += text(x2, 12, "IoU: share of retrieved text that is answer", { size: 13, weight: 600 });
    ROWS.forEach((r, i) => {
      const y = TOP + i * RH;
      const good = r.label.startsWith("Recursive 200");
      b += text(x1 - 12, y + RH / 2 - 2, r.label, { size: 13, anchor: "end", baseline: "middle", weight: good ? 700 : 400 });
      const w1 = (r.recall / 100) * BW;
      b += rect(x1, y + 4, w1, RH - 14, { tone: "blue", fill: "solid", stroke: false, r: 2 });
      b += text(x1 + w1 + 6, y + RH / 2 - 2, `${r.recall.toFixed(1)}%`, { size: 12.5, weight: 600, tone: "blue", baseline: "middle" });
      const w2 = (r.iou / 10) * BW;
      b += rect(x2, y + 4, w2, RH - 14, { tone: "orange", fill: "solid", stroke: false, r: 2 });
      b += text(x2 + w2 + 6, y + RH / 2 - 2, `${r.iou.toFixed(1)}%`, { size: 12.5, weight: 600, tone: "orange", baseline: "middle" });
    });
    const bottom = TOP + ROWS.length * RH;
    b += line(x1, TOP, x1, bottom, { tone: "axis" });
    b += line(x2, TOP, x2, bottom, { tone: "axis" });
    b += text(x1, bottom + 18, "scale 0–100%", { size: 11.5, tone: "muted" });
    b += text(x2, bottom + 18, "scale 0–10%", { size: 11.5, tone: "muted" });
    return svg(
      {
        width: x2 + BW + 70,
        height: bottom + 26,
        title: "Chunking barely moves recall, but changes how much junk comes with it",
        credit: "Data: Smith and Troynikov, Evaluating Chunking Strategies for Retrieval (Chroma, 2024). text-embedding-3-large, top 5 chunks.",
        desc: recallIou.alt,
      },
      b,
    );
  },
};

export default [threeWays, recallIou];
