---
id: chen-chatgpt-behavior-drift
title: How is ChatGPT's behavior changing over time?
author: Lingjiao Chen, Matei Zaharia, James Zou
url: https://arxiv.org/abs/2307.09009
published: 2023-07-18        # v3 revised 2023-10-31
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The March 2023 and June 2023 versions of GPT-3.5 and GPT-4 were tested on the same tasks and gave very different results, some better and some worse. The main lesson: a model name you call through an API can change behavior in a few months, so you need to keep measuring. Old models, but still the standard evidence for drift.

## Key claims

- Updates are opaque: "when and how these models are updated over time is opaque." (Abstract)
- Tasks: math, sensitive questions, opinion surveys, multi-hop questions, code generation, US medical licensing questions, visual reasoning. (Abstract)
- The headline number: "GPT-4 (March 2023) was reasonable at identifying prime vs. composite numbers (84% accuracy) but GPT-4 (June 2023) was poor on these same questions (51% accuracy)." (Abstract)
- Partly because GPT-4 followed chain-of-thought prompting less well; GPT-3.5 went the other way and got "much better in June than in March in this task." (Abstract)
- Other shifts: GPT-4 answered fewer sensitive and opinion questions in June; both had "more formatting mistakes in code generation in June than in March." (Abstract)
- Common cause: "GPT-4's ability to follow user instructions has decreased over time". (Abstract)
- Conclusion: "the behavior of the "same" LLM service can change substantially in a relatively short amount of time, highlighting the need for continuous monitoring of LLMs." (Abstract)

## Visuals worth redrawing

- March vs June accuracy on primes for both models, as paired bars (numbers for GPT-4 only are in the abstract).

## My notes

- Only the GPT-4 prime numbers (84% to 51%) are in the abstract; GPT-3.5's numbers are not in my note, so don't chart them.
