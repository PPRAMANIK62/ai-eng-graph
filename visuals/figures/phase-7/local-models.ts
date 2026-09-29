import { scaleLinear, series, xAxis, yAxis } from "../../lib/chart.ts";
import { box, bracket, circle, line, rect, svg, text, type Figure } from "../../lib/svg.ts";

// sources/ggml-llama-cpp-apple-silicon-bench.md: summary table, build 8e672ef,
// Llama 2 7B, text generation (bs = 1) in tokens/s. One row per chip; where a
// chip has two GPU configurations, the larger one. M1 has no F16 result.
const CHIPS: { name: string; bw: number; q4: number; f16?: number; dx?: number; dy?: number }[] = [
  { name: "M1", bw: 68, q4: 14.15, dx: -4, dy: -12 },
  { name: "M2", bw: 100, q4: 21.91, f16: 6.72, dx: -6, dy: -12 },
  { name: "M4", bw: 120, q4: 24.11, f16: 7.43, dx: 8, dy: 12 },
  { name: "M3 Pro", bw: 150, q4: 30.74, f16: 9.89, dx: 8, dy: 10 },
  { name: "M2 Pro", bw: 200, q4: 37.87, f16: 12.47, dx: -8, dy: -12 },
  { name: "M4 Pro", bw: 273, q4: 50.74, f16: 17.18, dx: -8, dy: -12 },
  { name: "M2 Max", bw: 400, q4: 60.99, f16: 24.16, dx: -8, dy: -12 },
  { name: "M4 Max", bw: 546, q4: 83.06, f16: 31.64, dx: -8, dy: -12 },
  { name: "M2 Ultra", bw: 800, q4: 94.27, f16: 41.02, dx: -8, dy: -14 },
];

const bandwidth: Figure = {
  slug: "bandwidth",
  alt: "Scatter chart of text generation speed against memory bandwidth for Apple M-series chips running Llama 2 7B with llama.cpp. At 4-bit (Q4_0): M1 at 68 GB/s makes 14 tokens per second, M2 at 100 GB/s 22, M4 at 120 GB/s 24, M3 Pro at 150 GB/s 31, M2 Pro at 200 GB/s 38, M4 Pro at 273 GB/s 51, M2 Max at 400 GB/s 61, M4 Max at 546 GB/s 83, M2 Ultra at 800 GB/s 94. At 16-bit (F16) every chip is much slower: M2 Ultra 41, M4 Max 32, M2 Max 24, M2 Pro 12. Speed rises with bandwidth in both cases.",
  render() {
    const p = { x: 70, y: 30, w: 620, h: 300 };
    const x = scaleLinear().domain([0, 850]).range([p.x, p.x + p.w]);
    const y = scaleLinear().domain([0, 100]).range([p.y + p.h, p.y]);
    let b = "";
    b += yAxis(p, y, [0, 20, 40, 60, 80, 100], String, "tokens per second (decode)");
    b += xAxis(p, x, [0, 100, 200, 300, 400, 500, 600, 700, 800], String, "memory bandwidth (GB/s)");
    const q4 = CHIPS.map((c) => [x(c.bw), y(c.q4)] as [number, number]);
    const f16 = CHIPS.filter((c) => c.f16 !== undefined).map((c) => [x(c.bw), y(c.f16!)] as [number, number]);
    b += series(q4, { tone: "blue", dots: true, smooth: false, sw: 2 });
    b += series(f16, { tone: "orange", dots: true, smooth: false, sw: 2 });
    for (const c of CHIPS) {
      b += text(x(c.bw) + (c.dx ?? 0), y(c.q4) + (c.dy ?? 0), `${c.name} ${Math.round(c.q4)}`, {
        anchor: (c.dx ?? 0) < 0 ? "end" : "start",
        size: 12,
        tone: "blue",
        baseline: "middle",
      });
    }
    const top = CHIPS[CHIPS.length - 1];
    b += text(x(top.bw) - 8, y(top.f16!) - 14, `${Math.round(top.f16!)}`, { anchor: "end", size: 12, tone: "orange", baseline: "middle" });
    // legend
    const lx = p.x + p.w + 24;
    b += circle(lx + 6, p.y + 10, 5, { tone: "blue" });
    b += text(lx + 18, p.y + 10, "4-bit (Q4_0)", { size: 13, baseline: "middle", weight: 600, tone: "blue" });
    b += circle(lx + 6, p.y + 34, 5, { tone: "orange" });
    b += text(lx + 18, p.y + 34, "16-bit (F16)", { size: 13, baseline: "middle", weight: 600, tone: "orange" });
    b += text(lx, p.y + 72, "Same model, same", { size: 12.5, tone: "muted" });
    b += text(lx, p.y + 90, "build. Fewer bytes", { size: 12.5, tone: "muted" });
    b += text(lx, p.y + 108, "per token, faster", { size: 12.5, tone: "muted" });
    b += text(lx, p.y + 126, "decode.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: p.x + p.w + 170,
        height: p.y + p.h + 50,
        title: "Decode speed follows memory bandwidth",
        credit: "Data: llama.cpp discussion #4167 (community measurements, build 8e672ef, 2023-11). Llama 2 7B, one token at a time.",
        desc: bandwidth.alt,
      },
      b,
    );
  },
};

