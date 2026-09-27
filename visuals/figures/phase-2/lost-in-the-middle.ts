import { series } from "../../lib/chart.ts";
import { line, path, rect, text, svg, type Figure } from "../../lib/svg.ts";

// The U shape is illustrative, not data. The only number, closed-book accuracy of 56.1% for
// GPT-3.5-Turbo, and the fact that the worst case falls below it, come from
// sources/liu-lost-in-the-middle.md (Section 2.3). The line's height is placed by eye.

const uCurve: Figure = {
  slug: "u-curve",
  alt: "An illustrative U-shaped curve of accuracy against the position of the answer passage, from first to twentieth. Accuracy is highest at position 1, dips to its lowest in the middle positions, and rises again at the last position. A dashed horizontal line marks closed-book accuracy, 56.1% for GPT-3.5-Turbo with no passages at all; the bottom of the U falls below it. The shape is illustrative, not data.",
  render() {
    const p = { x: 80, y: 20, w: 620, h: 250 };
    let b = "";
    b += line(p.x, p.y, p.x, p.y + p.h, { tone: "axis" });
    b += line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, { tone: "axis" });
    b += path(`M${p.x - 5},${p.y + 8} L${p.x},${p.y} L${p.x + 5},${p.y + 8}`, { tone: "grey" });
    b += text(p.x - 22, p.y + p.h / 2, "accuracy", { anchor: "middle", size: 13, tone: "muted", rotate: -90 });
    b += text(p.x - 8, p.y + 12, "high", { anchor: "end", size: 12, tone: "muted" });
    b += text(p.x - 8, p.y + p.h - 4, "low", { anchor: "end", size: 12, tone: "muted" });

    const X = (pos: number) => p.x + 30 + ((pos - 1) / 19) * (p.w - 60);
    const Y = (f: number) => p.y + p.h - f * p.h;
    // x ticks: answer position
    for (const pos of [1, 5, 10, 15, 20]) {
      b += line(X(pos), p.y + p.h, X(pos), p.y + p.h + 5, { tone: "axis" });
      b += text(X(pos), p.y + p.h + 20, pos === 1 ? "1st" : pos === 20 ? "20th" : `${pos}th`, { anchor: "middle", size: 12.5, tone: "muted" });
    }
    b += text(p.x + p.w / 2, p.y + p.h + 42, "where the answer passage sits among 20 passages", { anchor: "middle", size: 13, tone: "muted" });

    // illustrative U
    const shape = (pos: number) => {
      const t = (pos - 1) / 19; // 0..1
      const d = (t - 0.52) / 0.52; // dip a little past the middle
      return 0.3 + 0.5 * d * d;
    };
    const pts: [number, number][] = [];
    for (let pos = 1; pos <= 20; pos++) pts.push([X(pos), Y(shape(pos))]);
    b += series(pts, { tone: "blue", sw: 3 });

    // closed-book reference line
    const cb = Y(0.42);
    b += line(p.x, cb, p.x + p.w, cb, { tone: "red", dash: true, sw: 2 });
    b += line(p.x + 20, Y(0.08), p.x + 56, Y(0.08), { tone: "red", dash: true, sw: 2 });
    b += text(p.x + 64, Y(0.08), "GPT-3.5-Turbo with no passages at all (closed book): 56.1%", { baseline: "middle", size: 13, tone: "red", weight: 600 });

    b += text(X(1) + 8, Y(shape(1)) - 12, "answer first: high", { size: 13, weight: 600, tone: "blue" });
    b += text(X(20) - 4, Y(shape(20)) - 14, "answer last: high", { anchor: "end", size: 13, weight: 600, tone: "blue" });
    b += text(X(11), Y(shape(11)) + 24, "middle: worst, below closed book", { anchor: "middle", size: 13, weight: 600, tone: "blue" });

    b += rect(p.x + 250, p.y - 6, 250, 28, { tone: "grey", fill: "none", dash: true, r: 4, sw: 1.2 });
    b += text(p.x + 375, p.y + 8, "Illustrative shape, not data", { anchor: "middle", baseline: "middle", size: 13, tone: "muted", italic: true });

    return svg(
      {
        width: p.x + p.w + 30,
        height: p.y + p.h + 52,
        title: "Accuracy is highest when the answer is first or last",
        credit: "Adapted in spirit from Liu et al., \"Lost in the Middle\" (TACL 2024), GPT-3.5-Turbo, 2023. Shape redrawn, not their data.",
        desc: uCurve.alt,
      },
      b,
    );
  },
};

export default [uCurve];
