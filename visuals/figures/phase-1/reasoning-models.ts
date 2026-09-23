import { scaleLinear, series, xAxis, yAxis } from "../../lib/chart.ts";
import { bracket, circle, line, lines, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Billing and limits: sources/openai-reasoning-guide.md and sources/anthropic-thinking.md
// (thinking billed as output, counts toward max_tokens / max_output_tokens, only a summary shown).
// Block lengths are not measurements.
const timeline: Figure = {
  slug: "token-timeline",
  alt: "Two token timelines for the same request. A reasoning model reads the input, then generates a long block of thinking tokens (hidden or summarized, but billed as output) before a short answer; the thinking and the answer together count toward max_tokens. A regular model reads the input and writes the answer straight away.",
  render() {
    const x0 = 150, bh = 44;
    const inW = 110, thinkW = 420, ansW = 110;
    let body = "";
    const block = (x: number, y: number, w: number, label: string[], tone: Tone, dash = false) =>
      rect(x, y, w, bh, { tone, fill: "soft", r: 4, dash }) +
      lines(x + w / 2, y + bh / 2 - (label.length - 1) * 8, label, { anchor: "middle", size: 13, weight: 600, gap: 16, baseline: "middle" });

    // Reasoning model
    const y1 = 64;
    body += text(x0 - 16, y1 + bh / 2 - 8, "Reasoning", { anchor: "end", size: 14, weight: 700, baseline: "middle" });
    body += text(x0 - 16, y1 + bh / 2 + 10, "model", { anchor: "end", size: 14, weight: 700, baseline: "middle" });
    body += block(x0, y1, inW, ["Input"], "blue");
    body += block(x0 + inW + 4, y1, thinkW, ["Thinking tokens", "(hidden or summarized, billed as output)"], "grey", true);
    body += block(x0 + inW + 4 + thinkW + 4, y1, ansW, ["Answer"], "green");
    body += bracket(x0 + inW + 4, x0 + inW + thinkW + ansW + 8, y1 - 12, "all generated and billed as output; counts toward max_tokens", { up: false, tone: "orange", size: 12.5 });

    // Regular model
    const y2 = y1 + bh + 46;
    body += text(x0 - 16, y2 + bh / 2 - 8, "Regular", { anchor: "end", size: 14, weight: 700, baseline: "middle" });
    body += text(x0 - 16, y2 + bh / 2 + 10, "model", { anchor: "end", size: 14, weight: 700, baseline: "middle" });
    body += block(x0, y2, inW, ["Input"], "blue");
    body += block(x0 + inW + 4, y2, ansW, ["Answer"], "green");

    // time arrow
    const ty = y2 + bh + 34;
    const end = x0 + inW + thinkW + ansW + 8;
    body += line(x0, ty, end, ty, { tone: "muted", arrow: true });
    body += text(end, ty + 20, "time, tokens generated one by one", { anchor: "end", size: 12, tone: "muted" });
    body += text(x0 + inW + ansW + 20, y2 + bh / 2, "Same visible answer, much less to generate.", { size: 12.5, tone: "muted", baseline: "middle" });

    return svg(
      {
        width: end + 30,
        height: ty + 28,
        title: "Where the time and money go in a reasoning model",
        credit: "Block lengths show the idea, not measured token counts. From the OpenAI and Anthropic API docs.",
        desc: timeline.alt,
      },
      body,
    );
  },
};

// Numbers: sources/deepseek-r1.md. 15.6% and 77.9% AIME 2024 (§2.3), 10,400 steps and
// the jump at step 8.2k when the length limit went from 32,768 to 65,536 tokens (§2.3).
// The paper text gives no per-step values, so the accuracy panel shows only the two
// measured points and the length panel is an illustrative shape.
const training: Figure = {
  slug: "r1-training",
  alt: "Two charts over DeepSeek-R1-Zero's 10,400 RL training steps. Top: AIME 2024 accuracy went from 15.6% at the start to 77.9% after training. Bottom: average response length grew over the same steps, from hundreds to thousands of tokens (shape only). A marker at step 8.2k shows where the length limit was raised and both jumped.",
  render() {
    const p1 = { x: 90, y: 30, w: 620, h: 170 };
    const p2 = { x: 90, y: p1.y + p1.h + 70, w: 620, h: 150 };
    const x = scaleLinear().domain([0, 10400]).range([p1.x, p1.x + p1.w]);
    const ya = scaleLinear().domain([0, 100]).range([p1.y + p1.h, p1.y]);
    let body = "";

    // Top: accuracy, two measured points only
    body += text(p1.x, p1.y - 14, "AIME 2024 accuracy (measured start and end only)", { size: 13.5, weight: 700 });
    body += yAxis(p1, ya, [0, 25, 50, 75, 100], (n) => `${n}%`);
    body += line(p1.x, p1.y + p1.h, p1.x + p1.w, p1.y + p1.h, { tone: "axis" });
    const a0: [number, number] = [x(0), ya(15.6)], a1: [number, number] = [x(10400), ya(77.9)];
    body += line(a0[0], a0[1], a1[0], a0[1], { tone: "grey", dash: true, sw: 1 });
    body += circle(a0[0], a0[1], 6, { tone: "blue" }) + circle(a1[0], a1[1], 6, { tone: "blue" });
    body += text(a0[0] + 12, a0[1] + 18, "15.6% at the start", { size: 13, weight: 700, tone: "blue" });
    body += text(a1[0] - 12, a1[1] - 12, "77.9% after RL", { anchor: "end", size: 13, weight: 700, tone: "blue" });
    const bxr = a1[0] + 14;
    body += line(bxr, a0[1], bxr, a1[1] + 8, { tone: "blue", sw: 1.5, arrow: true });
    body += text(bxr + 6, (a0[1] + a1[1]) / 2, "+62.3 points", { size: 12.5, weight: 700, tone: "blue", baseline: "middle" });
    body += text(x(4200), ya(48), "The paper's text gives only the start and end values,", { anchor: "middle", size: 12, tone: "muted", italic: true });
    body += text(x(4200), ya(48) + 17, "so the path between them isn't drawn.", { anchor: "middle", size: 12, tone: "muted", italic: true });

    // Bottom: response length, illustrative shape
    body += text(p2.x, p2.y - 14, "Average response length", { size: 13.5, weight: 700 });
    body += rect(p2.x + 210, p2.y - 30, 170, 22, { tone: "grey", fill: "soft", r: 4 });
    body += text(p2.x + 295, p2.y - 19, "illustrative shape, not data", { anchor: "middle", baseline: "middle", size: 12, tone: "muted", italic: true });
    body += text(p2.x - 12, p2.y + 12, "longer", { anchor: "end", size: 12, tone: "muted" });
    body += text(p2.x - 12, p2.y + p2.h - 4, "shorter", { anchor: "end", size: 12, tone: "muted" });
    const yl = (t: number) => p2.y + p2.h - t * p2.h;
    const shape: [number, number][] = [
      [x(0), yl(0.08)], [x(2000), yl(0.2)], [x(4000), yl(0.33)], [x(6000), yl(0.45)], [x(8100), yl(0.55)],
    ];
    const after: [number, number][] = [[x(8300), yl(0.75)], [x(9300), yl(0.82)], [x(10400), yl(0.88)]];
    body += series(shape, { tone: "orange", dash: true, sw: 2.5 });
    body += series(after, { tone: "orange", dash: true, sw: 2.5 });
    body += text(x(4600), yl(0.62), "grows to hundreds, then thousands of tokens", { anchor: "middle", size: 12.5, tone: "orange", weight: 600 });
    body += xAxis(p2, x, [0, 2000, 4000, 6000, 8000, 10400], (n) => n.toLocaleString("en-US"), "RL training steps");

    // Marker at 8.2k across both panels
    const mx = x(8200);
    body += line(mx, p1.y, mx, p2.y + p2.h, { tone: "purple", dash: true, sw: 1.5 });
    body += lines(mx - 8, p1.y + 14, ["step 8.2k: length limit raised", "from 32,768 to 65,536 tokens;", "accuracy and length both jump"], { anchor: "end", size: 12, tone: "purple", gap: 16 });

    return svg(
      {
        width: p1.x + p1.w + 120,
        height: p2.y + p2.h + 46,
        title: "DeepSeek-R1-Zero during RL: longer answers, higher scores",
        credit: "Adapted from figure 1 of the DeepSeek-R1 paper (DeepSeek-AI, 2025). Only the labelled numbers are data.",
        desc: training.alt,
      },
      body,
    );
  },
};

export default [timeline, training];
