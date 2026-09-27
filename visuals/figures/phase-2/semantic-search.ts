import { barsH } from "../../lib/chart.ts";
import { arrow, box, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// 1. Scores for one question against nine sentences.
// Source: sources/sbert-semantic-search.md. The corpus and the top-5 scores are
// the docs' printed output; the full nine-score ranking is from our own run of
// the same example (Transformers.js, Xenova/all-MiniLM-L6-v2, 2026-09-27),
// recorded in that note. Scores rounded to three decimals.
// ---------------------------------------------------------------------------
const SCORES: { label: string; value: number; topic: "ml" | "space" | "climate" }[] = [
  { label: "Neural networks are computing systems…", value: 0.5926, topic: "ml" },
  { label: "Deep learning is part of a broader family…", value: 0.5288, topic: "ml" },
  { label: "Machine learning is a field of study…", value: 0.4647, topic: "ml" },
  { label: "Mars rovers are robotic vehicles…", value: 0.1381, topic: "space" },
  { label: "Carbon capture technologies aim to…", value: 0.0912, topic: "climate" },
  { label: "The James Webb Space Telescope is…", value: 0.0729, topic: "space" },
  { label: "Renewable energy sources include…", value: 0.0624, topic: "climate" },
  { label: "Global warming is the long-term heating…", value: 0.0465, topic: "climate" },
  { label: "SpaceX's Starship is designed to be…", value: 0.0196, topic: "space" },
];
const TONE: Record<string, Tone> = { ml: "blue", space: "grey", climate: "grey" };

const scores: Figure = {
  slug: "scores",
  alt: "Bar chart of cosine scores for the question 'How do artificial neural networks work?' against nine sentences. The three machine-learning sentences score highest: neural networks 0.593, deep learning 0.529, machine learning 0.465. The six space and climate sentences all score between 0.02 and 0.14.",
  render() {
    let b = text(24, 12, "Question: “How do artificial neural networks work?”", { size: 14, weight: 600 });
    const chart = barsH(
      { x: 24, y: 32, w: 720, h: 300 },
      SCORES.map((s) => ({ label: s.label, value: s.value, valueLabel: s.value.toFixed(3), tone: TONE[s.topic] })),
      { max: 0.6, labelWidth: 320, size: 12.5, padding: 0.3 },
    );
    b += chart.svg;
    const yM = chart.y(SCORES[3]!.label)! + chart.y.bandwidth() / 2;
    b += text(500, yM, "big drop after the three ML sentences", { size: 12.5, tone: "muted", baseline: "middle" });
    return svg(
      {
        width: 770,
        height: 342,
        title: "Nine sentences, scored against one question",
        credit: "Example from the Sentence Transformers docs, which print the top five. Our re-run (Transformers.js, 2026-09-27) matched them and gave the rest.",
        desc: scores.alt,
      },
      b,
    );
  },
};

// ---------------------------------------------------------------------------
// 2. Index time vs query time. A diagram of the mechanism described in
// sources/sbert-semantic-search.md (Background) and
// sources/anthropic-contextual-retrieval.md (A primer on RAG). No numbers.
// ---------------------------------------------------------------------------
const pipeline: Figure = {
  slug: "pipeline",
  alt: "Two rows. Index time: documents are cut into chunks, each chunk goes through the embedding model, and the vectors are stored. Query time: the question goes through the same embedding model, its vector is scored against every stored vector with cosine similarity, and the top k chunks come back.",
  render() {
    const H = 54, W = 142, G = 36;
    const col = (i: number) => 150 + i * (W + G);
    let b = "";
    // Row labels
    b += text(24, 30 + H / 2, "Index time", { size: 14, weight: 700, baseline: "middle" });
    b += text(24, 30 + H / 2 + 18, "once per document", { size: 12, tone: "muted", baseline: "middle" });
    const qy = 150;
    b += text(24, qy + H / 2, "Query time", { size: 14, weight: 700, baseline: "middle" });
    b += text(24, qy + H / 2 + 18, "every question", { size: 12, tone: "muted", baseline: "middle" });

    const iy = 30;
    const idx = [
      { l: ["Documents"], t: "grey" as Tone },
      { l: ["Cut into", "chunks"], t: "grey" as Tone },
      { l: ["Embedding", "model"], t: "blue" as Tone },
      { l: ["Stored vectors", "+ chunk text"], t: "green" as Tone },
    ];
    idx.forEach((n, i) => {
      b += box(col(i), iy, W, H, n.l, { tone: n.t, size: 13.5 });
      if (i < idx.length - 1) b += arrow(col(i) + W + 4, iy + H / 2, col(i + 1) - 4, iy + H / 2, { tone: "muted" });
    });

    const qs = [
      { l: ["Question"], t: "grey" as Tone },
      { l: ["Question", "vector"], t: "grey" as Tone },
      { l: ["Top k", "chunks"], t: "orange" as Tone },
    ];
    // Question -> same model -> vector
    b += box(col(0), qy, W, H, qs[0]!.l, { tone: "grey", size: 13.5 });
    b += arrow(col(0) + W + 4, qy + H / 2, col(1) - 4, qy + H / 2, { tone: "muted" });
    b += box(col(1), qy, W, H, ["Same embedding", "model"], { tone: "blue", size: 13.5 });
    b += arrow(col(1) + W + 4, qy + H / 2, col(2) - 4, qy + H / 2, { tone: "muted" });
    b += box(col(2), qy, W, H, qs[1]!.l, { tone: "blue", size: 13.5 });
    // stored vectors -> comparison
    b += arrow(col(3) + W / 2, iy + H + 4, col(3) + W / 2, qy - 6, { tone: "green" });
    b += box(col(3), qy, W, H, ["Score against", "every vector"], { tone: "green", size: 13.5 });
    b += arrow(col(2) + W + 4, qy + H / 2, col(3) - 4, qy + H / 2, { tone: "muted" });
    b += text(col(3) + W / 2, qy + H + 20, "cosine similarity", { size: 12, tone: "muted", anchor: "middle" });
    // result
    b += arrow(col(3) + W / 2, qy + H + 30, col(3) + W / 2, qy + H + 58, { tone: "muted" });
    b += box(col(3), qy + H + 62, W, H - 10, qs[2]!.l, { tone: "orange", size: 13.5 });
    return svg(
      {
        width: 870,
        height: qy + H + 62 + H,
        title: "Semantic search in two phases",
        credit: "Diagram of the standard mechanism; no data.",
        desc: pipeline.alt,
      },
      b,
    );
  },
};

export default [scores, pipeline];
