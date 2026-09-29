import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// The loop: sources/anthropic-agent-sdk-loop.md (evaluate, tool calls feed back,
// ends on a response with no tool calls; max_turns, max_budget_usd, hooks) and
// sources/openai-practical-guide-agents.md (run loop and exit conditions).
const cycle: Figure = {
  slug: "cycle",
  alt: "The agent loop. The task and the system prompt go to the model. The model either asks for one or more tool calls, which your code runs and feeds back as results for the next model call, or it answers with no tool call, which ends the loop. Around the loop, your code enforces a turn limit and a budget, and can pause for a person to approve risky actions.",
  render() {
    let b = "";
    // task
    b += box(20, 150, 150, 56, ["task +", "system prompt"], { tone: "grey", size: 13 });
    b += arrow(172, 178, 258, 178, { tone: "muted" });
    // model
    b += box(260, 148, 170, 60, "model", { tone: "blue", size: 15, weight: 700 });
    // tools box above the model, two vertical arrows between them
    b += box(260, 10, 170, 50, ["your code runs", "the tools"], { tone: "orange", size: 13 });
    b += arrow(305, 146, 305, 62, { tone: "orange", sw: 2 });
    b += text(295, 108, "tool calls", { size: 12.5, tone: "orange", weight: 600, anchor: "end" });
    b += arrow(385, 62, 385, 146, { tone: "orange", sw: 2 });
    b += text(395, 100, "results go back in", { size: 12.5, tone: "orange", weight: 600 });
    b += text(395, 117, "(one round trip = one turn)", { size: 12, tone: "muted" });
    // final answer branch
    b += arrow(432, 178, 710, 178, { tone: "green", sw: 2 });
    b += text(570, 170, "no tool call", { size: 12.5, tone: "green", weight: 600, anchor: "middle" });
    b += box(712, 152, 170, 52, ["final answer,", "loop ends"], { tone: "green", size: 13 });
    // controls
    const cy = 250;
    b += line(20, cy - 14, 882, cy - 14, { tone: "grid", sw: 1 });
    b += text(20, cy + 6, "What your code adds around the loop", { size: 13.5, weight: 600 });
    const ctl: { label: string[]; tone: Tone }[] = [
      { label: ["turn limit", "max_turns"], tone: "grey" },
      { label: ["budget", "max_budget_usd"], tone: "grey" },
      { label: ["hook before each tool", "block or ask a person"], tone: "purple" },
    ];
    ctl.forEach((c, i) => {
      b += box(20 + i * 290, cy + 22, 270, 48, c.label, { tone: c.tone, size: 12.5 });
    });
    return svg(
      {
        width: 900,
        height: cy + 80,
        title: "The agent loop: call the model, run its tools, repeat",
        credit: "Based on the Claude Agent SDK docs and OpenAI's practical guide to building agents (2025).",
        desc: cycle.alt,
      },
      b,
    );
  },
};

// The auth.ts run from sources/anthropic-agent-sdk-loop.md (four turns: npm test with three
// failures; read two files; edit and re-run, all pass; final text). Context accumulation is
// from the same note. No token counts are given, so bar lengths are illustrative.
const TURNS = [
  { head: "Turn 1", adds: "system prompt, tools, task", back: "npm test: 3 failures" },
  { head: "Turn 2", adds: "+ test output", back: "auth.ts, auth.test.ts" },
  { head: "Turn 3", adds: "+ two files", back: "edit; npm test: all pass" },
  { head: "Final", adds: "+ edit and new test output", back: "text reply, no tool call" },
];
const SEG = [150, 70, 150, 90]; // illustrative widths of what each turn adds

const context: Figure = {
  slug: "context",
  alt: "The auth.ts run as it grows. Turn 1 sends the system prompt, tool definitions and task, and gets back the npm test output. Turn 2 sends all of that plus the test output and gets back two files. Turn 3 sends all of that plus the two files, edits and re-runs the tests. The final turn sends everything and gets back a text reply. Each turn's input contains every earlier turn. Bar lengths show the shape, not measured token counts.",
  render() {
    let b = "";
    const X = 90, ROW = 62;
    const tones: Tone[] = ["grey", "orange", "blue", "purple"];
    TURNS.forEach((t, i) => {
      const y = 20 + i * ROW;
      b += text(X - 12, y + 14, t.head, { anchor: "end", size: 13.5, weight: 600, baseline: "middle" });
      let x = X;
      for (let j = 0; j <= i; j++) {
        b += rect(x, y, SEG[j], 28, { tone: tones[j], fill: j === i ? "solid" : "soft", stroke: j !== i, r: 3, sw: 1 });
        x += SEG[j] + 2;
      }
      b += text(X, y + 44, `sends: ${t.adds}`, { size: 12, tone: "muted" });
      b += text(x + 12, y + 14, `gets back: ${t.back}`, { size: 12.5, baseline: "middle" });
    });
    b += text(X, 20 + 4 * ROW + 6, "Solid: new this turn. Every turn re-sends everything before it. Bar lengths are illustrative, not measured tokens.", {
      size: 12,
      tone: "muted",
      italic: true,
    });
    return svg(
      {
        width: 900,
        height: 20 + 4 * ROW + 14,
        title: "What each turn sends in the auth.ts run",
        credit: "Run from the Claude Agent SDK docs, “How the agent loop works”.",
        desc: context.alt,
      },
      b,
    );
  },
};

export default [cycle, context];
