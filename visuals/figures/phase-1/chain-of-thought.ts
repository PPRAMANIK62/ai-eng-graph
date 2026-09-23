import { barsH } from "../../lib/chart.ts";
import { line, rect, svg, text, wrap, type Figure, type Tone } from "../../lib/svg.ts";

// All prompt and output text: sources/wei-chain-of-thought.md (Figure 1).
const Q1 = "Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?";
const Q2 = "The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?";
const A_STD = "The answer is 11.";
const A_COT_WORK = "Roger started with 5 balls. 2 cans of 3 tennis balls each is 6 tennis balls. 5 + 6 = 11.";
const OUT_STD = "The answer is 27.";
const OUT_COT_WORK = "The cafeteria had 23 apples originally. They used 20 to make lunch. So they had 23 - 20 = 3. They bought 6 more apples, so they have 3 + 6 = 9.";

const side: Figure = {
  slug: "standard-vs-cot",
  alt: "Two prompts side by side. Standard prompting: the tennis-ball example answers just The answer is 11, and on the new cafeteria-apples question the model says The answer is 27, which is wrong. Chain-of-thought prompting: the same example shows the working, 2 cans of 3 is 6, 5 + 6 = 11, and on the same new question the model works it out, 23 - 20 = 3, 3 + 6 = 9, and gets 9, which is right.",
  render() {
    const pw = 400, gap = 32, size = 13.5, lh = 19, pad = 14;
    const inner = pw - pad * 2;
    let body = "";

    // Each paragraph: [prefix, plain text, highlighted text, trailing text]
    type Para = { lines: { s: string; hl?: Tone }[] };
    const para = (prefix: string, plain: string, hl?: { s: string; tone: Tone }, tail?: string): Para => {
      const out: { s: string; hl?: Tone }[] = [];
      if (plain) wrap(`${prefix}${plain}`, inner, size).forEach((l) => out.push({ s: l }));
      if (hl) wrap(`${plain ? "" : prefix}${hl.s}`, inner, size).forEach((l) => out.push({ s: l, hl: hl.tone }));
      if (tail) wrap(tail, inner, size).forEach((l) => out.push({ s: l }));
      return { lines: out };
    };
    const drawBox = (x: number, y: number, label: string, labelTone: Tone, paras: Para[], boxTone: Tone) => {
      const n = paras.reduce((a, p) => a + p.lines.length, 0);
      const h = pad + 16 + n * lh + (paras.length - 1) * 10 + pad;
      let s = rect(x, y, pw, h, { tone: boxTone, fill: "none", r: 10 });
      s += text(x + pad, y + 18, label, { size: 11.5, weight: 700, tone: labelTone });
      let cy = y + 20 + lh;
      for (const p of paras) {
        for (const l of p.lines) {
          if (l.hl) s += rect(x + pad - 4, cy - 14, inner + 8, lh, { tone: l.hl, fill: "soft", stroke: false, r: 2 });
          s += text(x + pad, cy, l.s, { size, tone: "ink" });
          cy += lh;
        }
        cy += 10;
      }
      return { s, h };
    };

    const cols = [
      {
        head: "Standard prompting",
        input: [para("Q: ", Q1), para("A: ", A_STD), para("Q: ", Q2)],
        output: [para("A: ", OUT_STD)],
        verdict: { s: "wrong", tone: "red" as Tone },
      },
      {
        head: "Chain-of-thought prompting",
        input: [para("Q: ", Q1), para("A: ", "", { s: A_COT_WORK, tone: "blue" }, "The answer is 11."), para("Q: ", Q2)],
        output: [para("A: ", "", { s: OUT_COT_WORK, tone: "green" }, "The answer is 9.")],
        verdict: { s: "right", tone: "green" as Tone },
      },
    ];

    let maxH = 0;
    const inputs = cols.map((c, i) => drawBox(24 + i * (pw + gap), 30, "EXAMPLE + NEW QUESTION (INPUT)", "blue", c.input, "grey"));
    const oy = 30 + Math.max(...inputs.map((r) => r.h)) + 22;
    cols.forEach((c, i) => {
      const x = 24 + i * (pw + gap);
      body += text(x, 14, c.head, { size: 15, weight: 700 });
      body += inputs[i]!.s;
      const out = drawBox(x, oy, "MODEL OUTPUT", "muted", c.output, c.verdict.tone);
      body += out.s;
      body += text(x + pw - pad, oy + 18, c.verdict.s, { anchor: "end", size: 13, weight: 700, tone: c.verdict.tone });
      maxH = Math.max(maxH, oy + out.h);
    });

    return svg(
      {
        width: 24 * 2 + pw * 2 + gap,
        height: maxH + 8,
        title: "The only change is the worked reasoning in the example",
        credit: "Adapted from figure 1 of Wei et al. (Google), 2022. Highlights mark the added reasoning.",
        desc: side.alt,
      },
      body,
    );
  },
};

// Numbers: sources/sprague-to-cot-or-not.md (§3 meta-analysis). The paper's figure has more
// categories, but only these values are in the note; "all other categories" is 56.8 - 56.1.
const gains: Figure = {
  slug: "gain-by-task",
  alt: "Average accuracy gain from chain of thought by task type, from a 2024 review of over 100 papers: symbolic reasoning +14.2 points, math +12.3, logic +6.9, and all other kinds of tasks together +0.7 (56.8% with chain of thought versus 56.1% without).",
  render() {
    const p = { x: 24, y: 10, w: 700, h: 200 };
    const b = barsH(
      p,
      [
        { label: "Symbolic reasoning", value: 14.2, valueLabel: "+14.2", tone: "blue" },
        { label: "Math", value: 12.3, valueLabel: "+12.3", tone: "blue" },
        { label: "Logic", value: 6.9, valueLabel: "+6.9", tone: "blue" },
        { label: "All other task types", value: 0.7, valueLabel: "+0.7  (56.8% vs 56.1%)", tone: "grey" },
      ],
      { labelWidth: 170, max: 16, padding: 0.32, size: 13.5 },
    );
    let body = b.svg;
    const x0 = b.x(0), x16 = b.x(16);
    body += line(x0, p.y + p.h, x16, p.y + p.h, { tone: "axis" });
    for (const t of [0, 5, 10, 15]) {
      body += line(b.x(t), p.y + p.h, b.x(t), p.y + p.h + 5, { tone: "axis" });
      body += text(b.x(t), p.y + p.h + 19, String(t), { anchor: "middle", size: 11.5, tone: "muted" });
    }
    body += text((x0 + x16) / 2, p.y + p.h + 40, "average accuracy gain with chain of thought (percentage points)", { anchor: "middle", size: 12, tone: "muted" });
    return svg(
      {
        width: p.x + p.w + 30,
        height: p.y + p.h + 48,
        title: "Chain of thought helps on math and logic, and barely anywhere else",
        credit: "Adapted from figure 1 of Sprague et al., 2024 (meta-analysis of 100+ papers). \"All other\" is their combined average.",
        desc: gains.alt,
      },
      body,
    );
  },
};

export default [side, gains];
