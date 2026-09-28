// The graph drawn as transit maps, one per phase (a "zone" on the site). Pure and deterministic:
// runs on the server, result is plain data.
//
// 0. Subgraph: the phase's nodes, plus transfer stations (direct prerequisites from other phases).
// 1. Lines: a greedy path cover of the `needs` DAG. Keep taking the root-to-leaf path that
//    covers the most not-yet-covered edges (then the longest), until no path adds 2+ new edges.
//    Leftover edges become branches of the nearest line.
// 2. Layout: column = prerequisite level, rows assigned column by column so each line keeps going
//    straight where it can. Lines through a shared station sit side by side (ports).
//    Segments bend only at 45° or 90°.
// 3. Labels: first spot (above, below, 45°...) that hits no station, label or line.

import type { Graph, NodeSummary } from "@/lib/graph";
import { PHASES, PHASE_NAMES } from "@/lib/phases";

export type TLine = {
  id: string;
  phase: number;
  name: string;
  color: string;
  /** Text color that reads on `color`. */
  ink: string;
  /** Trunk, in riding order. */
  stations: string[];
  branches: [string, string][];
};

export type TStation = {
  id: string;
  name: string;
  title: string;
  note: string;
  level: number;
  words: number;
  readable: boolean;
  /** Home phase. */
  phase: number;
  /** From another phase: drawn here only as the place to change for it. */
  transfer: boolean;
  x: number;
  y: number;
  /** Lines serving this station, top to bottom. */
  lines: string[];
  /** Vertical offset of each line's track at this station. */
  ports: Record<string, number>;
  /** Half height of the glyph (circle radius or half the capsule). */
  hh: number;
  interchange: boolean;
  /** Not on any line (no prerequisites and nothing needs it). Drawn in the "opening later" strip. */
  detached: boolean;
};

export type TSegment = { id: string; line: string; from: string; to: string; d: string };

export type TLabel = { id: string; x: number; y: number; rotate: number; anchor: "start" | "middle" | "end"; rows: string[] };

export type TransitMap = {
  phase: number;
  width: number;
  height: number;
  lines: TLine[];
  stations: TStation[];
  segments: TSegment[];
  labels: TLabel[];
  /** "a>b" -> lines drawing that needs edge. */
  edgeLines: Record<string, string[]>;
  /** Where the "opening later" strip sits, if any. */
  later: { x: number; y: number } | null;
};

// Geometry, in map units (1 unit = 1px at zoom 1).
export const STROKE = 7;
const GAP = 9; // center-to-center of parallel tracks
const COL = 196;
const ROW = 78;
const R = 8; // single-line station radius
const PAD = 90;
const STUB = 20; // straight run into and out of a station before a bend
const CORNER = 14;

// Line colors are CSS variables (--line-0 … --line-10 in app/globals.css) so the map follows the theme.
// Order: red, cobalt, green, orange, violet, teal, pink, brown, navy, lime, slate.
const LINE_COUNT = 11;
const COLORS: { color: string; ink: string }[] = Array.from({ length: LINE_COUNT }, (_, i) => ({
  color: `var(--line-${i})`,
  ink: `var(--line-${i}-ink)`,
}));

const SMALL = new Set(["of", "as", "and", "to", "the", "a", "in", "for", "vs"]);
const ACRONYMS: Record<string, string> = { ai: "AI", llm: "LLM", kv: "KV", api: "API", rlhf: "RLHF", bpe: "BPE", xml: "XML", rag: "RAG", mrr: "MRR", bm25: "BM25", hnsw: "HNSW", ui: "UI", dont: "Don’t" };

