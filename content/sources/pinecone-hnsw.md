---
id: pinecone-hnsw
title: Hierarchical Navigable Small Worlds (HNSW)
author: Pinecone (Faiss: The Missing Manual series; no author shown)
url: https://www.pinecone.io/learn/series/faiss/hnsw/
published: undated
accessed: 2026-09-27
kind: blog
primary: false
---

## Summary

A visual explainer that builds HNSW from its two parents: the probability skip list (layers of linked lists, where upper layers skip far) and navigable small world graphs (greedy routing from an entry point until no neighbor is closer). HNSW stacks NSW graphs in layers with long links on top and short links at the bottom. It then measures Faiss's HNSW on Sift1M, showing recall vs search time and index memory as M grows.

## Key claims

- Skip lists (Pugh, 1990) are the layering idea. "Skip lists work by building several layers of linked lists" (Probability Skip List)
- NSW search is greedy from an entry point. "When searching an NSW graph, we begin at a pre-defined entry-point ." (Navigable Small World Graphs)
- It stops at a local minimum. "Eventually, we will find no nearer vertices than our current vertex — this is a local minimum and acts as our stopping condition." (Navigable Small World Graphs)
- Layers by link length. "At the top layer, we have the longest links, and at the bottom layer, we have the shortest." (Creating HNSW)
- Search descends layer by layer. "We traverse edges in each layer just as we did for NSW, greedily moving to the nearest vertex until we find a local minimum. Unlike NSW, at this point, we shift to the current vertex in a lower layer and begin searching again." (Creating HNSW)
- Insertion: vectors are inserted one by one; a vector added at some layer is also added to "every layer below it". The level multiplier m_L sets how likely higher layers are; a rule of thumb is "1/ln(M)". (Graph Construction)
- Three parameters: M (links per vertex), efConstruction (candidates while building), efSearch (candidates while searching). (HNSW Performance)
- Measured on Sift1M with 1,000 queries: "our recall/search-time can vary from 80%-1ms to 100%-50ms." (HNSW Performance)
- Higher settings cost search time. "Although higher parameter values provide us with better recall, the effect on search times can be dramatic." (HNSW Performance)
- Memory depends only on M. "Both efConstruction and efSearch do not affect index memory usage, leaving us only with M ." (HNSW Performance)
- Memory numbers on Sift1M: "Even with M at a low value of 2 , our index size is already above 0.5GB, reaching almost 5GB with an M of 512 ." (HNSW Performance)
- Memory is its weak spot. "HNSW is not the best index in terms of memory utilization." (Improving Memory Usage and Search Speeds)
- Popular and strong. "Hierarchical Navigable Small World (HNSW) graphs are among the top-performing indexes for vector similarity search" (intro)
- Plain NSW routing breaks down on big graphs. "The efficiency of greedy routing breaks down for larger networks (1-10K+ vertices) when a graph is not navigable" (Navigable Small World Graphs)
- Skip lists: fast search like a sorted array, with a linked list's easy insertion. "It allows fast search like a sorted array, while using a linked list structure for easy (and fast) insertion of new elements" (Probability Skip List)
- Top-layer vertices tend to be high-degree hubs. "These vertices will tend to be higher-degree vertices" (Creating HNSW)
- Low recall can be very fast. "If we're happy with a rather terrible recall, search times can even reach 0.1ms." (HNSW Performance; curly apostrophe on the page)
- Raising efConstruction helps recall at low query volume. "It can improve recall with little effect on search time , particularly when using lower M values." (HNSW Performance)
- NSW idea: long and short links give fast search. "if we take a proximity graph but build it so that we have both long-range and short-range links, then search times are reduced to (poly/)logarithmic complexity." (Navigable Small World Graphs)
- Skip list layers: "On the first layer, we find links that skip many intermediate nodes/vertices. As we move down the layers, the number of 'skips' by each link is decreased." (Probability Skip List; the page uses curly quotes)
- efConstruction is fixed at build time, efSearch at query time. "Our efConstruction value must be set before we construct the index via index.add(xb) , but efSearch can be set anytime before searching." (HNSW Performance)
- efConstruction buys recall. "We can also increase efConstruction to achieve higher recall at lower M and efSearch values." (HNSW Performance)
- Compression helps memory but costs recall and speed. "Using PQ will reduce recall and increase search time" (Improving Memory Usage and Search Speeds)

## Visuals worth redrawing

- The layered graph: entry point at the top layer with few nodes and long links, dropping down to a dense bottom layer. Main visual for the hnsw node.
- Skip list diagram with express lanes.

## My notes

- Secondary, vendor explainer, no author or date on the page. Numbers are from Faiss's IndexHNSWFlat, not pgvector.
- Sift1M is 1M vectors of 128 dimensions per `katz-pgvector-quantization`'s dataset list (sift-128-euclidean); the Pinecone page itself doesn't state the size in one sentence.
