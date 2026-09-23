import { arrow, box, line, lines, path, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// The two-step recipe and the KL "stay close" penalty: sources/ouyang-instructgpt.md
// (Abstract, §3.2, §3.5, Figure 2). Numbers (33k prompts, 4 to 9 answers) from §3.2 and §3.5.
const loop: Figure = {
  slug: "loop",
  alt: "The two steps of RLHF. Step 1: a person compares two answers to a prompt and picks B; many of these prompt, winner, loser triples (about 33,000 prompts for InstructGPT) train a reward model that gives any answer one score. Step 2: the language model writes an answer, the reward model scores it, and the score updates the language model, while a penalty keeps it close to the starting model.",
  render() {
    let body = "";
    const panelW = 430, gapX = 40, x1 = 24, x2 = x1 + panelW + gapX, ph = 380;
    const head = (x: number, n: string, t: string, tone: Tone) =>
      rect(x, 0, panelW, ph, { tone, fill: "none", dash: true }) +
      text(x + 18, 28, n, { size: 12.5, weight: 700, tone }) +
      text(x + 18, 48, t, { size: 15, weight: 700 });

    // Step 1
    body += head(x1, "STEP 1", "Train a reward model on comparisons", "orange");
    const cx = x1 + 18;
    body += box(cx, 70, 190, 34, "Prompt", { tone: "grey", size: 13 });
    body += box(cx, 118, 88, 44, ["Answer A"], { tone: "grey", size: 13 });
    body += box(cx + 102, 118, 88, 44, ["Answer B"], { tone: "green", size: 13, weight: 700 });
    body += text(cx + 95, 184, "A person picks the better one: B", { anchor: "middle", size: 12.5, tone: "green", weight: 600 });
    // stack of triples
    const sx = cx + 240, sy = 74;
    for (let k = 2; k >= 0; k--) body += rect(sx + k * 6, sy + k * 6, 150, 88, { tone: "grey", fill: "soft" });
    body += lines(sx + 14, sy + 30, ["prompt", "winner: B", "loser: A"], { size: 13, gap: 19 });
    body += arrow(cx + 196, 140, sx - 6, 130, { tone: "muted" });
    body += lines(cx, 214, ["Repeat for ~33,000 prompts, each with", "4 to 9 answers ranked (InstructGPT, 2022)"], { size: 12, tone: "muted", gap: 16 });
    // reward model
    const rmY = 262;
    body += arrow(sx + 81, sy + 104, sx + 81, rmY - 2, { tone: "muted" });
    body += box(cx, rmY, panelW - 36, 48, "Reward model", { tone: "orange", size: 15, weight: 700 });
    body += text(x1 + panelW / 2, rmY + 74, "Takes a prompt and any answer, returns one score.", { anchor: "middle", size: 13 });
    body += text(x1 + panelW / 2, rmY + 94, "Trained to score the winner above the loser.", { anchor: "middle", size: 12, tone: "muted" });

    // Step 2
    body += head(x2, "STEP 2", "Optimize the model against it (RL, PPO)", "blue");
    const lmX = x2 + 30, lmY = 110, lmW = 170, lmH = 56;
    body += box(lmX, 70, lmW, 30, "Prompt", { tone: "grey", size: 13 });
    body += arrow(lmX + lmW / 2, 100, lmX + lmW / 2, lmY - 2, { tone: "muted" });
    body += box(lmX, lmY, lmW, lmH, "Language model", { tone: "blue", size: 14, weight: 700 });
    const ansX = x2 + 250;
    body += arrow(lmX + lmW + 2, lmY + lmH / 2, ansX - 2, lmY + lmH / 2, { tone: "muted" });
    body += box(ansX, lmY + 6, 150, 44, "Its answer", { tone: "grey", size: 13 });
    const rm2Y = 210;
    body += arrow(ansX + 75, lmY + 52, ansX + 75, rm2Y - 2, { tone: "muted" });
    body += box(ansX, rm2Y, 150, 44, "Reward model", { tone: "orange", size: 13.5, weight: 700 });
    // update arrow back to LM
    const ux = lmX + 80;
    body += path(`M${ansX},${rm2Y + 22} L${ux},${rm2Y + 22} L${ux},${lmY + lmH + 3}`, { tone: "blue", sw: 2, arrow: true });
    body += text(ansX - 10, rm2Y + 14, "score", { anchor: "end", size: 12.5, weight: 700, tone: "orange" });
    body += lines(ansX - 10, rm2Y + 44, ["update: make high-scoring", "answers more likely"], { size: 12, tone: "blue", gap: 16, anchor: "end" });
    // leash
    const stY = 316, lx = lmX + 28;
    body += box(lmX, stY, lmW, 44, "Starting model (SFT)", { tone: "grey", size: 13, dash: true });
    body += line(lx, lmY + lmH, lx, stY, { tone: "red", sw: 2.5, dash: true });
    body += lines(lmX + lmW + 14, stY + 16, ["Leash: a penalty for drifting", "too far from the starting model"], { size: 12.5, tone: "red", weight: 600, gap: 17 });

    return svg(
      {
        width: x2 + panelW + 24,
        height: ph + 6,
        title: "RLHF in two steps: learn a scorer, then chase its score on a leash",
        credit: "Adapted from figure 2 of the InstructGPT paper, Ouyang et al. (OpenAI), 2022.",
        desc: loop.alt,
      },
      body,
    );
  },
};

// Chat and the 98%: sources/sharma-sycophancy.md (§3.2, Figure 2). The paper's own
// question isn't in the note, so the question and answers are described, not quoted.
const caving: Figure = {
  slug: "are-you-sure",
  alt: "A chat: the user asks a factual question, the model answers correctly, the user says I don't think that's right. Are you sure?, and the model apologizes and switches to a wrong answer. Beside it, a bar showing Claude 1.3 wrongly admitted a mistake on 98% of questions in a 2023 study.",
  render() {
    let body = "";
    const bw = 330;
    const userX = 24 + 120, botX = 24;
    const bubble = (x: number, y: number, h: number, who: string, ls: string[], tone: Tone, italic: boolean) =>
      rect(x, y, bw, h, { tone, fill: "soft", r: 12 }) +
      text(x + 14, y + 20, who, { size: 11.5, weight: 700, tone }) +
      lines(x + 14, y + 42, ls, { size: 13.5, italic, tone: italic ? "muted" : "ink", gap: 19 });
    body += bubble(userX, 0, 56, "USER", ["[asks a factual question]"], "grey", true);
    body += bubble(botX, 70, 56, "ASSISTANT", ["[gives the correct answer]"], "green", true);
    body += bubble(userX, 140, 56, "USER", ["I don't think that's right. Are you sure?"], "grey", false);
    body += bubble(botX, 210, 76, "ASSISTANT", ["[apologizes, says it made a mistake,", "and switches to a wrong answer]"], "red", true);
    body += text(botX + bw + 14, 98, "correct", { size: 13, weight: 700, tone: "green", baseline: "middle" });
    body += text(botX + bw + 14, 248, "now wrong", { size: 13, weight: 700, tone: "red", baseline: "middle" });

    // Bar
    const bx = 540, by = 90, bLen = 280, bh = 34;
    body += text(bx, by - 42, "Claude 1.3 (2023)", { size: 14, weight: 700 });
    body += text(bx, by - 22, "questions where it wrongly admitted a mistake", { size: 12.5, tone: "muted" });
    body += rect(bx, by, bLen, bh, { tone: "grey", fill: "soft", r: 4 });
    body += rect(bx, by, bLen * 0.98, bh, { tone: "red", fill: "soft", r: 4 });
    body += text(bx + bLen * 0.98 - 10, by + bh / 2, "98%", { anchor: "end", baseline: "middle", size: 15, weight: 700, tone: "ink" });
    body += text(bx, by + bh + 18, "0%", { size: 11.5, tone: "muted" });
    body += text(bx + bLen, by + bh + 18, "100%", { anchor: "end", size: 11.5, tone: "muted" });
    body += lines(bx, by + bh + 58, ["All five assistants tested in 2023 showed", "sycophancy of some kind."], { size: 12.5, tone: "muted", gap: 18 });

    return svg(
      {
        width: bx + bLen + 30,
        height: 292,
        title: "Push back once, and the model caves",
        credit: "Redrawn from figure 2 of Sharma et al. (Anthropic), 2023. Bracketed lines describe the replies rather than quote them.",
        desc: caving.alt,
      },
      body,
    );
  },
};

export default [loop, caving];
