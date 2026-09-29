---
id: rose-prompt-caching
title: "Prompt caching: 10x cheaper LLM tokens, but how?"
author: Sam Rose (ngrok)
url: https://ngrok.com/blog/prompt-caching
published: 2025-12-16
accessed: 2026-09-29
kind: blog
primary: false
---

## Summary

A long visual walk from tokens through attention to what providers actually store when they cache a prompt: the K and V matrices for the prefix, not the response. The author also sent hundreds of requests to Anthropic and OpenAI and reports lower time to first token on fully cached prompts, and very different hit rates between the two.

## Key claims

- Cached input tokens were 10x cheaper at both providers when written. "cached input tokens are 10x cheaper in dollars per token than regular input tokens for both OpenAI and Anthropic’s APIs." (intro)
- His test: "I sent hundreds of requests to both Anthropic and OpenAI and noticed a substantial reduction in time-to-first-token latency for prompts where every input token was cached." (intro)
- It isn't a response cache: send the same prompt a dozen times and "notice that you get different responses each time even when the usage section shows cached input tokens." (intro)
- What's cached. "The data that gets cached is the result of embeddings * WK and embeddings * WV, so K and V." (end of attention section)
- The latency charts at the top of the post are labelled GPT-5 and Sonnet 4.5. (intro)
- Partial prefix matches still help: "you can partially match a cache entry and still use the bit that matched, not the whole thing." (same)
- OpenAI automatic caching hit rate in his test: "by sending a request and then immediately resending it, I was able to get a hit rate of about 50%." (same)
- Anthropic explicit caching: "in my experiments Anthropic route you to cached entries 100% of the time when you ask them to cache a prompt." (same)
- Sampling settings don't affect the cache: they act after attention, "so prompt caching is unaffected by these parameters." (Wait, what about temperature?)

## Visuals worth redrawing

- Interactive cache visual: prompts with shared prefixes filling and reusing cache entries.

## My notes

- Secondary (not built by a provider) but he ran his own requests. His hit-rate numbers are from late 2025 and from before OpenAI's GPT-5.6 caching changes; OpenAI's current doc says routing changed for GPT-5.6+.
- He doesn't publish the raw latency numbers in the text I could read (the charts are interactive).
