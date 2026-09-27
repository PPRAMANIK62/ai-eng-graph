---
id: slocum-vector-search-explained
title: Vector Search Explained
author: Victoria Slocum (Weaviate)
url: https://weaviate.io/blog/vector-search-explained
published: 2024-11-21
accessed: 2026-09-27
kind: blog
primary: false
---

## Summary

A plain explainer from a vector database company. Exact k-nearest-neighbor search compares the query with every stored vector, so its cost grows in a straight line with the data. Approximate nearest neighbor (ANN) algorithms give up a little accuracy for a big speedup, and come in a few families: trees, graphs, clustering and hashing.

## Key claims

- A worked cost example for brute force. "If you compare a vector with 300 dimensions with 10M vectors, the search system would need to do 300 x 10M = 3B computations!" (How does vector search work / kNN)
- Brute force cost is linear in the data size. "The number of required calculations increases linearly with the number of data points (O(n))." (kNN)
- Brute force doesn't scale. "In summary, kNN search doesn't scale well, and it is hard to imagine using it with a large dataset in production." (kNN)
- ANN trades accuracy for speed. "which trade off a bit of accuracy (hence the A in the name) for a huge gain in speed." (Approximate nearest neighbors (ANN))
- ANN may miss true neighbors. "ANN algorithms may not return the true k nearest vectors, but they are very efficient." (ANN)
- ANN keeps sublinear time. "ANN algorithms maintain good performance (sublinear time, e.g. (poly)logarithmic complexity) on very large-scale datasets." (ANN)
- The knobs trade recall against latency, throughput and import time; recall is "the fraction of results that are the true top-k nearest neighbors". (ANN)
- Families. "Examples of ANN methods are: trees – e.g. ANNOY (Figure 3), proximity graphs - e.g. HNSW (Figure 4), clustering - e.g. FAISS , hashing - e.g. LSH" (Examples of ANN algorithms)
- Embeddings are high-dimensional. "the number of dimensions that most embedding models use in semantic search goes up to hundreds or thousands of dimensions!" (kNN)

## Visuals worth redrawing

- O(n) vs O(log n) complexity chart (a line vs a flattening curve).
- Figures 3 and 4: tree-based and graph-based ANN search.

## My notes

- Secondary, vendor blog. Calling FAISS "clustering" is loose: Faiss is a library with several index types, IVF being the clustering one (see `douze-faiss-library`).
- The 300 x 10M example counts one multiply per dimension per vector; it's an order-of-magnitude illustration, not a timing.
