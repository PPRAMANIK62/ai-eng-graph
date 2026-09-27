import { scaleLinear, series, xAxis, yAxis } from "../../lib/chart.ts";
import { circle, line, svg, text, type Figure } from "../../lib/svg.ts";

// The worked example in nodes/phase-2/bm25.md. Formulas from
// sources/robertson-zaragoza-bm25.md (Eq. 3.3 for IDF, Eq. 3.12–3.15 for the
// term-frequency part); k1 = 1.2 and b = 0.75 from sources/tigerdata-pg-textsearch.md.
// A collection of N = 1,000 documents is our own made-up example; the curves are
// the formula's real arithmetic.
const N = 1000;
const K1 = 1.2;
const B = 0.75;
const idf = (n: number) => Math.log((N - n + 0.5) / (n + 0.5));
const tfPart = (tf: number, lenRatio: number) => tf / (K1 * (1 - B + B * lenRatio) + tf);

const WORDS = [
  { word: "pooling", n: 10 },
  { word: "connection", n: 100 },
  { word: "database", n: 400 },
];

const figure: Figure = {
  slug: "two-curves",
  alt: "Two line charts from the BM25 formula. Left: a word's weight (IDF) falls as more of the 1,000 documents contain it. Pooling, in 10 documents, weighs 4.55; connection, in 100, weighs 2.19; database, in 400, weighs 0.41; a word in 500 documents weighs 0. Right: the score from repeating a word rises fast and flattens toward 1. With k1 = 1.2, one mention gives 0.45, five give 0.81 and fifty give 0.98. In a document twice the average length the curve sits lower: one mention gives 0.32.",
  render() {
    // Left panel: IDF against number of documents containing the word.
    const L = { x: 70, y: 46, w: 300, h: 240 };
    const lx = scaleLinear().domain([0, 600]).range([L.x, L.x + L.w]);
    const ly = scaleLinear().domain([-0.5, 7]).range([L.y + L.h, L.y]);
    let b = text(L.x + L.w / 2, 16, "Rare words count more", { anchor: "middle", size: 14, weight: 600 });
    b += yAxis(L, ly, [0, 2, 4, 6], String, "Word weight (IDF)");
    b += xAxis(L, lx, [0, 100, 200, 300, 400, 500, 600], String, "Documents (of 1,000) that contain the word");
    b += line(L.x, ly(0), L.x + L.w, ly(0), { tone: "muted", sw: 1 });
    const ipts: [number, number][] = [];
    for (let n = 1; n <= 600; n += n < 20 ? 0.25 : 2) ipts.push([lx(n), ly(idf(n))]);
    b += series(ipts, { tone: "blue", sw: 2.5 });
    for (const w of WORDS) {
      const cx = lx(w.n), cy = ly(idf(w.n));
      b += circle(cx, cy, 5, { tone: "orange" });
      b += text(cx + 9, cy - 9, `${w.word}: ${idf(w.n).toFixed(2)}`, { size: 12.5, weight: 600, tone: "orange" });
    }

    // Right panel: term-frequency part against count.
    const R = { x: 480, y: 46, w: 300, h: 240 };
    const rx = scaleLinear().domain([0, 50]).range([R.x, R.x + R.w]);
    const ry = scaleLinear().domain([0, 1]).range([R.y + R.h, R.y]);
    b += text(R.x + R.w / 2, 16, "Repeats stop helping", { anchor: "middle", size: 14, weight: 600 });
    b += yAxis(R, ry, [0, 0.25, 0.5, 0.75, 1], String, "Score from this word");
    b += xAxis(R, rx, [0, 10, 20, 30, 40, 50], String, "Times the word appears (tf)");
    const avg: [number, number][] = [];
    const long: [number, number][] = [];
    for (let tf = 0; tf <= 50; tf += 0.25) {
      avg.push([rx(tf), ry(tfPart(tf, 1))]);
      long.push([rx(tf), ry(tfPart(tf, 2))]);
    }
    b += series(avg, { tone: "blue", sw: 2.5 });
    b += series(long, { tone: "purple", sw: 2, dash: true });
    b += line(R.x, ry(1), R.x + R.w, ry(1), { tone: "muted", dash: true, sw: 1 });
    b += text(R.x + R.w - 4, ry(1) - 7, "ceiling", { anchor: "end", size: 12, tone: "muted" });
    for (const tf of [1, 5, 50]) {
      const cx = rx(tf), cy = ry(tfPart(tf, 1));
      b += circle(cx, cy, 5, { tone: "orange" });
      b += text(cx + (tf === 50 ? -8 : 8), cy + (tf === 50 ? 18 : 16), `${tf}×: ${tfPart(tf, 1).toFixed(2)}`, {
        size: 12.5,
        weight: 600,
        tone: "orange",
        anchor: tf === 50 ? "end" : "start",
      });
    }
    b += text(rx(14), ry(0.62), "average-length document", { size: 12.5, tone: "blue" });
    b += text(rx(14), ry(0.47), "twice the average length", { size: 12.5, tone: "purple" });
    b += circle(rx(1), ry(tfPart(1, 2)), 4, { tone: "purple" });
    b += text(rx(1) + 8, ry(tfPart(1, 2)) + 14, `1×: ${tfPart(1, 2).toFixed(2)}`, { size: 12, tone: "purple" });

    return svg(
      {
        width: R.x + R.w + 30,
        height: L.y + L.h + 50,
        title: "How BM25 weighs one query word",
        credit: "Computed from the BM25 formula (Robertson & Zaragoza, 2009), k1 = 1.2, b = 0.75, a made-up collection of 1,000 documents.",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
