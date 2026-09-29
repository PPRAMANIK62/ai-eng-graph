---
id: anthropic-claude-code-sandboxing
title: "Beyond permission prompts: making Claude Code more secure and autonomous"
author: David Dworken, Oliver Weller-Davies (Anthropic)
url: https://www.anthropic.com/engineering/claude-code-sandboxing
published: 2025-10-20
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Anthropic's engineering post on sandboxing in Claude Code. Asking the user to approve every action is slow and leads people to stop reading what they approve. Instead, they fence the agent in with filesystem and network isolation, then let it act freely inside the fence. That cut permission prompts by 84% in their own use, and a prompt-injected agent can't reach much.

## Key claims

- Approval fatigue. "Constantly clicking \"approve\" slows down development cycles and can lead to 'approval fatigue', where users might not pay close attention to what they're approving" (Keeping users secure on Claude Code)
- Result. "In our internal usage, we've found that sandboxing safely reduces permission prompts by 84%." (intro)
- Boundaries give more security and more agency at once. "By defining set boundaries within which Claude can work freely, they increase security and agency." (intro)
- Filesystem isolation gives read and write access to the current working directory, "but blocking the modification of any files outside of it." Network access goes through a proxy so Claude "can only connect to approved servers." (Sandboxing section)
- Both are needed. "Without network isolation, a compromised agent could exfiltrate sensitive files like SSH keys; without filesystem isolation, a compromised agent could easily escape the sandbox and gain network access." (Sandboxing section)
- Containment holds even when injection succeeds: "a compromised Claude Code can't steal your SSH keys, or phone home to an attacker's server." (Sandboxed bash tool)
- Built on "Linux bubblewrap and MacOS seatbelt"; restrictions also cover "any scripts, programs, or subprocesses that are spawned by the command." Network traffic goes through a unix socket to a proxy outside the sandbox that enforces allowed domains and asks the user about new ones. (Sandboxed bash tool)
- The runtime is open source and "can be used to sandbox arbitrary processes, agents and MCP servers." (Sandboxed bash tool)
- Cloud sandboxes keep "sensitive credentials (such as git credentials or signing keys)" outside; a proxy checks a scoped credential and the git operation (e.g. "ensuring it is only pushing to the configured branch") before attaching the real token. (Claude Code on the web)

## Visuals worth redrawing

- None needed.

## My notes

- A concrete case of cutting autonomy risk by cutting permissions instead of adding prompts.
