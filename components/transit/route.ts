// Turning a prerequisite trail into a ride: which line takes you into each stop, and where you change.
// Pure; used on the map and on station pages.

import { parentsOf, trailTo, type Graph } from "@/lib/graph";
import type { TLine } from "./model";

export type StopKind =
  | "start" // first stop of the trip
  | "ride" // same line as the stop before
  | "change" // change lines at the stop before
  | "back" // this stop hangs off an earlier stop, not the one just before
  | "also"; // a second starting point (no prerequisites of its own)

export type Stop = { id: string; kind: StopKind; line: string | null; from: string | null };

export const WPM = 230;
export const minutes = (words: number) => Math.max(1, Math.round(words / WPM));

export function planTrip(graph: Graph, edgeLines: Record<string, string[]>, to: string): Stop[] {
  const trail = trailTo(graph, to);
  const at = new Map(trail.map((id, i) => [id, i]));
  const stops: Stop[] = [];
  let current: string | null = null;
  // How many stops in a row, from i on, a line carries you without leaving it.
  const run = (line: string, i: number) => {
    let n = 0;
    for (let j = i; j < trail.length && (edgeLines[`${trail[j - 1]}>${trail[j]}`] ?? []).includes(line); j++) n++;
    return n;
  };
  trail.forEach((id, i) => {
    const ps = parentsOf(graph, id).filter(p => (at.get(p) ?? Infinity) < i);
    if (!ps.length) {
      stops.push({ id, kind: i === 0 ? "start" : "also", line: null, from: null });
      current = null;
      return;
    }
    const prev = trail[i - 1];
    const from = ps.includes(prev) ? prev : ps.sort((a, b) => at.get(b)! - at.get(a)!)[0];
    const ls = edgeLines[`${from}>${id}`] ?? [];
    // Stay on the current line unless another one goes further without a change.
    const best = [...ls].sort((a, b) => run(b, i) - run(a, i))[0] ?? null;
    const line = current && ls.includes(current) && (from !== prev || run(current, i) >= run(best!, i)) ? current : best;
    const kind: StopKind = from !== prev ? "back" : line === current ? "ride" : "change";
    stops.push({ id, kind, line, from });
    current = line;
  });
  // A starting stop is boarded on the line that leaves it.
  for (const s of stops) if (!s.line) s.line = stops.find(t => t.from === s.id)?.line ?? null;
  // The first hop out of a start is boarding, not a change.
  for (let i = 1; i < stops.length; i++) if (stops[i].kind === "change" && !stops[i - 1].from) stops[i].kind = "ride";
  return stops;
}

/** Which drawn segment lights up for each needs edge inside the trip. */
export function litSegments(graph: Graph, edgeLines: Record<string, string[]>, stops: Stop[]): { id: string; order: number }[] {
  const inTrip = new Map(stops.map((s, i) => [s.id, i]));
  const out: { id: string; order: number }[] = [];
  for (const e of graph.edges) {
    if (e.kind !== "needs" || !inTrip.has(e.source) || !inTrip.has(e.target)) continue;
    const stop = stops[inTrip.get(e.target)!];
    const ls = edgeLines[`${e.source}>${e.target}`] ?? [];
    const line = stop.from === e.source && stop.line && ls.includes(stop.line) ? stop.line : ls[0];
    if (line) out.push({ id: `${line}:${e.source}>${e.target}`, order: inTrip.get(e.target)! });
  }
  return out.sort((a, b) => a.order - b.order);
}

/** The line a station is mainly on, and where it sits along it (trunk, or trunk up to a branch). */
export function mainLine(lines: TLine[], id: string): { line: TLine; stops: string[] } | null {
  for (const l of lines) if (l.stations.includes(id)) return { line: l, stops: l.stations };
  for (const l of lines)
    for (const [a, b] of l.branches) {
      if (b !== id) continue;
      const i = l.stations.indexOf(a);
      return { line: l, stops: i >= 0 ? [...l.stations.slice(0, i + 1), id] : [a, id] };
    }
  return null;
}
