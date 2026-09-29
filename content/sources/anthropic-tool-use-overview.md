---
id: anthropic-tool-use-overview
title: Tool use with Claude
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The overview page for Claude tool use. It shows the full client-tool round trip with a `get_weather` tool, how `tool_choice: auto` decides between calling a tool and answering, what happens when required parameters are missing, and how tool use is billed, including a table of the hidden system prompt tokens each model adds when tools are present.

## Key claims

- Also called function calling. "Tool use (also called function calling) lets Claude call functions that you define or that Anthropic provides." (intro)
- The worked round trip: a `get_weather` tool with an `input_schema` requiring `location`; Claude replies with a `tool_use` block, your code gets "15 degrees Celsius, partly cloudy", and a second request sends it back in a `tool_result` block. Output shown: `Claude called get_weather with {"location": "San Francisco, CA"}`. (How tool use works)
- `disable_parallel_tool_use: true` inside `tool_choice` asks for at most one tool call per turn (comment in the example). (How tool use works)
- With `auto`, Claude decides per turn. "It calls a tool when the request maps to that tool's described capability and the answer isn't already in context." (When Claude uses tools)
- Steerable by the system prompt, e.g. "Use the tools to investigate before responding." (When Claude uses tools)
- Missing parameters: Opus is more likely to ask; Sonnet "might also infer a reasonable value", e.g. guessing "New York, NY" for "What's the weather?". "This behavior is not guaranteed" (When required parameters are missing)
- `strict: true` on a tool definition makes calls match the schema exactly. (Tip, Guarantee schema conformance)
- Tools cost tokens: the `tools` parameter, `tool_use` blocks and `tool_result` blocks all count, plus an automatic tool-use system prompt. "When you use `tools`, the API also automatically includes a special system prompt for the model that enables tool use." (Pricing)
- Token table (auto/none vs any/tool): Claude Opus 5.5 286 tokens (auto, none; no any/tool figure listed); Opus 5 286 / 406; Opus 4.7 675 / 804; Sonnet 5 354 / 474; Haiku 4.5 496 / 588; the lowest figure on the page is retired Haiku 3.5 at 264 / 355, and retired models "May still be available on other cloud platforms". (Pricing table)
- Server tools may add usage charges, e.g. web search per search. (Pricing)

## Visuals worth redrawing

- The round trip (request with tools, `tool_use`, your code, `tool_result`, answer).

## My notes

- The Opus 5.5 and Sonnet 5.5 rows have no any/tool figure because those models reject forced tool use (see `anthropic-define-tools`).
