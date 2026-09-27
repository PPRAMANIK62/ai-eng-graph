---
id: faiss-choosing-an-index
title: Guidelines to choose an index (Faiss wiki)
author: Faiss team (Meta)
url: https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index
published: undated
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

The Faiss team's practical decision guide for picking an index. It walks through a few questions: how many searches, whether results must be exact, how much memory you have, and how big the dataset is. Flat (brute force) is the only exact option and the best one when you run few searches; HNSW is the fast, accurate choice when memory is plentiful; IVF clustering and compression come in as memory gets tight or data gets big.

## Key claims

- Few searches: building an index doesn't pay off. "If you plan to perform only a few searches (say 1000-10000), the index building time will not be amortized by the search time. Then direct computation is the most efficient option." (Will you perform few searches?)
- Flat is the only exact index and the baseline. "The only index that can guarantee exact results is the IndexFlatL2 or IndexFlatIP. It provides the baseline for results for the other indexes." (Do you need exact results?)
- Flat has no overhead and no training or parameters. "It does not compress the vectors, but does not add overhead on top of them." and "The flat index does not require training and does not have parameters." (Do you need exact results?)
- HNSW for plenty of RAM or small data. "If you have a lots of RAM or the dataset is small, HNSW is the best option, it is a very fast and accurate index." (Is memory a concern? If not)
- HNSW memory per vector. "The memory usage is (d * 4 + M * 2 * 4) bytes per vector." (Is memory a concern? If not; d and M are italic in the page)
- HNSW's speed-accuracy knob is efSearch; M is 4 to 64 links per vector, "higher is more accurate but uses more RAM." (Is memory a concern? If not)
- HNSW needs no training and can't remove vectors. "HNSW does not require training and does not support removing vectors from the index." (Is memory a concern? If not)
- IVF: cluster into buckets, search nprobe of them. "The dataset is clustered into buckets and at search time, only a fraction of the buckets are visited (`nprobe` buckets)." (How big is the dataset?)
- IVF bucket count for under 1M vectors: K is 4*sqrt(N) to 16*sqrt(N), with 30*K to 256*K training vectors. (If below 1M vectors)
- If storing whole vectors is too expensive, compress them with PQ; "the total storage is M/2 bytes per vector" for 4-bit PQ codes. (If quite important)
- IVF clustering is plain k-means. "This just clusters the vectors with k-means." (If below 1M vectors)
- Everything lives in memory. "Keep in mind that all Faiss indexes are stored in RAM." (Is memory a concern?)

## Visuals worth redrawing

- The decision tree image at the bottom of the page (few searches? exact? memory? size?). Could be redrawn as a simpler "do you need an index" flow.

## My notes

- Advice is for L2 distance and in-memory Faiss indexes. Faiss is a library, not a database; pgvector's HNSW has its own defaults.
- Wiki page, no date. Read the raw markdown from the wiki repo.
