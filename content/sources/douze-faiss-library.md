---
id: douze-faiss-library
title: The Faiss library
author: Matthijs Douze, Alexandr Guzhva, Chengqi Deng, Jeff Johnson, Gergely Szilvasy, Pierre-Emmanuel Mazaré, Maria Lomeli, Lucas Hosseini, Hervé Jégou (Meta FAIR)
url: https://arxiv.org/abs/2401.08281
published: 2024-01-16
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The Faiss team's own description of their vector search library and of the trade-offs in vector search generally. Brute force (flat) search is exact but gets too slow for large collections; approximate indexes trade some accuracy for speed, and every index sits somewhere on a speed / memory / accuracy trade-off. The two main non-exhaustive families are inverted files (cluster the vectors, search only a few clusters) and graphs (walk a graph toward the query). Read from the v4 HTML (2025-10-23).

## Key claims

- The paper frames vector search as a trade-off space. "This paper describes the trade-off space of vector search and the design principles of Faiss" (Abstract)
- Brute force is exact but slows down with size. "Faiss's IndexFlat implements brute force search. However, for large datasets this approach becomes too slow." (3.1 Brute force search)
- Tree-style exact methods don't help in high dimensions. "However, in large dimensions they provide no speedup over brute force search" (3.1)
- Approximate search means accepting imperfect results. "With ANNS, the user accepts imperfect results, which opens the door to a new solution design space." (3.2)
- Accuracy is measured as recall against the true neighbors: "nn-recall@k", the fraction of the true nearest neighbors found in the first k results. (3.2 Accuracy metrics)
- The resource side: search time and memory, plus build time. "During search, the search time and memory usage are the main constraints." (3.2 Resource metrics)
- Graph indexes add memory per vector for their edges. "This is the case for graph indexes, that need to store graph edges for each vector." (3.2 Resource metrics)
- Build time splits into training time and per-vector add time. "It may be decomposed into a training time , which is independent of the number of vectors added to the index, and the addition time per vector ." (3.2 Resource metrics)
- Which constraints matter depends on the setup; for tiny collections memory doesn't. "when the number of vectors is so small that the raw database fits in RAM multiple times, then the memory usage does not matter." (3.3 Tradeoffs)
- Accuracy always matters. "accuracy is always an active constraint because if it did not matter, returning random results would be sufficient" (3.3 Tradeoffs)
- Only the Pareto-optimal settings are worth using. "settings that are the fastest for a given accuracy, or equivalently, that have the highest accuracy for a given time budget" (3.4)
- Two non-exhaustive families: inverted file and graph. "Faiss implements two non-exhaustive search approaches that operate at different memory vs. speed trade-offs: inverted file and graph-based." (5)
- LSH and trees don't scale in dimension. "However, these methods do not scale well for dimensions above 10." (5)
- IVF clusters the vectors and visits only some clusters. "IVF indexing is a technique that clusters the database vectors at indexing time." and "At search time, only a subset of clusters are visited (a.k.a. nprobe )." (5.1 Inverted files)
- Graph search follows edges toward the query; more steps means more accurate but slower. "the trade-off at search time is given by the number of exploration steps: higher is more accurate but slower ." (5.2 Graph based)
- HNSW can add vectors on the fly. "A notable advantage of HNSW is its ability to add vectors on-the-fly." (5.2, HNSW)
- First question: is an index needed at all? "in some cases a direct brute force search is the best option." (5.3 How to choose an index)
- Graph vs IVF by size. "Graph-based indices are a good option for indexes where there is no constraint on memory usage , typically for indexes below 1M vectors. Beyond 10M vectors, the construction time typically becomes the limiting factor." (5.3)
- HNSW in Faiss can't delete or change vectors. "The graph index HNSW does not support suppression and mutation" (6.1, Graph indexes)
- Filtering: metadata-first means brute force over the matching subset. "Brute force search is slow but acceptable if the subset size is small, and the results are exact." (6.2, Vector-first or metadata-first search)
- Data drift hurts indexes fitted to the data. "if the vector distribution changes significantly because of additions/removals or updates, then the efficiency of any technique that fits the data distribution degrades. This includes IVF and PQ compression." (6.1, Index updates)
- Exact distance ordering isn't always meaningful. "for some applications, small variations in distances are not significant enough to distinguish application-level positive and negative items" (3.1)
- HNSW promotes some vectors to hubs. "a search structure where some randomly selected vertices are promoted to be hubs that are explored first." (5.2, HNSW)
- Graph search follows edges toward the query. "At search time, the graph is explored by following the edges towards the nodes that are closest to the query vector." (5.2)
- Libraries patch graphs on change, at a cost. "Supporting this requires heuristics to rebuild the graph when it is mutated, which are implemented in HNSWlib and FreshDiskANN [ 78 ] but suboptimal indexing-wise." (6.1, Graph indexes)

## Visuals worth redrawing

- Figure 7: speed-accuracy curves for HNSW vs NSG on Deep1M, sweeping graph traversal steps. Shows a trade-off curve, not a single point.
- Figure 10 / Appendix A.5: decision tree for choosing an index.

## My notes

- Primary, from the team that built Faiss. The 5.3 guidance is in-memory, library-level; inside a database (pgvector) the costs differ, see `lu-filtered-vector-search-postgres`.
- Some quotes contain stray spaces where the HTML had math symbols (e.g. "training time , which").
