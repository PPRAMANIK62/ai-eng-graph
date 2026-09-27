---
id: pgvector-readme
title: pgvector (README)
author: Andrew Kane and contributors
url: https://github.com/pgvector/pgvector
published: 2026-07-29        # latest release, 0.8.6, per the CHANGELOG
accessed: 2026-09-27
kind: code
primary: true
---

## Summary

The official README of pgvector, the Postgres extension for vector search. It stores vectors in ordinary tables, searches them exactly by default, and offers two approximate index types, HNSW and IVFFlat. It documents the distance operators, index options and defaults, dimension limits for indexing, how filtering interacts with approximate indexes, iterative index scans (0.8.0+), quantization, hybrid search and scaling. Read from the raw README on the master branch; the latest release in the CHANGELOG is 0.8.6 (2026-07-29), with 0.8.7 unreleased.

## Key claims

- What it is. "Open-source vector similarity search for Postgres" and "Store your vectors with the rest of your data." (top of README)
- It supports exact and approximate search. "exact and approximate nearest neighbor search" (top of README)
- Distances: "L2 distance, inner product, cosine distance, L1 distance, Hamming distance, and Jaccard distance". Operators: `<->` L2, `<#>` negative inner product, `<=>` cosine distance, `<+>` L1, `<~>` Hamming, `<%>` Jaccard. (Querying)
- Exact by default. "By default, pgvector performs exact nearest neighbor search, which provides perfect recall." (Indexing)
- An index trades recall for speed, and changes results. "You can add an index to use approximate nearest neighbor search, which trades some recall for speed. Unlike typical indexes, you will see different results for queries after adding an approximate index." (Indexing)
- Two index types: HNSW and IVFFlat. (Indexing)
- HNSW vs IVFFlat. "An HNSW index creates a multilayer graph. It has better query performance than IVFFlat (in terms of speed-recall tradeoff), but has slower build times and uses more memory." (HNSW)
- HNSW needs no data to build. "Also, an index can be created without any data in the table since there isn't a training step like IVFFlat." (HNSW; the README uses a curly apostrophe)
- HNSW options: `m`, "the max number of connections per layer (16 by default)", and `ef_construction`, "the size of the dynamic candidate list for constructing the graph (64 by default)". (HNSW, Index Options)
- Higher ef_construction: "better recall at the cost of index build time / insert speed." (HNSW, Index Options)
- Query-time knob: `hnsw.ef_search`, "the size of the dynamic candidate list for search (40 by default)"; "A higher value provides better recall at the cost of speed." (HNSW, Query Options)
- Build memory. "Indexes build significantly faster when the graph fits into `maintenance_work_mem`" (HNSW, Index Build Time)
- IVFFlat. "An IVFFlat index divides vectors into lists, and then searches a subset of those lists that are closest to the query vector. It has faster build times and uses less memory than HNSW, but has lower query performance (in terms of speed-recall tradeoff)." (IVFFlat)
- IVFFlat recall keys: "Create the index after the table has some data"; lists start at "`rows / 1000` for up to 1M rows and `sqrt(rows)` for over 1M rows"; probes start at "`sqrt(lists)`". (IVFFlat)
- `ivfflat.probes` is "1 by default"; it "can be set to the number of lists for exact nearest neighbor search". (IVFFlat, Query Options)
- Index dimension limits for HNSW and IVFFlat: "`vector` - up to 2,000 dimensions", "`halfvec` - up to 4,000 dimensions", "`bit` - up to 64,000 dimensions". (HNSW; IVFFlat)
- Past 2,000 dimensions: "You can use half-precision vectors or half-precision indexing to index up to 4,000 dimensions or binary quantization to index up to 64,000 dimensions." (FAQ; links removed from the quote)
- Filtering: an index on the filter column can give "fast, exact nearest neighbor search in many cases." (Filtering)
- Filtering with approximate indexes happens after the scan. "If a condition matches 10% of rows, with HNSW and the default `hnsw.ef_search` of 40, only 4 rows will match on average." (Filtering)
- Partial indexes when filtering by a few distinct values, partitioning when filtering by many. (Filtering)
- Multitenancy. "sharing an approximate index between tenants means vectors from one tenant can affect recall (and speed) for other tenants." (Multitenancy)
- Iterative scans. "Starting with 0.8.0, you can enable iterative index scans, which will automatically scan more of the index until enough results are found (or it reaches `hnsw.max_scan_tuples` or `ivfflat.max_probes`)." (Iterative Index Scans)
- Strict vs relaxed order. "Relaxed allows results to be slightly out of order by distance, but provides better recall" (Iterative Index Scans)
- Why fewer results after adding HNSW: "Results are limited by the size of the dynamic candidate list (`hnsw.ef_search`), which is 40 by default." (Troubleshooting)
- Queries must be shaped to use the index. "The query needs to have an ORDER BY and LIMIT, and the ORDER BY must be the result of a distance operator (not an expression) in ascending order." (Troubleshooting)
- Exact search speed: "To speed up queries without an index, increase `max_parallel_workers_per_gather`." and, for normalized vectors, "use inner product for best performance." (Querying, Exact Search)
- Measure recall against exact search. "Monitor recall by comparing results from approximate search with exact search." It shows `SET LOCAL enable_indexscan = off; -- use exact search`. (Monitoring)
- Hybrid search. "Use together with Postgres full-text search for hybrid search." It links Reciprocal Rank Fusion and cross-encoder examples. (Hybrid Search)
- Scaling. For a smaller working set, "Use the `halfvec` type instead of `vector` for tables" and binary quantization for indexes, with re-ranking. "Scale vertically by increasing memory, CPU, and storage on a single instance." Horizontally: replicas, or Citus, PgDog or another approach for sharding. (Scaling)
- Size. "A non-partitioned table has a limit of 32 TB by default in Postgres." (FAQ)
- Replication: pgvector uses the write-ahead log, "which allows for replication and point-in-time recovery." (FAQ)
- HNSW vacuum is slow. "Vacuuming can take a while for HNSW indexes." (Vacuuming)
- One index per distance function. "Add an index for each distance function you want to use." The cosine example is `CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);` (HNSW)
- Per-query settings. "Use `SET LOCAL` inside a transaction to set it for a single query" (HNSW, Query Options)
- Column size limit, separate from the index limit. "Vectors can have up to 16,000 dimensions." Storage is "`4 * dimensions + 8` bytes" per vector. (Reference, Vector Type)
- Tenant isolation. "For tenant isolation, use list partitioning or separate tables." (Multitenancy; link removed)

## Visuals worth redrawing

- None. Text and SQL only.

## My notes

- The README is the source of truth for defaults, but it moves with releases. Re-check against the CHANGELOG when re-reviewing.
- It gives no benchmark numbers. For measured recall and speed in pgvector, see `katz-pgvector-quantization`.
