import { box, bracket, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// sources/lindenbauer-complexity-trap.md: masking replaces environment
// observations older than the last M=10 turns with a placeholder and keeps the
// reasoning and actions; LLM summary replaces older turns with a running
// summary and keeps M=10 recent turns in full. 14 turns drawn for space.
const TURNS = 14;
const KEEP = 10;

const methods: Figure = {
  slug: "methods",
  alt: "Three versions of the same agent run of 14 turns. Raw: every turn keeps its reasoning, tool call and full tool output. Observation masking: every turn keeps its reasoning and tool call, but tool outputs older than the last 10 turns become a one-line placeholder. LLM summary: the older turns are replaced by one model-written summary, and the last 10 turns are kept in full.",
  render() {
    let b = "";
    const x0 = 170;
    const cw = 44;
    const gap = 6;
    const rowH = 110;
    const turn = (x: number, y: number, masked: boolean) => {
      let s = rect(x, y, cw, 14, { tone: "blue", fill: "solid", stroke: false, r: 2 });
      s += rect(x, y + 17, cw, 12, { tone: "purple", fill: "solid", stroke: false, r: 2 });
      s += masked
        ? rect(x, y + 32, cw, 6, { tone: "grey", fill: "none", r: 2, dash: true, sw: 1.2 })
        : rect(x, y + 32, cw, 52, { tone: "grey", fill: "soft", r: 2 });
      return s;
    };
    const rows: { label: string[]; kind: "raw" | "mask" | "sum"; tone: Tone }[] = [
      { label: ["Raw", "nothing removed"], kind: "raw", tone: "ink" },
      { label: ["Observation", "masking"], kind: "mask", tone: "green" },
      { label: ["LLM summary"], kind: "sum", tone: "orange" },
    ];
    rows.forEach((r, ri) => {
      const y = 30 + ri * rowH;
      r.label.forEach((l, li) => b += text(20, y + 30 + li * 18, l, { size: 14, weight: li === 0 ? 700 : 400, tone: li === 0 ? r.tone : "muted" }));
      const old = TURNS - KEEP;
      if (r.kind === "sum") {
        const w = old * (cw + gap) - gap;
        b += box(x0, y, w, 84, ["one summary", "written by", "a model"], { tone: "orange", size: 13 });
      }
      for (let i = 0; i < TURNS; i++) {
        if (r.kind === "sum" && i < old) continue;
        b += turn(x0 + i * (cw + gap), y, r.kind === "mask" && i < old);
      }
    });
    // bracket for kept turns
    const kx1 = x0 + (TURNS - KEEP) * (cw + gap);
    const kx2 = x0 + TURNS * (cw + gap) - gap;
    b += bracket(kx1, kx2, 18, "last 10 turns kept in full", { up: false, size: 12.5 });
    b += bracket(x0, kx1 - gap, 18, "older turns", { up: false, size: 12.5 });
    // legend
    const ly = 30 + 3 * rowH + 4;
    const items: [Tone, string, boolean][] = [
      ["blue", "reasoning", false],
      ["purple", "tool call", false],
      ["grey", "tool output", false],
      ["grey", "placeholder: \"lines omitted\"", true],
    ];
    let lx = x0;
    for (const [tone, label, dashed] of items) {
      b += dashed
        ? rect(lx, ly, 16, 6, { tone, fill: "none", dash: true, sw: 1.2, r: 2 })
        : rect(lx, ly - 4, 16, 12, { tone, fill: tone === "grey" ? "soft" : "solid", stroke: tone === "grey", r: 2 });
      b += text(lx + 22, ly + 3, label, { size: 12.5, baseline: "middle" });
      lx += 60 + label.length * 6.8;
    }
    return svg(
      {
        width: x0 + TURNS * (cw + gap) + 14,
        height: ly + 16,
        title: "Two ways to shrink an agent's history",
        credit: "Adapted from Lindenbauer et al. (JetBrains), “The Complexity Trap” (2025).",
        desc: methods.alt,
      },
      b,
    );
  },
};

export default [methods];
