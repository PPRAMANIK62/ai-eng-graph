import { box, line, rect, svg, text, type Figure } from "../../lib/svg.ts";

// Made-up worked example from nodes/phase-2/retrieval-evaluation.md
// ("Scoring a ranked list"). One labelled relevant chunk per question.
// Recall@5: 1, 1, 0 -> 0.67. Reciprocal rank: 1, 1/3, 0 -> MRR@5 = 0.44.
const K = 5;
const ROWS = [
  { q: "Why does temperature 0 vary?", hit: 1, note: "", recall: "1", rr: "1" },
  { q: "What does BM25 add?", hit: 3, note: "", recall: "1", rr: "1/3" },
  { q: "How big should a chunk be?", hit: 0, note: "labelled chunk came back at rank 8", recall: "0", rr: "0" },
];

const figure: Figure = {
  slug: "scorecard",
  alt: "Three test questions, each with the top 5 chunks search returned. For \"Why does temperature 0 vary?\" the labelled chunk is at rank 1. For \"What does BM25 add?\" it is at rank 3. For \"How big should a chunk be?\" it is at rank 8, outside the top 5. Recall at 5 per question is 1, 1 and 0, an average of 0.67. Reciprocal rank is 1, one third and 0, so MRR at 5 is 0.44. Made-up worked example.",
  render() {
    const qx = 24, qw = 210, cx = qx + qw + 10, cw = 46, cg = 8, rowH = 58;
    const rx = cx + K * (cw + cg) + 24, rw = 90;
    let body = "";
    body += text(qx, 12, "Test question", { size: 12.5, weight: 600, tone: "muted" });
    body += text(cx, 12, "Top 5 chunks from search, by rank", { size: 12.5, weight: 600, tone: "muted" });
    body += text(rx + rw / 2, 12, "Recall@5", { size: 12.5, weight: 600, tone: "muted", anchor: "middle" });
    body += text(rx + rw + rw / 2, 12, "Reciprocal rank", { size: 12.5, weight: 600, tone: "muted", anchor: "middle" });
    let y = 30;
    for (const r of ROWS) {
      const bh = 34, by = y + (rowH - bh) / 2 - 6;
      body += text(qx, by + bh / 2, r.q, { size: 13.5, baseline: "middle" });
      for (let i = 1; i <= K; i++) {
        const hit = i === r.hit;
        body += box(cx + (i - 1) * (cw + cg), by, cw, bh, String(i), {
          tone: hit ? "green" : "grey",
          fill: hit ? "solid" : "soft",
          stroke: !hit,
          textTone: hit ? "ink" : "muted",
          weight: hit ? 700 : 400,
          size: 13,
        });
      }
      if (r.note) body += text(cx, by + bh + 15, r.note, { size: 12, tone: "red", italic: true });
      const tone = r.hit ? "green" : "red";
      body += text(rx + rw / 2, by + bh / 2, r.recall, { size: 15, weight: 700, anchor: "middle", baseline: "middle", tone });
      body += text(rx + rw + rw / 2, by + bh / 2, r.rr, { size: 15, weight: 700, anchor: "middle", baseline: "middle", tone });
      y += rowH;
    }
    body += line(qx, y + 2, rx + 2 * rw, y + 2, { tone: "axis" });
    body += text(qx, y + 24, "Average over the 3 questions", { size: 13.5, weight: 600, baseline: "middle" });
    body += rect(rx + 8, y + 10, rw - 16, 28, { tone: "blue", fill: "soft" });
    body += text(rx + rw / 2, y + 24, "0.67", { size: 15, weight: 700, anchor: "middle", baseline: "middle", tone: "blue" });
    body += rect(rx + rw + 8, y + 10, rw - 16, 28, { tone: "blue", fill: "soft" });
    body += text(rx + rw + rw / 2, y + 24, "0.44", { size: 15, weight: 700, anchor: "middle", baseline: "middle", tone: "blue" });
    body += text(rx + rw / 2, y + 54, "recall@5", { size: 12, anchor: "middle", tone: "muted" });
    body += text(rx + rw + rw / 2, y + 54, "MRR@5", { size: 12, anchor: "middle", tone: "muted" });
    return svg(
      {
        width: rx + 2 * rw + 20,
        height: y + 64,
        title: "Scoring search against labels, one question at a time",
        credit: "Made-up worked example, real arithmetic. Green = the chunk the labels say answers the question.",
        desc: figure.alt,
      },
      body,
    );
  },
};

export default [figure];
