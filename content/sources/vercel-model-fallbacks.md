---
id: vercel-model-fallbacks
title: AI Gateway Model Fallbacks
author: Vercel (docs)
url: https://vercel.com/docs/ai-gateway/models-and-providers/model-fallbacks
published: 2026-09-10        # "Last updated September 10, 2026"
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

How Vercel's AI Gateway fails over. For each model it tries providers in your chosen order; if all providers for that model fail, it moves to the next model in your `models` list. The response metadata records every attempt.

## Key claims

- What it is. "You can configure model failover to specify backups that are tried in order if the primary model fails or is unavailable." (intro)
- Configure with a `models` array under `providerOptions.gateway`; the example falls back from `anthropic/claude-fable-5` to `anthropic/claude-opus-5` to `google/gemini-3.1-pro-preview`. (Using the models option)
- Combine with provider order: e.g. try `openai/gpt-6-astra` via Azure then OpenAI, then a second model the same way, then `anthropic/claude-opus-5`. (Combining with provider routing)
- Order of operations: route to the primary model; apply provider routing per model; "If all providers for a model fail, the gateway tries the next model in the models array"; "The response comes from the first successful model/provider combination". (How failover works)
- Visibility: "the modelAttempts array in the provider metadata shows each model that was tried", with error details for failed attempts. "Failover happens automatically. To see which model and provider served your request, check the provider metadata." (Example provider metadata)
- On evaluation requests, a conditional fallback can also react to "a successful but uncertain result". (Using the models option)

## Visuals worth redrawing

- The failover order: model A via provider 1, provider 2; then model B via provider 1, provider 2; then model C.

## My notes

- Gateway docs only; no numbers on how often fallbacks fire or how quality changes.
