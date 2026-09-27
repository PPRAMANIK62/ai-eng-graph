import { arrow, box, circle, rect, text, svg, type Figure } from "../../lib/svg.ts";

// The pipeline steps come from nodes/phase-2/rag.md and sources/anthropic-contextual-retrieval.md.
// The seven failure points and their order come from sources/barnett-rag-failure-points.md.
// Where each marker sits is our placement of their list on the pipeline.

const FP = [
  "missing content: the answer isn't in the documents",
  "missed the top results: ranked too low to be returned",
  "not in context: retrieved, then cut from the prompt",
  "not extracted: in the prompt, but the model missed it",
  "wrong format: asked for a table or list, got prose",
  "wrong specificity: too vague or too detailed",
  "incomplete: right, but missing part of the answer",
];

const pipeline: Figure = {
  slug: "pipeline",
  alt: "A RAG pipeline in two rows. The top row runs ahead of time: documents are split into chunks, each chunk is embedded, and the embeddings go into an index. The bottom row runs on each question: the question is embedded, the index is searched, the top chunks go into the prompt, and the model writes an answer. Seven numbered markers show where things fail: missing content at the documents, the right chunk ranked too low at search, retrieved but cut from the prompt, and four failures at the answer: not extracted, wrong format, wrong specificity, incomplete.",
  render() {
    const BW = 118, BH = 50, GAP = 34;
    const X0 = 150;
    const col = (i: number) => X0 + i * (BW + GAP);
    const Y1 = 30, Y2 = 150;
    let b = "";

    // row labels
    b += text(24, Y1 + BH / 2 - 8, "Ahead of", { size: 13, weight: 700, tone: "purple" });
    b += text(24, Y1 + BH / 2 + 10, "time", { size: 13, weight: 700, tone: "purple" });
    b += text(24, Y2 + BH / 2 - 8, "On each", { size: 13, weight: 700, tone: "blue" });
    b += text(24, Y2 + BH / 2 + 10, "question", { size: 13, weight: 700, tone: "blue" });

    // top row: documents -> chunks -> embed -> index
    const top: (string | string[])[] = ["documents", ["split into", "chunks"], ["embed", "each chunk"], "index"];
    top.forEach((l, i) => {
      b += box(col(i), Y1, BW, BH, l, { tone: "purple", size: 13.5, weight: 600 });
      if (i > 0) b += arrow(col(i - 1) + BW, Y1 + BH / 2, col(i) - 4, Y1 + BH / 2, { tone: "purple" });
    });

    // bottom row: question -> embed -> search -> top chunks -> prompt -> answer
    const bot: (string | string[])[] = ["question", ["embed the", "question"], ["search", "the index"], ["top chunks", "into prompt"], ["model", "answers"]];
    bot.forEach((l, i) => {
      const tone = i === 4 ? "orange" : "blue";
      b += box(col(i), Y2, BW, BH, l, { tone, size: 13.5, weight: 600 });
      if (i > 0) b += arrow(col(i - 1) + BW, Y2 + BH / 2, col(i) - 4, Y2 + BH / 2, { tone: "blue" });
    });

    // index feeds the search step
    b += arrow(col(3) + BW / 2, Y1 + BH, col(2) + BW / 2 + 8, Y2 - 4, { tone: "grey", dash: true });

    // failure markers
    const markRow = (cx: number, cy: number, n: number, r = 11) =>
      circle(cx, cy, r, { tone: "red", fill: "soft", stroke: true }) +
      text(cx, cy + 0.5, String(n), { anchor: "middle", baseline: "middle", size: 12.5, weight: 700, tone: "red" });
    b += markRow(col(0) + BW - 4, Y1 - 2, 1);
    b += markRow(col(2) + BW - 4, Y2 - 2, 2);
    b += markRow(col(3) + BW - 4, Y2 - 2, 3);
    [4, 5, 6, 7].forEach((n, i) => (b += markRow(col(4) + 14 + i * 27, Y2 + BH + 16, n)));

    // legend
    const LY = Y2 + BH + 52;
    b += rect(24, LY - 14, col(4) + BW - 24, 26 + FP.length * 21, { tone: "grey", fill: "none", r: 6, sw: 1 });
    FP.forEach((s, i) => {
      const y = LY + 4 + i * 21;
      b += markRow(44, y, i + 1, 9);
      b += text(62, y, s, { baseline: "middle", size: 13 });
    });
    b += text(col(4) + BW - 10, LY + 4, "1–3: search problems", { anchor: "end", baseline: "middle", size: 12.5, tone: "blue", weight: 600 });
    b += text(col(4) + BW - 10, LY + 4 + 3 * 21, "4–7: answer problems", { anchor: "end", baseline: "middle", size: 12.5, tone: "orange", weight: 600 });

    return svg(
      {
        width: col(4) + BW + 24,
        height: LY + FP.length * 21 + 16,
        title: "RAG builds an index ahead of time, then looks things up per question",
        credit: "Failure points from Barnett et al., \"Seven Failure Points When Engineering a RAG System\" (2024). Placement on the pipeline is ours.",
        desc: pipeline.alt,
      },
      b,
    );
  },
};

export default [pipeline];
