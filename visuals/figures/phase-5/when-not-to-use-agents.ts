import { scaleLog } from "../../lib/chart.ts";
import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// sources/kapoor-ai-agents-that-matter.md, section 2.3: Reflexion and LDB cost over 50%
// more than the warming baseline, LATS over 50 times more, with no significant accuracy
// difference between warming and the best agent. Only lower bounds are given, so the bars
// are drawn at the bound with an open end.
const ROWS: { name: string; mult: number; label: string; tone: Tone }[] = [
  { name: "Warming (retry loop)", mult: 1, label: "1× (reference)", tone: "green" },
  { name: "Reflexion", mult: 1.5, label: "over 1.5×", tone: "orange" },
  { name: "LDB", mult: 1.5, label: "over 1.5×", tone: "orange" },
  { name: "LATS", mult: 50, label: "over 50×", tone: "red" },
];

const cost: Figure = {
  slug: "cost",
  alt: "Relative cost of coding agents vs a simple retry loop on HumanEval, at about the same accuracy. The warming baseline, which retries the model up to five times while raising temperature, is the reference at 1×. Reflexion and LDB cost over 1.5 times as much. LATS costs over 50 times as much. There was no significant accuracy difference between the warming baseline and the best agent.",
  render() {
    const p = { x: 190, y: 10, w: 520 };
    const xs = scaleLog().domain([0.8, 100]).range([p.x, p.x + p.w]);
    const ROW = 44;
    let b = "";
    for (const t of [1, 10, 100]) {
      b += line(xs(t), p.y, xs(t), p.y + ROWS.length * ROW, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + ROWS.length * ROW + 16, `${t}×`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    ROWS.forEach((r, i) => {
      const y = p.y + i * ROW + 10;
      b += text(p.x - 12, y + 12, r.name, { anchor: "end", baseline: "middle", size: 13 });
      const w = xs(r.mult) - xs(0.8);
      b += rect(xs(0.8), y, w, 24, { tone: r.tone, fill: "solid", stroke: false, r: 2 });
      if (r.mult > 1) b += arrow(xs(0.8) + w, y + 12, xs(0.8) + w + 26, y + 12, { tone: r.tone, dash: true, sw: 2 });
      b += text(xs(0.8) + w + (r.mult > 1 ? 34 : 8), y + 12, r.label, { baseline: "middle", size: 12.5, weight: 600, tone: r.tone });
    });
    b += text(p.x + p.w / 2, p.y + ROWS.length * ROW + 36, "cost relative to the retry loop (log scale; arrows mark lower bounds)", {
      anchor: "middle",
      size: 12,
      tone: "muted",
    });
    return svg(
      {
        width: p.x + p.w + 70,
        height: p.y + ROWS.length * ROW + 46,
        title: "Same accuracy on HumanEval, very different bills",
        credit: "Data: Kapoor et al., “AI Agents That Matter” (2024), section 2.3. 164 HumanEval problems, 2024 models (GPT-3.5, GPT-4, Llama-3).",
        desc: cost.alt,
      },
      b,
    );
  },
};

// Decision questions from sources/anthropic-building-effective-agents.md (can't predict steps
// or hard-code the path; cost/latency tradeoff), sources/willison-designing-agentic-loops.md
// (clear success criteria), sources/kapoor-ai-agents-that-matter.md (retry loop baseline).
const decide: Figure = {
  slug: "decide",
  alt: "A decision flow. First: can you write down the steps ahead of time? If yes, build a workflow. If no: is there a clear way to check progress, like tests? If no, narrow the task or add a check before reaching for an agent. If yes: is the result worth more tokens, more latency and less predictability? If no, use a workflow with a retry loop. If yes, try a single agent with a turn and budget limit.",
  render() {
    let b = "";
    const QX = 20, QW = 330, QH = 56, OX = 520, OW = 360;
    const qs = [
      { q: ["Can you write down the", "steps ahead of time?"], yes: ["Build a workflow"], yesTone: "green" as Tone, go: "no" },
      { q: ["Is there a clear way to check", "progress, like tests?"], yes: ["Narrow the task or add a check", "before reaching for an agent"], yesTone: "grey" as Tone, go: "yes" },
      { q: ["Is the result worth more tokens,", "latency and less predictability?"], yes: ["Workflow with a retry loop"], yesTone: "green" as Tone, go: "yes" },
    ];
    qs.forEach((s, i) => {
      const y = i * 100;
      b += box(QX, y, QW, QH, s.q, { tone: "blue", size: 13 });
      b += arrow(QX + QW + 2, y + QH / 2, OX - 2, y + QH / 2, { tone: "muted" });
      b += text((QX + QW + OX) / 2, y + QH / 2 - 8, i === 0 ? "yes" : "no", { anchor: "middle", size: 12.5, weight: 600, tone: "muted" });
      b += box(OX, y + 4, OW, QH - 8, s.yes, { tone: s.yesTone, size: 13 });
      b += arrow(QX + QW / 2, y + QH + 2, QX + QW / 2, y + 98, { tone: "muted" });
      b += text(QX + QW / 2 + 10, y + QH + 24, i === 0 ? "no" : "yes", { size: 12.5, weight: 600, tone: "muted" });
    });
    b += box(QX, 300, QW, 50, ["Try a single agent with", "a turn limit and a budget"], { tone: "orange", size: 13, weight: 600 });
    return svg(
      {
        width: 900,
        height: 360,
        title: "Most paths through these questions end in a workflow",
        credit: "Built from Anthropic (2024), Willison (2025) and Kapoor et al. (2024).",
        desc: decide.alt,
      },
      b,
    );
  },
};

export default [cost, decide];
