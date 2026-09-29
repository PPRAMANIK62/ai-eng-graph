import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, line, rect, svg, text, type Figure } from "../../lib/svg.ts";

// sources/anyscale-fine-tuning-llama-2.md: Llama-2-13B, full fine-tuning.
// ViGGO 58% -> 98%; GSM8k 28% -> 47%, still behind GPT-4 (no GPT-4 number used).
const TASKS = [
  { name: "Structured output (ViGGO)", before: 58, after: 98, note: "format task: nearly solved" },
  { name: "Grade-school math (GSM8k)", before: 28, after: 47, note: "reasoning task: still behind GPT-4" },
];

const formVsReasoning: Figure = {
  slug: "form-vs-reasoning",
  alt: "Bar chart of Llama-2-13B accuracy before and after full fine-tuning, from Anyscale's 2023 case study. On a structured-output task (ViGGO), accuracy went from 58% to 98%. On grade-school math (GSM8k), it went from 28% to 47%. Fine-tuning closed the gap on the format task and only partly helped on the reasoning task, where the model stayed behind GPT-4.",
  render() {
    const p = { x: 210, y: 36, w: 440 };
    const xs = scaleLinear().domain([0, 100]).range([p.x, p.x + p.w]);
    let b = "";
    // legend
    b += rect(p.x, 0, 14, 12, { tone: "grey", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 20, 6, "base model", { size: 12.5, baseline: "middle" });
    b += rect(p.x + 120, 0, 14, 12, { tone: "blue", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 140, 6, "after fine-tuning", { size: 12.5, baseline: "middle" });
    const band = 96;
    const h = band * TASKS.length;
    for (const t of [0, 25, 50, 75, 100]) {
      b += line(xs(t), p.y - 4, xs(t), p.y + h, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + h + 18, `${t}%`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(p.x + p.w / 2, p.y + h + 40, "accuracy", { anchor: "middle", size: 12, tone: "muted" });
    TASKS.forEach((t, i) => {
      const y0 = p.y + i * band + 14;
      b += text(p.x - 12, y0 + 16, t.name, { anchor: "end", baseline: "middle", size: 13, weight: 600 });
      b += text(p.x - 12, y0 + 36, t.note, { anchor: "end", baseline: "middle", size: 12, tone: "muted" });
      b += rect(xs(0), y0, xs(t.before) - xs(0), 20, { tone: "grey", fill: "solid", stroke: false, r: 2 });
      b += text(xs(t.before) + 6, y0 + 10, `${t.before}%`, { baseline: "middle", size: 12.5, weight: 600, tone: "grey" });
      b += rect(xs(0), y0 + 26, xs(t.after) - xs(0), 20, { tone: "blue", fill: "solid", stroke: false, r: 2 });
      b += text(xs(t.after) + 6, y0 + 36, `${t.after}%`, { baseline: "middle", size: 12.5, weight: 600, tone: "blue" });
    });
    b += line(xs(0), p.y - 4, xs(0), p.y + h, { tone: "axis" });
    return svg(
      {
        width: p.x + p.w + 60,
        height: p.y + h + 50,
        title: "Fine-tuning fixed the format task, and only partly helped with math",
        credit: "Data: Anyscale, “Fine-Tuning Llama-2” (2023). Llama-2-13B, full-parameter fine-tuning; GSM8k after two rounds (MathQA, then GSM8k).",
        desc: formVsReasoning.alt,
      },
      b,
    );
  },
};

// Our own decision flow, built from the article: facts -> RAG
// (sources/ovadia-fine-tuning-or-retrieval.md); form -> prompt and examples
// first, then fine-tune (sources/anyscale-fine-tuning-llama-2.md,
// sources/zhao-lora-land.md). No numbers.
const choose: Figure = {
  slug: "choose",
  alt: "A decision flow for choosing between prompting, RAG and fine-tuning. Start by measuring the task with evals. If the model is missing facts, use RAG. If the output is wrong in format, labels or style, first try instructions and few-shot examples. If that works, stop. If it still fails, or the prompt got long and costly at high volume, and you have enough good labeled examples, fine-tune. Each path ends in running the evals again.",
  render() {
    let b = "";
    const W = 150;
    const H = 50;
    // Column 1: start
    b += box(20, 110, 140, H, ["Measure the task", "with evals"], { tone: "grey", size: 13, weight: 600 });
    b += text(90, 180, "What's wrong?", { anchor: "middle", size: 12.5, tone: "muted" });
    // Branch arrows
    b += arrow(160, 125, 218, 60, { tone: "muted" });
    b += arrow(160, 145, 218, 210, { tone: "muted" });
    // Top: facts
    b += text(226, 20, "It's missing facts", { size: 12.5, weight: 600, tone: "orange" });
    b += box(220, 34, W + 30, H, ["Use RAG: put the", "documents in the prompt"], { tone: "orange", size: 12.5 });
    // Bottom: form
    b += text(226, 176, "Wrong format, labels or style", { size: 12.5, weight: 600, tone: "blue" });
    b += box(220, 190, W + 30, H, ["Instructions plus", "few-shot examples"], { tone: "blue", size: 12.5 });
    b += arrow(400, 215, 448, 215, { tone: "muted" });
    b += box(450, 190, 120, H, ["Passes", "the evals?"], { tone: "grey", fill: "none", size: 12.5 });
    // yes -> done
    b += arrow(510, 190, 510, 150, { tone: "muted" });
    b += text(518, 172, "yes", { size: 12, tone: "muted" });
    b += box(450, 100, 120, H, "Ship the prompt", { tone: "green", size: 12.5, weight: 600 });
    // no -> fine-tune
    b += arrow(570, 215, 688, 215, { tone: "muted" });
    b += text(580, 205, "no, or too", { size: 11.5, tone: "muted" });
    b += text(580, 236, "costly at volume", { size: 11.5, tone: "muted" });
    b += box(690, 190, 160, H, ["Fine-tune on", "labeled examples"], { tone: "purple", size: 12.5, weight: 600 });
    b += text(770, 262, "needs a set of clean,", { anchor: "middle", size: 12, tone: "muted" });
    b += text(770, 278, "labeled input-output pairs", { anchor: "middle", size: 12, tone: "muted" });
    // Loop back note
    b += line(20, 305, 850, 305, { tone: "grid", sw: 1 });
    b += text(20, 326, "Every path ends the same way: run the evals again. The paths also combine: a fine-tuned model can still read retrieved documents.", {
      size: 12.5,
    });
    return svg(
      {
        width: 870,
        height: 336,
        title: "Choosing between prompting, RAG and fine-tuning",
        desc: choose.alt,
      },
      b,
    );
  },
};

export default [formVsReasoning, choose];
