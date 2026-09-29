import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Redrawn from the participants diagram in sources/mcp-architecture.md:
// one client per server, local servers over stdio, remote over Streamable HTTP.
const architecture: Figure = {
  slug: "architecture",
  alt: "An MCP host (an AI application such as VS Code or Claude Code) contains the model and one MCP client per server. Client 1 talks to a local filesystem server over stdio. Client 2 talks to a local database server over stdio. Client 3 talks to a remote Sentry server over Streamable HTTP. Each client has its own connection to exactly one server.",
  render() {
    let b = "";
    // host
    b += rect(20, 10, 360, 290, { tone: "blue", fill: "soft", r: 10 });
    b += text(40, 36, "MCP host", { size: 15, weight: 700, tone: "blue" });
    b += text(40, 56, "the AI app, e.g. VS Code or Claude Code", { size: 12.5, tone: "muted" });
    b += box(40, 76, 110, 200, ["model", "", "sees one", "merged", "tool list"], { tone: "green", size: 12.5, fill: "solid", textTone: "ink" });
    const rows: { client: string; server: string[]; transport: string; tone: Tone; remote: boolean }[] = [
      { client: "MCP client 1", server: ["filesystem server", "local process"], transport: "stdio", tone: "grey", remote: false },
      { client: "MCP client 2", server: ["database server", "local process"], transport: "stdio", tone: "grey", remote: false },
      { client: "MCP client 3", server: ["Sentry server", "remote service"], transport: "Streamable HTTP", tone: "orange", remote: true },
    ];
    rows.forEach((r, i) => {
      const y = 80 + i * 72;
      b += box(210, y, 150, 48, r.client, { tone: "blue", size: 13, weight: 600, fill: "none" });
      b += line(150, 176, 208, y + 24, { tone: "muted" });
      b += arrow(362, y + 24, 578, y + 24, { tone: r.remote ? "orange" : "muted", arrowStart: true });
      b += text(470, y + 16, r.transport, { anchor: "middle", size: 12.5, tone: r.remote ? "orange" : "muted", mono: true });
      b += box(580, y, 200, 48, r.server, { tone: r.tone, size: 12.5 });
    });
    b += text(20, 322, "One client per server. Each client keeps its own connection to one server.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: 810,
        height: 332,
        title: "Hosts, clients and servers",
        credit: "Adapted from the MCP docs, “Architecture overview” (2026-07-28 version).",
        desc: architecture.alt,
      },
      b,
    );
  },
};

// sources/mcp-2026-07-28-release.md and mcp-architecture.md: initialize/initialized
// and Mcp-Session-Id removed; each request carries protocol version, client info and
// capabilities in _meta; any request can land on any instance behind a round-robin
// load balancer without shared storage; server/discover optional for clients.
const stateless: Figure = {
  slug: "stateless",
  alt: "Two sequence sketches. Left, MCP before 2026-07-28: a handshake (initialize, a reply, initialized) opens a session, and later tools/list and tools/call requests carry an Mcp-Session-Id header tied to state kept for that session. Right, MCP 2026-07-28: there is no handshake; each request (an optional server/discover, then tools/list, then tools/call) carries its protocol version, client info and capabilities in _meta, so a round-robin load balancer can send each one to a different server instance.",
  render() {
    let b = "";
    // Left: old
    const L = 20;
    b += text(L, 8, "Before 2026-07-28: a session", { size: 14.5, weight: 700, tone: "orange" });
    b += box(L, 30, 90, 30, "client", { tone: "grey", size: 13 });
    b += box(L + 290, 30, 110, 30, "server", { tone: "orange", size: 13 });
    const cx = L + 45;
    const sx = L + 345;
    b += line(cx, 60, cx, 330, { tone: "grey", dash: true });
    b += line(sx, 60, sx, 330, { tone: "grey", dash: true });
    const old: [string, boolean][] = [
      ["initialize", true],
      ["reply", false],
      ["initialized", true],
      ["tools/list + Mcp-Session-Id", true],
      ["tools/call + Mcp-Session-Id", true],
    ];
    old.forEach(([label, right], i) => {
      const y = 86 + i * 44;
      b += right ? arrow(cx + 2, y, sx - 2, y, { tone: "orange" }) : arrow(sx - 2, y, cx + 2, y, { tone: "orange" });
      b += text((cx + sx) / 2, y - 7, label, { anchor: "middle", size: 12.5, mono: true });
    });
    b += rect(sx - 44, 300, 88, 26, { tone: "orange", fill: "soft", r: 4 });
    b += text(sx, 313, "session state", { anchor: "middle", baseline: "middle", size: 12, tone: "orange" });
    b += text(L, 356, "The same server has to remember the session,", { size: 12.5 });
    b += text(L, 374, "or share that state with every other instance.", { size: 12.5 });

    // Right: new
    const R = 470;
    b += line(R - 24, 0, R - 24, 380, { tone: "grid", sw: 1 });
    b += text(R, 8, "2026-07-28: every request stands alone", { size: 14.5, weight: 700, tone: "blue" });
    b += box(R, 30, 90, 30, "client", { tone: "grey", size: 13 });
    b += box(R + 150, 30, 110, 30, ["load balancer"], { tone: "grey", size: 12.5 });
    const ccx = R + 45;
    const lbx = R + 205;
    b += line(ccx, 60, ccx, 280, { tone: "grey", dash: true });
    b += line(lbx, 60, lbx, 280, { tone: "grey", dash: true });
    const inst = [
      { label: "instance A", y: 104 },
      { label: "instance B", y: 180 },
      { label: "instance C", y: 256 },
    ];
    for (const s of inst) b += box(R + 300, s.y - 16, 110, 32, s.label, { tone: "blue", size: 12.5 });
    const calls = [
      { label: "server/discover (optional)", y: 104 },
      { label: "tools/list", y: 180 },
      { label: "tools/call", y: 256 },
    ];
    for (const c of calls) {
      b += arrow(ccx + 2, c.y, lbx - 2, c.y, { tone: "blue" });
      b += text((ccx + lbx) / 2, c.y - 24, c.label, { anchor: "middle", size: 12.5, mono: true });
      b += text((ccx + lbx) / 2, c.y - 8, "+ _meta", { anchor: "middle", size: 12, tone: "blue", mono: true });
      b += arrow(lbx + 2, c.y, R + 298, c.y, { tone: "blue" });
    }
    b += text(R, 306, "_meta = protocol version, client info,", { size: 12.5, tone: "muted" });
    b += text(R, 324, "client capabilities, on every request", { size: 12.5, tone: "muted" });
    b += text(R, 356, "Round-robin: any instance can answer,", { size: 12.5 });
    b += text(R, 374, "with no shared session storage.", { size: 12.5 });
    return svg(
      {
        width: 900,
        height: 384,
        title: "MCP dropped sessions on 2026-07-28",
        credit: "Based on the MCP 2026-07-28 release post and architecture docs. Simplified.",
        desc: stateless.alt,
      },
      b,
    );
  },
};

export default [architecture, stateless];
