import { arrow, box, bracket, line, rect, svg, text, type Figure } from "../../lib/svg.ts";

// sources/epoch-swe-bench-verified-review.md: 500 tasks; OpenAI audited 27.6% of them;
// 59.4% of the audited tasks had flawed tests; a floor of 16.4% of all tasks broken.
// Only these published percentages are used. Segment widths are drawn to them
// (27.6% and 16.4% of the bar); no task counts are shown.
const AUDITED = 0.276;
const FLAWED = 0.164;

const audit: Figure = {
  slug: "swe-bench-audit",
  alt: "A bar standing for all 500 SWE-bench Verified tasks. OpenAI audited 27.6% of them, focusing on tasks models kept failing. In 59.4% of the audited tasks, the tests rejected correct fixes. That makes at least 16.4% of the whole benchmark broken, a floor, since the rest was never audited.",
  render() {
    const x0 = 20;
    const W = 720;
    const by = 70;
    const bh = 56;
    const xa = x0 + AUDITED * W;
    const xf = x0 + FLAWED * W;
    let b = "";
    b += rect(x0, by, W, bh, { tone: "grey", fill: "none", r: 3, sw: 1.2 });
    b += rect(x0, by, xa - x0, bh, { tone: "blue", fill: "soft", r: 3, sw: 1.2 });
    b += rect(x0, by, xf - x0, bh, { tone: "red", fill: "solid", stroke: false, r: 3 });
    b += text((xa + x0 + W) / 2, by + bh / 2, "not audited", { anchor: "middle", baseline: "middle", size: 13.5, tone: "muted" });
    b += text(x0 + W, by - 14, "all 500 tasks", { anchor: "end", size: 14, weight: 700 });
    b += bracket(x0, xa, by - 10, "audited: 27.6% of tasks", { tone: "blue", size: 13 });
    b += line(xf / 2 + x0 / 2, by + bh + 4, xf / 2 + x0 / 2, by + bh + 26, { tone: "red", sw: 1.5 });
    b += text(x0, by + bh + 44, "In 59.4% of the audited tasks, the tests rejected correct fixes.", { size: 13, weight: 600, tone: "red" });
    b += text(x0, by + bh + 64, "That is at least 16.4% of the whole benchmark. A floor: most tasks were never checked.", { size: 13 });
    b += text(x0, by + bh + 84, "OpenAI focused the audit on tasks models kept failing.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: x0 * 2 + W,
        height: by + bh + 96,
        title: "SWE-bench Verified: how much of it had broken tests",
        credit: "Data: OpenAI's 2026-02 audit, as reported by Epoch AI (2026). Widths drawn to the published percentages.",
        desc: audit.alt,
      },
      b,
    );
  },
};

// sources/zhang-gsm1k.md: GSM1k mirrors GSM8k (human solve rates, steps, answer
// magnitude); drops of up to 8%; Spearman r² = 0.36 with the chance of generating
// GSM8k examples; frontier models show minimal overfitting. Diagram only, no data.
const gsm1k: Figure = {
  slug: "gsm1k",
  alt: "How GSM1k tests for contamination. A model is scored on the public GSM8k benchmark and on GSM1k, a fresh set of 1,000 problems matched to GSM8k in style and difficulty that can't be in the training data. If the model learned the skill, the two scores match. If it memorized GSM8k, it scores lower on GSM1k. Some model families dropped by up to 8%, and the models most likely to generate GSM8k problems had the biggest drops (Spearman r² = 0.36). Frontier models showed little drop.",
  render() {
    let b = "";
    b += box(20, 20, 200, 58, ["GSM8k", "public, may be in training data"], { tone: "orange", size: 12.5 });
    b += box(20, 120, 200, 58, ["GSM1k", "1,000 new look-alike problems"], { tone: "blue", size: 12.5 });
    b += text(120, 104, "matched on difficulty, steps, answer size", { anchor: "middle", size: 11.5, tone: "muted" });
    b += box(290, 70, 110, 58, "same model", { tone: "grey", size: 13, weight: 600 });
    b += arrow(222, 49, 288, 88, { tone: "muted" });
    b += arrow(222, 149, 288, 112, { tone: "muted" });
    b += arrow(402, 99, 450, 99, { tone: "muted" });
    b += text(460, 99, "compare the two scores", { size: 13, weight: 600, baseline: "middle" });

    const x = 460;
    b += rect(x, 124, 250, 58, { tone: "green", fill: "soft", sw: 1.2 });
    b += text(x + 12, 144, "Scores match: it learned the skill.", { size: 12.5, weight: 600, tone: "green" });
    b += text(x + 12, 164, "Many models, frontier ones especially.", { size: 12.5 });
    b += rect(x, 0, 250, 78, { tone: "red", fill: "soft", sw: 1.2 });
    b += text(x + 12, 20, "Lower on GSM1k: memorized.", { size: 12.5, weight: 600, tone: "red" });
    b += text(x + 12, 40, "Some model families, drops up to 8%.", { size: 12.5 });
    b += text(x + 12, 60, "Bigger drop if it can generate GSM8k.", { size: 12.5 });
    return svg(
      {
        width: x + 270,
        height: 190,
        title: "Testing for contamination with a fresh look-alike test",
        credit: "Method and results from Zhang et al., GSM1k (2024). Diagram, not data.",
        desc: gsm1k.alt,
      },
      b,
    );
  },
};

export default [audit, gsm1k];
