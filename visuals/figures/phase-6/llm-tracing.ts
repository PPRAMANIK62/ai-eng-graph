import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Structure: sources/langfuse-data-model.md (trace = one request, nested steps)
// and sources/otel-genai-spans.md (field names on a model-call span, execute_tool
// spans). The example request and its timings are our own and illustrative.
// Token numbers match the worked cost example in the article.
const traceTree: Figure = {
  slug: "trace-tree",
  alt: "A trace for one question to a docs assistant, drawn as a waterfall. The request span runs the whole time. Under it, in order: a retrieval span, a first model call that asks for a tool, a tool span for get_account_settings, and a second model call that streams the answer. The second model call's fields are shown: the model, 6,000 input tokens of which 5,000 were read from the cache, 400 output tokens, and the prompt version. Timings are illustrative.",
  render() {
    const labelW = 250;
    const x0 = 20 + labelW;
    const tw = 600;
    const rows: { name: string; indent: number; a: number; b: number; tone: Tone }[] = [
      { name: "request: “How do I rotate my API key?”", indent: 0, a: 0, b: 100, tone: "grey" },
      { name: "retrieval (search the docs)", indent: 1, a: 2, b: 12, tone: "green" },
      { name: "model call 1: asks for a tool", indent: 1, a: 13, b: 44, tone: "blue" },
      { name: "execute_tool get_account_settings", indent: 1, a: 45, b: 55, tone: "orange" },
      { name: "model call 2: streams the answer", indent: 1, a: 56, b: 98, tone: "blue" },
    ];
    const rh = 34;
    let b = "";
    b += text(20, 8, "span", { size: 12, tone: "muted", weight: 600 });
    b += text(x0, 8, "time, left to right (illustrative, not data)", { size: 12, tone: "muted" });
    rows.forEach((r, i) => {
      const y = 24 + i * rh;
      b += text(20 + r.indent * 16, y + 13, r.name, { size: 12.5, baseline: "middle" });
      b += line(x0, y + 13, x0 + tw, y + 13, { tone: "grid", sw: 1 });
      b += rect(x0 + (r.a / 100) * tw, y + 3, ((r.b - r.a) / 100) * tw, 20, { tone: r.tone, fill: r.indent ? "solid" : "soft", stroke: !r.indent, r: 3 });
    });
    // detail panel for model call 2
    const py = 24 + rows.length * rh + 18;
    const callY = 24 + 4 * rh + 23;
    const px = x0 + 0.56 * tw;
    b += line(px + 20, callY, px + 20, py, { tone: "blue", sw: 1.2, dash: true });
    const fields = [
      "gen_ai.request.model: claude-sonnet-5",
      "gen_ai.usage.input_tokens: 6000   (includes cached)",
      "gen_ai.usage.cache_read.input_tokens: 5000",
      "gen_ai.usage.output_tokens: 400",
      "gen_ai.prompt.version: 7",
      "feature: docs-assistant   (your own tag)",
    ];
    const pw = 520;
    const pxl = x0 + tw - pw;
    b += rect(pxl, py, pw, 30 + fields.length * 21, { tone: "blue", fill: "soft", r: 6 });
    b += text(pxl + 14, py + 18, "fields on the model call 2 span", { size: 12.5, weight: 700, tone: "blue" });
    fields.forEach((f, i) => (b += text(pxl + 14, py + 40 + i * 21, f, { size: 12.5, mono: true })));
    b += text(20, py + 20, "One trace = one request.", { size: 12.5, weight: 600 });
    b += text(20, py + 40, "Each step is a span with a", { size: 12.5 });
    b += text(20, py + 58, "start, an end and a parent.", { size: 12.5 });
    return svg(
      {
        width: x0 + tw + 20,
        height: py + 30 + fields.length * 21 + 10,
        title: "One question, one trace: every step is a span",
        credit: "Field names from the OpenTelemetry GenAI semantic conventions (status: Development). Example request is our own.",
        desc: traceTree.alt,
      },
      b,
    );
  },
};

