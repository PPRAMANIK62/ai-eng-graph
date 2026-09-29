import { scaleLinear } from "../../lib/chart.ts";
import { line, rect, svg, text, type Figure } from "../../lib/svg.ts";

// sources/yao-react.md, Table 2: failure modes of ReAct and CoT on HotpotQA,
// from 200 hand-labeled runs (share of each method's failures).
const ROWS = [
  { name: "Hallucinated facts or reasoning", cot: 56, react: 0 },
  { name: "Wrong reasoning (incl. stuck repeating)", cot: 16, react: 47 },
  { name: "Search returned nothing useful", cot: null, react: 23 },
];

const failures: Figure = {
  slug: "failures",
  alt: "Two bar groups from hand-labeled failures on HotpotQA. Hallucinated facts or reasoning: 56% of chain-of-thought failures, 0% of ReAct failures. Wrong reasoning, including getting stuck repeating steps: 16% for chain-of-thought, 47% for ReAct. Search returned nothing useful: 23% of ReAct failures, not applicable to chain-of-thought.",
  render() {
    const p = { x: 290, y: 30, w: 440 };
    const xs = scaleLinear().domain([0, 60]).range([p.x, p.x + p.w]);
    const ROW = 72;
    let b = "";
    // legend
    b += rect(p.x, 0, 14, 12, { tone: "grey", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 20, 6, "chain-of-thought only", { size: 12.5, baseline: "middle" });
    b += rect(p.x + 190, 0, 14, 12, { tone: "blue", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 210, 6, "ReAct", { size: 12.5, baseline: "middle" });
    for (const t of [0, 20, 40, 60]) {
      b += line(xs(t), p.y, xs(t), p.y + ROWS.length * ROW, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + ROWS.length * ROW + 16, `${t}%`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    ROWS.forEach((r, i) => {
      const y = p.y + i * ROW + 12;
      b += text(p.x - 12, y + 22, r.name, { anchor: "end", baseline: "middle", size: 13 });
      if (r.cot === null) {
        b += text(xs(0) + 6, y + 10, "n/a (no search)", { baseline: "middle", size: 12, tone: "muted", italic: true });
      } else {
        b += rect(xs(0), y, Math.max(2, xs(r.cot) - xs(0)), 20, { tone: "grey", fill: "solid", stroke: false, r: 2 });
        b += text(xs(r.cot) + 6, y + 10, `${r.cot}%`, { baseline: "middle", size: 12.5, weight: 600, tone: "grey" });
      }
      b += rect(xs(0), y + 24, Math.max(2, xs(r.react) - xs(0)), 20, { tone: "blue", fill: "solid", stroke: false, r: 2 });
      b += text(Math.max(xs(r.react), xs(0) + 2) + 6, y + 34, `${r.react}%`, { baseline: "middle", size: 12.5, weight: 600, tone: "blue" });
    });
    b += line(xs(0), p.y, xs(0), p.y + ROWS.length * ROW, { tone: "axis" });
    b += text(xs(30), p.y + ROWS.length * ROW + 36, "share of that method's failed runs", { anchor: "middle", size: 12, tone: "muted" });
    return svg(
      {
        width: p.x + p.w + 60,
        height: p.y + ROWS.length * ROW + 46,
        title: "Why ReAct and chain-of-thought fail differently",
        credit: "Data: Yao et al., ReAct (2022), Table 2. HotpotQA, PaLM-540B, 200 hand-labeled runs.",
        desc: failures.alt,
      },
      b,
    );
  },
};

export default [failures];
