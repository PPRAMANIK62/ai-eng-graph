import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Pipeline steps: sources/auer-docling.md (section 3). Vision model with document anchoring:
// sources/poznanski-olmocr.md. Hybrid: sources/datalab-marker.md (How it works).
const approaches: Figure = {
  slug: "approaches",
  alt: "Three ways to parse a PDF page. Pipeline (Docling): the PDF's text with positions and a page image go through a layout model, a table model and optional OCR, then reading order is worked out and the parts are assembled. Vision model (olmOCR): the page image, plus the PDF's own text and positions as an anchor, go into one fine-tuned vision model that writes the page out as text. Hybrid (Marker): the PDF's own text is used where it's usable; only garbled or scanned pages and uncertain tables go to a vision model.",
  render() {
    let b = "";
    const LX = 24, X0 = 140, ROW = 118;
    const lane = (i: number, title: string, sub: string, tone: Tone) => {
      const y = i * ROW;
      if (i > 0) b += line(LX, y - 14, 900, y - 14, { tone: "grid", sw: 1 });
      b += text(LX, y + 18, title, { size: 14.5, weight: 700, tone });
      b += text(LX, y + 38, sub, { size: 12.5, tone: "muted" });
      return y;
    };
    const chain = (y: number, steps: { l: string[]; w: number; tone: Tone; dash?: boolean }[]) => {
      let x = X0;
      steps.forEach((s, k) => {
        b += box(x, y, s.w, 56, s.l, { tone: s.tone, size: 12.5, dash: s.dash });
        if (k < steps.length - 1) b += arrow(x + s.w + 3, y + 28, x + s.w + 25, y + 28, { tone: "muted" });
        x += s.w + 28;
      });
    };

    let y = lane(0, "Pipeline", "Docling", "blue");
    chain(y, [
      { l: ["PDF text with", "positions + page image"], w: 160, tone: "grey" },
      { l: ["layout", "model"], w: 76, tone: "blue" },
      { l: ["table", "model"], w: 70, tone: "blue" },
      { l: ["OCR", "(optional)"], w: 84, tone: "blue", dash: true },
      { l: ["reading order,", "assemble"], w: 112, tone: "blue" },
      { l: ["Markdown", "or JSON"], w: 86, tone: "green" },
    ]);

    y = lane(1, "Vision model", "olmOCR", "orange");
    chain(y, [
      { l: ["page image + PDF", "text as an anchor"], w: 160, tone: "grey" },
      { l: ["one fine-tuned vision model", "writes the page out"], w: 426, tone: "orange" },
      { l: ["Markdown", "text"], w: 86, tone: "green" },
    ]);

    y = lane(2, "Hybrid", "Marker", "purple");
    b += box(X0, y, 170, 56, ["PDF text,", "in reading order"], { tone: "grey", size: 12.5 });
    b += arrow(X0 + 173, y + 28, X0 + 195, y + 28, { tone: "muted" });
    b += box(X0 + 198, y, 90, 56, ["layout", "detection"], { tone: "purple", size: 12.5 });
    b += arrow(X0 + 291, y + 28, X0 + 313, y + 28, { tone: "muted" });
    b += box(X0 + 316, y, 110, 56, ["text usable?", "table certain?"], { tone: "purple", size: 12.5 });
    b += arrow(X0 + 429, y + 18, X0 + 460, y + 6, { tone: "muted" });
    b += arrow(X0 + 429, y + 38, X0 + 460, y + 50, { tone: "muted" });
    b += text(X0 + 466, y + 6, "yes: keep the text, CPU rules", { size: 12.5, baseline: "middle" });
    b += text(X0 + 466, y + 50, "no: send to a vision model", { size: 12.5, baseline: "middle", tone: "orange" });

    return svg(
      {
        width: 920,
        height: 2 * ROW + 66,
        title: "Three ways to turn a PDF page into text",
        credit: "From the Docling report (2024), the olmOCR paper (2025) and Marker's README (2026).",
        desc: approaches.alt,
      },
      b,
    );
  },
};

