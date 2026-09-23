import "server-only";

import fs from "node:fs";
import path from "node:path";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import { toJsxRuntime, type Components } from "hast-util-to-jsx-runtime";
import { visit, SKIP } from "unist-util-visit";
import type { Root as MdRoot, PhrasingContent, Link } from "mdast";
import type { Root as HastRoot, Element } from "hast";
import NextLink from "next/link";
import type { LinkedNode } from "./graph";

export type Heading = { id: string; text: string };

const NODES_DIR = path.join(process.cwd(), "content", "nodes");

const WIKILINK = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;

/** [[id]] and [[id|words]] become links to /n/id, marked so the renderer can add a hover card. */
function remarkWikilinks() {
  return (tree: MdRoot) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === undefined || !node.value.includes("[[")) return;
      const parts: PhrasingContent[] = [];
      let last = 0;
      for (const m of node.value.matchAll(WIKILINK)) {
        if (m.index! > last) parts.push({ type: "text", value: node.value.slice(last, m.index) });
        const link: Link = {
          type: "link",
          url: `/n/${m[1]}`,
          children: [{ type: "text", value: m[2] ?? m[1] }],
          data: { hProperties: { "data-node": m[1] } },
        };
        parts.push(link);
        last = m.index! + m[0].length;
      }
      if (last < node.value.length) parts.push({ type: "text", value: node.value.slice(last) });
      parent.children.splice(index, 1, ...parts);
      return [SKIP, index + parts.length];
    });
  };
}

/** Drop authoring comments and the h1 (the page renders the title). */
function remarkSiteShape() {
  return (tree: MdRoot) => {
    tree.children = tree.children.filter(n => !(n.type === "html" && n.value.trim().startsWith("<!--")));
    const h1 = tree.children.findIndex(n => n.type === "heading" && n.depth === 1);
    if (h1 !== -1) tree.children.splice(h1, 1);
  };
}

/** A paragraph holding only an image becomes a figure. */
function rehypeFigures() {
  return (tree: HastRoot) => {
    visit(tree, "element", node => {
      if (node.tagName !== "p") return;
      const kids = node.children.filter(c => !(c.type === "text" && !c.value.trim()));
      if (kids.length === 1 && kids[0].type === "element" && kids[0].tagName === "img") {
        node.tagName = "figure";
        node.children = [kids[0]];
      }
    });
  };
}

/** How an in-text concept link renders. Defaults to a plain link to the concept's page. */
export type ConceptLink = React.ComponentType<{ node: LinkedNode; children: React.ReactNode }>;

export function renderMarkdown(
  body: string,
  phase: number,
  nodes: Map<string, LinkedNode>,
  options: { Link?: ConceptLink } = {},
) {
  const Concept = options.Link ?? PlainConceptLink;
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikilinks)
    .use(remarkSiteShape)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeFigures);
  const hast = processor.runSync(processor.parse(body)) as HastRoot;

  const headings: Heading[] = [];
  visit(hast, "element", (el: Element) => {
    if (el.tagName === "h2" && el.properties.id) headings.push({ id: String(el.properties.id), text: hastText(el) });
  });

  const components: Partial<Components> = {
    a: ({ href, children, ...rest }) => {
      const id = (rest as Record<string, unknown>)["data-node"] as string | undefined;
      const node = id ? nodes.get(id) : undefined;
      if (id && node) return <Concept node={node}>{children}</Concept>;
      const external = href?.startsWith("http");
      return (
        <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          {children}
        </a>
      );
    },
    img: ({ src, alt }) => {
      // Figures are our own SVGs (visuals/). They're inlined so they use the site's fonts and
      // follow its day/night theme; their styles are scoped to .fig so they can't leak out.
      const file = typeof src === "string" && src.startsWith("img/") ? path.join(NODES_DIR, `phase-${phase}`, src) : null;
      if (file?.endsWith(".svg") && fs.existsSync(file)) {
        return <span className="figure-svg" dangerouslySetInnerHTML={{ __html: fs.readFileSync(file, "utf8") }} />;
      }
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" />;
    },
  };

  const content = toJsxRuntime(hast, { Fragment, jsx, jsxs, components });
  return { content, headings };
}

function hastText(el: Element): string {
  let out = "";
  visit(el, "text", t => {
    out += t.value;
  });
  return out;
}

function PlainConceptLink({ node, children }: { node: LinkedNode; children: React.ReactNode }) {
  return <NextLink href={`/n/${node.id}`}>{children}</NextLink>;
}
