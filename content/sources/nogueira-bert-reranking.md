---
id: nogueira-bert-reranking
title: Passage Re-ranking with BERT
author: Rodrigo Nogueira, Kyunghyun Cho
url: https://arxiv.org/abs/1901.04085
published: 2020-04-14          # v5; v1 2019-01-13
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The paper that made cross-encoder reranking the standard second stage. BM25 retrieves the top 1,000 passages; BERT reads the query and each passage together and outputs a probability that the passage is relevant; passages are re-sorted by that probability. It topped the MS MARCO passage leaderboard by 27% relative MRR@10. Read the abstract and the PDF.

## Key claims

- The result. "outperforming the previous state of the art by 27% (relative) in MRR@10." (Abstract)
- The pipeline: cheap retrieval, then an expensive re-scorer, then a few to the answerer. "First, a large number (for example, a thousand) of possibly relevant documents to a given question are retrieved from a corpus by a standard mechanism, such as BM25. In the second stage, passage re-ranking, each of these documents is scored and re-ranked by a more computationally-intensive method." (§2 Task)
- Query and passage go in together, as one input. "we feed the query as sentence A and the passage text as sentence B." Query truncated to 64 tokens; query + passage to 512. (§2 Method)
- Output is a relevance probability per passage, computed independently. "We compute this probability for each passage independently and obtain the final list of passages by ranking them with respect to these probabilities." (§2 Method)
- MS MARCO setup: each dev query paired with the top 1,000 BM25 passages; "relevant passages might not be retrieved by BM25." (§3)
- Few training examples needed. "a BERTLARGE trained on 100k question-passage pairs (less than 0.3% of the MS MARCO training data) is already 1.4 MRR@10 points better than the previous state-of-the-art" (Results)

## Visuals worth redrawing

- None needed.

## My notes

- 2019 model (BERT Large). The mechanism is unchanged in today's cross-encoder rerankers; the numbers are historical.
- Table 1 columns didn't extract cleanly from the PDF; don't quote per-row numbers.
