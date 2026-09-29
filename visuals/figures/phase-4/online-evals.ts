import { arrow, box, lines, path, rect, svg, text, type Figure } from "../../lib/svg.ts";

// Guardrails inline vs evaluators afterwards on sampled logs.
// Guardrail facts (inline, few ms, regex/blocklist/schema/classifier, block/redact/regenerate):
// sources/husain-shankar-guardrails-vs-evaluators.md. Evaluators run after, async, never block,
// feed dashboards and regression tests: same note. Sampling live traces, reference-free judges,
// new failures into the CI set: sources/husain-shankar-ci-vs-production.md.

const alt =
  "Where online evaluators sit compared with guardrails. A user's request goes through an input guardrail, the model, and an output guardrail, then the reply reaches the user. Guardrails are inline: fast rule-based checks taking a few milliseconds that can block, redact or regenerate. Every trace is logged. A sample of the logs goes to evaluators such as LLM judges, which run afterwards in the background and never block the reply. Their scores feed a dashboard, and new failure patterns are added to the test set you run before shipping.";

const fig: Figure = {
  slug: "inline-vs-after",
  alt,
  render() {
    let b = "";
    const y1 = 40, h = 52;
    // inline lane
    b += rect(12, 4, 876, 128, { tone: "red", fill: "soft", r: 12, stroke: false, opacity: 0.55 });
    b += text(28, 24, "Inline, in the request path (the user waits)", { size: 13, weight: 700, tone: "red" });
    const xs = [28, 168, 338, 478, 668];
    const ws = [110, 140, 110, 160, 110];
    const labels: (string | string[])[] = ["User", ["Input", "guardrail"], "Model", ["Output", "guardrail"], "Reply"];
    const tones = ["grey", "red", "purple", "red", "grey"] as const;
    xs.forEach((x, i) => {
      b += box(x, y1, ws[i], h, labels[i], { tone: tones[i], fill: "soft", sw: i === 1 || i === 3 ? 2.5 : 1.5, size: 13.5, weight: 600, r: 8 });
      if (i < xs.length - 1) b += arrow(x + ws[i] + 4, y1 + h / 2, xs[i + 1] - 4, y1 + h / 2, { tone: "muted", sw: 2 });
    });
    b += lines(28, y1 + h + 22, ["Guardrails: a few ms. Regex, blocklist, schema check, small classifier. Can block, redact or regenerate."], { size: 12.5, tone: "muted" });

    // after lane
    const y2 = 170;
    b += rect(12, y2 - 20, 876, 186, { tone: "blue", fill: "soft", r: 12, stroke: false, opacity: 0.55 });
    b += text(240, y2, "Afterwards, in the background (the user doesn't wait)", { size: 13, weight: 700, tone: "blue" });
    const ly = y2 + 22;
    b += box(28, ly, 130, h, ["Logged", "traces"], { tone: "grey", fill: "soft", size: 13.5, weight: 600, r: 8 });
    b += box(218, ly, 130, h, ["A sample"], { tone: "grey", fill: "soft", size: 13.5, weight: 600, r: 8 });
    b += box(408, ly, 170, h, ["Evaluators", "(e.g. LLM judges)"], { tone: "blue", fill: "soft", size: 13.5, weight: 600, r: 8 });
    b += arrow(162, ly + h / 2, 214, ly + h / 2, { tone: "muted", sw: 2 });
    b += arrow(352, ly + h / 2, 404, ly + h / 2, { tone: "muted", sw: 2 });
    b += box(668, ly - 6, 190, 40, "Dashboard, rates", { tone: "green", fill: "soft", size: 13, r: 8 });
    b += box(668, ly + 44, 190, 40, "New cases for the test set", { tone: "green", fill: "soft", size: 13, r: 8 });
    b += arrow(582, ly + 18, 664, ly + 14, { tone: "muted", sw: 2 });
    b += arrow(582, ly + 34, 664, ly + 62, { tone: "muted", sw: 2 });
    b += lines(28, ly + h + 42, ["Evaluators: slower and heavier, no reference answer needed. They never block the reply,", "so users see a failure before you do."], { size: 12.5, tone: "muted", gap: 17 });

    // log arrow from reply to logged traces
    b += arrow(93, 124, 93, ly - 4, { tone: "muted", sw: 1.5, dash: true });
    b += text(104, 142, "every call is logged", { size: 12, tone: "muted", italic: true });

    return svg({ width: 900, height: y2 + 172, title: "Guardrails act now; online evaluators measure afterwards", desc: alt }, b);
  },
};

export default [fig];
