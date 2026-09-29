---
id: redis-semantic-cache
title: Redis semantic cache
author: Redis (docs)
url: https://redis.io/docs/latest/develop/use-cases/semantic-cache/
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Redis's use-case page for a semantic cache: store each past prompt's embedding next to the LLM's full response, and on a new question run a nearest-neighbour search with a distance threshold and metadata filters (tenant, locale, model version). A hit returns the stored answer without calling the model; a miss calls the model and writes a new entry with a TTL. It is a vendor page, so the savings figures come without data.

## Key claims

- What it is for: reuse responses for "queries that are semantically similar — not just byte-identical", returning "a previously validated answer in tens of milliseconds." (When to use Redis as a semantic cache)
- Exact-match caches miss paraphrases like "What's your return policy?" versus "How do I return an item?". (Why the problem is hard)
- Its view of provider prompt caching: it "discounts repeated prefixes but still runs the model end-to-end on every call, so it does not address latency or full-response reuse across users." (Why the problem is hard)
- The hard part. "The core difficulty is threshold tuning: too loose and you serve wrong answers, too tight and the hit rate collapses." (Why the problem is hard)
- Hard limits next to the fuzzy match: "Effective semantic caching combines soft similarity matching with hard metadata boundaries (tenant, locale, model version, safety flags)". (same)
- It stores whole answers, unlike RAG: "Semantic caching stores complete LLM responses, not document chunks, and the goal is to skip the LLM entirely on a hit". (same)
- Savings claim, no data given: token spend down "by 30% or more without a measurable quality regression" on FAQ bots, helpdesks and internal assistants. (What you can expect)
- The mechanism: each entry holds prompt, embedding, response and metadata; one KNN search with a pre-filter; "On a hit above the configured distance threshold the application serves the cached response directly; on a miss it runs the LLM and writes the new prompt, response, and metadata back to the same key pattern with a TTL." (How Redis supports the solution)
- TTL and eviction: `EXPIRE` ages out stale answers; LRU/LFU eviction bounds memory. (same)

## Visuals worth redrawing

- The hit/miss flow: embed, search with filters, threshold check, serve or call the LLM and write back.

## My notes

- Vendor docs. The "30% or more" figure has no study behind it on this page.
- The claim that prompt caching "does not address latency" conflicts with Anthropic's measured time-to-first-token drops. Both are partly right: prompt caching cuts prefill time, not generation time; a semantic hit skips both.
- The page doesn't state a default threshold value.
