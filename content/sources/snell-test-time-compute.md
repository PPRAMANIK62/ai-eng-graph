---
id: snell-test-time-compute
title: Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters
author: Charlie Snell, Jaehoon Lee, Kelvin Xu, Aviral Kumar (UC Berkeley, Google DeepMind)
url: https://arxiv.org/abs/2408.03314
published: 2024-08-06
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

If a model is allowed to spend extra compute while answering (sampling many answers and picking one, or revising its answer step by step), how much better does it get, and when is that a better deal than training a bigger model? The answer depends on how hard the question is. Spending test-time compute adaptively per question beats a simple best-of-N baseline with about 4x less compute, and on easy-to-medium questions a small model with extra thinking can beat a 14x larger model. On the hardest questions, extra thinking barely helps and a bigger model wins.

## Key claims

- The question. "if an LLM is allowed to use a fixed but non-trivial amount of inference-time compute, how much can it improve its performance on a challenging prompt?" (Abstract)
- Two ways to spend test-time compute: search against a verifier, or have the model revise its own answer. "(1) searching against dense, process-based verifier reward models; and (2) updating the model's distribution over a response adaptively, given the prompt at test time." (Abstract)
- Best-of-N is the simplest method: sample N answers in parallel, keep the one a verifier scores highest. "best-of-N sampling: sampling N outputs in “parallel” from a base LLM and selecting the one that scores the highest per a learned verifier" (§1)
- What works depends on difficulty. "the effectiveness of different approaches to scaling test-time compute critically varies depending on the difficulty of the prompt." (Abstract)
- Adaptive allocation is about 4x more efficient than best-of-N. "we can improve the efficiency of test-time compute scaling by more than 4x compared to a best-of-N baseline." (Abstract)
- Small model plus thinking can beat a 14x bigger model, on problems it can partly solve. "on problems where a smaller base model attains somewhat non-trivial success rates, test-time compute can be used to outperform a 14x larger model." (Abstract)
- On the hardest questions, it doesn't help much. "with the most challenging questions, we observe very little benefits from scaling up test-time compute." (§1)
- So test-time compute and pretraining aren't fully interchangeable. "current approaches to scaling test-time compute may not be 1-to-1 exchangeable with scaling pretraining." (§1)
- A possible future: less pretraining, more inference compute. "this hints at a future where fewer FLOPs are spent during pretraining and more FLOPs are spent at inference." (§1)
- The models needed special fine-tuning to revise and verify well. "Capability-specific finetuning is necessary to induce revision and verification capabilities into the base model on MATH" (§1, footnote)

## Visuals worth redrawing

- Figure 1 (right): for easy, medium and hard questions, whether test-time compute or a 14x bigger model wins. Redraw as a simple three-row table or bar chart: easy → thinking wins, hard → bigger model wins.

## My notes

- 2024, PaLM 2-S* on the MATH benchmark, before o1 was public. It's about inference-time methods in general (search, revisions), not about RL-trained reasoning models, but it's the clearest statement of "thinking longer helps on some problems, not all".
- Agrees with DeepSeek-R1's observation that the model spends more tokens on harder problems.
