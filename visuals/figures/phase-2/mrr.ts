import { columns } from "../../lib/chart.ts";
import { svg, text, type Figure } from "../../lib/svg.ts";

// Reciprocal rank = 1/rank of the first relevant result, 0 if none in the cutoff.
// With a cutoff of 5 these are the only six possible scores
// (sources/voorhees-trec8-qa.md: "0, .2, .25, .33, .5, 1").
const BARS = [
  { label: "rank 1", value: 1, valueLabel: "1" },
  { label: "rank 2", value: 0.5, valueLabel: "0.5" },
  { label: "rank 3", value: 1 / 3, valueLabel: "0.33" },
  { label: "rank 4", value: 0.25, valueLabel: "0.25" },
  { label: "rank 5", value: 0.2, valueLabel: "0.2" },
  { label: "not in top 5", value: 0, valueLabel: "0" },
];

const figure: Figure = {
  slug: "reciprocal",
  alt: "A bar chart of the score a question gets by the rank of its first relevant result: 1 at rank 1, 0.5 at rank 2, 0.33 at rank 3, 0.25 at rank 4, 0.2 at rank 5, and 0 if nothing relevant is in the top 5. Half the score is gone by rank 2.",
  render() {
    const p = { x: 64, y: 20, w: 580, h: 210 };
    const c = columns(
      p,
      BARS.map((b, i) => ({ ...b, tone: i === 0 ? "blue" : i === 5 ? "red" : "grey" })),
      { max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], tickFormat: (n) => String(n), padding: 0.3, yLabel: "score for the question" },
    );
    let body = c.svg;
    body += text(p.x + p.w / 2, p.y + p.h + 44, "Where the first relevant result landed", { size: 12, anchor: "middle", tone: "muted" });
    return svg(
      {
        width: p.x + p.w + 24,
        height: p.y + p.h + 54,
        title: "Reciprocal rank: most of the score is in the top two places",
        credit: "Score = 1 ÷ rank. With five results allowed, these six are the only possible scores (Voorhees, TREC-8 QA report).",
        desc: figure.alt,
      },
      body,
    );
  },
};

export default [figure];
