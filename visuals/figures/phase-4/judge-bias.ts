import { scaleLinear } from "../../lib/chart.ts";
import { line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Left: sources/wang-llms-not-fair-evaluators.md, Table 2 (Vicuna-13B vs
// ChatGPT, Vicuna's win rate as Assistant 1 vs Assistant 2).
// Right: sources/dubois-length-controlled-alpacaeval.md, 4.1 (gpt4_1106_preview
// win rate range across concise/verbose prompts, raw and length-controlled).
const figure: Figure = {
  slug: "order-length",
  alt: "Two bar charts of the same answers judged differently. Left, position: Vicuna-13B's win rate against ChatGPT depends on where its answer appears. With GPT-4 judging, 51.3% when shown first and 23.8% when shown second. With ChatGPT judging, 2.5% when first and 82.5% when second. Right, length: the same GPT-4 Turbo model judged against its own answers on AlpacaEval scores a 22.9% win rate when prompted to be concise and 64.3% when prompted to be verbose. With length control the spread shrinks to 41.9% to 51.6%.",
  render() {
    let b = "";
    const H = 190;
    const top = 60;
    const y = scaleLinear().domain([0, 100]).range([top + H, top]);
    const bar = (x: number, v: number, tone: Tone, label: string, sub: string) => {
      let s = rect(x, y(v), 56, top + H - y(v), { tone, fill: "solid", stroke: false, r: 2 });
      s += text(x + 28, y(v) - 6, `${v}%`, { anchor: "middle", size: 12.5, weight: 600, tone });
      s += text(x + 28, top + H + 18, label, { anchor: "middle", size: 12.5 });
      s += text(x + 28, top + H + 34, sub, { anchor: "middle", size: 12, tone: "muted" });
      return s;
    };
    const grid = (x0: number, x1: number) => {
      let s = "";
      for (const t of [0, 25, 50, 75, 100]) {
        s += line(x0, y(t), x1, y(t), { tone: "grid", sw: 1 });
        s += text(x0 - 6, y(t), `${t}%`, { anchor: "end", baseline: "middle", size: 11.5, tone: "muted" });
      }
      return s;
    };

    // Left panel: position
    const L = 60;
    b += text(20, 8, "Answer order", { size: 14.5, weight: 700, tone: "blue" });
    b += text(20, 28, "Vicuna-13B's win rate vs ChatGPT, same 80 questions", { size: 12.5, tone: "muted" });
    b += grid(L, L + 340);
    b += text(L + 75, top + H + 56, "GPT-4 judging", { anchor: "middle", size: 12.5, weight: 600 });
    b += bar(L + 15, 51.3, "blue", "shown", "first");
    b += bar(L + 79, 23.8, "orange", "shown", "second");
    b += text(L + 255, top + H + 56, "ChatGPT judging", { anchor: "middle", size: 12.5, weight: 600 });
    b += bar(L + 195, 2.5, "blue", "shown", "first");
    b += bar(L + 259, 82.5, "orange", "shown", "second");

    // Right panel: length
    const R = 520;
    b += line(R - 50, 0, R - 50, top + H + 60, { tone: "grid", sw: 1 });
    b += text(R - 30, 8, "Answer length", { size: 14.5, weight: 700, tone: "purple" });
    b += text(R - 30, 28, "Same model vs its own answers, AlpacaEval (805 prompts)", { size: 12.5, tone: "muted" });
    b += grid(R + 10, R + 360);
    b += text(R + 95, top + H + 56, "Raw win rate", { anchor: "middle", size: 12.5, weight: 600 });
    b += bar(R + 35, 22.9, "grey", "told to be", "concise");
    b += bar(R + 99, 64.3, "purple", "told to be", "verbose");
    b += text(R + 275, top + H + 56, "Length-controlled", { anchor: "middle", size: 12.5, weight: 600 });
    b += bar(R + 215, 41.9, "grey", "lowest", "");
    b += bar(R + 279, 51.6, "purple", "highest", "");
    return svg(
      {
        width: 900,
        height: top + H + 66,
        title: "Same answers, different verdicts: order and length move an LLM judge",
        credit: "Data: Wang et al. (2023), Table 2; Dubois et al. (2024), section 4.1. Judges are 2023–2024 models.",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
