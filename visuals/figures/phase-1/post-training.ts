import { arrow, box, lines, rect, svg, text, wrap, type Figure, type Tone } from "../../lib/svg.ts";

// Prompt and both replies: sources/lambert-rlhf-book-intro.md (What Does RLHF Do?).
// The base model's reply is cut short; the rest is described, not quoted.
const PROMPT = "The president of the united states in 2006 was";

const beforeAfter: Figure = {
  slug: "before-after",
  alt: "The same prompt, The president of the united states in 2006 was, given to two models. The base model, Llama 3.1 405B Base, says George W. Bush and then drifts on to Jeb Bush, John McCain, an executive order and more. The post-trained model, Tülu 3 405B, answers in two sentences and stops.",
  render() {
    const pw = 400, gap = 36, x1 = 24, x2 = x1 + pw + gap;
    const promptH = 58, bodyTop = 118, bodyH = 238;
    let body = "";
    const panel = (x: number, head: string, sub: string, tone: Tone) => {
      let s = text(x, 14, head, { size: 15, weight: 700, tone });
      s += text(x, 34, sub, { size: 12.5, tone: "muted" });
      s += rect(x, 48, pw, promptH, { tone: "grey", fill: "soft" });
      s += text(x + 14, 68, "Prompt", { size: 11.5, tone: "muted", weight: 600 });
      s += text(x + 14, 90, PROMPT, { size: 13.5, italic: true });
      s += rect(x, bodyTop, pw, bodyH, { tone, fill: "none" });
      s += text(x + 14, bodyTop + 22, "Model's reply", { size: 11.5, tone: "muted", weight: 600 });
      return s;
    };

    // Left: base model
    body += panel(x1, "Base model", "Llama 3.1 405B Base, straight out of pretraining", "orange");
    const lx = x1 + 14, ly = bodyTop + 50, lg = 21;
    body += text(lx, ly, "George W. Bush,", { size: 14, weight: 700, tone: "green" });
    const drift = wrap(
      "the governor of Florida in 2006 was Jeb Bush, and John McCain was an Arizona senator in 2006 - who later lost to obama. September 1 – U.S. President Bush signs an executive order …",
      pw - 60,
      14,
    );
    drift.forEach((l, i) => {
      const y = ly + (i + 1) * lg;
      body += rect(lx - 4, y - 15, pw - 40, 20, { tone: "orange", fill: "soft", stroke: false, r: 3 });
      body += text(lx, y, l, { size: 14 });
    });
    const after = ly + (drift.length + 1) * lg + 14;
    body += lines(lx, after, ["[keeps going: a gambling law, calendar", "facts about 2009, web-page metadata]"], { size: 12.5, tone: "muted", italic: true, gap: 18 });
    body += text(lx, bodyTop + bodyH - 14, "Right answer, then it keeps writing the web page.", { size: 13, weight: 600, tone: "orange" });

    // Right: post-trained model
    body += panel(x2, "After post-training", "Tülu 3 405B: the same base model, post-trained", "green");
    const answer = wrap(
      "George W. Bush was the president of the United States in 2006. He served two terms in office, from January 20, 2001, to January 20, 2009.",
      pw - 40,
      14,
    );
    body += lines(x2 + 14, ly, answer, { size: 14, gap: lg });
    body += text(x2 + 14, bodyTop + bodyH - 14, "Answers the question, then stops.", { size: 13, weight: 600, tone: "green" });

    return svg(
      {
        width: x2 + pw + 24,
        height: bodyTop + bodyH + 6,
        title: "Same knowledge, different behavior",
        credit: "Replies quoted from Nathan Lambert's RLHF book, ch. 1 (the base model's reply is cut short).",
        desc: beforeAfter.alt,
      },
      body,
    );
  },
};

