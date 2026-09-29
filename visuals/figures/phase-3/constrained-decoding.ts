import { arrow, box, circle, esc, fmt, line, path, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Figure 1: sources/willard-efficient-guided-generation.md, Example 1 and Figure 1.
// The regex ([0-9]*)?\.?[0-9]*, its four states, the toy vocabulary A . 42 .2 1,
// and which tokens are allowed per state. States 0, 1 and 3 are stated in the paper;
// state 2 (after a lone dot) follows from the same machine: only digits can follow.
// Figure 2: sources/beurer-kellner-domino.md, Figure 1 token rows (model not named in the paper;
// prompt "A person encoded as JSON object:") and the GSM8K-in-JSON accuracies 41.5 / 30.8 / 41.8.

const CODE_FONT = "'Noto Sans Mono', 'JetBrains Mono', Menlo, Consolas, monospace";
const code = (x: number, y: number, s: string, tone: Tone, size = 13, anchor: "start" | "middle" = "middle", weight = 400) =>
  `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${size}" dominant-baseline="central"${anchor !== "start" ? ` text-anchor="${anchor}"` : ""}${
    weight !== 400 ? ` font-weight="${weight}"` : ""
  } class="t-${tone}" style="font-family:${CODE_FONT}" xml:space="preserve">${esc(s)}</text>`;

const VOCAB = ["A", ".", "42", ".2", "1"];

const fsmIndex: Figure = {
  slug: "fsm-index",
  alt: "The decimal-number pattern as a state machine with four states: start, whole part, dot read, decimal part. Next to each state, the toy vocabulary A, dot, 42, .2 and 1, with the tokens that are allowed from that state highlighted and the rest crossed out. At start, everything but A is allowed. After the token .2 the machine jumps two steps in one token, from start straight to the decimal part, where only 42 and 1 are allowed. Below, the index built ahead of time: a table from each state to its allowed tokens, so each step is a lookup instead of a scan of the vocabulary.",
  render() {
    let b = "";
    // Left: the state machine
    b += text(20, 8, "The pattern ([0-9]*)?\\.?[0-9]* as a state machine", { size: 14, weight: 700, tone: "blue" });
    const S = [
      { id: 0, name: "start", x: 100, y: 110, nx: 100, ny: 70, anchor: "middle" as const },
      { id: 1, name: "whole part", x: 290, y: 110, nx: 290, ny: 152, anchor: "middle" as const },
      { id: 2, name: "dot read", x: 190, y: 250, nx: 156, ny: 254, anchor: "end" as const },
      { id: 3, name: "decimal part", x: 380, y: 250, nx: 380, ny: 292, anchor: "middle" as const },
    ];
    const R = 26;
    // edges
    const edge = (a: number, c: number, label: string, lx: number, ly: number) => {
      const p = S[a], q = S[c];
      const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
      b += arrow(p.x + (dx / d) * R, p.y + (dy / d) * R, q.x - (dx / d) * (R + 3), q.y - (dy / d) * (R + 3), { tone: "muted" });
      b += text(lx, ly, label, { size: 12.5, tone: "muted", anchor: "middle" });
    };
    edge(0, 1, "digit", 195, 98);
    edge(0, 2, "dot", 128, 188);
    edge(1, 2, "dot", 262, 188);
    edge(2, 3, "digit", 285, 240);
    // self loops
    const loop = (i: number, label: string) => {
      const p = S[i];
      b += path(`M${p.x - 12},${p.y - R + 2} C${p.x - 30},${p.y - R - 40} ${p.x + 30},${p.y - R - 40} ${p.x + 12},${p.y - R + 2}`, { tone: "muted", arrow: true });
      b += text(p.x, p.y - R - 38, label, { size: 12.5, tone: "muted", anchor: "middle" });
    };
    loop(1, "digit");
    loop(3, "digit");
    // the .2 jump: from state 0, under state 2, into state 3
    b += path(`M${S[0].x - 8},${S[0].y + R - 2} C${40},${330} ${260},${340} ${S[3].x - R + 4},${S[3].y + 16}`, {
      tone: "orange",
      dash: true,
      arrow: true,
      sw: 2,
    });
    b += text(230, 345, "one token \".2\" = dot + digit, two steps at once", { size: 12.5, tone: "orange", anchor: "middle", weight: 600 });
    for (const s of S) {
      b += circle(s.x, s.y, R, { tone: "blue", fill: "soft", stroke: true });
      b += text(s.x, s.y, String(s.id), { anchor: "middle", baseline: "middle", size: 15, weight: 700, tone: "blue" });
      b += text(s.nx, s.ny, s.name, { anchor: s.anchor, size: 12.5 });
    }

    // Right: the index
    const X = 490;
    b += line(X - 20, 0, X - 20, 355, { tone: "grid", sw: 1 });
    b += text(X, 8, "The index, built before generation", { size: 14, weight: 700, tone: "green" });
    b += text(X, 30, "state in, allowed tokens out (vocabulary: A . 42 .2 1)", { size: 12.5, tone: "muted" });
    const allowed: Record<number, string[]> = {
      0: [".", "42", ".2", "1"],
      1: [".", "42", ".2", "1"],
      2: ["42", "1"],
      3: ["42", "1"],
    };
    const cw = 58;
    const rowH = 56;
    S.forEach((s, i) => {
      const y = 56 + i * rowH;
      b += box(X, y, 40, 40, String(s.id), { tone: "blue", size: 14, weight: 700, r: 20 });
      VOCAB.forEach((v, j) => {
        const ok = allowed[s.id].includes(v);
        const x = X + 60 + j * cw;
        b += rect(x, y + 4, cw - 8, 32, { tone: ok ? "green" : "grey", fill: ok ? "soft" : "none", r: 4, dash: !ok });
        b += code(x + (cw - 8) / 2, y + 20, v, ok ? "green" : "grey", 13.5, "middle", ok ? 700 : 400);
        if (!ok) b += line(x + 6, y + 30, x + cw - 14, y + 10, { tone: "red", sw: 1.5 });
      });
    });
    b += text(X, 56 + 4 * rowH + 10, "At run time you track the state and look up the mask:", { size: 12.5 });
    b += text(X, 56 + 4 * rowH + 28, "no scan of the whole vocabulary per token.", { size: 12.5 });
    return svg(
      {
        width: 880,
        height: 362,
        title: "Tokens can cross grammar steps, so the index is built per state",
        credit: "Adapted from Willard & Louf, “Efficient Guided Generation for Large Language Models” (2023), Example 1 and Figure 1.",
        desc: fsmIndex.alt,
      },
      b,
    );
  },
};

type Tok = { s: string; odd?: boolean };
const FREE: Tok[] = ["{", "↵", "···", "·\"", "name", "\":", "·\"", "John", "·Do", "e", "\","].map((s) => ({ s }));
const NAIVE: Tok[] = [
  { s: "{" },
  { s: "↵" },
  { s: "···" },
  { s: "⇥", odd: true },
  { s: "\"" },
  { s: "name" },
  { s: "\"" },
  { s: "⇥", odd: true },
  { s: ":" },
  { s: "⇥", odd: true },
  { s: "\"" },
  { s: "John" },
  { s: "·Do" },
  { s: "e" },
  { s: "\"" },
];

const misalignment: Figure = {
  slug: "misalignment",
  alt: "Two ways to constrain the same JSON. Top, the tokens a model writes on its own after an opening brace: a space-quote token, name, quote-colon, space-quote, John. Middle, a naive engine that only allows a lone quote or whitespace next: the model writes a tab, a lone quote, name, a lone quote, a tab, a colon, a tab. Bottom, a bar chart of accuracy on a JSON version of GSM8K: unconstrained 41.5%, naive constraining 30.8%, token-aligned constraining 41.8%.",
  render() {
    let b = "";
    const row = (y: number, label: string, sub: string, toks: Tok[], tone: Tone) => {
      b += text(20, y + 8, label, { size: 13.5, weight: 700, tone });
      b += text(20, y + 26, sub, { size: 12, tone: "muted" });
      let x = 210;
      for (const t of toks) {
        const w = Math.max(28, t.s.length * 8.2 + 14);
        b += rect(x, y, w, 30, { tone: t.odd ? "red" : tone, fill: "soft", r: 4 });
        b += code(x + w / 2, y + 15, t.s, t.odd ? "red" : "ink", 13.5);
        x += w + 5;
      }
    };
    row(4, "On its own", "unconstrained", FREE, "blue");
    row(58, "Naive engine", "only lone \" or whitespace", NAIVE, "orange");
    b += text(210, 110, "· = space   ↵ = newline   ⇥ = tab (a token the model would not have picked)", { size: 12, tone: "muted" });

    // bars
    const top = 150;
    b += line(20, top - 12, 860, top - 12, { tone: "grid", sw: 1 });
    b += text(20, top + 8, "Accuracy on GSM8K with answers as JSON (Mistral 7B, five-shot)", { size: 13.5, weight: 600 });
    const bars: { label: string; v: number; tone: Tone }[] = [
      { label: "unconstrained", v: 41.5, tone: "blue" },
      { label: "naive constraining", v: 30.8, tone: "red" },
      { label: "token-aligned (DOMINO)", v: 41.8, tone: "green" },
    ];
    const x0 = 210;
    const scale = (v: number) => (v / 50) * 520;
    bars.forEach((bar, i) => {
      const y = top + 28 + i * 36;
      b += text(x0 - 10, y + 12, bar.label, { anchor: "end", baseline: "middle", size: 13 });
      b += rect(x0, y, scale(bar.v), 24, { tone: bar.tone, fill: "solid", stroke: false, r: 2 });
      b += text(x0 + scale(bar.v) + 8, y + 12, `${bar.v}%`, { baseline: "middle", size: 13, weight: 700, tone: bar.tone });
    });
    b += line(x0, top + 22, x0, top + 28 + 3 * 36 - 6, { tone: "axis" });
    return svg(
      {
        width: 880,
        height: top + 28 + 3 * 36,
        title: "A naive engine forces odd tokens, and accuracy drops",
        credit: "Adapted from Beurer-Kellner, Fischer & Vechev, “Guiding LLMs The Right Way” (2024), Figure 1 and section 2.",
        desc: misalignment.alt,
      },
      b,
    );
  },
};

export default [fsmIndex, misalignment];
