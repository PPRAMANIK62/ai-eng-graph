import { line, rect, text, svg, type Figure } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// Figure: an answer as text blocks, two of them pointing into the document.
// Redrawn from the response example in sources/anthropic-citations.md:
// "the grass is green" -> chars 0–20 "The grass is green.";
// "the sky is blue" -> chars 20–36 "The sky is blue.", document_index 0.

const BLOCKS = [
  { t: "“According to the document, ”", cite: null },
  { t: "“the grass is green”", cite: { range: "chars 0–20", text: "“The grass is green.”" } },
  { t: "“ and ”", cite: null },
  { t: "“the sky is blue”", cite: { range: "chars 20–36", text: "“The sky is blue.”" } },
] as const;

const pointers: Figure = {
  slug: "pointers",
  alt: "An answer made of four text blocks: two plain connecting blocks and two cited claims. The claim “the grass is green” points to characters 0 to 20 of the document, the sentence “The grass is green.” The claim “the sky is blue” points to characters 20 to 36, “The sky is blue.” Each citation carries the document index, the character range and the cited text.",
  render() {
    const ax = 24, aw = 300, bh = 44, bg = 14, dx = 560, dw = 330;
    let body = "";
    body += text(ax, 12, "The answer comes back as text blocks", { size: 12.5, weight: 600, tone: "muted" });
    body += text(dx, 12, "Document 0 (plain text), split into sentences", { size: 12.5, weight: 600, tone: "muted" });

    // document: two sentence chunks
    const docTop = 40, sh = 74;
    const sentY: number[] = [];
    body += rect(dx - 10, docTop - 12, dw + 20, sh * 2 + 36, { tone: "grey", fill: "none", sw: 1 });
    ["The grass is green.", "The sky is blue."].forEach((s, i) => {
      const y = docTop + i * (sh + 12);
      sentY.push(y + sh / 2);
      body += rect(dx, y, dw, sh, { tone: "blue", fill: "soft" });
      body += text(dx + 16, y + 28, s, { size: 15, weight: 600 });
      body += text(dx + 16, y + 52, i === 0 ? "characters 0 to 20" : "characters 20 to 36", { size: 12.5, tone: "muted", mono: true });
    });

    let citeIdx = 0;
    BLOCKS.forEach((b, i) => {
      const y = 28 + i * (bh + bg), mid = y + bh / 2;
      if (b.cite) {
        body += rect(ax, y, aw, bh, { tone: "green", fill: "soft" });
        body += text(ax + 14, mid, b.t, { size: 14, weight: 600, baseline: "middle" });
        const target = sentY[citeIdx];
        body += line(ax + aw, mid, dx - 12, target, { tone: "green", sw: 1.6, arrow: true });
        const lx = ax + aw + 14, ly = (mid + target) / 2 + -22;
        body += text(lx, ly, `doc 0 · ${b.cite.range}`, { size: 12, tone: "green", mono: true });
        citeIdx++;
      } else {
        body += rect(ax, y, aw, bh, { tone: "grey", fill: "none", dash: true, sw: 1 });
        body += text(ax + 14, mid, b.t, { size: 14, tone: "muted", baseline: "middle" });
        body += text(ax + aw - 12, mid, "no citation", { size: 12, tone: "muted", anchor: "end", baseline: "middle" });
      }
    });
    const by = 28 + 4 * (bh + bg) + 8;
    body += text(ax, by, "Join the blocks: “According to the document, the grass is green and the sky is blue.”", { size: 13.5 });
    body += text(ax, by + 22, "Each citation also carries the cited text itself, copied out by the API, not written by the model.", { size: 13, tone: "muted" });
    return svg(
      {
        width: dx + dw + 34,
        height: by + 34,
        title: "A citation is a pointer from a claim to a place in your document",
        credit: "Redrawn from the response example in Anthropic's Citations docs (checked 2026-09-27).",
        desc: pointers.alt,
      },
      body,
    );
  },
};

export default [pointers];
