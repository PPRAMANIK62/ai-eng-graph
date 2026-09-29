---
id: mcp-spec-tools
title: "Model Context Protocol specification 2026-07-28: Tools"
author: MCP maintainers
url: https://modelcontextprotocol.io/specification/2026-07-28/server/tools
published: 2026-07-28
accessed: 2026-09-29
kind: spec
primary: true
---

## Summary

The Tools section of the 2026-07-28 MCP spec (the latest revision as of 2026-09). It defines how servers list and run tools, the tool definition fields, name rules, results (text, images, structured content with an output schema), the two kinds of errors, advice for stateful tools now that the protocol has no sessions, and security rules for servers and clients, including that a human should be able to deny tool calls.

## Key claims

- Tools are "model-controlled": the model discovers and calls them. (User Interaction Model)
- Human in the loop. "For trust & safety and security, there SHOULD always be a human in the loop with the ability to deny tool invocations." Apps SHOULD show which tools are exposed, show when they run, and "Present confirmation prompts to the user for operations". (User Interaction Model)
- Tool names SHOULD be 1 to 128 characters, case-sensitive, using letters, digits, underscore, hyphen and dot, and unique within a server. Clients that combine servers "SHOULD implement a disambiguation strategy such as prefixing tool names with a server identifier." (Tool Names)
- Servers SHOULD return tools in a deterministic order, which "improves LLM prompt cache hit rates". (Capabilities)
- Annotations are untrusted: "clients MUST consider tool annotations to be untrusted unless they come from trusted servers." (Tool)
- `outputSchema` is optional; if given, servers MUST return conforming `structuredContent` and clients SHOULD validate it. (Output Schema)
- Stateful tools use handles. "MCP has no protocol-level session", so servers that need state should return "an explicit handle from a creation tool" and accept it on later calls (e.g. `create_basket` returns `bsk_a1b2c3`). State the handle's lifetime in the tool description, and an expired handle should return a tool execution error "so the model can recover by creating a new one." (Stateful Tools)
- Two kinds of errors. Protocol errors (unknown tool, malformed request) are JSON-RPC errors "that models are less likely to be able to fix". "Tool Execution Errors contain actionable feedback that language models can use to self-correct and retry with adjusted parameters", returned with `isError: true`. Example: "Invalid departure date: must be in the future. Current date is 08/08/2025." (Error Handling)
- Servers MUST validate inputs, implement access controls, rate limit, sanitize outputs. Clients SHOULD prompt for confirmation on sensitive operations, "Show tool inputs to the user before calling the server, to avoid malicious or accidental data exfiltration", validate results, use timeouts, and log calls. (Security Considerations)

## Visuals worth redrawing

- The message flow: tools/list, model selects, tools/call, result back.

## My notes

- The "SHOULD always be a human in the loop" line sits against Anthropic's 93% approval data (anthropic-claude-code-auto-mode).
