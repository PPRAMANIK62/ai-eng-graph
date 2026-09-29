import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Positions and tripwires: sources/openai-guardrails-human-review.md (input,
// tool and output guardrails, approvals before side effects). Inline vs
// after: sources/husain-shankar-guardrails-vs-evaluators.md.
const requestPath: Figure = {
  slug: "request-path",
  alt: "One request through a support agent, with guardrails inline. The user message goes through an input guardrail before the model runs. Each tool call is wrapped by a tool guardrail that checks arguments and results, and a side effect like cancelling an order waits for human approval. The answer goes through an output guardrail before the user sees it. Any failed check trips a wire and stops the run. Off to the side, after the answer is sent, an online evaluator scores a sample of traces for dashboards; it never blocks anything.",
  render() {
    let b = "";
    const y = 30, h = 50, cy = y + h / 2;
    b += text(20, 6, "Inline: every request passes through these", { size: 13, weight: 700, tone: "orange" });
    b += box(20, y, 120, h, ["user", "message"], { tone: "grey", size: 13 });
    b += arrow(142, cy, 166, cy, { tone: "muted" });
    b += box(168, y, 130, h, ["input", "guardrail"], { tone: "orange", size: 13, weight: 600 });
    b += arrow(300, cy, 324, cy, { tone: "muted" });
    b += box(326, y, 150, h, ["support agent", "(the model)"], { tone: "blue", size: 13, weight: 600 });
    b += arrow(478, cy, 502, cy, { tone: "muted" });
    b += box(504, y, 130, h, ["output", "guardrail"], { tone: "orange", size: 13, weight: 600 });
    b += arrow(636, cy, 660, cy, { tone: "muted" });
    b += box(662, y, 130, h, ["user sees", "the answer"], { tone: "grey", size: 13 });

    // tripwires
    for (const x of [233, 569]) {
      b += line(x, y + h + 2, x, y + h + 24, { tone: "red", dash: true });
      b += text(x, y + h + 38, "fails: tripwire,", { anchor: "middle", size: 12, tone: "red" });
      b += text(x, y + h + 54, "run stops", { anchor: "middle", size: 12, tone: "red" });
    }

    // tool calls
    const ty = 150;
    b += arrow(401, y + h + 2, 401, ty - 2, { tone: "muted" });
    b += box(316, ty, 170, h, ["tool guardrail:", "checks args and result"], { tone: "orange", size: 12.5, weight: 600 });
    const ty2 = ty + 90;
    b += arrow(360, ty + h + 2, 300, ty2 - 2, { tone: "muted" });
    b += arrow(442, ty + h + 2, 500, ty2 - 2, { tone: "muted" });
    b += box(220, ty2, 150, 40, "look up order", { tone: "grey", size: 13 });
    b += box(420, ty2, 170, 40, "human approves", { tone: "purple", size: 13, weight: 600 });
    b += arrow(592, ty2 + 20, 616, ty2 + 20, { tone: "muted" });
    b += box(618, ty2, 130, 40, "cancel order", { tone: "grey", size: 13 });
    b += text(505, ty2 + 58, "side effects wait for a person", { anchor: "middle", size: 12, tone: "muted" });

    // online evaluator
    const ex = 800;
    b += line(ex - 20, -10, ex - 20, ty2 + 70, { tone: "grid", sw: 1 });
    b += text(ex, 6, "After: off the path", { size: 13, weight: 700, tone: "green" });
    b += arrow(727, y + h + 2, ex + 60, ty - 2, { tone: "green", dash: true });
    b += box(ex, ty, 150, h, ["online evaluator"], { tone: "green", size: 13, weight: 600 });
    b += text(ex, ty + h + 22, "scores a sample later,", { size: 12, tone: "muted" });
    b += text(ex, ty + h + 38, "feeds dashboards,", { size: 12, tone: "muted" });
    b += text(ex, ty + h + 54, "never blocks", { size: 12, tone: "muted" });
    return svg(
      {
        width: 970,
        height: ty2 + 72,
        title: "Guardrails sit in the request path; evaluators sit beside it",
        credit: "Based on OpenAI's Agents SDK guardrails docs and Husain & Shankar's evals FAQ (2025).",
        desc: requestPath.alt,
      },
      b,
    );
  },
};

// sources/cunningham-constitutional-classifiers-pp.md, Table 1: compute
// relative to the last-generation system (= 100), and Section 6: ~5.5% of
// traffic escalated, 0.05% flag rate on production traffic.
const SYSTEMS: { name: string; v: number; tone: Tone }[] = [
  { name: "First generation", v: 100, tone: "grey" },
  { name: "Single exchange classifier", v: 150, tone: "grey" },
  { name: "Two-stage cascade", v: 27.8, tone: "blue" },
  { name: "Production (probe first)", v: 3.5, tone: "green" },
];

const cascadeCost: Figure = {
  slug: "cascade-cost",
  alt: "Bar chart of compute overhead for four Constitutional Classifier setups, relative to the first-generation system at 100. A single exchange classifier that reads output together with its input: 150. A two-stage cascade: 27.8. The production system, with a cheap probe on the model's activations as the first stage: 3.5. Below, the production cascade: every exchange goes to the probe, about 5.5% is escalated to a larger classifier, and 0.05% of real traffic ends up refused.",
  render() {
    const p = { x: 210, y: 10, w: 520, band: 40 };
    const xs = scaleLinear().domain([0, 160]).range([p.x, p.x + p.w]);
    let b = "";
    const hh = SYSTEMS.length * p.band;
    for (const t of [0, 50, 100, 150]) {
      b += line(xs(t), p.y, xs(t), p.y + hh, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + hh + 16, String(t), { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(p.x + p.w / 2, p.y + hh + 36, "compute overhead, first generation = 100", { anchor: "middle", size: 12, tone: "muted" });
    SYSTEMS.forEach((s, i) => {
      const cy = p.y + i * p.band + p.band / 2;
      b += text(p.x - 12, cy, s.name, { anchor: "end", baseline: "middle", size: 13 });
      b += rect(xs(0), cy - 11, Math.max(xs(s.v) - xs(0), 3), 22, { tone: s.tone, fill: "solid", stroke: false, r: 2 });
      b += text(xs(s.v) + 8, cy, String(s.v), { baseline: "middle", size: 13, weight: 600, tone: s.tone === "grey" ? "ink" : s.tone });
    });
    b += line(xs(0), p.y, xs(0), p.y + hh, { tone: "axis" });

    // cascade strip
    const y = p.y + hh + 62;
    b += text(20, y, "The production cascade, on real traffic", { size: 13.5, weight: 600 });
    const yb = y + 18;
    b += box(20, yb, 150, 44, "every exchange", { tone: "grey", size: 13 });
    b += arrow(172, yb + 22, 206, yb + 22, { tone: "muted" });
    b += box(208, yb, 190, 44, ["cheap probe on the", "model's activations"], { tone: "blue", size: 12.5, weight: 600 });
    b += arrow(400, yb + 22, 470, yb + 22, { tone: "muted" });
    b += text(435, yb + 12, "~5.5%", { anchor: "middle", size: 12.5, weight: 700, tone: "orange" });
    b += box(472, yb, 170, 44, ["larger classifier"], { tone: "orange", size: 13, weight: 600 });
    b += arrow(644, yb + 22, 700, yb + 22, { tone: "muted" });
    b += box(702, yb, 170, 44, ["0.05% refused"], { tone: "red", size: 13, weight: 600 });
    b += text(305, yb + 62, "the rest (~94.5%) pass without the big classifier", { anchor: "middle", size: 12, tone: "muted" });
    return svg(
      {
        width: 900,
        height: yb + 72,
        title: "A cheap first stage made the classifiers far cheaper",
        credit: "Data: Cunningham et al., “Constitutional Classifiers++” (Anthropic, 2026), Table 1 and Section 6.",
        desc: cascadeCost.alt,
      },
      b,
    );
  },
};

export default [requestPath, cascadeCost];
