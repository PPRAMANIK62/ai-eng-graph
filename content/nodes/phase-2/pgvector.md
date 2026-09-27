---
id: pgvector
title: What is pgvector?
depth: short
phase: 2
note: >-
  Vectors inside Postgres. What it supports and where it runs out.
needs: [hnsw]
leads_to: []
compare_with: []
updated: 2026-09-27
---

# What is pgvector?

pgvector is an open-source Postgres extension that adds a vector column
type and nearest-neighbor search. Your embeddings sit in the same table as
the text, ids and metadata they belong to, and you query them with SQL.
If you already run Postgres, there's no second database to run. This
site's search uses it.

## Vectors are just another column

Say you store article chunks. With pgvector, the table looks like any
other, plus one column:

```sql
CREATE EXTENSION vector;

CREATE TABLE chunks (
  id        bigserial PRIMARY KEY,
  node_id   text,
  body      text,
  embedding vector(1024)
);
```

To find the five chunks closest to a question, embed the question and
sort by distance:

```sql
SELECT id, node_id, body
FROM chunks
ORDER BY embedding <=> $1
LIMIT 5;
```

`<=>` is cosine distance. There are operators for L2 distance (`<->`),
negative inner product (`<#>`), L1 (`<+>`), and Hamming and Jaccard
distance for bit vectors. If your vectors are normalized to length 1,
inner product gives the same ranking as cosine and is the fastest choice.

Because it's plain Postgres, the vectors live next to the rest of your
data, and replication and point-in-time recovery work as usual through
the write-ahead log.

## Exact until you add an index

With no index, that query is exact. Postgres compares the question with
every row and returns the true five nearest, with perfect recall. For a
small table this is the right default, and you can speed it up by
letting Postgres use more parallel workers.

When exact search gets too slow, add an approximate [[hnsw]] index:

```sql
CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);
```

You add one index per distance function, and it has to match the
operator you query with (`vector_cosine_ops` for `<=>`). The query also
has to keep its shape, an `ORDER BY` on the distance operator, ascending,
with a `LIMIT`, or Postgres won't use the index.

The HNSW defaults are 16 links per vector (`m`), 64 build candidates
(`ef_construction`) and 40 search candidates (`hnsw.ef_search`). You can
raise `ef_search` for a single query with `SET LOCAL` inside a
transaction. For a sense of what the default buys: in a 2024 benchmark
on 1 million 1,536-dimension vectors, HNSW with `m` = 16,
`ef_construction` = 256 and `ef_search` = 40 returned 96.8% of the true
nearest neighbors.

pgvector also has a second index type, IVFFlat, which splits vectors
into lists and searches only the closest few. It builds faster and uses
less memory, but gives worse speed for the same recall, and it has to be
built after the table has data. HNSW gives more speed for the same
recall, which is why it's the one covered here.

## Where it runs out

**Dimensions.** A `vector` column can hold up to 16,000 dimensions, but
an index only covers up to 2,000. For bigger vectors, index them as
`halfvec` (2-byte floats, up to 4,000 dimensions) or as bits (up to
64,000). Half precision is cheap: in the 2024 benchmark it halved the
index (7,734 MB to 3,867 MB) with almost identical recall. Bits cut far
more, but recall can collapse without a second pass that re-ranks candidates with
the full vectors. On one dataset it fell to about 2%.

**Filters.** Add a WHERE clause and an approximate index filters after
it scans. If the filter matches 10% of rows and the index returns its
default 40 candidates, about 4 rows survive. You asked for 10 and got 4.

![Two rows of candidate boxes. Without iterative scans, the HNSW index returns 40 candidates, the filter keeps the 10% that match, and 4 rows come back though the query asked for 10. With iterative scans (pgvector 0.8.0 and later), the index keeps scanning until 10 rows pass or it reaches the hnsw.max_scan_tuples limit.](img/pgvector-filtering.svg)

Since 0.8.0, iterative index scans fix this by scanning more of the
index until enough rows pass, up to a limit (`hnsw.max_scan_tuples`).
Strict ordering keeps results exactly sorted by distance. Relaxed
ordering can be slightly out of order but gets better recall. Other
fixes: a normal index on the filter column (which often gives fast,
exact search over the matching rows), a partial HNSW index for a filter
with only a few values, or partitioning for many.

**Tenants.** If many customers share one approximate index, one
customer's vectors can change recall and speed for another. Separate
partitions or tables avoid that.

**Memory and scale.** HNSW builds much faster when the graph fits in
`maintenance_work_mem`, and vacuuming an HNSW index can be slow. To
scale, the options are the usual Postgres ones: a bigger instance, read
replicas, or sharding with Citus or similar.

## Where it gets tricky

**An approximate index changes your results.** A normal Postgres index
only speeds a query up. An HNSW index can return different rows than the
same query without it. That's the recall trade-off from
[[vector-index]]. Tests that check exact outputs can break when you add
it.

**The benchmark numbers are from 2024.** They were measured against
pgvector 0.7.0 on one large server. The latest release is 0.8.6
(2026-07-29). The types and settings tested are the same, but your
numbers will differ.

## What this means when you build

- Start exact. A few thousand chunks is a small table.
- If you add HNSW, check its recall: run the same queries with
  `SET LOCAL enable_indexscan = off` to get the exact answer and compare.
- Keep embeddings under 2,000 dimensions, or index them as `halfvec`.
- Test filtered queries on their own, and turn on iterative scans if you
  filter.
- For keyword plus vector search, pgvector pairs with Postgres full-text
  search; that's [[hybrid-search]].

## Further reading

- [pgvector](https://github.com/pgvector/pgvector), Andrew Kane and
  contributors, 0.8.6 (2026). The README is the reference: types,
  operators, index options and defaults, filtering and iterative scans.
- [Scalar and Binary Quantization for Pgvector Vector Search and Storage](https://jkatz05.com/post/postgres/pgvector-scalar-binary-quantization/),
  Jonathan Katz, 2024. Measured recall, speed and index size for `vector`,
  `halfvec` and bits in pgvector's HNSW.
