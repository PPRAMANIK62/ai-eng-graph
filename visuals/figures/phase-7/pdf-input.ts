import { scaleLinear } from "../../lib/chart.ts";
import { line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Claude rows: sources/anthropic-pdf-support.md (Amazon Bedrock Converse, 3-page PDF,
// ~1,000 tokens text only vs ~7,000 text plus images). Gemini rows: 3 pages x the
// Gemini 3 PDF column in sources/google-gemini-media-resolution.md (280 / 560 / 1120),
// native text not charged per sources/google-gemini-document-processing.md.
const ROWS: { label: string; v: number; tone: Tone; value: string; note: string }[] = [
  { label: "Claude on Bedrock, text only", v: 1000, tone: "grey", value: "~1,000", note: "can't see charts or layout" },
  { label: "Claude on Bedrock, text + images", v: 7000, tone: "orange", value: "~7,000", note: "sees charts and layout" },
  { label: "Gemini 3, low", v: 840, tone: "blue", value: "840", note: "3 × 280" },
  { label: "Gemini 3, default", v: 1680, tone: "blue", value: "1,680", note: "3 × 560" },
  { label: "Gemini 3, high", v: 3360, tone: "blue", value: "3,360", note: "3 × 1,120" },
];

const costs: Figure = {
  slug: "costs",
  alt: "Bar chart of input tokens for a 3-page PDF. Claude on Amazon Bedrock, text only: about 1,000 tokens, and the model can't see charts. Claude, text plus page images: about 7,000. Gemini 3, page images at low resolution: 840; default: 1,680; high: 3,360. On Gemini 3 the PDF's own text is read but not charged.",
  render() {
    const LW = 230, x0 = 24 + LW, W = 400;
    const xs = scaleLinear().domain([0, 7000]).range([x0, x0 + W]);
    const BH = 26, GAP = 12;
    let b = "";
    const H = ROWS.length * (BH + GAP) + 14;
    for (const t of [0, 2000, 4000, 6000]) {
      b += line(xs(t), 0, xs(t), H, { tone: "grid", sw: 1 });
      b += text(xs(t), H + 16, t.toLocaleString("en-US"), { anchor: "middle", size: 11.5, tone: "muted" });
    }
    ROWS.forEach((r, i) => {
      const y = 6 + i * (BH + GAP) + (i >= 2 ? 10 : 0);
      b += text(x0 - 10, y + BH / 2, r.label, { anchor: "end", baseline: "middle", size: 12.5 });
      b += rect(x0, y, xs(r.v) - x0, BH, { tone: r.tone, fill: "solid", stroke: false, r: 2 });
      b += text(xs(r.v) + 8, y + BH / 2 - 7, r.value, { baseline: "middle", size: 12.5, weight: 600, tone: r.tone });
      b += text(xs(r.v) + 8, y + BH / 2 + 8, r.note, { baseline: "middle", size: 11.5, tone: "muted" });
    });
    b += line(x0, 0, x0, H, { tone: "axis" });
    b += text(x0 + W / 2, H + 36, "input tokens for a 3-page PDF", { anchor: "middle", size: 12, tone: "muted" });
    b += text(24, H + 60, "On Gemini 3 the PDF's own text is read too, but not charged. Token prices differ per model.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: x0 + W + 190,
        height: H + 70,
        title: "Page images are what make a PDF expensive",
        credit: "As of 2026-09. Claude: Anthropic PDF docs (Amazon Bedrock modes). Gemini: media resolution docs, 3 pages × per-page tokens.",
        desc: costs.alt,
      },
      b,
    );
  },
};

export default [costs];
