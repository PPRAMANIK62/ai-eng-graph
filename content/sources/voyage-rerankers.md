---
id: voyage-rerankers
title: Rerankers (Voyage AI docs)
author: Voyage AI
url: https://docs.voyageai.com/docs/reranker
published: 2026-09-01          # "last updated"
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

Voyage's API docs for its hosted rerankers. Defines a reranker as a cross-encoder that scores a query against many documents, lists the current models (rerank-2.5 stable, rerank-3 in preview, all 32,000-token context), and the request limits.

## Key claims

- Definition. "A reranker, given a query and many documents, returns the (ranks of) relevancy between the query and documents." Rerankers are cross-encoders that read the query and document jointly. (intro)
- Models as of 2026-09-01: rerank-3 and rerank-3-lite (preview), rerank-2.5 and rerank-2.5-lite (stable), all with 32,000-token context. (model table)
- `top_k`: "The number of most relevant documents to return. If not specified, the reranking results of all documents will be returned." (parameters)
- `truncation`: "Whether to truncate the input to satisfy the context length limit on the query and the documents." (parameters)
- At most 1,000 documents per request. (limits)

## Visuals worth redrawing

- None.

## My notes

- No prices on this page. Cohere's rerank-v4.0-pro is the other main hosted option (see _candidates.md, not opened for this note).
