import { arrow, box, line, rect, svg, text, wrap, type Figure, type Tone } from "../../lib/svg.ts";

// Conceptual, for the article's invoice example. What a strict schema guarantees
// and doesn't: sources/anthropic-structured-outputs.md (shape guaranteed; no
// numeric or length constraints). Evidence checks: sources/goel-langextract.md
// (character offsets). Wrong values as the most common error:
// sources/tenckhoff-llmstructbench.md.
const layers: Figure = {
  slug: "layers",
  alt: "What catches each kind of extraction error, for the invoice email. A strict schema catches invalid JSON, a missing required key, a wrong type and an enum value that isn't on the list. Your validation code catches rule breaks the schema can't express, like a negative amount or a due date before the invoice date, and a value whose quoted evidence doesn't appear in the email. Only a labelled test set catches a wrong value that is still plausible, like a valid date with the wrong year guessed for 15 October. In one 2026 benchmark, wrong values were the most common error under every prompting setup.",
  render() {
    const cols: { title: string; sub: string; tone: Tone; items: string[] }[] = [
      {
        title: "Strict schema",
        sub: "guaranteed by the API",
        tone: "blue",
        items: ["Invalid JSON", "Missing required key", "Wrong type (\"4,300\" as text)", "Enum value not on the list"],
      },
      {
        title: "Your validation code",
        sub: "rules the schema can't express",
        tone: "orange",
        items: ["Amount below zero", "Due date before the invoice date", "Quoted evidence not in the email"],
      },
      {
        title: "A labelled test set",
        sub: "the only thing that sees these",
        tone: "red",
        items: ["A plausible but wrong value: a valid date, but the wrong year guessed for \"15 October\""],
      },
    ];
    const W = 270;
    const G = 24;
    let b = "";
    cols.forEach((c, i) => {
      const x = 20 + i * (W + G);
      b += rect(x, 0, W, 220, { tone: c.tone, fill: "soft" });
      b += text(x + 16, 26, c.title, { size: 15, weight: 700, tone: c.tone, display: true });
      b += text(x + 16, 46, c.sub, { size: 12.5, tone: "muted", italic: true });
      let y = 76;
      for (const it of c.items) {
        const ls = wrap(it, W - 44, 13);
        b += text(x + 16, y, "•", { size: 13, tone: c.tone, weight: 700 });
        ls.forEach((l, j) => (b += text(x + 30, y + j * 18, l, { size: 13 })));
        y += ls.length * 18 + 14;
      }
      if (i < cols.length - 1) b += arrow(x + W + 3, 110, x + W + G - 3, 110, { tone: "muted" });
    });
    b += text(20, 250, "Each column catches what gets past the one before it. With a strict schema, the first column's errors never reach you;", { size: 12.5, tone: "muted" });
    b += text(20, 268, "in LLMStructBench (2026), wrong values were the biggest source of errors under every prompting setup.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: 20 + 3 * W + 2 * G + 20,
        height: 280,
        title: "A valid object can still be wrong: what catches each error",
        credit: "Conceptual, for the invoice example. Schema limits from Anthropic's structured outputs docs; finding from Tenckhoff et al. (2026).",
        desc: layers.alt,
      },
      b,
    );
  },
};

// sources/goel-langextract.md: chunking, parallel processing, multiple passes
// over smaller contexts, character offsets for every extracted entity.
const longDocs: Figure = {
  slug: "long-docs",
  alt: "Extraction over a long document. The document is split into chunks. Each chunk goes through the extraction model more than once, in parallel. The results are merged and duplicates are removed. Every extracted item keeps the character offsets of the text it came from, so you can highlight it in the original and check that the text is really there.",
  render() {
    let b = "";
    // document
    b += rect(20, 20, 120, 230, { tone: "grey", fill: "soft" });
    for (let i = 0; i < 11; i++) b += line(34, 42 + i * 18, i % 4 === 3 ? 96 : 126, 42 + i * 18, { tone: "grid", sw: 3 });
    b += text(80, 272, "long document", { anchor: "middle", size: 12.5, tone: "muted" });

    // chunks
    const cy = [20, 100, 180];
    cy.forEach((y, i) => {
      b += arrow(142, 135, 196, y + 25, { tone: "muted" });
      b += box(200, y, 100, 50, `chunk ${i + 1}`, { tone: "grey", size: 13 });
      // passes
      b += arrow(302, y + 16, 346, y + 12, { tone: "muted" });
      b += arrow(302, y + 34, 346, y + 38, { tone: "muted" });
      b += box(350, y, 110, 22, "pass 1", { tone: "blue", size: 12 });
      b += box(350, y + 28, 110, 22, "pass 2", { tone: "blue", size: 12 });
      b += arrow(462, y + 25, 536, 135, { tone: "muted" });
    });
    b += text(405, 262, "in parallel, more than once", { anchor: "middle", size: 12.5, tone: "muted" });
    b += text(250, 262, "smaller contexts", { anchor: "middle", size: 12.5, tone: "muted" });

    b += box(540, 105, 120, 60, ["merge,", "drop duplicates"], { tone: "orange", size: 13, weight: 600 });
    b += arrow(662, 135, 700, 135, { tone: "muted" });

    // result list with offsets
    b += rect(704, 60, 230, 150, { tone: "green", fill: "soft" });
    b += text(718, 84, "Extracted items", { size: 13, weight: 700, tone: "green" });
    const rows = [
      ["medication", "start–end"],
      ["dose", "start–end"],
      ["medication", "start–end"],
    ];
    rows.forEach(([k, v], i) => {
      b += text(718, 112 + i * 26, k, { size: 12.5 });
      b += text(920, 112 + i * 26, v, { size: 12, anchor: "end", mono: true, tone: "muted" });
    });
    b += text(718, 196, "offsets point back into the source", { size: 12, tone: "muted", italic: true });
    return svg(
      {
        width: 950,
        height: 285,
        title: "Long documents: split, extract more than once, keep the offsets",
        credit: "Redrawn from the approach in Google's LangExtract launch post (2025).",
        desc: longDocs.alt,
      },
      b,
    );
  },
};

export default [layers, longDocs];
