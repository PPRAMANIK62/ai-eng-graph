import { scaleLinear } from "../../lib/chart.ts";
import { rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// All numbers from sources/openai-using-logprobs.md (classification example,
// gpt-4o-mini). Tennis: Art −0.028133942 (97.23%), Sports −4.278134 (1.39%).
// Tech: Technology 0.0 (100.0%). The article rounds to 97.2% and 1.4%.
const GROUPS: { headline: string; note: string; rows: { label: string; pct: number; pctLabel: string; logprob: string; tone: Tone }[] }[] = [
  {
    headline: "“Tennis Champion Showcases Hidden Talents in Symphony Orchestra Debut”",
    note: "A borderline case: the model leans hard toward one answer, but not all the way.",
    rows: [
      { label: "Art", pct: 97.2, pctLabel: "97.2%", logprob: "−0.028", tone: "blue" },
      { label: "Sports", pct: 1.4, pctLabel: "1.4%", logprob: "−4.28", tone: "grey" },
    ],
  },
  {
    headline: "“Tech Giant Unveils Latest Smartphone Model with Advanced Photo-Editing Features.”",
    note: "A clear-cut case: no doubt at all.",
    rows: [{ label: "Technology", pct: 100, pctLabel: "100%", logprob: "0.0", tone: "green" }],
  },
];

const figure: Figure = {
  slug: "headlines",
  alt: "Two headlines classified by gpt-4o-mini. For the tennis headline, Art gets 97.2% (logprob −0.028) and Sports 1.4% (logprob −4.28). For a clear tech headline, Technology gets 100% (logprob 0.0). A logprob near 0 means the model was sure; a big negative number means it wasn't.",
  render() {
    const lx = 24, labelW = 110, barX = lx + labelW, barW = 420, pctX = barX + barW + 16, lpX = pctX + 100;
    const x = scaleLinear().domain([0, 100]).range([barX, barX + barW]);
    let body = "";
    body += text(barX, 12, "Probability", { size: 12.5, weight: 600, tone: "muted" });
    body += text(pctX, 12, "As a %", { size: 12.5, weight: 600, tone: "muted" });
    body += text(lpX, 12, "Logprob (what the API returns)", { size: 12.5, weight: 600, tone: "muted" });
    let y = 34;
    const rowH = 30, bh = 20;
    for (const g of GROUPS) {
      body += text(lx, y + 12, g.headline, { size: 13.5, weight: 600 });
      body += text(lx, y + 32, g.note, { size: 12.5, tone: "muted" });
      y += 48;
      for (const r of g.rows) {
        const cy = y + rowH / 2;
        body += text(barX - 10, cy, r.label, { size: 14, anchor: "end", baseline: "middle" });
        body += rect(barX, cy - bh / 2, barW, bh, { tone: "grey", fill: "soft", stroke: false, r: 2 });
        body += rect(barX, cy - bh / 2, Math.max(2, x(r.pct) - barX), bh, { tone: r.tone, fill: "solid", stroke: false, r: 2 });
        body += text(pctX, cy, r.pctLabel, { size: 14, weight: 600, baseline: "middle", tone: r.tone });
        body += text(lpX, cy, r.logprob, { size: 14, weight: 600, baseline: "middle", mono: true, tone: r.tone });
        y += rowH + 4;
      }
      y += 18;
    }
    return svg(
      {
        width: lpX + 230,
        height: y - 10,
        title: "Same answers, two scales: the percentage and the logprob",
        credit: "Data from OpenAI Cookbook, “Using logprobs” (gpt-4o-mini, top 2 alternatives). Percent = e^logprob.",
        desc: figure.alt,
      },
      body,
    );
  },
};

export default [figure];
