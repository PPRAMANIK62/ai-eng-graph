import { arrow, box, path, svg, text, type Figure } from "../../lib/svg.ts";

// The outline → check → write example from sources/anthropic-building-effective-agents.md
// (Workflow: Prompt chaining), with the "gate" between steps. Redrawn, not traced.
const chain: Figure = {
  slug: "outline-chain",
  alt: "A three-step prompt chain. Call 1 writes an outline. A gate in code checks the outline against fixed rules; if it fails, the chain stops or retries. If it passes, call 2 writes the document from the outline. Each arrow carries the previous step's output as the next step's input.",
  render() {
    let b = "";
    const y = 40;
    b += box(20, y, 90, 44, "topic", { tone: "grey", size: 13.5 });
    b += arrow(110, y + 22, 136, y + 22, { tone: "muted" });
    b += box(138, y, 140, 44, ["call 1", "write an outline"], { tone: "blue", size: 13, weight: 600 });
    b += arrow(278, y + 22, 330, y + 22, { tone: "muted" });
    b += text(304, y + 10, "outline", { anchor: "middle", size: 12, tone: "muted" });
    // gate diamond
    const gx = 378;
    b += path(`M${gx},${y - 10} L${gx + 46},${y + 22} L${gx},${y + 54} L${gx - 46},${y + 22} Z`, { tone: "orange", fill: "orange", fillSoft: true });
    b += text(gx, y + 17, "gate", { anchor: "middle", size: 13, weight: 700, tone: "orange" });
    b += text(gx, y + 33, "(code)", { anchor: "middle", size: 12, tone: "orange" });
    b += text(gx, y + 76, "required sections?", { anchor: "middle", size: 12, tone: "muted" });
    b += text(gx, y + 92, "under the length limit?", { anchor: "middle", size: 12, tone: "muted" });
    b += arrow(gx + 46, y + 22, gx + 92, y + 22, { tone: "green" });
    b += text(gx + 68, y + 12, "pass", { anchor: "middle", size: 12, tone: "green" });
    b += box(gx + 94, y, 160, 44, ["call 2", "write the document"], { tone: "blue", size: 13, weight: 600 });
    b += arrow(gx + 254, y + 22, gx + 282, y + 22, { tone: "muted" });
    b += box(gx + 284, y, 96, 44, "document", { tone: "grey", size: 13.5 });
    // fail branch
    b += arrow(gx, y + 100, gx, y + 136, { tone: "red", dash: true });
    b += text(gx, y + 154, "fail: stop or retry call 1", { anchor: "middle", size: 12.5, tone: "red" });
    b += text(20, y + 154, "Each step is its own API call:", { size: 12.5 });
    b += text(20, y + 172, "log, test or branch on any of them.", { size: 12.5 });
    return svg(
      {
        width: 780,
        height: y + 184,
        title: "A prompt chain: each step feeds the next, with a check between",
        credit: "Example adapted from Anthropic, “Building effective agents” (2024).",
        desc: chain.alt,
      },
      b,
    );
  },
};

export default [chain];
