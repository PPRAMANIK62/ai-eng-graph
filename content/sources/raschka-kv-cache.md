---
id: raschka-kv-cache
title: Understanding and Coding the KV Cache in LLMs from Scratch
author: Sebastian Raschka
url: https://magazine.sebastianraschka.com/p/coding-the-kv-cache-in-llms
published: 2025-06-17
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

A from-scratch walkthrough of the KV cache with code. It shows the waste it removes (without a cache, the model reprocesses the whole text for every new token), why only keys and values are cached, a measured 5x speedup on a small model, and the costs: memory that grows with every token, extra code, and no use in training.

## Key claims

- Definition. "A KV cache stores intermediate key (K) and value (V) computations for reuse during inference (after training), which results in a substantial speed-up when generating text." (Overview)
- The waste, with an example: from "Time" the model writes "flies", then reprocesses "Time flies" to write "fast". "In the next step, the full sequence 'Time flies' is reprocessed to generate the token 'fast'." (How LLMs Generate Text (Without and With a KV Cache))
- Without a cache the model reprocesses the full sequence for each new token. "reprocess the full sequence every time a new token (e.g., 'fast') is generated." (How LLMs Generate Text (Without and With a KV Cache))
- Keys and values of earlier tokens don't change, so they can be stored; each token is projected with W_k and W_v. "each input token (e.g., 'Time' and 'flies') is projected using learned matrices W_k and W_v to obtain its corresponding key and value vectors." (What Is a KV Cache?)
- Work without vs with cache: quadratic vs linear. "Without caching, the attention at step t must compare the new query with t previous keys, so the cumulative work scales quadratically, O(n²). With a cache, each key and value is computed once and then reused, reducing the total per-step complexity to linear, O(n)." (KV cache Advantages and Disadvantages)
- Measured: a 124M-parameter model generating 200 tokens on a Mac Mini M4 CPU took about 50.5 s without the cache and 10.2 s with it, about 5x faster. "On a Mac Mini with M4 chip (CPU), the results are as follows" (A Simple Performance Comparison)
- The benefit grows with length: listed as an advantage that computational efficiency increases with longer sequences. (KV cache Advantages and Disadvantages)
- Memory grows with every token. "Memory usage increases linearly: Each new token appends to the KV cache." (KV cache Advantages and Disadvantages)
- Only for inference. "KV caches...can't be used during training." (Overview)
- Reset between separate generations, or new queries attend to stale keys. "Otherwise, the queries of a new prompt will attend to stale keys left over from the previous sequence." (Implementing a KV Cache from Scratch, Clearing the Cache)
- One way to cap memory: a sliding window that keeps only the last N tokens. "Via the sliding window, we maintain only the last `window_size` tokens in the cache." (Optimizing the KV Cache Implementation, Tip 2)

## Visuals worth redrawing

- The "Time → flies → fast" redundancy figure: without cache, each step recomputes all rows; with cache, only the new row. Main visual for the kv-cache node.

## My notes

- Secondary source, but the speedup is his own measurement on his own code. Small model on CPU; real speedups depend on model and hardware.
- The O(n²) vs O(n) wording mixes total and per-step cost slightly; safest to say "without a cache the total work grows with the square of the length".
