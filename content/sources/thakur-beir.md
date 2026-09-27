---
id: thakur-beir
title: "BEIR: A Heterogenous Benchmark for Zero-shot Evaluation of Information Retrieval Models"
author: Nandan Thakur, Nils Reimers, Andreas Rücklé, Abhishek Srivastava, Iryna Gurevych
url: https://arxiv.org/abs/2104.08663
published: 2021-04-17
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

BEIR (NeurIPS 2021 Datasets and Benchmarks) tests retrieval models on 18 datasets from different domains without training on them. Its headline: out of domain, plain BM25 holds up well, re-ranking and late-interaction models do best but cost a lot, and dense retrievers are efficient but often fall behind.

## Key claims

- Why: models were tested in narrow settings. "Existing neural information retrieval (IR) models have often been studied in homogeneous and narrow settings, which has considerably limited insights into their out-of-distribution (OOD) generalization capabilities." (Abstract)
- Scope: 18 datasets, 10 retrieval systems (lexical, sparse, dense, late-interaction, re-ranking). (Abstract)
- BM25 is hard to beat out of domain. "Our results show BM25 is a robust baseline and re-ranking and late-interaction-based models on average achieve the best zero-shot performances, however, at high computational costs." (Abstract)
- Dense models are cheaper but often weaker out of domain. "In contrast, dense and sparse-retrieval models are computationally more efficient but often underperform other approaches, highlighting the considerable room for improvement in their generalization capabilities." (Abstract)
- (Full PDF, added 2026-09-27 for retrieval-evaluation.) In-domain scores don't predict new domains. "in-domain performance cannot predict how well an approach will generalize in a zero-shot setup." (§7 Conclusions)
- Beating BM25 in-domain didn't carry over. "Many approaches that outperform BM25 on an in-domain evaluation, perform poorly on the BEIR datasets." (§7 Conclusions)
- The pool for TREC-COVID came from many teams: "The annotation set was constructed by using the search results from the various systems participating in the challenge." (§6)
- A standard data format: "corpus, queries and qrels" (qrels = the relevance labels). (§3.2)
- Why one rank-aware metric. "Decision support metrics such as Precision and Recall which are both rank unaware are not suitable. Binary rank-aware metrics such as MRR (Mean Reciprocal Rate) and MAP (Mean Average Precision) fail to evaluate tasks with graded relevance judgements." They use nDCG@10 for all datasets. (§3.3 Evaluation Metric)
- Labels come from a pool; everything else counts as irrelevant. "existing retrieval methods are used to get a pool of candidate documents which are then marked for their relevance. All other unseen documents are assumed to be irrelevant." (§6 Impact of Annotation Selection Bias)
- Pools built with keyword search penalize dense retrieval. "Such a lexical bias disfavours approaches that don’t rely on lexical matching, like dense retrieval methods, as retrieved hits without lexical overlap are automatically assumed to be irrelevant, even though the hits might be relevant for a query." (§6)
- Hole@10 on TREC-COVID (share of a system's top-10 hits that were never judged): BM25 6.4%, docT5query 2.8%, ANCE 14.4%, TAS-B 31.8%. (§6)
- After judging the holes (980 query-document pairs), nDCG@10 moved: docT5query "just from 0.713 to 0.714"; ANCE "from 0.654 (slightly below BM25) to 0.735, which is 6.7 points above the BM25 performance." BM25 went 0.656 → 0.668. (§6, Table 4)
- Even a diverse pool stays biased. "Even though many systems contributed to the TREC-COVID annotation pool, the annotation pool is still biased towards lexical approaches." (§6)

## Visuals worth redrawing

- Table 4 (TREC-COVID before and after filling the holes): paired bars for BM25 vs ANCE, where the order flips once the missing labels are added.

## My notes

- Abstract page only, 2026-09-27. Last revised 2021-10-21.
- The dense models tested are from 2020–2021. Modern embedding models are trained on far more varied data, so the gap is likely smaller now, but this source doesn't show that. The lesson that survives: measure on your own data, and keep keyword search around (hybrid-search).
