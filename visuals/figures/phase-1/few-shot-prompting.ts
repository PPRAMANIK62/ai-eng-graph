import { arrow, box, bracket, line, path, rect, svg, text, type Figure } from "../../lib/svg.ts";

// Figure 1: the ticket example from nodes/phase-1/few-shot-prompting.md.
const PAIRS = [
  { q: "I was charged twice this month.", a: "billing" },
  { q: "The export button does nothing.", a: "bug" },
  { q: "How do I change my login email?", a: "account" },
];
const REAL = "The app crashes when I upload a PNG.";

const stack: Figure = {
  slug: "prompt-stack",
  alt: "A few-shot prompt drawn as a stack: an instruction to sort tickets into billing, bug or account, then three example tickets each followed by its one-word answer, then the real ticket with an empty answer and a question mark. Arrows run from the three example answers to the empty one, labelled: format, labels and length are copied from here.",
  render() {
    const x0 = 24, qw = 400, aw = 120, ax = x0 + qw + 40, rowH = 44, rowGap = 14;
    const top = 8;
    let b = "";

    // Instruction
    b += box(x0, top, qw + 40 + aw, 42, "Sort each support ticket into billing, bug or account.", { tone: "grey", size: 14 });
    b += text(x0, top + 66, "Examples (earlier turns you write yourself)", { size: 12.5, tone: "muted", weight: 600 });
    b += text(x0 + 10, top + 88, "user", { size: 12, tone: "muted", mono: true });
    b += text(ax + 10, top + 88, "assistant", { size: 12, tone: "muted", mono: true });

    const y0 = top + 98;
    const answerMid: number[] = [];
    PAIRS.forEach((p, i) => {
      const y = y0 + i * (rowH + rowGap);
      b += box(x0, y, qw, rowH, p.q, { tone: "blue", size: 14 });
      b += arrow(x0 + qw + 6, y + rowH / 2, ax - 6, y + rowH / 2, { tone: "muted" });
      b += box(ax, y, aw, rowH, p.a, { tone: "green", size: 14.5, weight: 700, mono: true, sw: 2 });
      answerMid.push(y + rowH / 2);
    });

    // Real input
    const ry = y0 + 3 * (rowH + rowGap) + 30;
    b += line(x0, ry - 16, ax + aw, ry - 16, { tone: "grid", sw: 1 });
    b += box(x0, ry + 6, qw, rowH, REAL, { tone: "blue", size: 14, sw: 2 });
    b += text(x0, ry - 1, "The real ticket", { size: 12.5, tone: "muted", weight: 600 });
    b += arrow(x0 + qw + 6, ry + 6 + rowH / 2, ax - 6, ry + 6 + rowH / 2, { tone: "muted" });
    b += rect(ax, ry + 6, aw, rowH, { tone: "orange", fill: "none", dash: true, sw: 2 });
    b += text(ax + aw / 2, ry + 6 + rowH / 2, "?", { anchor: "middle", baseline: "middle", size: 22, weight: 700, tone: "orange" });

    // Arrows from each example answer down to the empty box
    const rx = ax + aw + 36;
    const emptyMid = ry + 6 + rowH / 2;
    for (const m of answerMid) b += path(`M${ax + aw + 4},${m} L${rx},${m}`, { tone: "orange" });
    b += path(`M${rx},${answerMid[0]} L${rx},${emptyMid} L${ax + aw + 8},${emptyMid}`, { tone: "orange", arrow: true, sw: 2 });
    const lx = rx + 16, ly = answerMid[1]! + 10;
    b += text(lx, ly - 18, "Copied from here:", { size: 13.5, weight: 700, tone: "orange" });
    b += text(lx, ly + 2, "• format (one lowercase word)", { size: 13, tone: "ink" });
    b += text(lx, ly + 21, "• labels (one of three)", { size: 13, tone: "ink" });
    b += text(lx, ly + 40, "• length (short)", { size: 13, tone: "ink" });

    const W = lx + 230;
    return svg(
      {
        width: W,
        height: ry + 6 + rowH + 10,
        title: "Few-shot examples are just more text the model continues",
        desc: stack.alt,
      },
      b,
    );
  },
};

