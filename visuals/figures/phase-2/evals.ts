import { arrow, box, lines, path, rect, svg, text, wrap, type Figure, type Tone } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// Figure 1: the anatomy of an eval. The ticket-triage example, the 30 cases and
// the 27/30 = 90% score are the article's own illustrative example
// (content/nodes/phase-2/evals.md), not a measurement. The parts (test cases,
// the system under test, grader, score) follow sources/anthropic-demystifying-evals.md
// and sources/husain-shankar-what-are-evals.md. Later versions have no numbers on
// purpose.

const anatomy: Figure = {
  slug: "anatomy",
  alt: "An eval in four parts. A fixed set of test cases, each an input with the answer you expect, goes into your feature (prompt, model, retrieval and code together). Each output goes to a grader: code, an LLM or a person. The grader's verdicts add up to one score, 27 of 30 in the ticket example. Version 1 scores 90%; after each change you run the same set again and compare, so a change that drops the score is caught before it ships.",
  render() {
    const top = 8, h = 196;
    const cases = { x: 24, w: 262 };
    const feat = { x: cases.x + cases.w + 40, w: 170 };
    const grade = { x: feat.x + feat.w + 40, w: 160 };
    const score = { x: grade.x + grade.w + 40, w: 134 };
    const W = score.x + score.w + 24;
    let b = "";

    // test cases
    b += rect(cases.x, top, cases.w, h, { tone: "blue", fill: "soft", r: 10 });
    b += text(cases.x + 16, top + 26, "Test cases", { size: 15, weight: 700 });
    b += text(cases.x + 16, top + 46, "input  →  expected", { size: 13, tone: "muted" });
    const rows: [string, string][] = [
      ["“I was charged twice”", "billing"],
      ["“App crashes on login”", "bug"],
      ["“Change my email”", "account"],
    ];
    rows.forEach(([q, a], i) => {
      const y = top + 76 + i * 30;
      b += text(cases.x + 16, y, q, { size: 13 });
      b += text(cases.x + cases.w - 16, y, a, { size: 13, mono: true, anchor: "end", tone: "blue", weight: 600 });
    });
    b += text(cases.x + 16, top + 76 + 3 * 30, "… 30 cases, fixed", { size: 13, tone: "muted" });

    const mid = top + h / 2;
    b += arrow(cases.x + cases.w + 6, mid, feat.x - 6, mid, { tone: "muted", sw: 2 });

    // feature
    b += rect(feat.x, top, feat.w, h, { tone: "purple", fill: "soft", r: 10 });
    b += text(feat.x + feat.w / 2, top + 26, "Your feature", { size: 15, weight: 700, anchor: "middle" });
    b += lines(feat.x + feat.w / 2, top + 64, ["prompt", "model", "retrieval", "your code"], { size: 13.5, anchor: "middle", gap: 24 });
    b += text(feat.x + feat.w / 2, top + h - 16, "one output per case", { size: 12.5, tone: "muted", anchor: "middle" });

    b += arrow(feat.x + feat.w + 6, mid, grade.x - 6, mid, { tone: "muted", sw: 2 });

    // grader
    b += rect(grade.x, top, grade.w, h, { tone: "orange", fill: "soft", r: 10 });
    b += text(grade.x + grade.w / 2, top + 26, "Grader", { size: 15, weight: 700, anchor: "middle" });
    const kinds: [string, Tone][] = [["code", "ink"], ["an LLM", "ink"], ["a person", "ink"]];
    kinds.forEach(([k, t], i) => (b += text(grade.x + grade.w / 2, top + 64 + i * 24, k, { size: 13.5, anchor: "middle", tone: t })));
    b += lines(grade.x + grade.w / 2, top + h - 34, ["pass or fail,", "per output"], { size: 12.5, tone: "muted", anchor: "middle", gap: 17 });

    b += arrow(grade.x + grade.w + 6, mid, score.x - 6, mid, { tone: "muted", sw: 2 });

    // score
    b += rect(score.x, top, score.w, h, { tone: "green", fill: "soft", r: 10 });
    b += text(score.x + score.w / 2, top + 26, "Score", { size: 15, weight: 700, anchor: "middle" });
    b += text(score.x + score.w / 2, top + 84, "27 / 30", { size: 22, weight: 700, anchor: "middle", tone: "green" });
    b += text(score.x + score.w / 2, top + 114, "= 90%", { size: 16, weight: 600, anchor: "middle" });
    b += text(score.x + score.w / 2, top + h - 16, "one number", { size: 12.5, tone: "muted", anchor: "middle" });

    // versions row
    const vy = top + h + 44;
    b += text(24, vy - 14, "Run the same set after every change, and compare:", { size: 13.5, weight: 600 });
    const slots = [
      { v: "prompt v1", s: "90%" },
      { v: "prompt v2", s: "?" },
      { v: "model upgrade", s: "?" },
    ];
    const sw = 200, sh = 44, sg = 36;
    slots.forEach((sl, i) => {
      const x = 24 + i * (sw + sg);
      b += rect(x, vy, sw, sh, { tone: i === 0 ? "green" : "grey", fill: i === 0 ? "soft" : "none", dash: i !== 0, r: 6 });
      b += text(x + 14, vy + sh / 2, sl.v, { size: 13.5, baseline: "middle" });
      b += text(x + sw - 14, vy + sh / 2, sl.s, { size: 15, weight: 700, baseline: "middle", anchor: "end", tone: i === 0 ? "green" : "muted" });
      if (i < slots.length - 1) b += arrow(x + sw + 6, vy + sh / 2, x + sw + sg - 6, vy + sh / 2, { tone: "muted", sw: 1.5 });
    });
    const nx = 24 + 3 * (sw + sg) - sg + 18;
    b += lines(nx, vy + 14, ["A drop means the", "change broke something."], { size: 12.5, tone: "muted", gap: 17 });

    return svg(
      {
        width: W,
        height: vy + sh + 16,
        title: "An eval: fixed inputs, a grader, and a number you track",
        credit: "Illustrative example (ticket triage), not a measurement.",
        desc: anatomy.alt,
      },
      b,
    );
  },
};

