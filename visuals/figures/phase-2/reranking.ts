import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Mechanism: sources/sbert-cross-encoders.md (bi-encoder vs cross-encoder) and
// sources/nogueira-bert-reranking.md (query and passage as one input, one
// relevance score). Candidate counts in the funnel: 150 → 20 from
// sources/anthropic-contextual-retrieval.md.
const twoWays: Figure = {
  slug: "bi-vs-cross",
  alt: "Two ways to score a document against a query. Left, the first stage (a bi-encoder): the query and the document go through the model separately, each becomes a vector, and the vectors are compared. Document vectors are made ahead of time and stored, so this is fast over millions of documents. Right, the reranker (a cross-encoder): the query and one document go into the model together as one input, and it outputs a single relevance score. Nothing can be stored ahead of time, so it runs once per candidate at query time. Below, the two-stage pipeline: first stage over the whole collection, top 150 candidates to the reranker, top 20 to the model.",
  render() {
    let b = "";
    // Left: bi-encoder
    const L = 20;
    b += text(L, 10, "First stage: bi-encoder", { size: 14.5, weight: 700, tone: "blue" });
    b += text(L, 30, "query and document encoded separately", { size: 12.5, tone: "muted" });
    b += box(L, 50, 110, 34, "query", { tone: "grey", size: 13 });
    b += box(L, 120, 110, 34, "document", { tone: "grey", size: 13 });
    b += box(L + 150, 50, 90, 34, "model", { tone: "blue", size: 13, weight: 600 });
    b += box(L + 150, 120, 90, 34, "model", { tone: "blue", size: 13, weight: 600 });
    b += arrow(L + 110, 67, L + 148, 67, { tone: "muted" });
    b += arrow(L + 110, 137, L + 148, 137, { tone: "muted" });
    b += box(L + 280, 50, 70, 34, "vector", { tone: "blue", fill: "none", size: 12.5 });
    b += box(L + 280, 120, 70, 34, "vector", { tone: "blue", fill: "none", size: 12.5, dash: true });
    b += arrow(L + 240, 67, L + 278, 67, { tone: "muted" });
    b += arrow(L + 240, 137, L + 278, 137, { tone: "muted" });
    b += text(L + 315, 172, "made ahead, stored", { anchor: "middle", size: 12, tone: "muted" });
    b += arrow(L + 350, 67, L + 378, 95, { tone: "muted" });
    b += arrow(L + 350, 137, L + 378, 109, { tone: "muted" });
    b += box(L + 380, 85, 60, 34, "compare", { tone: "grey", size: 12 });
    b += text(L, 205, "Fast over millions of documents, but each vector", { size: 12.5 });
    b += text(L, 223, "was made before anyone asked the question.", { size: 12.5 });

    // Right: cross-encoder
    const R = 500;
    b += line(R - 22, 0, R - 22, 230, { tone: "grid", sw: 1 });
    b += text(R, 10, "Reranker: cross-encoder", { size: 14.5, weight: 700, tone: "orange" });
    b += text(R, 30, "query and document read together", { size: 12.5, tone: "muted" });
    b += rect(R, 80, 150, 48, { tone: "grey", fill: "soft" });
    b += text(R + 75, 97, "query", { anchor: "middle", size: 13 });
    b += text(R + 75, 116, "+ one document", { anchor: "middle", size: 13 });
    b += box(R + 180, 80, 90, 48, "model", { tone: "orange", size: 13, weight: 600 });
    b += arrow(R + 150, 104, R + 178, 104, { tone: "muted" });
    b += box(R + 300, 84, 90, 40, ["relevance", "score"], { tone: "orange", fill: "none", size: 12 });
    b += arrow(R + 270, 104, R + 298, 104, { tone: "muted" });
    b += text(R, 205, "More accurate, but nothing can be stored:", { size: 12.5 });
    b += text(R, 223, "it runs once per candidate, at query time.", { size: 12.5 });

    // Funnel
    const y = 262;
    b += line(20, y - 12, 900, y - 12, { tone: "grid", sw: 1 });
    b += text(20, y + 8, "So you use both, in two stages", { size: 13.5, weight: 600 });
    const steps: { label: string; tone: Tone; w: number }[] = [
      { label: "whole collection", tone: "grey", w: 150 },
      { label: "first stage", tone: "blue", w: 120 },
      { label: "top 150", tone: "grey", w: 100 },
      { label: "reranker", tone: "orange", w: 110 },
      { label: "top 20", tone: "grey", w: 90 },
      { label: "model", tone: "green", w: 90 },
    ];
    let x = 20;
    steps.forEach((s, i) => {
      b += box(x, y + 24, s.w, 34, s.label, { tone: s.tone, size: 13, weight: s.tone === "grey" ? 400 : 600 });
      if (i < steps.length - 1) b += arrow(x + s.w + 4, y + 41, x + s.w + 30, y + 41, { tone: "muted" });
      x += s.w + 34;
    });
    return svg(
      {
        width: 920,
        height: y + 70,
        title: "Why reranking is a second stage",
        credit: "Mechanism from Sentence Transformers docs and Nogueira & Cho (2019). 150 to 20 is Anthropic's setup (2024).",
        desc: twoWays.alt,
      },
      b,
    );
  },
};

