import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGraph, getNodeBody } from "@/lib/content";
import type { LinkedNode } from "@/lib/graph";
import { zoneLabel } from "@/lib/phases";
import { renderMarkdown } from "@/lib/markdown";
import { getAtlas } from "@/components/transit/zone-page";
import { minutes } from "@/components/transit/route";
import { StationEnd, StationStrip, TransitConceptLink, type StationInfo } from "@/components/transit/station-client";
import s from "@/components/transit/transit.module.css";
import "katex/dist/katex.min.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getGraph()
    .nodes.filter(n => n.readable)
    .map(n => ({ id: n.id }));
}

export async function generateMetadata({ params }: PageProps<"/n/[id]">): Promise<Metadata> {
  const { id } = await params;
  const n = getGraph().nodes.find(x => x.id === id);
  return n ? { title: n.title, description: n.note } : {};
}

export default async function StationPage({ params }: PageProps<"/n/[id]">) {
  const { id } = await params;
  const graph = getGraph();
  const node = graph.nodes.find(n => n.id === id);
  const source = getNodeBody(id);
  if (!node?.readable || !source) notFound();

  const atlas = getAtlas();
  const slim = { ...graph, edges: graph.edges.filter(e => e.kind === "needs") };
  const station = atlas.stations[id];
  const info: StationInfo = atlas.stations;
  const linked = new Map<string, LinkedNode>(
    graph.nodes.map(n => [n.id, { id: n.id, title: n.title, note: n.note, depth: n.depth, words: n.words, readable: n.readable }]),
  );
  const { content } = renderMarkdown(source.body, source.phase, linked, { Link: TransitConceptLink });
  const shared = { graph: slim, lines: atlas.lines, edgeLines: atlas.edgeLines, info, id };

  return (
    <div className={s.stationPage}>
      <StationStrip {...shared} serving={station.lines} />
      <article className={s.article}>
        <header className={s.articleHead}>
          <p className={s.articleMeta}>
            <span>{station.name}</span>
            <span>{zoneLabel(station.phase)}</span>
            <span>{node.depth === "deep" ? "Deep dive" : "Short read"}</span>
            <span>{minutes(node.words)} min</span>
            <span>Updated {node.updated}</span>
          </p>
          <h1 className={s.articleTitle}>{node.title}</h1>
          <p className={s.articleLede}>{node.note}</p>
        </header>
        <div className={s.prose}>{content}</div>
        <StationEnd {...shared} />
      </article>
    </div>
  );
}
