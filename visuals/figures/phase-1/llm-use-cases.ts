import { scaleLinear } from "../../lib/chart.ts";
import { circle, line, lines, rect, svg, text, wrap, type Figure, type Tone } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// Figure 1: timeline. Every row is the "How usage has shifted" table in
// nodes/phase-1/llm-use-cases.md, checked against sources/willison-2025-year-in-llms.md,
// sources/yan-year-of-building-llms.md (published 2024-06-08),
// sources/chatterji-how-people-use-chatgpt.md and
// sources/anthropic-economic-index-cadences.md. The era band underneath is our
// own reading of those sources, and says so.

// Months since 2022-01 (2022-01 = 0).
const m = (y: number, mo: number) => (y - 2022) * 12 + (mo - 1);

type Ev = { at: number; date: string; text: string; level: number; wrapW: number };
const EVENTS: Ev[] = [
  { at: m(2022, 11), date: "2022-11", text: "ChatGPT's consumer product launches", level: 1, wrapW: 200 },
  { at: m(2024, 6), date: "2024-06", text: "Practitioners: LLM apps are brittle; keep a human in charge, prefer fixed workflows over agents", level: 3, wrapW: 290 },
  { at: m(2024, 9), date: "2024-09", text: "OpenAI's o1 starts the reasoning-model wave", level: 2, wrapW: 170 },
  { at: m(2025, 2), date: "2025-02", text: "Claude Code released; coding agents take off", level: 1, wrapW: 150 },
  { at: m(2025, 12), date: "2025-12", text: "Claude Code credited with $1bn run-rate revenue", level: 3, wrapW: 170 },
  { at: m(2026, 6), date: "2026-06", text: "Claude sessions are more and more long-running agentic tasks", level: 2, wrapW: 150 },
];
const SPANS = [
  { from: m(2024, 1), to: m(2024, 12), label: "2024: cost of a given capability halves about every 6 months" },
  { from: m(2025, 1), to: m(2025, 12), label: "2025: agents work for coding and search; multi-hour tasks" },
];
const ERAS: { from: number; to: number; label: string[]; tone: Tone }[] = [
  { from: m(2022, 11), to: m(2024, 6), label: ["Mostly chat: a person asks, the model answers"], tone: "grey" },
  { from: m(2024, 6), to: m(2025, 2), label: ["Fixed workflows,", "human in charge"], tone: "blue" },
  { from: m(2025, 2), to: m(2026, 7), label: ["Agents, where each step", "can be checked (code, search)"], tone: "green" },
];

const timeline: Figure = {
  slug: "timeline",
  alt: "A timeline from 2022-11 to 2026-06. 2022-11: ChatGPT launches. 2024-06: practitioners call LLM apps brittle and advise fixed workflows with a human in charge. 2024-09: o1 starts the reasoning-model wave. 2025-02: Claude Code is released and coding agents take off. 2025-12: Claude Code is credited with $1bn run-rate revenue. 2026-06: Claude sessions are more and more long-running agentic tasks. Underneath, a band moves from chat, to fixed workflows with a human in charge, to agents.",
  render() {
    const x0 = 40, x1 = 830;
    const x = scaleLinear().domain([m(2022, 10), m(2026, 7)]).range([x0, x1]);
    const levelH = 74, axisY = 3 * levelH + 14;
    let body = "";
    // year ticks
    for (const yr of [2023, 2024, 2025, 2026]) {
      const tx = x(m(yr, 1));
      body += line(tx, axisY - 5, tx, axisY + 5, { tone: "axis" });
      body += text(tx, axisY + 20, String(yr), { size: 12, tone: "muted", anchor: "middle" });
    }
    body += line(x0, axisY, x1, axisY, { tone: "axis", sw: 2 });
    // events
    for (const e of EVENTS) {
      const ex = x(e.at);
      const ly = axisY - e.level * levelH;
      body += line(ex, ly, ex, axisY, { tone: "grey", sw: 1 });
      body += circle(ex, axisY, 5, { tone: "ink" });
      body += text(ex + 7, ly + 4, e.date, { size: 12.5, weight: 700 });
      body += lines(ex + 7, ly + 21, wrap(e.text, e.wrapW, 12.5), { size: 12.5, gap: 16 });
    }
    // year-long rows
    const sy = axisY + 34;
    for (const s of SPANS) {
      const a = x(s.from), b = x(s.to + 1);
      body += rect(a, sy, b - a - 2, 44, { tone: "purple", fill: "soft", r: 4, sw: 1 });
      body += lines(a + 8, sy + 17, wrap(s.label, b - a - 18, 12), { size: 12, gap: 15, tone: "purple" });
    }
    // era band
    const by = sy + 62;
    body += text(x0, by - 4, "Rough eras (our summary of the sources)", { size: 12, tone: "muted", italic: true });
    for (const e of ERAS) {
      const a = x(e.from), b = x(e.to);
      body += rect(a, by + 4, b - a - 2, 48, { tone: e.tone, fill: "soft", r: 4, sw: 1 });
      const ls = e.label;
      body += lines(a + 10, by + 4 + 24 - ((ls.length - 1) * 16) / 2 + 4, ls, { size: 12.5, gap: 16, weight: 600, tone: e.tone === "grey" ? "ink" : e.tone });
    }
    return svg(
      {
        width: 1000,
        height: by + 60,
        title: "What LLMs are “for” has a date on it",
        credit: "Built from Willison (2025), Yan et al. (2024), Chatterji et al. (2025) and Anthropic (2026).",
        desc: timeline.alt,
      },
      body,
    );
  },
};