// Figure 2: Min et al. (2022). Only the aggregate numbers in
// sources/min-rethinking-demonstrations.md are data. The paper prints no
// per-model values for Figure 3 (checked the paper and its repo README on
// 2026-09-23), so bar heights are an illustrative shape and say so.
const random: Figure = {
  slug: "random-labels",
  alt: "Three bars, drawn as an illustrative shape rather than data: no examples is clearly lowest, while examples with correct labels and examples with random labels are almost the same height. A note gives the measured result: across 12 models up to GPT-3, random labels cost only 0 to 5 points, 2.6 on average for classification and 1.7 for multiple choice.",
  render() {
    const px = 60, pw = 420, ph = 220, py = 20, base = py + ph;
    const bars = [
      { label: ["No examples"], h: 0.52, tone: "grey" as const },
      { label: ["Examples,", "correct labels"], h: 0.86, tone: "blue" as const },
      { label: ["Examples,", "random labels"], h: 0.82, tone: "orange" as const },
    ];
    const bw = 96, step = pw / 3;
    let b = "";
    b += line(px, base, px + pw, base, { tone: "axis" });
    b += line(px, py, px, base, { tone: "axis" });
    b += text(px - 14, py + ph / 2, "accuracy", { anchor: "middle", size: 12.5, tone: "muted", rotate: -90 });
    const tops: number[] = [];
    bars.forEach((bar, i) => {
      const cx = px + step * i + step / 2;
      const t = base - bar.h * ph;
      tops.push(t);
      b += rect(cx - bw / 2, t, bw, base - t, { tone: bar.tone, fill: "soft", r: 2, dash: true, sw: 1.5 });
      bar.label.forEach((l, j) => (b += text(cx, base + 20 + j * 17, l, { anchor: "middle", size: 13 })));
    });
    // illustrative stamp inside the plot
    const c0 = px + step / 2;
    b += text(c0, py + 52, "Illustrative shape,", { anchor: "middle", size: 13, weight: 700, tone: "muted", italic: true });
    b += text(c0, py + 70, "not data", { anchor: "middle", size: 13, weight: 700, tone: "muted", italic: true });

    // bracket over correct vs random
    const c1 = px + step * 1.5, c2 = px + step * 2.5;
    b += bracket(c1 - bw / 2 + 6, c2 + bw / 2 - 6, tops[1]! - 14, "nearly equal", { up: false, tone: "orange" });

    // Measured numbers panel
    const nx = px + pw + 40, nw = 310;
    b += rect(nx, py, nw, ph, { tone: "grey", fill: "soft", stroke: false, r: 8 });
    const lines: [string, object][] = [
      ["What was measured", { size: 14, weight: 700 }],
      ["Swapping correct labels for random:", { size: 13 }],
      ["0 to 5 points lower", { size: 18, weight: 700, tone: "orange" }],
      ["across 12 models up to GPT-3", { size: 12.5, tone: "muted" }],
      ["Average drop: 2.6 points classification,", { size: 13 }],
      ["1.7 multiple choice", { size: 13 }],
      ["Worst case: nearly 14 points", { size: 13 }],
      ["(one dataset, GPT-J)", { size: 12.5, tone: "muted" }],
    ];
    const ys = [26, 58, 84, 104, 140, 158, 192, 210];
    lines.forEach(([s, o], i) => (b += text(nx + 18, py + ys[i]!, s, o as never)));

    return svg(
      {
        width: nx + nw + 24,
        height: base + 44,
        title: "Random labels barely hurt; leaving the examples out hurts more",
        credit: "Adapted from Min et al. (2022), Figure 3. Bar heights are not the paper's; the numbers on the right are.",
        desc: random.alt,
      },
      b,
    );
  },
};

export default [stack, random];
