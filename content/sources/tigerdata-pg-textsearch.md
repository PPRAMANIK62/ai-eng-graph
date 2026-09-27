---
id: tigerdata-pg-textsearch
title: "From ts_rank to BM25. Introducing pg_textsearch: True BM25 Ranking and Hybrid Retrieval Inside Postgres"
author: Todd J. Green, Matvey Arye (Tiger Data)
url: https://www.tigerdata.com/blog/introducing-pg_textsearch-true-bm25-ranking-hybrid-retrieval-postgres
published: 2025-10-23
accessed: 2026-09-27
kind: blog
primary: true                # the extension's builders
---

## Summary

The launch post for pg_textsearch, a Postgres extension that adds BM25 ranking. Useful mostly for what it says about Postgres's built-in full-text ranking (`ts_rank`): it has no IDF, no term-frequency saturation and no normalization by average document length, so it isn't BM25. Also points out that the `@@` match operator requires every query term to be present. It's a vendor post, so its speed claims are the builders' own.

## Key claims

- The built-in ranking misses all three BM25 signals. "It doesn't calculate inverse document frequency (IDF), so common words receive the same weight as rare, meaningful terms. It doesn't apply term frequency saturation, allowing documents that repeat keywords excessively to dominate rankings. It doesn't normalize by corpus-average document length, causing longer documents to score higher regardless of actual relevance." (The Ranking Quality Gap)
- The example: "A user asks about "database connection pooling." With Postgres' native ts_rank, documents that mention "database" 50 times but barely discuss "pooling" rank higher than a comprehensive pooling guide that only mentions "database" 5 times." (The Ranking Quality Gap)
- Boolean matching drops documents missing any query term. The `@@` operator "requires all query terms to appear in a document for it to match. A highly relevant document missing just one query term gets excluded entirely before ranking begins." (The Ranking Quality Gap)
- BM25's three parts, with typical defaults: IDF ("rare words like "pooling" get higher weight than common words like "database.""), saturation "(controlled by parameter k1, typically 1.2)", length normalization "(controlled by parameter b, typically 0.75)". (How Modern BM25 Ranking Works)
- Vectors and keywords complement each other. "vectors capture conceptual similarity while keywords ensure exact terms aren't missed." (intro)
- ParadeDB's pg_search is another way to get this in Postgres, built on Tantivy. "Excellent tools like ParadeDB's pg_search are bringing similar capabilities to Postgres, integrating Tantivy" (intro)
- Postgres native search must score every match to rank. "Postgres must score every matching document to rank results; there's no efficient way to retrieve just the top-k most relevant documents without examining the full match set." (The Ranking Quality Gap)
- Hybrid search in the post combines pg_textsearch and pgvector with reciprocal rank fusion. (Hybrid Search section)

## Visuals worth redrawing

- None. The "database connection pooling" example is worth reusing as a worked example with our own numbers.

## My notes

- Released as a preview in 2025-10. The GitHub repo (github.com/timescale/pg_textsearch) showed v1.4.0, Postgres 17 and 18, PostgreSQL licence, k1 = 1.2 and b = 0.75 defaults, and no phrase queries when checked on 2026-09-27. That's a separate page; cite it separately if the article leans on it.
