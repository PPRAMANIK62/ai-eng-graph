import { scaleBand, scaleLog, yAxis } from "../../lib/chart.ts";
import { line, rect, svg, text, type Figure } from "../../lib/svg.ts";

// Prices per million tokens on 2026-09-23, from the table in
// nodes/phase-1/token-pricing.md, checked against sources/anthropic-pricing.md
// and sources/openai-pricing.md (standard, short-context prices).
const MODELS: { vendor: string; name: string; input: number; output: number }[] = [
  { vendor: "OpenAI", name: "gpt-6-luna", input: 0.1, output: 0.5 },
  { vendor: "Claude", name: "Haiku 4.5", input: 1, output: 5 },
  { vendor: "Claude", name: "Sonnet 5", input: 2, output: 10 },
  { vendor: "OpenAI", name: "gpt-6-sol", input: 2, output: 10 },
  { vendor: "Claude", name: "Opus 5.5", input: 4, output: 20 },
  { vendor: "OpenAI", name: "gpt-6-astra", input: 10, output: 50 },
];
const money = (n: number) => (n < 1 ? `$${n.toFixed(2)}` : `$${n}`);

const figure: Figure = {
  slug: "input-output-prices",
  alt: "Paired bars of input and output price per million tokens on 2026-09-23, on a log scale: gpt-6-luna $0.10 and $0.50, Claude Haiku 4.5 $1 and $5, Claude Sonnet 5 $2 and $10, gpt-6-sol $2 and $10, Claude Opus 5.5 $4 and $20, gpt-6-astra $10 and $50. Output is 5 times input on every model.",
  render() {
    const W = 860;
    const p = { x: 80, y: 44, w: W - 80 - 24, h: 300 };
    const y = scaleLog().domain([0.05, 100]).range([p.y + p.h, p.y]);
    const xb = scaleBand<string>().domain(MODELS.map((m) => m.name)).range([p.x, p.x + p.w]).padding(0.22);
    const bw = xb.bandwidth() / 2 - 3;
    let b = "";
    // Legend and subtitle.
    b += text(24, 8, "Price per million tokens on 2026-09-23. Log scale, so every 5× gap is the same height.", { size: 13, tone: "muted" });
    b += rect(W - 250, 0, 14, 14, { tone: "blue", fill: "solid", stroke: false, r: 2 });
    b += text(W - 230, 7, "input", { size: 12.5, baseline: "middle" });
    b += rect(W - 170, 0, 14, 14, { tone: "orange", fill: "solid", stroke: false, r: 2 });
    b += text(W - 150, 7, "output", { size: 12.5, baseline: "middle" });

    b += yAxis(p, y, [0.1, 1, 10, 100], (n) => money(n), "USD per million tokens (log)");
    for (const m of MODELS) {
      const x0 = xb(m.name)!;
      const base = p.y + p.h;
      for (const [i, v] of [m.input, m.output].entries()) {
        const bx = x0 + i * (bw + 6);
        const tone = i === 0 ? "blue" : "orange";
        b += rect(bx, y(v), bw, base - y(v), { tone, fill: "solid", stroke: false, r: 2 });
        b += text(bx + bw / 2, y(v) - 6, money(v), { size: 12.5, weight: 600, anchor: "middle", tone });
      }
      b += text(x0 + xb.bandwidth() / 2, y(m.output) - 26, "5×", { size: 13, weight: 700, anchor: "middle", tone: "muted" });
      b += text(x0 + xb.bandwidth() / 2, base + 18, m.vendor, { size: 12, anchor: "middle", tone: "muted" });
      b += text(x0 + xb.bandwidth() / 2, base + 35, m.name, { size: 13, anchor: "middle", weight: 600 });
    }
    b += line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, { tone: "axis" });
    return svg(
      {
        width: W,
        height: p.y + p.h + 44,
        title: "Output costs 5× input on every model, while base prices span 100×",
        credit: "Prices from Anthropic's and OpenAI's pricing pages, standard rates at normal context length, read 2026-09-23.",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
