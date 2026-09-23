import { scaleBand, scaleLinear } from "../../lib/chart.ts";
import { line, rect, svg, text, type Figure } from "../../lib/svg.ts";

// Counts from sources/huggingface-how-to-generate.md: k = 6 in both steps;
// p = 0.92 keeps 9 words in the flat step and 3 in the sharp one; the top 6
// cover about two-thirds of the probability in the flat step and almost all
// of it in the sharp one. The bar HEIGHTS are made up to match those facts
// (the real ones are only in the source's images), so the figure says
// "illustrative shape, not data".
const FLAT = [0.13, 0.12, 0.115, 0.11, 0.105, 0.095, 0.09, 0.085, 0.08, 0.03, 0.025, 0.015];
const SHARP = [0.6, 0.25, 0.08, 0.03, 0.02, 0.01, 0.004, 0.003, 0.001, 0.001, 0.0005, 0.0005];
const K = 6, P = 0.92;

function keptByP(ps: number[]) {
  let sum = 0;
  for (let i = 0; i < ps.length; i++) {
    sum += ps[i]!;
    if (sum >= P) return i + 1;
  }
  return ps.length;
}
const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);
// Guard the made-up shapes against the source's counts.
if (keptByP(FLAT) !== 9 || keptByP(SHARP) !== 3) throw new Error("top-p shapes don't match the 9 / 3 counts");
if (Math.abs(sum(FLAT.slice(0, K)) - 2 / 3) > 0.03 || sum(SHARP.slice(0, K)) < 0.98) throw new Error("top-k coverage doesn't match");

const figure: Figure = {
  slug: "k-vs-p",
  alt: "Two bar charts of next-token probabilities. On the left the probability is spread flat over many tokens; on the right most of it sits on one or two. A top-k cut at k = 6 is the same line in both: on the left it throws away good options, on the right it lets in tokens with almost no chance. A top-p cut at p = 0.92 keeps 9 tokens on the left and only 3 on the right.",
  render() {
    const pw = 420, gap = 48, ph = 210, top = 96;
    const y = scaleLinear().domain([0, 0.62]).range([top + ph, top]);
    const panels = [
      { head: "Flat: many tokens fit", ps: FLAT, kNote: ["k = 6 covers only about two-thirds:", "it cuts tokens that would have been fine"] },
      { head: "Sharp: one or two tokens fit", ps: SHARP, kNote: ["k = 6 covers almost everything:", "it lets in tokens with almost no chance"] },
    ];
    let body = "";
    body += text(24, 12, "Illustrative shape, not data. The counts (k = 6; 9 and 3 tokens kept at p = 0.92) are from the Hugging Face example.", {
      size: 12.5,
      tone: "muted",
      italic: true,
    });
    panels.forEach((pn, i) => {
      const x0 = 24 + i * (pw + gap);
      const kept = keptByP(pn.ps);
      const xb = scaleBand<number>().domain(pn.ps.map((_, j) => j)).range([x0, x0 + pw]).padding(0.22);
      body += text(x0, 42, pn.head, { size: 15, weight: 600 });
      // top-p shaded region
      const px2 = xb(kept - 1)! + xb.bandwidth() + (xb.step() - xb.bandwidth()) / 2;
      body += rect(x0 - 4, top - 8, px2 - x0 + 4, ph + 8, { tone: "blue", fill: "soft", stroke: false, r: 4 });
      body += rect(x0, 62, 14, 14, { tone: "blue", fill: "soft", stroke: true, r: 2, sw: 1 });
      body += text(x0 + 20, 69, `top-p (p = 0.92) keeps ${kept}`, { size: 13, weight: 700, tone: "blue", baseline: "middle" });
      body += line(x0 + 210, 69, x0 + 232, 69, { tone: "orange", sw: 2.5, dash: true });
      body += text(x0 + 238, 69, `top-k (k = 6) keeps 6`, { size: 13, weight: 700, tone: "orange", baseline: "middle" });
      pn.ps.forEach((v, j) => {
        const bx = xb(j)!;
        const by = y(v);
        body += rect(bx, by, xb.bandwidth(), Math.max(1.5, top + ph - by), { tone: j < kept ? "blue" : "grey", fill: "solid", stroke: false, r: 2 });
      });
      body += line(x0 - 4, top + ph, x0 + pw, top + ph, { tone: "axis" });
      body += text(x0 + pw / 2, top + ph + 18, "tokens, most likely first", { size: 12, tone: "muted", anchor: "middle" });
      // top-k line
      const kx = xb(K - 1)! + xb.bandwidth() + (xb.step() - xb.bandwidth()) / 2;
      body += line(kx, top - 8, kx, top + ph + 4, { tone: "orange", sw: 2.5, dash: true });
      body += text(x0, top + ph + 44, pn.kNote[0]!, { size: 12.5, tone: "orange", weight: 600 });
      body += text(x0, top + ph + 62, pn.kNote[1]!, { size: 12.5, tone: "orange" });
    });
    return svg(
      {
        width: 24 * 2 + pw * 2 + gap,
        height: top + ph + 72,
        title: "A fixed count (top-k) vs a fixed share (top-p)",
        credit: "Adapted from Holtzman et al. (2019), Figure 5, and Hugging Face, “How to generate text” (2020).",
        desc: figure.alt,
      },
      body,
    );
  },
};

export default [figure];
