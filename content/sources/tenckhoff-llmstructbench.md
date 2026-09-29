---
id: tenckhoff-llmstructbench
title: "LLMStructBench: Benchmarking Large Language Model Structured Data Extraction"
author: Sönke Tenckhoff, Mario Koddenbrock, Erik Rodner
url: https://arxiv.org/abs/2602.14743
published: 2026-02-16
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

A 2026 benchmark for extracting structured data from text into JSON: 995 manually checked samples, 22 open models (plus GPT-4o as a reference), five prompting setups run through Ollama (with or without its JSON `format` parameter, with or without the schema and an example in the prompt). It scores both whether the document is valid and whether each value is right. The main finding: the prompting setup matters more than model size for getting valid JSON, but the setups that force valid structure raise wrong values, and wrong values are the biggest error everywhere. Read the HTML version in full.

## Key claims

- Scope. "Our open dataset comprises diverse, manually verified parsing scenarios of varying complexity and enables systematic testing across 22 models and five prompting strategies." (Abstract)
- 995 manually verified samples. (Introduction, contributions)
- Main finding. "we show that choosing the right prompting strategy is more important than standard attributes such as model size. This especially ensures structural validity for smaller or less reliable models but increase the number of semantic errors." (Abstract)
- Error types: MK missing key, MV missing value, WV wrong value. (Abbreviations)
- Why wrong values are weighted high: "a wrong value can silently corrupt downstream logic" (IV, metric weighting)
- Wrong values dominate. "wv errors remain the primary bottleneck across all configurations, suggesting that post-generation semantic validation or fine-tuning is needed for further gains." (VII Conclusion)
- The strictest setup, "PJ+" (the JSON Schema passed as Ollama's `format` parameter, plus the schema and an example object in the prompt), "is the safest choice for ensuring parseable outputs, especially for small or structurally unreliable models, but this comes at the cost of increased semantic errors." (VII Conclusion)
- "P" (schema and example in the prompt only, no `format` parameter) "often yields the best overall balance of accuracy and validity for well-aligned models but can fail catastrophically for some families (e.g., Phi )." (Table II; VII Conclusion)
- GPT-4o "did not exhibit a clear advantage over the best open-source models (e.g. Gemma3 - 27B )". (VII Conclusion)

## Visuals worth redrawing

- None needed; the finding is the split between valid structure and correct values.

## My notes

- It tests Ollama's `format` option on open models, not hosted strict-schema modes, so don't stretch it to claims about OpenAI or Claude structured outputs.
