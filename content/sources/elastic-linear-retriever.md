---
id: elastic-linear-retriever
title: "Hybrid search revisited: introducing the linear retriever!"
author: Panagiotis Bailis (Elastic)
url: https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search
published: 2025-05-28
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

Elastic's post on its linear retriever: a weighted sum of scores from several retrievers, with an optional min-max normalizer per query. Its worked example shows the case RRF gets wrong: one document has a far higher BM25 score than the rest, but RRF only sees that it's ranked first, same as any other first place.

## Key claims

- Scores live on different scales. kNN scores sit in a bounded range for cosine or normalized dot product, while "bm25 scores can vary wildly" between queries. Example: Query A bm25 scores 100, 1.5, 1, 0.5; Query B 0.63, 0.01, 0.3, 0.4, with the same kNN scores 0.347, 0.35, 0.348, 0.346. (Scaling the scores: kNN vs BM25)
- MinMax normalization "scales scores, independently for each query, to the [0, 1] range using the following formula: normalized_score = (score - min) / (max - min)". (Normalization to the rescue)
- The linear retriever gives explicit weights per retriever, "unlike rrf , which relies solely on relative ranks." (Meet the linear retriever)
- RRF misses big score gaps. "doc1 has a significantly higher bm25 score than the others, which rrf fails to capture because it only looks at relative ranks." RRF ranks doc2 > doc1 > doc3 > doc4. (Linear retriever example)

## Visuals worth redrawing

- The Query A table (kNN nearly flat, BM25 100 vs 1.5) as the simplest picture of the scale problem.

## My notes

- Worked example only, no benchmark.
