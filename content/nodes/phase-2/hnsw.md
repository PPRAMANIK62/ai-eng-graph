---
id: hnsw
title: What is HNSW?
depth: short
phase: 2
note: >-
  A layered graph index: one of the most popular for vector search, fast and accurate, paid for in memory.
needs: [vector-index]
leads_to: [pgvector]
compare_with: []
updated: 2026-09-27
---

# What is HNSW?

HNSW (Hierarchical Navigable Small World) is a graph-based
[[vector-index]]: it links each stored vector to some of its neighbors and
finds the ones nearest a query by walking the links. It's one of the most
popular and best-performing vector indexes, and you'll meet it again in
[[pgvector]]. The cost is memory.

## Start with a flat graph and a greedy walk

Picture every stored vector as a dot, with a line to a handful of nearby
dots. That's a proximity graph. To search it:

1. Start at a fixed entry point.
2. Look at the current dot's neighbors and move to whichever is closest
   to the query.
3. Repeat until none of the neighbors is closer than where you are. That
   dot is a local minimum, and you stop.

Build the graph with a mix of short and long links and you get a
navigable small world (NSW) graph, where a few hops can cross the whole
collection. On large graphs that aren't built carefully, though, this
greedy routing breaks down.

## Add layers, like express lanes

HNSW borrows the fix from an older structure, the skip list (1990). A
skip list stacks several linked lists. Links in the top list skip over
many elements, and each list below skips fewer. You search the top list
first, then drop down for finer steps, like taking the express train and
then the local.

HNSW does the same with graphs:

- **Every vector is in the bottom layer**, with short links to close
  neighbors.
- **Each vector also gets a random top layer.** The odds fall off
  exponentially as you go up: most vectors live only at the bottom, a few
  reach the next layer, and very few reach the top. A vector that reaches
  a layer is in every layer below it too.
- **Higher layers have longer links**, because there are fewer vectors to
  connect, so neighbors are further apart.

A search starts at the top layer and does the greedy walk until it hits a
local minimum. Then it drops to the same vector one layer down and walks
again, with shorter links. At the bottom layer, the walk finishes among
the query's closest neighbors. The top layers get you to the right
neighborhood in a few long hops, and the bottom layer does the fine work.
That's what gives HNSW its logarithmic scaling: grow the collection a lot,
and a search only needs a few more steps.

![Three stacked layers of the same graph. The top layer has three vectors joined by long links, the middle layer has seven, and the bottom layer has all sixteen with short links. A search path starts at the entry point in the top layer, walks to the vector nearest the query, drops down a layer, walks again, and drops again, finishing next to the query in the bottom layer.](img/hnsw-layers.svg)

Building works the same way. Vectors are inserted one at a time: pick the
new vector's top layer at random, search down to find its neighbors on
each layer, and link it in. There's no separate training step. The graph
grows as vectors arrive.

## Three knobs

HNSW has three settings, and each trades something:

- **M, links per vector.** More links give better recall, but the index
  grows. M is the only setting that changes memory.
- **efConstruction, how hard the build looks.** How many candidate
  neighbors the build considers for each new vector. Higher gives a
  better graph and higher recall. It's fixed once the index is built.
- **efSearch, how hard a query looks.** How many candidates a search
  keeps as it walks. Higher means better recall and slower queries. You
  can change it any time before a search, without rebuilding.

To see the size of these trade-offs: on a standard test set (Sift1M),
tuning these settings moved a search from about 80% recall in 1 ms to 100% recall in 50 ms. The index took over 0.5 GB with
M = 2 and almost 5 GB with M = 512.

## Where it gets tricky

**It's memory-hungry.** On top of every vector, HNSW stores its links,
and the index grows with M. Compressing the vectors saves memory, but
costs some recall and speed.

**It's still approximate.** The walk can stop at a local minimum that
isn't the true nearest neighbor. Raising efSearch makes that rarer, but
only exact search guarantees the right answer.

**The numbers depend on the implementation.** The measurements above are
from Faiss, a vector search library, on one dataset. Other
implementations and datasets land elsewhere. Measure recall on your own
setup.

## What this means when you build

- Use HNSW when exact search is too slow and you have the memory. For a
  small collection, you may not need it at all (see [[vector-index]]).
- Tune efSearch first: it's cheap to change and moves you along the
  recall-speed curve. Raise M or efConstruction, which need a rebuild,
  only if efSearch alone can't reach the recall you need.
- The Postgres settings and their defaults are in [[pgvector]].

## Further reading

- [Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs](https://arxiv.org/abs/1603.09320),
  Malkov and Yashunin, 2016 (revised 2018). The original paper: random
  layers with exponentially falling odds, search from the top, and
  logarithmic scaling.
- [Hierarchical Navigable Small Worlds (HNSW)](https://www.pinecone.io/learn/series/faiss/hnsw/),
  Pinecone, undated. A visual walk from skip lists to NSW to HNSW, with
  measured recall, speed and memory in Faiss.
