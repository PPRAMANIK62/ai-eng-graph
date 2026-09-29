---
id: ji-manus-context-engineering
title: "Context Engineering for AI Agents: Lessons from Building Manus"
author: Yichao "Peak" Ji (Manus)
url: https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
published: 2025-07-18
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

The Manus team's lessons from building an agent on frontier models. The first and biggest: design around the KV cache. Agent contexts grow every step while outputs stay short, so input dominates cost and prefix reuse matters most. Also covers masking tools instead of removing them, using the file system as memory, and keeping errors in context.

## Key claims

- "I'd argue that the KV-cache hit rate is the single most important metric for a production-stage AI agent. It directly affects both latency and cost." (Design Around the KV-Cache)
- Agents are input-heavy. "In Manus, for example, the average input-to-output token ratio is around 100:1." (same)
- Old Sonnet price example: cached input 0.30 USD/MTok vs uncached 3 USD/MTok, "a 10x difference." (same)
- Timestamps kill the cache. "A common mistake is including a timestamp—especially one precise to the second—at the beginning of the system prompt." (same)
- Append-only context and deterministic serialization: "Many programming languages and libraries don't guarantee stable key ordering when serializing JSON objects, which can silently break the cache." (same)
- For self-hosted models (vLLM), enable prefix caching and use session IDs "to route requests consistently across distributed workers." (same)
- Don't add or remove tools mid-iteration: tool definitions sit near the front, "So any change will invalidate the KV-cache for all subsequent actions and observations." (Mask, Don't Remove)
- Caching doesn't make long input free: "Long inputs are expensive, even with prefix caching. You're still paying to transmit and prefill every token." (Use the File System as Context)
- A typical task takes around 50 tool calls. (Manipulate Attention Through Recitation)

## Visuals worth redrawing

- The agent loop with a growing context and a short output per step.

## My notes

- Prices quoted are old Claude Sonnet prices; practices still match the 2026 provider docs.
