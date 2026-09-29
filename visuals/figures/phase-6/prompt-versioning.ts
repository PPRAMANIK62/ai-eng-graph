import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// sources/langfuse-prompt-version-control.md: automatic versions, `production`
// and `latest` labels as pointers, default fetch by `production`, rollback by
// moving the label. Version numbers are our example.
const labels: Figure = {
  slug: "labels",
  alt: "Prompt versions 5, 6 and 7 in a row. The latest label points at version 7. The production label first points at version 6, moves to version 7 to ship it, and moves back to version 6 to roll back. Code asks for the prompt by label, so none of these moves needs a deploy.",
  render() {
    let b = "";
    const stages: { title: string; prod: number; tone: Tone }[] = [
      { title: "1. save version 7", prod: 6, tone: "grey" },
      { title: "2. ship: move production to v7", prod: 7, tone: "green" },
      { title: "3. roll back: move it to v6", prod: 6, tone: "orange" },
    ];
    const colW = 290;
    stages.forEach((s, i) => {
      const x = 20 + i * colW;
      if (i) b += line(x - 18, 0, x - 18, 190, { tone: "grid", sw: 1 });
      b += text(x, 10, s.title, { size: 13.5, weight: 700, tone: s.tone === "grey" ? "ink" : s.tone });
      [5, 6, 7].forEach((v, j) => {
        const vx = x + j * 84;
        b += box(vx, 110, 70, 40, `v${v}`, { tone: v === s.prod ? "blue" : "grey", size: 14, weight: v === s.prod ? 700 : 400 });
      });
      // production label
      const px = x + (s.prod - 5) * 84;
      b += rect(px - 5, 40, 80, 26, { tone: "blue", fill: "soft", r: 13 });
      b += text(px + 35, 53, "production", { size: 12.5, anchor: "middle", baseline: "middle", weight: 700, tone: "blue" });
      b += arrow(px + 35, 68, px + 35, 106, { tone: "blue" });
      // latest label under v7
      const lx = x + 2 * 84;
      b += arrow(lx + 35, 186, lx + 35, 154, { tone: "muted" });
      b += text(lx + 35, 200, "latest", { size: 12.5, anchor: "middle", tone: "muted", weight: 600 });
    });
    b += text(20, 236, "Your code asks for the prompt labelled production, so moving the label changes what runs, with no deploy.", { size: 12.5 });
    return svg(
      {
        width: 20 + 3 * colW,
        height: 250,
        title: "Labels point at versions; shipping and rollback move the label",
        credit: "Based on Langfuse's prompt version control docs. Version numbers are our example.",
        desc: labels.alt,
      },
      b,
    );
  },
};

export default [labels];
