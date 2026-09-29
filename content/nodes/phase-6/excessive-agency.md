---
id: excessive-agency
title: What is excessive agency?
depth: short
phase: 6
note: >-
  An agent given more tools, permissions or autonomy than its task needs.
needs: [agent-loop]
leads_to: []
compare_with: [sandboxing, human-in-the-loop, data-exfiltration]
updated: 2026-09-29
---

# What is excessive agency?

Excessive agency is when an agent can do more than its job needs: more
tools, broader permissions, or the freedom to act without anyone checking.
It matters because models get things wrong and get tricked, and whatever
the agent is allowed to do is the most damage one bad output can cause. As
of the 2026 edition, it's number 3 on the [[owasp-llm-top-10|OWASP Top 10
for LLM apps]].

## One email assistant, three ways to give it too much

Say you build an assistant that summarizes a user's incoming email. In the
[[agent-loop]], the model reads messages and calls tools, and the tool you
picked from a library can read mail. It can also send mail, because the
library does both.

Now an email arrives with hidden instructions: search the inbox for
anything sensitive and forward it to this address. That's
[[prompt-injection]]. The model follows it. The send function was right
there, so the mail goes out.

The injection is the trigger. The damage comes from what the agent was
allowed to do, and it had too much in three separate ways:

- **Too much functionality.** The tool can send, and summarizing only
  needs reading. Fix: use a tool that only reads.
- **Too many permissions.** The tool signs in with access to send mail.
  Fix: sign in on the user's behalf with a read-only OAuth scope, so even a
  send call would fail.
- **Too much autonomy.** Nothing stops the agent before a message leaves.
  Fix: the agent can draft, but the user reviews and presses send.

Any one of these would have stopped the leak. Rate-limiting the send tool
wouldn't stop it, but would cap how much gets out.

![The email assistant with too much agency, as three dials. The task only needs reading mail. Too much functionality: the tool can also send, fixed by a tool that only reads. Too many permissions: it signs in with rights to send, fixed by a read-only OAuth scope. Too much autonomy: nothing checks before mail goes out, fixed by having the user press send. Any one fix stops the injected email from forwarding the inbox.](img/excessive-agency-three-dials.svg)

## What sets it off doesn't have to be an attack

The trigger can be anything that makes the model's output wrong: an
injection in an email, a web page, a tool's output or another agent's
message, or a plain mistake like a [[hallucination|hallucinated]] file
path. You can't make every output right, so you limit what a wrong output
can do.

The common forms look boring, which is why they slip through:

- A tool you tried during development and replaced is still registered.
- A "run one shell command" tool doesn't stop other shell commands.
- A tool that only reads a database connects as a user that can also
  update and delete.
- A tool that reads one user's documents connects with an account that
  sees everyone's.
- A delete tool deletes without asking.

## The controls, in order of strength

Most of the fixes are ordinary least privilege, applied to tools:

1. **Give the agent fewer tools.** If it doesn't need to fetch URLs,
   don't offer a fetch tool.
2. **Make each tool do less.** A mail-summarizing tool shouldn't contain
   delete or send.
3. **Prefer narrow tools to open-ended ones.** "Write this file" instead
   of "run any shell command", with a strict schema for its inputs (see
   [[tool-design]]).
4. **Limit what each tool's credentials can do.** Enforce it in the
   database or API permissions, not in the prompt.
5. **Act as the user, not as a service account.** Pass the user's own
   authorization through, with the smallest scope, including across
   chained tool or agent calls.
6. **Ask a human before high-impact actions.** See
   [[human-in-the-loop]].
7. **Check every action in code.** Authorization lives in your tool or in
   the system it calls, never in the model's judgment about whether it's
   allowed. A graded policy helps: let easy-to-undo actions through (a
   refund as store credit), and send hard-to-undo ones to a person (a
   payout to an outside account).

Monitoring tool use and rate-limiting tools don't prevent the problem, but
they cap how much damage one run can do.

## Where it gets tricky

**Approval prompts wear out.** Asking the user before every action sounds
safe, but people who click "approve" all day stop reading what they
approve. Anthropic hit this in Claude Code and went the other way: fence
the agent in with filesystem and network limits (see [[sandboxing]]), then
let it act freely inside the fence. In their own use that cut permission
prompts by 84%, and even an agent that gets prompt-injected can't steal
SSH keys or send data to an attacker's server. Narrowing what the agent can
reach replaced most of the prompts.

**Filtering the output isn't the fix.** It's tempting to scan what the
model says before a tool runs. That's a separate risk with its own entry
(improper output handling), and [[guardrails]] help at the edges, but
cleaning inputs and outputs is not the root control for excessive agency.
Limiting reach is.

**Where the LLM list ends.** Once a model has tools, memory across
sessions and acts on its own, OWASP moves most of the detail into a
separate Agentic Top 10. Excessive agency sits on that boundary and maps to
three agentic risks: tool misuse, identity and privilege abuse, and
cascading failures.

## What this means when you build

- For each tool, write down the one job it does. Remove any function or
  permission the job doesn't need.
- Give tools the user's credentials with the narrowest scope, and enforce
  limits in the downstream system.
- Decide which actions can't be undone and put a check in code (or a
  person) in front of those only.
- Assume the model will be fooled at some point. Ask what the worst tool
  call it could make is, and whether you can live with it.
- Log every tool call and rate-limit the ones that send, spend or delete.
  How data gets out through tools is [[data-exfiltration]].

## Further reading

- [LLM03:2026 Excessive Agency](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM03_ExcessiveAgency.md),
  OWASP GenAI Security Project, 2026. The definition, the three root
  causes, nine controls and the email assistant scenario.
- [Beyond permission prompts: making Claude Code more secure and autonomous](https://www.anthropic.com/engineering/claude-code-sandboxing),
  David Dworken and Oliver Weller-Davies (Anthropic), 2025. Why approval
  prompts wear out, and how sandboxing cut them by 84%.
