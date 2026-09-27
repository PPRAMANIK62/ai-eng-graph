import { scaleLinear, xAxis, yAxis } from "../../lib/chart.ts";
import { box, circle, path, svg, text, type Figure } from "../../lib/svg.ts";

// Worked example from sources/pinecone-offline-evaluation.md (Recall@K section):
// 8 results, relevant at ranks 2, 4, 5, 7. Recall@1..8 = 0, .25, .25, .5, .75, .75, 1, 1.
const RELEVANT = new Set([2, 4, 5, 7]);
const RECALL = [0, 0.25, 0.25, 0.5, 0.75, 0.75, 1, 1];

const figure: Figure = {
  slug: "steps",
  alt: "A step chart of recall at k for one question with 8 results, where the relevant chunks sit at ranks 2, 4, 5 and 7. Recall is 0 at k = 1, 0.25 at k = 2 and 3, 0.5 at k = 4, 0.75 at k = 5 and 6, and 1 from k = 7. It steps up at each relevant chunk and never goes down.",
  render() {
    const p = { x: 70, y: 10, w: 560, h: 220 };
    const x = scaleLinear().domain([0.5, 8.5]).range([p.x, p.x + p.w]);
    const y = scaleLinear().domain([0, 1]).range([p.y + p.h, p.y]);
    let body = yAxis(p, y, [0, 0.25, 0.5, 0.75, 1], (n) => n.toFixed(2), "recall@k");
    body += xAxis(p, x, [1, 2, 3, 4, 5, 6, 7, 8], String, "k (how many results you keep)");
    // step line: flat across each k, jump at the next relevant rank
    let d = `M${x(0.5)},${y(0)}`;
    RECALL.forEach((r, i) => {
      const k = i + 1;
      d += ` L${x(k - 0.5)},${y(r)} L${x(k + 0.5)},${y(r)}`;
    });
    body += path(d, { tone: "blue", sw: 2.5 });
    RECALL.forEach((r, i) => {
      const k = i + 1;
      body += circle(x(k), y(r), 4.5, { tone: RELEVANT.has(k) ? "green" : "blue" });
      body += text(x(k), y(r) - 12, r.toFixed(2), { size: 12, anchor: "middle", weight: 600, tone: "blue" });
    });
    // the ranked list under the chart
    const ly = p.y + p.h + 62, bw = 40;
    body += text(p.x - 10, ly + 15, "Result", { size: 12.5, anchor: "end", baseline: "middle", tone: "muted" });
    for (let k = 1; k <= 8; k++) {
      const hit = RELEVANT.has(k);
      body += box(x(k) - bw / 2, ly, bw, 30, hit ? "yes" : "no", {
        tone: hit ? "green" : "grey",
        fill: hit ? "solid" : "soft",
        stroke: !hit,
        size: 12.5,
        weight: hit ? 700 : 400,
        textTone: hit ? "ink" : "muted",
      });
    }
    body += text(p.x + p.w + 12, ly + 15, "relevant?", { size: 12.5, baseline: "middle", tone: "muted" });
    return svg(
      {
        width: p.x + p.w + 90,
        height: ly + 40,
        title: "Recall@k climbs one step per relevant result",
        credit: "Example from Carnevali, “Evaluation Measures in Information Retrieval” (Pinecone, 2023): 4 relevant results out of 8.",
        desc: figure.alt,
      },
      body,
    );
  },
};

export default [figure];
