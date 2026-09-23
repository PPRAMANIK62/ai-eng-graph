import { arrow, box, line, measure, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// The five-word corpus, merges and counts: nodes/phase-1/bpe.md and
// sources/huggingface-bpe-tokenization.md (Training algorithm).
const WORDS: [string, number][] = [
  ["hug", 10],
  ["pug", 5],
  ["pun", 12],
  ["bun", 4],
  ["hugs", 5],
];
const MERGES: { a: string; b: string; count: number }[] = [
  { a: "u", b: "g", count: 20 },
  { a: "u", b: "n", count: 16 },
  { a: "h", b: "ug", count: 15 },
];

/** Apply merges in order to a list of symbols. */
function applyMerges(symbols: string[], merges: typeof MERGES) {
  let s = [...symbols];
  for (const m of merges) {
    const out: string[] = [];
    for (let i = 0; i < s.length; i++) {
      if (s[i] === m.a && s[i + 1] === m.b) {
        out.push(m.a + m.b);
        i++;
      } else out.push(s[i]!);
    }
    s = out;
  }
  return s;
}

const figure: Figure = {
  slug: "merges",
  alt: "The words hug, pug, pun, bun and hugs, with counts 10, 5, 12, 4 and 5, split into letters. Three merges follow: u and g become ug (20 times), then u and n become un (16 times), then h and ug become hug (15 times). The vocabulary grows from 7 tokens to 8, 9 and 10.",
  render() {
    const LEFT = 24, WORD_W = 96, COL_W = 190, GAP = 22;
    const colX = (i: number) => LEFT + WORD_W + i * (COL_W + GAP);
    const ROW_Y = 78, ROW_H = 44, SYM_H = 30;
    const heads = ["Start: single letters", ...MERGES.map((m, i) => `Merge ${i + 1}: new token ${m.a}${m.b}`)];
    const subs = ["", ...MERGES.map((m) => `top pair ${m.a} + ${m.b}, seen ${m.count} times`)];
    const vocab = ["b g h n p s u", "+ ug", "+ un", "+ hug"];
    let b = "";

    // Word column.
    b += text(LEFT, ROW_Y - 16, "Word × count", { size: 12.5, tone: "muted", weight: 600 });
    WORDS.forEach(([w, n], r) => {
      const y = ROW_Y + r * ROW_H + SYM_H / 2;
      b += text(LEFT, y, w, { size: 15, weight: 600, baseline: "middle" });
      b += text(LEFT + 50, y, `× ${n}`, { size: 13.5, tone: "muted", baseline: "middle" });
    });

    for (let c = 0; c < 4; c++) {
      const x0 = colX(c);
      const tone: Tone = c === 0 ? "grey" : "orange";
      // Column header.
      b += text(x0 + COL_W / 2, 10, heads[c]!, { size: 14, weight: 600, anchor: "middle", baseline: "middle", tone: c === 0 ? "ink" : "orange" });
      if (subs[c]) b += text(x0 + COL_W / 2, 32, subs[c]!, { size: 12.5, anchor: "middle", baseline: "middle", tone: "muted" });
      if (c > 0) b += arrow(x0 - GAP + 3, ROW_Y + 2.5 * ROW_H - 7, x0 - 3, ROW_Y + 2.5 * ROW_H - 7, { tone: "muted" });
      b += rect(x0, ROW_Y - 12, COL_W, WORDS.length * ROW_H + 8, { tone: c === 0 ? "grey" : "orange", fill: "none", sw: 1, dash: c > 0, r: 8, opacity: 0.6 });

      const done = MERGES.slice(0, c);
      const latest = c > 0 ? MERGES[c - 1]!.a + MERGES[c - 1]!.b : "";
      WORDS.forEach(([w], r) => {
        const syms = applyMerges(w.split(""), done);
        const widths = syms.map((s) => Math.max(28, measure(s, 16, true) + 16));
        const total = widths.reduce((a, v) => a + v, 0) + (syms.length - 1) * 6;
        let x = x0 + (COL_W - total) / 2;
        const y = ROW_Y + r * ROW_H;
        syms.forEach((s, j) => {
          const isNew = s === latest;
          const isOld = s.length > 1 && !isNew;
          const t: Tone = isNew ? "orange" : isOld ? "blue" : "grey";
          b += box(x, y, widths[j]!, SYM_H, s, { tone: t, fill: isNew ? "soft" : "soft", sw: isNew ? 2.2 : 1.2, size: 16, mono: true, weight: isNew ? 700 : 400 });
          x += widths[j]! + 6;
        });
      });

      // Vocabulary under each column.
      const vy = ROW_Y + WORDS.length * ROW_H + 26;
      b += text(x0 + COL_W / 2, vy, `${7 + c} tokens`, { size: 14, weight: 700, anchor: "middle", baseline: "middle", tone: c === 0 ? "ink" : tone });
      b += text(x0 + COL_W / 2, vy + 22, vocab[c]!, { size: 13.5, anchor: "middle", baseline: "middle", mono: true, tone: c === 0 ? "ink" : "orange" });
    }
    const vy = ROW_Y + WORDS.length * ROW_H + 26;
    b += text(LEFT, vy, "Vocabulary", { size: 12.5, tone: "muted", weight: 600, baseline: "middle" });

    // Legend.
    const ly = vy + 58;
    b += line(LEFT, ly - 18, colX(3) + COL_W, ly - 18, { tone: "grid", sw: 1 });
    let lx = LEFT;
    for (const [t, lab] of [["grey", "single letter"], ["orange", "merged in this step"], ["blue", "merged in an earlier step"]] as [Tone, string][]) {
      b += rect(lx, ly - 8, 16, 16, { tone: t, r: 3, sw: 1.2 });
      b += text(lx + 24, ly, lab, { size: 12.5, baseline: "middle", tone: "muted" });
      lx += 24 + measure(lab, 12.5) + 28;
    }

    return svg(
      {
        width: colX(3) + COL_W + 24,
        height: ly + 14,
        title: "BPE: merge the most common pair, then repeat",
        credit: "Adapted from the Hugging Face LLM Course, chapter 6.5 (Byte-Pair Encoding tokenization).",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