// ---------------------------------------------------------------------------
// Figure 2: steps to a first eval set. Numbers: 100 traces, first 30 yourself
// (sources/husain-shankar-how-many-examples.md); 20 to 50 tasks from real
// failures, manual checks, bug tracker and support queue
// (sources/anthropic-demystifying-evals.md, Steps 0 and 1); grader order
// (anthropic-demystifying-evals Step 5, anthropic-develop-tests); turning each
// new failure into a task and growing the set (openai-evaluation-best-practices,
// husain-your-ai-product-needs-evals).

type Step = { n: string; head: string; body: string; tone: Tone };
const STEPS: Step[] = [
  { n: "1", head: "Define good", body: "Success criteria you can measure. Expect to revise them.", tone: "blue" },
  { n: "2", head: "Read outputs", body: "About 100 diverse traces, the first 30 yourself. List how it fails.", tone: "purple" },
  { n: "3", head: "Collect tasks", body: "20 to 50, from real failures, manual checks and the support queue.", tone: "orange" },
  { n: "4", head: "Pick graders", body: "Code where a rule decides. A model where you need judgment.", tone: "red" },
  { n: "5", head: "Run and track", body: "On every change. Keep the score next to the prompt and model version.", tone: "green" },
];

const firstSet: Figure = {
  slug: "first-set",
  alt: "Five steps to a first eval set. 1: Write down what good means. 2: Read outputs, about 100 diverse traces, the first 30 yourself, and list how it fails. 3: Collect 20 to 50 tasks from real failures, manual checks and the support queue. 4: Pick a grader per failure, code first, a model where you need judgment. 5: Run on every change and track the number, then add each new failure as a task. An arrow runs from step 5 back to step 2: keep reading outputs.",
  render() {
    const bw = 158, gap = 22, x0 = 24, top = 8, bh = 148, headH = 40;
    let b = "";
    STEPS.forEach((st, i) => {
      const x = x0 + i * (bw + gap);
      b += rect(x, top, bw, bh, { tone: st.tone, fill: "none", r: 10 });
      b += rect(x, top, bw, headH, { tone: st.tone, fill: "soft", r: 10 });
      b += rect(x + 0.75, top + headH - 10, bw - 1.5, 10, { tone: st.tone, fill: "soft", stroke: false, r: 0 });
      b += `<line x1="${x}" y1="${top + headH}" x2="${x + bw}" y2="${top + headH}" class="s-${st.tone}" stroke-width="1.5"/>`;
      b += text(x + 14, top + headH / 2, st.n, { size: 15, weight: 700, baseline: "middle", tone: st.tone });
      b += text(x + 30, top + headH / 2, st.head, { size: 13.5, weight: 700, baseline: "middle" });
      b += lines(x + 12, top + headH + 26, wrap(st.body, bw - 24, 13), { size: 13, gap: 19 });
      if (i < STEPS.length - 1) b += arrow(x + bw + 3, top + bh / 2, x + bw + gap - 3, top + bh / 2, { tone: "muted", sw: 2 });
    });

    // loop back from 5 to 2
    const x5 = x0 + 4 * (bw + gap) + bw / 2;
    const x2 = x0 + 1 * (bw + gap) + bw / 2;
    const ly = top + bh + 34;
    b += path(`M${x5},${top + bh + 4} L${x5},${ly} L${x2},${ly} L${x2},${top + bh + 8}`, { tone: "muted", sw: 2, arrow: true });
    b += `<rect x="${(x2 + x5) / 2 - 200}" y="${ly - 12}" width="400" height="24" class="bg"/>`;
    b += text((x2 + x5) / 2, ly, "Every new failure becomes a task. Keep reading outputs.", { size: 13, anchor: "middle", baseline: "middle", tone: "muted" });

    const W = x0 * 2 + STEPS.length * bw + (STEPS.length - 1) * gap;
    return svg({ width: W, height: ly + 18, title: "Building a first eval set", desc: firstSet.alt }, b);
  },
};

export default [anatomy, firstSet];
