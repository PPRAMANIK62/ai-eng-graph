---
id: openrouter-model-fallbacks
title: Model Fallbacks
author: OpenRouter (docs)
url: https://openrouter.ai/docs/guides/routing/model-fallbacks
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenRouter's `models` parameter: list model IDs in priority order, and if the first returns an error the router tries the next. Any error can trigger it by default, including context-length errors and moderation refusals. You pay for the model that answered.

## Key claims

- What triggers it: try other models "if the primary model’s providers are down, rate-limited, or refuse to reply due to content moderation." (intro)
- "By default, any error can trigger the use of a fallback model, including: Context length validation errors; Moderation flags for filtered models; Rate-limiting; Downtime". (Fallback behavior)
- If the fallback also fails, "OpenRouter will return that error." (Fallback behavior)
- Billing: "Requests are priced using the model that was ultimately used, which will be returned in the model attribute of the response body." (Pricing)
- On the Anthropic Messages endpoint, a `fallbacks` parameter takes at most 3 entries, each only a `model`; per-attempt overrides like `max_tokens` or `thinking` are rejected. (Using with the Anthropic Messages API, Limitations)

## Visuals worth redrawing

- None.

## My notes

- The `model` field in the response is how you know a fallback happened; log it.
