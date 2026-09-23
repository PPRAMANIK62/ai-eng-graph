import { arrow, esc, fmt, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// The email, the four fields and the three approaches come from nodes/phase-1/structured-output.md
// (sources/openai-structured-outputs.md, sources/anthropic-structured-outputs.md).
// The failing replies are made-up examples of the failure each approach allows, and the
// probabilities in the second figure are made up too. Both figures say so.

// Noto Sans Mono first: the PNG preview renderer falls back to a proportional font otherwise.
const CODE_FONT = "'Noto Sans Mono', 'JetBrains Mono', Menlo, Consolas, monospace";
const code = (x: number, y: number, s: string, tone: Tone, size = 12.5, anchor: "start" | "end" | "middle" = "start", weight = 400) =>
  `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${size}" dominant-baseline="central"${anchor !== "start" ? ` text-anchor="${anchor}"` : ""}${
    weight !== 400 ? ` font-weight="${weight}"` : ""
  } class="t-${tone}" style="font-family:${CODE_FONT}" xml:space="preserve">${esc(s)}</text>`;

type Row = { name: string; word: string; tone: Tone; how: string; reply: { s: string; bad?: boolean }[]; notes: string[] };

const ROWS: Row[] = [
  {
    name: "Just ask",
    word: "hopes",
    tone: "red",
    how: "\"Reply only with JSON like…\"",
    reply: [
      { s: "```json", bad: true },
      { s: "{\"name\": \"John Smith\"," },
      { s: " \"email\": \"john@example.com\"," },
      { s: " \"plan_interest\": \"Enterprise\"}" },
      { s: "```", bad: true },
    ],
    notes: ["Wrapped in code fences,", "so it doesn't parse.", "demo_requested is missing."],
  },
  {
    name: "JSON mode",
    word: "parses",
    tone: "orange",
    how: "type: \"json_object\"",
    reply: [
      { s: "{\"customer\": \"John Smith\",", bad: true },
      { s: " \"contact\": \"john@example.com\",", bad: true },
      { s: " \"wants_demo\": \"yes\"}", bad: true },
    ],
    notes: ["Valid JSON, but the keys", "and types are the model's", "choice, not yours."],
  },
  {
    name: "Strict schema",
    word: "matches",
    tone: "green",
    how: "schema + strict mode",
    reply: [
      { s: "{\"name\": \"John Smith\"," },
      { s: " \"email\": \"john@example.com\"," },
      { s: " \"plan_interest\": \"Enterprise\"," },
      { s: " \"demo_requested\": true}" },
    ],
    notes: ["Every required key,", "every type right.", "(Values can still be wrong.)"],
  },
];

const levels: Figure = {
  slug: "three-levels",
  alt: "The same sales email sent three ways. Just asking in the prompt can return JSON wrapped in code fences with the demo_requested field missing. JSON mode returns valid JSON but with its own keys, like customer and wants_demo set to \"yes\". A strict schema returns exactly the four fields: name, email, plan_interest and demo_requested as true. The labels read hopes, parses and matches.",
  render() {
    const X = 24, LW = 236, RX = 296, RW = 330, NX = 654, LH = 19, PAD = 12, GAP = 16;
    let b = "";
    // input email
    b += rect(X, 0, 880 - X, 46, { tone: "grey", r: 6, sw: 1.1 });
    b += text(X + 14, 16, "Same input for all three:", { baseline: "middle", size: 12.5, weight: 600, tone: "muted" });
    b += text(X + 14, 33, "John Smith (john@example.com) is interested in our Enterprise plan and wants to schedule a demo for next Tuesday at 2pm.", {
      baseline: "middle",
      size: 12.5,
      italic: true,
    });
    let y = 66;
    for (const r of ROWS) {
      const h = Math.max(r.reply.length, 4) * LH + PAD * 2;
      // left: approach
      b += rect(X, y, LW, h, { tone: r.tone, r: 8, sw: 1.5 });
      b += text(X + 14, y + 24, r.name, { size: 15, weight: 700 });
      b += code(X + 14, y + 46, r.how, "muted", 11.5);
      b += text(X + LW - 14, y + h - 16, r.word, { anchor: "end", size: 15, weight: 700, tone: r.tone, italic: true });
      b += arrow(X + LW + 6, y + h / 2, RX - 6, y + h / 2, { tone: "muted" });
      // middle: reply
      b += rect(RX, y, RW, h, { tone: r.tone, fill: "none", r: 6, sw: 1.5 });
      const top = y + h / 2 - ((r.reply.length - 1) * LH) / 2;
      r.reply.forEach((l, i) => {
        b += code(RX + 14, top + i * LH, l.s, l.bad ? r.tone : "ink", 12.5, "start", l.bad ? 700 : 400);
      });
      // right: what went wrong or right
      const nTop = y + h / 2 - ((r.notes.length - 1) * 18) / 2;
      r.notes.forEach((n, i) => (b += text(NX, nTop + i * 18, n, { baseline: "middle", size: 13, tone: i === r.notes.length - 1 && r.tone === "green" ? "muted" : "ink" })));
      y += h + GAP;
    }
    return svg(
      {
        width: 900,
        height: y - GAP,
        title: "What each way of asking for JSON actually guarantees",
        credit: "Example replies made up to show what each approach allows. Not recorded model output.",
        desc: levels.alt,
      },
      b,
    );
  },
};

// Made-up probabilities for the next token after {"demo_requested": . Illustrative only.
const TOKENS: { tok: string; p: number; ok: boolean }[] = [
  { tok: "true", p: 0.46, ok: true },
  { tok: "false", p: 0.22, ok: true },
  { tok: "yes", p: 0.14, ok: false },
  { tok: "\"", p: 0.1, ok: false },
  { tok: "maybe", p: 0.08, ok: false },
];

const step: Figure = {
  slug: "one-step",
  alt: "One generation step with a strict schema. The JSON so far is {\"demo_requested\": . The model gives probabilities to true, false, yes, a quote mark and maybe. The grammar then rules out yes, the quote mark and maybe, which are greyed out and crossed, so only true and false are left to sample from. The probabilities are illustrative.",
  render() {
    const top = 44, rowH = 34, barMax = 150;
    const panel1 = 24, panel2 = 300, panel3 = 610;
    let b = "";
    // headers
    b += text(panel1, 16, "1. JSON so far", { size: 14, weight: 600 });
    b += text(panel2, 16, "2. The model's probabilities", { size: 14, weight: 600 });
    b += text(panel3, 16, "3. After the grammar", { size: 14, weight: 600 });
    // panel 1
    const midY = top + (TOKENS.length * rowH) / 2;
    b += rect(panel1, midY - 26, 226, 52, { tone: "grey", r: 6, sw: 1.2 });
    b += code(panel1 + 14, midY, "{\"demo_requested\": ", "ink", 13.5);
    b += rect(panel1 + 14 + 19 * 8.1, midY - 10, 2, 20, { tone: "blue", fill: "solid", stroke: false, r: 0 });
    b += text(panel1, midY + 50, "The schema says this", { size: 12.5, tone: "muted" });
    b += text(panel1, midY + 67, "field is a boolean.", { size: 12.5, tone: "muted" });
    b += arrow(panel1 + 234, midY, panel2 - 10, midY, { tone: "muted" });
    // bars
    const bars = (x0: number, filtered: boolean) => {
      let s = "";
      TOKENS.forEach((t, i) => {
        const y = top + i * rowH;
        const off = filtered && !t.ok;
        const tone: Tone = off ? "grey" : t.ok || !filtered ? "blue" : "grey";
        s += code(x0 + 56, y + rowH / 2, t.tok, off ? "muted" : "ink", 13, "end", 600);
        const w = t.p * barMax / 0.46;
        s += rect(x0 + 66, y + 7, w, rowH - 14, { tone, fill: off ? "soft" : "solid", stroke: off, r: 2, sw: 1, opacity: off ? 0.7 : 1 });
        if (off) {
          s += line(x0 + 60, y + rowH / 2, x0 + 66 + w + 6, y + rowH / 2, { tone: "red", sw: 1.8 });
          s += text(x0 + 66 + w + 14, y + rowH / 2, "ruled out", { baseline: "middle", size: 12.5, tone: "red" });
        } else {
          s += text(x0 + 66 + w + 8, y + rowH / 2, t.p.toFixed(2), { baseline: "middle", size: 12.5, weight: 600, tone: "blue" });
        }
      });
      return s;
    };
    b += bars(panel2, false);
    b += arrow(panel3 - 76, midY, panel3 - 16, midY, { tone: "muted" });
    b += bars(panel3, true);
    const by = top + TOKENS.length * rowH + 20;
    b += text(panel3, by, "Sample from true or false only.", { size: 13, weight: 600, tone: "green" });
    b += text(panel2, by, "The model still does the predicting.", { size: 13, tone: "muted" });
    return svg(
      {
        width: 900,
        height: by + 8,
        title: "Constrained decoding: the grammar removes choices, the model still predicts",
        credit: "Illustrative probabilities, not measured. Real tokenizers may split these words differently.",
        desc: step.alt,
      },
      b,
    );
  },
};

export default [levels, step];
