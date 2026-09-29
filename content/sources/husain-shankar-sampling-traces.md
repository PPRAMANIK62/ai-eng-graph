---
id: husain-shankar-sampling-traces
title: "Q: How can I efficiently sample production traces for review?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/how-can-i-efficiently-sample-production-traces-for-review.html
published: 2025-07-06
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

One page of Husain and Shankar's AI Evals FAQ (modified 2026-09-01). A table of five ways to pick production traces to read (random, clustering, data analysis, classification, user feedback), each with its blind spot, ordered from exploratory to targeted. Keep some random traces in every batch, and use targeted signals for rare failures.

## Key claims

- Five methods and their limits: Random, "A small batch can miss rare cases." Clustering, "The result depends on the features and clustering choices." Data analysis (extreme latency or tool count), "An extreme value may have nothing to do with quality." Classification (an evaluator flags likely failures), "It favors problems the classifier already knows how to find." Feedback (negative user feedback), "It misses problems that users do not report." (table)
- Order: "When you’re starting out, you should optimize for exploration of the data. As you learn more, you can start to lean more heavily on signals to select traces." (after table)
- "Keep some random traces in every batch. This gives you a chance to find failure modes that your current signals do not describe." (after table)
- Rare failures: "Search for signals that correlate with the failure, such as a specific tool sequence, unusually long traces, retries, or a known input pattern." (How do I measure rare failure modes?)
- Active learning: "a system asks a person to label the data points that would be most useful for its next update." (Use labels to choose the next traces)

## Visuals worth redrawing

- The five methods as a line from exploratory to targeted, each with its blind spot.

## My notes

- No numbers on how many of each kind to include in a batch.
