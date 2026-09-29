---
id: zhang-gsm1k
title: A Careful Examination of Large Language Model Performance on Grade School Arithmetic
author: Hugh Zhang, Jeff Da, Dean Lee, et al. (Scale AI)
url: https://arxiv.org/abs/2405.00332
published: 2024-05-01
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The GSM1k paper (NeurIPS 2024 Datasets and Benchmarks; v4 revised 2024-11-22). Scale AI wrote 1,000 new grade-school math problems matched to the style and difficulty of the public GSM8k benchmark, then compared model scores on both. Some model families dropped by up to 8%, and the drop tracked how likely a model was to reproduce GSM8k items. Frontier models showed little sign of this. Only the abstract page was read.

## Key claims

- What contamination means. "there is growing concern that some of this performance actually reflects dataset contamination, where data closely resembling benchmark questions leaks into the training data, instead of true reasoning ability." (abstract)
- The method: a fresh look-alike test. "GSM1k is designed to mirror the style and complexity of the established GSM8k benchmark" and the two are matched on "human solve rates, number of steps in solution, answer magnitude, and more." (abstract)
- The result. "we observe accuracy drops of up to 8%, with several families of models showing evidence of systematic overfitting across almost all model sizes." (abstract)
- The link to memorization. "a positive relationship (Spearman's r^2 = 0.36) between a model's probability of generating an example from GSM8k and its performance gap between GSM8k and GSM1k, suggesting that some models may have partially memorized GSM8k." (abstract)
- The nuance. "many models, especially those on the frontier, show minimal signs of overfitting, and all models broadly demonstrate generalization to novel math problems guaranteed to not be in their training data." (abstract)
- The name and size. "we commission Grade School Math 1000 (GSM1k)." (abstract)

## Visuals worth redrawing

- None used.

## My notes

- The 8% is the worst case across model families, not a typical drop.
- Measured in 2024 on grade-school math. Doesn't say how widespread contamination is today.
