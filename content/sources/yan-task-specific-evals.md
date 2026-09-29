---
id: yan-task-specific-evals
title: Task-Specific LLM Evals that Do & Don't Work
author: Eugene Yan
url: https://eugeneyan.com/writing/evals/
published: 2024-03
accessed: 2026-09-29
kind: blog
primary: false
---

## Summary

A practitioner's guide to evals for common LLM tasks. For classification and extraction it says to use the classic metrics (precision, recall, ROC-AUC, PR-AUC) and to look at how well the predicted probabilities for each class separate, because good aggregate numbers can hide a model you can't set a threshold for.

## Key claims

- Classification and extraction are close cousins. "Extraction is similar, where we identify specific pieces of information within the text, such as names, dates, or locations." (Classification/Extraction)
- Extraction metrics. "What proportion of ground truth attributes were extracted (recall)? What proportion of extracted attributes were correct (precision)?" (Classification/Extraction)
- Aggregate scores can mislead. "a model can have high ROC-AUC and PR-AUC but still not be suitable for production." If many predicted probabilities sit between 0.4 and 0.6, "getting it wrong by merely 0.05 could lead to a big drop in precision or recall." (Classification/Extraction)

## Visuals worth redrawing

- Two overlapping probability histograms (well separated vs muddled).

## My notes

- Threshold advice assumes you get a probability; most closed APIs no longer return logprobs (see `_candidates.md`, "Things that change the plan" #1). With a plain label out, you're left with precision and recall per field or class.
