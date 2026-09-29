import { arrow, box, line, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Chain and order: sources/vercel-model-fallbacks.md ("Combining with provider routing"
// example and "How failover works"). Triggers: sources/openrouter-model-fallbacks.md.
const MODELS: { name: string; providers: string[]; tone: Tone }[] = [
  { name: "gpt-6-astra", providers: ["via Azure", "via OpenAI"], tone: "blue" },
  { name: "gpt-5.4-nano", providers: ["via Azure", "via OpenAI"], tone: "purple" },
  { name: "claude-opus-5", providers: ["any available provider"], tone: "orange" },
];

const chain: Figure = {
  slug: "chain",
  alt: "A fallback chain in an AI gateway. The request goes to the primary model, gpt-6-astra, first through Azure, then through OpenAI. If both fail, it goes to a second model, gpt-5.4-nano, through Azure then OpenAI. If those fail too, it goes to claude-opus-5 through any available provider. The first success answers the request, and the response metadata lists every attempt. Below, what can trigger a fallback: downtime, rate limits, context-length errors, and moderation refusals.",
  render() {
    let b = "";
    const colW = 250;
    const gap = 50;
    MODELS.forEach((m, i) => {
      const x = 20 + i * (colW + gap);
      b += text(x, 6, i === 0 ? "1. primary model" : i === 1 ? "2. first backup model" : "3. second backup model", { size: 12.5, tone: "muted", weight: 600 });
      b += box(x, 20, colW, 40, m.name, { tone: m.tone, size: 13.5, weight: 700, mono: true });
      m.providers.forEach((p, j) => {
        const y = 76 + j * 50;
        b += box(x + 20, y, colW - 40, 36, `${m.providers.length > 1 ? `${j + 1}) ` : ""}${p}`, { tone: m.tone, fill: "none", size: 12.5 });
        if (j > 0) b += arrow(x + colW / 2, y - 14, x + colW / 2, y - 2, { tone: "muted" });
      });
      if (i < MODELS.length - 1) {
        b += arrow(x + colW + 4, 40, x + colW + gap - 4, 40, { tone: "red" });
        b += text(x + colW + gap / 2, 74, "all", { anchor: "middle", size: 12, tone: "red", weight: 600 });
        b += text(x + colW + gap / 2, 90, "failed", { anchor: "middle", size: 12, tone: "red", weight: 600 });
      }
    });
    b += text(20, 200, "The first model and provider that succeeds answers. Every attempt, with its error, is listed in the response metadata.", { size: 12.5 });

    const y = 236;
    b += line(20, y - 14, 880, y - 14, { tone: "grid", sw: 1 });
    b += text(20, y + 6, "What can trigger a fallback (OpenRouter's defaults)", { size: 13.5, weight: 600 });
    const triggers = ["downtime", "rate limits", "context-length errors", "moderation refusals"];
    let x = 20;
    for (const t of triggers) {
      const w = t.length * 7.6 + 30;
      b += box(x, y + 22, w, 32, t, { tone: "grey", size: 12.5 });
      x += w + 14;
    }
    return svg(
      {
        width: 900,
        height: y + 64 + 10,
        title: "Fallback tries other providers first, then other models",
        credit: "Chain adapted from Vercel's AI Gateway model fallbacks docs (2026-09-10); triggers from OpenRouter's docs.",
        desc: chain.alt,
      },
      `<g transform="translate(0 10)">${b}</g>`,
    );
  },
};

export default [chain];
