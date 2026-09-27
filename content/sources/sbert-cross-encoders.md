---
id: sbert-cross-encoders
title: Cross-Encoders (Sentence Transformers docs)
author: Sentence Transformers (Nils Reimers et al.)
url: https://www.sbert.net/examples/cross_encoder/applications/README.html
published: undated            # current docs
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

The library docs that explain bi-encoders vs cross-encoders. A bi-encoder embeds each text on its own, so embeddings can be stored and compared fast. A cross-encoder reads both texts at once and outputs one score, which is more accurate but has to run for every pair. Hence retrieve with a bi-encoder, rerank the top hits with a cross-encoder.

## Key claims

- A cross-encoder reads the pair together and gives a score, no embedding. "for a Cross-Encoder , we pass both sentences simultaneously to the Transformer network. It produces then an output value between 0 and 1 indicating the similarity of the input sentence pair" (Bi-Encoder vs. Cross-Encoder)
- "A Cross-Encoder does not produce a sentence embedding ." (same)
- More accurate, less practical. "Cross-Encoder achieve better performances than Bi-Encoders. However, for many application they are not practical as they do not produce embeddings we could e.g. index or efficiently compare using cosine similarity." (same)
- The cost in numbers. "Clustering 10,000 sentence with CrossEncoders would require computing similarity scores for about 50 Million sentence combinations, which takes about 65 hours. With a Bi-Encoder, you compute the embedding for each sentence, which takes only 5 seconds." (When to use Cross- / Bi-Encoders?)
- The combination. "First, you use an efficient Bi-Encoder to retrieve e.g. the top-100 most similar sentences for a query. Then, you use a Cross-Encoder to re-rank these 100 hits by computing the score for every (query, hit) combination." (Combining Bi- and Cross-Encoders)
- Pretrained MS MARCO rerankers (from the linked pretrained-models page, https://www.sbert.net/docs/cross_encoder/pretrained_models.html): ms-marco-MiniLM-L6-v2 at 74.30 NDCG@10 (TREC DL 19) and 1,800 docs/sec; MiniLM-L12-v2 74.31 at 960 docs/sec; TinyBERT-L2-v2 69.84 at 9,000 docs/sec. Hardware for the speed isn't stated on the page. (Pretrained Models, MS MARCO table)

## Visuals worth redrawing

- The bi-encoder vs cross-encoder diagram: two towers producing u and v vs one network reading A and B.

## My notes

- "Between 0 and 1" is for models with a sigmoid head; not all rerankers output probabilities.
