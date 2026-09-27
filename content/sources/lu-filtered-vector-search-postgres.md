---
id: lu-filtered-vector-search-postgres
title: "An In-Depth Study of Filter-Agnostic Vector Search on a PostgreSQL Database System: [Experiments and Analysis]"
author: Duo Lu, Helena Caminal, Manos Chatzakis, Yannis Papakonstantinou, Yannis Chronis, Vaibhav Jain, Fatma Özcan (Google)
url: https://arxiv.org/abs/2603.23710
published: 2026-03-24
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

A SIGMOD 2026 study of filtered vector search (a vector query plus a condition like a WHERE clause) run inside a production PostgreSQL-compatible database rather than a standalone library. Costs that library benchmarks leave out, like page accesses and fetching data to check filters, change which index wins. Graph indexes can end up doing so many filter checks that they lose to clustering indexes.

## Key claims

- Library benchmarks make assumptions real databases break. "existing research most often evaluates algorithms in specialized libraries, making optimistic assumptions that do not align with enterprise-grade database systems." (Abstract)
- Inside a database, the trade-offs differ. "in a production-grade database system, commonly made assumptions do not hold" (Abstract)
- Distance math isn't the whole cost. "system-level overheads that come from both distance computations and filter operations (like page accesses and data retrieval) play a significant role." (Abstract)
- Graph indexes can lose with filters. "graph-based approaches (such as NaviX/ACORN) can incur prohibitive numbers of filter checks and system-level overheads, compared with clustering-based indexes such as ScaNN" (Abstract)
- No universal winner. "the optimal choice for a filter-agnostic FVS algorithm is not absolute, but rather a system-aware decision" (Abstract)
- What they test: "post-filtering and inline-filtering strategies across a wide range of selectivities and correlations." (Abstract)

## Visuals worth redrawing

- Only the abstract page was read.

## My notes

- Abstract only. The system is Google's PostgreSQL-compatible database, and the indexes tested are ScaNN, NaviX and ACORN, not pgvector's HNSW. Use it for the general point (inside a database, filters and page reads change the picture), not for pgvector numbers.
- v1 2026-03-24, 26 pages, 13 figures.
