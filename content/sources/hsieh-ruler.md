---
id: hsieh-ruler
title: "RULER: What's the Real Context Size of Your Long-Context Language Models?"
author: Cheng-Ping Hsieh, Simeng Sun, Samuel Kriman, Shantanu Acharya, Dima Rekesh, Fei Jia, Yang Zhang, Boris Ginsburg (NVIDIA)
url: https://arxiv.org/abs/2404.06654
published: 2024-04-09
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

A benchmark paper that separates a model's claimed context window from the length it can actually use well. Models scored almost perfectly on the basic needle-in-a-haystack test but dropped a lot on harder long-context tasks, and only about half of the models that claimed 32K or more held up at 32K.

## Key claims

- What needle-in-a-haystack tests: find one fact in long filler text. "The needle-in-a-haystack test examines the ability to retrieve a piece of information (the 'needle') from long distractor texts (the 'haystack')" (Abstract)
- RULER adds harder tasks beyond lookup. "multi-hop tracing and aggregation to test behaviors beyond searching from context" (Abstract)
- 17 long-context models, 13 tasks. (Abstract)
- The models all claimed 32K+ windows. "context sizes of 32K tokens or greater" (Abstract)
- Only half held up at 32K. "Only half of them can maintain satisfactory performance at the length of 32K" (Abstract)
- Near-perfect on basic NIAH, but large drops as length grows. "Almost all models exhibit large performance drops as the context length increases" (Abstract)

## Visuals worth redrawing

- None used; the idea redraws simply as two bars per model: "claimed window" vs "effective window".

## My notes

- Only the abstract page was opened (v3, revised 2024-08-06). Don't cite anything from the full paper.
- Models tested are from early 2024. Use for the claimed-vs-effective idea, not for how current models score.
