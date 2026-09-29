---
id: anthropic-how-tool-use-works
title: How tool use works
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Anthropic's concept page for tool use. It frames tool use as a contract: you describe the operations and their input shapes, the model decides when to call them and emits a structured request, and your code (or Anthropic's servers) runs it. It explains where tools run (your code, Anthropic-published schemas you execute, or server tools Anthropic executes), the client-side loop keyed on `stop_reason`, and when tools are and aren't the right choice.

## Key claims

- The contract. "Tool use is a contract between your application and the model." (The tool-use contract)
- The model never runs anything. "The model never executes anything on its own. It emits a structured request, your code (or Anthropic's servers) runs the operation, and the result flows back into the conversation." (The tool-use contract)
- It behaves like a typed function call from the outside. "This contract makes the model behave less like a text generator and more like a function you call." (The tool-use contract)
- For your own tools the reply carries a `tool_use` block (name plus JSON arguments); you run it and send the output back in a `tool_result` block. "Claude never sees your implementation; it only sees the schema you provided and the result you returned." (User-defined tools)
- Most traffic is your own tools. "the vast majority of tool-use traffic is user-defined tools calling into application-specific logic." (User-defined tools)
- Anthropic-schema tools (memory, bash, text_editor, computer, browser) are trained in, so Claude "calls them more reliably and recovers from errors more gracefully than it would with a custom tool that does the same thing." (Anthropic-schema tools)
- Server tools (web_search, web_fetch, code_execution, tool_search) run on Anthropic's side; "You never construct a `tool_result` block for these tools." (Server-executed tools)
- Every client tool call is a round trip. "The model can't run your code, so every tool call is a round trip: the model asks, you execute, you report back, the model continues." (The agentic loop)
- The loop: send tools and message; get `stop_reason: "tool_use"` with one or more `tool_use` blocks; run each; send back the history plus a user message of `tool_result` blocks; "Repeat from step 2 while `stop_reason` is `\"tool_use\"`." (The agentic loop, steps 1 to 5)
- Other stop reasons end the loop: `end_turn`, `max_tokens`, `stop_sequence`, `refusal`. (The agentic loop)
- Server-side loops have an iteration cap; hitting it returns `stop_reason: "pause_turn"`. (The server-side loop)
- When to use tools: side effects, fresh or external data, structured guaranteed-shape outputs, calling existing systems. (When to use tools)
- The regex rule. "if you're writing a regex to extract a decision from model output, that decision should have been a tool call." (When to use tools)
- When not to: the model can answer from training alone; one-shot Q&A with no side effects; "Tool-calling latency would dominate a trivial response. Every tool call is at least one extra round trip" (When to use tools)

## Visuals worth redrawing

- The five-step loop as a sequence diagram between your app and the API.

## My notes

- The regex rule sits awkwardly next to Anthropic's own ticket-routing guide, which parses `<intent>` tags with regex (see `anthropic-ticket-routing`).
