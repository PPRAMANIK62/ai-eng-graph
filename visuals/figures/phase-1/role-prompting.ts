import { arrow, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Rows from the table in nodes/phase-1/role-prompting.md, checked against
// sources/basil-expert-personas.md. Directions only: the paper's abstract
// gives no single number per row, so the arrows show "no change / sometimes
// worse / often worse", not a measured size.
type Row = { name: string; example: string[]; effect: string; detail: string; tone: Tone; drop: number; glyph: "cap" | "swap" | "toy" };
const ROWS: Row[] = [
  {
    name: "Matching expert",
    example: ["\"You are a world-class expert in", "physics...\" on physics questions"],
    effect: "No significant change",
    detail: "except Gemini 2.0 Flash",
    tone: "grey",
    drop: 0,
    glyph: "cap",
  },
  {
    name: "Wrong-field expert",
    example: ["A physics expert on", "law questions"],
    effect: "Sometimes worse",
    detail: "small differences",
    tone: "orange",
    drop: 12,
    glyph: "swap",
  },
  {
    name: "Low-knowledge persona",
    example: ["\"You are a 4-year-old toddler who", "thinks the moon is made of cheese.\""],
    effect: "Often worse",
    detail: "",
    tone: "red",
    drop: 26,
    glyph: "toy",
  },
];

/** A simple person icon with a small badge for the kind of persona. */
function person(cx: number, cy: number, tone: Tone, glyph: Row["glyph"]) {
  let s = `<circle cx="${cx}" cy="${cy}" r="26" class="fs-${tone} s-${tone}" stroke-width="1.5"/>`;
  s += `<circle cx="${cx}" cy="${cy - 7}" r="7" class="f-${tone}"/>`;
  s += `<path d="M${cx - 12},${cy + 14} Q${cx},${cy - 4} ${cx + 12},${cy + 14}" class="f-${tone}"/>`;
  const bx = cx + 19, by = cy + 17;
  s += `<circle cx="${bx}" cy="${by}" r="10" class="bg s-${tone}" stroke-width="1.5"/>`;
  if (glyph === "cap") s += `<path d="M${bx - 4.5},${by} L${bx - 1},${by + 3.5} L${bx + 5},${by - 3.5}" class="s-${tone}" stroke-width="2" fill="none"/>`;
  else s += text(bx, by + 0.5, glyph === "swap" ? "≠" : "?", { anchor: "middle", baseline: "middle", size: 12, weight: 700, tone });
  return s;
}

const figure: Figure = {
  slug: "persona-accuracy",
  alt: "Three personas and what they did to accuracy on hard multiple-choice questions in a 2025 study. A matching expert persona left accuracy flat. An expert from the wrong field sometimes made it slightly worse. A low-knowledge persona, a 4-year-old toddler, often made it worse.",
  render() {
    const x0 = 24, rowH = 86, top = 30, W = 820;
    const colPersona = x0 + 80, colArrow = 450, colEffect = 590;
    let b = "";
    b += text(colPersona, 8, "Persona in the prompt", { size: 12.5, tone: "muted", weight: 600 });
    b += text(colArrow, 8, "Accuracy vs. no persona", { size: 12.5, tone: "muted", weight: 600 });

    ROWS.forEach((r, i) => {
      const y = top + i * rowH;
      const cy = y + rowH / 2;
      if (i > 0) b += `<line x1="${x0}" y1="${y}" x2="${W - x0}" y2="${y}" class="grid" stroke-width="1"/>`;
      b += person(x0 + 34, cy, r.tone, r.glyph);
      b += text(colPersona, cy - 20, r.name, { size: 15, weight: 700 });
      b += text(colPersona, cy + 2, r.example[0]!, { size: 12.5, tone: "muted", italic: true });
      b += text(colPersona, cy + 20, r.example[1]!, { size: 12.5, tone: "muted", italic: true });

      // accuracy arrow: flat, slightly down, down (direction only)
      const ax = colArrow, len = 110;
      b += arrow(ax, cy - r.drop / 2, ax + len, cy + r.drop / 2, { tone: r.tone === "grey" ? "muted" : r.tone, sw: 2.2 });
      b += text(colEffect, cy - (r.detail ? 6 : -1), r.effect, { size: 14, weight: 600, tone: r.tone === "grey" ? "ink" : r.tone, baseline: "middle" });
      if (r.detail) b += text(colEffect, cy + 14, r.detail, { size: 12.5, tone: "muted", baseline: "middle" });
    });

    const by = top + ROWS.length * rowH + 14;
    b += rect(x0, by, W - 2 * x0, 50, { tone: "grey", fill: "soft", stroke: false, r: 6 });
    b += text(x0 + 14, by + 20, "2025, GPQA Diamond and MMLU-Pro, 25 runs per question: GPT-4o, GPT-4o-mini, o3-mini, o4-mini,", { size: 12.5, tone: "muted" });
    b += text(x0 + 14, by + 38, "Gemini 2.0 Flash, Gemini 2.5 Flash. Arrows show direction only, not the size of the change.", { size: 12.5, tone: "muted" });

    return svg(
      {
        width: W,
        height: by + 50,
        title: "An expert role doesn't raise accuracy, and the wrong role can lower it",
        credit: "Based on Basil et al. (Wharton), 2025, \"Playing Pretend\".",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
