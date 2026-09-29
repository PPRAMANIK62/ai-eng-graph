import { arrow, box, line, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// sources/anthropic-claude-code-auto-mode.md: the three tiers, the two-stage
// classifier, deny-and-continue with escalation after 3 consecutive or 20 total
// denials, and Table 1 (full pipeline: 0.4% FPR on 10,000 real calls, 17% FNR
// on 52 real overeager actions).
const tiers: Figure = {
  slug: "tiers",
  alt: "A funnel of permission checks in Claude Code auto mode. Tier 1: a built-in allowlist of tools that can't change anything (reads, search, code navigation) runs without a check. Tier 2: file edits inside the project directory run without a check, since they can be reviewed in version control. Tier 3: everything else (shell commands, web fetches, external tools, subagents, files outside the project) goes to a two-stage classifier, a fast yes/no filter and then careful reasoning on what it flags. Blocked actions go back to the agent with a reason. After 3 denials in a row or 20 in total, the session stops and a human decides. Measured: 0.4% of harmless actions blocked, 17% of real overeager actions missed.",
  render() {
    let b = "";
    const rows: { title: string; detail: string; tone: Tone; outcome: string }[] = [
      { title: "Tier 1: safe tools", detail: "reads, search, code navigation", tone: "green", outcome: "runs, no check" },
      { title: "Tier 2: edits in the project", detail: "reviewable in version control", tone: "green", outcome: "runs, no check" },
      { title: "Tier 3: everything else", detail: "shell, web fetch, external tools, subagents, outside files", tone: "orange", outcome: "classifier" },
    ];
    b += box(20, 10, 150, 40, "agent wants to act", { tone: "grey", size: 13 });
    rows.forEach((r, i) => {
      const y = 76 + i * 62;
      b += box(20, y, 420, 46, "", { tone: r.tone, fill: "soft" });
      b += text(34, y + 18, r.title, { size: 13.5, weight: 700 });
      b += text(34, y + 36, r.detail, { size: 12.5, tone: "muted" });
      b += arrow(442, y + 23, 498, y + 23, { tone: "muted" });
      b += text(506, y + 23, r.outcome, { size: 13, baseline: "middle", weight: 600, tone: r.tone });
    });
    b += line(95, 50, 95, 74, { tone: "muted" });
    // classifier detail
    const cy = 76 + 2 * 62 + 23;
    const cx = 620;
    b += box(cx, cy - 20, 250, 40, ["stage 1: fast yes/no,", "errs toward blocking"], { tone: "orange", size: 12.5 });
    b += box(cx, cy + 44, 250, 40, ["stage 2: reasons carefully", "about what stage 1 flagged"], { tone: "orange", size: 12.5 });
    b += arrow(cx + 125, cy + 20, cx + 125, cy + 42, { tone: "orange" });
    b += arrow(588, cy, cx - 2, cy, { tone: "muted" });
    // deny loop and human
    const hy = cy + 110;
    b += box(cx, hy, 250, 40, ["blocked: reason goes back", "to the agent, it tries again"], { tone: "red", size: 12.5, fill: "none" });
    b += arrow(cx + 125, cy + 84, cx + 125, hy - 2, { tone: "red" });
    b += box(cx, hy + 62, 250, 40, ["3 denials in a row or 20 total:", "stop, a human decides"], { tone: "purple", size: 12.5, weight: 600 });
    b += arrow(cx + 125, hy + 40, cx + 125, hy + 60, { tone: "purple" });
    // numbers
    const ny = hy + 20;
    b += text(20, ny, "Measured on the full pipeline:", { size: 13, weight: 600 });
    b += text(20, ny + 22, "0.4% of 10,000 real, harmless tool calls blocked", { size: 12.5 });
    b += text(20, ny + 42, "17% of 52 real overeager actions let through", { size: 12.5, tone: "red", weight: 600 });
    b += text(20, ny + 62, "Users had approved 93% of the old prompts.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: 900,
        height: hy + 110,
        title: "Only risky actions reach the classifier, and repeated denials reach a human",
        credit: "Based on Anthropic, “How we built Claude Code auto mode” (2026). Simplified.",
        desc: tiers.alt,
      },
      b,
    );
  },
};

export default [tiers];
