import { columns } from "../../lib/chart.ts";
import { arrow, svg, text, type Figure } from "../../lib/svg.ts";

// Numbers from the worked table in nodes/phase-1/softmax.md.
const TOKENS = ["learn", "predict", "make"];
const PANELS = [
  { head: "1. Raw scores (logits)", values: [3, 2, 1], labels: ["3", "2", "1"], note: "gap: 3 vs 1" },
  { head: "2. After e^x", values: [20.09, 7.39, 2.72], labels: ["20.09", "7.39", "2.72"], note: "gap: 20.09 vs 2.72" },
  { head: "3. ÷ total (30.19)", values: [0.665, 0.245, 0.09], labels: ["0.665", "0.245", "0.090"], note: "sums to 1" },
];

const figure: Figure = {
  slug: "two-steps",
  alt: "Three bar charts for the tokens learn, predict and make. Raw scores 3, 2, 1 become 20.09, 7.39, 2.72 after exponentiating, then 0.665, 0.245, 0.090 after dividing by their total, which sums to 1.",
  render() {
    const pw = 220, gap = 60, ph = 190;
    let body = "";
    PANELS.forEach((panel, i) => {
      const x = 30 + i * (pw + gap);
      body += text(x + pw / 2, 14, panel.head, { anchor: "middle", size: 14, weight: 600 });
      body += columns(
        { x, y: 50, w: pw, h: ph },
        panel.values.map((v, j) => ({ label: TOKENS[j]!, value: v, valueLabel: panel.labels[j], tone: j === 0 ? "blue" : "grey" })),
        { padding: 0.28 },
      ).svg;
      body += text(x + pw / 2, 50 + ph + 44, panel.note, { anchor: "middle", size: 12.5, tone: i === 2 ? "green" : "muted", weight: i === 2 ? 600 : 400 });
      if (i < 2) body += arrow(x + pw + 12, 50 + ph / 2, x + pw + gap - 12, 50 + ph / 2, { tone: "muted" });
    });
    return svg(
      {
        width: 30 * 2 + pw * 3 + gap * 2,
        height: 50 + ph + 56,
        title: "Softmax in two steps: exponentiate, then divide by the total",
        credit: "Each panel scaled to its own tallest bar. Made-up logits, real arithmetic.",
        desc: figure.alt,
      },
      body,
    );
  },
};

export default [figure];
