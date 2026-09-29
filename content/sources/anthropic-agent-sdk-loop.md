---
id: anthropic-agent-sdk-loop
title: How the agent loop works (Claude Agent SDK docs)
author: Anthropic
url: https://code.claude.com/docs/en/agent-sdk/agent-loop
published: 2026
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The loop that runs Claude Code and the Agent SDK, from the inside: what a turn is, when the loop ends, how tool calls run, the limits you can set on turns and spend, how context grows and gets compacted, and how the result tells you why it stopped. Undated docs; they mention Claude Code v2.1.217.

## Key claims

- The cycle: "Claude evaluates your prompt, calls tools to take action, receives the results, and repeats until the task is complete." (intro)
- A turn. "A turn is one round trip inside the loop: Claude produces output that includes tool calls, the SDK executes those tools, and the results feed back to Claude automatically." (Turns and messages)
- The end condition. "Turns continue until Claude produces output with no tool calls, at which point the loop ends and the final result is delivered." (Turns and messages)
- Worked example "Fix the failing tests in auth.ts": turn 1 runs `npm test` (three failures), turn 2 reads `auth.ts` and `auth.test.ts`, turn 3 edits `auth.ts` and re-runs the tests (all pass), then a final text-only reply. "That was four turns: three with tool calls, one final text-only response." (Turns and messages)
- Limits: `max_turns` counts tool-use turns only; `max_budget_usd` caps spend. Both default to no limit. "Without limits, the loop runs until Claude finishes on its own, which is fine for well-scoped tasks but can run long on open-ended prompts". "Setting a budget is a good default for production agents." (Turns and messages; Turns and budget)
- When a limit is hit the result has subtype `error_max_turns` or `error_max_budget_usd`; other subtypes are `success`, `error_during_execution`, `error_max_structured_output_retries`. (Handle the result)
- Parallel tools. "Read-only tools (like Read, Glob, Grep, and MCP tools marked as read-only) can run concurrently. Tools that modify state (like Edit, Write, and Bash) run sequentially to avoid conflicts." (Parallel tool execution)
- A denied tool call comes back to the model as a rejection message, and it "typically attempts a different approach or reports that it couldn't proceed." (Tool permissions)
- Context grows. The context window "does not reset between turns within a session. Everything accumulates: the system prompt, tool definitions, conversation history, tool inputs, and tool outputs." Unchanging parts are prompt cached. (The context window)
- Compaction: near the limit, the SDK "summarizes older history to free space", so early instructions may be lost; persistent rules belong in CLAUDE.md. (Automatic compaction)
- Subagents start with a fresh conversation; "only its final response returns to the parent as a tool result." (Keep context efficient)
- Hooks such as `PreToolUse` run in your process, outside the context window, and can block a tool call. (Hooks)
- The budget cap covers subagents' spend too. (Turns and budget)

## Visuals worth redrawing

- The loop diagram: prompt, then evaluate; either tool calls whose results feed back, or a final answer.

## My notes

- Specific to Claude's SDK, but the shape (loop until no tool calls, cap turns and spend) is the same in OpenAI's Agents SDK.
