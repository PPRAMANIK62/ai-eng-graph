---
id: weaviate-hybrid-fusion
title: Unlocking the Power of Hybrid Search - A Deep Dive into Weaviate's Fusion Algorithms
author: Dirk Kulawiak, Joon-Pil (JP) Hwang (Weaviate)
url: https://weaviate.io/blog/hybrid-search-fusion-algorithms
published: 2023-08-29
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

Weaviate explains its two ways to merge keyword (BM25) and vector results: rankedFusion (reciprocal rank, 1/(rank + 60)) and relativeScoreFusion (min-max normalize each list's scores to 0–1, then take a weighted sum). A worked example shows rank fusion flattening big score gaps. They switched the default to relativeScoreFusion in v1.24 after an internal benchmark showed about 6% better recall.

## Key claims

- Two algorithms; the default changed. "relativeScoreFusion is the newer algorithm, introduced in 1.20 and made default in 1.24, and likely the better choice for most." (Highlights)
- rankedFusion uses ranks only: score "computed according to 1/(RANK + 60)". (rankedFusion; Full example)
- relativeScoreFusion normalizes scores per list. "The highest value becomes 1, the lowest value becomes 0, and others end up in between according to this scale. The total score is thus calculated by a scaled sum of normalized vector similarity and normalized BM25 score." (relativeScoreFusion)
- Worked example scores: keyword 5, 2.6, 2.3, 0.2, 0.09 and vector 0.6, 0.598, 0.596, 0.594, 0.009; rank fusion gives nearly identical scores (about 0.0154 to 0.0167) to all of them. (Full example)
- The number behind the switch. "According to our internal benchmarks, the default relativeScoreFusion algorithm showed a ~6% improvement in recall over the rankedFusion method." on the FIQA dataset. (Recall performance / benchmarks)
- alpha sets the weight between keyword and vector search. (How does hybrid search work, exactly?)

## Visuals worth redrawing

- The five-object worked example as two columns of scores before and after each fusion method.

## My notes

- "Internal benchmark" on one dataset, from the vendor. Treat the 6% as a data point, not a rule.
- Weaviate's rank formula seems to start ranks at 0 (1/60 ≈ 0.0167 for the top item) — my reading of the example, not stated outright.
