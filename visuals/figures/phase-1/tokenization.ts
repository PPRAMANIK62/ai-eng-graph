import { barsH } from "../../lib/chart.ts";
import { box, esc, line, measure, path, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// 1. The pipeline: text -> UTF-8 bytes -> tokens -> ids -> embedding rows.
// String and its 12 cl100k_base ids: sources/karpathy-minbpe.md (README,
// GPT-4 comparison). Which bytes go into which token: checked by running
// js-tiktoken's cl100k_base encoding on 2026-09-23; the ids it gave match
// the README exactly.
// ---------------------------------------------------------------------------

type Tok = { piece: string; bytes: string[]; id: number; frag?: string };
const TOKS: Tok[] = [
  { piece: "hello", bytes: ["68", "65", "6c", "6c", "6f"], id: 15339 },
  { piece: "123", bytes: ["31", "32", "33"], id: 4513 },
  { piece: "!!!", bytes: ["21", "21", "21"], id: 12340 },
  { piece: "?", bytes: ["3f"], id: 30 },
  { piece: "␣(", bytes: ["20", "28"], id: 320 },
  { piece: "안", bytes: ["ec", "95"], id: 31495, frag: "part 1" },
  { piece: "안", bytes: ["88"], id: 230, frag: "part 2" },
  { piece: "녕", bytes: ["eb", "85"], id: 75265, frag: "part 1" },
  { piece: "녕", bytes: ["95"], id: 243, frag: "part 2" },
  { piece: "하세요", bytes: ["ed", "95", "98", "ec", "84", "b8", "ec", "9a", "94"], id: 92245 },
  { piece: "!)", bytes: ["21", "29"], id: 16715 },
  { piece: "␣😉", bytes: ["20", "f0", "9f", "98", "89"], id: 57037 },
];
// The characters of the string, with how many UTF-8 bytes each takes.
const CHARS: [string, number][] = [
  ..."hello123!!!?".split("").map((c) => [c, 1] as [string, number]),
  ["␣", 1], ["(", 1], ["안", 3], ["녕", 3], ["하", 3], ["세", 3], ["요", 3], ["!", 1], [")", 1], ["␣", 1], ["😉", 4],
];
// Some renderers fall back to a mono font for a whole line when one glyph (␣)
// is missing from the main font, so draw ␣ as its own text run.
function note(x: number, y: number, s: string) {
  const runs = s.split(/(␣|[가-힣]+)/).filter(Boolean).map((part) => `<tspan>${esc(part)}</tspan>`).join("");
  return `<text x="${x}" y="${y}" font-size="12.5" class="t-muted" xml:space="preserve">${runs}</text>`;
}

const TONES: Tone[] = ["blue", "orange", "green", "purple", "red"];

const pipeline: Figure = {
  slug: "pipeline",
  alt: "The line hello123!!!? (안녕하세요!) 😉 on its way into GPT-4's tokenizer. Its 36 UTF-8 bytes are grouped into 12 tokens: hello, 123, !!!, ?, space plus bracket, four byte fragments that make up 안 and 녕, 하세요 as one token, !) and space plus emoji. Each token gets an id such as 15339, and each id picks one row of the embedding table.",
  render() {
    const LW = 138; // row label column
    const X0 = 24 + LW;
    const CELL = 19; // one byte
    const GAP = 7; // between tokens
    const MINW = 44;
    // Width and x of every token column.
    const cols: { x: number; w: number; bx: number }[] = [];
    let x = X0;
    for (const t of TOKS) {
      const w = Math.max(MINW, t.bytes.length * CELL);
      cols.push({ x, w, bx: x + (w - t.bytes.length * CELL) / 2 });
      x += w + GAP;
    }
    const W = x - GAP + 24;
    // Absolute x of each byte cell, in string order.
    const byteX: number[] = [];
    TOKS.forEach((t, i) => t.bytes.forEach((_, j) => byteX.push(cols[i]!.bx + j * CELL)));

    const Y = { text: 10, bytes: 70, tok: 132, id: 196, emb: 250 };
    const RH = 30;
    let b = "";
    const label = (y: number, a: string, sub: string) =>
      text(24, y + RH / 2 - 7, a, { size: 13.5, weight: 600, baseline: "middle" }) +
      text(24, y + RH / 2 + 10, sub, { size: 12, tone: "muted", baseline: "middle" });

    // Row 1: characters, each centered over its bytes.
    b += label(Y.text, "1. Text", "23 characters");
    let k = 0;
    for (const [ch, n] of CHARS) {
      const x1 = byteX[k]!, x2 = byteX[k + n - 1]! + CELL;
      const multi = n > 1;
      b += text((x1 + x2) / 2, Y.text + RH / 2, ch, { size: multi ? 17 : 16, anchor: "middle", baseline: "middle", mono: !multi, tone: ch === "␣" ? "muted" : "ink" });
      if (multi) b += path(`M${x1 + 2},${Y.text + RH + 8} L${x1 + 2},${Y.text + RH + 12} L${x2 - 2},${Y.text + RH + 12} L${x2 - 2},${Y.text + RH + 8}`, { tone: "muted", sw: 1 });
      k += n;
    }
    // Row 2: bytes.
    b += label(Y.bytes, "2. UTF-8 bytes", "36 bytes");
    byteX.forEach((bx, i) => {
      const hex = TOKS.flatMap((t) => t.bytes)[i]!;
      b += box(bx + 1, Y.bytes, CELL - 2, RH, hex, { tone: "grey", size: 12, mono: true, r: 3, sw: 1 });
    });
    // Row 3: tokens.
    b += label(Y.tok, "3. Tokens", "12 chunks");
    TOKS.forEach((t, i) => {
      const c = cols[i]!;
      const tone = TONES[i % TONES.length]!;
      // bracket from byte row down to token
      b += path(`M${c.bx + 1},${Y.bytes + RH + 5} L${c.bx + 1},${Y.bytes + RH + 10} L${c.bx + t.bytes.length * CELL - 1},${Y.bytes + RH + 10} L${c.bx + t.bytes.length * CELL - 1},${Y.bytes + RH + 5}`, { tone, sw: 1.5 });
      b += line(c.x + c.w / 2, Y.bytes + RH + 10, c.x + c.w / 2, Y.tok - 2, { tone, sw: 1.5 });
      if (t.frag) {
        b += rect(c.x, Y.tok, c.w, RH + 6, { tone, dash: true });
        b += text(c.x + c.w / 2, Y.tok + 12, t.piece, { size: 14, anchor: "middle", baseline: "middle" });
        b += text(c.x + c.w / 2, Y.tok + 28, t.frag, { size: 12, anchor: "middle", baseline: "middle", tone: "muted" });
      } else {
        b += rect(c.x, Y.tok, c.w, RH + 6, { tone });
        b += text(c.x + c.w / 2, Y.tok + (RH + 6) / 2, t.piece, { size: 15, anchor: "middle", baseline: "middle", mono: !/[가-힣😉]/u.test(t.piece) });
      }
    });
    // Row 4: ids.
    b += label(Y.id, "4. Ids", "position in vocabulary");
    TOKS.forEach((t, i) => {
      const c = cols[i]!;
      b += line(c.x + c.w / 2, Y.tok + RH + 8, c.x + c.w / 2, Y.id + 2, { tone: "muted", sw: 1, arrow: true });
      b += text(c.x + c.w / 2, Y.id + 14, String(t.id), { size: 12.5, anchor: "middle", baseline: "middle", mono: true, weight: 600 });
    });
    // Row 5: one embedding row per id, drawn as a strip of cells (no values).
    b += label(Y.emb + 18, "5. Embedding rows", "picked by the id");
    TOKS.forEach((t, i) => {
      const c = cols[i]!;
      const tone = TONES[i % TONES.length]!;
      b += line(c.x + c.w / 2, Y.id + 26, c.x + c.w / 2, Y.emb - 2, { tone: "muted", sw: 1, arrow: true });
      const cw = 12, n = 6;
      for (let j = 0; j < n; j++) b += rect(c.x + c.w / 2 - cw / 2, Y.emb + j * 11, cw, 10, { tone, r: 1.5, sw: 1 });
      b += text(c.x + c.w / 2, Y.emb + n * 11 + 8, "⋮", { size: 12, anchor: "middle", tone: "muted" });
    });

    // Footnotes under the figure.
    const fy = Y.emb + 104;
    b += note(24, fy, "␣ marks a space. The space before ( and before the emoji is glued to the next token.");
    b += note(24, fy + 20, "Each strip is one row of the embedding table, which has one row per token in the vocabulary (about 100,000 here).");
    b += note(24, fy + 40, "안 and 녕 are each cut into two tokens that are pieces of one character. 하세요 (three characters, 9 bytes) is a single token.");

    return svg(
      {
        width: W,
        height: fy + 50,
        title: "From text to numbers: 36 bytes become 12 tokens under GPT-4's tokenizer",
        credit: "Example from Karpathy's minbpe README (cl100k_base). Byte groups checked by running js-tiktoken, 2026-09-23.",
        desc: pipeline.alt,
      },
      b,
    );
  },
};

// ---------------------------------------------------------------------------
// 2. GPT-2 number splits. Splits: sources/karpathy-minbpe.md (lecture, Visual
// preview of tokenization). Ids: from running js-tiktoken's gpt2 encoding on
// 2026-09-23 on the same strings (leading space where the lecture shows one).
// ---------------------------------------------------------------------------

const NUMBERS: { n: string; parts: [string, number][] }[] = [
  { n: "127", parts: [["127", 16799]] },
  { n: "677", parts: [["␣6", 718], ["77", 3324]] },
  { n: "804", parts: [["␣8", 807], ["04", 3023]] },
  { n: "1275", parts: [["12", 1065], ["75", 2425]] },
  { n: "6773", parts: [["␣6", 718], ["773", 46871]] },
  { n: "8041", parts: [["␣8", 807], ["041", 50049]] },
];

const numbers: Figure = {
  slug: "number-splits",
  alt: "Six numbers as GPT-2 tokens. 127 is one token. 677 is space-6 plus 77, 804 is space-8 plus 04, 1275 is 12 plus 75, 6773 is space-6 plus 773, and 8041 is space-8 plus 041. Each piece has its own id underneath.",
  render() {
    const colW = 150, gap = 14, x0 = 24;
    const pw = (s: string) => Math.max(40, measure(s, 16, true) + 18);
    let b = "";
    NUMBERS.forEach((num, i) => {
      const cx = x0 + i * (colW + gap) + colW / 2;
      b += text(cx, 14, num.n, { size: 20, weight: 700, anchor: "middle", baseline: "middle" });
      b += text(cx, 38, num.parts.length === 1 ? "1 token" : "2 tokens", { size: 12, anchor: "middle", tone: "muted", baseline: "middle" });
      const widths = num.parts.map(([p]) => pw(p));
      const total = widths.reduce((a, c) => a + c, 0) + (widths.length - 1) * 6;
      let px = cx - total / 2;
      num.parts.forEach(([p, id], j) => {
        const w = widths[j]!;
        const tone: Tone = j === 0 ? "blue" : "orange";
        b += box(px, 58, w, 38, p, { tone, size: 16, mono: true });
        b += text(px + w / 2, 114, String(id), { size: 12, anchor: "middle", mono: true, tone: "muted", baseline: "middle" });
        px += w + 6;
      });
    });
    const W = x0 * 2 + NUMBERS.length * colW + (NUMBERS.length - 1) * gap;
    b += note(24, 146, "The small number under each box is its token id. ␣ marks a space glued to the front of a token.");
    b += note(24, 166, "␣6 is the same token (718) in 677 and 6773, but the digits after it come as 77 in one and 773 in the other.");
    return svg(
      {
        width: W,
        height: 180,
        title: "GPT-2 cuts numbers into clumps that ignore place value",
        credit: "Splits from Karpathy's minbpe lecture (GPT-2 tokenizer). Ids from running js-tiktoken's gpt2 encoding, 2026-09-23.",
        desc: numbers.alt,
      },
      b,
    );
  },
};

// ---------------------------------------------------------------------------
// 3. Language premium. Values as rounded in the article's table, from
// sources/petrov-tokenizer-unfairness.md (§1 and Table 1, cl100k_base column).
// ---------------------------------------------------------------------------

const LANGS: [string, number, string][] = [
  ["English", 1, "1×"],
  ["Portuguese", 1.5, "1.5×"],
  ["German", 1.6, "1.6×"],
  ["Italian", 1.6, "1.6×"],
  ["Japanese", 2.3, "2.3×"],
  ["Bulgarian", 2.6, "2.6×"],
  ["Arabic", 3, "3×"],
  ["Burmese", 11.7, "11.7×"],
  ["Shan", 15, "15×"],
];

const languages: Figure = {
  slug: "language-cost",
  alt: "Bar chart of tokens needed for the same text under GPT-4's tokenizer, relative to English: English 1, Portuguese 1.5, German 1.6, Italian 1.6, Japanese 2.3, Bulgarian 2.6, Arabic 3, Burmese 11.7, Shan 15.",
  render() {
    const W = 760;
    const plot = { x: 24, y: 30, w: W - 48, h: 300 };
    let b = text(24, 8, "GPT-4 tokenizer (cl100k_base), measured 2023. English = 1.", { size: 13, tone: "muted" });
    b += barsH(
      plot,
      LANGS.map(([label, value, valueLabel]) => ({
        label,
        value,
        valueLabel,
        tone: (label === "English" ? "blue" : value > 10 ? "red" : "orange") as Tone,
      })),
      { max: 15, labelWidth: 100, padding: 0.28 },
    ).svg;
    return svg(
      {
        width: W,
        height: plot.y + plot.h + 6,
        title: "Tokens needed for the same text, compared with English",
        credit: "Data: Petrov et al., 2023, FLORES-200 sentences, Table 1 (cl100k_base column), rounded.",
        desc: languages.alt,
      },
      b,
    );
  },
};

export default [pipeline, numbers, languages];
