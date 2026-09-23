import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// Figure 1: scoreboards. Our own arithmetic on the scoring in
// sources/kalai-why-language-models-hallucinate.md (binary grading; a wrong
// answer costs t/(1−t) = 9 points at t = 0.9). Ten questions, the model truly
// knows 3. The guesser answers all ten and gets one lucky guess: 4 right,
// 6 wrong. The honest model answers the 3 it knows and says "I don't know" to 7.
type Mark = "right" | "wrong" | "idk";
const GUESSER: Mark[] = ["right", "right", "right", "right", "wrong", "wrong", "wrong", "wrong", "wrong", "wrong"];
const HONEST: Mark[] = ["right", "right", "right", "idk", "idk", "idk", "idk", "idk", "idk", "idk"];
const MARK_TONE: Record<Mark, Tone> = { right: "green", wrong: "red", idk: "grey" };

const scoreboards: Figure = {
  slug: "scoreboards",
  alt: "Two scoreboards for the same ten questions, where the model truly knows 3 answers. The guesser answers all ten and gets 4 right and 6 wrong. The honest model answers 3 and says I don't know to 7. With binary grading the guesser scores 4 and the honest model 3, so guessing wins. With a penalty of 9 points per wrong answer the guesser scores 4 minus 54, which is minus 50, and the honest model still scores 3.",
  render() {
    const panels = [
      { head: "Binary grading", rule: "right +1 · wrong 0 · “I don't know” 0", wrong: 0, g: "4 × 1 + 6 × 0 = 4", h: "3 × 1 = 3", gs: 4, hs: 3 },
      { head: "Wrong answers cost 9 points", rule: "right +1 · wrong −9 · “I don't know” 0", wrong: -9, g: "4 − 6 × 9 = −50", h: "3 × 1 = 3", gs: -50, hs: 3 },
    ];
    const pw = 440, gap = 32, sq = 22, sg = 4;
    let body = "";
    panels.forEach((p, i) => {
      const x0 = 24 + i * (pw + gap);
      body += rect(x0, 0, pw, 236, { tone: "grey", fill: "none", sw: 1 });
      body += text(x0 + 18, 28, p.head, { size: 15, weight: 600 });
      body += text(x0 + 18, 50, p.rule, { size: 12.5, tone: "muted" });
      const rows = [
        { name: "Guesser", marks: GUESSER, sum: p.g, score: p.gs },
        { name: "Honest", marks: HONEST, sum: p.h, score: p.hs },
      ];
      const winner = p.gs > p.hs ? 0 : 1;
      rows.forEach((r, j) => {
        const ry = 78 + j * 58;
        body += text(x0 + 18, ry + sq / 2, r.name, { size: 14, weight: 600, baseline: "middle" });
        r.marks.forEach((m, k) => {
          const sx = x0 + 88 + k * (sq + sg);
          body += rect(sx, ry, sq, sq, { tone: MARK_TONE[m], fill: m === "idk" ? "soft" : "solid", stroke: m === "idk", r: 3, sw: 1 });
          if (m === "idk") body += text(sx + sq / 2, ry + sq / 2 + 1, "?", { size: 13, anchor: "middle", baseline: "middle", tone: "muted", weight: 600 });
        });
        body += text(x0 + 88, ry + sq + 17, r.sum, { size: 12.5, tone: "muted" });
        const tone: Tone = j === winner ? "green" : "ink";
        body += text(x0 + pw - 20, ry + sq / 2, String(r.score).replace("-", "−"), { size: 22, weight: 700, anchor: "end", baseline: "middle", tone });
      });
      const verdict = winner === 0 ? "Guessing wins" : "Saying “I don't know” wins";
      body += line(x0 + 18, 196, x0 + pw - 18, 196, { tone: "grid", sw: 1 });
      body += text(x0 + 18, 218, verdict, { size: 14, weight: 700, tone: winner === 0 ? "red" : "green" });
    });
    // legend
    const ly = 262;
    const items: { m: Mark; label: string }[] = [
      { m: "right", label: "right answer" },
      { m: "wrong", label: "wrong answer (a guess that missed)" },
      { m: "idk", label: "“I don't know”" },
    ];
    let lx = 24;
    for (const it of items) {
      body += rect(lx, ly - 8, 16, 16, { tone: MARK_TONE[it.m], fill: it.m === "idk" ? "soft" : "solid", stroke: it.m === "idk", r: 3, sw: 1 });
      body += text(lx + 24, ly, it.label, { size: 12.5, baseline: "middle", tone: "muted" });
      lx += 24 + it.label.length * 6.6 + 28;
    }
    return svg(
      {
        width: 24 * 2 + pw * 2 + gap,
        height: ly + 14,
        title: "Ten questions, the model knows 3: the grading decides whether guessing pays",
        credit: "Our own arithmetic, using the scoring in Kalai et al., “Why Language Models Hallucinate” (2025).",
        desc: scoreboards.alt,
      },
      body,
    );
  },
};

// ---------------------------------------------------------------------------
// Figure 2: the "known entity" switch. From sources/anthropic-tracing-thoughts.md:
// declining is the default; a known-entity feature inhibits the "can't answer"
// circuit; Michael Jordan (known) → answers, Michael Batkin (unknown) →
// declines; misfire on a name it recognizes but knows nothing about → confabulates.

