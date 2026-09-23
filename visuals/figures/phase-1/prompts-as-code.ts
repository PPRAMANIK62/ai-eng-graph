import { arrow, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Stages and labels from nodes/phase-1/prompts-as-code.md (the triage example
// and the OpenAI recipe it summarizes). No scores: the eval stage shows where
// the before/after numbers go, not made-up values.

type Line = { s: string; tone?: Tone; mono?: boolean; weight?: number; size?: number; bg?: Tone };
type Stage = { step: string; head: string; tone: Tone; lines: Line[] };

const STAGES: Stage[] = [
  {
    step: "1",
    head: "Prompt in the repo",
    tone: "blue",
    lines: [
      { s: "prompts/", mono: true, tone: "muted" },
      { s: "  ticket_triage.py", mono: true },
      { s: "" },
      { s: "def triage_prompt(", mono: true, size: 12.5 },
      { s: "    ticket, product)", mono: true, size: 12.5 },
      { s: "" },
      { s: "Typed inputs, one module", tone: "muted", size: 12.5 },
      { s: "next to the feature", tone: "muted", size: 12.5 },
    ],
  },
  {
    step: "2",
    head: "Pull request",
    tone: "purple",
    lines: [
      { s: "system prompt, 1 line", tone: "muted", size: 12.5 },
      { s: "" },
      { s: "- Answer questions.", mono: true, tone: "red", size: 12, bg: "red" },
      { s: "+ Reply with label only.", mono: true, tone: "green", size: 12, bg: "green" },
      { s: "" },
      { s: "Someone reviews the diff", tone: "muted", size: 12.5 },
      { s: "like any other change", tone: "muted", size: 12.5 },
    ],
  },
  {
    step: "3",
    head: "Eval run",
    tone: "orange",
    lines: [
      { s: "Real tickets with the", tone: "muted", size: 12.5 },
      { s: "labels you expect", tone: "muted", size: 12.5 },
    ],
  },
  {
    step: "4",
    head: "Deploy",
    tone: "green",
    lines: [
      { s: "Behind a feature flag", weight: 600 },
      { s: "for a staged release", tone: "muted", size: 12.5 },
      { s: "" },
      { s: "Model snapshot pinned", weight: 600 },
      { s: "in the same place,", tone: "muted", size: 12.5 },
      { s: "changed together", tone: "muted", size: 12.5 },
    ],
  },
];

const figure: Figure = {
  slug: "pipeline",
  alt: "A prompt change moving left to right through four steps: the prompt lives in a file in the repo, a pull request changes one line of the system prompt, an eval run compares the score before and after the change, and the change deploys behind a feature flag with the model snapshot pinned.",
  render() {
    const bw = 208, gap = 38, x0 = 28, top = 8, bh = 240, headH = 40;
    let b = "";
    STAGES.forEach((st, i) => {
      const x = x0 + i * (bw + gap);
      b += rect(x, top, bw, bh, { tone: st.tone, fill: "none", r: 10 });
      b += rect(x, top, bw, headH, { tone: st.tone, fill: "soft", r: 10 });
      // square off the header's lower corners
      b += rect(x + 0.75, top + headH - 10, bw - 1.5, 10, { tone: st.tone, fill: "soft", stroke: false, r: 0 });
      b += `<line x1="${x}" y1="${top + headH}" x2="${x + bw}" y2="${top + headH}" class="s-${st.tone}" stroke-width="1.5"/>`;
      b += `<circle cx="${x + 22}" cy="${top + headH / 2}" r="11" class="f-${st.tone}"/>`;
      b += text(x + 22, top + headH / 2, st.step, { anchor: "middle", baseline: "middle", size: 13, weight: 700, tone: "ink" }).replace(
        'class="t-ink"',
        'class="bg"',
      );
      b += text(x + 42, top + headH / 2, st.head, { baseline: "middle", size: 14.5, weight: 600 });

      let y = top + headH + 26;
      for (const l of st.lines) {
        if (!l.s) {
          y += 10;
          continue;
        }
        if (l.bg) b += rect(x + 12, y - 15, bw - 24, 21, { tone: l.bg, fill: "soft", stroke: false, r: 3 });
        b += text(x + 18, y, l.s, { size: l.size ?? 13.5, mono: l.mono, tone: l.tone, weight: l.weight });
        y += 21;
      }

      if (st.step === "3") {
        // before / after score slots, deliberately empty
        const sy = y + 10, sw = (bw - 36) / 2, sh = 62;
        for (const [j, lab] of ["before", "after"].entries()) {
          const sx = x + 12 + j * (sw + 12);
          b += rect(sx, sy, sw, sh, { tone: "orange", fill: "soft", r: 6 });
          b += text(sx + sw / 2, sy + 20, "score", { anchor: "middle", size: 12.5, tone: "muted" });
          b += text(sx + sw / 2, sy + 42, lab, { anchor: "middle", size: 14, weight: 600, tone: "orange" });
        }
        b += text(x + 18, sy + sh + 28, "Ship only if the score", { size: 12.5, tone: "muted" });
        b += text(x + 18, sy + sh + 47, "holds up", { size: 12.5, tone: "muted" });
      }

      if (i < STAGES.length - 1) b += arrow(x + bw + 8, top + bh / 2, x + bw + gap - 8, top + bh / 2, { tone: "muted", sw: 2 });
    });

    const W = x0 * 2 + STAGES.length * bw + (STAGES.length - 1) * gap;
    b += text(W / 2, top + bh + 30, "The same path a code change takes: version control, review, tests, deploy.", {
      anchor: "middle",
      size: 13.5,
      tone: "muted",
    });

    return svg(
      {
        width: W,
        height: top + bh + 44,
        title: "A prompt change goes through the same path as a code change",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
