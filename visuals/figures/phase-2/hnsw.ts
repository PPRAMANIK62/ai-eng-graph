import { circle, line, path, svg, text, type Figure } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// HNSW layers and a search from the top layer down.
// Illustrative layout, not data. The structure follows sources/malkov-hnsw.md
// (nested subsets, fewer vectors per higher layer, search starts at the top)
// and sources/pinecone-hnsw.md (longest links on top, greedy walk to a local
// minimum, then drop to the same vector one layer down). Redrawn, not traced.
// ---------------------------------------------------------------------------

type P = [number, number];
// 16 vectors in the unit square (hand-placed). Index lists say which reach which layer.
const PTS: P[] = [
  [0.08, 0.2], [0.22, 0.72], [0.3, 0.35], [0.4, 0.85], [0.47, 0.15], [0.55, 0.55], [0.62, 0.3], [0.7, 0.8],
  [0.78, 0.12], [0.85, 0.5], [0.93, 0.78], [0.15, 0.5], [0.35, 0.58], [0.66, 0.62], [0.9, 0.25], [0.52, 0.38],
];
const QUERY: P = [0.8, 0.66];
const LAYERS = [
  { name: "layer 2 (top)", ids: [0, 12, 10] },
  { name: "layer 1", ids: [0, 2, 5, 8, 9, 10, 12] },
  { name: "layer 0 (bottom)", ids: PTS.map((_, i) => i) },
];
const d = (a: P, b: P) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// Link each vector to its k nearest within the layer.
function edges(ids: number[], k: number) {
  const out = new Set<string>();
  for (const i of ids) {
    ids.filter((j) => j !== i)
      .sort((a, b) => d(PTS[i]!, PTS[a]!) - d(PTS[i]!, PTS[b]!))
      .slice(0, k)
      .forEach((j) => out.add(i < j ? `${i}-${j}` : `${j}-${i}`));
  }
  return [...out].map((e) => e.split("-").map(Number) as [number, number]);
}

// Greedy walk inside a layer from `start` until no neighbor is closer to the query.
function walk(start: number, es: [number, number][]) {
  const path = [start];
  let cur = start;
  for (;;) {
    const nb = es.flatMap(([a, b]) => (a === cur ? [b] : b === cur ? [a] : []));
    const best = nb.sort((a, b) => d(PTS[a]!, QUERY) - d(PTS[b]!, QUERY))[0];
    if (best === undefined || d(PTS[best]!, QUERY) >= d(PTS[cur]!, QUERY)) return path;
    path.push((cur = best));
  }
}

const figure: Figure = {
  slug: "layers",
  alt: "Three stacked layers of the same graph. The top layer has three vectors joined by long links, the middle layer has seven, and the bottom layer has all sixteen with short links. A search path starts at the entry point in the top layer, walks to the vector nearest the query, drops down a layer, walks again, and drops again, finishing next to the query in the bottom layer.",
  render() {
    const X0 = 170, W = 380, SKEW = 90, H = 110, GAP = 42;
    const proj = (layer: number, p: P) => [X0 + p[0] * W + (1 - p[1]) * SKEW, 10 + layer * (H + GAP) + p[1] * H] as const;
    let b = "";
    const K = [1, 2, 2];
    let start = 0; // entry point: vector 0 in the top layer
    const walks: number[][] = [];
    LAYERS.forEach((L, li) => {
      const es = edges(L.ids, K[li]!);
      // plane
      const c = [proj(li, [0, 0]), proj(li, [1, 0]), proj(li, [1, 1]), proj(li, [0, 1])];
      b += path(`M${c.map((q) => `${q[0]},${q[1]}`).join(" L")} Z`, { tone: "grid", sw: 1, fill: "grey", fillSoft: true });
      b += text(24, proj(li, [0, 0.5])[1], L.name, { size: 13, weight: 600, baseline: "middle" });
      b += text(24, proj(li, [0, 0.5])[1] + 18, `${L.ids.length} vectors`, { size: 12, tone: "muted", baseline: "middle" });
      for (const [a, c2] of es) {
        const [x1, y1] = proj(li, PTS[a]!), [x2, y2] = proj(li, PTS[c2]!);
        b += line(x1, y1, x2, y2, { tone: "grey", sw: 1.2 });
      }
      const w = walk(start, es);
      walks.push(w);
      for (let k = 1; k < w.length; k++) {
        const [x1, y1] = proj(li, PTS[w[k - 1]!]!), [x2, y2] = proj(li, PTS[w[k]!]!);
        b += line(x1, y1, x2, y2, { tone: "blue", sw: 2.2, arrow: true });
      }
      for (const i of L.ids) {
        const [x, y] = proj(li, PTS[i]!);
        b += circle(x, y, 5, { tone: w.includes(i) ? "blue" : "grey" });
      }
      const [qx, qy] = proj(li, QUERY);
      b += circle(qx, qy, 6.5, { tone: "orange", fill: "none", stroke: true });
      if (li === 0) {
        b += text(qx + 10, qy + 4, "query", { size: 12, weight: 600, tone: "orange" });
        const [ex, ey] = proj(li, PTS[start]!);
        b += text(ex - 10, ey - 8, "entry point", { size: 12, weight: 600, tone: "blue", anchor: "end" });
      }
      start = w[w.length - 1]!;
      // drop to the same vector in the layer below
      if (li < LAYERS.length - 1) {
        const [x1, y1] = proj(li, PTS[start]!), [x2, y2] = proj(li + 1, PTS[start]!);
        b += line(x1, y1 + 7, x2, y2 - 8, { tone: "blue", sw: 1.8, dash: true, arrow: true });
      }
    });
    const [fx, fy] = proj(2, PTS[start]!);
    b += text(fx, fy - 12, "nearest found", { size: 12, weight: 600, tone: "blue", anchor: "middle" });
    const bottom = 10 + 3 * H + 2 * GAP;
    b += text(24, bottom + 24, "Blue: the search path. Dashed: drop to the same vector one layer down.", { size: 12, tone: "muted" });
    b += text(24, bottom + 42, "Higher layers hold fewer vectors, so their links are longer.", { size: 12, tone: "muted" });
    void walks;
    return svg(
      {
        width: 700,
        height: bottom + 52,
        title: "HNSW searches from the sparse top layer down",
        credit: "Illustrative layout, not data. Idea from Malkov and Yashunin (2016); layout adapted from Pinecone's HNSW explainer.",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
