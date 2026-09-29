---
id: openai-guardrails-human-review
title: Guardrails and human review
author: OpenAI
url: https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI Agents SDK docs on the two ways to control an agent run: guardrails (automatic checks on input, output or tool calls) and human review (pause for approval before a side effect). Guardrails fire a "tripwire" that stops the run. They can run before the agent (blocking) or alongside it (parallel), which trades latency for wasted work.

## Key claims

- The two controls. "Guardrails validate input, output, or tool behavior automatically. Human review pauses the run so a person or policy can approve or reject a sensitive action." (intro)
- Which to start with: input guardrails to "Block disallowed user requests before the main model runs"; output guardrails to "Validate or redact the final output before it leaves the system"; tool guardrails to "Check arguments or results around a function tool call"; human-in-the-loop approvals to "Pause before side effects like cancellations, edits, shell commands, or sensitive MCP actions". (Choose the right control)
- Scope. "Input guardrails run only for the first agent in the chain. Output guardrails run only for the agent that produces the final output. Tool guardrails run on the function tools they're attached to." (Agent-level guardrails don't run everywhere)
- The example input guardrail is itself a small agent that checks whether the request is math homework and returns `tripwireTriggered`; the run then throws a tripwire exception. (Add a blocking guardrail, code sample)
- Blocking vs parallel. "Use blocking execution when the cost or risk of starting the main agent is too high. Use parallel guardrails when lower latency matters more than avoiding speculative work." (same)
- Approvals. "Approvals are the human-in-the-loop path for tool calls. The model can still decide that an action is needed, but the run pauses until you approve or reject it." Set with `needsApproval: true` / `needs_approval=True` on a tool. (Pause for human review)

## Visuals worth redrawing

- The three guardrail positions around one agent run: input before, tool around each call, output after.

## My notes

- No date on the page. SDK details (names like `needsApproval`) may change.
