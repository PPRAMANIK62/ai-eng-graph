import { arrow, box, line, rect, svg, text, wrap, lines, type Figure, type Tone } from "../../lib/svg.ts";

// The three shapes: sources/zheng-llm-as-a-judge.md (3.1: pairwise, single
// answer, reference-guided; swap order). When each fits: sources/yan-llm-evaluators.md
// (objective -> direct scoring, subjective -> pairwise) and zheng (reference for math).
const threeWays: Figure = {
  slug: "three-ways",
  alt: "Three ways to ask a judge. Single output: the judge sees one answer and a rubric, and returns pass or fail (or a score). Pairwise: the judge sees two answers to the same input and picks the better one or calls a tie; run it twice with the order swapped. Reference-guided: the judge sees one answer next to a known-good reference answer and checks it against that. Below, when each fits: single output for objective checks like faithfulness or a policy rule, pairwise for subjective qualities like tone when comparing two versions, reference-guided when a correct answer exists, such as math.",
  render() {
    let b = "";
    const cols: { x: number; title: string; tone: Tone; inputs: string[]; out: string; fit: string }[] = [
      { x: 20, title: "Single output", tone: "blue", inputs: ["answer", "rubric"], out: "pass / fail", fit: "Objective checks: faithful to the source? broke a policy rule? Works on live traffic." },
      { x: 320, title: "Pairwise", tone: "orange", inputs: ["answer A", "answer B"], out: "A, B or tie", fit: "Subjective qualities, like tone, when comparing two versions. Run both orders." },
      { x: 620, title: "Reference-guided", tone: "green", inputs: ["answer", "reference"], out: "pass / fail", fit: "When a correct answer exists, like math, so the judge isn't misled by the answer." },
    ];
    for (const c of cols) {
      b += text(c.x, 8, c.title, { size: 14.5, weight: 700, tone: c.tone });
      b += box(c.x, 26, 110, 30, c.inputs[0], { tone: "grey", size: 13 });
      b += box(c.x, 66, 110, 30, c.inputs[1], { tone: "grey", size: 13 });
      b += arrow(c.x + 112, 41, c.x + 132, 55, { tone: "muted" });
      b += arrow(c.x + 112, 81, c.x + 132, 67, { tone: "muted" });
      b += box(c.x + 134, 43, 58, 34, "judge", { tone: c.tone, size: 13, weight: 600 });
      b += arrow(c.x + 192, 60, c.x + 206, 60, { tone: "muted" });
      b += box(c.x + 208, 45, 78, 30, c.out, { tone: c.tone, fill: "none", size: 12 });
      b += lines(c.x, 128, wrap(c.fit, 270, 12.5), { size: 12.5 });
    }
    b += line(20, 112, 900, 112, { tone: "grid", sw: 1 });
    return svg(
      {
        width: 920,
        height: 172,
        title: "Three ways to ask a judge, and when each fits",
        credit: "Shapes from Zheng et al. (2023). When each fits, from Yan (2024) and Zheng et al.",
        desc: threeWays.alt,
      },
      b,
    );
  },
};

// sources/husain-shankar-trust-automated-eval.md (10 failures, 8 caught = TPR 80%;
// 100 good, 95 passed = TNR 95%) and sources/husain-llm-judge-guide.md (5% error
// rate, always-pass judge = 95% agreement, detects none).
const cell = (x: number, y: number, w: number, h: number, n: string, label: string, tone: Tone) =>
  rect(x, y, w, h, { tone, fill: "soft", r: 3 }) +
  text(x + w / 2, y + h / 2 - 8, n, { anchor: "middle", baseline: "middle", size: 18, weight: 700, tone }) +
  text(x + w / 2, y + h / 2 + 14, label, { anchor: "middle", baseline: "middle", size: 12 });

const tprTnr: Figure = {
  slug: "tpr-tnr",
  alt: "Why a judge needs two numbers, not one. Left, a judge checked against 110 expert labels: of 10 real failures it catches 8 (true positive rate 80%), and of 100 good outputs it passes 95 (true negative rate 95%). Right, a judge that always says pass, on a set where 5% of outputs fail: its agreement with the expert is 95%, yet it catches none of the failures (true positive rate 0%). Raw agreement looks high whenever failures are rare.",
  render() {
    let b = "";
    const panel = (x0: number, title: string, sub: string, cells: [string, string, Tone][], rates: [string, Tone][]) => {
      let s = text(x0, 8, title, { size: 14.5, weight: 700 });
      s += text(x0, 28, sub, { size: 12.5, tone: "muted" });
      const cw = 150, ch = 62, gx = x0 + 110, gy = 70;
      s += text(gx + cw / 2, gy - 10, "judge says fail", { anchor: "middle", size: 12, tone: "muted" });
      s += text(gx + cw * 1.5 + 6, gy - 10, "judge says pass", { anchor: "middle", size: 12, tone: "muted" });
      s += text(gx - 10, gy + ch / 2, "expert: fail", { anchor: "end", baseline: "middle", size: 12, tone: "muted" });
      s += text(gx - 10, gy + ch * 1.5 + 6, "expert: pass", { anchor: "end", baseline: "middle", size: 12, tone: "muted" });
      s += cell(gx, gy, cw, ch, cells[0][0], cells[0][1], cells[0][2]);
      s += cell(gx + cw + 6, gy, cw, ch, cells[1][0], cells[1][1], cells[1][2]);
      s += cell(gx, gy + ch + 6, cw, ch, cells[2][0], cells[2][1], cells[2][2]);
      s += cell(gx + cw + 6, gy + ch + 6, cw, ch, cells[3][0], cells[3][1], cells[3][2]);
      rates.forEach(([r, t], i) => {
        s += text(x0, gy + 2 * ch + 36 + i * 20, r, { size: 13, weight: 600, tone: t });
      });
      return s;
    };
    b += panel(20, "A judge checked against expert labels", "10 real failures, 100 good outputs", [
      ["8", "failures caught", "green"],
      ["2", "failures missed", "red"],
      ["5", "false alarms", "orange"],
      ["95", "good, passed", "green"],
    ], [
      ["True positive rate: 8 of 10 = 80%", "green"],
      ["True negative rate: 95 of 100 = 95%", "green"],
    ]);
    b += line(470, 0, 470, 270, { tone: "grid", sw: 1 });
    b += panel(490, "A judge that always says pass", "5 failures in 100 outputs", [
      ["0", "failures caught", "red"],
      ["5", "failures missed", "red"],
      ["0", "false alarms", "grey"],
      ["95", "good, passed", "green"],
    ], [
      ["Agreement with the expert: 95%", "muted"],
      ["True positive rate: 0%. It catches nothing.", "red"],
    ]);
    return svg(
      {
        width: 940,
        height: 280,
        title: "Measure a judge with two rates, not one agreement number",
        credit: "Numbers from Husain & Shankar, AI Evals FAQ (2026), and Husain's LLM-judge guide (2024).",
        desc: tprTnr.alt,
      },
      b,
    );
  },
};

export default [threeWays, tprTnr];
