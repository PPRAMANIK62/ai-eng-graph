import { arrow, box, rect, text, svg, type Figure, type Tone } from "../../lib/svg.ts";

// The four moves (write, select, compress, isolate) come from sources/langchain-context-engineering.md.
// Examples and the 1,000–2,000 token sub-agent summary come from sources/anthropic-context-engineering.md.

const fourMoves: Figure = {
  slug: "four-moves",
  alt: "A context window in the middle, with four moves around it. Write: save notes, plans and memories outside the window. Select: pull in only the documents, tools and memories this step needs. Compress: summarize or trim old turns and tool results. Isolate: hand a subtask to a sub-agent with its own window, and take back only a short summary.",
  render() {
    let b = "";
    const W = 820;
    const cx = W / 2;
    // central window
    const WX = cx - 130, WY = 150, WW = 260, WH = 150;
    b += rect(WX, WY, WW, WH, { tone: "ink", fill: "none", r: 6, sw: 2 });
    b += text(cx, WY + 22, "context window, this call", { anchor: "middle", size: 13.5, weight: 700 });
    const parts: [string, Tone][] = [["instructions + tools", "purple"], ["retrieved text", "blue"], ["recent turns", "grey"], ["tool results", "orange"]];
    parts.forEach(([l, t], i) => (b += box(WX + 16, WY + 36 + i * 27, WW - 32, 22, l, { tone: t, size: 12.5, r: 3, sw: 1 })));

    const card = (x: number, y: number, w: number, tone: Tone, title: string, ls: string[]) => {
      let s = rect(x, y, w, 30 + ls.length * 19, { tone, r: 6, sw: 1.5 });
      s += text(x + 14, y + 20, title, { size: 15, weight: 700, tone, display: true });
      ls.forEach((l, i) => (s += text(x + 14, y + 42 + i * 19, l, { size: 13 })));
      return s;
    };

    // write (top left) and select (top right)
    b += card(24, 10, 300, "green", "Write", ["save notes, plans and memories", "outside the window, read them later"]);
    b += arrow(WX + 40, WY - 2, 200, 86, { tone: "green" });
    b += card(W - 324, 10, 300, "blue", "Select", ["pull in only the docs, tools and", "memories this step needs (RAG)"]);
    b += arrow(W - 200, 86, WX + WW - 40, WY - 4, { tone: "blue" });

    // compress (bottom left) and isolate (bottom right)
    const BY = WY + WH + 60;
    b += card(24, BY, 300, "orange", "Compress", ["summarize old turns (compaction),", "clear used tool results, trim"]);
    b += arrow(WX + 40, WY + WH + 2, 200, BY - 4, { tone: "orange" });
    b += card(W - 324, BY, 300, "purple", "Isolate", ["give a subtask to a sub-agent with", "its own window; take back a summary", "of often 1,000–2,000 tokens"]);
    b += arrow(WX + WW - 40, WY + WH + 2, W - 200, BY - 4, { tone: "purple" });
    b += arrow(W - 216, BY - 4, WX + WW - 60, WY + WH + 4, { tone: "purple", dash: true });

    return svg(
      {
        width: W,
        height: BY + 30 + 3 * 19 + 14,
        title: "Four moves decide what's in the window on each call",
        credit: "Framing from LangChain, \"Context Engineering\" (2025); examples from Anthropic, \"Effective context engineering for AI agents\" (2025).",
        desc: fourMoves.alt,
      },
      b,
    );
  },
};

export default [fourMoves];
