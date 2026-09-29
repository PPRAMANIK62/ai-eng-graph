---
id: sandboxing
title: What is sandboxing for agents?
depth: deep
phase: 5
note: >-
  Running agent actions somewhere they can't do real damage.
needs: [agent-loop]
leads_to: []
compare_with: [excessive-agency, human-in-the-loop]
updated: 2026-09-29
---

# What is sandboxing for agents?

A sandbox is a fenced-off place to run what an agent does, so that a bad
command or a hijacked agent can only damage what's inside the fence. It
limits which files the agent can touch, which servers it can reach, and
which secrets it can see. Sandboxing is what lets you give an agent real
tools and fewer approval prompts without betting your laptop, your
servers or your customers' data on the model always being right.

## What can go wrong without one

Picture a coding agent working in its [[agent-loop]]. It clones a repo,
runs `npm install`, runs the tests, reads some docs on the web, and edits
files until the tests pass. Every one of those steps is a shell command
the agent chose, and a shell command can do anything you can do.

Three things can go wrong:

- Damage: a bad command deletes or mangles files you care about.
- Theft: something steals what the agent can see: source code, or
  secrets sitting in environment variables. A web page or README with
  hidden instructions is enough to try this; that's
  [[prompt-injection]].
- Misuse: your machine gets used to attack someone else, say as part
  of a denial-of-service attack or to hide where an attack comes from.

The theft case has a useful name, the lethal trifecta: an agent that has
access to private data, reads untrusted content, and can send data out
can be tricked into sending your data to an attacker. Filters that catch
"95% of attacks" don't fix this, because in security a 5% miss rate is a
failing grade. The dependable fix is to break one leg of the trifecta.
A sandbox is how you break the "can send data out" and "can see private
data" legs without taking away the agent's tools. More on the leak itself
in [[data-exfiltration]].

## Two walls: files and network

A useful sandbox for an agent has two boundaries, and it needs both.

- Filesystem isolation: the agent can read and write its working
  directory, and nothing outside it. It can't edit your shell startup
  files, your SSH keys or its own settings.
- Network isolation: the agent can only connect to servers you've
  approved, such as the package registry and your git host.

Each wall covers the other's gap. Without the network wall, an agent
that's been tricked can read your SSH keys and send them anywhere. Without
the filesystem wall, it can escape the sandbox and get network access
anyway.

Claude Code's sandbox (2025) is a concrete example. It uses operating
system features, bubblewrap on Linux and Seatbelt on macOS, and the rules
apply to every script and subprocess a command starts. Network traffic
goes through a proxy outside the sandbox that only lets through allowed
domains and asks the user about new ones. Anthropic reported that inside
this sandbox its own engineers saw 84% fewer permission prompts, because
the agent no longer had to ask before commands that stayed inside the
fence. The runtime is open source and can wrap other agents and
[[mcp]] servers too.

## Keep the keys outside the box

The safest secret is one the sandbox never contains. Two patterns:

The first is a proxy that holds the real credential. In Claude Code's cloud sessions,
the GitHub token lives outside the sandbox. Inside, git only has a scoped
credential that works with a proxy. The proxy checks each request (for
example, that the push goes to the configured branch) and only then adds
the real token. Even if the code in the sandbox is fully compromised, it
never sees the token.

The second is scoped, capped credentials. When the agent does need a key, give it
one for a test or staging environment where damage stays contained, and
if the key can spend money, set a hard budget. Simon Willison's example
(2025): a dedicated Fly.io organization with a $5 budget and an API key
that only works in that organization.

## How strong is the wall? Containers, gVisor and microVMs

The two walls say what to block. How they're built decides how hard they
are to break through. There are three common designs, and the difference
is the kernel, the core of the operating system that every program asks
to open files and sockets.

