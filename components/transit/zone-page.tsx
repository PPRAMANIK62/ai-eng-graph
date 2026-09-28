import "server-only";

import { cache, ViewTransition } from "react";
import { getGraph } from "@/lib/content";
import { PHASES, PHASE_NAMES } from "@/lib/phases";
import { computeAtlas } from "./model";
import { TransitMap } from "./transit-map";
import { PAGE_VT } from "./nav";

export const getAtlas = cache(() => computeAtlas(getGraph()));

export function ZonePage({ phase }: { phase: number }) {
  const graph = getGraph();
  const atlas = getAtlas();
  const zone = atlas.zones.find(z => z.phase === phase)!;
  // Every zone is listed, so the switcher shows the whole journey; zones with nothing to read yet have no stops.
  const zones = PHASES.map(p => ({
    phase: p,
    name: PHASE_NAMES[p],
    stops: atlas.zones.find(z => z.phase === p)?.map.stations.filter(x => x.readable && !x.transfer).length ?? 0,
  }));
  // The client only needs needs-edges for trails and reader state.
  const slim = { ...graph, edges: graph.edges.filter(e => e.kind === "needs") };
  return (
    <ViewTransition key={phase} enter={PAGE_VT} exit={PAGE_VT} default="none">
      <TransitMap graph={slim} map={zone.map} lines={atlas.lines} edgeLines={atlas.edgeLines} info={atlas.stations} zones={zones} />
    </ViewTransition>
  );
}