// Illustrative conversation, not measured. Default of 4,096 tokens:
// sources/ollama-faq.md. Oldest messages dropped from the front with no
// signal in the response: sources/ollama-silent-truncation-issue.md.
const contextTrap: Figure = {
  slug: "context-trap",
  alt: "Diagram of a long conversation sent to a model loaded with Ollama's default context window of 4,096 tokens. The messages run from oldest to newest. The conversation is longer than the window, so the oldest messages are dropped from the front and only the newest ones that fit are kept. The request still returns an answer, with no error and no field in the response saying anything was cut.",
  render() {
    const X0 = 30;
    const W = 840;
    const n = 10;
    const kept = 6;
    const cw = W / n;
    const px = (i: number) => X0 + i * cw;
    const y0 = 82;
    const h = 46;
    let b = "";
    b += text(X0, 14, "A long conversation, oldest message first", { size: 14, weight: 700 });
    b += text(X0, 34, "Model loaded with Ollama's default context window: 4,096 tokens", { size: 12.5, tone: "muted" });
    for (let i = 0; i < n; i++) {
      const user = i % 2 === 0;
      const turn = Math.floor(i / 2) + 1;
      b += box(px(i) + 1, y0, cw - 2, h, [user ? "user" : "reply", `turn ${turn}`], { tone: user ? "blue" : "purple", size: 11.5 });
    }
    const cut = n - kept;
    b += rect(px(0) - 3, y0 - 6, px(cut) - px(0) + 3, h + 12, { tone: "red", fill: "none", dash: true, sw: 2 });
    b += bracket(px(0), px(cut), y0 + h + 22, "oldest messages dropped from the front", { up: true, tone: "red", size: 12.5 });
    b += bracket(px(cut) + 4, px(n), y0 - 14, "what the model sees: the newest messages that fit", { tone: "green", size: 12.5 });
    const ry = y0 + h + 70;
    b += line(X0, ry - 10, X0 + W, ry - 10, { tone: "grid", sw: 1 });
    b += text(X0, ry + 12, "What comes back", { size: 13.5, weight: 600 });
    b += box(X0, ry + 26, 250, 40, "an answer", { tone: "grey", size: 12.5 });
    b += box(X0 + 270, ry + 26, 250, 40, "no error", { tone: "grey", size: 12.5 });
    b += box(X0 + 540, ry + 26, 300, 40, "no field saying anything was cut", { tone: "grey", size: 12.5 });
    b += text(X0, ry + 92, "The model answers without the earliest turns. Fix: set the context length and check it.", {
      size: 12.5,
      tone: "muted",
    });
    return svg(
      {
        width: 900,
        height: ry + 104,
        title: "A conversation past the context window loses its oldest messages",
        credit: "Illustrative conversation. Default from Ollama's FAQ; front-dropping from ollama/ollama issue #14259 (2026, user report).",
        desc: contextTrap.alt,
      },
      b,
    );
  },
};

export default [bandwidth, contextTrap];