![Three ways to run untrusted code, drawn as layers. Container: the app sits directly on the shared host kernel, with seccomp filters trimming its system calls; one kernel bug reachable from the app can compromise the host. gVisor: the app talks to the Sentry, a kernel written in Go running in user space, which answers the app's system calls itself and makes only a small set of calls to the host kernel; its threat model is a host kernel bug. Firecracker microVM: the app runs on its own guest kernel inside a virtual machine on KVM, with only 5 emulated devices and a jailer around the VMM; its threat model is that the guest kernel is already compromised. Boot under 125 ms, under 5 MiB overhead per microVM.](img/sandboxing-isolation-layers.svg)

**Containers** (Docker and similar) all share the host's one kernel.
Seccomp filters can trim which system calls a container may make. Sharing
one kernel is efficient, and it's also the weak spot: a single kernel bug reachable through an
allowed system call can mean escape to the host.

**gVisor** puts a second kernel in the way. Its Sentry, written in Go and
running as an ordinary process, catches the sandboxed program's system
calls and answers them itself, and a separate process handles file access.
The host kernel only sees a small set of calls from the Sentry. gVisor is
built for the case where the host kernel has a bug. The cost is that every
system call goes through extra software.

**Firecracker** runs each workload in a microVM: a small virtual machine
on Linux KVM with its own guest kernel. It emulates only 5 devices, and a
companion "jailer" process adds a second layer around it in case the
virtual machine boundary is ever broken. Firecracker is built for the case
where the guest kernel is already compromised. It's an AWS project that
runs AWS Lambda, and as of 2026 it boots in under 125 ms with under 5 MiB of memory
overhead per microVM, and one host can start up to 150 per second.

Performance matters for agents in a specific way. An agent loop is
thousands of small file and network operations: `git clone`, package
installs, test runs. gVisor pays a toll on each of those calls. Inside a
Firecracker guest they hit a normal kernel at close to native speed.

Which to pick, as a rule of thumb from Fly.io's 2026 comparison:

- The threat is "the agent does something stupid or gets tricked into
  deleting the repo": a container with scoped credentials and a locked-down
  network covers most of it.
- The threat is someone actively trying to break out, or the code is
  genuinely untrusted: add a second kernel-sized layer. Firecracker if you
  control hardware with KVM; gVisor if you're on Kubernetes or cloud VMs
  without KVM.

## A ladder of options

In practice you pick a rung on a ladder. Higher rungs fence in more, and
most of them take more setup, though a hosted cloud session takes almost
none. Claude Code's docs (as of 2026-09) lay it out like this:

![A ladder of sandbox options for a coding agent, from least to most isolation. Sandboxed shell commands: only shell commands and their child processes are fenced; file tools, MCP servers and hooks still run on the host. Sandbox runtime: the whole agent process, including MCP servers and hooks, inside OS-level filesystem and network limits. Container (dev container or custom): a full development environment, sharing the host kernel. Virtual machine or microVM: a full operating system with its own kernel, the strongest separation. Cloud session: a VM run by the provider, with a network allowlist and credentials held by a proxy outside.](img/sandboxing-ladder.svg)

The bottom rung is the easy trap. Sandboxing only the shell commands
leaves other tools, MCP servers and hooks running with full access to
your machine. For an agent that runs unattended, the whole agent process
has to be inside the boundary. For code or repos you don't trust at all,
the docs point to a dedicated VM or a hosted cloud session.

This isn't only for coding agents. Any design where the model writes and
runs code, such as the code-execution approach to [[mcp]] tools, needs one
of these rungs.

## Sandboxes and approvals do different jobs

Permission prompts decide whether an action runs. A sandbox limits what
it can reach once it runs. They work together, and they fail differently.

Approving every step wears people out (see [[human-in-the-loop]]), and a
classifier that approves for them still misses some risky actions.
Claude Code's docs are explicit that its auto mode classifier is a check
on each action, not an isolation boundary. So the rule is: the more you
let the agent act without asking, the more the sandbox has to carry. Runs
with all prompts turned off should always be inside a container, a VM or
the sandbox runtime.

## Where it gets tricky

**The network is where data leaks.** Agents need `pip install` and `git
clone`, so a sandbox can't be fully offline, and it can't be open to the
whole internet either. The isolation design decides how costly a breakout
is. The egress allowlist decides what a breakout is worth, because an
agent that can reach any domain can send out anything it can read.

**A sandbox doesn't hide data from the model.** Isolation limits what
commands can reach. The prompts and every file the agent reads still go
to the model provider.

**Writable config is a way out.** If the agent can write the files that
configure its own tools, like git hooks, MCP settings or shell startup
files, it can plant something that runs outside the sandbox next time.
Claude Code's sandbox runtime blocks writes to `.git/hooks`, `.mcp.json`
and shell startup files at the project root by default. On Linux it builds
that list once at launch, so repos the agent creates later aren't
covered.

**People disagree on how much is enough.** Simon Willison (2025) calls
Docker a reasonable risk for most people despite known container escapes.
Fly.io (2026) says containers share one kernel and a single bug can mean
escape, and that untrusted code belongs behind a second kernel. Both hold
for different threats: an agent making mistakes versus an attacker
working to break out. Keep in mind Fly.io sells microVM sandboxes.

**Hosted sandbox services vary, and their insides aren't always
documented.** Many services will run the sandbox for you. Don't assume
which isolation one uses unless its own docs say so. The Fly.io comparison
lists, as of 2026-09, Firecracker under AWS Lambda and Vercel Sandbox, and
gVisor under Google Cloud Run and Modal. For others, ask, and check what
network access and credentials are reachable inside.

## What this means when you build

- Put the whole agent process inside the boundary, not just its shell
  tool.
- Always isolate both the filesystem and the network. Default-deny
  outbound traffic and allow only the domains the task needs.
- Keep real credentials outside. Use a proxy, or scoped test keys with a
  spending cap.
- Match the wall to the threat: a locked-down container for an agent's
  own mistakes, a microVM or gVisor for untrusted code.
- The fewer approval prompts you use, the stronger the sandbox needs to
  be.
- After unattended runs, check what the agent was able to write.

## Further reading

- [Beyond permission prompts: making Claude Code more secure and autonomous](https://www.anthropic.com/engineering/claude-code-sandboxing),
  David Dworken and Oliver Weller-Davies (Anthropic), 2025. Why a
  sandbox needs both a filesystem and a network wall, and the credential
  proxy.
- [Choose a sandbox environment](https://code.claude.com/docs/en/sandbox-environments),
  Claude Code docs. The ladder of options, what each isolates, and how
  isolation relates to permission modes.
- [Firecracker vs gVisor: Sandbox Isolation for Untrusted and Agent-Generated Code](https://fly.io/learn/firecracker-vs-gvisor/),
  Daniel Botha (Fly.io), 2026. Containers vs a user-space kernel vs a
  microVM, their threat models, and which fits an agent loop. Written by
  a vendor.
- [Firecracker](https://firecracker-microvm.github.io/), AWS. The microVM
  numbers and the jailer.
- [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/),
  Simon Willison, 2025. The three capabilities that together let an agent
  leak your data.
- [Designing agentic loops](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/),
  Simon Willison, 2025. The risks of letting an agent run unattended,
  containers as a sandbox, and scoped, budget-capped credentials.
