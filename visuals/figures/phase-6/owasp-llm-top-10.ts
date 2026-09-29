import { circle, line, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// sources/owasp-llm-top-10-2026-repo.md: the 2026 order (README) and the
// 2025 order (file names in 2025/). System Prompt Leakage was renamed
// Hidden Context Exposure (Preface).
const ROWS: { from: string; to: string; r25: number; r26: number }[] = [
  { from: "Prompt injection", to: "Prompt injection", r25: 1, r26: 1 },
  { from: "Sensitive information disclosure", to: "Sensitive information disclosure", r25: 2, r26: 2 },
  { from: "Supply chain", to: "Supply chain", r25: 3, r26: 4 },
  { from: "Data and model poisoning", to: "Data and model poisoning", r25: 4, r26: 5 },
  { from: "Improper output handling", to: "Improper output handling", r25: 5, r26: 10 },
  { from: "Excessive agency", to: "Excessive agency", r25: 6, r26: 3 },
  { from: "System prompt leakage", to: "Hidden context exposure", r25: 7, r26: 8 },
  { from: "Vector and embedding weaknesses", to: "Vector and embedding weaknesses", r25: 8, r26: 9 },
  { from: "Misinformation", to: "Misinformation", r25: 9, r26: 7 },
  { from: "Unbounded consumption", to: "Unbounded consumption", r25: 10, r26: 6 },
];

const bump: Figure = {
  slug: "rank-changes",
  alt: "Bump chart of the OWASP Top 10 for LLM apps, 2025 rank on the left, 2026 rank on the right. Prompt injection and sensitive information disclosure stay first and second. Excessive agency climbs from 6 to 3. Unbounded consumption climbs from 10 to 6. Misinformation rises from 9 to 7. System prompt leakage, 7th in 2025, becomes hidden context exposure at 8. Supply chain, data and model poisoning, and vector and embedding weaknesses each drop one place. Improper output handling falls from 5 to 10.",
  render() {
    const xL = 290, xR = 560, top = 40, step = 34;
    const y = (r: number) => top + (r - 1) * step;
    let b = "";
    b += text(xL, 12, "2025", { anchor: "middle", size: 14, weight: 700 });
    b += text(xR, 12, "2026", { anchor: "middle", size: 14, weight: 700 });
    for (const r of ROWS) {
      const d = r.r25 - r.r26;
      const tone: Tone = r.from !== r.to ? "purple" : d > 0 ? "green" : d < -1 ? "red" : "grey";
      const bold = tone !== "grey";
      b += line(xL, y(r.r25), xR, y(r.r26), { tone, sw: bold ? 3 : 1.5 });
      b += circle(xL, y(r.r25), 5, { tone });
      b += circle(xR, y(r.r26), 5, { tone });
      b += text(xL - 14, y(r.r25), `${r.r25}  ${r.from}`, { anchor: "end", baseline: "middle", size: 13, weight: bold ? 600 : 400, tone: bold ? tone : "ink" });
      b += text(xR + 14, y(r.r26), `${r.r26}  ${r.to}`, { baseline: "middle", size: 13, weight: bold ? 600 : 400, tone: bold ? tone : "ink" });
    }
    const yl = y(10) + 34;
    b += circle(30, yl, 5, { tone: "green" });
    b += text(42, yl, "moved up", { baseline: "middle", size: 12.5 });
    b += circle(130, yl, 5, { tone: "red" });
    b += text(142, yl, "fell furthest", { baseline: "middle", size: 12.5 });
    b += circle(250, yl, 5, { tone: "purple" });
    b += text(262, yl, "renamed and re-scoped", { baseline: "middle", size: 12.5 });
    b += circle(430, yl, 5, { tone: "grey" });
    b += text(442, yl, "same, or down one", { baseline: "middle", size: 12.5 });
    return svg(
      {
        width: 860,
        height: yl + 14,
        title: "How the OWASP LLM Top 10 moved from 2025 to 2026",
        credit: "Data: OWASP Top 10 for LLM Applications, 2025 and 2026 editions (GitHub repository). The 2026 preface draws the same kind of chart.",
        desc: bump.alt,
      },
      b,
    );
  },
};

export default [bump];
