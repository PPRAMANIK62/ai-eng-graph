---
id: langfuse-cost-tracking
title: Token & Cost Tracking
author: Langfuse
url: https://langfuse.com/docs/observability/features/token-and-cost-tracking
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

How Langfuse puts a dollar figure on each model call. Usage (tokens per type) and cost come either from what you send it, taken from the provider's response, or are inferred by matching the model name to a price table and multiplying. It lists the traps: token types must not overlap, inferred prices are fixed at ingestion time, and reasoning models can't be priced by re-tokenizing.

## Key claims

- Two things recorded per generation: usage details (units per usage type) and cost details (USD per usage type). (How cost tracking works)
- Ingested: "you send the usage and cost from the LLM response, via the API, SDKs, or an integration." Inferred: "Langfuse works them out from the generation's `model` parameter, using a model definition that stores prices per usage type." (Ingested vs inferred)
- "When both are available, ingested values take priority over inferred ones." (same)
- Cost is price times usage: "The `model` parameter of the generation is matched to a model definition, which stores a price per usage type. Langfuse then multiplies those prices by the observation's usage to calculate cost." (Model definitions)
- Ships with price tables for OpenAI, Anthropic and Google models; you can add your own for self-hosted or fine-tuned models. (same)
- Usage types don't overlap: "each token must be counted in exactly one key." Types include `input`, `output`, `cached_tokens`, `audio_tokens`. (Usage types)
- Pricing tiers exist for prices that change past usage thresholds or with parameters. (Pricing tiers)
- Reasoning models: "Cost inference by tokenizing the LLM input and output is not supported for reasoning models such as the OpenAI o1 model family." (Caveats)
- Prices are frozen at ingestion: "Inferred costs are calculated at ingestion time, updated defaults apply only to new generations." (Caveats)
- "Only `generation` and `embedding` observations track cost." (Caveats)

## Visuals worth redrawing

- None. The price-times-tokens roll-up is our own figure.

## My notes

- The reasoning-model caveat is because hidden reasoning tokens aren't in the visible text, so you can't count them yourself. Use the provider's reported usage.
