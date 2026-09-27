---
id: qdrant-tune-hybrid-search
title: How to Tune Hybrid Search in Qdrant
author: Dylan Couzon (Qdrant)
url: https://qdrant.tech/documentation/search-tuning/how-to-tune-hybrid-search/
published: 2026-08-22
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

Part 4 of Qdrant's "Tune Your Retrieval Pipeline" series. Measures dense retrieval (all-MiniLM-L6-v2), BM25, RRF and DBSF on five public datasets with nDCG@10, then sweeps RRF's k and per-list weights. Finds that fusion beat the better single retriever on four of five datasets, and that the best k depended on how many relevant documents each query has. Read in full as text on 2026-09-27.

## Key claims

- Setup: five datasets of 5,183 to 100,000 documents, all-MiniLM-L6-v2 for dense, Qdrant's BM25 for sparse, 200 candidates from each list; results "directional". (Note under "Confirm Fusion Beats Either Prefetch")
- nDCG@10, dense / sparse / RRF (Qdrant k=2): SciFact 0.6239 / 0.6886 / 0.7175; ArguAna 0.4905 / 0.4224 / 0.5216; WANDS 0.6921 / 0.7098 / 0.7254; CodeSearchNet 0.6299 / 0.5126 / 0.6555; DBPedia-entity 0.4677 / 0.3857 / 0.4638. (table, "Confirm Fusion Beats Either Prefetch")
- "Fusion beat the better single retriever on four of five datasets. On DBPedia-entity it did not: dense alone scored 0.4677 against 0.4638 fused, so hybrid is worth measuring rather than assuming." (same section)
- Second list costs +0.60 to +1.47 ms median latency in their setup. (table column "Second Prefetch Cost")
- RRF uses only positions. "A document at rank 1 scores the same whether it beat rank 2 by a wide margin or a narrow one." (RRF and DBSF Use Different Signals)
- DBSF rescales each list by its mean and spread per query, so a big lead survives. "Adding the two rescaled scores carries the size of a lead into the fused ranking" (same section)
- Tradeoff. "RRF ignores score scale, so a cosine similarity and a BM25 score combine without either dominating. DBSF assumes the size of a score gap means something, so one outlying score can move the result." (same section)
- DBSF vs default RRF: higher on three of five datasets with intervals excluding zero (WANDS 0.7637, +0.0383); SciFact and ArguAna inconclusive. (Compare RRF and DBSF on Your Labels)
- Qdrant's formula uses zero-based positions: 1/(pos + k); default k = 2. "The original RRF paper uses 60, which maps to k=61 in Qdrant's formula." (Confirm Fusion…; Use Labels to Choose a k Range)
- k sets how steep the list is. "At Qdrant's default k=2, rank 1 carries 5.5x the score weight of rank 10. At k=61 it carries 1.15x, so a candidate's presence in a prefetch matters almost as much as its position." (Use Labels to Choose a k Range)
- Lower k favors a document one list ranks highly; higher k rewards documents both lists found. "Lower values favor a document one prefetch ranks highly, and higher values give more credit to documents both prefetches retrieve." (same)
- Best k by dataset (nDCG@10 at k = 1, 2, 5, 20, 61): ArguAna best at 5 (0.5304); CodeSearchNet best at 5 (0.6580); SciFact best at 2 (0.7175); DBPedia-entity best at 20 (0.4682); WANDS best at 61 (0.7614, vs 0.7254 at k=2). (table, same section)
- Rule of thumb from their data. "with about one relevant document per query, the best k was 2 or 5; with tens or hundreds, it was 20 or 61." (same)
- A small average gain can change the top result a lot. "On WANDS, k=2 and k=61 chose a different top result for 42% of queries, while nDCG@10 rose by 0.0360." (same)
- Ties are common at low k. "12.5% of default RRF's top 10 results share a score with the result next to them, against 2.8% at k=61" (SciFact) (same)
- Weights: tune them last, after k; a list's own score doesn't tell you which way to lean. On DBPedia-entity the winning pair gave sparse three times the weight although dense scores higher alone. (Tune Weights Last)
- Keeping the default is sometimes right. "Keeping the default is a real answer, and it was the right one on one of our five datasets." (Confirm the Selected Configuration on Held-Out Queries)
- Fusion can only reorder what the lists returned. "a document missing from both lists cannot appear in the result." (intro)

## Visuals worth redrawing

- Grouped bars: dense / sparse / RRF nDCG@10 on the five datasets.
- Share of top-10 score mass by rank at k=2 vs k=61 (can be recomputed from the formula).

## My notes

- Their k=2 in zero-based positions equals k=1 in the one-based formula 1/(k + rank) (my arithmetic: 1/(pos + 2) = 1/(rank + 1)).
- Vendor docs, but the tables are careful (intervals, held-out checks). Small models (MiniLM) on the dense side.
