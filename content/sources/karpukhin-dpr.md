---
id: karpukhin-dpr
title: Dense Passage Retrieval for Open-Domain Question Answering
author: Vladimir Karpukhin, Barlas Oğuz, Sewon Min, Patrick Lewis, Ledell Wu, Sergey Edunov, Danqi Chen, Wen-tau Yih
url: https://arxiv.org/abs/2004.04906
published: 2020-04-10
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The DPR paper (EMNLP 2020). Before it, finding passages for question answering meant keyword methods like TF-IDF or BM25. It showed that two small encoders, one for questions and one for passages, trained on a modest number of question-passage pairs, find the right passage far more often than a strong BM25 system.

## Key claims

- Before: keyword methods were the default. "traditional sparse vector space models, such as TF-IDF or BM25, are the de facto method." (Abstract)
- Dense vectors alone work, trained from few examples with a dual encoder. "we show that retrieval can be practically implemented using dense representations alone, where embeddings are learned from a small number of questions and passages by a simple dual-encoder framework." (Abstract)
- The size of the win. "our dense retriever outperforms a strong Lucene-BM25 system largely by 9%-19% absolute in terms of top-20 passage retrieval accuracy" (Abstract)

## Visuals worth redrawing

- None used; only the abstract was read.

## My notes

- Abstract page only, 2026-09-27. v3 dated 2020-09-30.
- The win is on open-domain QA datasets the retriever was trained for (in domain). BEIR (thakur-beir) is the counterweight for out-of-domain data.
