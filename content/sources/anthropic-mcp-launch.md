---
id: anthropic-mcp-launch
title: Introducing the Model Context Protocol
author: Anthropic
url: https://www.anthropic.com/news/model-context-protocol
published: 2024-11-25
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

The announcement that open-sourced MCP. It explains the problem (every data source needs its own integration) and the answer (one open protocol: servers expose data, AI apps connect as clients). Useful for history and motivation only; the protocol details are out of date.

## Key claims

- Launched 2024-11-25 as "a new standard for connecting AI assistants to the systems where data lives". (intro)
- The problem: "Every new data source requires its own custom implementation, making truly connected systems difficult to scale." (intro)
- The answer: "a universal, open standard for connecting AI systems with data sources, replacing fragmented integrations with a single protocol." (intro)
- "developers can either expose their data through MCP servers or build AI applications (MCP clients) that connect to these servers." (Model Context Protocol)
- Shipped with pre-built servers for Google Drive, Slack, GitHub, Git, Postgres and Puppeteer. (same)
- "MCP was created at Anthropic by David Soria Parra and Justin Spahr-Summers." (An open community)

## Visuals worth redrawing

- None.

## My notes

- Doesn't use the phrase "N×M"; the idea is there ("separate connectors for each data source").
