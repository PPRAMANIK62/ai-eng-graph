import { barsH } from "../../lib/chart.ts";
import { path, svg, text, type Figure } from "../../lib/svg.ts";

// Source: sources/chroma-generative-benchmarking.md, table
// "WandBot - metrics for ground truth and generated queries", ground-truth rows, Recall@10.
// The MTEB remark is the report's own sentence about jina-embeddings-v3 vs text-embedding-3-large.
const ROWS = [
  { label: "voyage-3-large", value: 0.67, valueLabel: "0.670" },
  { label: "text-embedding-3-large", value: 0.552, valueLabel: "0.552" },
  { label: "jina-embeddings-v3", value: 0.511, valueLabel: "0.511" },
  { label: "text-embedding-3-small", value: 0.439, valueLabel: "0.439" },
];

const figure: Figure = {
  slug: "benchmark-vs-real",
  alt: "Bar chart of recall@10 on real questions to the Weights & Biases docs chatbot: voyage-3-large 0.670, text-embedding-3-large 0.552, jina-embeddings-v3 0.511, text-embedding-3-small 0.439. A note marks that jina-embeddings-v3 beats text-embedding-3-large on every MTEB English task, yet ranks below it here.",
  render() {
    const p = { x: 24, y: 34, w: 600, h: 190 };
    let b = text(24, 12, "Share of real user questions with the right document in the top 10", { size: 13, tone: "muted" });
    const chart = barsH(
      p,
      ROWS.map((r) => ({ ...r, tone: r.label === "jina-embeddings-v3" ? "orange" : r.label === "text-embedding-3-large" ? "blue" : "grey" })),
      { max: 0.7, labelWidth: 190 },
    );
    b += chart.svg;
    // note linking jina and 3-large
    const yLarge = chart.y("text-embedding-3-large")! + chart.y.bandwidth() / 2;
    const yJina = chart.y("jina-embeddings-v3")! + chart.y.bandwidth() / 2;
    const nx = 668;
    b += path(`M${nx - 20},${yLarge} L${nx - 8},${yLarge} L${nx - 8},${yJina} L${nx - 20},${yJina}`, { tone: "orange", sw: 1.5 });
    b += text(nx, yLarge + 4, "On MTEB, jina beats", { size: 12.5, tone: "orange", weight: 600 });
    b += text(nx, yLarge + 22, "3-large on every", { size: 12.5, tone: "orange", weight: 600 });
    b += text(nx, yLarge + 40, "English task.", { size: 12.5, tone: "orange", weight: 600 });
    b += text(nx, yLarge + 60, "Here it loses.", { size: 12.5, tone: "orange", weight: 600 });
    return svg(
      {
        width: 820,
        height: 240,
        title: "On real questions, the benchmark order flipped",
        credit: "Data: Hong, Troynikov, Huber and McGuire, Generative Benchmarking (Chroma, 2025). 2023 WandBot queries, recall@10.",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
