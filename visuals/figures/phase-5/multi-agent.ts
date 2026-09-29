import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, circle, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Left: the Flappy Bird example, sources/cognition-dont-build-multi-agents.md.
// Right: "writes stay single-threaded", read-only helpers, review agent,
// sources/cognition-multi-agents-working.md.
const writers: Figure = {
  slug: "writers",
  alt: "Two ways to split \"build a Flappy Bird clone\". Left, parallel writers: a lead splits the task, one subagent builds a background that looks like Super Mario Bros., another builds a bird that moves nothing like Flappy Bird's, and the lead has to merge two mismatched parts. Right, one writer with helpers: a single agent writes all the code, while read-only helpers search, review or advise and send back only what they found.",
  render() {
    let b = "";
    // Left
    const L = 20;
    b += text(L, 10, "Parallel writers", { size: 14.5, weight: 700, tone: "red" });
    b += text(L, 30, "each subagent makes its own decisions", { size: 12.5, tone: "muted" });
    b += box(L + 110, 50, 180, 40, "lead: “Flappy Bird clone”", { tone: "grey", size: 12.5 });
    b += arrow(L + 170, 92, L + 90, 128, { tone: "muted" });
    b += arrow(L + 230, 92, L + 310, 128, { tone: "muted" });
    b += box(L, 130, 180, 58, ["background:", "looks like Super Mario"], { tone: "red", size: 12.5 });
    b += box(L + 220, 130, 180, 58, ["bird: moves nothing", "like Flappy Bird's"], { tone: "red", size: 12.5 });
    b += arrow(L + 90, 190, L + 170, 228, { tone: "muted" });
    b += arrow(L + 310, 190, L + 230, 228, { tone: "muted" });
    b += box(L + 90, 230, 220, 44, ["lead merges two", "mismatched parts"], { tone: "red", fill: "none", size: 12.5, weight: 600 });

    // Right
    const R = 480;
    b += line(R - 24, 0, R - 24, 290, { tone: "grid", sw: 1 });
    b += text(R, 10, "One writer, read-only helpers", { size: 14.5, weight: 700, tone: "green" });
    b += text(R, 30, "helpers add information, only one agent acts", { size: 12.5, tone: "muted" });
    const cx = R + 200, cy = 170;
    b += box(cx - 90, cy - 30, 180, 60, ["one agent", "writes all the code"], { tone: "green", size: 13, weight: 600 });
    const helpers: { label: string; x: number; y: number }[] = [
      { label: "search helper", x: R, y: 60 },
      { label: "code search helper", x: R + 270, y: 60 },
      { label: "review agent", x: R, y: 250 },
      { label: "stronger model to ask", x: R + 270, y: 250 },
    ];
    for (const h of helpers) {
      b += box(h.x, h.y, 150, 34, h.label, { tone: "blue", size: 12 });
      const hx = h.x + 75, hy = h.y + 17;
      const tx = hx < cx ? cx - 60 : cx + 60;
      const ty = hy < cy ? cy - 32 : cy + 32;
      b += arrow(hx, hy < cy ? hy + 19 : hy - 19, tx, ty, { tone: "blue", dash: true });
    }
    b += text(cx, 125, "findings only", { anchor: "middle", size: 12, tone: "blue", italic: true });
    return svg(
      {
        width: 920,
        height: 295,
        title: "Where splitting breaks: parallel writes",
        credit: "Example from Cognition, “Don't Build Multi-Agents” (2025); right side after “Multi-Agents: What's Actually Working” (2026).",
        desc: writers.alt,
      },
      b,
    );
  },
};

// sources/kim-scaling-agent-systems.md: Figure 2 caption and section 4.2. Range of relative
// change of the four multi-agent variants vs single agent, equal token budgets.
const BENCH: { name: string; lo: number; hi: number; note: string }[] = [
  { name: "Finance Agent", lo: 57, hi: 80.8, note: "financial analysis" },
  { name: "BrowseComp-Plus", lo: -35, hi: 9.2, note: "web research" },
  { name: "Workbench", lo: -11, hi: 5.6, note: "workplace tasks" },
  { name: "Terminal-Bench", lo: -19.2, hi: 1.7, note: "command-line tasks" },
  { name: "SWE-bench Verified", lo: -14.9, hi: -2.1, note: "coding" },
  { name: "PlanCraft", lo: -70, hi: -39.1, note: "sequential planning" },
];

const scaling: Figure = {
  slug: "scaling",
  alt: "For each of six agent benchmarks, the range of relative change from four multi-agent setups compared with a single agent at the same token budget. Finance Agent: +57% to +80.8%. BrowseComp-Plus: −35% to +9.2%. Workbench: −11% to +5.6%. Terminal-Bench: −19.2% to +1.7%. SWE-bench Verified: −14.9% to −2.1%. PlanCraft: −70% to −39.1%. Averaged across everything, the change was −0.3%.",
  render() {
    const p = { x: 200, y: 20, w: 520 };
    const xs = scaleLinear().domain([-80, 90]).range([p.x, p.x + p.w]);
    const ROW = 48;
    const H = BENCH.length * ROW;
    let b = "";
    for (const t of [-75, -50, -25, 0, 25, 50, 75]) {
      b += line(xs(t), p.y, xs(t), p.y + H, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + H + 16, t > 0 ? `+${t}%` : `${t}%`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    BENCH.forEach((r, i) => {
      const y = p.y + i * ROW + ROW / 2;
      const tone: Tone = r.lo > 0 ? "green" : r.hi < 0 ? "red" : "orange";
      b += text(p.x - 12, y - 6, r.name, { anchor: "end", baseline: "middle", size: 13, weight: 600 });
      b += text(p.x - 12, y + 10, r.note, { anchor: "end", baseline: "middle", size: 11.5, tone: "muted" });
      b += rect(xs(r.lo), y - 8, xs(r.hi) - xs(r.lo), 16, { tone, fill: "solid", stroke: false, r: 3 });
      b += circle(xs(r.lo), y, 4, { tone });
      b += circle(xs(r.hi), y, 4, { tone });
      const fmtp = (n: number) => (n > 0 ? `+${n}%` : `−${Math.abs(n)}%`);
      b += text(xs(r.hi) + 8, y, `${fmtp(r.lo)} to ${fmtp(r.hi)}`, { baseline: "middle", size: 12, weight: 600, tone });
    });
    b += line(xs(0), p.y - 6, xs(0), p.y + H, { tone: "axis", sw: 1.5 });
    b += text(xs(0) + 6, p.y - 6, "single agent", { size: 11.5, tone: "muted" });
    b += text(p.x + p.w / 2, p.y + H + 38, "change vs a single agent, range over four multi-agent setups. Mean over all: −0.3%", {
      anchor: "middle",
      size: 12,
      tone: "muted",
    });
    return svg(
      {
        width: p.x + p.w + 190,
        height: p.y + H + 48,
        title: "Same token budget: more agents helped on one task shape, hurt on others",
        credit: "Data: Kim et al., “Towards a Science of Scaling Agent Systems” (v3, 2026), Figure 2 and section 4.2.",
        desc: scaling.alt,
      },
      b,
    );
  },
};

export default [writers, scaling];