/** A line ending in a flat bar: "this turns that off". */
function inhibit(x1: number, y: number, x2: number, tone: Tone) {
  return line(x1, y, x2, y, { tone, sw: 2 }) + line(x2, y - 9, x2, y + 9, { tone, sw: 3 });
}

type State = { on: boolean; tone: Tone; label: string[] };
const ROWS: { tag: string; tagTone: Tone; name: string[]; known: State; cant: State; out: { label: string[]; tone: Tone } }[] = [
  {
    tag: "Known name",
    tagTone: "green",
    name: ["“Michael Jordan”", "(the basketball player)"],
    known: { on: true, tone: "green", label: ["Known entity", "ON"] },
    cant: { on: false, tone: "grey", label: ["Can't answer", "switched OFF"] },
    out: { label: ["Answers:", "basketball"], tone: "green" },
  },
  {
    tag: "Unknown name",
    tagTone: "muted",
    name: ["“Michael Batkin”", "(no one it knows)"],
    known: { on: false, tone: "grey", label: ["Known entity", "OFF"] },
    cant: { on: true, tone: "orange", label: ["Can't answer", "stays ON (default)"] },
    out: { label: ["Declines:", "not enough information"], tone: "orange" },
  },
  {
    tag: "Hallucination",
    tagTone: "red",
    name: ["A name it recognizes", "but knows nothing about"],
    known: { on: true, tone: "red", label: ["Known entity", "fires by mistake"] },
    cant: { on: false, tone: "grey", label: ["Can't answer", "switched OFF"] },
    out: { label: ["Makes up a plausible,", "confident, false answer"], tone: "red" },
  },
];

const circuit: Figure = {
  slug: "known-entity-switch",
  alt: "Three rows showing a switch inside Claude 3.5 Haiku. By default a “can't answer” circuit is on. For Michael Jordan, a known-entity feature turns on and switches it off, so the model answers basketball. For Michael Batkin, nothing is recognized, the default stays on, and the model declines. In the red row, a name the model recognizes but knows nothing about makes the known-entity feature fire by mistake, the “can't answer” circuit is switched off, and the model makes up a confident, false answer.",
  render() {
    const nx = 24, nw = 200, kx = 280, kw = 160, cx = 520, cw = 170, ox = 740, ow = 210, rh = 64, rg = 40;
    let body = "";
    body += text(nx, 12, "Question about…", { size: 12.5, weight: 600, tone: "muted" });
    body += text(kx, 12, "“Known entity” feature", { size: 12.5, weight: 600, tone: "muted" });
    body += text(cx, 12, "“Can't answer” circuit", { size: 12.5, weight: 600, tone: "muted" });
    body += text(ox, 12, "What the model does", { size: 12.5, weight: 600, tone: "muted" });
    ROWS.forEach((r, i) => {
      const y = 44 + i * (rh + rg);
      const mid = y + rh / 2;
      body += text(nx, y - 8, r.tag, { size: 12.5, weight: 700, tone: r.tagTone });
      body += box(nx, y, nw, rh, r.name, { tone: i === 2 ? "red" : "grey", fill: "soft", size: 13.5 });
      body += arrow(nx + nw + 6, mid, kx - 6, mid, { tone: "muted" });
      body += box(kx, y, kw, rh, r.known.label, {
        tone: r.known.tone,
        fill: r.known.on ? "soft" : "none",
        dash: !r.known.on,
        size: 13.5,
        weight: r.known.on ? 600 : 400,
        textTone: r.known.on ? r.known.tone : "muted",
      });
      if (r.known.on) body += inhibit(kx + kw + 6, mid, cx - 6, r.known.tone);
      else body += line(kx + kw + 6, mid, cx - 6, mid, { tone: "grey", dash: true, sw: 1.2 });
      body += box(cx, y, cw, rh, r.cant.label, {
        tone: r.cant.tone,
        fill: r.cant.on ? "soft" : "none",
        dash: !r.cant.on,
        size: 13.5,
        weight: r.cant.on ? 600 : 400,
        textTone: r.cant.on ? r.cant.tone : "muted",
      });
      body += arrow(cx + cw + 6, mid, ox - 6, mid, { tone: "muted" });
      body += box(ox, y, ow, rh, r.out.label, { tone: r.out.tone, fill: "soft", size: 13.5, weight: 600, textTone: r.out.tone });
    });
    const ly = 44 + 3 * (rh + rg) - 14;
    body += inhibit(nx, ly, nx + 34, "ink");
    body += text(nx + 44, ly, "turns off", { size: 12.5, baseline: "middle", tone: "muted" });
    body += line(nx + 130, ly, nx + 164, ly, { tone: "grey", dash: true, sw: 1.2 });
    body += text(nx + 174, ly, "nothing happens", { size: 12.5, baseline: "middle", tone: "muted" });
    body += text(nx + 310, ly, "Declining is the default: something has to switch “can't answer” off.", { size: 12.5, baseline: "middle", tone: "ink", weight: 600 });
    return svg(
      {
        width: ox + ow + 24,
        height: ly + 14,
        title: "A hallucination is a switch flipping the wrong way",
        credit: "Adapted from Anthropic, “Tracing the thoughts of a large language model” (2025), on Claude 3.5 Haiku. Simplified.",
        desc: circuit.alt,
      },
      body,
    );
  },
};

export default [scoreboards, circuit];
