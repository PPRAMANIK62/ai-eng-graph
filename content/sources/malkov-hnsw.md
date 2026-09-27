---
id: malkov-hnsw
title: Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs
author: Yu. A. Malkov, D. A. Yashunin
url: https://arxiv.org/abs/1603.09320
published: 2016-03-30
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The paper that introduced HNSW. It builds a stack of proximity graphs over nested subsets of the data: every element is in the bottom layer, and fewer and fewer are in the layers above, chosen at random with exponentially falling odds. Search starts at the top, where links are long, and works down. This gives logarithmic scaling and beat the open-source vector search methods of the time. Latest arXiv version v4, 2018-08-14; later published in IEEE TPAMI.

## Key claims

- What it is. "We present a new approach for the approximate K-nearest neighbor search based on navigable small world graphs with controllable hierarchy (Hierarchical NSW, HNSW)." (Abstract)
- Graph only, no separate coarse structure. "The proposed solution is fully graph-based, without any need for additional search structures" (Abstract)
- Layers over nested subsets. "Hierarchical NSW incrementally builds a multi-layer structure consisting from hierarchical set of proximity graphs (layers) for nested subsets of the stored elements." (Abstract)
- How layers are assigned. "The maximum layer in which an element is present is selected randomly with an exponentially decaying probability distribution." (Abstract)
- Layers separate links by length. "additionally having the links separated by their characteristic distance scales." (Abstract)
- Search from the top gives log scaling. "Starting search from the upper layer together with utilizing the scale separation boosts the performance compared to NSW and allows a logarithmic complexity scaling." (Abstract)
- A neighbor-selection heuristic helps at high recall and on clustered data. "significantly increases performance at high recall and in case of highly clustered data." (Abstract)
- Results. "able to strongly outperform previous opensource state-of-the-art vector-only approaches." (Abstract)
- Like a skip list. "Similarity of the algorithm to the skip list structure allows straightforward balanced distributed implementation." (Abstract)

## Visuals worth redrawing

- Not read beyond the abstract. The layered-graph picture is redrawn from the Pinecone explainer (`pinecone-hnsw`) instead.

## My notes

- Abstract only; the parameter names M, efConstruction and ef come from the paper but I took their behavior from `pinecone-hnsw` and `pgvector-readme`.
- "Incrementally builds": elements are inserted one by one, which is why HNSW needs no training step.
