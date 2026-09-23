import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import type { Depth, Edge, Graph, NodeSummary, Status } from "./graph";

// Reads content/ at build time. scripts/check.ts is what validates it;
// this only trusts the shape check.ts enforces.

const NODES_DIR = path.join(process.cwd(), "content", "nodes");

const WIKILINK = /\[\[([a-z0-9-]+)(?:\|[^\]]*)?\]\]/g;
const COMMENT = /<!--[\s\S]*?-->/g;
const IMAGE = /!\[[^\]]*\]\([^)]*\)/g;

// Drafts get pages locally and on preview deploys; production shows only published.
const SHOW_DRAFTS = process.env.SHOW_DRAFTS === "1" || process.env.NODE_ENV !== "production";
const DRAFT_STATUSES: Status[] = ["drafting", "review"];

type RawNode = {
  id: string;
  title: string;
  note: string;
  depth: Depth;
  phase: number;
  status: Status;
  updated: string;
  needs: string[];
  leadsTo: string[];
  compareWith: string[];
  mentions: string[];
  words: number;
  body: string;
};

const loadRaw = cache((): Map<string, RawNode> => {
  const nodes = new Map<string, RawNode>();
  for (const phaseDir of fs.readdirSync(NODES_DIR)) {
    const dir = path.join(NODES_DIR, phaseDir);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith(".md"))) {
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      const text = content.replace(COMMENT, "");
      const updated = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated ?? "");
      nodes.set(data.id, {
        id: data.id,
        title: data.title,
        note: data.note,
        depth: data.depth,
        phase: Number(data.phase),
        status: data.status,
        updated,
        needs: data.needs ?? [],
        leadsTo: data.leads_to ?? [],
        compareWith: data.compare_with ?? [],
        mentions: [...new Set([...text.matchAll(WIKILINK)].map(m => m[1]))].filter(t => t !== data.id),
        words: text.replace(IMAGE, "").split(/\s+/).filter(Boolean).length,
        body: content,
      });
    }
  }
  return nodes;
});

const isReadable = (status: Status) => status === "published" || (SHOW_DRAFTS && DRAFT_STATUSES.includes(status));

export const getGraph = cache((): Graph => {
  const raw = loadRaw();
  const has = (id: string) => raw.has(id);
  const pair = (a: string, b: string) => [a, b].sort().join("~");

  const needs = new Map<string, Edge>();
  for (const n of raw.values()) {
    for (const a of n.needs.filter(has)) needs.set(`${a}>${n.id}`, { source: a, target: n.id, kind: "needs" });
    for (const b of n.leadsTo.filter(has)) needs.set(`${n.id}>${b}`, { source: n.id, target: b, kind: "needs" });
  }
  const compare = new Map<string, Edge>();
  for (const n of raw.values())
    for (const b of n.compareWith.filter(has)) compare.set(pair(n.id, b), { source: n.id, target: b, kind: "compare" });
  const mention = new Map<string, Edge>();
  for (const n of raw.values())
    for (const b of n.mentions.filter(has)) {
      if (needs.has(`${n.id}>${b}`) || needs.has(`${b}>${n.id}`) || compare.has(pair(n.id, b))) continue;
      mention.set(pair(n.id, b), { source: n.id, target: b, kind: "mention" });
    }

  const parents = new Map<string, string[]>();
  for (const e of needs.values()) parents.set(e.target, [...(parents.get(e.target) ?? []), e.source]);
  const level = new Map<string, number>();
  const levelOf = (id: string, seen = new Set<string>()): number => {
    if (level.has(id)) return level.get(id)!;
    if (seen.has(id)) return 0; // a cycle in needs; stop here rather than loop
    seen.add(id);
    const ps = parents.get(id) ?? [];
    const l = ps.length ? 1 + Math.max(...ps.map(p => levelOf(p, seen))) : 0;
    level.set(id, l);
    return l;
  };

  const nodes: NodeSummary[] = [...raw.values()]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(n => ({
      id: n.id,
      title: n.title,
      note: n.note,
      depth: n.depth,
      phase: n.phase,
      status: n.status,
      updated: n.updated,
      words: n.words,
      level: levelOf(n.id),
      readable: isReadable(n.status),
      compareWith: n.compareWith.filter(has),
    }));

  return {
    nodes,
    edges: [...needs.values(), ...compare.values(), ...mention.values()],
    maxLevel: Math.max(0, ...nodes.map(n => n.level)),
  };
});

export function getNodeBody(id: string): { phase: number; body: string } | null {
  const n = loadRaw().get(id);
  return n ? { phase: n.phase, body: n.body } : null;
}
