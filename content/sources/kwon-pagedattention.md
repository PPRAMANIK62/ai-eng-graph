---
id: kwon-pagedattention
title: Efficient Memory Management for Large Language Model Serving with PagedAttention
author: Woosuk Kwon, Zhuohan Li, Siyuan Zhuang, Ying Sheng, Lianmin Zheng, Cody Hao Yu, Joseph E. Gonzalez, Hao Zhang, Ion Stoica
url: https://arxiv.org/abs/2309.06180
published: 2023-09-12
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The vLLM paper (SOSP 2023). It shows the KV cache is the main memory problem in serving: it's large, grows and shrinks per request, and naive handling wastes much of it, which caps how many requests fit in a batch. Storing the cache in pages, like an operating system's virtual memory, almost removes the waste and lets requests share cache.

## Key claims

- The KV cache per request is huge and changes size. "the key-value cache (KV cache) memory for each request is huge and grows and shrinks dynamically." (Abstract)
- Waste limits batch size. "this memory can be significantly wasted by fragmentation and redundant duplication, limiting the batch size." (Abstract)
- The idea comes from OS paging. "PagedAttention, an attention algorithm inspired by the classical virtual memory and paging techniques in operating systems" (Abstract)
- Near-zero waste and sharing. "(1) near-zero waste in KV cache memory and (2) flexible sharing of KV cache within and across requests to further reduce memory usage." (Abstract)
- 2-4x throughput at the same latency. "improves the throughput of popular LLMs by 2-4× with the same level of latency" (Abstract)
- Bigger gains for longer sequences and bigger models. "The improvement is more pronounced with longer sequences, larger models, and more complex decoding algorithms." (Abstract)

## Visuals worth redrawing

- None used from the paper (abstract only). A simple "cache in fixed-size pages" block diagram is easy to draw fresh.

## My notes

- Abstract only.
- "Sharing across requests" is where provider-side prompt caching begins conceptually; the prompt-caching node should cover that, not kv-cache.
