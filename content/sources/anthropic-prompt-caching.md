---
id: anthropic-prompt-caching
title: Prompt caching
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/build-with-claude/prompt-caching
published: undated           # no date on the page; lists Opus 5.5, Fable 5.1 and the 2026-09-15 inline-tools beta, so current as of the access date
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Anthropic's reference for prompt caching on the Claude API. You mark where a reusable prefix ends with `cache_control` (or let automatic caching place the mark), the API stores the processed prefix, and later requests with a byte-identical prefix read it back at a fraction of the input price. Covers the prefix order (tools, system, messages), lifetimes of 5 minutes or 1 hour, per-model minimum lengths, what breaks the cache, and the usage fields that tell you whether it worked. Read in full through the page's markdown version.

## Key claims

- What it does. "Prompt caching optimizes your API usage by allowing resuming from specific prefixes in your prompts." (intro)
- Two ways to turn it on: automatic caching (one top-level `cache_control`, breakpoint moves forward as the conversation grows) or explicit breakpoints on content blocks. "Add a single `cache_control` field at the top level of your request." (intro)
- How a request is handled: check for a cached prefix; if found use it; "Otherwise, it processes the full prompt and caches the prefix once the response begins." (How prompt caching works)
- Default lifetime 5 minutes, refreshed free on each use. "By default, the cache has a 5-minute lifetime. The cache is refreshed for no additional cost each time the cached content is used." (How prompt caching works)
- The lifetime counts from the start of the request, so generation time eats into it: "if a response takes 4 minutes to stream, a follow-up request that reuses the same cached prefix must start within about 1 minute of that response completing." (How prompt caching works)
- The prefix is the whole request in a fixed order. "Prompt caching references the entire prompt: `tools`, `system`, and `messages` (in that order), up to and including the block designated with `cache_control`." (How prompt caching works, tip)
- Price multipliers: "5-minute cache write tokens are 1.25 times the base input tokens price", "1-hour cache write tokens are 2 times the base input tokens price", "Cache read tokens are 0.1 times the base input tokens price" with exceptions: 0.05x on Opus 5.5, 0.025x on Fable 5.1 and Mythos 5.1. (Pricing, note and footnotes)
- Price table examples, per million tokens (base input / 5m write / 1h write / hit / output): Opus 5.5 $4 / $5 / $8 / $0.20 / $20; Sonnet 5 $2 / $2.50 / $4 / $0.20 / $10; Haiku 4.5 $1 / $1.25 / $2 / $0.10 / $5; Fable 5.1 $10 / $12.50 / $20 / $0.25 / $50. (Pricing table)
- Writes happen only at the breakpoint, as a hash of the whole prefix. "Marking a block with `cache_control` writes exactly one cache entry: a hash of the prefix ending at that block." (How automatic prefix checking works)
- Reads look back at most 20 blocks for earlier writes. "The system checks at most 20 positions per breakpoint, counting the breakpoint itself as the first." (How automatic prefix checking works)
- A timestamp in the cached block means a write every time and never a read: "You pay for a fresh cache write on every request and never get a read." (Example: breakpoint on a block that changes)
- Minimum cacheable length per model: 512 tokens for Fable 5.1, Mythos 5.1, Opus 5.5, Opus 5, Sonnet 5.5, Fable 5, Mythos 5; 1,024 for Opus 4.8, Sonnet 5, Sonnet 4.6, Sonnet 4.5 and older retired models; 2,048 for Opus 4.7 and Mythos Preview; 4,096 for Opus 4.6, Opus 4.5 and Haiku 4.5. (Cache limitations)
- Too-short prompts fail silently. "Any requests to cache fewer than this number of tokens will be processed without caching, and no error is returned." (Cache limitations)
- Parallel requests don't share a cache until the first response starts. "a cache entry only becomes available after the first response begins." (Cache limitations)
- Up to 4 breakpoints. "You can define up to 4 cache breakpoints" (FAQ)
- What invalidates: the hierarchy is `tools` → `system` → `messages`; "Changes at each level invalidate that level and all subsequent levels." Changing tool definitions invalidates everything; toggling web search or citations, or switching speed, invalidates system and messages; `tool_choice` and adding or removing images invalidate messages; thinking and effort settings always invalidate messages. (What invalidates the cache)
- Caches are isolated per organization and, on the Claude API, per workspace. "Different organizations never share caches, even if they use identical prompts." (Cache storage and sharing)
- Exact match only. "Cache hits require 100% identical prompt segments, including all text and images up to and including the block marked with cache control." (Cache storage and sharing)
- It doesn't change the answer. "Prompt caching has no effect on output token generation." (Cache storage and sharing)
- Usage fields: `cache_creation_input_tokens`, `cache_read_input_tokens`, `input_tokens`; "total_input_tokens = cache_read_input_tokens + cache_creation_input_tokens + input_tokens". If both cache fields are 0, nothing was cached. (Tracking cache performance; FAQ)
- 1-hour cache and rate limits: "cache hits are not deducted against your rate limit." Latency is the same for both lifetimes: "You will generally see improved time-to-first-token for long documents." (1-hour cache duration)
- When to pick the 1-hour cache: prompts used less often than every 5 minutes but more often than hourly, and "When latency is important and your follow-up prompts may be sent beyond 5 minutes." (When to use the 1-hour cache)
- If you need hits for parallel requests, "wait for the first response before sending subsequent requests." (Cache limitations)
- Pre-warming: load a prefix before the user's first request to remove "the cache-miss latency penalty on the first user interaction". (Pre-warming the cache)

## Visuals worth redrawing

- The prefix order tools → system → messages with a breakpoint, and which levels a change invalidates.

## My notes

- Prices change often. Date every number ("as of 2026-09").
- Model names here (Fable, Mythos, Opus 5.5) are current as of the access date.
