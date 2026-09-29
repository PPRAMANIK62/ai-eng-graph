---
id: dettmers-llm-int8
title: "LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale"
author: Tim Dettmers, Mike Lewis, Younes Belkada, Luke Zettlemoyer
url: https://arxiv.org/abs/2208.07339
published: 2022-08-15
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

NeurIPS 2022 paper that made 8-bit inference work for models up to 175B parameters with no loss. The obstacle was a few "emergent outlier" features with very large values that ruin plain 8-bit rounding. The fix quantizes most values to 8 bits with their own scale per row and column, and keeps the few outlier dimensions in 16-bit.

## Key claims

- Halves inference memory with no loss. "We develop a procedure for Int8 matrix multiplication for feed-forward and attention projection layers in transformers, which cut the memory needed for inference by half while retaining full precision performance." (Abstract)
- Load and convert with no retraining. "a 175B parameter 16/32-bit checkpoint can be loaded, converted to Int8, and used immediately without performance degradation." (Abstract)
- The obstacle is outlier features. It works by "understanding and working around properties of highly systematic emergent features in transformer language models that dominate attention and transformer predictive performance." (Abstract)
- The fix: separate scales, plus 16-bit for outliers. "isolates the outlier feature dimensions into a 16-bit matrix multiplication while still more than 99.9% of values are multiplied in 8-bit." (Abstract)
- Made OPT-175B/BLOOM usable "on a single server with consumer GPUs". (Abstract)

## Visuals worth redrawing

- The mixed-precision decomposition figure (outlier columns split out to 16-bit).

## My notes

- Read from the abstract only.
