// The graph as the site sees it. Pure data and helpers, safe on server and client.

export type Depth = "deep" | "short";
export type Status = "planned" | "reading" | "drafting" | "review" | "published";
export type EdgeKind = "needs" | "compare" | "mention";

export type NodeSummary = {
  id: string;
  title: string;
  note: string;
  depth: Depth;
  phase: number;
  status: Status;
  updated: string;
  words: number;
  level: number; // longest chain of prerequisites above this node
  readable: boolean; // has a page on this build
  compareWith: string[];
};

/** What an in-text concept link needs to know about its target. */
export type LinkedNode = { id: string; title: string; note: string; depth: Depth; words: number; readable: boolean };

export type Edge = { source: string; target: string; kind: EdgeKind };

export type Graph = {
  nodes: NodeSummary[];
  edges: Edge[];
  maxLevel: number;
};

export function parentsOf(graph: Graph, id: string): string[] {
  return graph.edges.filter(e => e.kind === "needs" && e.target === id).map(e => e.source);
}

export function childrenOf(graph: Graph, id: string): string[] {
  return graph.edges.filter(e => e.kind === "needs" && e.source === id).map(e => e.target);
}

/** Every ancestor of `id`, prerequisites first, ending with `id`. */
export function trailTo(graph: Graph, id: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const visit = (x: string) => {
    if (seen.has(x)) return;
    seen.add(x);
    parentsOf(graph, x).forEach(visit);
    out.push(x);
  };
  visit(id);
  return out;
}

export type ReaderState = "done" | "ready" | "locked";

export function readerState(graph: Graph, id: string, understood: ReadonlySet<string>): ReaderState {
  if (understood.has(id)) return "done";
  return parentsOf(graph, id).every(p => understood.has(p)) ? "ready" : "locked";
}

/** "What is softmax?" -> "softmax", for inline mentions. */
export function shortTitle(title: string): string {
  return title.replace(/^(What|How|Why) (is|are|does|do) (an? |the )?/i, "").replace(/\?$/, "");
}