// sources/qdrant-reranker-worth-it.md, results table: best of four cross-encoders
// per dataset, nDCG@10 change over fusion tuned on the same candidates, and
// whether the gain held on held-out queries.
const ROWS = [
  { name: "SciFact", vsTuned: 0.033, vsDefault: 0.057, held: false },
  { name: "ArguAna", vsTuned: 0.017, vsDefault: 0.031, held: false },
  { name: "WANDS", vsTuned: -0.008, vsDefault: 0.039, held: false },
  { name: "CodeSearchNet", vsTuned: 0.135, vsDefault: 0.169, held: true },
  { name: "DBPedia-entity", vsTuned: 0.115, vsDefault: 0.137, held: true },
];

const results: Figure = {
  slug: "results",
  alt: "Horizontal bar chart of the nDCG@10 change from adding the best of four cross-encoder rerankers, measured against hybrid search with tuned fusion, on five datasets. CodeSearchNet +0.135 and DBPedia-entity +0.115 held up on held-out queries. SciFact +0.033 and ArguAna +0.017 did not hold up. WANDS −0.008: the reranker lost. Against untuned default fusion, all five looked like gains, from +0.031 to +0.169.",
  render() {
    const p = { x: 150, y: 30, w: 560, h: 230 };
    const xs = scaleLinear().domain([-0.02, 0.18]).range([p.x, p.x + p.w]);
    const band = p.h / ROWS.length;
    let b = "";
    for (const t of [0, 0.05, 0.1, 0.15]) {
      b += line(xs(t), p.y - 6, xs(t), p.y + p.h, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + p.h + 18, t === 0 ? "0" : `+${t.toFixed(2)}`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(p.x + p.w / 2, p.y + p.h + 40, "nDCG@10 change from adding the reranker", { anchor: "middle", size: 12, tone: "muted" });
    ROWS.forEach((r, i) => {
      const cy = p.y + i * band + band / 2;
      const tone: Tone = r.vsTuned < 0 ? "red" : r.held ? "green" : "grey";
      b += text(p.x - 12, cy, r.name, { anchor: "end", baseline: "middle", size: 13 });
      // default-RRF baseline as a thin outline bar behind
      b += rect(xs(0), cy - 16, xs(r.vsDefault) - xs(0), 10, { tone: "blue", fill: "none", r: 2, sw: 1.2 });
      const x0 = Math.min(xs(0), xs(r.vsTuned));
      const w = Math.abs(xs(r.vsTuned) - xs(0));
      b += rect(x0, cy - 3, Math.max(w, 2), 18, { tone, fill: "solid", stroke: false, r: 2 });
      const label = `${r.vsTuned > 0 ? "+" : "−"}${Math.abs(r.vsTuned).toFixed(3)}  ${r.vsTuned < 0 ? "lost" : r.held ? "held up" : "didn't hold up"}`;
      b += text(Math.max(xs(r.vsTuned), xs(0)) + 8, cy + 6, label, { baseline: "middle", size: 12.5, weight: 600, tone });
    });
    b += line(xs(0), p.y - 6, xs(0), p.y + p.h, { tone: "axis" });
    // legend
    b += rect(p.x, 0, 14, 12, { tone: "grey", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 20, 6, "filled: vs hybrid with tuned fusion", { size: 12.5, baseline: "middle" });
    b += rect(p.x + 230, 1, 14, 10, { tone: "blue", fill: "none", r: 2, sw: 1.2 });
    b += text(p.x + 250, 6, "outline: vs default fusion", { size: 12.5, baseline: "middle" });
    return svg(
      {
        width: p.x + p.w + 190,
        height: p.y + p.h + 50,
        title: "Against a tuned first stage, a reranker won clearly on two of five datasets",
        credit: "Data: Qdrant, “When Is a Reranker Worth It?” (2026). Best of four small cross-encoders per dataset, 10 to 200 candidates.",
        desc: results.alt,
      },
      b,
    );
  },
};

export default [twoWays, results];
