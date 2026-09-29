import { arrow, box, lines, rect, svg, text, type Figure } from "../../lib/svg.ts";

// Layout: sources/packer-memgpt.md (main context = system instructions, working
// context, FIFO queue; external = recall storage, archival storage; evicted
// messages go to recall storage and a recursive summary) and
// sources/letta-agent-memory.md (core memory blocks, recall, archival, vector search).
// Memory files: sources/anthropic-memory-tool.md (/memories) and
// sources/anthropic-context-engineering.md (NOTES.md).
const where: Figure = {
  slug: "where",
  alt: "Where an agent's memory lives. Inside the context window, seen on every call: the system prompt and instructions, a few small memory blocks the agent can edit (who the user is, the current goal), and the recent messages and tool results of this run. Outside the window, fetched with tool calls: memory files the agent writes and reads (like a /memories folder or NOTES.md), the full message history it can search, and a knowledge store it can search. When the window fills, old messages move out to the history store and get folded into a summary.",
  render() {
    let b = "";
    // Inside the window
    const L = { x: 20, y: 0, w: 360, h: 330 };
    b += rect(L.x, L.y, L.w, L.h, { tone: "blue", fill: "none", sw: 2 });
    b += text(L.x + 16, L.y + 24, "Inside the context window", { size: 15, weight: 700, tone: "blue" });
    b += text(L.x + 16, L.y + 44, "seen on every call, costs tokens every call", { size: 12.5, tone: "muted" });
    b += box(L.x + 16, 64, L.w - 32, 46, "System prompt and instructions", { tone: "grey", size: 13 });
    b += box(L.x + 16, 122, L.w - 32, 58, ["Memory blocks (small, editable)", "who the user is · current goal"], { tone: "blue", size: 13 });
    b += box(L.x + 16, 192, L.w - 32, 120, ["Recent messages", "and tool results", "of this run"], { tone: "grey", size: 13 });

    // Outside the window
    const R = { x: 540, y: 0, w: 360, h: 330 };
    b += rect(R.x, R.y, R.w, R.h, { tone: "orange", fill: "none", sw: 2, dash: true });
    b += text(R.x + 16, R.y + 24, "Outside the window", { size: 15, weight: 700, tone: "orange" });
    b += text(R.x + 16, R.y + 44, "kept in storage you own, fetched with tools", { size: 12.5, tone: "muted" });
    const rows = [
      { y: 64, t: ["Memory files the agent writes", "/memories folder, NOTES.md"] },
      { y: 150, t: ["Full message history", "searchable, survives eviction"] },
      { y: 236, t: ["Knowledge store", "searchable, often vector search"] },
    ];
    for (const r of rows) b += box(R.x + 16, r.y, R.w - 32, 64, r.t, { tone: "orange", size: 13 });

    // Tool-call arrows between them
    b += arrow(L.x + L.w + 8, 140, R.x - 8, 96, { tone: "muted" });
    b += arrow(R.x - 8, 110, L.x + L.w + 8, 154, { tone: "muted" });
    b += lines(460, 70, ["tool calls:", "read and write"], { anchor: "middle", size: 12.5, tone: "muted" });
    b += arrow(R.x - 8, 176, L.x + L.w + 8, 206, { tone: "muted" });
    b += text(460, 172, "search", { anchor: "middle", size: 12.5, tone: "muted" });

    // Eviction
    b += arrow(L.x + L.w + 8, 262, R.x - 8, 200, { tone: "blue", dash: true });
    b += lines(460, 282, ["when the window fills:", "old turns move out,", "folded into a summary"], {
      anchor: "middle",
      size: 12,
      tone: "blue",
    });
    return svg(
      {
        width: 920,
        height: 340,
        title: "Where an agent's memory lives",
        credit: "Adapted from MemGPT (Packer et al., 2023) and Letta (2025), with Claude's memory tool.",
        desc: where.alt,
      },
      b,
    );
  },
};

// sources/anthropic-long-running-harnesses.md: initializer writes the feature
// list (JSON, 200+ features), claude-progress.txt and a first git commit; each
// session runs pwd, reads git log and progress, picks the top unfinished
// feature, tests end to end, commits and updates progress.
const sessions: Figure = {
  slug: "sessions",
  alt: "Memory across sessions as a handoff. Session 1, the initializer, writes a feature list, a progress file and a first git commit. Each later session starts with an empty context window, reads the progress file and the git log, picks one unfinished feature, builds and tests it end to end, then commits and updates the progress file. The files and the git history persist between sessions; the context windows don't.",
  render() {
    let b = "";
    const cols = [
      { title: "Session 1: initializer", tone: "purple" as const, steps: ["set up the project", "write the feature list", "(200+ features, JSON)", "start the progress file", "first git commit"] },
      { title: "Session 2", tone: "blue" as const, steps: ["read progress file", "and git log", "pick one unfinished feature", "build it, test end to end", "commit, update progress"] },
      { title: "Session 3", tone: "blue" as const, steps: ["read progress file", "and git log", "pick one unfinished feature", "build it, test end to end", "commit, update progress"] },
    ];
    const w = 240;
    const gap = 50;
    cols.forEach((c, i) => {
      const x = 20 + i * (w + gap);
      b += rect(x, 0, w, 190, { tone: c.tone, fill: "soft" });
      b += text(x + 14, 22, c.title, { size: 14, weight: 700, tone: c.tone });
      b += text(x + 14, 42, "context window starts empty", { size: 12, tone: "muted", italic: true });
      b += lines(x + 14, 70, c.steps, { size: 13, gap: 22 });
      if (i < cols.length - 1) b += arrow(x + w + 6, 95, x + w + gap - 6, 95, { tone: "muted" });
      // read / write with the persistent layer
      b += arrow(x + 70, 196, x + 70, 244, { tone: "green" });
      b += text(x + 78, 224, "writes", { size: 12, tone: "green" });
      if (i > 0) {
        b += arrow(x + 170, 244, x + 170, 196, { tone: "green" });
        b += text(x + 178, 224, "reads", { size: 12, tone: "green" });
      }
    });
    b += text(20 + 3 * (w + gap) - 30, 95, "…", { size: 20, tone: "muted", baseline: "middle" });
    // persistent layer
    const px = 20;
    const pw = 3 * w + 2 * gap;
    b += rect(px, 250, pw, 64, { tone: "green", fill: "soft" });
    b += text(px + 16, 274, "Persists between sessions", { size: 14, weight: 700, tone: "green" });
    b += text(px + 16, 296, "feature list (JSON, only a passes field may change) · progress file · git history", { size: 13 });
    return svg(
      {
        width: 900,
        height: 324,
        title: "Memory across sessions is a handoff note",
        credit: "Adapted from Anthropic, “Effective harnesses for long-running agents” (2025).",
        desc: sessions.alt,
      },
      b,
    );
  },
};

export default [where, sessions];
