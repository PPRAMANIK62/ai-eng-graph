import { scaleLinear } from "../../lib/chart.ts";
import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Mechanism: sources/willison-prompt-injection-gpt3.md (the translation example,
// prompts built by concatenating strings), sources/greshake-indirect-prompt-injection.md
// (indirect injection through retrieved data) and sources/owasp-llm01-prompt-injection.md
// (direct vs indirect definitions).
const twoPaths: Figure = {
  slug: "two-paths",
  alt: "Two ways untrusted text gets into the prompt. Direct: a user types an instruction into the app's input box. Indirect: an attacker plants an instruction in a web page, email or document, and the app later fetches it through search or a tool. Either way, the developer's system prompt, the user's message and the fetched content are joined into one sequence of tokens, and the model reads all of it as possible instructions.",
  render() {
    let b = "";
    // Left: sources
    b += text(20, 10, "Direct", { size: 14.5, weight: 700, tone: "orange" });
    b += box(20, 26, 250, 58, ["User types into your app:", "“Ignore the above directions…”"], { tone: "orange", size: 12.5 });
    b += text(20, 124, "Indirect", { size: 14.5, weight: 700, tone: "red" });
    b += box(20, 140, 250, 58, ["Attacker plants text in a", "web page, email or document"], { tone: "red", size: 12.5 });
    b += box(20, 220, 250, 40, "your app fetches it (search, tool)", { tone: "grey", size: 12.5 });
    b += arrow(145, 198, 145, 218, { tone: "muted" });

    // Middle: one token stream
    const X = 340;
    b += text(X, 10, "One sequence of tokens", { size: 14.5, weight: 700 });
    b += box(X, 26, 250, 50, ["System prompt", "from you, the developer"], { tone: "blue", size: 12.5 });
    b += box(X, 82, 250, 50, ["User message", "may contain instructions"], { tone: "orange", size: 12.5 });
    b += box(X, 138, 250, 50, ["Fetched content", "may contain instructions"], { tone: "red", size: 12.5 });
    b += rect(X - 8, 20, 266, 174, { tone: "grey", fill: "none", dash: true });
    b += arrow(270, 55, X - 10, 100, { tone: "orange" });
    b += arrow(270, 240, X - 10, 170, { tone: "red" });

    // Right: model
    b += box(680, 82, 110, 50, "model", { tone: "green", size: 13.5, weight: 600 });
    b += arrow(X + 260, 107, 678, 107, { tone: "muted" });
    b += text(680, 158, "reads it all as text;", { size: 12.5, tone: "muted" });
    b += text(680, 176, "no reliable way to tell", { size: 12.5, tone: "muted" });
    b += text(680, 194, "the job from the data", { size: 12.5, tone: "muted" });
    b += line(20, 280, 800, 280, { tone: "grid", sw: 1 });
    b += text(20, 302, "Like SQL injection, but with no parameterized query: there's no slot the model treats as data only.", { size: 12.5 });
    return svg(
      {
        width: 820,
        height: 312,
        title: "Two ways untrusted text reaches the model",
        credit: "Based on Willison (2022), Greshake et al. (2023) and OWASP LLM01 (2025).",
        desc: twoPaths.alt,
      },
      b,
    );
  },
};

// sources/anthropic-sonnet-5-system-card.md, Tables 5.2.2.2.A, 5.2.2.3.A, 5.2.2.4.A:
// Claude Sonnet 5, with thinking, without safeguards. Attempt-level ASR and
// scenario-level (scenarios with at least one success / total).
const ROWS = [
  { name: "Coding", sub: "40 scenarios, 200 tries each", attempt: 0.31, scen: (7 / 40) * 100, scenLabel: "7 of 40" },
  { name: "Computer use", sub: "14 scenarios, 200 tries each", attempt: 2.25, scen: (4 / 14) * 100, scenLabel: "4 of 14" },
  { name: "Browser use", sub: "129 scenarios, 10 tries each", attempt: 0.93, scen: (9 / 129) * 100, scenLabel: "9 of 129" },
];

const twoCounts: Figure = {
  slug: "two-counts",
  alt: "Grouped bar chart of prompt injection attack success for Claude Sonnet 5 with extended thinking and without extra safeguards, from its 2026 system card. Coding (40 scenarios, 200 tries each): 0.31% of tries succeeded, but 7 of 40 scenarios (17.5%) fell at least once. Computer use (14 scenarios, 200 tries each): 2.25% of tries, 4 of 14 scenarios (28.6%). Browser use (129 scenarios, 10 tries each): 0.93% of tries, 9 of 129 scenarios (7.0%). With safeguards on, browser use went to 0 of 129 scenarios, coding to 5 of 40 and computer use stayed at 4 of 14.",
  render() {
    const p = { x: 200, y: 36, w: 480, h: 240 };
    const xs = scaleLinear().domain([0, 30]).range([p.x, p.x + p.w]);
    const band = p.h / ROWS.length;
    let b = "";
    for (const t of [0, 10, 20, 30]) {
      b += line(xs(t), p.y - 6, xs(t), p.y + p.h, { tone: "grid", sw: 1 });
      b += text(xs(t), p.y + p.h + 18, `${t}%`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    ROWS.forEach((r, i) => {
      const top = p.y + i * band + 12;
      b += text(p.x - 12, top + 16, r.name, { anchor: "end", size: 13.5, weight: 600 });
      b += text(p.x - 12, top + 34, r.sub, { anchor: "end", size: 11.5, tone: "muted" });
      const bars: { v: number; tone: Tone; label: string }[] = [
        { v: r.attempt, tone: "blue", label: `${r.attempt}% of tries` },
        { v: r.scen, tone: "red", label: `${r.scen.toFixed(1)}% of scenarios (${r.scenLabel})` },
      ];
      bars.forEach((bar, j) => {
        const y = top + j * 24;
        const w = Math.max(2, xs(bar.v) - xs(0));
        b += rect(xs(0), y, w, 18, { tone: bar.tone, fill: "solid", stroke: false, r: 2 });
        b += text(xs(0) + w + 8, y + 9, bar.label, { baseline: "middle", size: 12.5, weight: 600, tone: bar.tone });
      });
    });
    b += line(xs(0), p.y - 6, xs(0), p.y + p.h, { tone: "axis" });
    // legend
    b += rect(p.x, 0, 14, 12, { tone: "blue", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 20, 6, "attempt-level: share of all tries that worked", { size: 12.5, baseline: "middle" });
    b += rect(p.x, 18, 14, 12, { tone: "red", fill: "solid", stroke: false, r: 2 });
    b += text(p.x + 20, 24, "scenario-level: share of scenarios hit at least once", { size: 12.5, baseline: "middle" });
    b += text(20, p.y + p.h + 44, "Same tests, safeguards on: browser use 0 of 129 scenarios, coding 5 of 40, computer use 4 of 14.", { size: 12.5 });
    return svg(
      {
        width: 900,
        height: p.y + p.h + 54,
        title: "Low per try, higher per scenario: one test, two counts",
        credit: "Data: Anthropic, System Card: Claude Sonnet 5 (2026), section 5.2.2. Sonnet 5 with thinking, no extra safeguards.",
        desc: twoCounts.alt,
      },
      b,
    );
  },
};

export default [twoPaths, twoCounts];
