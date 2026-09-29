import { scaleLinear } from "../../lib/chart.ts";
import { box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Prefix order tools → system → messages, breakpoints, and which changes invalidate
// what: sources/anthropic-prompt-caching.md ("What invalidates the cache"),
// sources/shihipar-claude-code-prompt-caching.md (append, don't edit),
// sources/ji-manus-context-engineering.md (timestamps). Read price 0.1x: both provider docs.
const SEGS = [
  { label: "tools", w: 110 },
  { label: "system prompt", w: 150 },
  { label: "documents", w: 140 },
  { label: "earlier turns", w: 170 },
  { label: "new message", w: 130 },
];

const prefix: Figure = {
  slug: "prefix",
  alt: "A request laid out as a prefix, left to right: tool definitions, system prompt, reference documents, earlier conversation turns, then the new user message. A cache breakpoint sits after the earlier turns. Everything before it is read from the cache at about 0.1 times the input price; the new message is processed at full price. Below, three changes and what they break: editing a tool definition invalidates everything; putting a timestamp in the system prompt invalidates the system prompt and all messages; appending a new turn at the end keeps the whole prefix cached.",
  render() {
    const X = 250;
    const gap = 6;
    const xs: number[] = [];
    let x = X;
    for (const s of SEGS) {
      xs.push(x);
      x += s.w + gap;
    }
    const end = x - gap;
    const bp = xs[4] - gap / 2;
    let b = "";

    // Top: the layout
    b += text(20, 58, "One request", { size: 13.5, weight: 600, baseline: "middle" });
    b += rect(X, 6, bp - X - 4, 22, { tone: "green", fill: "soft", stroke: false, r: 4 });
    b += text((X + bp) / 2, 17, "read from the cache, about 0.1× the input price", { anchor: "middle", baseline: "middle", size: 12.5, tone: "green", weight: 600 });
    b += rect(xs[4], 6, SEGS[4].w, 22, { tone: "orange", fill: "soft", stroke: false, r: 4 });
    b += text(xs[4] + SEGS[4].w / 2, 17, "full price", { anchor: "middle", baseline: "middle", size: 12.5, tone: "orange", weight: 600 });
    SEGS.forEach((s, i) => {
      b += box(xs[i], 40, s.w, 36, s.label, { tone: i === 4 ? "orange" : "blue", size: 13 });
    });
    b += line(bp, 34, bp, 84, { tone: "purple", sw: 2, dash: true });
    b += text(bp - 8, 98, "cache breakpoint", { anchor: "end", size: 12, tone: "purple", weight: 600 });
    b += text(X, 98, "stable, shared by many requests", { size: 12, tone: "muted" });
    b += text(end, 98, "changes every call", { anchor: "end", size: 12, tone: "muted" });

    // Bottom: three changes
    const rows: { label: string; changed: number; append?: boolean }[] = [
      { label: "Edit a tool definition", changed: 0 },
      { label: "Timestamp in the system prompt", changed: 1 },
      { label: "Append a new turn at the end", changed: 5, append: true },
    ];
    let y = 136;
    b += line(20, y - 16, end, y - 16, { tone: "grid", sw: 1 });
    b += text(20, y, "What a change breaks", { size: 13.5, weight: 600 });
    y += 18;
    for (const r of rows) {
      b += text(X - 14, y + 14, r.label, { anchor: "end", baseline: "middle", size: 12.5 });
      SEGS.slice(0, 4).forEach((s, i) => {
        const hit = i < r.changed;
        const tone: Tone = hit ? "green" : "red";
        b += rect(xs[i], y, s.w, 28, { tone, fill: i === r.changed ? "solid" : "soft", stroke: false, r: 4 });
        const label = i === r.changed ? "changed" : hit ? "cached" : "recomputed";
        b += text(xs[i] + s.w / 2, y + 14, label, {
          anchor: "middle",
          baseline: "middle",
          size: 12,
          weight: 600,
          tone: i === r.changed ? "ink" : tone,
        });
      });
      b += rect(xs[4], y, SEGS[4].w, 28, { tone: "grey", fill: "soft", stroke: false, r: 4 });
      b += text(xs[4] + SEGS[4].w / 2, y + 14, r.append ? "+ new turn" : "new", { anchor: "middle", baseline: "middle", size: 12, tone: "muted" });
      y += 40;
    }
    b += text(X, y + 6, "The cache matches from the first token. Everything after the first change is a miss.", { size: 12.5, tone: "muted" });

    return svg(
      {
        width: end + 24,
        height: y + 16,
        title: "Prompt caching reuses an exact prefix",
        credit: "Order and invalidation rules from Anthropic's prompt caching docs (2026); the same idea applies on OpenAI.",
        desc: prefix.alt,
      },
      b,
    );
  },
};

// sources/anthropic-prompt-caching-launch.md, table: time to first token without / with
// caching, and cost reduction, for three workloads (2024).
const ROWS = [
  { name: "Chat with a book", sub: "100,000-token cached prompt", without: 11.5, with: 2.4, time: "−79%", cost: "−90%" },
  { name: "Multi-turn conversation", sub: "10 turns, long system prompt", without: 10, with: 2.5, time: "−75%", cost: "−53%", approx: true },
  { name: "Many-shot prompting", sub: "10,000-token prompt", without: 1.6, with: 1.1, time: "−31%", cost: "−86%" },
];

const latency: Figure = {
  slug: "latency",
  alt: "Paired bars of time to first token without and with prompt caching, from Anthropic's 2024 launch. Chat with a book (100,000-token cached prompt): 11.5 s without, 2.4 s with, 79% faster, 90% cheaper. Multi-turn conversation (10 turns, long system prompt): about 10 s without, about 2.5 s with, 75% faster, 53% cheaper. Many-shot prompting (10,000-token prompt): 1.6 s without, 1.1 s with, 31% faster, 86% cheaper.",
  render() {
    const p = { x: 220, y: 34, w: 470 };
    const xs = scaleLinear().domain([0, 12]).range([p.x, p.x + p.w]);
    const band = 82;
    let b = "";
    // legend
    b += rect(p.x, 0, 14, 12, { tone: "grey", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 20, 6, "without caching", { size: 12.5, baseline: "middle" });
    b += rect(p.x + 150, 0, 14, 12, { tone: "blue", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 170, 6, "with caching", { size: 12.5, baseline: "middle" });
    const h = ROWS.length * band;
    for (const t of [0, 2, 4, 6, 8, 10, 12]) {
      b += line(xs(t), p.y - 6, xs(t), p.y + h - 10, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + h + 6, `${t} s`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(p.x + p.w / 2, p.y + h + 28, "time to first token", { anchor: "middle", size: 12, tone: "muted" });
    ROWS.forEach((r, i) => {
      const y = p.y + i * band + 6;
      b += text(p.x - 14, y + 14, r.name, { anchor: "end", baseline: "middle", size: 13, weight: 600 });
      b += text(p.x - 14, y + 33, r.sub, { anchor: "end", baseline: "middle", size: 12, tone: "muted" });
      const pre = r.approx ? "~" : "";
      b += rect(xs(0), y, xs(r.without) - xs(0), 20, { tone: "grey", fill: "solid", stroke: false, r: 2 });
      b += text(xs(r.without) + 8, y + 10, `${pre}${r.without} s`, { baseline: "middle", size: 12.5, tone: "muted", weight: 600 });
      b += rect(xs(0), y + 24, xs(r.with) - xs(0), 20, { tone: "blue", fill: "solid", stroke: false, r: 2 });
      b += text(xs(r.with) + 8, y + 34, `${pre}${r.with} s   ${r.time} time, ${r.cost} cost`, { baseline: "middle", size: 12.5, tone: "blue", weight: 600 });
    });
    b += line(xs(0), p.y - 6, xs(0), p.y + h - 10, { tone: "axis" });
    return svg(
      {
        width: p.x + p.w + 110,
        height: p.y + h + 40,
        title: "Caching cut the wait for the first token most on the longest prompt",
        credit: "Data: Anthropic, “Prompt caching with Claude” (2024 launch), Claude 3-era models.",
        desc: latency.alt,
      },
      b,
    );
  },
};

export default [prefix, latency];
