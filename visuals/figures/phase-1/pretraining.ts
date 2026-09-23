import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, rect, svg, text, type Figure } from "../../lib/svg.ts";

// Sentence and the 300 billion figure: nodes/phase-1/pretraining.md,
// sources/brown-gpt3-few-shot-learners.md (Table 2.1).
const TOKENS = ["The", "capital", "of", "France", "is", "Paris", "."];

const practice: Figure = {
  slug: "practice-questions",
  alt: "The sentence The capital of France is Paris, split into tokens, turns into five practice questions: The predicts capital, The capital predicts of, and so on up to The capital of France is predicts Paris. This repeats at every position in every document; GPT-3 was trained on 300 billion tokens.",
  render() {
    const x0 = 150, bw = 88, gap = 10, bh = 32;
    const col = (i: number) => x0 + i * (bw + gap);
    let body = "";

    // The sentence as tokens
    body += text(x0 - 16, 16 + bh / 2, "Text", { anchor: "end", baseline: "middle", size: 13, tone: "muted", weight: 600 });
    TOKENS.forEach((t, i) => (body += box(col(i), 16, bw, bh, t, { tone: "grey", size: 14, mono: true })));

    // Practice questions, one per row
    const top = 90, rowH = 44;
    body += text(x0 - 16, top - 20, "Practice questions", { anchor: "end", size: 12, tone: "muted" });
    body += text(col(0), top - 20, "what the model sees", { size: 12, tone: "blue" });
    for (let k = 1; k <= 5; k++) {
      const y = top + (k - 1) * rowH;
      body += text(x0 - 16, y + bh / 2, `Question ${k}`, { anchor: "end", baseline: "middle", size: 13, tone: "muted" });
      for (let i = 0; i < k; i++) body += box(col(i), y, bw, bh, TOKENS[i]!, { tone: "blue", size: 14, mono: true });
      body += box(col(k), y, bw, bh, TOKENS[k]!, { tone: "orange", fill: "soft", dash: true, size: 14, mono: true, weight: 700, textTone: "orange" });
    }
    const lastY = top + 4 * rowH + bh;
    body += text(col(6) + bw, top - 20, "hidden answer (the next token)", { anchor: "end", size: 12, tone: "orange" });

    // Counter
    const cy = lastY + 30;
    body += rect(x0, cy, col(6) + bw - x0, 58, { tone: "green", fill: "soft" });
    body += text(x0 + (col(6) + bw - x0) / 2, cy + 22, "× every position in every document", { anchor: "middle", size: 15, weight: 600 });
    body += text(x0 + (col(6) + bw - x0) / 2, cy + 43, "GPT-3 (2020) was trained on 300 billion tokens. No labels needed: the text is its own answer key.", {
      anchor: "middle",
      size: 13,
      tone: "green",
    });

    return svg(
      {
        width: col(6) + bw + 30,
        height: cy + 58 + 6,
        title: "One sentence becomes several practice questions",
        credit: "One box per word for simplicity; real tokenizers split text differently.",
        desc: practice.alt,
      },
      body,
    );
  },
};

// FineWeb pipeline: sources/penedo-fineweb.md (Abstract, §3.3, §3.4, §4).
type Stage = { step: string; sub: string; tokens?: number; label?: string; tone: "grey" | "blue" | "green" };
const STAGES: Stage[] = [
  { step: "Common Crawl", sub: "96 snapshots of raw web pages", tone: "grey" },
  { step: "Extract text", sub: "readable text pulled out of HTML", tone: "grey" },
  { step: "Base filtering", sub: "URL blocklist, English, quality rules", tokens: 36, label: "~36T tokens", tone: "blue" },
  { step: "Dedup each snapshot", sub: "repeated pages removed", tokens: 20, label: "~20T tokens", tone: "blue" },
  { step: "Extra quality filters", sub: "result: FineWeb", tokens: 15, label: "15T tokens", tone: "blue" },
  { step: "Educational classifier", sub: "result: FineWeb-Edu", tokens: 1.3, label: "1.3T tokens", tone: "green" },
];

const funnel: Figure = {
  slug: "fineweb-funnel",
  alt: "The FineWeb pipeline as a funnel. 96 Common Crawl snapshots go through text extraction and base filtering to about 36 trillion tokens, per-snapshot deduplication to about 20 trillion, extra filters to FineWeb at 15 trillion, and an educational classifier to FineWeb-Edu at 1.3 trillion.",
  render() {
    const lw = 250; // step label column (right edge)
    const maxW = 460;
    const cx = lw + 30 + maxW / 2; // funnel center
    const w = scaleLinear().domain([0, 36]).range([0, maxW]);
    const rowH = 56, bh = 38;
    let body = "";
    STAGES.forEach((s, i) => {
      const y = i * rowH;
      body += text(lw, y + 14, s.step, { anchor: "end", size: 14, weight: 600 });
      body += text(lw, y + 32, s.sub, { anchor: "end", size: 12, tone: s.tokens !== undefined && i >= 4 ? s.tone : "muted" });
      if (s.tokens === undefined) {
        body += rect(cx - maxW / 2, y, maxW, bh, { tone: "grey", fill: "soft", dash: true });
        body += text(cx, y + bh / 2, "size not given", { anchor: "middle", baseline: "middle", size: 12.5, tone: "muted", italic: true });
      } else {
        const bw = Math.max(8, w(s.tokens));
        body += rect(cx - bw / 2, y, bw, bh, { tone: s.tone, fill: "soft", r: 4 });
        body += text(cx + bw / 2 + 12, y + bh / 2, s.label!, { baseline: "middle", size: 13.5, weight: 700, tone: s.tone });
      }
      if (i < STAGES.length - 1) body += arrow(cx, y + bh + 1, cx, y + rowH - 1, { tone: "muted", sw: 1.2 });
    });
    const h = STAGES.length * rowH;
    body += text(cx, h + 8, "Bar width = number of tokens (GPT-2 tokenizer), to scale.", { anchor: "middle", size: 12, tone: "muted" });
    return svg(
      {
        width: cx + maxW / 2 + 130,
        height: h + 16,
        title: "From the raw web to a pretraining dataset: FineWeb (2024)",
        credit: "Adapted from the FineWeb paper, Penedo et al. (Hugging Face), 2024.",
        desc: funnel.alt,
      },
      body,
    );
  },
};

export default [practice, funnel];
