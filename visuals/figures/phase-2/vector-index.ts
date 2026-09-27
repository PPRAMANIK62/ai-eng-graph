import { series, scaleLinear, scaleLog, xAxis, yAxis } from "../../lib/chart.ts";
import { circle, line, path, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// 1. Recall vs throughput for pgvector's HNSW index.
// Source: sources/katz-pgvector-quantization.md, dbpedia-openai-1000k-angular
// (1M vectors, 1536 dims), m = 16, ef_construction = 256, full `vector` index.
// ---------------------------------------------------------------------------

const RUNS = [
  { ef: 10, recall: 85.1, qps: 1162 },
  { ef: 40, recall: 96.8, qps: 567 },
  { ef: 200, recall: 99.6, qps: 156 },
  { ef: 800, recall: 99.9, qps: 48 },
];

const curve: Figure = {
  slug: "recall-vs-speed",
  alt: "A line chart of recall against queries per second for pgvector's HNSW index on 1 million 1,536-dimension vectors. Four points, one per ef_search setting: 10 gives 85.1% recall at 1,162 queries per second, 40 gives 96.8% at 567, 200 gives 99.6% at 156, and 800 gives 99.9% at 48. Higher recall costs throughput, and the last steps toward 100% cost the most.",
  render() {
    const p = { x: 76, y: 16, w: 560, h: 280 };
    const x = scaleLog().domain([30, 2000]).range([p.x, p.x + p.w]);
    const y = scaleLinear().domain([82, 100]).range([p.y + p.h, p.y]);
    let b = yAxis(p, y, [82, 86, 90, 94, 98], (n) => `${n}%`, "recall");
    b += xAxis(p, x, [50, 100, 200, 500, 1000, 2000], (n) => n.toLocaleString("en-US"), "queries per second, log scale (higher is faster)");
    // Exact search always has 100% recall; mark the ceiling.
    b += line(p.x, y(100), p.x + p.w, y(100), { tone: "green", sw: 1.5, dash: true });
    b += text(p.x + p.w - 4, y(100) - 8, "exact search: 100% recall", { anchor: "end", size: 12, tone: "green" });
    const pts = RUNS.map((r) => [x(r.qps), y(r.recall)] as [number, number]);
    b += series(pts, { tone: "blue", dots: true, smooth: false });
    const place: Record<number, [number, number, "start" | "end" | "middle"]> = {
      10: [-12, -34, "middle"],
      40: [12, 20, "start"],
      200: [12, 22, "start"],
      800: [0, 26, "middle"],
    };
    for (const r of RUNS) {
      const [dx, dy, anchor] = place[r.ef]!;
      const px = x(r.qps) + dx, py = y(r.recall) + dy;
      b += text(px, py, `ef_search ${r.ef}`, { anchor, size: 12.5, weight: 600 });
      b += text(px, py + 16, `${r.recall}% · ${r.qps.toLocaleString("en-US")}/s`, { anchor, size: 12, tone: "muted" });
    }
    return svg(
      {
        width: 680,
        height: p.y + p.h + 50,
        title: "More recall, fewer queries per second",
        credit: "Data: Jonathan Katz, 2024. pgvector HNSW, m=16, ef_construction=256, 1M dbpedia-openai vectors (1,536 dims).",
        desc: curve.alt,
      },
      b,
    );
  },
};

// ---------------------------------------------------------------------------
// 2. Flat vs clustering vs graph, on one made-up scatter of points.
// Illustrative layout, not data. The mechanisms follow sources/douze-faiss-library.md
// (brute force; IVF visits only nearby clusters; graphs follow edges toward the query).
// ---------------------------------------------------------------------------

// Seeded pseudo-random points in the unit square, so the figure is stable.
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}
const r = rng(7);
// Hand-placed first: close neighbors on both sides of the cluster border at x = 0.5.
const QUERY: [number, number] = [0.42, 0.4];
const POINTS: [number, number][] = [[0.36, 0.33], [0.54, 0.43]];
const CENTERS: [number, number][] = [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]];
while (POINTS.length < 32) {
  const pt: [number, number] = [0.06 + r() * 0.88, 0.06 + r() * 0.88];
  const clear = (q: [number, number], d: number) => Math.hypot(q[0] - pt[0], q[1] - pt[1]) > d;
  if (POINTS.every((q) => clear(q, 0.11)) && CENTERS.every((q) => clear(q, 0.06)) && clear(QUERY, 0.09)) POINTS.push(pt);
}
const dist = (a: [number, number], c: [number, number]) => Math.hypot(a[0] - c[0], a[1] - c[1]);
const byDist = POINTS.map((pt, i) => ({ i, d: dist(pt, QUERY) })).sort((a, c) => a.d - c.d);
const NEAREST = new Set(byDist.slice(0, 3).map((o) => o.i));

