import { barsH } from "../../lib/chart.ts";
import { arrow, box, measure, path, rect, svg, text, type Figure } from "../../lib/svg.ts";

// GPT-2 example from nodes/phase-1/next-token-prediction.md, checked against
// sources/wolfram-what-is-chatgpt-doing.md (learn 4.5%, predict 3.5%, make 3.2%,
// understand 3.1%, do 2.9%). The 82.8% "everything else" is 100 minus their sum.
const PROMPT = ["The", "best", "thing", "about", "AI", "is", "its", "ability", "to"];
const PROBS = [
  { label: "learn", value: 4.5 },
  { label: "predict", value: 3.5 },
  { label: "make", value: 3.2 },
  { label: "understand", value: 3.1 },
  { label: "do", value: 2.9 },
];
const PICK = "learn";

const figure: Figure = {
  slug: "loop",
  alt: "The generation loop. The text so far, The best thing about AI is its ability to, goes into the model. The model gives a probability to every token in the vocabulary: learn 4.5%, predict 3.5%, make 3.2%, understand 3.1%, do 2.9%. One token, learn, is picked and appended to the text, and the longer text goes back into the model for the next step.",
  render() {
    let body = "";
    // 1. Text so far
    const ty = 26, th = 34;
    body += text(24, 12, "1. Text so far (prompt + everything written already)", { size: 13, weight: 600, tone: "muted" });
    let x = 24;
    for (const w of PROMPT) {
      const bw = measure(w, 14) + 18;
      body += box(x, ty, bw, th, w, { tone: "grey", fill: "soft", size: 14 });
      x += bw + 6;
    }
    const newX = x + 4, newW = measure(PICK, 14) + 22;
    body += box(newX, ty, newW, th, PICK, { tone: "blue", fill: "soft", dash: true, size: 14, weight: 600 });
    body += text(newX + newW + 10, ty + th / 2, "5. appended", { size: 13, tone: "blue", baseline: "middle", weight: 600 });

    // 2. The model
    const my = 150, mh = 110, mx = 24, mw = 190;
    body += arrow(mx + mw / 2, ty + th + 6, mx + mw / 2, my - 6, { tone: "muted" });
    body += box(mx, my, mw, mh, ["2. The model", "scores every token"], { tone: "purple", fill: "soft", size: 14 });

    // 3-4. Probabilities
    const cx = 300, cy = 150, cw = 420, lx = cx + cw + 12, loopX = cx + cw + 215;
    body += arrow(mx + mw + 8, my + mh / 2, cx - 10, my + mh / 2, { tone: "muted" });
    body += text(cx, cy - 36, "3. One probability for every token in the vocabulary", { size: 13, weight: 600, tone: "muted" });
    body += text(cx, cy - 18, "top 5 shown", { size: 12.5, tone: "muted" });
    const chart = barsH(
      { x: cx, y: cy, w: cw, h: 170 },
      PROBS.map((p) => ({
        label: p.label,
        value: p.value,
        valueLabel: `${p.value}%`,
        tone: p.label === PICK ? "blue" : "grey",
      })),
      { labelWidth: 100, max: 5, padding: 0.3, size: 14 },
    );
    body += chart.svg;
    const oy = cy + 170 + 18;
    body += text(cx + 100, oy, "…and every other token: 82.8% spread thin across the rest", { size: 12.5, tone: "muted", italic: true });

    // 4. The pick, and the loop back up
    const by = chart.y(PICK)!, bh = chart.y.bandwidth();
    body += rect(cx + 6, by - 5, cw - 6, bh + 10, { tone: "blue", fill: "none", dash: true, sw: 1.5 });
    body += text(lx, by + bh / 2 - 9, "4. picked this time", { size: 13, tone: "blue", weight: 600, baseline: "middle" });
    body += text(lx, by + bh / 2 + 9, "(at random, by weight)", { size: 12.5, tone: "blue", baseline: "middle" });
    const upX = newX + newW / 2;
    body += path(`M${lx + 172},${by + bh / 2} L${loopX},${by + bh / 2} L${loopX},${ty + th + 34} L${upX},${ty + th + 34} L${upX},${ty + th + 6}`, {
      tone: "blue",
      sw: 1.8,
      arrow: true,
    });
    body += text(loopX - 8, (by + ty + th + 34) / 2 + 8, "repeat", { size: 12.5, tone: "blue", anchor: "end", italic: true });

    return svg(
      {
        width: loopX + 24,
        height: oy + 12,
        title: "Generation is one step on repeat: predict, pick, append",
        credit: "GPT-2 probabilities from Stephen Wolfram, What Is ChatGPT Doing … and Why Does It Work? (2023).",
        desc: figure.alt,
      },
      body,
    );
  },
};

export default [figure];
