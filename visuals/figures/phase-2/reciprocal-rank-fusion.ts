import { scaleLinear, series, xAxis, yAxis } from "../../lib/chart.ts";
import { arrow, box, circle, line, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Worked example in nodes/phase-2/reciprocal-rank-fusion.md: made-up lists,
// real arithmetic with the formula from sources/cormack-reciprocal-rank-fusion.md.
const KEYWORD = ["A", "B", "C", "D"];
const VECTOR = ["F", "A", "B", "C"];
function fuse(k: number) {
  const s = new Map<string, number>();
  for (const list of [KEYWORD, VECTOR]) list.forEach((d, i) => s.set(d, (s.get(d) ?? 0) + 1 / (k + i + 1)));
  return [...s.entries()].sort((a, b) => b[1] - a[1]);
}
const TONE: Record<string, Tone> = { C: "green", F: "purple" };

const example: Figure = {
  slug: "worked-example",
  alt: "Two ranked lists merged with reciprocal rank fusion. Keyword list: A, B, C, D. Vector list: F, A, B, C. With k = 60 the fused order is A 0.0325, B 0.0320, C 0.0315, F 0.0164, D 0.0156: documents found by both lists come first, and F, top of the vector list only, drops to fourth. With k = 1 the order is A 0.833, B 0.583, F 0.500, C 0.450, D 0.200: F now beats C.",
  render() {
    const W = 120, H = 32, G = 40;
    const cols = [30, 190, 400, 620];
    let b = "";
    const head = (x: number, s: string, sub: string) =>
      text(x + W / 2 + (x >= 400 ? 20 : 0), 12, s, { anchor: "middle", size: 14, weight: 600 }) +
      text(x + W / 2 + (x >= 400 ? 20 : 0), 30, sub, { anchor: "middle", size: 12, tone: "muted" });
    b += head(cols[0]!, "Keyword list", "rank 1 to 4");
    b += head(cols[1]!, "Vector list", "rank 1 to 4");
    b += head(cols[2]!, "Fused, k = 60", "sum of 1 / (60 + rank)");
    b += head(cols[3]!, "Fused, k = 1", "sum of 1 / (1 + rank)");
    const y0 = 50;
    KEYWORD.forEach((d, i) => {
      b += box(cols[0]!, y0 + i * G, W, H, `${i + 1}.  ${d}`, { tone: TONE[d] ?? "orange", size: 14, weight: 600 });
    });
    VECTOR.forEach((d, i) => {
      b += box(cols[1]!, y0 + i * G, W, H, `${i + 1}.  ${d}`, { tone: TONE[d] ?? "blue", size: 14, weight: 600 });
    });
    const fusedCol = (x: number, k: number, digits: number) =>
      fuse(k)
        .map(([d, v], i) => box(x, y0 + i * G, W + 40, H, `${i + 1}.  ${d}   ${v.toFixed(digits)}`, { tone: TONE[d] ?? "grey", size: 14, weight: 600 }))
        .join("");
    b += fusedCol(cols[2]!, 60, 4);
    b += fusedCol(cols[3]!, 1, 3);
    b += arrow(cols[1]! + W + 14, y0 + 1.5 * G + H / 2, cols[2]! - 14, y0 + 1.5 * G + H / 2, { tone: "muted" });
    const ny = y0 + 5 * G + 8;
    b += line(30, ny - 10, 800, ny - 10, { tone: "grid", sw: 1 });
    b += text(30, ny + 10, "k = 60: C, found by both lists, stays well ahead of F, found by one.", { size: 13, tone: "green" });
    b += text(30, ny + 32, "k = 1: F's first place in one list is now worth more than C's two lower places.", { size: 13, tone: "purple" });
    return svg(
      {
        width: 820,
        height: ny + 42,
        title: "Reciprocal rank fusion on two short lists",
        credit: "Made-up lists, real arithmetic. D appears in one list only, near the bottom.",
        desc: example.alt,
      },
      b,
    );
  },
};

// Table 1 of Cormack, Clarke & Büttcher (2009), in sources/cormack-reciprocal-rank-fusion.md:
// MAP of RRF over 30 systems on TREC topics 351-400, by k. Best single system: .2016.
const SWEEP: [number, number][] = [
  [0, 0.2072], [10, 0.2123], [20, 0.2134], [30, 0.2139], [40, 0.2138], [50, 0.2144],
  [60, 0.2145], [70, 0.2146], [80, 0.2147], [90, 0.2145], [100, 0.2142],
];
const K500 = 0.2098;
const BEST_SINGLE = 0.2016;

const sweep: Figure = {
  slug: "k-sweep",
  alt: "Line chart from Cormack et al. (2009): retrieval quality (MAP) of reciprocal rank fusion over 30 search systems as k goes from 0 to 100. It rises from 0.2072 at k = 0 to about 0.214 by k = 30 and stays nearly flat through k = 100, peaking at 0.2147 at k = 80; at k = 60 it is 0.2145. At k = 500 it drops to 0.2098. Every value is above the best single system, 0.2016.",
  render() {
    const p = { x: 80, y: 20, w: 620, h: 250 };
    const x = scaleLinear().domain([0, 100]).range([p.x, p.x + p.w]);
    const y = scaleLinear().domain([0.2, 0.216]).range([p.y + p.h, p.y]);
    let b = yAxis(p, y, [0.2, 0.204, 0.208, 0.212, 0.216], (n) => n.toFixed(3), "MAP (higher is better)");
    b += xAxis(p, x, [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100], String, "k");
    b += line(p.x, y(BEST_SINGLE), p.x + p.w, y(BEST_SINGLE), { tone: "orange", dash: true, sw: 1.5 });
    b += text(p.x + p.w - 4, y(BEST_SINGLE) - 8, `best single system: ${BEST_SINGLE}`, { anchor: "end", size: 12.5, tone: "orange", weight: 600 });
    b += series(SWEEP.map(([k, v]) => [x(k), y(v)]), { tone: "blue", dots: true, smooth: false });
    b += circle(x(60), y(0.2145), 6.5, { tone: "green" });
    b += text(x(60), y(0.2145) - 14, "k = 60: 0.2145", { anchor: "middle", size: 12.5, weight: 600, tone: "green" });
    b += text(x(0) + 10, y(0.2072) + 4, "k = 0: 0.2072", { size: 12.5, tone: "blue" });
    b += text(p.x + p.w, y(0.206), `(off the chart: k = 500 gives ${K500})`, { anchor: "end", size: 12.5, tone: "muted" });
    return svg(
      {
        width: p.x + p.w + 30,
        height: p.y + p.h + 48,
        title: "In the original paper, k barely mattered between 20 and 100",
        credit: "Data: Cormack, Clarke & Büttcher (2009), Table 1. Fusion of 30 search systems, TREC topics 351–400. y axis starts at 0.2.",
        desc: sweep.alt,
      },
      b,
    );
  },
};

export default [example, sweep];
