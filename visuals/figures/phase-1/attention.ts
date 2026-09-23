import { arrow, circle, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Tokens from the running example in nodes/phase-1/attention.md (3Blue1Brown's lesson).
// The weights are made up to show the shape the article describes: creature pulls
// mostly from fluffy and blue, forest mostly from verdant. They are not measured.
const TOKENS = ["a", "fluffy", "blue", "creature", "roamed", "the", "verdant", "forest"];

// Row = query token, column = key token. Each row sums to 1 over columns <= row.
const W: number[][] = [
  [1],
  [0.3, 0.7],
  [0.2, 0.2, 0.6],
  [0.06, 0.4, 0.4, 0.14],
  [0.05, 0.05, 0.05, 0.6, 0.25],
  [0.1, 0.05, 0.05, 0.1, 0.2, 0.5],
  [0.05, 0.05, 0.05, 0.05, 0.1, 0.2, 0.5],
  [0.04, 0.02, 0.02, 0.04, 0.08, 0.15, 0.5, 0.15],
];
const CREATURE = 3;

const figure: Figure = {
  slug: "pattern",
  alt: "An attention grid for the phrase a fluffy blue creature roamed the verdant forest, with queries as rows and keys as columns. Dots show the weights: creature takes most from fluffy and blue, forest takes most from verdant. Every cell above the diagonal is masked to 0. On the right, the creature row is pulled out: its weights times the value vectors of fluffy, blue and the rest add up to one change that is added to creature.",
  render() {
    const cell = 44;
    const gx = 110; // grid left
    const gy = 96; // grid top
    const n = TOKENS.length;
    let b = "";

    // Axis captions
    b += text(gx + (n * cell) / 2, 10, "keys: the tokens being looked at", { anchor: "middle", size: 12.5, tone: "muted" });
    b += text(14, gy + (n * cell) / 2, "queries: the token looking back", { anchor: "middle", size: 12.5, tone: "muted", rotate: -90, baseline: "middle" });

    // Column labels, slanted
    TOKENS.forEach((t, j) => {
      const x = gx + j * cell + cell / 2;
      b += text(x - 2, gy - 10, t, { size: 13, rotate: -40, tone: j === 1 || j === 2 || j === 6 ? "blue" : "ink" });
    });

    // Highlight the creature row
    b += rect(gx - 84, gy + CREATURE * cell + 2, n * cell + 88, cell - 4, { tone: "orange", fill: "soft", stroke: false, r: 6, opacity: 0.8 });

    // Cells
    for (let i = 0; i < n; i++) {
      b += text(gx - 12, gy + i * cell + cell / 2, TOKENS[i]!, {
        anchor: "end",
        baseline: "middle",
        size: 13,
        weight: i === CREATURE ? 600 : undefined,
        tone: i === CREATURE ? "orange" : "ink",
      });
      for (let j = 0; j < n; j++) {
        const x = gx + j * cell;
        const y = gy + i * cell;
        if (j > i) {
          b += rect(x + 1, y + 1, cell - 2, cell - 2, { tone: "grey", fill: "soft", stroke: false, r: 3 });
          b += text(x + cell / 2, y + cell / 2, "0", { anchor: "middle", baseline: "middle", size: 12, tone: "muted" });
        } else {
          b += rect(x + 1, y + 1, cell - 2, cell - 2, { tone: "grey", fill: "none", r: 3, sw: 1 });
          const w = W[i]![j]!;
          const tone: Tone = i === CREATURE ? "orange" : "blue";
          b += circle(x + cell / 2, y + cell / 2, Math.max(2, Math.sqrt(w) * (cell / 2 - 3)), { tone });
        }
      }
    }
    // Mask label in the upper triangle
    b += box2(gx + 4 * cell + 2, gy + 1.5 * cell - 13, "masked: later tokens, 0");

    b += text(gx + (n * cell) / 2, gy + n * cell + 22, "Dot size = attention weight. Each row adds up to 1.", { anchor: "middle", size: 12.5, tone: "muted" });

    // Right panel: the creature row, blended into one change
    const px = gx + n * cell + 60;
    b += text(px, gy - 34, "Pulling out the creature row", { size: 14.5, weight: 600 });
    b += text(px, gy - 14, "weight × value vector, then add them up", { size: 12.5, tone: "muted" });

    const parts: { label: string; w: string; dx: number; dy: number; tone: Tone }[] = [
      { label: "value of fluffy", w: "0.40", dx: 80, dy: -80, tone: "blue" },
      { label: "value of blue", w: "0.40", dx: 110, dy: 10, tone: "purple" },
      { label: "values of a, creature", w: "0.20", dx: 34, dy: -30, tone: "grey" },
    ];
    let ly = gy + 20;
    for (const p of parts) {
      b += rect(px, ly - 12, 14, 14, { tone: p.tone, fill: "solid", stroke: false, r: 3 });
      b += text(px + 22, ly, `${p.w} × ${p.label}`, { size: 13, baseline: "middle" });
      ly += 26;
    }

    // Tip-to-tail sum
    const ox = px + 10;
    const oy = gy + 230;
    let cx = ox;
    let cy = oy;
    for (const p of parts) {
      b += arrow(cx, cy, cx + p.dx, cy + p.dy, { tone: p.tone, sw: 2.5 });
      cx += p.dx;
      cy += p.dy;
    }
    b += arrow(ox, oy, cx, cy, { tone: "orange", sw: 3.5 });
    b += circle(ox, oy, 3.5, { tone: "ink" });
    b += text(ox + 30, oy + 30, "change added to creature", { size: 13.5, weight: 600, tone: "orange" });
    b += text(px, oy + 90, "creature's vector + this change", { size: 12.5, tone: "muted" });
    b += text(px, oy + 108, "is now closer to \"fluffy blue creature\"", { size: 12.5, tone: "muted" });

    return svg(
      {
        width: px + 300,
        height: gy + n * cell + 34,
        title: "The attention pattern: who each token looks at, and what it takes",
        credit: "Illustrative weights, not measured from a real model. Adapted from 3Blue1Brown, “Attention in transformers, step-by-step” (2024).",
        desc: figure.alt,
      },
      b,
    );
  },
};

function box2(x: number, y: number, label: string) {
  const w = 172;
  return `<rect x="${x}" y="${y}" width="${w}" height="26" rx="13" class="bg s-grey" stroke-width="1"/>` + text(x + w / 2, y + 13, label, { anchor: "middle", baseline: "middle", size: 12.5, tone: "muted" });
}

export default [figure];