// Recipes: the table in nodes/phase-1/post-training.md; sources/ouyang-instructgpt.md,
// sources/lambert-tulu-3.md, sources/deepseek-r1.md (§3).
type Kind = "sft" | "pref" | "rl" | "mixed";
const KIND: Record<Exclude<Kind, "mixed">, { tone: Tone; label: string }> = {
  sft: { tone: "blue", label: "Supervised fine-tuning (example answers)" },
  pref: { tone: "orange", label: "Preference tuning (which answer is better)" },
  rl: { tone: "green", label: "RL on checkable answers" },
};
const RECIPES: { name: string; who: string; stages: { label: string[]; kind: Kind }[] }[] = [
  {
    name: "InstructGPT",
    who: "OpenAI, 2022",
    stages: [
      { label: ["SFT"], kind: "sft" },
      { label: ["Reward model"], kind: "pref" },
      { label: ["RL (PPO)"], kind: "pref" },
    ],
  },
  {
    name: "Tulu 3",
    who: "Ai2, 2024",
    stages: [
      { label: ["SFT"], kind: "sft" },
      { label: ["DPO"], kind: "pref" },
      { label: ["RLVR"], kind: "rl" },
    ],
  },
  {
    name: "DeepSeek-R1",
    who: "DeepSeek, 2025",
    stages: [
      { label: ["Small SFT"], kind: "sft" },
      { label: ["RL on", "reasoning"], kind: "rl" },
      { label: ["More SFT"], kind: "sft" },
      { label: ["Final RL", "(mixed rewards)"], kind: "mixed" },
    ],
  },
];

const recipes: Figure = {
  slug: "recipes",
  alt: "Three post-training recipes drawn as pipelines from base model to assistant. InstructGPT (2022): SFT, reward model, RL with PPO. Tulu 3 (2024): SFT, DPO, RL with verifiable rewards. DeepSeek-R1 (2025): small SFT, RL on reasoning, more SFT, then RL for reasoning, helpfulness and safety. Same building blocks, different orders, and RL on checkable answers takes a bigger share over time.",
  render() {
    const labelW = 112, ends = 92, bh = 50, rowH = 86, arrowGap = 30;
    const xBase = 24 + labelW + 12;
    const xStages = xBase + ends + arrowGap;
    const stagesW = 560;
    const xEnd = xStages + stagesW + arrowGap;
    let body = "";

    // Legend
    let lx = 24;
    for (const k of ["sft", "pref", "rl"] as const) {
      body += rect(lx, 0, 16, 16, { tone: KIND[k].tone, fill: "soft", r: 3 });
      body += text(lx + 24, 8, KIND[k].label, { size: 12.5, baseline: "middle" });
      lx += 24 + KIND[k].label.length * 6.4 + 24;
    }

    const top = 40;
    RECIPES.forEach((r, i) => {
      const y = top + i * rowH;
      body += text(24, y + bh / 2 - 8, r.name, { size: 14, weight: 700, baseline: "middle" });
      body += text(24, y + bh / 2 + 11, r.who, { size: 12, tone: "muted", baseline: "middle" });
      body += box(xBase, y, ends, bh, "Base model", { tone: "grey", size: 13 });
      const n = r.stages.length;
      const sw = (stagesW - (n - 1) * arrowGap) / n;
      body += arrow(xBase + ends + 2, y + bh / 2, xStages - 2, y + bh / 2, { tone: "muted" });
      r.stages.forEach((s, j) => {
        const sx = xStages + j * (sw + arrowGap);
        if (s.kind === "mixed") {
          body += rect(sx, y, sw / 2, bh, { tone: "green", fill: "soft", stroke: false, r: 0 });
          body += rect(sx + sw / 2, y, sw / 2, bh, { tone: "orange", fill: "soft", stroke: false, r: 0 });
          body += rect(sx, y, sw, bh, { tone: "grey", fill: "none", r: 0 });
          body += box(sx, y, sw, bh, s.label, { fill: "none", stroke: false, size: 12.5, weight: 600 });
        } else {
          body += box(sx, y, sw, bh, s.label, { tone: KIND[s.kind].tone, size: 13.5, weight: 600 });
        }
        body += arrow(sx + sw + 2, y + bh / 2, sx + sw + arrowGap - 2, y + bh / 2, { tone: "muted" });
      });
      body += box(xEnd, y, ends, bh, "Assistant", { tone: "ink", fill: "soft", size: 13, weight: 600 });
    });
    const h = top + RECIPES.length * rowH - (rowH - bh);
    body += text(xStages + stagesW, h + 20, "R1's final RL rewards correct reasoning plus helpfulness and safety.", { anchor: "end", size: 12, tone: "muted" });

    return svg(
      {
        width: xEnd + ends + 24,
        height: h + 28,
        title: "Post-training recipes: the same building blocks in different orders",
        credit: "From the InstructGPT (2022), Tulu 3 (2024) and DeepSeek-R1 (2025) papers. Box widths don't show time or compute.",
        desc: recipes.alt,
      },
      body,
    );
  },
};

export default [beforeAfter, recipes];
