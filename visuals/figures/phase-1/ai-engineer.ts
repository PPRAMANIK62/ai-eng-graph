import { box, rect, svg, text, wrap, lines, type Figure, type Tone } from "../../lib/svg.ts";

// Layer contents from sources/huyen-ai-engineering-stack.md (Figure 1-14 text)
// and the "What the work looks like" section of nodes/phase-1/ai-engineer.md.
// Who spends time where: the article's "stack with three layers" paragraph.
const LAYERS = [
  { name: "Application development", items: "prompts · context · evaluation · interface · the product" },
  { name: "Model development", items: "modeling · training · fine-tuning · inference optimization · dataset engineering" },
  { name: "Infrastructure", items: "model serving · managing data and compute · monitoring" },
];

type Cell = { label?: string[]; tone: Tone; strength: "main" | "some" | "none" };
const ROLES: { name: string; tone: Tone; cells: Cell[] }[] = [
  {
    name: "AI engineer",
    tone: "blue",
    cells: [
      { label: ["Most of the time"], tone: "blue", strength: "main" },
      { label: ["Sometimes:", "fine-tuning"], tone: "blue", strength: "some" },
      { tone: "grey", strength: "none" },
    ],
  },
  {
    name: "ML engineer",
    tone: "orange",
    cells: [
      { tone: "grey", strength: "none" },
      { label: ["Most of the time"], tone: "orange", strength: "main" },
      { tone: "grey", strength: "none" },
    ],
  },
];

const figure: Figure = {
  slug: "stack",
  alt: "Three stacked layers: application development on top, model development in the middle, infrastructure at the bottom. The AI engineer spends most of their time in the top layer and sometimes reaches into the middle for fine-tuning. The ML engineer spends most of their time in the middle layer.",
  render() {
    const lx = 24, lw = 560, rowH = 80, gap = 12, top = 34;
    const cw = 150, cgap = 20, cx0 = lx + lw + 36;
    let body = "";
    body += text(lx, 14, "Layer of the stack", { size: 12.5, tone: "muted", weight: 600 });
    ROLES.forEach((r, j) => {
      body += text(cx0 + j * (cw + cgap) + cw / 2, 14, r.name, { size: 14, weight: 600, anchor: "middle", tone: r.tone });
    });
    LAYERS.forEach((l, i) => {
      const y = top + i * (rowH + gap);
      body += rect(lx, y, lw, rowH, { tone: "grey", fill: "soft" });
      body += text(lx + 18, y + 33, l.name, { size: 15, weight: 600 });
      body += lines(lx + 18, y + 57, wrap(l.items, lw - 36, 12.5), { size: 12.5, tone: "muted", gap: 17 });
      ROLES.forEach((r, j) => {
        const c = r.cells[i]!;
        const x = cx0 + j * (cw + cgap);
        if (c.strength === "main") body += box(x, y, cw, rowH, c.label!, { tone: c.tone, fill: "solid", stroke: false, textTone: "ink", size: 13.5, weight: 600 }).replace(/class="t-ink"/g, 'class="t-ink" style="fill:var(--bg)"');
        else if (c.strength === "some") body += box(x, y + 14, cw, rowH - 28, c.label!, { tone: c.tone, fill: "soft", dash: true, size: 13 });
        else body += rect(x, y, cw, rowH, { tone: "grey", fill: "none", dash: true, sw: 1, opacity: 0.6 });
      });
    });
    const h = top + 3 * rowH + 2 * gap + 8;
    return svg(
      {
        width: cx0 + 2 * cw + cgap + 24,
        height: h,
        title: "Same stack, different home: where AI and ML engineers spend their time",
        credit: "Layers adapted from Chip Huyen, AI Engineering (2025), Figure 1-14. Where each role sits is our summary.",
        desc: figure.alt,
      },
      body,
    );
  },
};

export default [figure];
