import { scaleLinear, scaleLog } from "d3-scale";
import { series, xAxis, yAxis } from "../../lib/chart.ts";
import { circle, svg, text, type Figure } from "../../lib/svg.ts";

// Fan-out: share of user requests that wait on at least one slow call, 1 - (1 - p)^n.
// The two marked points are from sources/dean-barroso-tail-at-scale.md: p = 1/100 at
// n = 100 gives 63%; p = 1/10,000 at n = 2,000 gives "almost one in five" (18%).
// The curves themselves are that formula, computed here.

const alt =
  "A chart of how often a user request hits at least one slow call, against how many calls it waits on, from 1 to 2,000 on a log scale. Two curves: calls that are slow 1 time in 100, and 1 time in 10,000. With 1 in 100, one call is slow 1% of the time, 10 calls about 10%, and 100 calls 63%. With 1 in 10,000, 2,000 calls are slow almost one time in five.";

const fanout: Figure = {
  slug: "fan-out",
  alt,
  render() {
    const p = { x: 80, y: 20, w: 700, h: 300 };
    const x = scaleLog().domain([1, 2000]).range([p.x, p.x + p.w]);
    const y = scaleLinear().domain([0, 1]).range([p.y + p.h, p.y]);
    const share = (rate: number, n: number) => 1 - Math.pow(1 - rate, n);
    const ns = Array.from({ length: 80 }, (_, i) => Math.pow(2000, i / 79));
    let b = yAxis(p, y, [0, 0.25, 0.5, 0.75, 1], (t) => `${Math.round(t * 100)}%`, "requests that hit a slow call");
    b += xAxis(p, x, [1, 10, 100, 1000, 2000], (t) => t.toLocaleString("en-US"), "calls each user request waits on (log scale)");
    b += series(ns.map((n) => [x(n), y(share(0.01, n))]), { tone: "red" });
    b += series(ns.map((n) => [x(n), y(share(0.0001, n))]), { tone: "blue" });

    b += circle(x(100), y(share(0.01, 100)), 6, { tone: "red" });
    b += text(x(100) - 12, y(share(0.01, 100)) - 6, "100 calls: 63%", { anchor: "end", size: 13, weight: 700, tone: "red" });
    b += circle(x(2000), y(share(0.0001, 2000)), 6, { tone: "blue" });
    b += text(x(2000) - 12, y(share(0.0001, 2000)) - 14, "2,000 calls: almost 1 in 5", { anchor: "end", size: 13, weight: 700, tone: "blue" });

    b += text(x(400), y(0.93), "each call slow 1 time in 100", { anchor: "middle", size: 13, weight: 600, tone: "red" });
    b += text(x(60), y(0.03) - 10, "each call slow 1 time in 10,000", { anchor: "middle", size: 13, weight: 600, tone: "blue" });

    return frame(b, p);
  },
};

function frame(b: string, p: { x: number; y: number; w: number; h: number }) {
  return svg(
    {
      width: p.x + p.w + 40,
      height: p.y + p.h + 52,
      title: "One slow call in a hundred becomes most requests when you wait on many",
      credit: "Adapted from Dean and Barroso, “The Tail at Scale” (2013). Curves are 1 − (1 − rate)^calls.",
      desc: alt,
    },
    b,
  );
}

export default [fanout];