// sources/opendatalab-omnidocbench.md (end-to-end table, v1.6_full, updated 2026-09-11) and
// sources/mistral-ocr-4.md (self-reported 93.07, not on the leaderboard).
const ROWS: { name: string; v: number; group: string; tone: Tone; self?: boolean }[] = [
  { name: "TeleOCR", v: 96.91, group: "specialized", tone: "orange" },
  { name: "PaddleOCR-VL", v: 94.18, group: "specialized", tone: "orange" },
  { name: "Mistral OCR 4 (self-reported)", v: 93.07, group: "specialized", tone: "orange", self: true },
  { name: "Gemini 3 Pro", v: 92.91, group: "general", tone: "blue" },
  { name: "GPT-5.2", v: 86.59, group: "general", tone: "blue" },
  { name: "MinerU pipeline", v: 86.47, group: "pipeline", tone: "green" },
  { name: "olmOCR", v: 85.74, group: "specialized", tone: "orange" },
  { name: "Mistral OCR (2025)", v: 85.66, group: "specialized", tone: "orange" },
  { name: "Marker (1.7.1)", v: 78.44, group: "pipeline", tone: "green" },
];

const leaderboard: Figure = {
  slug: "leaderboard",
  alt: "Bar chart of OmniDocBench overall scores as of 2026-09. Specialized vision models: TeleOCR 96.91, PaddleOCR-VL 94.18, olmOCR 85.74, Mistral OCR (the 2025 model) 85.66. General vision models: Gemini 3 Pro 92.91, GPT-5.2 86.59. Pipeline tools: MinerU pipeline 86.47, Marker 78.44. Mistral OCR 4's self-reported 93.07 is shown separately as a dashed outline, because it isn't on the leaderboard.",
  render() {
    const LW = 210, x0 = 24 + LW, W = 440;
    const xs = scaleLinear().domain([70, 100]).range([x0, x0 + W]);
    const BH = 22, GAP = 10, top = 34;
    let b = "";
    const H = top + ROWS.length * (BH + GAP);
    // legend
    const leg: [string, Tone][] = [["specialized vision model", "orange"], ["general vision model", "blue"], ["pipeline tool", "green"]];
    let lx = x0;
    for (const [l, t] of leg) {
      b += rect(lx, 2, 14, 12, { tone: t, fill: "solid", stroke: false, r: 2 });
      b += text(lx + 20, 8, l, { size: 12.5, baseline: "middle" });
      lx += 30 + l.length * 7;
    }
    for (const t of [70, 80, 90, 100]) {
      b += line(xs(t), top - 6, xs(t), H, { tone: "grid", sw: 1 });
      b += text(xs(t), H + 16, String(t), { anchor: "middle", size: 11.5, tone: "muted" });
    }
    ROWS.forEach((r, i) => {
      const y = top + i * (BH + GAP);
      b += text(x0 - 10, y + BH / 2, r.name, { anchor: "end", baseline: "middle", size: 12.5, tone: r.self ? "muted" : "ink" });
      b += rect(x0, y, xs(r.v) - x0, BH, r.self ? { tone: r.tone, fill: "none", dash: true, r: 2 } : { tone: r.tone, fill: "solid", stroke: false, r: 2 });
      b += text(xs(r.v) + 8, y + BH / 2, r.v.toFixed(2) + (r.self ? "  not on the leaderboard" : ""), {
        baseline: "middle",
        size: 12.5,
        weight: 600,
        tone: r.self ? "muted" : r.tone,
      });
    });
    b += line(x0, top - 6, x0, H, { tone: "axis" });
    b += text(x0 + W / 2, H + 36, "OmniDocBench overall score (axis starts at 70)", { anchor: "middle", size: 12, tone: "muted" });
    return svg(
      {
        width: x0 + W + 200,
        height: H + 46,
        title: "On OmniDocBench, small specialized models lead",
        credit: "Data: OmniDocBench leaderboard (v1.6_full table, updated 2026-09-11), a selection of rows. Mistral OCR 4: Mistral's post (2026).",
        desc: leaderboard.alt,
      },
      b,
    );
  },
};

export default [approaches, leaderboard];
