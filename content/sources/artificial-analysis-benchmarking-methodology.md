---
id: artificial-analysis-benchmarking-methodology
title: Artificial Analysis Benchmarking Methodology
author: Artificial Analysis
url: https://artificialanalysis.ai/methodology
published: 2026
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The top-level methodology page for Artificial Analysis, a third party that benchmarks model intelligence, price and speed. It defines the terms used on its charts: endpoints and providers, open weights, a blended price (7:2:1 cache hit, input, output), and cost per task, which counts the tokens a model actually uses. The speed-measurement details are on a sub-page (see `artificial-analysis-methodology`).

## Key claims

- One model, many endpoints. "A single model may have multiple endpoints across different providers." (Definitions, Endpoint)
- Speed is measured as customers see it. "benchmark results are not intended to represent the maximum possible performance on any particular hardware platform, they are intended to represent the real-world performance customers experience across providers." (Scope)
- Open weights vs open source. "We refer to 'open weights' or just 'open' models rather than 'open-source' as many open LLMs have been released with licenses that do not meet the full definition of open-source software." (Definitions, Open Weights)
- Blended price. "we calculate a blended price assuming a 7:2:1 ratio of cache hit, input, and output tokens." (Definitions, Price (Blended))
- Cost per task depends on tokens used, not just per-token price. "models that produce longer answers or more reasoning tokens will have a higher cost per task, even at identical per-token prices." (Definitions, Cost per Task)
- Tokens per second are counted in a common unit. "All 'tokens per second' metrics refer to OpenAI tokens." Prices are in each model's native tokens. (Definitions, OpenAI Tokens)

## Visuals worth redrawing

- None.

## My notes

- The blended 7:2:1 ratio is their assumption; your mix of cached, input and output tokens will differ.
