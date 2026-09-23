---
id: weng-inference-optimization
title: Large Transformer Model Inference Optimization
author: Lilian Weng
url: https://lilianweng.github.io/posts/2023-01-10-inference-optimization/
published: 2023-01-10
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

A long survey of ways to make big transformer inference cheaper. The part used here is the opening: inference is hard because of memory (weights plus the KV cache) and because decoding one token at a time can't be parallelized, with a striking example of how big the KV cache can get.

## Key claims

- Two reasons inference is hard, first: memory. "Large memory footprint. Both model parameters and intermediate states are needed in memory at inference time." (Why is it hard to run inference for large transformer models?)
- Second: decoding is sequential. "Low parallelizability. Inference generation is executed in an autoregressive fashion, making the decoding process hard to parallel." (Why is it hard...)
- The KV cache must stay in memory during decoding; at batch 512 and context 2,048 it's 3TB, three times the model's size. "For a batch size of 512 and context length of 2048, the KV cache totals 3TB, that is 3x the model size (!)" (Why is it hard...)
- Multi-query attention shares keys and values across heads, shrinking the cache. "greatly reducing the size of these tensors and the memory cost." (Architectural optimization)

## Visuals worth redrawing

- None used.

## My notes

- The 3TB example cites Pope et al. 2022 and doesn't name the model size in the text I got. "3x the model size" implies a model of about 1TB of weights. Don't state a parameter count.
- 2023 survey; many of the other optimizations it lists are dated.
