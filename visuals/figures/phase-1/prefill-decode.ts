import { xAxis } from "../../lib/chart.ts";
import { arrow, box, line, path, rect, svg, text, type Figure } from "../../lib/svg.ts";
import { scaleLinear } from "d3-scale";

// Timeline: the article's example request (2,000-token prompt, 500-token answer) with
// its made-up but realistic TTFT of 0.5 s and TPOT of 20 ms. Total = 0.5 + 499 x 0.02.
// Ops per byte: sources/baseten-inference-guide.md (A10 ridge 208.3, Llama 2 7B decode ~62).
const TTFT = 0.5;
const TPOT = 0.02;
const STEPS = 499;
const TOTAL = TTFT + TPOT * STEPS; // 10.48 s

const timeline: Figure = {
  slug: "timeline",
  alt: "A timeline for one request drawn to scale. Prefill, all 2,000 prompt tokens at once, is a thin block of half a second that ends at the first token. Decode follows as 499 thin ticks of 20 ms each, filling the rest of the roughly 10.5 seconds. Below: total time equals TTFT plus TPOT times the number of output tokens.",
  render() {
    const x0 = 40;
    const W = 860;
    const x = scaleLinear().domain([0, 10.5]).range([x0, x0 + W]);
    const ty = 76; // top of the bar
    const bh = 40;
    let b = "";

    // Decode ticks
    for (let i = 0; i < STEPS; i++) {
      const t = TTFT + i * TPOT;
      b += line(x(t) + 0.8, ty + 4, x(t) + 0.8, ty + bh - 4, { tone: "blue", sw: 0.9 });
    }
    // Prefill block
    b += rect(x(0), ty, x(TTFT) - x(0), bh, { tone: "orange", fill: "solid", stroke: false, r: 2 });

    // Labels above
    b += path(`M${x(TTFT / 2)},${ty - 4} L${x(TTFT / 2)},${ty - 50} L${x(TTFT / 2) + 12},${ty - 50}`, { tone: "orange", sw: 1.3 });
    b += text(x(TTFT / 2) + 18, ty - 56, "Prefill: all 2,000 prompt tokens at once", { size: 13.5, weight: 600, tone: "orange" });
    b += text(x(TTFT / 2) + 18, ty - 38, "ends with the first output token (TTFT = 0.5 s)", { size: 12.5, tone: "muted" });

    b += line(x(TTFT), ty - 18, x(TTFT), ty + bh + 6, { tone: "ink", sw: 1.5, dash: true });

    // Decode bracket
    const dMid = (x(TTFT) + x(TOTAL)) / 2;
    b += path(`M${x(TTFT) + 2},${ty - 8} L${x(TTFT) + 2},${ty - 14} L${x(TOTAL)},${ty - 14} L${x(TOTAL)},${ty - 8}`, { tone: "blue", sw: 1.3 });
    b += text(dMid + 60, ty - 22, "Decode: the other 499 tokens, one per step, 20 ms each (TPOT)", { anchor: "middle", size: 13.5, weight: 600, tone: "blue" });

    // Zoom inset of the first few decode steps
    const zy = ty + bh + 60;
    const zx = x(TTFT) + 40;
    const zw = 56;
    b += path(`M${x(TTFT)},${ty + bh} L${zx},${zy} M${x(TTFT + 6 * TPOT)},${ty + bh} L${zx + 6 * zw},${zy}`, { tone: "grid", sw: 1 });
    for (let i = 0; i < 6; i++) {
      b += box(zx + i * zw + 2, zy, zw - 4, 32, "20 ms", { tone: "blue", size: 12 });
    }
    b += text(zx + 6 * zw + 12, zy + 16, "zoomed in: each step waits for the one before it", { size: 12.5, tone: "muted", baseline: "middle" });

    // Axis
    const ay = zy + 50;
    b += xAxis({ x: x0, y: ay - 30, w: W, h: 30 }, x, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (n) => `${n} s`);
    b += line(x(TOTAL), ay - 6, x(TOTAL), ay + 6, { tone: "ink", sw: 2 });
    b += text(x(TOTAL), ay + 38, "done at about 10.5 s", { anchor: "end", size: 12.5, weight: 600 });

    // Formula
    const fy = ay + 76;
    b += rect(x0, fy - 20, W, 60, { tone: "grey", fill: "soft", stroke: false, r: 8 });
    b += text(x0 + W / 2, fy, "total time = TTFT + TPOT × output tokens", { anchor: "middle", size: 15, weight: 600 });
    b += text(x0 + W / 2, fy + 22, "0.5 s + 499 × 0.02 s = 10.48 s. The answer, not the prompt, is where the time goes.", { anchor: "middle", size: 12.5, tone: "muted" });

    return svg(
      {
        width: x0 * 2 + W,
        height: fy + 48,
        title: "One request: 2,000 prompt tokens in, 500 tokens out",
        credit: "Drawn to scale with the article's made-up but realistic numbers: TTFT 0.5 s, TPOT 20 ms. Formula from Databricks (2023).",
        desc: timeline.alt,
      },
      b,
    );
  },
};

