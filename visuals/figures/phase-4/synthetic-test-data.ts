import { arrow, lines, rect, svg, text, wrap, type Figure, type Tone } from "../../lib/svg.ts";

// Dimensions -> tuples -> queries -> traces, with the recipe-app example.
// Every label and value is from sources/husain-shankar-synthetic-data.md
// (dimensions, 20 tuples by hand, separate prompt, the lasagna query, ~100 traces).
// "Inputs, not answers" is from sources/husain-field-guide.md.

const alt =
  "Synthetic test inputs in four steps, with the recipe-app example. 1: Dimensions, such as dietary restriction (vegan, gluten-free, none), cuisine (Italian, Asian, comfort food) and complexity (simple request, multi-step, edge case). 2: Tuples, one value per dimension, the first 20 by hand: (vegan, Italian, multi-step). 3: Queries, each tuple turned into natural language in a separate prompt: \"I need a dairy-free lasagna recipe that I can prep the day before.\" 4: Run every query through the full system and read the traces. The model writes only the inputs, never the expected answers.";

const pipeline: Figure = {
  slug: "pipeline",
  alt,
  render() {
    const bw = 200, gap = 24, x0 = 24, top = 8, bh = 236, headH = 40;
    const S: { n: string; head: string; tone: Tone }[] = [
      { n: "1", head: "Dimensions", tone: "blue" },
      { n: "2", head: "Tuples", tone: "purple" },
      { n: "3", head: "Queries", tone: "orange" },
      { n: "4", head: "Traces", tone: "green" },
    ];
    let b = "";
    const bx = (i: number) => x0 + i * (bw + gap);
    S.forEach((st, i) => {
      const x = bx(i);
      b += rect(x, top, bw, bh, { tone: st.tone, fill: "none", r: 10 });
      b += rect(x, top, bw, headH, { tone: st.tone, fill: "soft", r: 10 });
      b += rect(x + 0.75, top + headH - 10, bw - 1.5, 10, { tone: st.tone, fill: "soft", stroke: false, r: 0 });
      b += `<line x1="${x}" y1="${top + headH}" x2="${x + bw}" y2="${top + headH}" class="s-${st.tone}" stroke-width="1.5"/>`;
      b += text(x + 14, top + headH / 2, st.n, { size: 15, weight: 700, baseline: "middle", tone: st.tone });
      b += text(x + 32, top + headH / 2, st.head, { size: 14, weight: 700, baseline: "middle" });
      if (i < S.length - 1) b += arrow(x + bw + 4, top + bh / 2, x + bw + gap - 4, top + bh / 2, { tone: "muted", sw: 2 });
    });
    const y0 = top + headH + 22;

    // 1 dimensions
    const dims: [string, string][] = [
      ["Dietary restriction", "vegan · gluten-free · none"],
      ["Cuisine", "Italian · Asian · comfort food"],
      ["Complexity", "simple request · multi-step · edge case"],
    ];
    dims.forEach(([d, v], k) => {
      const y = y0 + k * 54;
      b += text(bx(0) + 14, y, d, { size: 13, weight: 600 });
      b += lines(bx(0) + 14, y + 18, wrap(v, bw - 26, 12), { size: 12, tone: "muted", gap: 15 });
    });

    // 2 tuples
    const tuples = ["(vegan, Italian, multi-step)", "(gluten-free, Asian, simple)", "…"];
    tuples.forEach((tp, k) => {
      const y = y0 + k * 32;
      if (tp !== "…") b += rect(bx(1) + 10, y - 10, bw - 20, 26, { tone: "purple", fill: "soft", r: 4, stroke: false });
      b += text(bx(1) + (tp === "…" ? bw / 2 : 18), y + 3, tp, { size: 12.5, baseline: "middle", anchor: tp === "…" ? "middle" : "start" });
    });
    b += lines(bx(1) + 14, y0 + 100, ["One value per dimension.", "Write the first 20 by", "hand, then let a model", "make more."], { size: 12.5, tone: "muted", gap: 17 });

    // 3 queries
    b += rect(bx(2) + 10, y0 - 10, bw - 20, 70, { tone: "orange", fill: "soft", r: 4, stroke: false });
    b += lines(bx(2) + 18, y0 + 6, wrap("“I need a dairy-free lasagna recipe that I can prep the day before.”", bw - 36, 12.5), { size: 12.5, italic: true, gap: 17 });
    b += lines(bx(2) + 14, y0 + 100, ["Each tuple becomes a", "message in a separate", "prompt, so they don’t", "all sound the same."], { size: 12.5, tone: "muted", gap: 17 });

    // 4 traces
    b += lines(bx(3) + 14, y0 + 4, ["Run every query through", "the full system. Read", "the traces: about 100", "is a good first pool for", "error analysis."], { size: 13, gap: 19 });
    b += lines(bx(3) + 14, y0 + 118, ["The model writes the", "inputs only, never the", "expected answers."], { size: 12.5, tone: "muted", gap: 17 });

    const W = x0 * 2 + 4 * bw + 3 * gap;
    return svg(
      { width: W, height: top + bh + 8, title: "Synthetic test inputs: plan the variety, then generate", credit: "Example from Husain and Shankar, AI Evals FAQ (2025).", desc: alt },
      b,
    );
  },
};

export default [pipeline];
