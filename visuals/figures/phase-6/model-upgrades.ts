import { arrow, box, line, path, rect, svg, text, type Figure } from "../../lib/svg.ts";

// sources/anthropic-model-ids.md: dated IDs + moving aliases before 4.6, dateless
// pinned IDs from 4.6 on. sources/anthropic-model-deprecations.md: lifecycle,
// at least 60 days' notice, retired requests fail.
const aliasVsPinned: Figure = {
  slug: "alias-vs-pinned",
  alt: "Two ways to name a model. Top, an alias: claude-sonnet-4-5 points at the newest dated snapshot, so it could move to a newer snapshot without a code change. Bottom, a pinned ID: from the 4.6 generation on, a dateless ID such as claude-sonnet-5 is the snapshot itself and never moves; a newer model gets a new ID. A timeline shows that even a pinned ID ends: deprecation, at least 60 days' notice, then retirement, after which requests fail.",
  render() {
    let b = "";
    // alias row
    b += text(20, 10, "Alias (older models)", { size: 14, weight: 700, tone: "orange" });
    b += text(20, 30, "points at the newest dated snapshot, so it can move", { size: 12.5, tone: "muted" });
    b += box(20, 56, 170, 36, "claude-sonnet-4-5", { tone: "orange", fill: "soft", size: 12.5, weight: 600 });
    b += box(260, 56, 230, 36, "claude-sonnet-4-5-20250929", { tone: "grey", size: 12.5 });
    b += box(560, 56, 200, 36, "a newer dated snapshot", { tone: "grey", size: 12.5, dash: true });
    b += arrow(192, 74, 256, 74, { tone: "orange" });
    b += path("M105,94 C105,130 660,130 660,96", { tone: "orange", dash: true, arrow: true });
    b += text(385, 140, "could move here with no change in your code", { size: 12, anchor: "middle", tone: "orange" });
    // pinned row
    const y = 170;
    b += line(20, y - 8, 780, y - 8, { tone: "grid", sw: 1 });
    b += text(20, y + 12, "Pinned ID (4.6 generation on)", { size: 14, weight: 700, tone: "blue" });
    b += text(20, y + 32, "the dateless ID is the snapshot; a newer model gets a new ID", { size: 12.5, tone: "muted" });
    b += box(20, y + 56, 230, 36, "claude-sonnet-5 = snapshot", { tone: "blue", fill: "soft", size: 12.5, weight: 600 });
    b += box(320, y + 56, 180, 36, "claude-sonnet-5-5", { tone: "grey", size: 12.5 });
    b += text(510, y + 79, "newer model, new ID", { size: 12, tone: "muted" });
    // lifecycle
    const ly = y + 130;
    b += line(20, ly - 12, 780, ly - 12, { tone: "grid", sw: 1 });
    b += text(20, ly + 8, "Even a pinned ID ends", { size: 14, weight: 700 });
    b += line(20, ly + 50, 760, ly + 50, { tone: "axis", sw: 2 });
    const pts = [
      { x: 60, l: "active", t: "green" as const },
      { x: 300, l: "deprecated (notice sent)", t: "orange" as const },
      { x: 640, l: "retired: requests fail", t: "red" as const },
    ];
    for (const p of pts) {
      b += rect(p.x - 6, ly + 44, 12, 12, { tone: p.t, fill: "solid", stroke: false, r: 6 });
      b += text(p.x, ly + 76, p.l, { size: 12.5, anchor: "middle", tone: p.t, weight: 600 });
    }
    b += path(`M306,${ly + 34} L306,${ly + 28} L634,${ly + 28} L634,${ly + 34}`, { tone: "muted" });
    b += text(470, ly + 20, "at least 60 days' notice", { size: 12, anchor: "middle", tone: "muted" });
    return svg(
      {
        width: 800,
        height: ly + 90,
        title: "An alias can move; a pinned ID can't, but it gets retired",
        credit: "Based on Anthropic's model IDs and model deprecations docs (2026-09).",
        desc: aliasVsPinned.alt,
      },
      b,
    );
  },
};

export default [aliasVsPinned];
