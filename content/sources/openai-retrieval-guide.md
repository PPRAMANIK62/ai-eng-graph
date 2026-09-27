---
id: openai-retrieval-guide
title: Retrieval (OpenAI API guide)
author: OpenAI
url: https://developers.openai.com/api/docs/guides/retrieval
published: 2024              # undated docs page; mentions a ranker named default-2024-08-21
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

OpenAI's guide to its Retrieval API and vector stores. Files you add are chunked, embedded and indexed automatically, and you search them in natural language. The page documents the default chunking settings and their limits.

## Key claims

- What it does. Semantic search "surfaces semantically similar results—even when they match few or no keywords." (Retrieval, opening)
- Files are chunked, embedded and indexed on upload. "When you add a file to a vector store it will be automatically chunked, embedded, and indexed." (Vector stores)
- The default. "By default, max_chunk_size_tokens is set to 800 and chunk_overlap_tokens is set to 400, meaning every file is indexed by being split up into 800-token chunks, with 400-token overlap between consecutive chunks." (Chunking; code formatting stripped)
- Limits: chunk size between 100 and 4096 tokens; overlap non-negative and at most half the chunk size. (Chunking)
- Search results come with chunks, similarity scores and the source file; you can set a `score_threshold` between 0.0 and 1.0 to drop weaker chunks. (Semantic search; Ranking)

## Visuals worth redrawing

- None.

## My notes

- Read via the page's markdown version (append `.md`), 2026-09-27. The 800/400 default is the one Chroma's 2024 report scored poorly; still the documented default as of 2026-09-27.