const opsPerByte: Figure = {
  slug: "ops-per-byte",
  alt: "A number line of operations per byte read from memory. Decode for Llama 2 7B sits at about 62. The NVIDIA A10 can do about 208 operations per byte. Everything left of 208 is memory-bound, waiting on memory; everything right is compute-bound, waiting on math. Prefill sits far off to the right.",
  render() {
    const x0 = 40;
    const W = 820;
    const x = scaleLinear().domain([0, 300]).range([x0, x0 + W]);
    const ly = 150; // axis line
    const bandTop = 60;
    const RIDGE = 208.3;
    let b = "";

    b += rect(x(0), bandTop, x(RIDGE) - x(0), ly - bandTop, { tone: "blue", fill: "soft", stroke: false, r: 0 });
    b += rect(x(RIDGE), bandTop, x(300) - x(RIDGE), ly - bandTop, { tone: "orange", fill: "soft", stroke: false, r: 0 });
    b += text(x(RIDGE) - 12, bandTop + 20, "memory-bound", { anchor: "end", size: 14, weight: 600, tone: "blue" });
    b += text(x(RIDGE) - 12, bandTop + 38, "waiting on memory", { anchor: "end", size: 12.5, tone: "blue" });
    b += text(x(RIDGE) + 12, bandTop + 20, "compute-bound", { size: 14, weight: 600, tone: "orange" });
    b += text(x(RIDGE) + 12, bandTop + 38, "waiting on math", { size: 12.5, tone: "orange" });

    b += xAxis({ x: x0, y: ly - 1, w: W, h: 1 }, x, [0, 50, 100, 150, 200, 250, 300], String, "operations per byte read from memory");

    // Ridge
    b += line(x(RIDGE), bandTop - 26, x(RIDGE), ly, { tone: "ink", sw: 2 });
    b += text(x(RIDGE), bandTop - 44, "NVIDIA A10 can do about 208", { anchor: "middle", size: 13, weight: 600 });

    // Decode marker
    b += line(x(62), bandTop + 50, x(62), ly, { tone: "blue", sw: 3 });
    b += text(x(62), bandTop - 44, "Decode, Llama 2 7B: about 62", { anchor: "middle", size: 13, weight: 600, tone: "blue" });
    b += line(x(62), bandTop - 38, x(62), bandTop + 50, { tone: "blue", sw: 1, dash: true });

    // Prefill arrow off the scale
    b += arrow(x(240), bandTop + 66, x(300) + 30, bandTop + 66, { tone: "orange", sw: 2.5 });
    b += text(x(240), bandTop + 58, "Prefill: far to the right", { size: 12.5, weight: 600, tone: "orange" });

    // Gap note
    b += path(`M${x(62)},${ly - 16} L${x(RIDGE)},${ly - 16}`, { tone: "muted", sw: 1, arrow: true, arrowStart: true });
    b += text((x(62) + x(RIDGE)) / 2, ly - 22, "most of the A10's math sits idle", { anchor: "middle", size: 12, tone: "muted" });

    return svg(
      {
        width: x0 * 2 + W + 40,
        height: ly + 64,
        title: "Why decode is memory-bound: it does too little math per byte",
        credit: "Numbers from Baseten, “A guide to LLM inference and performance” (2025): A10 at 125 TFLOPS and 600 GB/s. Prefill has no number here, only a direction.",
        desc: opsPerByte.alt,
      },
      `<g transform="translate(0 14)">${b}</g>`,
    );
  },
};

export default [timeline, opsPerByte];
