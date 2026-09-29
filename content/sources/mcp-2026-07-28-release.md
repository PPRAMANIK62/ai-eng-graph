---
id: mcp-2026-07-28-release
title: The 2026-07-28 Specification
author: David Soria Parra and Den Delimarsky (MCP lead maintainers)
url: https://blog.modelcontextprotocol.io/posts/2026-07-28/
published: 2026-07-28
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

The release post for MCP 2026-07-28. The headline is a stateless core: the initialize handshake and session header are gone, every request carries its own version and capabilities, and server-to-client requests become Multi Round-Trip Requests. It also covers header-based routing, cacheable list results, extensions, authorization hardening, deprecations and SDK support.

## Key claims

- Scale as of 2026-07: "close to half-a-billion downloads a month" across Tier 1 SDKs, with TypeScript and Python each past 1 billion total downloads. (intro)
- "MCP is transforming from a bidirectional stateful protocol into a request/response stateless protocol." It was "one of the most highly-requested features". (intro)
- "we’ve officially retired the initialize / initialized exchange along with the Mcp-Session-Id header". "Each request now travels on its own, carrying its protocol version, client identity, and client capabilities in _meta." A new `server/discover` exists, "however, it is not required." (No handshake or sessions)
- Why: "Any request can now land on any server instance behind a plain round-robin load balancer without needing shared storage." (same)
- State moves into the open: "If your server needs to carry state across calls, mint an explicit handle from a tool and have the model pass it back as an argument." They found this "works better than session state hidden in the transport". (same)
- MRTR "replaces the server-initiated elicitation/create, sampling/createMessage, and roots/list requests that previously required a held-open stream." The server returns `resultType: "input_required"`; the client retries with `inputResponses`. (Multi Round-Trip Requests)
- Streamable HTTP requests must carry `Mcp-Method` and `Mcp-Name` headers so gateways can route and authorize without parsing bodies. (Header-based routing)
- List responses carry cache hints (`ttlMs`, `cacheScope`) and a deterministic order, "so clients can cache tool catalogs and keep upstream prompt caches stable across reconnects". (intro)
- Tasks become an extension, alongside MCP Apps and Enterprise Managed Authorization. (intro)
- Authorization: RFC 9207 issuer validation, and a shift away from Dynamic Client Registration toward client metadata documents (CIMD). (intro)
- Deprecations: Roots, Sampling and Logging. "They still work, and they’ll keep working for at least twelve months." The legacy HTTP+SSE transport is also deprecated. (Deprecations)
- SDKs: TypeScript, Python, Go and C# updated; migration notes for breaking changes, especially for anyone who relied on session IDs. (SDKs)

## Visuals worth redrawing

- Old vs new request flow: handshake plus session vs self-contained requests.

## My notes

- Most tutorials written before 2026-07-28 describe the initialize handshake and sessions; they are out of date.
