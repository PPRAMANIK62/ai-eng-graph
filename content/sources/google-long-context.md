---
id: google-long-context
title: Long context
author: Google (Gemini API docs)
url: https://ai.google.dev/gemini-api/docs/long-context
published: 2026-06-22        # "Last updated 2026-06-22 UTC"
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

Google's guide to long context in the Gemini API. It gives a short history of window sizes, what 1M tokens holds in real terms, what used to be done to cope with small windows, and the limits: you pay for the input on every request, long inputs take longer before the first token, and accuracy drops when you look for several facts at once.

## Key claims

- The analogy. "An analogy for the context window is short term memory." (What is a context window?)
- History of sizes. "Earlier versions of generative models were only able to process 8,000 tokens at a time. Newer models pushed this further by accepting 32,000 or even 128,000 tokens." (Getting started with long context)
- Many Gemini models have 1M+. "Many Gemini models come with large context windows of 1 million or more tokens." (What is a context window?)
- What 1M tokens holds: 50,000 lines of code at 80 characters per line, 8 average English novels, transcripts of over 200 average podcast episodes. "8 average length English novels" (Getting started with long context)
- Old workarounds for small windows. "arbitrarily dropping old messages, summarizing content, using RAG with vector databases, or filtering prompts to save tokens." (Getting started with long context)
- Single-fact lookup is near perfect, but you pay the input every time. "You can get ~99% on a single query, but you have to pay the input token cost every time you send that query." (Long context limitations)
- Several facts at once: accuracy drops. "the model does not perform with the same accuracy." (Long context limitations)
- Longer queries take longer to the first token. "generally longer queries will have higher latency (time to first token)." (FAQs)
- Put the question at the end. "The model's performance will be better if you put your query / question at the end of the prompt (after all the other context)." (FAQs)
- Caching cuts the cost of resending the same files; with Gemini Flash the per-request cost is about 4x less. "The input / output cost per request with Gemini Flash for example is ~4x less than the standard input / output cost" (Long context optimizations)

## Visuals worth redrawing

- None on the page. The history (8K → 32K → 128K → 1M) makes a simple timeline bar.

## My notes

- The history sentence gives no years or model names; don't attach dates to 8K/32K/128K.
- "Put the query at the end" is Google's advice for Gemini; check other providers before stating it as general.
