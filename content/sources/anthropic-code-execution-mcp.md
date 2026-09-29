---
id: anthropic-code-execution-mcp
title: "Code execution with MCP: building more efficient AI agents"
author: Adam Jones and Conor Kelly (Anthropic)
url: https://www.anthropic.com/engineering/code-execution-with-mcp
published: 2025-11-04
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Loading every MCP tool definition into context, and passing every intermediate result through the model, gets expensive as agents connect to more servers. The fix proposed: present MCP servers as code files on a filesystem and let the agent write code that calls them, so it reads only the definitions it needs and big intermediate data stays out of context. The cost is that you now need a sandbox.

## Key claims

- "Since launching MCP in November 2024, adoption has been rapid". (intro)
- Two problems: tool definitions overload the context window, and intermediate results consume extra tokens. "In cases where agents are connected to thousands of tools, they’ll need to process hundreds of thousands of tokens before reading a request." (Excessive token consumption)
- Example: copying a meeting transcript from Google Drive into Salesforce sends it through the model twice; "For a 2-hour sales meeting, that could mean processing an additional 50,000 tokens." (same)
- Tools as files, e.g. `./servers/google-drive/getDocument.ts`, discovered by listing directories. "This reduces the token usage from 150,000 tokens to 2,000 tokens—a time and cost saving of 98.7%". (Code execution with MCP)
- Cloudflare published similar findings, calling it "Code Mode". (same)
- "Models are great at navigating filesystems. Presenting tools as code on a filesystem allows models to read tool definitions on-demand". A `search_tools` tool is an alternative. (Progressive disclosure)
- Filtering in code: instead of returning 10,000 spreadsheet rows into context, the code filters them first. (Context efficient tool results)
- Privacy: intermediate results stay in the execution environment; the client can tokenize PII so real values flow between tools "but never through the model". (Privacy-preserving operations)
- Saved code plus a SKILL.md becomes a reusable skill. (Skills)
- The caveat: "Running agent-generated code requires a secure execution environment with appropriate sandboxing, resource limits, and monitoring." These add "operational overhead and security considerations that direct tool calls avoid". (Summary)

## Visuals worth redrawing

- Direct tool calls (definitions and results through the model) vs code execution (model writes code; data flows between servers in the sandbox).

## My notes

- 150,000 → 2,000 is one example workflow, not a benchmark.