/** "kv-cache" -> "KV Cache". Titles are questions, so station names come from ids. */
export function stationName(id: string): string {
  return id
    .split("-")
    .map((w, i) => ACRONYMS[w] ?? (i > 0 && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

const key = (a: string, b: string) => `${a}>${b}`;

// ---------- 1. Lines ----------

function buildLines(graph: Graph, phase: number): TLine[] {
  const needs = graph.edges.filter(e => e.kind === "needs");
  const children = new Map<string, string[]>();
  const parents = new Map<string, string[]>();
  for (const e of needs) {
    children.set(e.source, [...(children.get(e.source) ?? []), e.target]);
    parents.set(e.target, [...(parents.get(e.target) ?? []), e.source]);
  }
  for (const list of children.values()) list.sort();
  const level = new Map(graph.nodes.map(n => [n.id, n.level]));
  const roots = graph.nodes.filter(n => !parents.has(n.id) && children.has(n.id)).map(n => n.id).sort();

  const covered = new Set<string>();
  const paths: string[][] = [];
  type Best = { unc: number; len: number; path: string[] };

  for (;;) {
    const memo = new Map<string, Best>();
    const bestFrom = (v: string): Best => {
      const hit = memo.get(v);
      if (hit) return hit;
      let best: Best = { unc: 0, len: 0, path: [v] };
      for (const c of children.get(v) ?? []) {
        const sub = bestFrom(c);
        const cand = { unc: sub.unc + (covered.has(key(v, c)) ? 0 : 1), len: sub.len + 1, path: [v, ...sub.path] };
        if (cand.unc > best.unc || (cand.unc === best.unc && cand.len > best.len)) best = cand;
      }
      memo.set(v, best);
      return best;
    };
    let best: Best | null = null;
    for (const r of roots) {
      const b = bestFrom(r);
      if (!best || b.unc > best.unc || (b.unc === best.unc && b.len > best.len)) best = b;
    }
    if (!best || best.unc < 2) break;
    // A new line starts where it leaves the tracks it shares, not back at the root.
    let i = 0;
    while (i < best.path.length - 2 && covered.has(key(best.path[i], best.path[i + 1]))) i++;
    paths.push(best.path.slice(i));
    for (let i = 1; i < best.path.length; i++) covered.add(key(best.path[i - 1], best.path[i]));
  }

  const lineId = (i: number) => `p${phase}-l${i}`;
  const lines: TLine[] = paths.map((stations, i) => ({ id: lineId(i), phase, name: "", ...COLORS[i % COLORS.length], stations, branches: [] }));

  // Leftover edges: branches of the nearest line. Sources first, so a branch can hang off a branch.
  const leftovers = needs
    .filter(e => !covered.has(key(e.source, e.target)))
    .sort((a, b) => level.get(a.source)! - level.get(b.source)! || a.source.localeCompare(b.source) || a.target.localeCompare(b.target));
  const serves = (l: TLine, x: string) => l.stations.includes(x) || l.branches.some(([a, b]) => a === x || b === x);
  for (const e of leftovers) {
    const both = lines.filter(l => serves(l, e.source) && serves(l, e.target));
    const into = lines.filter(l => serves(l, e.target));
    const from = lines.filter(l => serves(l, e.source)).sort((a, b) => a.branches.length - b.branches.length);
    let line = both[0] ?? into[0] ?? from[0];
    if (!line) {
      // An island no line reaches: it gets its own short line.
      line = { id: lineId(lines.length), phase, name: "", ...COLORS[lines.length % COLORS.length], stations: [e.source, e.target], branches: [] };
      lines.push(line);
      continue;
    }
    line.branches.push([e.source, e.target]);
  }

  // Name each line after its terminal, like "KV Cache line".
  const used = new Set<string>();
  for (const l of lines) {
    let name = `${stationName(l.stations[l.stations.length - 1])} line`;
    if (used.has(name)) name = `${stationName(l.stations[l.stations.length - 1])} line via ${stationName(l.stations[1] ?? l.stations[0])}`;
    used.add(name);
    l.name = name;
  }
  return lines;
}

// ---------- 2. Layout ----------

type Pt = { x: number; y: number };

/** An octilinear route from a to b: straight, 45° (plus vertical if short on room), straight.
 *  The bend sits near b, or near a when `early`. */
function route(a: Pt, b: Pt, early = false): Pt[] {
  const dy = b.y - a.y;
  if (Math.abs(dy) < 0.5) return [a, b];
  const dx = b.x - a.x;
  const room = Math.max(0, Math.min(dx, COL) - 2 * STUB);
  const diag = Math.min(Math.abs(dy), room);
  const vert = Math.abs(dy) - diag;
  const s = Math.sign(dy);
  if (early) {
    const x0 = a.x + STUB;
    const pts: Pt[] = [a, { x: x0, y: a.y }];
    if (vert > 0.5) pts.push({ x: x0, y: a.y + s * vert });
    pts.push({ x: x0 + diag, y: b.y }, b);
    return pts;
  }
  const endX = b.x - STUB;
  const bendX = endX - diag;
  const pts: Pt[] = [a, { x: bendX, y: a.y }];
  if (vert > 0.5) pts.push({ x: bendX, y: a.y + s * vert });
  pts.push({ x: endX, y: b.y }, b);
  return pts;
}

/** Drops repeated and collinear points, so corners round cleanly. */
function dedupe(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  for (const p of pts) {
    const q = out[out.length - 1];
    if (q && Math.abs(q.x - p.x) < 0.01 && Math.abs(q.y - p.y) < 0.01) continue;
    const o = out[out.length - 2];
    if (o && q && Math.abs((q.x - o.x) * (p.y - q.y) - (q.y - o.y) * (p.x - q.x)) < 0.01) out.pop();
    out.push(p);
  }
  return out;
}

/** Polyline with rounded corners, as an SVG path. */
function toPath(pts: Pt[]): string {
  const f = (n: number) => Math.round(n * 10) / 10;
  let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i - 1], q = pts[i], n = pts[i + 1];
    const l1 = Math.hypot(q.x - p.x, q.y - p.y), l2 = Math.hypot(n.x - q.x, n.y - q.y);
    const r = Math.min(CORNER, l1 / 2, l2 / 2);
    const a = { x: q.x - ((q.x - p.x) / l1) * r, y: q.y - ((q.y - p.y) / l1) * r };
    const b = { x: q.x + ((n.x - q.x) / l2) * r, y: q.y + ((n.y - q.y) / l2) * r };
    d += ` L${f(a.x)} ${f(a.y)} Q${f(q.x)} ${f(q.y)} ${f(b.x)} ${f(b.y)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${f(last.x)} ${f(last.y)}`;
}

/** The phase's nodes plus transfers, with `level` recomputed inside it. */
function phaseGraph(g: Graph, phase: number): Graph {
  const home = new Set(g.nodes.filter(n => n.phase === phase).map(n => n.id));
  const edges = g.edges.filter(e => e.kind === "needs" && home.has(e.target));
  const ids = new Set([...home, ...edges.map(e => e.source)]);
  const parents = new Map<string, string[]>();
  for (const e of edges) parents.set(e.target, [...(parents.get(e.target) ?? []), e.source]);
  const level = new Map<string, number>();
  const levelOf = (id: string): number => {
    if (!level.has(id)) level.set(id, Math.max(-1, ...(parents.get(id) ?? []).map(levelOf)) + 1);
    return level.get(id)!;
  };
  const nodes: NodeSummary[] = g.nodes.filter(n => ids.has(n.id)).map(n => ({ ...n, level: levelOf(n.id) }));
  return { nodes, edges, maxLevel: Math.max(0, ...nodes.map(n => n.level)) };
}

export function computeTransit(full: Graph, phase: number): TransitMap {
  const graph = phaseGraph(full, phase);
  const lines = buildLines(graph, phase);
  const lineIdx = new Map(lines.map((l, i) => [l.id, i]));
  const node = new Map(graph.nodes.map(n => [n.id, n]));

  // Every drawn segment: trunk hops and branches, each one a needs edge.
  type Hop = { line: string; from: string; to: string; trunk: boolean };
  const hops: Hop[] = [];
  for (const l of lines) {
    for (let i = 1; i < l.stations.length; i++) hops.push({ line: l.id, from: l.stations[i - 1], to: l.stations[i], trunk: true });
    for (const [a, b] of l.branches) hops.push({ line: l.id, from: a, to: b, trunk: false });
  }
  const served = new Map<string, Set<string>>();
  for (const h of hops) for (const s of [h.from, h.to]) served.set(s, (served.get(s) ?? new Set()).add(h.line));

  // Where each station wants to sit: straight on from the station before it on its most important line.
  const incoming = new Map<string, Hop[]>();
  for (const h of hops) incoming.set(h.to, [...(incoming.get(h.to) ?? []), h]);
  const rank = (h: Hop) => (h.trunk ? 0 : 100) + lineIdx.get(h.line)!;

  const onMap = graph.nodes.filter(n => served.has(n.id));
  const row = new Map<string, number>();
  const taken = new Map<number, Set<number>>(); // column -> rows
  const take = (c: number, r: number) => (taken.get(c) ?? taken.set(c, new Set()).get(c)!).add(r);
  const isFree = (c: number, r: number) => !taken.get(c)?.has(r);
  const maxLevel = Math.max(0, ...onMap.map(n => n.level));

  for (let c = 0; c <= maxLevel; c++) {
    const here = onMap
      .filter(n => n.level === c)
      .map(n => {
        const via = [...(incoming.get(n.id) ?? [])].sort((a, b) => rank(a) - rank(b))[0];
        return { id: n.id, want: via ? row.get(via.from)! : 0, prio: via ? rank(via) : lineIdx.get([...served.get(n.id)!][0])! };
      })
      .sort((a, b) => a.prio - b.prio || a.id.localeCompare(b.id));
    for (const s of here) {
      let r = s.want;
      for (let k = 1; !isFree(c, r); k++) {
        // Nearest free row, alternating below then above.
        r = s.want + (k % 2 ? (k + 1) / 2 : -k / 2);
      }
      row.set(s.id, r);
      take(c, r);
    }
  }

  // Order lines inside each station top to bottom by where they come from and go to, so tracks cross less.
  const minRow = Math.min(0, ...row.values());
  const pos = (id: string): Pt => ({ x: PAD + node.get(id)!.level * COL, y: PAD + 40 + (row.get(id)! - minRow) * ROW });
  const stations: TStation[] = [];
  for (const n of onMap) {
    const ls = [...served.get(n.id)!];
    const lean = (lid: string) => {
      const ys = hops.filter(h => h.line === lid && (h.from === n.id || h.to === n.id)).map(h => row.get(h.from === n.id ? h.to : h.from)!);
      return ys.reduce((s, y) => s + y, 0) / ys.length;
    };
    ls.sort((a, b) => lean(a) - lean(b) || lineIdx.get(a)! - lineIdx.get(b)!);
    const ports: Record<string, number> = {};
    ls.forEach((l, i) => (ports[l] = (i - (ls.length - 1) / 2) * GAP));
    const p = pos(n.id);
    stations.push({
      id: n.id,
      name: stationName(n.id),
      title: n.title,
      note: n.note,
      level: n.level,
      words: n.words,
      readable: n.readable,
      phase: n.phase,
      transfer: n.phase !== phase,
      x: p.x,
      y: p.y,
      lines: ls,
      ports,
      hh: ls.length > 1 ? ((ls.length - 1) * GAP) / 2 + R : R,
      interchange: ls.length > 1,
      detached: false,
    });
  }
  const byId = new Map(stations.map(s => [s.id, s]));

  const segments: TSegment[] = [];
  const polylines: Pt[][] = [];
  const edgeLines: Record<string, string[]> = {};
  // Hops that skip columns: straight along the source row if it's clear, else along the target row,
  // else along a lane between rows (stations never sit there).
  const laneUse = new Map<string, number>(); // "col:halfRow" -> tracks already in that lane
  const clearRow = (r: number, c1: number, c2: number) => {
    for (let c = c1 + 1; c < c2; c++) if (!isFree(c, r)) return false;
    return true;
  };
  const hopPts = (h: Hop): Pt[] => {
    const a = byId.get(h.from)!, b = byId.get(h.to)!;
    const pa = { x: a.x, y: a.y + a.ports[h.line] }, pb = { x: b.x, y: b.y + b.ports[h.line] };
    const ra = row.get(a.id)!, rb = row.get(b.id)!;
    if (b.level - a.level <= 1 || clearRow(ra, a.level, b.level)) return route(pa, pb);
    if (clearRow(rb, a.level, b.level)) return route(pa, pb, true);
    const mid = (ra + rb) / 2;
    const options = Array.from({ length: 12 }, (_, i) => Math.floor(mid) + 0.5 + (i % 2 ? (i + 1) / 2 : -i / 2));
    const usage = (lr: number) => Math.max(...Array.from({ length: b.level - a.level - 1 }, (_, k) => laneUse.get(`${a.level + 1 + k}:${lr}`) ?? 0));
    // Nearest lane, but share a close one (side by side) rather than detour far.
    const lane = options.reduce((best, lr) => (Math.abs(lr - mid) + usage(lr) * 0.6 < Math.abs(best - mid) + usage(best) * 0.6 ? lr : best));
    const slot = usage(lane);
    for (let c = a.level + 1; c < b.level; c++) laneUse.set(`${c}:${lane}`, slot + 1);
    const ly = PAD + 40 + (lane - minRow) * ROW + slot * GAP;
    const l1 = { x: a.x + COL - STUB * 2, y: ly }, l2 = { x: b.x - COL + STUB * 2, y: ly };
    const first = route(pa, l1, true), last = route(l2, pb);
    return [...first, ...last];
  };
  for (const h of [...hops].sort((x, y) => rank(x) - rank(y))) {
    const pts = dedupe(hopPts(h));
    polylines.push(pts);
    segments.push({ id: `${h.line}:${key(h.from, h.to)}`, line: h.line, from: h.from, to: h.to, d: toPath(pts) });
    (edgeLines[key(h.from, h.to)] ??= []).push(h.line);
  }

  const maxY = Math.max(PAD, ...stations.map(s => s.y + s.hh));
  const detached = graph.nodes.filter(n => !served.has(n.id));
  const later = detached.length ? { x: PAD, y: maxY + 130 } : null;
  detached.forEach((n, i) => {
    stations.push({
      id: n.id,
      name: stationName(n.id),
      title: n.title,
      note: n.note,
      level: n.level,
      words: n.words,
      readable: n.readable,
      phase: n.phase,
      transfer: false,
      x: later!.x + 20 + i * COL,
      y: later!.y + 40,
      lines: [],
      ports: {},
      hh: R,
      interchange: false,
      detached: true,
    });
  });

  const labels = placeLabels(stations, polylines);

  // Bounds: stations, labels (roughly) and a margin.
  let w = 0, h = 0;
  for (const s of stations) {
    w = Math.max(w, s.x + 60);
    h = Math.max(h, s.y + s.hh + 40);
  }
  for (const l of labels) {
    const len = Math.max(...l.rows.map(textWidth));
    const ex = l.rotate ? l.x + len * Math.SQRT1_2 : l.anchor === "start" ? l.x + len : l.x + len / 2;
    const ey = l.rotate > 0 ? l.y + len * Math.SQRT1_2 : l.y + 18 * l.rows.length;
    w = Math.max(w, ex);
    h = Math.max(h, ey);
  }

  return { phase, width: Math.ceil(w + PAD), height: Math.ceil(h + PAD / 2), lines, stations, segments, labels, edgeLines, later };
}

// ---------- Atlas: every zone ----------

/** A station as its home zone knows it. */
export type AtlasStation = { name: string; title: string; phase: number; words: number; readable: boolean; lines: string[] };

export type Atlas = {
  zones: { phase: number; name: string; map: TransitMap; readable: boolean }[];
  /** Every zone's lines, and the lines drawing each needs edge. A trip can cross zones. */
  lines: TLine[];
  edgeLines: Record<string, string[]>;
  stations: Record<string, AtlasStation>;
};

export function computeAtlas(graph: Graph): Atlas {
  const zones = PHASES.filter(p => graph.nodes.some(n => n.phase === p)).map(phase => {
    const map = computeTransit(graph, phase);
    return { phase, name: PHASE_NAMES[phase], map, readable: map.stations.some(x => x.readable && !x.transfer) };
  });
  const stations: Record<string, AtlasStation> = {};
  for (const { map } of zones)
    for (const x of map.stations)
      if (!x.transfer) stations[x.id] = { name: x.name, title: x.title, phase: x.phase, words: x.words, readable: x.readable, lines: x.lines };
  return {
    zones,
    lines: zones.flatMap(z => z.map.lines),
    // Each needs edge is drawn only in its target's zone, so the maps never disagree.
    edgeLines: Object.assign({}, ...zones.map(z => z.map.edgeLines)),
    stations,
  };
}

// ---------- 3. Labels ----------

const FONT = 13.5;
const LINE_H = 16;

/** Rough width of bold signage type at FONT px. Good enough to keep labels apart. */
function textWidth(t: string): number {
  let w = 0;
  for (const ch of t) w += ch === " " ? 0.28 : /[A-Z]/.test(ch) ? 0.68 : /[il]/.test(ch) ? 0.27 : /[mw]/.test(ch) ? 0.85 : 0.56;
  return w * FONT;
}

/** Long names go on two rows when set horizontally. */
function wrap(name: string): string[] {
  if (name.length <= 13 || !name.includes(" ")) return [name];
  const words = name.split(" ");
  let best: string[] = [name], score = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" "), b = words.slice(i).join(" ");
    const s = Math.max(textWidth(a), textWidth(b));
    if (s < score) {
      score = s;
      best = [a, b];
    }
  }
  return best;
}

