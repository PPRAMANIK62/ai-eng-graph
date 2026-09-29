import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, line, path, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// The five workflow patterns plus an agent for contrast.
// Source: sources/anthropic-building-effective-agents.md (one diagram per pattern in the post).
// Redrawn as one sheet, not traced.
const patterns: Figure = {
  slug: "patterns",
  alt: "Five workflow patterns as small flow diagrams. Prompt chaining: call, gate, call in a line. Routing: a router sends the input to one of several specialist calls. Parallelization: several calls run at once and an aggregator combines them. Orchestrator-workers: one call decides the subtasks at run time and hands them to workers. Evaluator-optimizer: a generator and an evaluator in a loop until the output passes. For contrast, an agent: the model calls tools in a loop and decides when to stop.",
  render() {
    const W = 300;
    const H = 190;
    const cell = (col: number, row: number) => ({ x: 20 + col * (W + 20), y: row * (H + 16) });
    let b = "";

    const panel = (x: number, y: number, title: string, sub: string, tone: Tone, dashed = false) => {
      b += rect(x, y, W, H, { tone: "grey", fill: "none", sw: 1, dash: dashed });
      b += text(x + 14, y + 22, title, { size: 14.5, weight: 700, tone });
      b += text(x + 14, y + 40, sub, { size: 12, tone: "muted" });
    };
    const call = (x: number, y: number, w = 58, label = "LLM", tone: Tone = "blue") =>
      box(x, y, w, 30, label, { tone, size: 12.5, weight: 600 });
    const io = (x: number, y: number, label: string) => box(x, y, 44, 30, label, { tone: "grey", size: 12 });

    // 1. Prompt chaining
    {
      const { x, y } = cell(0, 0);
      panel(x, y, "Prompt chaining", "fixed steps, checks in code between", "blue");
      const cy = y + 100;
      b += io(x + 12, cy, "in");
      b += arrow(x + 56, cy + 15, x + 70, cy + 15, { tone: "muted" });
      b += call(x + 72, cy, 50);
      b += arrow(x + 122, cy + 15, x + 136, cy + 15, { tone: "muted" });
      b += path(`M${x + 152},${cy} L${x + 168},${cy + 15} L${x + 152},${cy + 30} L${x + 136},${cy + 15} Z`, { tone: "orange", fill: "orange", fillSoft: true });
      b += text(x + 152, cy - 8, "gate", { anchor: "middle", size: 12, tone: "orange" });
      b += arrow(x + 168, cy + 15, x + 182, cy + 15, { tone: "muted" });
      b += call(x + 184, cy, 50);
      b += arrow(x + 234, cy + 15, x + 246, cy + 15, { tone: "muted" });
      b += io(x + 248, cy, "out");
      b += arrow(x + 152, cy + 30, x + 152, cy + 58, { tone: "red", dash: true });
      b += text(x + 162, cy + 70, "stop if the check fails", { size: 12, tone: "red" });
    }
    // 2. Routing
    {
      const { x, y } = cell(1, 0);
      panel(x, y, "Routing", "classify first, then one specialist path", "green");
      const cy = y + 100;
      b += io(x + 12, cy, "in");
      b += arrow(x + 56, cy + 15, x + 78, cy + 15, { tone: "muted" });
      b += call(x + 80, cy, 64, "router", "green");
      const ys = [y + 56, y + 100, y + 144];
      ys.forEach((ty, i) => {
        b += arrow(x + 144, cy + 15, x + 186, ty + 15, { tone: i === 1 ? "green" : "grey", dash: i !== 1 });
        b += call(x + 188, ty, 96, i === 0 ? "prompt A" : i === 1 ? "prompt B" : "prompt C", i === 1 ? "blue" : "grey");
      });
    }
    // 3. Parallelization
    {
      const { x, y } = cell(2, 0);
      panel(x, y, "Parallelization", "run at once, then combine", "purple");
      const cy = y + 100;
      b += io(x + 12, cy, "in");
      const ys = [y + 56, y + 100, y + 144];
      ys.forEach((ty) => {
        b += arrow(x + 56, cy + 15, x + 96, ty + 15, { tone: "muted" });
        b += call(x + 98, ty, 58);
        b += arrow(x + 156, ty + 15, x + 190, cy + 15, { tone: "muted" });
      });
      b += box(x + 192, cy, 96, 30, "combine", { tone: "purple", size: 12.5, weight: 600 });
    }
    // 4. Orchestrator-workers
    {
      const { x, y } = cell(0, 1);
      panel(x, y, "Orchestrator-workers", "subtasks decided at run time", "orange");
      const cy = y + 100;
      b += call(x + 12, cy, 94, "orchestrator", "orange");
      const ys = [y + 56, y + 100, y + 144];
      ys.forEach((ty, i) => {
        b += arrow(x + 106, cy + 15, x + 146, ty + 15, { tone: "muted", dash: i === 2 });
        b += call(x + 148, ty, 64, "worker", i === 2 ? "grey" : "blue");
        b += arrow(x + 212, ty + 15, x + 236, cy + 15, { tone: "muted", dash: i === 2 });
      });
      b += box(x + 238, cy, 52, 30, "merge", { tone: "orange", size: 12 });
    }
    // 5. Evaluator-optimizer
    {
      const { x, y } = cell(1, 1);
      panel(x, y, "Evaluator-optimizer", "write, grade, loop until it passes", "red");
      const cy = y + 92;
      b += io(x + 12, cy, "in");
      b += arrow(x + 56, cy + 15, x + 74, cy + 15, { tone: "muted" });
      b += call(x + 76, cy, 84, "generator");
      b += arrow(x + 160, cy + 15, x + 178, cy + 15, { tone: "muted" });
      b += call(x + 180, cy, 84, "evaluator", "red");
      b += path(`M${x + 222},${cy + 30} L${x + 222},${cy + 62} L${x + 118},${cy + 62} L${x + 118},${cy + 34}`, { tone: "red", arrow: true });
      b += text(x + 170, cy + 78, "feedback", { anchor: "middle", size: 12, tone: "red" });
      b += arrow(x + 264, cy + 15, x + 288, cy + 15, { tone: "green" });
      b += text(x + 276, cy - 6, "pass", { anchor: "middle", size: 12, tone: "green" });
    }
    // 6. Agent, for contrast
    {
      const { x, y } = cell(2, 1);
      panel(x, y, "For contrast: an agent", "the model picks each next step", "muted", true);
      const cy = y + 92;
      b += io(x + 12, cy, "in");
      b += arrow(x + 56, cy + 15, x + 84, cy + 15, { tone: "muted" });
      b += call(x + 86, cy, 58, "LLM", "grey");
      b += box(x + 196, cy, 72, 30, "tools", { tone: "grey", size: 12.5 });
      b += arrow(x + 144, cy + 9, x + 194, cy + 9, { tone: "muted" });
      b += arrow(x + 196, cy + 23, x + 146, cy + 23, { tone: "muted" });
      b += text(x + 170, cy + 52, "loop until the model", { anchor: "middle", size: 12, tone: "muted" });
      b += text(x + 170, cy + 68, "decides it's done", { anchor: "middle", size: 12, tone: "muted" });
    }
    return svg(
      {
        width: 20 + 3 * (W + 20),
        height: 2 * H + 16,
        title: "Five workflow patterns, and an agent for contrast",
        credit: "Adapted from Anthropic, “Building effective agents” (2024).",
        desc: patterns.alt,
      },
      b,
    );
  },
};

