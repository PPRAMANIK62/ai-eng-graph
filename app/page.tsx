import { getGraph } from "@/lib/content";
import { computeTransit } from "@/components/transit/model";
import { TransitMap } from "@/components/transit/transit-map";

export default function MapPage() {
  const graph = getGraph();
  const map = computeTransit(graph);
  // The client only needs needs-edges for trails and reader state.
  const slim = { ...graph, edges: graph.edges.filter(e => e.kind === "needs") };
  return <TransitMap graph={slim} map={map} />;
}
