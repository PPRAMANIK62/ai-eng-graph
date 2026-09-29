---
id: openai-prompt-caching
title: Prompt caching
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/prompt-caching
published: undated           # no date on the page; covers GPT-5.6 and GPT-6, so current as of the access date
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI's guide to prompt caching. Caching is on by default: the API saves the key-value state for a matching prompt prefix and reuses it on later requests. From GPT-5.6 on, cache writes cost 1.25x the input price, reads 0.1x, entries last at least 30 minutes, and the minimum prefix is 1,024 tokens; you can place explicit breakpoints or let OpenAI place them. Older models had free writes and in-memory or 24-hour retention. Cached tokens still count toward rate limits. Read in full through the page's markdown version.

## Key claims

- What is cached: KV state, not text. "The prompt cache stores key-value (KV) tensors, not the tokens themselves." (What is the prompt cache?)
- New input still gets processed. "It still needs to process any new input to generate a new response." (What is the prompt cache?)
- On by default. "Prompt caching is enabled by default for supported OpenAI models." (Why prompt caching matters)
- The benefits it claims: compute, "discounted up to 90%", and "Reduce the time spent processing input before the response starts." (Why prompt caching matters)
- The whole rendered prefix must match: "Cache reuse requires the entire rendered prefix to match." Settings that change the prefix include `model` ("A different model can use different weights and caching behavior."), `tools`, `parallel_tool_calls`, `text.format`, `reasoning.effort`, `text.verbosity`, `context_management`. (Which settings affect the cached prefix?)
- Minimum length. "The minimum cacheable prompt length is 1,024 tokens for GPT-5.6 and later and varies by request settings for earlier models." (How caching works)
- GPT-5.6 and later prices: "cache writes cost 1.25× the standard, uncached input-token rate", reads "cost only 0.1× that rate". Worked example: one write plus one read is 1.35x vs 2x uncached; "across ten requests, one write and nine full reads cost 2.15×, compared with 10× without caching." (GPT-5.6 and later)
- Explicit mode (`prompt_cache_options.mode: explicit`, `prompt_cache_breakpoint`) or implicit mode (breakpoint at the end of the latest eligible message); "Each request can create up to four cache writes." (GPT-5.6 and later)
- Lifetime on GPT-5.6+: "A cached prefix remains eligible for reuse for 30 minutes after its most recent write or reuse, though OpenAI may retain it longer." (Cache lifetime)
- Earlier models: `in_memory` "typically remain active for around 5 to 10 minutes of inactivity, up to one hour"; `24h` extended retention "can retain them for up to 24 hours". Earlier models had "No additional cache-write charge". (Cache lifetime; Summary of model differences)
- Caches live on individual machines, and routing matters: "Cached states live on individual machines, where traffic above 15 requests per minute can lead to overflow routing." Routing uses "A hash of the initial tokens after the hidden OpenAI content". (Cache location)
- Cache-hit probing is defined as "submitting candidate prompts and observing cache hits to learn whether matching content was previously cached." (Prompt cache keys)
- `prompt_cache_key` helps routing on models before GPT-5.6; on GPT-5.6+ it is for separate cache accounting per customer, which also "helps prevent cache-hit probing across customers". (Prompt cache keys; Separate cache accounting with keys)
- Not shared across organizations. "Caches are not shared across organizations" (Cache location)
- Minimum-length cost trap with a formula: with M = 1,024, r = 0.1, w = 1.25, "Across 10 requests, expanding an original prefix of at least 221 tokens to 1,024 tokens is cheaper." (Escape the minimum cacheable length cost trap)
- Keep the prefix stable: put timestamps and user-specific content at the end; "Append new messages rather than rewriting earlier turns." "Summarization, compaction, or context truncation can change the prefix and reset cache reuse." Change tools with `tool_choice` / `allowed_tools` instead of removing definitions. (How to optimize prompt caching)
- Monitor: track `cached_tokens` and `cache_write_tokens`, cache-hit rate = cached tokens / input tokens. (Monitor cache performance)
- Output unchanged. "Prompt caching does not change how the model generates output tokens." (FAQ)
- Rate limits: "Yes. Cached input tokens still count toward tokens-per-minute limits." (FAQ)
- No manual clearing. "Manual cache clearing is not currently available." (FAQ)

## Visuals worth redrawing

- The minimum-length cost-trap chart (cost vs prefix length).

## My notes

- Contrast with Anthropic: on Claude, cached reads don't count toward ITPM on most models; on OpenAI they count toward TPM.
