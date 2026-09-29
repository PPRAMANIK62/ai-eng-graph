---
id: vector-index
title: What is a vector index?
depth: deep
phase: 2
note: >-
  Why exact nearest-neighbor search gets slow, and what approximate indexes trade away.
needs: [semantic-search]
leads_to: [hnsw]
compare_with: [quantization]
updated: 2026-09-27
---

# What is a vector index?

A vector index is a data structure that finds the stored vectors closest to
a query without comparing the query against every one of them. It's what
makes [[semantic-search]] fast on millions of documents. The price is that
it can miss some of the true nearest neighbors, and a small collection
often doesn't need one at all.

## Exact search compares the query with everything

Say you've split your documents into chunks and turned each chunk into an
[[embeddings|embedding]]. A user asks a question. You embed the question
and want the five chunks whose vectors are closest to it, by
[[cosine-similarity]] or another distance.

The obvious way is to compute the distance from the question to every
chunk, then keep the five smallest. This is called exact, brute-force or
flat search, and it's always right: the five you get back are the true
five nearest. In the jargon, it has perfect recall.

The problem is cost. Each comparison touches every number in both
vectors.
With 300-dimension vectors and 10 million stored chunks, one query is
300 × 10 million = 3 billion multiplications. Double the chunks and you
double the work. The cost grows in a straight line with the size of the
collection, so a collection that grows 100 times means queries that are
100 times slower.

## When exact search is enough

Before building an index, ask whether you need one. It's the first
question when choosing an index, and sometimes the answer is that plain
brute force is the best option.

Run the same arithmetic on a small collection. This site's own search will
cover a few thousand chunks. At 300 dimensions, 5,000 chunks is 1.5
million multiplications per query, about 2,000 times less work than the
10-million example. Bigger vectors scale that up in proportion, but the
gap stays huge.

A few other things point the same way for small collections:

- **It's the default in Postgres.** [[pgvector]] searches exactly unless
  you create an index. You get perfect recall with no setup.
- **Memory isn't a constraint.** When the whole collection fits in RAM
  many times over, a flat search, which stores the vectors and nothing
  else, costs nothing extra.
- **Nothing to tune.** A flat search has no parameters and no training
  step.

So the honest rule is: measure the exact query's latency on your real
data first. If it's fast enough, you're done. An index would only give up
recall for a speedup you don't need.

## What an index gives up: recall

Once the collection is big enough that exact search is too slow, you
switch to approximate nearest neighbor (ANN) search. An ANN index looks at
only a small part of the collection for each query. That's why it's fast,
and it's also why it can miss: a true neighbor that sits in the part it
didn't look at never comes back.

The standard way to score this is recall: of the true k nearest
neighbors, what fraction did the index return? This is the same idea as
[[recall-at-k]], but measured against the exact search's answer rather
than against human relevance labels.

Every ANN index has a knob that trades recall for speed. Here's a real
measurement from a 2024 benchmark of pgvector's HNSW index, on a standard
test set of 1 million vectors with 1,536 dimensions each (dbpedia-openai).
The knob is how many candidates the search keeps while it explores
(`ef_search`):

| Candidates kept | Recall | Queries per second | Slowest 1% of queries |
|---|---|---|---|
| 10 | 85.1% | 1,162 | 1.40 ms |
| 40 | 96.8% | 567 | 2.70 ms |
| 200 | 99.6% | 156 | 9.01 ms |
| 800 | 99.9% | 48 | 30.50 ms |

Going from 85% to 97% recall halves the throughput. The last fraction of
a percent costs the most: from 99.6% to 99.9% cuts throughput by about
two thirds.

