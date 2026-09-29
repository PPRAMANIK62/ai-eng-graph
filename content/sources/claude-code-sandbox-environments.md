---
id: claude-code-sandbox-environments
title: Choose a sandbox environment (Claude Code docs)
author: Anthropic
url: https://code.claude.com/docs/en/sandbox-environments
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Claude Code's guide to isolation options, from a per-command sandbox for shell commands up to a full virtual machine or a hosted cloud session, compared by what each isolates and what setup it needs. It separates permission modes (whether an action runs) from isolation (what it can reach once it runs) and says the auto mode classifier is not an isolation boundary.

## Key claims

- The ladder: sandboxed Bash tool (shell commands and their children), sandbox runtime (the whole Claude Code process, including file tools, MCP servers and hooks), dev container, custom container, virtual machine ("Full operating system"), cloud sessions (a VM hosted by Anthropic). (Compare sandboxing approaches)
- "Sandbox isolation reduces the impact of a breach, but it does not eliminate risk. Any approach that allows network egress can still leak data the agent can read". (Compare sandboxing approaches, warning)
- Isolation does not change what is sent to the model. (same)
- "Permission modes decide whether a tool call runs and whether you are prompted first. Isolation restricts what a command can access once it runs." (How isolation relates to permission modes)
- "Always run --dangerously-skip-permissions sessions inside a container, a VM, or the sandbox runtime". (same)
- "The classifier is a per-action control, not an isolation boundary, so an isolation boundary still adds defense in depth for unattended runs". (same)
- With the sandboxed Bash tool alone, MCP servers and command hooks "are separate processes that run unconstrained on the host." (Sandboxed Bash tool)
- The sandbox runtime uses Seatbelt (macOS) or bubblewrap (Linux) and by default "denies network access and confines writes to a small set of built-in runtime paths". (Sandbox runtime)
- The example dev container has "a default-deny iptables firewall". (Dev containers)
- "A dedicated virtual machine provides the strongest separation, with its own kernel". Options include microVMs such as Firecracker; use it for untrusted code or when policy needs kernel-level separation. (Virtual machine)
- Cloud sessions: "A network proxy enforces a default allowlist, and a separate proxy holds your GitHub token outside the sandbox while issuing scoped credentials for repository access inside it." (Cloud sessions)
- For an untrusted repository, start with a dedicated VM or a cloud session. (Choose an approach)
- The runtime blocks risky writes by default: "At the project root, the runtime denies .git/hooks, denies .git/config unless you set filesystem.allowGitConfig: true, and denies .mcp.json, .claude/commands, .claude/agents, and shell startup files." On Linux it "builds the deny list once at launch" and "does not cover anything the session creates later, such as git init, git clone, or scaffolding." A session that can write config paths "can persist hooks, permission rules, or MCP servers that run unsandboxed the next time you launch Claude Code." (What the runtime blocks on its own)
- "Several managed sandbox and remote execution services can host the container for you." Review what is mounted writable, which credentials are reachable, and the egress policy. (Custom container)
- After unattended runs: "Review the paths you kept writable." (After unattended runs)

## Visuals worth redrawing

- The comparison table as a ladder: more isolation, more setup.

## My notes

- Specific to Claude Code but the ladder applies to any agent.
