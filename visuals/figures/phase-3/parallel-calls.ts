import { arrow, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Illustrative timelines only: no measured durations exist in the sources (see the
// "Gaps" note for parallel-calls). Mechanism from sources/openai-latency-optimization.md
// (Parallelize: split independent steps; speculative execution) and
// sources/anthropic-building-effective-agents.md (sectioning).
const timelines: Figure = {
  slug: "timelines",
  alt: "Three timelines, illustrative and not measured. Sequential: step A, then step B, total time is A plus B. Parallel: A and B start together, total time is the longer of the two. Speculative: A (a quick check) and B start together; if A comes back as expected, B's result is used; if not, B is cancelled and retried.",
  render() {
    const L = 220; // lane start
    const U = 6; // px per time unit
    const A = 30; // units
    const B = 60;
    const rowH = 108;
    let b = "";
    const bar = (x: number, y: number, units: number, label: string, tone: Tone, dash = false) =>
      rect(x, y, units * U, 26, { tone, fill: dash ? "none" : "soft", dash }) +
      text(x + (units * U) / 2, y + 13, label, { anchor: "middle", baseline: "middle", size: 12.5, weight: 600, tone });
    const lane = (i: number, title: string, sub: string) => {
      const y = i * rowH;
      b += text(20, y + 30, title, { size: 14, weight: 700 });
      b += text(20, y + 48, sub, { size: 12, tone: "muted" });
      return y;
    };
    // Sequential
    let y = lane(0, "Sequential", "B waits for A");
    b += bar(L, y + 10, A, "A", "blue");
    b += bar(L + A * U, y + 44, B, "B", "orange");
    b += arrow(L, y + 82, L + (A + B) * U, y + 82, { tone: "muted", arrowStart: true });
    b += text(L + (A + B) * U + 10, y + 82, "total = A + B", { baseline: "middle", size: 12.5, tone: "muted" });
    // Parallel
    y = lane(1, "Parallel", "independent steps overlap");
    b += bar(L, y + 10, A, "A", "blue");
    b += bar(L, y + 44, B, "B", "orange");
    b += arrow(L, y + 82, L + B * U, y + 82, { tone: "green", arrowStart: true });
    b += text(L + B * U + 10, y + 82, "total = the slower one", { baseline: "middle", size: 12.5, tone: "green" });
    // Speculative
    y = lane(2, "Speculative", "start B before A says yes");
    b += bar(L, y + 10, A, "A: check", "blue");
    b += bar(L, y + 44, B, "B", "orange");
    b += text(L + A * U + 10, y + 23, "A passes: keep B. A fails: cancel B and retry.", { baseline: "middle", size: 12, tone: "muted" });
    b += arrow(L, y + 82, L + B * U, y + 82, { tone: "green", arrowStart: true });
    b += text(L + B * U + 10, y + 82, "A's wait is hidden", { baseline: "middle", size: 12.5, tone: "green" });
    b += text(20, 3 * rowH + 14, "Illustrative shape, not measured: none of our sources publish latency numbers for parallel LLM calls.", {
      size: 12,
      italic: true,
      tone: "muted",
    });
    return svg(
      {
        width: L + (A + B) * U + 130,
        height: 3 * rowH + 22,
        title: "Parallel calls: you wait for the slowest, not the sum",
        credit: "Mechanism from OpenAI's latency guide (parallelize, speculative execution).",
        desc: timelines.alt,
      },
      b,
    );
  },
};

export default [timelines];
