---
id: anthropic-embeddings
title: Embeddings (Claude API docs)
author: Anthropic
url: https://platform.claude.com/docs/en/build-with-claude/embeddings
published: 2026              # undated docs page; lists voyage-context-4, whose linked post is dated 2026-06-29
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

Anthropic's docs page on embeddings. The key fact: Anthropic has no embedding model of its own, and the page walks through Voyage AI instead. It lists Voyage's models (dimensions, context lengths), shows a six-document semantic search example, and explains query vs document input types, normalization, quantization and Matryoshka truncation.

## Key claims

- Definition used on the page. "Text embeddings are numerical representations of text that enable measuring semantic similarity." (page description)
- Anthropic doesn't make embedding models. "Anthropic does not offer its own embedding model." (How to get embeddings with Anthropic)
- It points to Voyage AI, but says to compare vendors. "you should assess a variety of embeddings vendors to find the best fit for your specific use case." (How to get embeddings with Anthropic)
- Voyage 4 family (voyage-4-large, voyage-4, voyage-4-lite, voyage-4-nano): 32,000-token context, 1024 dimensions by default, with 256, 512 or 2048 as options. voyage-4-nano is open-weight under Apache 2.0. (Available models, table)
- There are domain models too: voyage-code-3 for code, voyage-finance-2, voyage-law-2. (Available models, table)
- The call returns one vector per input text; in the example "each containing 1024 floating-point numbers." (Voyage Python library)
- Semantic search example: six short documents, query "When is Apple's conference call scheduled?", nearest document by dot product is the Apple earnings-call sentence even though the wording differs. "The output is the fifth document, which is indeed the most relevant to the query" (Quickstart example)
- Queries and documents are embedded slightly differently: `input_type` adds a prompt in front. For a query: "Represent the query for retrieving supporting documents: ". (FAQ, When and how should I use the input_type parameter?)
- Don't skip it for retrieval. "Do not omit input_type or set input_type=None." (same FAQ; code formatting stripped)
- Vectors are normalized to length 1, so cosine and dot product give the same result. "Cosine similarity is equivalent to dot-product similarity, while the latter can be computed more quickly." (FAQ, Which similarity function should I use?)
- Quantization: storing 8-bit integers or 1-bit values instead of 32-bit floats cuts storage by 4× and 32×. "reducing storage, memory, and costs by 4x and 32x, respectively." (FAQ, What quantization options are available?)
- Matryoshka embeddings: you can keep just the first part of a vector, e.g. 1024 → 256, and re-normalize. "You can truncate these vectors by keeping the leading subset of dimensions." (FAQ, How can I truncate Matryoshka embeddings?)

## Visuals worth redrawing

- None as figures. The six-document example is a nice worked table: documents, query, and the top match.

## My notes

- Read via the markdown version of the page (append `.md`), 2026-09-23.
- Voyage AI is not Anthropic. This page is Anthropic's docs recommending a vendor; claims about Voyage model quality are Voyage's.
- The Voyage 4 blog post linked from the table is dated 2026-01-15 and voyage-context-4's is 2026-06-29 (dates from the URLs; posts not opened).
- For the embeddings article, the useful points are: no Claude embedding model, text embeddings come from a separate model, vectors of ~1024 floats, and the search example. The rest serves phase 2 nodes (`embedding-models`, `cosine-similarity`).
