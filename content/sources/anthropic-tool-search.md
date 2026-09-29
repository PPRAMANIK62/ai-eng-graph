---
id: anthropic-tool-search
title: Tool search tool
author: Anthropic
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Claude API docs for tool search: you send all tool definitions but mark most `defer_loading: true`, and Claude searches the catalog (regex or BM25) and loads only the few it needs. It explains the two problems this solves (context bloat and falling selection accuracy) and when to use it. Undated; lists models up to Claude Opus 5.5 and Fable 5.1.

## Key claims

- Context bloat: "A typical multiserver setup (GitHub, Slack, Sentry, Grafana, and Splunk) can consume ~55k tokens in definitions before Claude does any work. Tool search typically reduces this by over 85 percent, loading only the 3–5 tools Claude needs for a given request." (intro)
- Selection accuracy: "Claude's ability to pick the right tool degrades once you exceed 30–50 available tools." (intro)
- Two variants: regex (Claude writes Python regex patterns) and BM25 (natural language queries); both search names, descriptions, argument names and argument descriptions. Each search returns up to 5 tools by default. (How tool search works)
- Keep your "3–5 most frequently used tools non-deferred". Deferred tools are excluded from the system-prompt prefix, so prompt caching is preserved. (Deferred tool loading)
- Limit: 10,000 deferred tools per request. (Limits)
- When to use: 10 or more tools, definitions over 10k tokens, or aggregating MCP servers (200+ tools). Without it is better "when you have fewer than 10 tools". (When to use tool search)
- Tips: consistent namespacing "so one search matches the whole group"; keywords in descriptions that match how users describe tasks. (Optimization tips)
- You can build your own search (e.g. embeddings) by returning `tool_reference` blocks. (Custom tool search implementation)

## Visuals worth redrawing

- None.

## My notes

- Links to an "Advanced tool use" engineering post for background; not opened.
