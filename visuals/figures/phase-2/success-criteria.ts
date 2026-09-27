import { lines, rect, svg, text, type Figure } from "../../lib/svg.ts";

// Every line is from the sentiment-analysis example in
// sources/anthropic-develop-tests.md ("Example task fidelity criteria" and
// "Example multidimensional criteria"). Redrawn as a before/after card.

const card: Figure = {
  slug: "before-after",
  alt: 'A before and after card for a sentiment classifier. Before: "The model should classify sentiments well." After, on a held-out set of 10,000 diverse posts: F1 of at least 0.85, 99.5% of outputs non-toxic, 90% of errors an inconvenience rather than an egregious error, and 95% of responses in under 200 ms. A note says you\'d still have to define "inconvenience" and "egregious".',
  render() {
    const top = 8, x0 = 24, lw = 250, gap = 28, rw = 500, h = 250;
    const rx = x0 + lw + gap;
    let b = "";

    // before
    b += rect(x0, top, lw, h, { tone: "red", fill: "soft", r: 10 });
    b += text(x0 + 18, top + 30, "Before", { size: 15, weight: 700, tone: "red" });
    b += text(x0 + 18, top + 52, "can't be tested", { size: 13, tone: "muted" });
    b += lines(x0 + 18, top + 98, ["“The model should", "classify sentiments", "well.”"], { size: 16, italic: true, gap: 24 });

    // after
    b += rect(rx, top, rw, h, { tone: "green", fill: "soft", r: 10 });
    b += text(rx + 18, top + 30, "After", { size: 15, weight: 700, tone: "green" });
    b += text(rx + 18, top + 52, "on a held-out set of 10,000 diverse posts:", { size: 13, tone: "muted" });
    const rows: [string, string][] = [
      ["F1 of at least 0.85", "task fidelity"],
      ["99.5% of outputs non-toxic", "toxicity"],
      ["90% of errors: inconvenience, not egregious*", "error severity"],
      ["95% of responses < 200 ms", "latency"],
    ];
    rows.forEach(([c, dim], i) => {
      const y = top + 90 + i * 34;
      b += text(rx + 18, y, "✓", { size: 14, weight: 700, tone: "green" });
      b += text(rx + 38, y, c, { size: 14 });
      b += text(rx + rw - 18, y, dim, { size: 12.5, tone: "muted", anchor: "end" });
    });
    b += lines(rx + 18, top + h - 34, ["* you'd still have to define what “inconvenience”", "and “egregious” mean for your product"], { size: 12.5, tone: "muted", gap: 17 });

    return svg(
      {
        width: rx + rw + 24,
        height: top + h + 8,
        title: "A criterion you can test has a number, a test set and several dimensions",
        credit: "Adapted from Anthropic's “Define success criteria and build evaluations” docs.",
        desc: card.alt,
      },
      b,
    );
  },
};

export default [card];