/** A thick segment: the shape used for every collision test. */
type Cap = { a: Pt; b: Pt; r: number };

function segDist(p1: Pt, p2: Pt, q1: Pt, q2: Pt): number {
  const d = (p: Pt, a: Pt, b: Pt) => {
    const vx = b.x - a.x, vy = b.y - a.y;
    const l = vx * vx + vy * vy;
    const t = l ? Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / l)) : 0;
    return Math.hypot(p.x - a.x - t * vx, p.y - a.y - t * vy);
  };
  const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const d1 = cross(q1, q2, p1), d2 = cross(q1, q2, p2), d3 = cross(p1, p2, q1), d4 = cross(p1, p2, q2);
  if (d1 * d2 < 0 && d3 * d4 < 0) return 0;
  return Math.min(d(p1, q1, q2), d(p2, q1, q2), d(q1, p1, p2), d(q2, p1, p2));
}
const hits = (a: Cap, b: Cap) => segDist(a.a, a.b, b.a, b.b) < a.r + b.r;

function placeLabels(stations: TStation[], polylines: Pt[][]): TLabel[] {
  const stationCaps: Cap[] = stations.map(s => ({ a: { x: s.x, y: s.y - s.hh + R }, b: { x: s.x, y: s.y + s.hh - R }, r: R + 3 }));
  const lineCaps: Cap[] = polylines.flatMap(pts => pts.slice(1).map((p, i) => ({ a: pts[i], b: p, r: STROKE / 2 + 1 })));
  const placed: Cap[][] = [];
  const out: TLabel[] = [];

  // Big interchanges first, then left to right.
  const order = [...stations].sort((a, b) => b.lines.length - a.lines.length || a.x - b.x || a.y - b.y);
  for (const s of order) {
    const one = [s.name];
    const two = wrap(s.name);
    // Transfers carry a small "Zone N" after the name (drawn at about 80% size).
    const hint = s.transfer ? textWidth(` Zone ${s.phase}`) * 0.8 : 0;
    const w1 = textWidth(s.name) + hint;
    const w2 = Math.max(...two.map(textWidth)) + hint;
    const top = s.y - s.hh, bot = s.y + s.hh;
    const h2 = two.length * LINE_H;
    const diag = (x: number, y: number, dir: 1 | -1, len: number): Cap => ({
      a: { x: x + 4, y: y + dir * 4 },
      b: { x: x + len * Math.SQRT1_2, y: y + dir * len * Math.SQRT1_2 },
      r: 8,
    });
    const box = (x0: number, y0: number, w: number, h: number): Cap =>
      w > h
        ? { a: { x: x0 + h / 2, y: y0 + h / 2 }, b: { x: x0 + w - h / 2, y: y0 + h / 2 }, r: h / 2 }
        : { a: { x: x0 + w / 2, y: y0 + w / 2 }, b: { x: x0 + w / 2, y: y0 + h - w / 2 }, r: w / 2 };

    type Cand = { label: TLabel; caps: Cap[]; pref: number };
    const cands: Cand[] = [
      // above, centered
      { label: { id: s.id, x: s.x, y: top - 10 - (two.length - 1) * LINE_H, rotate: 0, anchor: "middle", rows: two }, caps: [box(s.x - w2 / 2, top - 8 - h2, w2, h2)], pref: 0 },
      // below, centered
      { label: { id: s.id, x: s.x, y: bot + 20, rotate: 0, anchor: "middle", rows: two }, caps: [box(s.x - w2 / 2, bot + 7, w2, h2)], pref: 1 },
      // 45° up and to the right
      { label: { id: s.id, x: s.x + 6, y: top - 6, rotate: -45, anchor: "start", rows: one }, caps: [diag(s.x + 6, top - 6, -1, w1)], pref: 2 },
      // 45° down and to the right
      { label: { id: s.id, x: s.x + 6, y: bot + 12, rotate: 45, anchor: "start", rows: one }, caps: [diag(s.x + 2, bot + 6, 1, w1)], pref: 3 },
      // right, level
      { label: { id: s.id, x: s.x + R + 8, y: s.y + 5 - ((two.length - 1) * LINE_H) / 2, rotate: 0, anchor: "start", rows: two }, caps: [box(s.x + R + 6, s.y - h2 / 2, w2 + 4, h2)], pref: 4 },
      // left, level
      { label: { id: s.id, x: s.x - R - 8, y: s.y + 5 - ((two.length - 1) * LINE_H) / 2, rotate: 0, anchor: "end", rows: two }, caps: [box(s.x - R - 10 - w2, s.y - h2 / 2, w2 + 4, h2)], pref: 5 },
    ];

    let best: Cand = cands[0], bestCost = Infinity;
    for (const c of cands) {
      let cost = c.pref * 3;
      for (const cap of c.caps) {
        for (const sc of stationCaps) if (hits(cap, sc)) cost += 1000;
        for (const lc of lineCaps) if (hits(cap, lc)) cost += 40;
        for (const p of placed) for (const pc of p) if (hits(cap, pc)) cost += 600;
      }
      if (cost < bestCost) {
        bestCost = cost;
        best = c;
      }
    }
    placed.push(best.caps);
    out.push(best.label);
  }
  return out;
}
