import { scaleLinear, series, xAxis, yAxis } from "../../lib/chart.ts";
import { arrow, circle, line, svg, text, type Figure } from "../../lib/svg.ts";

// Two tokens with scores A = 1, B = 3 (nodes/phase-1/temperature.md, checked
// against sources/huyen-sampling.md). Chance of B = softmax of the scores
// divided by T, which for two tokens is 1 / (1 + e^(-(3 - 1) / T)).
// At T = 0 the model takes the top score (argmax), so B = 100%.
const pB = (T: number) => (T === 0 ? 1 : 1 / (1 + Math.exp(-2 / T)));
const MARKS = [
  { T: 0.5, label: "T = 0.5: 98%" },
  { T: 1, label: "T = 1: 88%" },
  { T: 2, label: "T = 2: 73%" },
];

const figure: Figure = {
  slug: "dial",
  alt: "Line chart of the chance of picking B, the token with the higher score (scores 1 and 3), as temperature goes from 0 to 2. It stays near 100% below about 0.3, then falls smoothly: 98% at 0.5, 88% at 1 and 73% at 2, heading toward the 50% of a coin flip.",
  render() {
    const p = { x: 80, y: 10, w: 640, h: 280 };
    const x = scaleLinear().domain([0, 2]).range([p.x, p.x + p.w]);
    const y = scaleLinear().domain([0.4, 1]).range([p.y + p.h, p.y]);
    let body = yAxis(p, y, [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1], (n) => `${Math.round(n * 100)}%`, "Chance of picking B");
    body += xAxis(p, x, [0, 0.5, 1, 1.5, 2], String, "Temperature (T)");
    // coin-flip line
    body += line(p.x, y(0.5), p.x + p.w, y(0.5), { tone: "muted", dash: true, sw: 1.2 });
    body += text(p.x + p.w - 6, y(0.5) - 8, "50%: a coin flip between A and B", { size: 12.5, tone: "muted", anchor: "end" });
    const pts: [number, number][] = [];
    for (let i = 0; i <= 200; i++) {
      const T = (i / 200) * 2;
      pts.push([x(T), y(pB(T))]);
    }
    body += series(pts, { tone: "blue", sw: 3 });
    body += circle(x(0), y(1), 5, { tone: "blue" });
    body += text(x(0) + 10, y(0.955), "T = 0: always B", { size: 12.5, tone: "blue", weight: 600 });
    body += text(x(0) + 10, y(0.955) + 17, "(takes the top score)", { size: 12.5, tone: "blue" });
    for (const m of MARKS) {
      const cx = x(m.T), cy = y(pB(m.T));
      body += circle(cx, cy, 5.5, { tone: "orange" });
      body += text(cx + 2, cy - 14, m.label, { size: 13, weight: 600, tone: "orange", anchor: m.T === 2 ? "end" : "start" });
    }
    body += arrow(x(0.62), y(0.62), x(0.12), y(0.62), { tone: "muted" });
    body += text(x(0.12), y(0.62) - 10, "more predictable", { size: 13, tone: "muted" });
    body += arrow(x(1.38), y(0.62), x(1.9), y(0.62), { tone: "muted" });
    body += text(x(1.9), y(0.62) - 10, "more varied", { size: 13, tone: "muted", anchor: "end" });
    return svg(
      {
        width: p.x + p.w + 40,
        height: p.y + p.h + 48,
        title: "Temperature is a smooth dial: two tokens with scores 1 (A) and 3 (B)",
        credit: "Adapted from Chip Huyen, “Generation configurations” (2024). Curve computed from the two scores; orange points are the article's table.",
        desc: figure.alt,
      },
      body,
    );
  },
};

export default [figure];
