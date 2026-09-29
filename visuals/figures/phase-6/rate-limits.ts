import { arrow, box, line, path, rect, svg, text, type Figure } from "../../lib/svg.ts";

// sources/anthropic-rate-limits.md: token bucket ("continuously replenished ... rather than
// being reset at fixed intervals"), 60 RPM may be enforced as 1 request per second, 429 with
// retry-after, spend-cap 429 without retry-after (enforced_spend_limit_reached).
const bucket: Figure = {
  slug: "bucket",
  alt: "A token bucket for a limit of 60 requests per minute. The bucket holds up to the limit and refills continuously at about one per second. A burst of requests drains it, and requests arriving while it's empty get a 429 with a retry-after header saying how long to wait. Below, a second kind of 429: the monthly spend cap. It has no retry-after header, and retrying fails until the next month or a higher tier.",
  render() {
    let b = "";
    // refill
    b += box(20, 20, 170, 46, ["refills continuously", "about 1 per second"], { tone: "green", size: 12.5 });
    b += arrow(190, 43, 258, 70, { tone: "green" });
    // bucket
    const bx = 260, by = 50, bw = 150, bh = 150;
    b += path(`M${bx},${by} L${bx + 12},${by + bh} L${bx + bw - 12},${by + bh} L${bx + bw},${by}`, { tone: "blue", sw: 2.5 });
    b += rect(bx + 16, by + bh - 40, bw - 32, 36, { tone: "blue", fill: "soft", stroke: false, r: 2 });
    b += text(bx + bw / 2, by + bh - 22, "a little left", { anchor: "middle", baseline: "middle", size: 12.5, tone: "blue" });
    b += line(bx - 6, by + 6, bx + bw + 6, by + 6, { tone: "grid", sw: 1, dash: true });
    b += text(bx + bw / 2, by + 26, "holds up to the limit", { anchor: "middle", size: 12.5, tone: "muted" });
    b += text(bx + bw / 2, by + bh + 22, "limit: 60 requests per minute", { anchor: "middle", size: 12.5, weight: 600 });
    // burst in
    b += box(20, 120, 170, 46, ["a burst of requests", "in the same second"], { tone: "grey", size: 12.5 });
    b += arrow(190, 143, 268, 160, { tone: "muted" });
    // outcomes
    b += arrow(bx + bw, by + bh - 60, 488, 70, { tone: "green" });
    b += box(490, 46, 250, 46, ["while there's capacity:", "the request goes through"], { tone: "green", size: 12.5 });
    b += arrow(bx + bw, by + bh - 30, 488, 160, { tone: "red" });
    b += box(490, 136, 250, 58, ["once it's empty: HTTP 429", "with retry-after: seconds to wait"], { tone: "red", size: 12.5 });

    // spend cap
    const y = 250;
    b += line(20, y - 14, 760, y - 14, { tone: "grid", sw: 1 });
    b += text(20, y + 6, "A 429 that isn't a rate limit", { size: 13.5, weight: 600 });
    b += box(20, y + 22, 250, 46, ["monthly spend cap reached", "enforced_spend_limit_reached"], { tone: "orange", size: 12.5 });
    b += arrow(270, y + 45, 298, y + 45, { tone: "muted" });
    b += box(300, y + 22, 440, 46, ["no retry-after header: retrying fails until", "the next month or a higher tier"], { tone: "orange", fill: "none", size: 12.5 });
    return svg(
      {
        width: 780,
        height: y + 80,
        title: "Rate limits refill continuously; bursts drain them",
        credit: "Mechanism from Anthropic's rate limits docs (2026). Illustrative bucket, not measured data.",
        desc: bucket.alt,
      },
      b,
    );
  },
};

export default [bucket];
