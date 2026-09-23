---
id: he-defeating-nondeterminism
title: Defeating Nondeterminism in LLM Inference
author: Horace He (Thinking Machines Lab)
url: https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/
published: 2025-09-10
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

Why temperature 0 still gives different answers on real servers, and how to fix it. The usual explanation ("GPUs run things in parallel and floating-point math isn't associative") is only part of it. The real cause is that a server batches your request with other people's, and the math kernels give slightly different numbers at different batch sizes. Since server load changes, your result changes. With batch-invariant kernels, 1,000 runs gave 1,000 identical answers.

## Key claims

- Temperature 0 is deterministic in theory only. "even when we adjust the temperature down to 0 ... (thus making the sampling theoretically deterministic), LLM APIs are still not deterministic in practice" (intro)
- The same holds on your own hardware with vLLM or SGLang. "sampling still isn’t deterministic" (intro)
- Floating-point addition depends on order: (0.1 + 1e20) − 1e20 = 0, but 0.1 + (1e20 − 1e20) = 0.1. (The original sin)
- Summing one 8-number array in different orders gave 102 different results. (The original sin)
- The common "concurrency + floating point" story misses the real cause: the same matrix multiply on the same data gives bitwise identical results every time. "running the same matrix multiplication on the same data repeatedly will always provide bitwise equal results." (intro)
- An LLM forward pass is run-to-run deterministic. "the forward pass in an LLM is in fact “run-to-run deterministic.”" (When are atomic adds needed?)
- The real cause: kernels aren't batch-invariant, so your output depends on how big the batch is. "our forward pass lacks “batch invariance”, causing our request’s output to depend on the batch size of our forward pass." (When are atomic adds needed?)
- And the batch size depends on load, which you can't see. "the primary reason nearly all LLM inference endpoints are nondeterministic is that the load (and thus batch-size) nondeterministically varies!" (Batch invariance and “determinism”)
- Not GPU-specific. "LLM inference endpoints served from CPUs or TPUs will also have this source of nondeterminism." (Batch invariance and “determinism”)
- Experiment: Qwen3-235B-A22B-Instruct-2507, temperature 0, prompt "Tell me about Richard Feynman", 1,000 completions of 1,000 tokens: 80 unique completions, the most common occurring 78 times. (How nondeterministic are completions?)
- The first 102 tokens were identical every time; they split at token 103: 992 runs said "Queens, New York", 8 said "New York City". (How nondeterministic are completions?)
- With batch-invariant kernels, all 1,000 were identical. "when we enable our batch-invariant kernels, all of our 1000 completions are identical." (How nondeterministic are completions?)
- Cost: on Qwen-3-8B, 1,000 sequences took 26 s on default vLLM, 55 s unoptimized deterministic, 42 s with an improved attention kernel. (Performance)

## Visuals worth redrawing

- The Feynman split: one shared 102-token trunk, then a fork at token 103 into "Queens, New York" (992) and "New York City" (8). Great visual for "temperature 0 isn't deterministic".
- A diagram of one request batched with different numbers of other requests → slightly different numbers → occasionally a different top token.

## My notes

- 2025-09, open model on their own vLLM setup. The mechanism applies to hosted APIs too, but they didn't measure a specific provider.
- Anthropic's API reference also says temperature 0 was "not fully deterministic" (`anthropic-messages-api-reference`).
- Their fix is for people running their own inference. As an API user you can't turn it on.