// ---------------------------------------------------------------------------
// Figure 2: reach-for-it / think-twice card. Items and numbers all from
// nodes/phase-1/llm-use-cases.md; "see" names the node that explains the row.
type Row = { head: string; why: string; see?: string };
const GOOD: Row[] = [
  { head: "Messy text to structure", why: "One call replaces the regexes and hand-written rules", see: "Structured output" },
  { head: "Classifying with a clear label set", why: "The answer is one label from a list you give it" },
  { head: "Answering from text you give it", why: "Give it the document; don't rely on what it remembers", see: "Grounding" },
  { head: "Drafting and rewriting", why: "Drafts, summaries, translations, changes in tone" },
  { head: "Agents with a built-in check", why: "Coding and search: it runs the code or reads the results" },
];
const BAD: Row[] = [
  { head: "Must be identical every run", why: "1,000 runs at temperature 0 gave 80 different completions", see: "Temperature" },
  { head: "Must be right with no source given", why: "Factual errors in 5 to 10% of outputs, a 2024 baseline", see: "Hallucination" },
  { head: "Long chains with no check between steps", why: "95% per step, 20 steps in a row: about 36% finish" },
  { head: "High-volume, narrow, with labelled data", why: "A fine-tuned 400M model hit ROC-AUC 0.84 at under 5% of the cost", see: "Fine-tuning" },
];

const card: Figure = {
  slug: "reach-or-think-twice",
  alt: "A two-column summary card. Reach for an LLM for: messy text to structure, classifying with a clear label set, answering from text you give it, drafting and rewriting, and agents with a built-in check such as code or search. Think twice when: the output must be identical every run, it must be factually right with no source given, it's a long chain with no check between steps, or it's a high-volume narrow classification task with labelled data.",
  render() {
    const cw = 460, gap = 24, rowH = 62, head = 46;
    const cols: { title: string; tone: Tone; rows: Row[] }[] = [
      { title: "Reach for it", tone: "green", rows: GOOD },
      { title: "Think twice", tone: "red", rows: BAD },
    ];
    let body = "";
    const h = head + GOOD.length * rowH + 10;
    cols.forEach((c, i) => {
      const cx = 24 + i * (cw + gap);
      body += rect(cx, 0, cw, h, { tone: c.tone, fill: "none", sw: 1.5, r: 8 });
      body += rect(cx, 0, cw, head - 8, { tone: c.tone, fill: "soft", stroke: false, r: 8 });
      body += text(cx + 18, (head - 8) / 2, c.title, { size: 16, weight: 700, tone: c.tone, baseline: "middle" });
      c.rows.forEach((r, j) => {
        const ry = head + j * rowH;
        if (j > 0) body += line(cx + 16, ry - 6, cx + cw - 16, ry - 6, { tone: "grid", sw: 1 });
        body += text(cx + 18, ry + 14, r.head, { size: 14, weight: 600 });
        body += text(cx + 18, ry + 34, r.why, { size: 12.5, tone: "muted" });
        if (r.see) body += text(cx + cw - 18, ry + 14, `see: ${r.see}`, { size: 12, tone: "blue", anchor: "end" });
      });
    });
    return svg(
      {
        width: 24 * 2 + cw * 2 + gap,
        height: h + 4,
        title: "Should an LLM do this job? The whole article on one card",
        desc: card.alt,
      },
      body,
    );
  },
};

export default [timeline, card];
