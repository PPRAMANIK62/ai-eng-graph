import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Our own worked example (a refund agent), built on the ideas in
// sources/anthropic-demystifying-evals.md (outcome = final state in the
// environment; rigid step checks fail valid routes; partial-credit refund
// example) and sources/langsmith-trajectory-evals.md (strict match).
const outcomeVsSteps: Figure = {
  slug: "outcome-vs-steps",
  alt: "Outcome first, steps to diagnose. Two runs of a refund agent reach the same correct end state by different routes. Run A: look up the order, check the policy, verify the customer, issue the refund. Run B: look up the order, verify the customer, check the policy, issue the refund. An outcome check queries the payments database and passes both. A strict trajectory match against Run A as the reference passes Run A and fails Run B, even though Run B did the job. A rule check (the refund must come after verifying the customer) passes both.",
  render() {
    let b = "";
    const runs = [
      { name: "Run A", steps: ["look up order", "check policy", "verify customer", "issue refund"] },
      { name: "Run B", steps: ["look up order", "verify customer", "check policy", "issue refund"] },
    ];
    const cw = 128;
    const gap = 26;
    runs.forEach((r, i) => {
      const y = i * 62;
      b += text(20, y + 20, r.name, { size: 14, weight: 700, baseline: "middle" });
      r.steps.forEach((s, j) => {
        const x = 90 + j * (cw + gap);
        const tone: Tone = s === "verify customer" ? "purple" : s === "check policy" ? "blue" : "grey";
        b += box(x, y, cw, 40, s, { tone, size: 13 });
        if (j < r.steps.length - 1) b += arrow(x + cw + 3, y + 20, x + cw + gap - 3, y + 20, { tone: "muted" });
      });
      const ex = 90 + 4 * (cw + gap);
      b += arrow(ex - gap + 3, y + 20, ex + 14, y + 20, { tone: "muted" });
      b += box(ex + 16, y, 150, 40, "refund row exists", { tone: "green", size: 13, weight: 600 });
    });

    // Checks table
    const ty = 150;
    b += line(20, ty - 14, 860, ty - 14, { tone: "grid", sw: 1 });
    const cols = [
      { x: 330, t: ["Outcome check", "query the payments DB"] },
      { x: 530, t: ["Strict match", "reference = Run A"] },
      { x: 730, t: ["Rule check", "refund after verify"] },
    ];
    for (const c of cols) {
      b += text(c.x, ty + 4, c.t[0], { anchor: "middle", size: 13.5, weight: 700 });
      b += text(c.x, ty + 22, c.t[1], { anchor: "middle", size: 12, tone: "muted" });
    }
    const results = [
      ["pass", "pass", "pass"],
      ["pass", "FAIL", "pass"],
    ];
    results.forEach((row, i) => {
      const y = ty + 56 + i * 36;
      b += text(20, y, runs[i].name, { size: 13.5, weight: 600, baseline: "middle" });
      row.forEach((r, j) => {
        const tone: Tone = r === "pass" ? "green" : "red";
        b += rect(cols[j].x - 38, y - 13, 76, 26, { tone, fill: "soft" });
        b += text(cols[j].x, y, r, { anchor: "middle", baseline: "middle", size: 13, weight: 700, tone });
      });
    });
    b += text(20, ty + 140, "Run B did the job. Only the strict match says it failed.", { size: 13, tone: "muted", italic: true });
    return svg(
      {
        width: 880,
        height: ty + 150,
        title: "Grade the outcome; check steps only for rules",
        credit: "Illustrative example. Ideas from Anthropic, “Demystifying evals for AI agents” (2026), and LangSmith docs.",
        desc: outcomeVsSteps.alt,
      },
      b,
    );
  },
};

// sources/langsmith-trajectory-evals.md: strict = same calls same order;
// unordered = same calls any order; subset = only reference tools, no extras;
// superset = at least the reference tools, extras allowed. Example runs are ours.
const matchModes: Figure = {
  slug: "match-modes",
  alt: "The four trajectory match modes, checked against one reference run: look up order, check policy, issue refund. A run with the same calls in the same order passes all four. A run with the same calls in a different order fails strict and passes unordered, subset and superset. A run with one extra call (search FAQ) fails strict, unordered and subset, and passes superset. A run that skips checking the policy fails strict, unordered and superset, and passes subset.",
  render() {
    let b = "";
    const chip = (x: number, y: number, s: string, tone: Tone = "grey") => {
      const w = s.length * 7 + 18;
      b += box(x, y, w, 26, s, { tone, size: 12.5 });
      return x + w + 6;
    };
    b += text(20, 13, "Reference", { size: 13.5, weight: 700, baseline: "middle" });
    let x = 150;
    for (const s of ["look up order", "check policy", "issue refund"]) x = chip(x, 0, s, "blue");

    const modes = ["Strict", "Unordered", "Subset", "Superset"];
    const mx0 = 610;
    const mw = 82;
    const hy = 52;
    modes.forEach((m, i) => b += text(mx0 + i * mw + mw / 2, hy, m, { anchor: "middle", size: 13, weight: 700 }));
    b += line(20, hy + 14, mx0 + 4 * mw, hy + 14, { tone: "grid", sw: 1 });

    const rows: { label: string; calls: [string, Tone][]; res: boolean[] }[] = [
      { label: "same order", calls: [["look up order", "grey"], ["check policy", "grey"], ["issue refund", "grey"]], res: [true, true, true, true] },
      { label: "other order", calls: [["check policy", "grey"], ["look up order", "grey"], ["issue refund", "grey"]], res: [false, true, true, true] },
      { label: "extra call", calls: [["look up order", "grey"], ["check policy", "grey"], ["search FAQ", "orange"], ["issue refund", "grey"]], res: [false, false, false, true] },
      { label: "skips a call", calls: [["look up order", "grey"], ["issue refund", "grey"]], res: [false, false, true, false] },
    ];
    rows.forEach((r, i) => {
      const y = hy + 32 + i * 44;
      b += text(20, y + 13, r.label, { size: 13, tone: "muted", baseline: "middle" });
      let cx = 150;
      for (const [s, t] of r.calls) cx = chip(cx, y, s, t);
      r.res.forEach((ok, j) => {
        const tone: Tone = ok ? "green" : "red";
        const cxm = mx0 + j * mw + mw / 2;
        b += rect(cxm - 30, y, 60, 26, { tone, fill: "soft" });
        b += text(cxm, y + 13, ok ? "pass" : "fail", { anchor: "middle", baseline: "middle", size: 12.5, weight: 700, tone });
      });
    });
    return svg(
      {
        width: mx0 + 4 * mw + 20,
        height: hy + 32 + rows.length * 44,
        title: "Four ways to match a run against a reference",
        credit: "Mode definitions from LangSmith trajectory evals (agentevals). Example runs are illustrative.",
        desc: matchModes.alt,
      },
      b,
    );
  },
};

export default [outcomeVsSteps, matchModes];
