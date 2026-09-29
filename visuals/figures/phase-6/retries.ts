import { arrow, box, line, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Top row: an illustrative LLM stack (our own example, 3 at each layer). SDKs retrying on
// their own and nested loops multiplying requests: sources/openai-rate-limits.md.
// Bottom row: the five-layer, three-tries example (243x) from
// sources/brooker-timeouts-retries-backoff.md; retry at one layer: also
// sources/google-sre-handling-overload.md.
function row(y: number, steps: { label: string[]; n: string; tone: Tone }[], w: number, gap: number) {
  let b = "";
  let x = 20;
  steps.forEach((s, i) => {
    b += box(x, y, w, 50, s.label, { tone: s.tone, size: 12.5 });
    b += text(x + w / 2, y + 72, s.n, { anchor: "middle", size: 13, weight: 700, tone: s.tone });
    if (i < steps.length - 1) b += arrow(x + w + 3, y + 25, x + w + gap - 3, y + 25, { tone: "muted" });
    x += w + gap;
  });
  return b;
}

const stacking: Figure = {
  slug: "stacking",
  alt: "How retries stack in an LLM app. One user question goes through your own retry loop of 3 attempts; each attempt goes through the SDK, which retries 3 times; each SDK call reaches a gateway that tries 3 models: 3 × 3 × 3 = 27 calls to model providers for one question. Below, Amazon's example: five layers of services, each retrying 3 times, send 243 times the load to the database at the bottom. The fix in both cases is to retry at one layer and turn the others off.",
  render() {
    let b = "";
    b += text(20, 16, "An LLM app with retries at three layers (example: 3 tries each)", { size: 13.5, weight: 600 });
    b += row(
      34,
      [
        { label: ["one user", "question"], n: "1", tone: "grey" },
        { label: ["your retry loop", "3 attempts"], n: "1", tone: "blue" },
        { label: ["SDK retries", "3 attempts each"], n: "3", tone: "blue" },
        { label: ["gateway", "tries 3 models"], n: "9", tone: "purple" },
        { label: ["model", "providers"], n: "27 calls", tone: "red" },
      ],
      140,
      42,
    );
    const y2 = 160;
    b += line(20, y2 - 16, 900, y2 - 16, { tone: "grid", sw: 1 });
    b += text(20, y2 + 4, "Amazon's example: five layers, each retrying 3 times, in front of a failing database", { size: 13.5, weight: 600 });
    b += row(
      y2 + 22,
      [
        { label: ["layer 1"], n: "1", tone: "grey" },
        { label: ["layer 2"], n: "3", tone: "grey" },
        { label: ["layer 3"], n: "9", tone: "grey" },
        { label: ["layer 4"], n: "27", tone: "grey" },
        { label: ["layer 5"], n: "81", tone: "orange" },
        { label: ["database"], n: "243× load", tone: "red" },
      ],
      110,
      40,
    );
    b += text(20, y2 + 128, "Numbers: requests arriving at each box for one original request. Fix: retry at one layer, turn the others off.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: 920,
        height: y2 + 140,
        title: "Retries at several layers multiply",
        credit: "Bottom row from Marc Brooker, “Timeouts, retries, and backoff with jitter” (Amazon, 2019). Top row is an illustration.",
        desc: stacking.alt,
      },
      b,
    );
  },
};

export default [stacking];
