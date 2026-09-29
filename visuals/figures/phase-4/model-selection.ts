import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, circle, line, path, rect, svg, text, type Figure } from "../../lib/svg.ts";

// Steps from the article, built on sources/anthropic-choosing-a-model.md
// (two starting strategies, own eval set), sources/openai-model-selection.md
// ("keep the lightest setting that meets your quality bar") and
// sources/huyen-ai-engineering-book.md (benchmarks weed out bad models).
const loop: Figure = {
  slug: "loop",
  alt: "The model selection loop. Step 1, shortlist: use public benchmarks to rule out models that are weak at your kind of task. Step 2, pick a starting point: either the cheapest model that might work, or the strongest one. Step 3, run your own eval set on each candidate. Step 4, check it against your quality bar. Step 5, work out cost per task and measure latency on your real prompts. Then keep the lightest model and setting that passes. When a new model comes out, run the loop again.",
  render() {
    const steps: { title: string; sub: string[] }[] = [
      { title: "1. Shortlist", sub: ["benchmarks rule", "weak models out"] },
      { title: "2. Start point", sub: ["cheapest that might", "work, or strongest"] },
      { title: "3. Your evals", sub: ["real inputs,", "same questions"] },
      { title: "4. Quality bar", sub: ["pass or fail", "vs your target"] },
      { title: "5. Cost, latency", sub: ["cost per task, time", "on your prompts"] },
    ];
    const w = 170;
    const h = 78;
    const gap = 44;
    const row = [20, 150];
    const col = (i: number) => 20 + i * (w + gap);
    let b = "";
    steps.forEach((s, i) => {
      const x = col(i % 3);
      const y = row[Math.floor(i / 3)];
      const tone = i === 2 ? "orange" : "blue";
      b += rect(x, y, w, h, { tone, fill: "soft" });
      b += text(x + w / 2, y + 22, s.title, { anchor: "middle", size: 14, weight: 700, tone });
      b += text(x + w / 2, y + 44, s.sub[0], { anchor: "middle", size: 12.5 });
      b += text(x + w / 2, y + 62, s.sub[1], { anchor: "middle", size: 12.5 });
    });
    // arrows in row 1
    for (const i of [0, 1]) b += arrow(col(i) + w + 3, row[0] + h / 2, col(i + 1) - 3, row[0] + h / 2, { tone: "muted" });
    // row 1 end down to row 2 start
    b += path(`M${col(2) + w / 2},${row[0] + h + 2} L${col(2) + w / 2},${row[0] + h + 24} L${col(0) + w / 2},${row[0] + h + 24} L${col(0) + w / 2},${row[1] - 3}`, {
      tone: "muted",
      arrow: true,
    });
    b += arrow(col(0) + w + 3, row[1] + h / 2, col(1) - 3, row[1] + h / 2, { tone: "muted" });
    b += arrow(col(1) + w + 3, row[1] + h / 2, col(2) - 3, row[1] + h / 2, { tone: "muted" });
    b += box(col(2), row[1], w, h, ["keep the lightest", "setting that passes"], { tone: "green", size: 13, weight: 600 });
    // loop back from the end to step 3
    const lx = col(2) + w + 26;
    b += path(`M${col(2) + w + 2},${row[1] + h / 2} L${lx},${row[1] + h / 2} L${lx},${row[0] + h / 2} L${col(2) + w + 3},${row[0] + h / 2}`, {
      tone: "orange",
      dash: true,
      arrow: true,
    });
    b += text(lx + 10, row[0] + h + 8, "new model", { size: 12, tone: "orange" });
    b += text(lx + 10, row[0] + h + 25, "or setting?", { size: 12, tone: "orange" });
    b += text(lx + 10, row[0] + h + 42, "same evals", { size: 12, tone: "orange" });
    return svg(
      {
        width: lx + 100,
        height: row[1] + h + 10,
        title: "Choosing a model: shortlist, then decide on your own evals",
        credit: "Steps drawn from Anthropic's and OpenAI's model selection guides and Chip Huyen's AI Engineering.",
        desc: loop.alt,
      },
      b,
    );
  },
};

// Worked example from the article: 100 pass/fail questions, 82 vs 78 correct.
// SEM = sqrt(p(1-p)/n); 95% CI = mean ± 1.96 × SEM
// (sources/anthropic-statistical-model-evals.md, Recommendation #1).
const N = 100;
const MODELS = [
  { name: "Model A", p: 0.82 },
  { name: "Model B", p: 0.78 },
];

const errorBars: Figure = {
  slug: "error-bars",
  alt: "Two models scored on the same 100 pass/fail questions, as dots with 95% confidence intervals. Model A scores 82% (interval about 74% to 90%) and model B 78% (about 70% to 86%). The intervals overlap heavily, so the 4-point gap is weak evidence on its own. Worked example, not measured data.",
  render() {
    const p = { x: 110, y: 10, w: 520, h: 110 };
    const xs = scaleLinear().domain([0.6, 1]).range([p.x, p.x + p.w]);
    let b = "";
    for (const t of [0.6, 0.7, 0.8, 0.9, 1]) {
      b += line(xs(t), p.y, xs(t), p.y + p.h, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + p.h + 18, `${Math.round(t * 100)}%`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(p.x + p.w / 2, p.y + p.h + 40, "score on 100 questions, with 95% confidence interval", { anchor: "middle", size: 12, tone: "muted" });
    MODELS.forEach((m, i) => {
      const cy = p.y + 30 + i * 50;
      const se = Math.sqrt((m.p * (1 - m.p)) / N);
      const lo = m.p - 1.96 * se;
      const hi = m.p + 1.96 * se;
      const tone = i === 0 ? "blue" : "orange";
      b += text(p.x - 14, cy, m.name, { anchor: "end", baseline: "middle", size: 13, weight: 600 });
      b += line(xs(lo), cy, xs(hi), cy, { tone, sw: 3 });
      b += line(xs(lo), cy - 8, xs(lo), cy + 8, { tone, sw: 2 });
      b += line(xs(hi), cy - 8, xs(hi), cy + 8, { tone, sw: 2 });
      b += circle(xs(m.p), cy, 6, { tone });
      b += text(xs(hi) + 12, cy, `${Math.round(m.p * 100)}%  (${Math.round(lo * 100)}–${Math.round(hi * 100)}%)`, {
        baseline: "middle",
        size: 12.5,
        weight: 600,
        tone,
      });
    });
    return svg(
      {
        width: p.x + p.w + 40,
        height: p.y + p.h + 50,
        title: "On 100 questions, a 4-point gap sits inside the noise",
        credit: "Worked example, not measured data. Interval = score ± 1.96 standard errors (Anthropic, 2024).",
        desc: errorBars.alt,
      },
      b,
    );
  },
};

export default [loop, errorBars];
