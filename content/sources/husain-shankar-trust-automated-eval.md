---
id: husain-shankar-trust-automated-eval
title: "Q: How do I know if I can trust my automated eval?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/how-do-i-know-if-i-can-trust-my-automated-eval.html
published: 2026-09-19        # modified 2026-09-21
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

One page of the AI Evals FAQ on checking an LLM judge (or any classifier used as a grader) against human labels. Split labeled examples into train, dev and test sets, tune on dev, check once on test, and report two numbers: how many real failures the judge catches (true positive rate) and how many good outputs it correctly passes (true negative rate).

## Key claims

- Who needs this: "For an evaluator that makes judgments, test it against human-labeled examples of the failure you want to detect. This applies to LLM judges and other machine learning classifiers." (intro)
- Code checks don't: "If code can directly check the condition, you do not need human labels for that check." (intro)
- Three sets. Training: "Use these examples to teach the evaluator what to look for." Dev: "Run the evaluator on these examples and compare its decisions with your labels. Inspect disagreements to improve the prompt or choose between models." Test: "Set these examples aside until you finish making changes." (split)
- Overfitting without copying: after many rounds of tuning on dev, "it may do well on the dev set but poorly on new examples. This is overfitting, and it can happen even if you never put the dev examples directly in the prompt." (split)
- TPR: "measures how many actual failures the evaluator catches. If people identify 10 failures and the evaluator catches eight, its TPR is 80%." (metrics)
- TNR: "measures how many good outputs the evaluator correctly passes. If people identify 100 good outputs and the evaluator passes 95, its TNR is 95%. The other five are false alarms." (metrics)
- Tradeoff: "Catching more failures can come at the cost of more false alarms." "If failures are rare, even a small false-alarm rate can create a lot of unnecessary reviews." (metrics)

## Visuals worth redrawing

- The page's flashcard: labeled examples split into train, dev and test, with TPR and TNR measured on test.

## My notes

- Newer (2026-09) than Husain's 2024 judge guide, and says the same thing more tightly.
