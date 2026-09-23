---
id: baseten-inference-guide
title: A guide to LLM inference and performance
author: Varun Shenoy, Philip Kiely (Baseten)
url: https://www.baseten.co/blog/llm-transformer-inference-guide/
published: 2025-05-18        # "Last updated May 18, 2025"; first published earlier
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

A vendor explainer that works through the arithmetic of why generating tokens is memory-bound. It compares how many calculations a GPU can do per byte it reads from memory (the ops:byte ratio) with how many calculations a model's decode step actually does per byte, using an A10 GPU and Llama 2 7B. It also sizes the KV cache for that model.

## Key claims

- The ops:byte ratio: calculations a GPU can do per byte of memory it moves. "This tells us how many floating point operations per second (FLOPS) we can complete for every byte of memory we access." (Calculating the operations per byte (ops:byte) ratio)
- A10 numbers: 125 TFLOPS of compute, 600 GB/s memory bandwidth, so 208.3 ops per byte. "ops_to_byte_A10 = compute_bw / memory_bw = 125 TF / 600 GB/S = 208.3 ops / byte" (Calculating the operations per byte (ops:byte) ratio)
- Below that ratio you're memory-bound. "If we find ourselves only able to complete fewer than 208.3 operations per byte, our system performance is **memory bound**." (Calculating the operations per byte (ops:byte) ratio)
- Above it you're compute-bound. "If we want to do more than 208.3 floating point operations per byte, our system is instead **compute bound**." (Calculating the operations per byte (ops:byte) ratio)
- Llama 2 7B's attention does about 62 ops per byte, well under 208. "Our arithmetic intensity for Llama 2 7B is 62 operations per byte, which is way less than our A10's ops:byte ratio of 208.3." (Discovering our inference bottleneck; the formula ending "= 62 ops/byte for Llama 2 7B" is in Calculating arithmetic intensity)
- So decode is memory-bound. "Thus, during the autoregressive phase, our model is **memory bound**." (Discovering our inference bottleneck)
- Prefill works on the whole prompt at once and is compute-bound. (Prefilling with batched prompt tokens on each GPU)
- Time per token from bandwidth alone: 2 bytes x 7B parameters over 600 GB/s is about 23 ms. "`(2 * 7B) bytes / (600 GB/s)` = 23 ms/token" (Generating a single token on each GPU)
- The A10 has 24 GB of memory; after Llama 2 7B's 14 GB of 16-bit weights, about 10 GB is left. "Recall that we have 10 GB of memory left on our A10 after loading in our 7B parameter model: 24 GB - (2 * 7GB) = 10GB" (Batching memory-bound processes on a GPU)
- KV cache for Llama 2 7B is about 0.5 MB per token. "kv_cache_size = (2 * 2 * n_layers * d_model) bytes/token = (4 * 32 * 4096) bytes/token = 524288 bytes/token ~ 0.00052 GB/token" (Batching memory-bound processes on a GPU)
- On an A10 that leaves room for about 19,230 tokens of cache, for example a batch of 4 full sequences. "Our KV cache can comfortably accommodate 19,230 tokens" (Batching memory-bound processes on a GPU)
- That space fits 4 full-length sequences at once. "Thus, for Llama 2's standard sequence length of 4096 tokens, our system has the bandwidth to handle a batch of 4 sequences concurrently." (Batching memory-bound processes on a GPU)
- Batching reuses weights already loaded, raising utilization. "run forward passes through our model in **batches**" (Batching memory-bound processes on a GPU)

## Visuals worth redrawing

- A number line of ops per byte: decode at ~62, the A10's ridge at 208, with "memory-bound" left and "compute-bound" right. Good for the prefill-decode node.

## My notes

- Not primary: Baseten sells inference. The arithmetic is standard and checkable.
- A10 is a small, older GPU. The point (decode does few calculations per byte) holds on bigger GPUs; the exact numbers don't.
- The 4 in the KV formula = 2 (K and V) x 2 bytes (fp16); 32 layers; 4096 hidden size.
