import { arrow, box, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Our own worked example (the support reply and its checks are illustrative).
// The kinds of check come from sources/anthropic-develop-tests.md (exact match
// after normalizing, string match) and sources/yan-year-of-building-llms.md
// (include/exclude phrases, counts in a range).
const CHECKS: { name: string; code: string; pass: boolean }[] = [
  { name: "Tag is the expected label", code: 'tag.strip().lower() == "billing"', pass: true },
  { name: "Mentions the refund policy", code: '"refund policy" in reply', pass: true },
  { name: "No internal ticket IDs", code: 'not re.search(r"TCK-\\d+", reply)', pass: false },
  { name: "Two to six sentences", code: "2 <= count_sentences(reply) <= 6", pass: true },
  { name: "Valid JSON, right fields", code: "json.loads(out) has tag, reply", pass: true },
];

const figure: Figure = {
  slug: "checks",
  alt: 'One support reply going through five code checks. The output: tag "billing" and a four-sentence reply that mentions the refund policy but also contains the internal ID TCK-88213. Checks: tag equals the expected label, pass. Contains "refund policy", pass. Contains no internal ID, fail. Two to six sentences, pass. Valid JSON with the right fields, pass. Each check is a few lines of code, returns pass or fail, and gives the same answer every time.',
  render() {
    let b = "";
    // Output card on the left
    const L = 20;
    b += text(L, 8, "The output", { size: 14, weight: 700, tone: "blue" });
    b += rect(L, 22, 270, 214, { tone: "grey", fill: "soft" });
    const out = [
      "{",
      '  "tag": "billing",',
      '  "reply": "Sorry about the double',
      "   charge. Under our refund policy",
      "   you'll get the money back in 5",
      "   days. Your case is TCK-88213.",
      "   Anything else I can help with?\"",
      "}",
    ];
    out.forEach((l, i) => {
      b += text(L + 12, 46 + i * 23, l, { size: 12.5, mono: true, tone: l.includes("TCK") ? "red" : "ink" });
    });

    // Checks on the right
    const X = 340;
    b += text(X, 8, "Five checks, each a few lines of code", { size: 14, weight: 700 });
    const rowH = 44;
    CHECKS.forEach((c, i) => {
      const y = 22 + i * rowH;
      const tone: Tone = c.pass ? "green" : "red";
      b += arrow(L + 272, 129, X - 4, y + 18, { tone: "grid", sw: 1 });
      b += rect(X, y, 420, rowH - 8, { tone: "grey", fill: "none", sw: 1 });
      b += text(X + 12, y + 14, c.name, { size: 13, weight: 600 });
      b += text(X + 12, y + 29, c.code, { size: 11.5, mono: true, tone: "muted" });
      b += box(X + 430, y + 4, 64, rowH - 16, c.pass ? "pass" : "fail", { tone, fill: "soft", size: 13, weight: 700, textTone: tone });
    });
    b += text(X, 22 + CHECKS.length * rowH + 14, "Same input, same verdict, every run. One failure is enough to fail the case.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: 870,
        height: 22 + CHECKS.length * rowH + 26,
        title: "Code checks on one output: fast, cheap, and the same every time",
        credit: "Illustrative example. Kinds of check from Anthropic's eval docs and Yan et al. (2024).",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
