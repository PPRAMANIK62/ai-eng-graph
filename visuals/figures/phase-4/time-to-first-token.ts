import { scaleLog } from "d3-scale";
import { line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Nielsen's three response-time limits, 0.1 s, 1 s and 10 s
// (sources/nielsen-response-times.md), on a log time axis.

const alt =
  "A time axis on a log scale from 0.05 to 30 seconds with three limits marked. Under 0.1 second, the system feels instant. Under 1 second, the user's flow of thought stays unbroken, though the delay is noticed. Under 10 seconds, the user's attention stays on the task. Past 10 seconds, people turn to other tasks, so show progress. With streaming, the user's wait ends at the first token, so time to first token is the number to hold against these limits.";

const limits: Figure = {
  slug: "limits",
  alt,
  render() {
    const x0 = 40;
    const W = 820;
    const x = scaleLog().domain([0.05, 30]).range([x0, x0 + W]);
    const top = 30;
    const bh = 96;
    let b = "";
    const bands: { from: number; to: number; tone: Tone; head: string; sub: string }[] = [
      { from: 0.05, to: 0.1, tone: "green", head: "instant", sub: "" },
      { from: 0.1, to: 1, tone: "blue", head: "flow of thought kept", sub: "the delay is noticed" },
      { from: 1, to: 10, tone: "orange", head: "attention kept", sub: "flow of thought breaks" },
      { from: 10, to: 30, tone: "red", head: "users switch tasks", sub: "show progress" },
    ];
    for (const band of bands) {
      b += rect(x(band.from), top, x(band.to) - x(band.from), bh, { tone: band.tone, fill: "soft", stroke: false, r: 0 });
      const mid = (x(band.from) + x(band.to)) / 2;
      b += text(mid, top + 40, band.head, { anchor: "middle", size: 13.5, weight: 600, tone: band.tone });
      if (band.sub) b += text(mid, top + 60, band.sub, { anchor: "middle", size: 12.5, tone: "muted" });
    }
    for (const t of [0.1, 1, 10]) {
      b += line(x(t), top - 8, x(t), top + bh + 6, { tone: "ink", sw: 2 });
      b += text(x(t), top - 14, `${t} s`, { anchor: "middle", size: 14, weight: 700 });
    }
    const ay = top + bh + 6;
    b += line(x0, ay, x0 + W, ay, { tone: "axis" });
    for (const t of [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 30]) {
      b += line(x(t), ay, x(t), ay + 5, { tone: "axis" });
      b += text(x(t), ay + 19, `${t}`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(x0 + W / 2, ay + 40, "seconds until something happens (log scale)", { anchor: "middle", size: 12, tone: "muted" });
    b += text(x0, ay + 70, "With streaming, the wait ends at the first token. That is the number to hold against these limits.", { size: 13 });
    return svg(
      {
        width: x0 * 2 + W,
        height: ay + 82,
        title: "How long a wait people notice, and when they switch tasks",
        credit: "Limits from Jakob Nielsen, “Response Times: The 3 Important Limits” (1993, updated 2014). Not LLM-specific.",
        desc: alt,
      },
      b,
    );
  },
};

export default [limits];