// Prices: sources/anthropic-pricing.md (Sonnet 5: $2 / $10 per MTok, cache reads 0.1x input).
// Cost = tokens x price per bucket: sources/langfuse-cost-tracking.md. Token counts are our example.
const BUCKETS = [
  { name: "uncached input", tokens: 1000, price: 2, tone: "blue" as Tone },
  { name: "cached input", tokens: 5000, price: 0.2, tone: "green" as Tone },
  { name: "output", tokens: 400, price: 10, tone: "orange" as Tone },
];
const cost: Figure = {
  slug: "cost",
  alt: "How one model call's cost is built. Three bars: 1,000 uncached input tokens at $2 per million cost $0.0020, 5,000 cached input tokens at $0.20 per million cost $0.0010, and 400 output tokens at $10 per million cost $0.0040, for a total of $0.0070. Output is 6% of the tokens and 57% of the cost. Below, the roll-up: call costs add up to a request, requests group by a feature tag, and features sum to a daily total.",
  render() {
    let b = "";
    const lx = 20;
    const bx = 330;
    const bw = 380;
    const maxTok = 5000;
    const maxCost = 0.004;
    b += text(bx, 6, "tokens", { size: 12.5, tone: "muted", weight: 600 });
    b += text(bx + bw / 2 + 30, 6, "cost", { size: 12.5, tone: "muted", weight: 600 });
    BUCKETS.forEach((k, i) => {
      const y = 22 + i * 44;
      const c = (k.tokens * k.price) / 1e6;
      b += text(lx, y + 10, k.name, { size: 13, weight: 600, baseline: "middle" });
      b += text(lx, y + 28, `${k.tokens.toLocaleString("en-US")} × $${k.price.toFixed(2)} per million`, { size: 12, tone: "muted", baseline: "middle" });
      b += rect(bx, y + 2, (k.tokens / maxTok) * 170, 16, { tone: k.tone, fill: "soft", r: 2 });
      b += rect(bx + 200, y + 2, (c / maxCost) * 170, 16, { tone: k.tone, fill: "solid", stroke: false, r: 2 });
      b += text(bx + 200 + (c / maxCost) * 170 + 8, y + 10, `$${c.toFixed(4)}`, { size: 12.5, weight: 600, tone: k.tone, baseline: "middle" });
    });
    const ty = 22 + 3 * 44 + 6;
    b += line(lx, ty, bx + 460, ty, { tone: "grid", sw: 1 });
    b += text(lx, ty + 20, "call total", { size: 13, weight: 700, baseline: "middle" });
    b += text(bx + 200, ty + 20, "$0.0070", { size: 13, weight: 700, baseline: "middle" });
    b += text(lx, ty + 44, "Output is 6% of the tokens and 57% of the cost.", { size: 12.5, tone: "muted" });
    // roll-up
    const ry = ty + 74;
    const steps = [
      { l: ["model calls", "tokens × price"], t: "blue" as Tone },
      { l: ["one request", "sum its calls"], t: "grey" as Tone },
      { l: ["per feature", "group by tag"], t: "green" as Tone },
      { l: ["per day", "sum requests"], t: "orange" as Tone },
    ];
    let x = lx;
    steps.forEach((s, i) => {
      b += box(x, ry, 150, 46, s.l, { tone: s.t, size: 12.5 });
      if (i < steps.length - 1) b += arrow(x + 154, ry + 23, x + 186, ry + 23, { tone: "muted" });
      x += 190;
    });
    return svg(
      {
        width: 800,
        height: ry + 56,
        title: "The cost of one model call, and how it rolls up",
        credit: "Prices: Claude Sonnet 5, Anthropic pricing page, as of 2026-09. Token counts are our example.",
        desc: cost.alt,
      },
      b,
    );
  },
};

export default [traceTree, cost];
