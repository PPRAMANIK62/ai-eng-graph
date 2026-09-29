import { arrow, box, lines, path, rect, svg, text, wrap, type Figure, type Tone } from "../../lib/svg.ts";

// Figure 1: the loop. Steps follow sources/shankar-data-flywheels.md (log, monitor,
// improve; regular human labels), sources/husain-shankar-ci-vs-production.md (new
// production failures go into the CI set), sources/husain-shankar-sampling-traces.md.
// No numbers on purpose: nobody publishes before/after numbers for the loop.

const loopAlt =
  "The data flywheel as a loop of five steps. Log every trace in production. Sample traces to read: some random, some flagged by feedback or judges. Find and count failures with error analysis and online evals. Add examples of each new failure to the test set you run before shipping. Fix the prompt, retrieval, code or model, check the test set passes, and ship, which produces new traces. In the middle: humans label a sample regularly to keep the graders honest.";

const loop: Figure = {
  slug: "loop",
  alt: loopAlt,
  render() {
    const cx = 420, cy = 200, rx = 300, ry = 150;
    const bw = 200, bh = 70;
    const steps: { head: string; body: string; tone: Tone; a: number }[] = [
      { head: "1  Log", body: "every trace, with its scores", tone: "blue", a: -90 },
      { head: "2  Sample", body: "some random, some flagged", tone: "purple", a: -18 },
      { head: "3  Find and count", body: "error analysis, online evals", tone: "orange", a: 54 },
      { head: "4  Add to test set", body: "a few cases per new failure", tone: "red", a: 126 },
      { head: "5  Fix and ship", body: "prompt, retrieval, code, model", tone: "green", a: 198 },
    ];
    const pos = steps.map((s) => {
      const r = (s.a * Math.PI) / 180;
      return { x: cx + rx * Math.cos(r), y: cy + ry * Math.sin(r) };
    });
    let b = "";
    // arcs between boxes
    for (let i = 0; i < steps.length; i++) {
      const a0 = steps[i].a + 20, a1 = steps[(i + 1) % steps.length].a + (i === steps.length - 1 ? 360 : 0) - 20;
      const p = (deg: number) => {
        const r = (deg * Math.PI) / 180;
        return `${(cx + rx * Math.cos(r)).toFixed(1)},${(cy + ry * Math.sin(r)).toFixed(1)}`;
      };
      b += path(`M${p(a0)} A${rx},${ry} 0 0 1 ${p(a1)}`, { tone: "muted", sw: 2, arrow: true });
    }
    steps.forEach((s, i) => {
      const { x, y } = pos[i];
      b += rect(x - bw / 2, y - bh / 2, bw, bh, { tone: s.tone, fill: "soft", r: 10 });
      b += text(x, y - 11, s.head, { size: 14.5, weight: 700, anchor: "middle", baseline: "middle" });
      b += text(x, y + 13, s.body, { size: 12.5, anchor: "middle", baseline: "middle", tone: "muted" });
    });
    // center
    b += box(cx - 125, cy - 36, 250, 72, ["Humans label a sample regularly", "to keep the graders honest"], { tone: "grey", fill: "none", dash: true, size: 13, r: 10 });
    return svg({ width: 840, height: 390, title: "One turn of the data flywheel", credit: "Our own diagram, from Shankar (2024) and Husain and Shankar's AI Evals FAQ (2025).", desc: loopAlt }, b);
  },
};

// Figure 2: sampling methods, exploratory to targeted, with blind spots.
// All text from sources/husain-shankar-sampling-traces.md.

const sampAlt =
  "Five ways to choose production traces to read, from exploratory to targeted. Random: a small batch can miss rare cases. Clustering: depends on how you grouped them. Data analysis of extremes like latency or tool count: an extreme may have nothing to do with quality. Classification by an evaluator: favors problems it already knows how to find. User feedback: misses problems users don't report. Start near the exploratory end; lean on targeted signals as you learn; keep some random traces in every batch.";

const sampling: Figure = {
  slug: "sampling",
  alt: sampAlt,
  render() {
    const M: { name: string; what: string; miss: string; tone: Tone }[] = [
      { name: "Random", what: "Equal odds for every trace", miss: "A small batch can miss rare cases", tone: "blue" },
      { name: "Clustering", what: "Examples from each group", miss: "Depends on how you grouped them", tone: "blue" },
      { name: "Data analysis", what: "Extremes: latency, tool count", miss: "An extreme may not be a quality problem", tone: "purple" },
      { name: "Classification", what: "An evaluator flags likely failures", miss: "Favors problems it already knows", tone: "orange" },
      { name: "User feedback", what: "Thumbs-downs and complaints", miss: "Misses what users don't report", tone: "red" },
    ];
    const x0 = 24, cw = 158, gap = 12, top = 46;
    let b = "";
    b += arrow(x0, 26, x0 + 5 * cw + 4 * gap, 26, { tone: "muted", sw: 2 });
    b += text(x0, 14, "More exploratory", { size: 12.5, tone: "muted", weight: 600 });
    b += text(x0 + 5 * cw + 4 * gap, 14, "More targeted", { size: 12.5, tone: "muted", weight: 600, anchor: "end" });
    M.forEach((m, i) => {
      const x = x0 + i * (cw + gap);
      b += rect(x, top, cw, 170, { tone: m.tone, fill: "none", r: 8 });
      b += rect(x, top, cw, 36, { tone: m.tone, fill: "soft", r: 8 });
      b += text(x + cw / 2, top + 18, m.name, { size: 14, weight: 700, anchor: "middle", baseline: "middle" });
      b += lines(x + 12, top + 58, wrap(m.what, cw - 24, 12.5), { size: 12.5, gap: 17 });
      b += text(x + 12, top + 104, "Blind spot:", { size: 12, weight: 600, tone: "red" });
      b += lines(x + 12, top + 122, wrap(m.miss, cw - 24, 12.5), { size: 12.5, tone: "muted", gap: 17 });
    });
    b += text(x0, top + 196, "Start exploratory, lean on targeted signals as you learn, and keep some random traces in every batch.", { size: 13, weight: 600 });
    return svg({ width: x0 * 2 + 5 * cw + 4 * gap, height: top + 206, title: "Choosing which production traces to read", credit: "Adapted from Husain and Shankar, AI Evals FAQ (2025).", desc: sampAlt }, b);
  },
};

export default [loop, sampling];
