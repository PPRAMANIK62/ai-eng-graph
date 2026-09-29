import { barsH } from "../../lib/chart.ts";
import { rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// sources/epoch-open-closed-gap.md (4 months, 6 with a strict test, 8 ECI points, Jan–May 2026),
// sources/artificial-analysis-open-weights-launches.md (54 vs 60 in 2026-04; 22 vs 35 a year earlier),
// sources/menlo-2025-mid-year-llm-market.md (9 to 12 months, mid-2025, stated without a method).
const gap: Figure = {
  slug: "gap",
  alt: "Three measurements of the gap between the best open-weight and best closed models. Epoch AI, January to May 2026, capabilities index built from public benchmarks: about 4 months behind, or 6 months with a stricter test, 8 index points. Artificial Analysis, April 2026, its own Intelligence Index: 6 points behind (54 vs 60), down from 13 points a year earlier (22 vs 35). Menlo Ventures, mid-2025, in a report built on a survey of 150 tech leaders: 9 to 12 months, stated without a method.",
  render() {
    const cards: { who: string; when: string; big: string; lines: string[]; how: string[]; tone: Tone }[] = [
      {
        who: "Epoch AI",
        when: "Jan–May 2026",
        big: "4 months",
        lines: ["6 months with a stricter test", "8 points on its index"],
        how: ["index built from many", "public benchmarks"],
        tone: "blue",
      },
      {
        who: "Artificial Analysis",
        when: "April 2026",
        big: "6 points",
        lines: ["54 vs 60 on its index", "a year earlier: 22 vs 35"],
        how: ["its own Intelligence", "Index"],
        tone: "green",
      },
      {
        who: "Menlo Ventures",
        when: "mid-2025",
        big: "9–12 months",
        lines: ["in a report built on a", "survey of 150 tech leaders"],
        how: ["stated, no method", "given"],
        tone: "orange",
      },
    ];
    const w = 220;
    const h = 200;
    const gapX = 24;
    let b = "";
    cards.forEach((c, i) => {
      const x = 20 + i * (w + gapX);
      b += rect(x, 0, w, h, { tone: c.tone, fill: "soft" });
      b += text(x + 16, 26, c.who, { size: 14.5, weight: 700, tone: c.tone });
      b += text(x + 16, 46, c.when, { size: 12.5, tone: "muted" });
      b += text(x + 16, 90, c.big, { size: 28, weight: 700, display: true });
      b += text(x + 16, 116, c.lines[0], { size: 12.5 });
      b += text(x + 16, 134, c.lines[1], { size: 12.5 });
      b += text(x + 16, 166, c.how[0], { size: 12, tone: "muted", italic: true });
      b += text(x + 16, 183, c.how[1], { size: 12, tone: "muted", italic: true });
    });
    return svg(
      {
        width: 20 + 3 * w + 2 * gapX + 20,
        height: h + 8,
        title: "How far behind are open models? Three answers",
        credit: "Data: Epoch AI (2026), Artificial Analysis (2026), Menlo Ventures (2025).",
        desc: gap.alt,
      },
      b,
    );
  },
};

// sources/moonshot-k2-vendor-verifier.md, K2 0905 table (test time 2025-11-15):
// ToolCall-Schema Accuracy per provider, 4,000 requests each.
// Full table. Groq and Nebius sit in the table's below-80% trigger-similarity group.
const ROWS: [string, number][] = [
  ["Moonshot (official)", 100.0],
  ["Moonshot AI Turbo", 100.0],
  ["DeepInfra", 100.0],
  ["Fireworks", 100.0],
  ["Infinigence", 100.0],
  ["NovitaAI", 100.0],
  ["Groq", 100.0],
  ["SiliconFlow", 99.77],
  ["Chutes", 96.7],
  ["Nebius", 84.47],
  ["vLLM (engine)", 76.0],
  ["SGLang (engine)", 73.13],
  ["Volc", 72.86],
  ["Baseten", 72.49],
  ["AtlasCloud", 72.44],
  ["Together", 71.96],
];

const vendors: Figure = {
  slug: "vendors",
  alt: "Horizontal bar chart of tool-call schema accuracy for the same open model, Kimi K2 0905, served by different providers, on 4,000 requests (test date 2025-11-15). Moonshot's own API, Moonshot AI Turbo, DeepInfra, Fireworks, Infinigence, NovitaAI and Groq 100%, SiliconFlow 99.8%, Chutes 96.7%, Nebius 84.5%, vLLM 76.0%, SGLang 73.1%, Volc 72.9%, Baseten 72.5%, AtlasCloud 72.4%, Together 72.0%.",
  render() {
    const bars = ROWS.map(([label, v]) => ({
      label,
      value: v,
      valueLabel: `${v.toFixed(1)}%`,
      tone: (label.startsWith("Moonshot") ? "blue" : v >= 95 ? "green" : v >= 80 ? "orange" : "red") as Tone,
    }));
    const { svg: body } = barsH({ x: 0, y: 0, w: 640, h: 440 }, bars, { max: 100, labelWidth: 160, padding: 0.22 });
    return svg(
      {
        width: 660,
        height: 446,
        title: "Same open model, different hosts: tool calls matching the schema",
        credit: "Data: Moonshot AI, K2 Vendor Verifier, Kimi K2 0905, 4,000 requests per provider, 2025-11-15.",
        desc: vendors.alt,
      },
      body,
    );
  },
};

export default [gap, vendors];
