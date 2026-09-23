import { series } from "../../lib/chart.ts";
import { bracket, line, path, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Window size (1M) and the max output per reply (128k) come from nodes/phase-1/context-window.md
// and sources/anthropic-context-windows.md. Segment widths, turn sizes and curve shapes are
// not data: each figure says so.

type Seg = { label: string; w: number; tone: Tone; fill?: "soft" | "solid" | "none"; dash?: boolean; inside?: boolean };

const budget: Figure = {
  slug: "one-budget",
  alt: "One long bar standing for a 1M-token context window. From left to right: system prompt, tool definitions, earlier turns, the pasted document and the new question make up the input. Then the model's thinking and answer, then room reserved by max_tokens, then unused space. Input and output share the same window.",
  render() {
    const X = 30, Y = 96, H = 52, W = 840;
    const segs: Seg[] = [
      { label: "system prompt", w: 44, tone: "purple" },
      { label: "tool definitions", w: 64, tone: "purple" },
      { label: "earlier turns", w: 150, tone: "blue", inside: true },
      { label: "pasted document", w: 230, tone: "blue", inside: true },
      { label: "new question", w: 28, tone: "blue" },
      { label: "thinking", w: 76, tone: "orange", inside: true },
      { label: "answer", w: 58, tone: "orange", inside: true },
      { label: "room kept by max_tokens", w: 70, tone: "orange", fill: "none", dash: true },
    ];
    let b = "";
    let x = X;
    const pos: number[] = [];
    for (const s of segs) {
      pos.push(x);
      b += rect(x, Y, s.w, H, { tone: s.tone, fill: s.fill ?? "soft", dash: s.dash, r: 0, sw: 1.2 });
      if (s.inside) b += text(x + s.w / 2, Y + H / 2, s.label, { anchor: "middle", baseline: "middle", size: 13, weight: 600 });
      x += s.w;
    }
    const usedEnd = x;
    // unused
    b += text((usedEnd + X + W) / 2, Y + H / 2, "unused", { anchor: "middle", baseline: "middle", size: 13, tone: "muted", italic: true });
    // outer frame of the whole window
    b += rect(X, Y, W, H, { tone: "ink", fill: "none", r: 4, sw: 2 });
    // callouts for narrow segments, above the bar
    const callout = (i: number, row: number, tone: Tone, anchor: "start" | "middle" = "middle") => {
      const s = segs[i]!;
      const cx = pos[i]! + s.w / 2;
      const ty = Y - 18 - row * 22;
      const tx = anchor === "start" ? cx - 8 : cx;
      return line(cx, Y - 2, cx, ty + 5, { tone: "muted", sw: 1 }) + text(tx, ty, s.label, { anchor, size: 12.5, tone, weight: 600 });
    };
    b += callout(0, 2, "purple", "start");
    b += callout(1, 1, "purple", "start");
    b += callout(4, 1, "blue");
    // max_tokens reserve label above
    const r0 = pos[5]!, r1 = pos[7]! + segs[7]!.w;
    b += bracket(r0, r1, Y - 12, "max_tokens", { up: false, tone: "orange" });
    b += text((r0 + r1) / 2, Y - 50, "up to 128k per reply", { anchor: "middle", size: 12, tone: "muted" });
    // ends of the window
    b += text(X, Y + H + 18, "0", { anchor: "middle", size: 12, tone: "muted" });
    b += text(X + W, Y + H + 18, "1M tokens", { anchor: "end", size: 12, tone: "muted", weight: 600 });
    // input / output brackets below
    const inEnd = pos[5]!;
    b += bracket(X + 2, inEnd - 2, Y + H + 34, "input: everything you send", { up: true, tone: "blue", size: 13 });
    b += bracket(inEnd + 2, r1 - 2, Y + H + 34, "output: what the model writes", { up: true, tone: "orange", size: 13 });
    // key for the purple parts
    b += rect(X, Y + H + 86, 14, 14, { tone: "purple", r: 2, sw: 1.2 });
    b += text(X + 22, Y + H + 93, "system prompt and tool definitions: sent on every call, and they take room too", { baseline: "middle", size: 12.5, tone: "muted" });
    return svg(
      {
        width: X * 2 + W,
        height: Y + H + 110,
        title: "One context window holds the whole request and the reply",
        credit: "Window sizes: Claude's newer models, as of 2026-09. Segment widths are illustrative, not measured.",
        desc: budget.alt,
      },
      b,
    );
  },
};

// Illustrative sizes (arbitrary units) for each turn's new user message and new reply.
const TURNS = [
  { user: 40, reply: 120 },
  { user: 55, reply: 140 },
  { user: 35, reply: 150 },
  { user: 50, reply: 130 },
];

const turns: Figure = {
  slug: "turns",
  alt: "Four stacked bars, one per call in a chat. Each bar repeats all earlier turns in grey, then adds the new user message and the new reply in colour. The bars get longer each call until the fourth one reaches the dashed context window limit.",
  render() {
    const X = 90, U = 1.0, BH = 34, GAP = 20, top = 40;
    const total = TURNS.reduce((a, t) => a + t.user + t.reply, 0) * U;
    const limitX = X + total;
    let b = "";
    let prev = 0;
    TURNS.forEach((t, i) => {
      const y = top + i * (BH + GAP);
      b += text(X - 14, y + BH / 2, `Call ${i + 1}`, { anchor: "end", baseline: "middle", size: 13.5, weight: 600 });
      if (prev > 0) {
        b += rect(X, y, prev, BH, { tone: "grey", r: 3, sw: 1.2 });
        b += text(X + prev / 2, y + BH / 2, i === 1 ? "turn 1, sent again" : `turns 1–${i}, sent again`, { anchor: "middle", baseline: "middle", size: 12.5, tone: "muted" });
      }
      b += rect(X + prev, y, t.user, BH, { tone: "blue", r: 3, sw: 1.2 });
      b += rect(X + prev + t.user, y, t.reply, BH, { tone: "orange", r: 3, sw: 1.2 });
      b += text(X + prev + t.user + t.reply / 2, y + BH / 2, "reply", { anchor: "middle", baseline: "middle", size: 12.5, tone: "orange", weight: 600 });
      prev += t.user + t.reply;
    });
    const bottom = top + TURNS.length * (BH + GAP) - GAP;
    b += line(limitX, top - 26, limitX, bottom + 10, { tone: "red", dash: true, sw: 2 });
    b += text(limitX, top - 32, "context window limit", { anchor: "end", size: 13, tone: "red", weight: 600 });
    // legend
    const ly = bottom + 32;
    const key = (x: number, tone: Tone, s: string) => rect(x, ly - 7, 14, 14, { tone, r: 2, sw: 1.2 }) + text(x + 22, ly, s, { baseline: "middle", size: 12.5 });
    b += key(X, "grey", "earlier turns, resent in full");
    b += key(X + 215, "blue", "new user message");
    b += key(X + 370, "orange", "new reply");
    return svg(
      {
        width: limitX + 40,
        height: ly + 14,
        title: "Every call resends the whole chat, so the window fills turn by turn",
        credit: "Illustrative sizes, not measured.",
        desc: turns.alt,
      },
      b,
    );
  },
};

const rot: Figure = {
  slug: "needle-vs-harder",
  alt: "An illustrative line chart of accuracy against input length. The needle-in-a-haystack line stays flat near the top. A second line for harder tasks, such as several facts at once or distractors, starts high and slopes down as the input gets longer. The shape is illustrative, not data.",
  render() {
    const p = { x: 80, y: 20, w: 640, h: 250 };
    let b = "";
    // axes
    b += line(p.x, p.y, p.x, p.y + p.h, { tone: "axis" });
    b += line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, { tone: "axis", arrow: false });
    b += path(`M${p.x + p.w - 8},${p.y + p.h - 5} L${p.x + p.w},${p.y + p.h} L${p.x + p.w - 8},${p.y + p.h + 5}`, { tone: "grey" });
    b += path(`M${p.x - 5},${p.y + 8} L${p.x},${p.y} L${p.x + 5},${p.y + 8}`, { tone: "grey" });
    b += text(p.x + p.w / 2, p.y + p.h + 26, "input length (tokens)", { anchor: "middle", size: 13, tone: "muted" });
    b += text(p.x - 22, p.y + p.h / 2, "accuracy", { anchor: "middle", size: 13, tone: "muted", rotate: -90 });
    b += text(p.x - 8, p.y + 12, "high", { anchor: "end", size: 12, tone: "muted" });
    b += text(p.x - 8, p.y + p.h - 4, "low", { anchor: "end", size: 12, tone: "muted" });
    // shapes, not data
    const X = (f: number) => p.x + 20 + f * (p.w - 40);
    const Y = (f: number) => p.y + p.h - f * p.h;
    const needle: [number, number][] = [0, 0.25, 0.5, 0.75, 1].map((f) => [X(f), Y(0.9 - 0.02 * f)]);
    const hard: [number, number][] = [[X(0), Y(0.82)], [X(0.25), Y(0.7)], [X(0.5), Y(0.55)], [X(0.75), Y(0.42)], [X(1), Y(0.3)]];
    b += series(needle, { tone: "blue", sw: 3 });
    b += series(hard, { tone: "orange", sw: 3 });
    b += text(X(1) - 4, Y(0.88) - 14, "needle in a haystack (one fact)", { anchor: "end", size: 13.5, weight: 600, tone: "blue" });
    b += text(X(0.2), Y(0.36), "harder tasks: several facts,", { size: 13.5, weight: 600, tone: "orange" });
    b += text(X(0.2), Y(0.36) + 18, "distractors, tracing across the text", { size: 13.5, weight: 600, tone: "orange" });
    // disclaimer inside the plot
    b += rect(X(1) - 238, Y(0.12) - 16, 238, 30, { tone: "grey", fill: "none", dash: true, r: 4, sw: 1.2 });
    b += text(X(1) - 119, Y(0.12) - 1, "Illustrative shape, not data", { anchor: "middle", baseline: "middle", size: 13, tone: "muted", italic: true });
    return svg(
      {
        width: p.x + p.w + 40,
        height: p.y + p.h + 40,
        title: "A good needle score says little about harder long-context tasks",
        credit: "Adapted in spirit from Chroma, \"Context Rot\" (2025) and Hsieh et al., RULER (2024). Not a copy of either chart.",
        desc: rot.alt,
      },
      b,
    );
  },
};

export default [budget, turns, rot];
