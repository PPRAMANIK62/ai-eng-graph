---
id: katz-pgvector-quantization
title: Scalar and Binary Quantization for Pgvector Vector Search and Storage
author: Jonathan Katz
url: https://jkatz05.com/post/postgres/pgvector-scalar-binary-quantization/
published: 2024-04-09
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

A pgvector contributor benchmarks the two ways pgvector 0.7.0 added to shrink vector indexes: storing index entries as 2-byte floats (`halfvec`) and as single bits (binary quantization). Halfvec halves index size and speeds up builds with almost no change in recall. Binary quantization only works with re-ranking against the full vectors, and even then only on some datasets. The tables also show the basic trade-off of HNSW: raising `hnsw.ef_search` raises recall and lowers queries per second.

## Key claims

- Setup: HNSW with m fixed at 16, ef_construction 32 to 512, ef_search 10 to 800, on PostgreSQL 16.2 on an r7gd.16xlarge. "I fixed m at 16" (Test setup and system configuration)
- Datasets include dbpedia-openai-1000k-angular (1M vectors, 1536 dimensions), sift-128-euclidean (1M, 128) and gist-960-euclidean (1M, 960). (Test setup)
- Measured trade-off, dbpedia-openai-1000k-angular, ef_construction=256, full `vector` index: ef_search 10 → 85.1% recall, 1,162 QPS; 40 → 96.8%, 567 QPS; 200 → 99.6%, 156 QPS; 800 → 99.9%, 48 QPS. p99 latency 1.40 ms, 2.70 ms, 9.01 ms, 30.50 ms. (Scalar quantization, dbpedia table)
- Same dataset, halfvec index: recall 85.2%, 96.8%, 99.6%, 99.9% at the same ef_search values. (Scalar quantization, dbpedia table)
- Halfvec halves the index for dbpedia: 7,734 MB → 3,867 MB, "2.00x" space reduction, build 244 s → 77 s at ef_construction=32 (3.17x). (Scalar quantization, dbpedia build table)
- Halfvec is the simple option. "Scalar quantization is often the simplest technique to use to shrink vector index storage" (Scalar quantization with 2-byte (fp16) floats)
- Recommendation. "I feel comfortable recommending storing the vector in the table and quantizing to halfvec in the index." (Conclusion / takeaways)
- Binary quantization rule. "binary quantization will reduce any positive value to 1 , and any zero or negative value to 0 ." (Binary quantization)
- Without re-ranking it can collapse: sift-128-euclidean at ef_construction=256, ef_search=10: 77.7% recall for `vector` vs 2.18% for `bit`. (Binary quantization, no-rerank table)
- Re-ranking: "you use binary quantization to narrow down your set of vectors, and then you reorder the reduced set of vectors by using the original (flat) vectors stored in the table." (Binary quantization)
- With re-ranking on dbpedia, ef_search=40: 91.6% (bit) vs 96.8% (vector) recall, 760 vs 567 QPS. (Binary quantization, with-rerank table)
- Quantization lifts the 2,000-dimension index limit. "These quantization techniques also let you index vectors that are larger than 2,000 dimensions" and "halfvec can store up to 4,000 dimensions, bit can store up to 64,000 dimensions" (Aside, intro)

## Visuals worth redrawing

- The dbpedia ef_search table as a recall vs QPS curve: a real, measured version of the speed-recall trade-off.

## My notes

- Written against the upcoming pgvector 0.7.0 (2024). The types and trade-offs still hold in 0.8.x, but absolute numbers depend on hardware and version.
- Primary in the sense that Katz is a pgvector contributor running pgvector; still one person's benchmark on one machine.
