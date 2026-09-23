---
id: ainslie-gqa
title: "GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints"
author: Joshua Ainslie, James Lee-Thorp, Michiel de Jong, Yury Zemlyanskiy, Federico Lebrón, Sumit Sanghai (Google)
url: https://arxiv.org/abs/2305.13245
published: 2023-05-22
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The paper that introduced grouped-query attention. Multi-query attention (one shared set of keys and values) makes decoding much faster but can hurt quality. GQA uses a few shared sets instead of one, getting quality close to full multi-head attention at speed close to multi-query.

## Key claims

- MQA uses one key-value head and speeds up decoding a lot. "Multi-query attention (MQA), which only uses a single key-value head, drastically speeds up decoder inference." (Abstract)
- But it can lower quality. "MQA can lead to quality degradation" (Abstract)
- Existing models can be converted with 5% of the original pre-training compute. "using 5% of original pre-training compute" (Abstract)
- GQA: more than one, fewer than the number of query heads. "an intermediate (more than one, less than number of query heads) number of key-value heads" (Abstract)
- Result. "uptrained GQA achieves quality close to multi-head attention with comparable speed to MQA." (Abstract)

## Visuals worth redrawing

- Three panels, MHA / GQA / MQA: query heads on top, key-value heads below, lines showing which queries share which key-value head. Good secondary visual for kv-cache.

## My notes

- Abstract only (revised 2023-12-23).
- The abstract says "speed", not "memory". The memory link (fewer KV heads → smaller cache) is from `databricks-llm-inference` and `nvidia-inference-optimization`.
