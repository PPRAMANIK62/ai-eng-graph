import { arrow, box, circle, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Mechanism: W' = W + γBA with B initialized to zero, from
// sources/thinking-machines-lora-without-regret.md. Parameter counts for
// Llama-3.1-8B (0.70B all layers rank 256, 0.25B attention-only rank 256)
// from the same note; 10,000x from sources/hu-lora.md.
const mechanism: Figure = {
  slug: "mechanism",
  alt: "Diagram of one LoRA layer. The input goes through the frozen weight matrix W, N by N, and also through two small trainable matrices, A (r by N) then B (N by r), whose output is scaled and added to W's output. Below, parameter counts from Thinking Machines for Llama-3.1-8B: LoRA on all layers at rank 256 trains 0.70 billion parameters, attention-only at rank 256 trains 0.25 billion, against all of the roughly 8 billion for full fine-tuning. The original LoRA paper reports 10,000 times fewer trainable parameters than full fine-tuning of GPT-3 175B.",
  render() {
    let b = "";
    // input
    b += box(20, 95, 80, 40, "input x", { tone: "grey", size: 13 });
    // frozen W: big square
    b += rect(170, 20, 150, 150, { tone: "grey", fill: "soft" });
    b += text(245, 85, "W", { anchor: "middle", size: 22, weight: 700, display: true });
    b += text(245, 110, "N × N, frozen", { anchor: "middle", size: 12.5, tone: "muted" });
    b += arrow(100, 115, 168, 95, { tone: "muted" });
    // A and B thin
    b += rect(170, 200, 150, 22, { tone: "blue", fill: "soft" });
    b += text(245, 211, "A  (r × N)", { anchor: "middle", baseline: "middle", size: 12.5, weight: 600, tone: "blue" });
    b += rect(350, 180, 22, 150, { tone: "blue", fill: "soft" });
    b += text(361, 345, "B", { anchor: "middle", size: 12.5, weight: 600, tone: "blue" });
    b += text(361, 361, "(N × r)", { anchor: "middle", size: 12, tone: "blue" });
    b += text(245, 244, "trainable, rank r is small", { anchor: "middle", size: 12, tone: "blue" });
    b += text(245, 260, "B starts at zero", { anchor: "middle", size: 12, tone: "muted" });
    b += arrow(100, 120, 168, 208, { tone: "muted" });
    b += arrow(320, 211, 348, 211, { tone: "muted" });
    // sum
    b += circle(460, 115, 16, { tone: "ink", fill: "none", stroke: true });
    b += text(460, 116, "+", { anchor: "middle", baseline: "middle", size: 18, weight: 700 });
    b += arrow(320, 95, 442, 110, { tone: "muted" });
    b += arrow(372, 250, 448, 128, { tone: "blue" });
    b += text(420, 205, "× γ", { size: 13, tone: "blue", weight: 600 });
    b += arrow(476, 115, 530, 115, { tone: "muted" });
    b += box(532, 95, 90, 40, "output", { tone: "grey", size: 13 });
    b += text(577, 170, "W′ = W + γBA", { anchor: "middle", size: 14, weight: 600, mono: true });

    // parameter counts
    const y = 390;
    b += line(20, y - 14, 700, y - 14, { tone: "grid", sw: 1 });
    b += text(20, y + 6, "How many parameters get trained", { size: 13.5, weight: 600 });
    const rows: { label: string; value: string; w: number; tone: Tone }[] = [
      { label: "Llama-3.1-8B, all layers, rank 256", value: "0.70B", w: 0.7, tone: "blue" },
      { label: "Llama-3.1-8B, attention only, rank 256", value: "0.25B", w: 0.25, tone: "grey" },
      { label: "full fine-tuning of the same model", value: "all ~8B", w: 8, tone: "muted" },
    ];
    const scale = 300 / 8;
    rows.forEach((r, i) => {
      const ry = y + 26 + i * 28;
      b += text(290, ry + 9, r.label, { anchor: "end", baseline: "middle", size: 12.5 });
      b += rect(300, ry, Math.max(3, r.w * scale), 18, { tone: r.tone, fill: "solid", stroke: false, r: 2 });
      b += text(300 + r.w * scale + 8, ry + 9, r.value, { baseline: "middle", size: 12.5, weight: 600, tone: r.tone });
    });
    b += text(20, y + 126, "On GPT-3 175B (2021), LoRA trained 10,000 times fewer parameters than full fine-tuning.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: 720,
        height: y + 136,
        title: "LoRA: freeze W, train a thin correction beside it",
        credit: "Parameter counts: Thinking Machines, “LoRA Without Regret” (2025). 10,000×: Hu et al. (2021).",
        desc: mechanism.alt,
      },
      b,
    );
  },
};

// Timeline: sources/hu-lora.md (2021), sources/biderman-lora-learns-less.md (2024),
// sources/thinking-machines-lora-without-regret.md (2025).
const timeline: Figure = {
  slug: "timeline",
  alt: "A timeline of findings on LoRA versus full fine-tuning. 2021, the LoRA paper: on par or better on RoBERTa, DeBERTa, GPT-2 and GPT-3. 2024, LoRA Learns Less and Forgets Less: on code and math, with about 100,000 instruction pairs or 20 billion tokens of continued pretraining, LoRA substantially underperformed, but forgot less outside the target domain. 2025, LoRA Without Regret: with LoRA on all layers and about a 10 times higher learning rate, it matched full fine-tuning on post-training-sized data and in reinforcement learning, and still fell short only when the data was too big for the adapter.",
  render() {
    const items: { year: string; name: string; verdict: string; tone: Tone; lines: string[] }[] = [
      { year: "2021", name: "LoRA (Hu et al.)", verdict: "on par", tone: "green", lines: ["On par or better on", "RoBERTa, DeBERTa,", "GPT-2 and GPT-3."] },
      {
        year: "2024",
        name: "Biderman et al.",
        verdict: "falls short",
        tone: "red",
        lines: ["Code and math: LoRA", "substantially behind.", "But it forgets less", "outside the task."],
      },
      {
        year: "2025",
        name: "Thinking Machines",
        verdict: "on par, if set up right",
        tone: "green",
        lines: ["All layers, ~10× higher", "learning rate: matches", "on post-training-sized", "data. Behind only on", "pretraining-sized data."],
      },
    ];
    let b = "";
    const x0 = 40;
    const step = 240;
    b += line(x0, 30, x0 + step * 2 + 40, 30, { tone: "axis", sw: 2 });
    items.forEach((it, i) => {
      const x = x0 + i * step;
      b += circle(x, 30, 7, { tone: it.tone });
      b += text(x, 12, it.year, { anchor: "middle", size: 13.5, weight: 700, display: true });
      b += text(x - 10, 60, it.name, { size: 13, weight: 600 });
      b += text(x - 10, 80, it.verdict, { size: 12.5, weight: 600, tone: it.tone });
      it.lines.forEach((l, j) => (b += text(x - 10, 102 + j * 18, l, { size: 12.5 })));
    });
    return svg(
      {
        width: 730,
        height: 200,
        title: "Does LoRA match full fine-tuning? The answer changed",
        credit: "From Hu et al. (2021), Biderman et al. (2024) and Thinking Machines (2025).",
        desc: timeline.alt,
      },
      b,
    );
  },
};

export default [mechanism, timeline];
