---
id: anthropic-define-tools
title: Define tools
author: Anthropic
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Claude API reference for writing tool definitions: name, description, input schema and optional examples, plus a short list of best practices and how `tool_choice` works. Undated page; its examples use claude-opus-5-5 and it lists Claude Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1 as rejecting forced tool use.

## Key claims

- Tool names must match `^[a-zA-Z0-9_-]{1,128}$`. (Specifying client tools)
- The API builds a special system prompt from the tool definitions. (Tool use system prompt)
- Descriptions matter most. "Provide extremely detailed descriptions. This is by far the most important factor in tool performance." Cover what it does, when to use it (and not), each parameter, caveats. "Aim for at least 3–4 sentences for each tool description, more if the tool is complex." (Best practices for tool definitions)
- "Consolidate related operations into fewer tools. Rather than creating a separate tool for every action (create_pr, review_pr, merge_pr), group them into a single tool with an action parameter." "Fewer, more capable tools reduce selection ambiguity". (same)
- Namespace names by service (`github_list_prs`, `slack_send_message`), "especially important when using tool search". (same)
- Return "semantic, stable identifiers (for example, slugs or UUIDs) rather than opaque internal references, and include only the fields Claude needs to reason about its next step." (same)
- Good vs poor description example for `get_stock_price`. The good one says the ticker "must be a valid symbol for a publicly traded company on a major US stock exchange like NYSE or NASDAQ", "will return the latest trade price in USD", "should be used when the user asks about the current or most recent price of a specific stock" and "will not provide any other information about the stock or company." The poor one: "Gets the stock price for a ticker." (same)
- `input_examples` add prompt tokens: "~20–50 tokens for simple examples, ~100–200 tokens for complex nested objects". (Providing tool use examples)
- As of 2026-09, Claude Opus 5.5, Sonnet 5.5, Fable 5.1 and Mythos 5.1 return a 400 for forced tool use (`any` or `tool`); use `auto` with strict tool use instead. "`any` and `tool` return a 400 error" (Forcing tool use, model table)
- A tool has `name`, `description`, `input_schema` (a JSON Schema) and optional `input_examples`. (Specifying client tools, table)
- The generated system prompt says the call format is parsed with regex: "The output is not expected to be valid XML and is parsed with regular expressions." (Tool use system prompt, template text)
- `tool_choice` options: "`auto` allows Claude to decide whether to call any provided tools or not." "`any` tells Claude that it must use one of the provided tools, but doesn't force a particular tool." "`tool` forces Claude to always use a particular tool." "`none` prevents Claude from using any tools." (Forcing tool use)
- What to use instead of forcing on those models: "`auto` with strict tool use to guarantee schema-valid tool inputs, or structured outputs when you need a response in a fixed JSON shape." Manual extended thinking also rejects `any` and `tool`. (Forcing tool use, table)
- With `any` or `tool` the API prefills the assistant turn, so "the models will not emit a natural language response or explanation before `tool_use` content blocks, even if explicitly asked to do so." (Forcing tool use)
- On models that allow forcing, `any` plus `strict: true` guarantees a tool is called and its inputs follow the schema. (Tip, Guaranteed tool calls with strict tools)

## Visuals worth redrawing

- None needed.

## My notes

- Pairs with the engineering post (anthropic-writing-tools-for-agents), which it links for deeper guidance.
