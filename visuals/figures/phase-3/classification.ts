import { scaleLinear } from "../../lib/chart.ts";
import { line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// sources/anthropic-classification-cookbook.md: notebook numbers (~10, ~70, 94,
// 97) and the Promptfoo re-run (70.59, 94.12, 95.59).
// sources/anthropic-ticket-routing.md: "from 71% accuracy to 93% accuracy".
const STEPS: { label: string[]; nb: number; nbLabel: string; pf?: number }[] = [
  { label: ["Random", "guess"], nb: 10, nbLabel: "~10%" },
  { label: ["Category", "definitions"], nb: 70, nbLabel: "~70%", pf: 70.59 },
  { label: ["+ 5 similar", "labelled tickets"], nb: 94, nbLabel: "94%", pf: 94.12 },
  { label: ["+ reasoning", "before the label"], nb: 97, nbLabel: "97%", pf: 95.59 },
];

const accuracy: Figure = {
  slug: "accuracy",
  alt: "Bar chart of accuracy on 68 test tickets with 10 categories, from Anthropic's classification cookbook. Random guessing: about 10%. A prompt with category definitions only: about 70%. Adding the 5 most similar labelled tickets as examples: 94%. Adding step-by-step reasoning before the label: 97%. A separate re-run with Promptfoo gave 70.6%, 94.1% and 95.6% for the same three setups. The ticket-routing guide quotes the retrieval step as 71% to 93%.",
  render() {
    const p = { x: 70, y: 40, w: 600, h: 260 };
    const y = scaleLinear().domain([0, 100]).range([p.y + p.h, p.y]);
    const band = p.w / STEPS.length;
    const bw = 46;
    let b = "";
    for (const t of [0, 25, 50, 75, 100]) {
      b += line(p.x, y(t), p.x + p.w, y(t), { tone: "grid", sw: 1 });
      b += text(p.x - 8, y(t), `${t}%`, { anchor: "end", baseline: "middle", size: 11.5, tone: "muted" });
    }
    STEPS.forEach((s, i) => {
      const cx = p.x + band * i + band / 2;
      const tone: Tone = i === 0 ? "grey" : "blue";
      const x1 = s.pf === undefined ? cx - bw / 2 : cx - bw - 3;
      b += rect(x1, y(s.nb), bw, p.y + p.h - y(s.nb), { tone, fill: "solid", stroke: false, r: 2 });
      b += text(x1 + bw / 2, y(s.nb) - 7, s.nbLabel, { anchor: "middle", size: 12.5, weight: 700, tone });
      if (s.pf !== undefined) {
        const x2 = cx + 3;
        b += rect(x2, y(s.pf), bw, p.y + p.h - y(s.pf), { tone: "purple", fill: "soft", r: 2 });
        b += text(x2 + bw / 2, y(s.pf) - 7, `${s.pf.toFixed(1)}%`, { anchor: "middle", size: 12, weight: 600, tone: "purple" });
      }
      s.label.forEach((l, j) => (b += text(cx, p.y + p.h + 20 + j * 16, l, { anchor: "middle", size: 12.5 })));
    });
    b += line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, { tone: "axis" });
    // legend
    b += rect(p.x, 2, 14, 12, { tone: "blue", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 20, 8, "notebook run", { size: 12.5, baseline: "middle" });
    b += rect(p.x + 130, 2, 14, 12, { tone: "purple", fill: "soft", r: 2 });
    b += text(p.x + 150, 8, "Promptfoo re-run", { size: 12.5, baseline: "middle" });
    b += text(p.x + 290, 8, "(ticket-routing guide: 71% to 93%)", { size: 12.5, baseline: "middle", tone: "muted", italic: true });
    return svg(
      {
        width: p.x + p.w + 30,
        height: p.y + p.h + 56,
        title: "Retrieved examples did most of the work: 10 classes, 68 test tickets",
        credit: "Data: Anthropic, “Classification with Claude” cookbook (Claude Haiku 4.5, insurance tickets). One ticket is about 1.5 points.",
        desc: accuracy.alt,
      },
      b,
    );
  },
};

export default [accuracy];
