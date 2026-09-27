import { arrow, box, line, path, rect, text, svg, type Figure } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// Figure: the checks before answering. Our own diagram of the article's three
// signals: a calibrated retrieval/rerank threshold (sources/cohere-rerank-best-practices.md),
// a sufficiency check and the model's confidence, combined into one score with a
// threshold (the selective generation idea in sources/joren-sufficient-context.md).
// The side panel's curve is an illustrative shape only (coverage up -> accuracy on
// answered questions down), with no numbers.

const checks: Figure = {
  slug: "checks",
  alt: "A question goes through three checks. First, the retrieval score: if the best result is below a threshold calibrated on borderline examples, the system says it couldn't find anything, without calling the model. Second, a sufficiency check: the model or a classifier judges whether the retrieved text answers the question. Third, the model's confidence. The last two are combined into one score, and a threshold on it decides between answering with citations and saying it doesn't know. A side panel shows the threshold as a dial: stricter means fewer questions answered with more of them right; looser means more questions answered with more wrong. The curve is an illustrative shape, not data.",
  render() {
    let b = "";
    const x0 = 24, bw = 150, bh = 58;
    // main flow, left to right
    const y = 40, mid = y + bh / 2;
    b += box(x0, y, 110, bh, ["Question +", "retrieved chunks"], { tone: "grey", fill: "soft", size: 13 });
    const g1 = x0 + 140;
    b += arrow(x0 + 112, mid, g1 - 4, mid, { tone: "muted" });
    b += box(g1, y, bw, bh, ["1. Best retrieval", "score ≥ threshold?"], { tone: "blue", fill: "soft", size: 13, weight: 600 });
    const g2 = g1 + bw + 40;
    b += arrow(g1 + bw + 2, mid, g2 - 4, mid, { tone: "green" });
    b += text(g1 + bw + 20, mid - 8, "yes", { size: 12, anchor: "middle", tone: "green" });
    b += box(g2, y, bw, bh, ["2. Does the text", "answer the question?"], { tone: "blue", fill: "soft", size: 13, weight: 600 });
    b += box(g2, y + bh + 16, bw, bh, ["3. Model's confidence", "in its answer"], { tone: "blue", fill: "soft", size: 13, weight: 600 });
    const cx = g2 + bw + 40, cw = 150;
    const cy = y + (bh + 16) / 2;
    b += arrow(g2 + bw + 2, mid, cx - 4, cy + bh / 2 - 6, { tone: "muted" });
    b += arrow(g2 + bw + 2, y + bh + 16 + bh / 2, cx - 4, cy + bh / 2 + 6, { tone: "muted" });
    b += box(cx, cy, cw, bh, ["Combined score", "≥ threshold?"], { tone: "purple", fill: "soft", size: 13, weight: 600 });

    // outcomes
    const oy = y + 2 * bh + 70;
    const ansX = cx, ansW = cw;
    b += arrow(cx + cw / 2, cy + bh + 2, ansX + ansW / 2, oy - 4, { tone: "green" });
    b += text(cx + cw / 2 + 8, (cy + bh + oy) / 2, "yes", { size: 12, tone: "green" });
    b += box(ansX, oy, ansW, bh, ["Answer,", "with citations"], { tone: "green", fill: "soft", size: 13, weight: 600, textTone: "green" });

    const idkX = g2, idkW = bw;
    b += path(`M${cx},${cy + bh - 10} L${idkX + idkW + 30},${cy + bh - 10} L${idkX + idkW + 30},${oy + bh / 2} L${idkX + idkW + 4},${oy + bh / 2}`, { tone: "orange", arrow: true });
    b += text(idkX + idkW + 36, oy - 6, "no", { size: 12, tone: "orange" });
    b += box(idkX, oy, idkW, bh, ["“This isn't in", "the docs I have.”"], { tone: "orange", fill: "soft", size: 13, weight: 600, textTone: "orange" });

    const nfX = g1;
    b += arrow(g1 + bw / 2, y + bh + 2, nfX + bw / 2, oy - 4, { tone: "orange" });
    b += text(g1 + bw / 2 + 8, y + bh + 30, "no", { size: 12, tone: "orange" });
    b += box(nfX, oy, bw, bh, ["“I couldn't find", "anything on that.”"], { tone: "orange", fill: "soft", size: 13, weight: 600, textTone: "orange" });
    b += text(nfX + bw / 2, oy + bh + 18, "no model call needed", { size: 12, anchor: "middle", tone: "muted" });
    b += text(idkX + idkW / 2, oy + bh + 18, "on-topic text, but no answer", { size: 12, anchor: "middle", tone: "muted" });

    // side panel: the dial
    const px = cx + cw + 44, pw = 272, py = 0, ph = oy + bh + 24;
    b += rect(px, py, pw, ph, { tone: "grey", fill: "none", sw: 1 });
    b += text(px + 16, py + 24, "The threshold is a dial", { size: 14, weight: 700 });
    const ax = px + 44, ay = py + 50, aw = pw - 70, ah = 150;
    b += line(ax, ay, ax, ay + ah, { tone: "axis" });
    b += line(ax, ay + ah, ax + aw, ay + ah, { tone: "axis" });
    b += text(ax - 10, ay + ah / 2, "accuracy on answered", { size: 12, anchor: "middle", tone: "muted", rotate: -90 });
    b += text(ax + aw / 2, ay + ah + 20, "coverage (share answered) →", { size: 12, anchor: "middle", tone: "muted" });
    b += path(`M${ax + 8},${ay + 14} C${ax + aw * 0.45},${ay + 22} ${ax + aw * 0.7},${ay + 50} ${ax + aw - 6},${ay + ah - 30}`, { tone: "purple", sw: 2.2 });
    b += text(ax + 10, ay + 34, "strict", { size: 12, tone: "purple", weight: 600 });
    b += text(ax + aw - 34, ay + ah - 24, "loose", { size: 12, tone: "purple", weight: 600, anchor: "end" });
    b += text(px + 16, ay + ah + 46, "Strict: answers less, more of it right.", { size: 12.5 });
    b += text(px + 16, ay + ah + 66, "Loose: answers more, more of it wrong.", { size: 12.5 });
    b += text(px + 16, ay + ah + 90, "Illustrative shape, not data.", { size: 12, tone: "muted", italic: true });

    return svg(
      {
        width: px + pw + 24,
        height: ph + 6,
        title: "Three checks before the system answers",
        credit: "Our own diagram. Combined score after Joren et al. (2024); threshold calibration after Cohere's Rerank docs.",
        desc: checks.alt,
      },
      b,
    );
  },
};

export default [checks];
