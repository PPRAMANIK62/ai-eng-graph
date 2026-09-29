import { arrow, box, rect, text, svg, type Figure } from "../../lib/svg.ts";

// The pattern from sources/anthropic-building-effective-agents.md (Workflow: Orchestrator-workers)
// and sources/anthropic-orchestrator-workers-cookbook.md (plan phase, then one worker per subtask),
// drawn on the article's docs-assistant example. The synthesizer step follows the post; the
// cookbook leaves it as a next step. Redrawn, not traced.
const flow: Figure = {
  slug: "flow",
  alt: "The orchestrator-workers pattern on a docs question. The orchestrator call reads the question and returns a list of subtasks; how many and which ones are decided at run time. Code calls one worker per subtask, with the original question and that subtask. A synthesizer call combines the worker outputs into one answer. The orchestrator plans once and the workers each answer once; code runs the loop.",
  render() {
    let b = "";
    const cy = 105;
    // question
    b += box(16, cy - 27, 116, 54, ["“How do I build", "a RAG chatbot?”"], { tone: "grey", size: 12.5 });
    b += arrow(132, cy, 150, cy, { tone: "muted" });
    // orchestrator
    b += box(152, cy - 27, 120, 54, ["orchestrator", "makes a plan"], { tone: "orange", size: 13, weight: 600 });
    b += arrow(272, cy, 292, cy, { tone: "muted" });
    // the plan
    const px = 294;
    const pw = 164;
    b += rect(px, 20, pw, 172, { tone: "orange", dash: true });
    b += text(px + pw / 2, 40, "the plan", { anchor: "middle", size: 12.5, weight: 700, tone: "orange" });
    const items = ["explain chunking", "explain embeddings", "explain vector index", "explain testing"];
    const ys = [70, 104, 138, 172];
    items.forEach((it, i) => {
      b += text(px + 14, ys[i], `${i + 1}. ${it}`, { baseline: "middle", size: 12.5 });
    });
    // workers
    const wx = 492;
    ys.forEach((y) => {
      b += arrow(px + pw, y, wx - 2, y, { tone: "muted" });
      b += box(wx, y - 14, 90, 28, "worker", { tone: "blue", size: 12.5, weight: 600 });
      b += arrow(wx + 90, y, 628, cy, { tone: "muted" });
    });
    // synthesizer and answer
    b += box(630, cy - 27, 134, 54, ["synthesizer", "one answer"], { tone: "green", size: 13, weight: 600 });
    b += arrow(697, cy + 27, 697, 166, { tone: "muted" });
    b += box(652, 168, 90, 32, "answer", { tone: "grey", size: 13 });
    // notes
    b += text(px + pw / 2, 216, "how many, and which:", { anchor: "middle", size: 12, tone: "orange" });
    b += text(px + pw / 2, 233, "chosen by the model", { anchor: "middle", size: 12, tone: "orange" });
    b += text(wx + 45, 216, "one call each, with the", { anchor: "middle", size: 12, tone: "muted" });
    b += text(wx + 45, 233, "question + its subtask", { anchor: "middle", size: 12, tone: "muted" });
    b += text(16, 270, "Plan once, fan out, combine once. Your code runs every step, so it's a workflow, not an agent.", {
      size: 12.5,
    });
    return svg(
      {
        width: 780,
        height: 284,
        title: "Orchestrator-workers: a model writes the plan, code runs it",
        credit: "Adapted from Anthropic, “Building effective agents” (2024) and its orchestrator-workers cookbook.",
        desc: flow.alt,
      },
      b,
    );
  },
};

export default [flow];
