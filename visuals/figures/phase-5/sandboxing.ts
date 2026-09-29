import { box, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// sources/fly-firecracker-vs-gvisor.md (shared kernel, Sentry, threat-model lines)
// and sources/firecracker-site.md (5 emulated devices, jailer, <125 ms, <5 MiB).
const layers: Figure = {
  slug: "isolation-layers",
  alt: "Three ways to run untrusted code, drawn as layers. Container: the app sits directly on the shared host kernel, with seccomp filters trimming its system calls; one kernel bug reachable from the app can compromise the host. gVisor: the app talks to the Sentry, a kernel written in Go running in user space, which answers the app's system calls itself and makes only a small set of calls to the host kernel; its threat model is a host kernel bug. Firecracker microVM: the app runs on its own guest kernel inside a virtual machine on KVM, with only 5 emulated devices and a jailer around the VMM; its threat model is that the guest kernel is already compromised. Boot under 125 ms, under 5 MiB overhead per microVM.",
  render() {
    let b = "";
    const colW = 270;
    const gap = 26;
    const cols: { title: string; tone: Tone; stack: { label: string[]; tone: Tone; fill?: "soft" | "none" | "solid" }[]; note: string[] }[] = [
      {
        title: "Container",
        tone: "grey",
        stack: [
          { label: ["agent's code"], tone: "grey" },
          { label: ["seccomp filter"], tone: "grey", fill: "none" },
          { label: ["host kernel (shared)"], tone: "red" },
        ],
        note: ["One kernel for everything.", "A kernel bug reachable through an", "allowed call is a host compromise."],
      },
      {
        title: "gVisor",
        tone: "blue",
        stack: [
          { label: ["agent's code"], tone: "grey" },
          { label: ["Sentry: a kernel in Go,", "in user space"], tone: "blue" },
          { label: ["host kernel", "(small set of calls)"], tone: "grey" },
        ],
        note: ["Threat model: a host kernel bug.", "Every system call pays", "for the extra layer."],
      },
      {
        title: "Firecracker microVM",
        tone: "green",
        stack: [
          { label: ["agent's code"], tone: "grey" },
          { label: ["its own guest kernel"], tone: "green" },
          { label: ["VMM: 5 emulated devices,", "inside a jailer"], tone: "green", fill: "none" },
          { label: ["host kernel + KVM"], tone: "grey" },
        ],
        note: ["Threat model: the guest kernel", "is already compromised.", "Boot < 125 ms, < 5 MiB overhead."],
      },
    ];
    cols.forEach((c, i) => {
      const x = 20 + i * (colW + gap);
      b += text(x, 10, c.title, { size: 15, weight: 700, tone: c.tone === "grey" ? "ink" : c.tone });
      const n = c.stack.length;
      const total = 200;
      const h = (total - (n - 1) * 8) / n;
      c.stack.forEach((s, j) => {
        const y = 30 + j * (h + 8);
        b += box(x, y, colW, h, s.label, { tone: s.tone, fill: s.fill ?? "soft", size: 13 });
      });
      c.note.forEach((l, k) => {
        b += text(x, 256 + k * 19, l, { size: 12.5, tone: k === 0 ? "ink" : "muted", weight: k === 0 ? 600 : 400 });
      });
    });
    return svg(
      {
        width: 20 + 3 * colW + 2 * gap + 20,
        height: 310,
        title: "How much sits between the agent's code and your machine",
        credit: "Based on Fly.io, “Firecracker vs gVisor” (2026), and the Firecracker project site. Simplified.",
        desc: layers.alt,
      },
      b,
    );
  },
};

// sources/claude-code-sandbox-environments.md, "Compare sandboxing approaches":
// what each option isolates. "Shares host kernel" for containers is from
// sources/fly-firecracker-vs-gvisor.md.
const ladder: Figure = {
  slug: "ladder",
  alt: "A ladder of sandbox options for a coding agent, from least to most isolation. Sandboxed shell commands: only shell commands and their child processes are fenced; file tools, MCP servers and hooks still run on the host. Sandbox runtime: the whole agent process, including MCP servers and hooks, inside OS-level filesystem and network limits. Container (dev container or custom): a full development environment, sharing the host kernel. Virtual machine or microVM: a full operating system with its own kernel, the strongest separation. Cloud session: a VM run by the provider, with a network allowlist and credentials held by a proxy outside.",
  render() {
    let b = "";
    const rungs: { name: string; what: string; tone: Tone }[] = [
      { name: "Cloud session", what: "a VM run by the provider; network allowlist; credentials held by a proxy outside", tone: "green" },
      { name: "VM or microVM", what: "a full OS with its own kernel: the strongest separation", tone: "green" },
      { name: "Container", what: "a full dev environment, still on the host's shared kernel", tone: "blue" },
      { name: "Sandbox runtime", what: "the whole agent process, incl. MCP servers and hooks, in OS-level limits", tone: "blue" },
      { name: "Sandboxed shell", what: "shell commands only; file tools, MCP servers and hooks run unfenced", tone: "orange" },
    ];
    const x = 60;
    const w = 180;
    rungs.forEach((r, i) => {
      const y = 10 + i * 52;
      const indent = (rungs.length - 1 - i) * 0;
      b += box(x + indent, y, w, 38, r.name, { tone: r.tone, size: 13.5, weight: 600 });
      b += text(x + w + 16, y + 19, r.what, { size: 12.5, baseline: "middle" });
    });
    // axis arrow on the left
    b += `<line x1="30" y1="266" x2="30" y2="14" class="s-muted" stroke-width="1.5" marker-end="url(#ah-muted)"/>`;
    b += text(22, 140, "more isolation", { size: 12, tone: "muted", anchor: "middle", rotate: -90 });
    return svg(
      {
        width: 790,
        height: 272,
        title: "A ladder of sandbox options",
        credit: "Based on the Claude Code docs, “Choose a sandbox environment” (2026). Applies to agents generally.",
        desc: ladder.alt,
      },
      b,
    );
  },
};

export default [layers, ladder];
