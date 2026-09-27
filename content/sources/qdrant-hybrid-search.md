---
id: qdrant-hybrid-search
title: Hybrid Search in Qdrant
author: Dylan Couzon (Qdrant)
url: https://qdrant.tech/documentation/search-tuning/hybrid-search/
published: 2026-08-24
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

Part 1 of Qdrant's "Tune Your Retrieval Pipeline" series (qdrant.tech/articles/hybrid-search/ now lands here). Explains why dense and keyword retrieval miss different things, with real product-search queries; why raw scores can't simply be added; how RRF and DBSF merge lists; what the second retriever costs; and that fusion can only reorder what the two lists found. Read in full as text on 2026-09-27.

## Key claims

- Each retriever fails silently in its own way. "Dense retrieval can return a document on the right topic but miss an exact identifier copied into the query. Sparse retrieval can miss a relevant document when the query describes it with terms the corpus doesn't use." (intro)
- Definition. "Hybrid search runs dense and sparse retrieval over the same query, then merges their result lists." (intro)
- Dense can blur exact strings. "exact strings may lose influence among documents with similar meanings." (Dense and Sparse Retrieval Miss Different Things)
- BM25 needs no model at query time. "BM25 sets those weights from term frequency, inverse document frequency, and document length. It requires no model inference." (same)
- Examples (WANDS product search): "french molding": dense finds a rosette applique (relevant), sparse finds a french bread mold (irrelevant). "bathroom vanity knobs": dense finds a vanity set (irrelevant), sparse finds a damask mushroom knob (relevant). (table, same section)
- Learned sparse models: SPLADE "adds related terms that the text never used"; miniCOIL reweights each term by context. "Start with BM25, which needs no model at query time, then measure a learned model against it before adopting one." (same)
- Scales don't match. "Dense similarity is bounded, while BM25's magnitude depends on how many query terms match and how rare they are in the corpus. A fixed weight on the raw scores may balance one query but let BM25 dominate another." (Fusion Merges Two Rankings Into One)
- RRF reads only positions. "That lets it combine a cosine similarity of 0.7 with a BM25 score of 12.4 without comparing the values directly." (same)
- "Neither method wins universally. Start with RRF, then compare DBSF against the same labeled queries." (same)
- Fusion can't find what neither list found. "It works on the union of what the two prefetches returned, so a document neither one found cannot appear anywhere in the results." (same)
- Cost: a sparse vector per point, a second index, another search per query; "the extra search raised median query latency by 0.60 to 1.47 ms" (one container, one request at a time). (What a Second Retriever Costs)
- The sparse side needs IDF. "Without it, a common word can count as much as a part number." (same)
- Result: "Across five public datasets, default RRF beat the stronger individual retriever on four. DBPedia-entity is the exception: fusion scores lower than dense retrieval." (Measure Whether It Helps)
- Don't assume, measure. "query shape alone cannot tell you whether hybrid search will help." (same)
- Next stage: cross-encoder reranking "puts the query and chunk into a model together." (What to Test Next)

## Visuals worth redrawing

- The query table: same query, dense top result vs sparse top result, one relevant and one not.
- The "pale documents were never retrieved" union diagram.

## My notes

- The per-dataset numbers are in the companion tuning page (qdrant-tune-hybrid-search), not in this page's text.
