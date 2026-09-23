import { arrow, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Levels, "who sets it" and "overridden by" from the table in
// nodes/phase-1/system-prompt.md, checked against sources/openai-model-spec.md.
const LEVELS: { name: string; who: string; by: string; tone: Tone }[] = [
  { name: "Root", who: "the spec itself", by: "nothing", tone: "purple" },
  { name: "System", who: "OpenAI", by: "root", tone: "purple" },
  { name: "Developer", who: "you, the app builder", by: "root, system", tone: "blue" },
  { name: "User", who: "the person chatting", by: "developer, system, root", tone: "green" },
  { name: "Guideline", who: "defaults", by: "anyone, even implicitly", tone: "grey" },
];

const figure: Figure = {
  slug: "chain-of-command",
  alt: "The chain of command from OpenAI's Model Spec as a ladder of five levels, from top to bottom: root (the spec itself), system (OpenAI), developer (you, the app builder), user (the person chatting) and guideline (defaults). Each level can be overridden only by the levels above it. Beside the ladder, a separate box for data such as quoted text, files, tool outputs and images, marked as having no authority by default.",
  render() {
    const x0 = 70, bw = 420, bh = 50, gap = 16, top = 10;
    let b = "";

    // Authority arrow on the left
    const yEnd = top + LEVELS.length * (bh + gap) - gap;
    b += arrow(38, yEnd, 38, top + 4, { tone: "muted", sw: 2 });
    b += text(26, (top + yEnd) / 2, "more authority", { anchor: "middle", size: 12.5, tone: "muted", rotate: -90 });

    LEVELS.forEach((l, i) => {
      const y = top + i * (bh + gap);
      const mine = l.name === "Developer";
      b += rect(x0, y, bw, bh, { tone: l.tone, fill: "soft", r: 8, sw: mine ? 2.5 : 1.5 });
      b += text(x0 + 16, y + 20, l.name, { size: 15, weight: 700, tone: l.tone === "grey" ? "ink" : l.tone });
      b += text(x0 + 16, y + 38, l.who, { size: 12.5, tone: "muted" });
      b += text(x0 + bw - 16, y + 20, "overridden by", { anchor: "end", size: 11.5, tone: "muted" });
      b += text(x0 + bw - 16, y + 38, l.by, { anchor: "end", size: 13, weight: 600 });
      if (i < LEVELS.length - 1) {
        // small "overrides" arrow down to the next rung
        const ax = x0 + 150;
        b += arrow(ax, y + bh + 1, ax, y + bh + gap - 1, { tone: "muted" });
        if (i === 0) b += text(ax + 10, y + bh + gap / 2, "overrides", { baseline: "middle", size: 11.5, tone: "muted" });
      }
    });

    // Where your prompt lands
    const devY = top + 2 * (bh + gap);
    b += arrow(x0 + bw + 44, devY + bh / 2, x0 + bw + 8, devY + bh / 2, { tone: "blue" });
    b += text(x0 + bw + 52, devY + 20, "your instructions go here", { size: 12.5, weight: 600, tone: "blue" });
    b += text(x0 + bw + 52, devY + 38, "(on Claude: the system field)", { size: 12.5, tone: "blue" });

    // Data box, off the ladder
    const dx = x0 + bw + 90, dw = 220, dy = top + 3 * (bh + gap) - 6, dh = 2 * bh + gap + 12;
    b += rect(dx, dy, dw, dh, { tone: "red", fill: "none", r: 8, dash: true });
    b += text(dx + 16, dy + 24, "Data", { size: 15, weight: 700, tone: "red" });
    b += text(dx + 16, dy + 46, "quoted text, files,", { size: 13 });
    b += text(dx + 16, dy + 64, "tool outputs, images", { size: 13 });
    b += rect(dx + 16, dy + 80, 162, 26, { tone: "red", fill: "soft", r: 13, stroke: false });
    b += text(dx + 97, dy + 93, "no authority by default", { anchor: "middle", baseline: "middle", size: 12.5, weight: 600, tone: "red" });
    b += text(dx + dw - 16, dy + 24, "not a level", { anchor: "end", size: 12, tone: "muted" });

    return svg(
      {
        width: dx + dw + 24,
        height: yEnd + 14,
        title: "Who can override whom: OpenAI's chain of command",
        credit: "Adapted from the OpenAI Model Spec (2026-08-18). Learned behavior, not enforced by the API.",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
