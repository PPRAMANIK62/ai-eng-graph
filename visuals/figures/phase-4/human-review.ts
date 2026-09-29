import { barsH } from "../../lib/chart.ts";
import { svg, text, type Figure } from "../../lib/svg.ts";

// sources/hosking-human-feedback-not-gold.md, Figure 4, factuality row:
// crowdworker error rate minus the authors' careful ("expert") error rate,
// in percentage points, by how assertive the model was told to be.
const ROWS = [
  { label: "Cautious answers", value: 5.3 },
  { label: "Baseline", value: 16.2 },
  { label: "Assertive answers", value: 22.3 },
];

const figure: Figure = {
  slug: "assertiveness",
  alt: "Bar chart of how many factual errors crowdworkers missed compared with careful annotation, as the difference in error rates. When the model answered cautiously, crowdworkers found 5.3 points fewer factual errors. At the baseline, 16.2 points fewer. When it answered assertively, 22.3 points fewer. The more confident the answer, the more errors slipped past.",
  render() {
    const p = { x: 20, y: 30, w: 640, h: 150 };
    const c = barsH(
      p,
      ROWS.map((r, i) => ({
        label: r.label,
        value: r.value,
        valueLabel: `${r.value} points fewer`,
        tone: i === 2 ? "red" : i === 1 ? "orange" : "grey",
      })),
      { max: 25, labelWidth: 150, padding: 0.3 },
    );
    let b = text(p.x, 8, "Factual errors crowdworkers found, compared with careful annotation", { size: 13, tone: "muted" });
    b += c.svg;
    b += text(p.x + 150, p.y + p.h + 22, "The more confident the answer, the more factual errors were missed", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: p.x + p.w + 40,
        height: p.y + p.h + 34,
        title: "People miss more factual errors when the answer sounds sure",
        credit: "Data: Hosking, Blunsom & Bartolo, “Human Feedback is not Gold Standard” (ICLR 2024), Figure 4.",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
