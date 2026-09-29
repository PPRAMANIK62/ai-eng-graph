import { scaleLinear, series } from "../../lib/chart.ts";
import { arrow, box, line, path, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// The loop: sources/anthropic-evaluator-optimizer-cookbook.md (PASS / NEEDS_IMPROVEMENT / FAIL,
// previous attempts fed back) and sources/anthropic-building-effective-agents.md. The external
// evidence box comes from sources/huang-cannot-self-correct.md (section 6) and
// sources/ridnik-alphacodium.md (running tests). The round cap is our addition; the cookbook has none.
const loop: Figure = {
  slug: "loop",
  alt: "The evaluator-optimizer loop. The generator writes a draft. The evaluator checks it against the criteria and, ideally, against something outside the model (tests, retrieved sources). On pass, the answer is returned. Otherwise, the feedback and earlier drafts go back to the generator. A counter stops the loop after a fixed number of rounds, and the code then returns the best draft or drops the claims that failed.",
  render() {
    let b = "";
    const y = 40;
    b += box(20, y, 100, 50, "task", { tone: "grey", size: 13.5 });
    b += arrow(120, y + 25, 158, y + 25, { tone: "muted" });
    b += box(160, y, 150, 50, ["generator", "writes a draft"], { tone: "blue", size: 13, weight: 600 });
    b += arrow(310, y + 25, 368, y + 25, { tone: "muted" });
    b += text(339, y + 14, "draft", { anchor: "middle", size: 12, tone: "muted" });
    b += box(370, y, 250, 50, ["evaluator", "PASS / NEEDS_IMPROVEMENT / FAIL"], { tone: "red", size: 12, weight: 600 });
    // external evidence
    b += box(425, y + 108, 140, 44, ["tests, sources,", "rules in code"], { tone: "green", size: 12.5 });
    b += arrow(495, y + 108, 495, y + 52, { tone: "green" });
    b += text(575, y + 134, "outside evidence", { size: 12, tone: "green" });
    // pass
    b += arrow(620, y + 25, 690, y + 25, { tone: "green" });
    b += text(655, y + 14, "PASS", { anchor: "middle", size: 12, weight: 700, tone: "green" });
    b += box(692, y, 100, 50, "answer", { tone: "grey", size: 13.5 });
    // feedback loop above
    b += path(`M${495},${y} L${495},${y - 28} L${235},${y - 28} L${235},${y - 2}`, { tone: "red", arrow: true });
    b += text(365, y - 36, "feedback + earlier drafts", { anchor: "middle", size: 12, tone: "red" });
    // cap
    b += rect(160, y + 110, 180, 44, { tone: "orange", fill: "soft", dash: true });
    b += text(250, y + 126, "round counter", { anchor: "middle", size: 12.5, weight: 600, tone: "orange" });
    b += text(250, y + 143, "at the cap: best draft or drop", { anchor: "middle", size: 12, tone: "orange" });
    b += line(235, y + 52, 235, y + 108, { tone: "orange", dash: true });
    return svg(
      {
        width: 820,
        height: y + 170,
        title: "One call writes, another grades, and code decides whether to loop",
        credit: "Adapted from Anthropic, “Building effective agents” (2024) and its cookbook. The round cap is added; the cookbook loop has none.",
        desc: loop.alt,
      },
      b,
    );
  },
};

// sources/huang-cannot-self-correct.md, Tables 2 and 3: accuracy by round of intrinsic
// self-correction (1, 3, 5 calls), and the oracle-label result for GPT-3.5.
const LINES: { name: string; tone: Tone; vals: number[]; dash?: boolean }[] = [
  { name: "GPT-4, GSM8K", tone: "blue", vals: [95.5, 91.5, 89.0] },
  { name: "GPT-4, CommonSenseQA", tone: "purple", vals: [82.0, 79.5, 80.0] },
  { name: "GPT-3.5, GSM8K", tone: "green", vals: [75.9, 75.1, 74.7] },
  { name: "GPT-3.5, CommonSenseQA", tone: "red", vals: [75.8, 38.1, 41.8] },
];

const selfCorrection: Figure = {
  slug: "self-correction",
  alt: "Line chart of accuracy after each round of self-correction with no outside feedback. GPT-3.5 on GSM8K: 75.9, 75.1, 74.7. GPT-3.5 on CommonSenseQA: 75.8, 38.1, 41.8. GPT-4 on GSM8K: 95.5, 91.5, 89.0. GPT-4 on CommonSenseQA: 82.0, 79.5, 80.0. For comparison, when the correct answer was used to decide when to stop, GPT-3.5 reached 84.3 on GSM8K and 89.7 on CommonSenseQA.",
  render() {
    const p = { x: 70, y: 20, w: 380, h: 260 };
    const xs = scaleLinear().domain([0, 2]).range([p.x + 30, p.x + p.w - 30]);
    const ys = scaleLinear().domain([30, 100]).range([p.y + p.h, p.y]);
    let b = "";
    for (const t of [30, 40, 50, 60, 70, 80, 90, 100]) {
      b += line(p.x, ys(t), p.x + p.w, ys(t), { tone: "grid", sw: 1 });
      b += text(p.x - 8, ys(t), String(t), { anchor: "end", baseline: "middle", size: 11.5, tone: "muted" });
    }
    b += text(p.x - 44, p.y + p.h / 2, "accuracy (%)", { anchor: "middle", size: 12, tone: "muted", rotate: -90 });
    ["first answer", "round 1", "round 2"].forEach((l, i) => {
      b += text(xs(i), p.y + p.h + 18, l, { anchor: "middle", size: 12 });
      b += text(xs(i), p.y + p.h + 34, `${[1, 3, 5][i]} call${i ? "s" : ""}`, { anchor: "middle", size: 11.5, tone: "muted" });
    });
    b += line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, { tone: "axis" });
    for (const l of LINES) {
      b += series(
        l.vals.map((v, i) => [xs(i), ys(v)] as [number, number]),
        { tone: l.tone, dots: true, smooth: false },
      );
    }
    // legend on the right, with end values
    const lx = p.x + p.w + 24;
    const order = [...LINES].sort((a, c) => c.vals[2] - a.vals[2]);
    order.forEach((l, i) => {
      const ly = p.y + 10 + i * 40;
      b += line(lx, ly, lx + 22, ly, { tone: l.tone, sw: 2.5 });
      b += text(lx + 30, ly, l.name, { baseline: "middle", size: 12.5, weight: 600, tone: l.tone });
      b += text(lx + 30, ly + 16, l.vals.map((v) => v.toFixed(1)).join(" → "), { baseline: "middle", size: 12, tone: "muted" });
    });
    // oracle comparison
    const oy = p.y + 190;
    b += text(lx, oy, "With the true answer used to stop", { size: 12.5, weight: 600 });
    b += text(lx, oy + 18, "(an oracle a product doesn't have):", { size: 12, tone: "muted" });
    b += text(lx, oy + 38, "GPT-3.5, GSM8K: 75.9 → 84.3", { size: 12.5, tone: "green" });
    b += text(lx, oy + 56, "GPT-3.5, CommonSenseQA: 75.8 → 89.7", { size: 12.5, tone: "red" });
    return svg(
      {
        width: lx + 270,
        height: p.y + p.h + 44,
        title: "Reviewing its own answer with no outside feedback didn't help",
        credit: "Data: Huang et al., “Large Language Models Cannot Self-Correct Reasoning Yet” (ICLR 2024), Tables 2 and 3.",
        desc: selfCorrection.alt,
      },
      b,
    );
  },
};

export default [loop, selfCorrection];
