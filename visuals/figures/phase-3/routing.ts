import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Router shape from sources/anthropic-building-effective-agents.md (Workflow: Routing) and
// sources/anthropic-basic-workflows-cookbook.md (route(): label → dict of specialist prompts).
// The default path is our addition: the cookbook has none (see that note), and
// sources/aurelio-semantic-router.md returns None when nothing matches.
const router: Figure = {
  slug: "router",
  alt: "A router in front of four paths. The question goes to the router, which returns one label. Code maps the label to a path: explain (one article), compare (two articles), build plan (a route through concepts), off-topic (a short refusal). A fifth arrow, dashed, goes to a default path when the label is unknown or the router isn't confident.",
  render() {
    let b = "";
    const cy = 150;
    b += box(20, cy - 22, 120, 44, "question", { tone: "grey", size: 13.5 });
    b += arrow(140, cy, 178, cy, { tone: "muted" });
    b += box(180, cy - 30, 140, 60, ["router", "returns one label"], { tone: "green", size: 13, weight: 600 });
    const paths: { label: string; note: string; tone: Tone; dash?: boolean }[] = [
      { label: "explain", note: "one article, one prompt", tone: "blue" },
      { label: "compare", note: "two articles side by side", tone: "blue" },
      { label: "build plan", note: "a route through concepts", tone: "blue" },
      { label: "off-topic", note: "short, polite refusal", tone: "grey" },
      { label: "default", note: "unknown label or low confidence", tone: "orange", dash: true },
    ];
    const x0 = 420;
    paths.forEach((p, i) => {
      const y = 20 + i * 56;
      b += arrow(320, cy, x0 - 2, y + 20, { tone: p.dash ? "orange" : "muted", dash: p.dash });
      b += box(x0, y, 130, 40, p.label, { tone: p.tone, size: 13, weight: 600, dash: p.dash });
      b += text(x0 + 144, y + 20, p.note, { baseline: "middle", size: 12.5, tone: p.dash ? "orange" : "muted" });
    });
    b += text(180, cy + 52, "a small, fast model,", { size: 12, tone: "muted" });
    b += text(180, cy + 68, "embeddings, or a", { size: 12, tone: "muted" });
    b += text(180, cy + 84, "trained classifier", { size: 12, tone: "muted" });
    return svg(
      {
        width: 800,
        height: 20 + 5 * 56,
        title: "Routing: classify first, then run the path built for that kind",
        credit: "Adapted from Anthropic, “Building effective agents” (2024). The default path is our addition.",
        desc: router.alt,
      },
      b,
    );
  },
};

// sources/ong-routellm.md, Table 6: cost saving of the best routers (random router's GPT-4 calls / router's),
// at CPT(50%), with the quality reached as a share of GPT-4's score. MMLU note from 5.1 / Table 2.
const ROWS = [
  { name: "MT Bench", saving: 3.66, quality: "95% of GPT-4's score" },
  { name: "GSM8K", saving: 1.49, quality: "87% of GPT-4's score" },
  { name: "MMLU", saving: 1.41, quality: "92%, only with ~1,500 MMLU labels added" },
];

const routellm: Figure = {
  slug: "routellm",
  alt: "Bar chart of cost savings from RouteLLM's best routers, counted as how many fewer GPT-4 calls they needed than a random split to reach the same quality. MT Bench 3.66 times cheaper at 95% of GPT-4's score. GSM8K 1.49 times at 87%. MMLU 1.41 times at 92%, but only after adding about 1,500 labeled MMLU examples: routers trained only on chat preference data did no better than random on MMLU.",
  render() {
    const p = { x: 110, y: 30, w: 340, h: 170 };
    const xs = scaleLinear().domain([0, 4]).range([p.x, p.x + p.w]);
    const band = p.h / ROWS.length;
    let b = "";
    for (const t of [0, 1, 2, 3, 4]) {
      b += line(xs(t), p.y - 6, xs(t), p.y + p.h, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + p.h + 18, `${t}x`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(p.x + p.w / 2, p.y + p.h + 40, "fewer GPT-4 calls than a random split, same quality", { anchor: "middle", size: 12, tone: "muted" });
    b += line(xs(1), p.y - 6, xs(1), p.y + p.h, { tone: "muted", dash: true, sw: 1 });
    b += text(xs(1) + 4, p.y - 12, "no saving", { size: 11.5, tone: "muted" });
    ROWS.forEach((r, i) => {
      const cy = p.y + i * band + band / 2;
      b += text(p.x - 12, cy, r.name, { anchor: "end", baseline: "middle", size: 13 });
      b += rect(xs(0), cy - 12, xs(r.saving) - xs(0), 24, { tone: "green", fill: "solid", stroke: false, r: 2 });
      b += text(xs(r.saving) + 8, cy - 7, `${r.saving.toFixed(2)}x`, { baseline: "middle", size: 12.5, weight: 700, tone: "green" });
      b += text(xs(r.saving) + 8, cy + 9, r.quality, { baseline: "middle", size: 12, tone: "muted" });
    });
    b += line(xs(0), p.y - 6, xs(0), p.y + p.h, { tone: "axis" });
    return svg(
      {
        width: 740,
        height: p.y + p.h + 50,
        title: "Routing easy questions to a cheap model saved 1.4x to 3.7x (2024)",
        credit: "Data: Ong et al., “RouteLLM” (2024), Table 6. Strong model GPT-4, weak model Mixtral-8x7B.",
        desc: routellm.alt,
      },
      b,
    );
  },
};

export default [router, routellm];
