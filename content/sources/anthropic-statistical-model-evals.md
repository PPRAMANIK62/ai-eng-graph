---
id: anthropic-statistical-model-evals
title: A statistical approach to model evaluations
author: Anthropic (paper by Evan Miller)
url: https://www.anthropic.com/research/statistical-approach-to-model-evals
published: 2024-11-19
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

A summary of the paper "Adding Error Bars to Evals" (Evan Miller, arXiv 2411.00640). An eval score is a sample from a larger universe of possible questions, so it comes with noise. Five recommendations: report the standard error, cluster it when questions come in groups, resample answers to cut per-question noise, compare two models question by question (paired differences), and work out in advance how many questions you need to detect the difference you care about.

## Key claims

- The question. "Is the difference in capabilities real, or could one model simply have gotten lucky in the choice of questions on the benchmark?" (intro)
- Report the standard error. "A 95% confidence interval can be calculated from the SEM by adding and subtracting 1.96 × SEM from the mean score." (Recommendation #1)
- Grouped questions widen the error. "In practice, we have found that clustered standard errors on popular evals can be over three times as large as naive standard errors." (Recommendation #2)
- Resample to reduce noise. "If an eval uses chain-of-thought reasoning, we recommend resampling answers from the same model several times, and using the question-level averages as the question scores" (Recommendation #3)
- Paired differences. "Since the question list is shared across models, conducting a paired-differences test lets us eliminate the variance in question difficulty and focus on the variance in responses." (Recommendation #4)
- Models get the same questions right and wrong. "we find the correlation of question scores on popular evals between frontier models to be substantial—between 0.3 and 0.7 on a scale of −1 to +1." (Recommendation #4)
- Small evals can't see small gaps. "If an eval doesn't have very many questions, confidence intervals associated with any statistical tests will tend to be wide." (Recommendation #5)
- Power analysis tells you how many questions you need to test a hypothesis like "Model A outperforms Model B by 3 percentage points". (Recommendation #5)

## Visuals worth redrawing

- Two overlapping score distributions with error bars.

## My notes

- Written for research benchmarks, but it applies directly to a small product eval set used to compare models.