// sources/ridnik-alphacodium.md, Table 1: pass@5 on CodeContests, direct prompt vs AlphaCodium flow.
const ROWS = [
  { name: "GPT-4, validation", direct: 19, flow: 44 },
  { name: "GPT-4, test", direct: 12, flow: 29 },
  { name: "GPT-3.5, validation", direct: 15, flow: 25 },
  { name: "GPT-3.5, test", direct: 8, flow: 17 },
];

const alphacodium: Figure = {
  slug: "alphacodium",
  alt: "Bar chart of AlphaCodium's results on CodeContests, pass@5. GPT-4 validation: 19% with one direct prompt, 44% with the flow. GPT-4 test: 12% to 29%. GPT-3.5 validation: 15% to 25%. GPT-3.5 test: 8% to 17%. The flow made about 15 to 20 model calls per solution.",
  render() {
    const p = { x: 170, y: 34, w: 480, h: 250 };
    const xs = scaleLinear().domain([0, 50]).range([p.x, p.x + p.w]);
    const band = p.h / ROWS.length;
    let b = "";
    for (const t of [0, 10, 20, 30, 40, 50]) {
      b += line(xs(t), p.y - 6, xs(t), p.y + p.h, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + p.h + 18, `${t}%`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(p.x + p.w / 2, p.y + p.h + 40, "problems solved (pass@5)", { anchor: "middle", size: 12, tone: "muted" });
    ROWS.forEach((r, i) => {
      const top = p.y + i * band + 10;
      b += text(p.x - 12, top + 22, r.name, { anchor: "end", baseline: "middle", size: 13 });
      b += rect(xs(0), top, xs(r.direct) - xs(0), 18, { tone: "grey", fill: "solid", stroke: false, r: 2 });
      b += text(xs(r.direct) + 8, top + 9, `${r.direct}%`, { baseline: "middle", size: 12.5, weight: 600, tone: "muted" });
      b += rect(xs(0), top + 22, xs(r.flow) - xs(0), 18, { tone: "blue", fill: "solid", stroke: false, r: 2 });
      b += text(xs(r.flow) + 8, top + 31, `${r.flow}%`, { baseline: "middle", size: 12.5, weight: 600, tone: "blue" });
    });
    b += line(xs(0), p.y - 6, xs(0), p.y + p.h, { tone: "axis" });
    b += rect(p.x, 2, 14, 12, { tone: "grey", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 20, 8, "one well-written prompt", { size: 12.5, baseline: "middle" });
    b += rect(p.x + 200, 2, 14, 12, { tone: "blue", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 220, 8, "fixed multi-step flow (about 15 to 20 calls)", { size: 12.5, baseline: "middle" });
    return svg(
      {
        width: p.x + p.w + 60,
        height: p.y + p.h + 50,
        title: "A fixed flow beat one prompt on every split (GPT-4 era, 2024)",
        credit: "Data: Ridnik, Kredo and Friedman, “Code Generation with AlphaCodium” (2024), Table 1. CodeContests.",
        desc: alphacodium.alt,
      },
      b,
    );
  },
};

export default [patterns, alphacodium];
