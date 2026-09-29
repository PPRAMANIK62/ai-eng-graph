---
id: chen-more-llm-calls
title: "Are More LLM Calls All You Need? Towards Scaling Laws of Compound Inference Systems"
author: Lingjiao Chen, Jared Quincy Davis, Boris Hanin, Peter Bailis, Ion Stoica, Matei Zaharia, James Zou
url: https://arxiv.org/abs/2403.02419
published: 2024-03-04          # v2 2024-06-04
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Studies what happens to majority voting (and voting after an LLM filter) as you add more calls. The surprise: accuracy can go up and then come back down. The explanation is that a task mixes easy and hard questions. On an easy question the model's most common answer is right, so more votes help; on a hard one, more votes lock in the wrong answer. The authors fit a model that predicts the best number of calls from a small sample.

## Key claims

- Vote with more calls isn't monotone. "the performance of both Vote and Filter-Vote can first increase but then decrease as a function of the number of LM calls." (Abstract)
- Why. "more LM calls lead to higher performance on "easy" queries, but lower performance on "hard" queries, and non-monotone behavior can emerge when a task contains both types of queries." (Abstract)
- Definition of easy: "a query is easy if a compound system with infinitely many LM calls gives a correct answer and hard otherwise." (1 Introduction)
- Example: on MMLU Physics, Vote rises then falls, while Filter-Vote falls then rises. (Figure 1 caption)
- Practical upshot: the best number of calls can be estimated "from a small number of samples". (Abstract)
- Motivating example: Gemini Ultra's CoT@32 on MMLU calls the model 32 times and takes the majority. (1 Introduction)
- Takeaway: "more LM calls do not necessarily improve the performance of compound AI systems". (1 Introduction)

## Visuals worth redrawing

- Figure 1: accuracy vs number of calls for Vote and Filter-Vote, with a peak.
- Figure 2: easy vs hard queries diverging as calls grow.

## My notes

- Experiments with GPT-3.5 (2024). The mechanism (majority vote amplifies whatever answer is most likely) doesn't depend on the model.