![A line chart of recall against queries per second for pgvector's HNSW index on 1 million 1,536-dimension vectors. Four points, one per ef_search setting: 10 gives 85.1% recall at 1,162 queries per second, 40 gives 96.8% at 567, 200 gives 99.6% at 156, and 800 gives 99.9% at 48. Higher recall costs throughput, and the last steps toward 100% cost the most.](img/vector-index-recall-vs-speed.svg)

A useful way to read a chart like this: only the settings on the curve's
outer edge are worth using. Any setting that's both slower and less
accurate than another one can be thrown away. Picking an index setting
means picking a point on that edge that fits your latency budget and your
recall floor.

## Two ways to skip most of the vectors

Many ANN methods have been tried: trees, hashing, clustering and graphs.
Trees and hashing don't scale well past about 10 dimensions, and
embeddings have hundreds or thousands. So the two families that matter in practice are clustering and graphs.

![Three panels over the same scatter of stored vectors and one query. Flat search draws a line from the query to every vector. A clustering index groups the vectors into cells around centroids and only scans the cell nearest the query, so it misses two close neighbors just over the border. A graph index starts at an entry point and hops along edges toward the query, visiting 7 of the 32 vectors.](img/vector-index-three-ways.svg)

**Clustering (IVF, inverted file).** Before any search, run k-means over
the vectors to group them into clusters, each with a center point. At
query time, find the few centers nearest the query and scan only those
clusters. The knob is how many clusters to scan (`nprobe` in the Faiss
library, `probes` in pgvector). Scan one and it's fast but can miss a neighbor that
sits just over a cluster's border. Scan all of them and you're back to
exact search. The catch is that the clusters are learned from the data,
so you need data before you build, and if the data drifts a lot later,
the clusters fit it worse.

**Graphs.** Connect each vector to some of its near neighbors, so the
collection becomes a graph. To search, start somewhere and keep walking
along edges toward whichever neighbor is closer to the query. The knob is
how much exploring the walk does: more steps, more accurate, slower. Both
Faiss and pgvector offer a graph index called [[hnsw]], which promotes
some vectors to hubs that the search visits first. It needs no training and can take new
vectors one at a time.

## What an index costs besides recall

Recall and speed get the attention, but an index also costs memory and
build time.

**Memory.** A flat index stores the vectors and nothing else. A graph
index stores every vector plus its edges. For Faiss's HNSW, that's
d × 4 + M × 2 × 4 bytes per vector, where d is the dimension and M is the
number of links. For a 1,536-dimension vector with M = 16, it works out
to 6,144 bytes of vector plus 128 bytes of edges. In Faiss every index
lives in RAM, and at scale even the raw vectors may not fit. Then you
compress them. That's what
quantization does: store each vector as smaller numbers or even single
bits, and accept some loss.

**Build time.** Some indexes need a training step (k-means for clustering)
before any vectors go in. All of them spend time per vector added. In
pgvector, the graph index builds more slowly than the clustering one.

**Updates.** Deleting and changing vectors is awkward for some indexes.
Faiss's HNSW can't remove or change vectors at all. Some libraries patch
the graph when it changes, at some cost to index quality.

A rough guide by size: graph indexes are a good choice when memory
isn't tight, typically under 1 million vectors. Past 10 million, the
build time gets in the way. When vectors must be compressed
to fit in memory at all, clustering with compression is the only option.

## Where it gets tricky

**Filters break the simple picture.** Real queries often add a condition:
only chunks from phase 2, only this user's documents. An approximate index
often finds its candidates first and filters them after. Here's the
arithmetic in pgvector: if the filter matches 10% of rows and the search
keeps its default 40 candidates, about 4 rows pass. Ask for 10 and you get
4. Since version 0.8.0, pgvector can keep scanning the index until enough
rows pass. The other way round works too: filter first, then compare the
query with every row that passed. That's slow if many rows
pass, but it's exact, and fine when few do.

**Library benchmarks don't transfer to databases.** Most ANN comparisons
run in standalone libraries with everything in memory. A 2026 study inside
a PostgreSQL-compatible database found that page reads and filter checks
changed which index won: graph indexes could make so many filter checks
that clustering indexes beat them. That study tested other indexes, not
pgvector's, so it's a warning to measure on your own setup, not a verdict.

**Index recall isn't answer quality.** An index at 99% recall returns
99% of what exact search would. If the embedding puts the wrong chunks
closest, exact search returns the wrong chunks too, perfectly. In some
applications, small differences in distance don't separate a relevant
chunk from an irrelevant one anyway. Retrieval quality is measured
separately, against questions with known good answers: that's
[[retrieval-evaluation]].

**Results change when you add an index.** Unlike a normal database index,
which only makes a query faster, an approximate index changes which rows
come back. A test that passed with exact search can fail after the index
is added.

## What this means when you build

- **Start with exact search on a small collection.** A few thousand chunks
  is small. Time the query; add an index only if it's too slow.
- **If you add an index, measure its recall.** Run the same queries with
  and without the index and compare the results. In pgvector you can turn
  index scans off for one transaction to get the exact answer.
- **Tune the query-time knob first.** The number of candidates (HNSW) or
  clusters scanned (IVF) moves you along the recall-speed curve without a
  rebuild.
- **Check filtered queries separately.** They're where an approximate
  index most often returns too few results.
- **Watch memory, not just speed,** once the collection grows past what
  comfortably fits in RAM.

## Further reading

- [The Faiss library](https://arxiv.org/abs/2401.08281), Douze et al.
  (Meta), 2024 (revised 2025). The trade-off space of vector search, the
  clustering and graph families, and when brute force is the best option.
- [Guidelines to choose an index](https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index),
  Faiss team, undated. A short decision guide: exact or not, memory, and
  dataset size, with HNSW's memory formula.
- [Vector Search Explained](https://weaviate.io/blog/vector-search-explained),
  Victoria Slocum (Weaviate), 2024. A plain explainer of exact vs
  approximate search with the 3 billion operations example.
- [Scalar and Binary Quantization for Pgvector Vector Search and Storage](https://jkatz05.com/post/postgres/pgvector-scalar-binary-quantization/),
  Jonathan Katz, 2024. Real recall and throughput numbers for pgvector's
  HNSW, and what quantization does to them.
- [pgvector](https://github.com/pgvector/pgvector), Andrew Kane and
  contributors, 0.8.6 (2026). Exact by default, HNSW and IVFFlat, and the
  filtering arithmetic.
- [An In-Depth Study of Filter-Agnostic Vector Search on a PostgreSQL Database System](https://arxiv.org/abs/2603.23710),
  Lu et al. (Google), SIGMOD 2026. Why filtered vector search behaves
  differently inside a real database.
