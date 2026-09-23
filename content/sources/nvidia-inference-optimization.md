---
id: nvidia-inference-optimization
title: "Mastering LLM Techniques: Inference Optimization"
author: Shashank Verma, Neal Vaidya (NVIDIA)
url: https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/
published: 2023-11-17
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

NVIDIA's overview of LLM inference. It describes prefill and decode in terms of GPU work (matrix-matrix vs matrix-vector), explains the KV cache and gives its size formula with a Llama 2 7B example, and covers the main ways to shrink or manage the cache: multi-query and grouped-query attention, and PagedAttention.

## Key claims

- Prefill computes keys and values for the whole prompt in parallel and keeps the GPU busy. "this is a matrix-matrix operation that's highly parallelized. It effectively saturates GPU utilization." (Prefill phase or processing the input)
- Decode needs all previous keys and values for each new token, and underuses the GPU. "This is like a matrix-vector operation that underutilizes the GPU" (Decode phase or generating the output)
- Decode is memory-bound. "The speed at which the data...is transferred to the GPU from memory dominates the latency, not how fast the computation actually happens. In other words, this is a memory-bound operation." (Decode phase or generating the output)
- The KV cache avoids recomputing keys and values for past tokens by keeping them in GPU memory. "To avoid recomputing all these tensors for all tokens at each time step, it's possible to cache them in GPU memory." (Key-value caching)
- Size formula. "Total size of KV cache in bytes = (batch_size) * (sequence_length) * 2 * (num_layers) * (hidden_size) * sizeof(FP16)" (LLM memory requirement)
- Example: Llama 2 7B, batch size 1, 4,096-token sequence: about 2 GB. "with a Llama 2 7B model...batch size of 1, the size of the KV cache will be...~2 GB." (LLM memory requirement)
- It grows linearly with batch size and sequence length. "Growing linearly with batch size and sequence length, the memory requirement can quickly scale." (LLM memory requirement)
- MQA shares one set of keys and values across all heads. "shares the keys and values among the multiple attention heads" (Multi-query attention)
- GQA is the middle ground. "Grouped-query attention (GQA) strikes a balance between MHA and MQA by projecting key and values to a few groups." (Grouped-query attention)
- PagedAttention stores the cache in non-contiguous blocks, removing waste from over-allocating and allowing bigger batches. "eliminating fragmentation from static over-provisioning and enabling larger batch sizes." (Efficient management of KV cache with paging)

## Visuals worth redrawing

- The prefill/decode figure (all prompt tokens in at once, then one token per step). Redraw for the prefill-decode node.

## My notes

- 2023, Llama 2 era. The formula has no n_kv_heads term; with GQA the hidden_size term shrinks (see `databricks-llm-inference` formula, which includes n_kv_heads).
- 2 GB checks out with Baseten's ~0.5 MB/token x 4,096 tokens.
