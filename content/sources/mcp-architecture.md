---
id: mcp-architecture
title: Architecture overview (MCP docs)
author: MCP project
url: https://modelcontextprotocol.io/docs/learn/architecture
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The MCP docs' walkthrough of the architecture, pinned to the 2026-07-28 revision. Hosts create one client per server; there is a data layer (JSON-RPC 2.0 messages and primitives) and a transport layer (stdio or Streamable HTTP). It walks through discovery, `tools/list`, `tools/call` and change notifications with full JSON examples, and marks sampling and logging as deprecated.

## Key claims

- "The MCP host accomplishes this by creating one MCP client for each MCP server." Example: VS Code as host, with one client for the Sentry server and another for the local filesystem server. (Participants)
- "Local MCP servers that use the STDIO transport typically serve a single MCP client, whereas remote MCP servers that use the Streamable HTTP transport will typically serve many MCP clients." (Participants)
- Two layers: data layer (JSON-RPC protocol, discovery, primitives, notifications) and transport layer (connection, framing, authorization). (Layers)
- Stdio "Uses standard input/output streams for direct process communication between local processes on the same machine". Streamable HTTP "Uses HTTP POST for client-to-server messages with optional Server-Sent Events for streaming"; "MCP recommends using OAuth to obtain authentication tokens." (Transport layer)
- "MCP is a stateless protocol. Every request carries the protocol version and the capabilities relevant to that request in its _meta field". (Statelessness and discovery)
- Three server primitives: "Tools: Executable functions that AI applications can invoke to perform actions", "Resources: Data sources that provide contextual information", "Prompts: Reusable templates that help structure interactions with language models". Example: a database server with query tools, a schema resource and a few-shot prompt. (Primitives)
- Client primitive: elicitation, delivered through Multi Round-Trip Requests. Sampling and logging are "deprecated as of protocol version 2026-07-28"; new code should call LLM provider APIs directly and log to stderr or OpenTelemetry. (Primitives)
- "Calling server/discover is optional. Because every request carries the same _meta fields, a client is free to send any request directly and handle a version error if one comes back." (Example, Discovery)
- The host merges tools from all connected servers into one registry the model sees; when the model calls a tool, the host routes the call to the right server and returns the result to the model. (Example, Tool Discovery / Tool Execution)
- Change notifications are opt-in via a long-lived `subscriptions/listen` stream and are best effort. (Notifications)

## Visuals worth redrawing

- Host with several clients, each with a dedicated connection to one server (local filesystem, local database, remote Sentry).

## My notes

- "MCP focuses solely on the protocol for context exchange—it does not dictate how AI applications use LLMs or manage the provided context." (Scope)
