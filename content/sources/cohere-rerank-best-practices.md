---
id: cohere-rerank-best-practices
title: Best Practices for using Rerank
author: Cohere (docs)
url: https://docs.cohere.com/docs/reranking-best-practices
published: undated (docs page, covers Rerank v4.0, v3.5, v3.0)
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

Cohere's practical page for its reranker: limits (documents, tokens per query), how it chunks long documents, and how to read its relevance scores. The part that matters for abstaining is the last section: scores are between 0 and 1 but depend on the query, so to pick a cut-off for "not relevant" you calibrate it on your own borderline examples.

## Key claims

- Rank first, score second. "The most important output from the Rerank API endpoint is the absolute rank exposed in the response object. The score is query dependent, and could be higher or lower depending on the query and passages sent in." (Interpreting Results)
- Range. "Relevance scores are normalized to be in the range [0, 1] ." (Interpreting Results)
- Don't read the numbers as ratios. "you can’t assume that a document with a relevance score of 0.9109375 is twice as relevant as one with a relevance score of 0.04421997 ." (Interpreting Results)
- Picking a threshold: pick "30-50 representative queries" from your domain, pair each with a "borderline relevant" document, score all pairs, and use "The average of sample_scores ... as a reference when deciding a threshold for filtering out irrelevant documents." (Interpreting Results)
- Long documents: rerank-v4.0 splits documents into 32,764-token chunks and takes the max chunk score. (Document Chunking)

## Visuals worth redrawing

- None.

## My notes

- Vendor procedure, no measured results. Good because it's concrete about how to set a threshold, and honest that raw scores don't carry meaning across queries.
- Same lesson likely applies to cosine scores from embedding models, but this page is only about Cohere's reranker. Don't stretch it.