const three: Figure = {
  slug: "three-ways",
  alt: "Three panels over the same scatter of stored vectors and one query. Flat search draws a line from the query to every vector. A clustering index groups the vectors into cells around centroids and only scans the cell nearest the query, so it misses two close neighbors just over the border. A graph index starts at an entry point and hops along edges toward the query, visiting 7 of the 32 vectors.",
  render() {
    const S = 230, GAP = 34, L = 24, TOP = 54;
    const px = (i: number, v: [number, number]) => [L + i * (S + GAP) + v[0] * S, TOP + v[1] * S] as const;
    let b = "";
    const head = (i: number, t: string, sub: string) =>
      text(L + i * (S + GAP), 8, t, { size: 14, weight: 600 }) + text(L + i * (S + GAP), 28, sub, { size: 12.5, tone: "muted" });
    const frame = (i: number) => rect(L + i * (S + GAP), TOP, S, S, { tone: "grey", fill: "none", sw: 1, r: 2 });
    const query = (i: number) => {
      const [qx, qy] = px(i, QUERY);
      return circle(qx, qy, 7, { tone: "orange" }) + text(qx + 9, qy - 11, "query", { size: 12, weight: 600, tone: "orange" });
    };
    const dot = (i: number, v: [number, number], tone: Tone, solid: boolean) => {
      const [x, y] = px(i, v);
      return solid ? circle(x, y, 4.5, { tone }) : circle(x, y, 4, { tone, fill: "none", stroke: true });
    };

    // Panel 1: flat. Lines to every point.
    b += head(0, "1. Flat (exact)", `compares all ${POINTS.length} vectors`);
    b += frame(0);
    for (const v of POINTS) {
      const [x1, y1] = px(0, QUERY), [x2, y2] = px(0, v);
      b += line(x1, y1, x2, y2, { tone: "grid", sw: 1 });
    }
    POINTS.forEach((v, i) => (b += dot(0, v, NEAREST.has(i) ? "blue" : "grey", true)));
    b += query(0);

    // Panel 2: clustering. Four cells split at 0.5; centroids at the quadrant centers.
    b += head(1, "2. Clustering (IVF)", "scans only the nearest cell");
    b += rect(L + S + GAP, TOP, S / 2, S / 2, { tone: "orange", fill: "soft", stroke: false, r: 0 });
    b += frame(1);
    {
      const [mx, my] = px(1, [0.5, 0.5]);
      b += line(mx, TOP, mx, TOP + S, { tone: "muted", sw: 1.2, dash: true });
      b += line(L + S + GAP, my, L + S + GAP + S, my, { tone: "muted", sw: 1.2, dash: true });
      for (const c of CENTERS) {
        const [cx, cy] = px(1, c);
        b += path(`M${cx - 6},${cy - 6} L${cx + 6},${cy + 6} M${cx - 6},${cy + 6} L${cx + 6},${cy - 6}`, { tone: "muted", sw: 2 });
      }
    }
    POINTS.forEach((v, i) => {
      const inCell = v[0] < 0.5 && v[1] < 0.5;
      const missed = NEAREST.has(i) && !inCell;
      b += dot(1, v, missed ? "red" : inCell ? (NEAREST.has(i) ? "blue" : "grey") : "grey", inCell);
      if (missed) {
        const [x, y] = px(1, v);
        b += circle(x, y, 10, { tone: "red", fill: "none", stroke: true });
        b += text(x + 14, y + 4, "missed", { size: 12, weight: 600, tone: "red", baseline: "middle" });
      }
    });
    b += query(1);

    // Panel 3: graph. Each point links to its 3 nearest; greedy walk from an entry point.
    b += head(2, "3. Graph", "hops along edges toward the query");
    b += frame(2);
    const edges = new Set<string>();
    POINTS.forEach((v, i) => {
      POINTS.map((w, j) => ({ j, d: dist(v, w) }))
        .filter((o) => o.j !== i)
        .sort((a, c) => a.d - c.d)
        .slice(0, 3)
        .forEach(({ j }) => edges.add(i < j ? `${i}-${j}` : `${j}-${i}`));
    });
    const nbrs = (i: number) =>
      [...edges].map((e) => e.split("-").map(Number) as [number, number]).flatMap(([a, c]) => (a === i ? [c] : c === i ? [a] : []));
    for (const e of edges) {
      const [a, c] = e.split("-").map(Number) as [number, number];
      const [x1, y1] = px(2, POINTS[a]!), [x2, y2] = px(2, POINTS[c]!);
      b += line(x1, y1, x2, y2, { tone: "grid", sw: 1.2 });
    }
    // Entry: the point farthest from the query, bottom-right-ish.
    let cur = byDist[byDist.length - 1]!.i;
    const walk = [cur];
    for (;;) {
      const next = nbrs(cur).sort((a, c) => dist(POINTS[a]!, QUERY) - dist(POINTS[c]!, QUERY))[0]!;
      if (dist(POINTS[next]!, QUERY) >= dist(POINTS[cur]!, QUERY)) break;
      walk.push((cur = next));
    }
    for (let k = 1; k < walk.length; k++) {
      const [x1, y1] = px(2, POINTS[walk[k - 1]!]!), [x2, y2] = px(2, POINTS[walk[k]!]!);
      b += line(x1, y1, x2, y2, { tone: "blue", sw: 2.5 });
    }
    POINTS.forEach((v, i) => (b += dot(2, v, walk.includes(i) ? "blue" : "grey", walk.includes(i))));
    {
      const [ex, ey] = px(2, POINTS[walk[0]!]!);
      b += text(ex, ey + 20, "entry", { size: 12, weight: 600, tone: "blue", anchor: "middle" });
    }
    b += query(2);
    b += text(L + 2 * (S + GAP), TOP + S + 22, `visits ${walk.length} vectors`, { size: 12.5, tone: "muted" });

    b += text(L, TOP + S + 22, "blue: the nearest vectors found", { size: 12.5, tone: "muted" });
    b += text(L + S + GAP, TOP + S + 22, "×: cluster centers", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: L * 2 + S * 3 + GAP * 2,
        height: TOP + S + 34,
        title: "Three ways to find the nearest vectors",
        credit: "Illustrative layout, not data. Real vectors have hundreds of dimensions, not two.",
        desc: three.alt,
      },
      b,
    );
  },
};

export default [three, curve];
