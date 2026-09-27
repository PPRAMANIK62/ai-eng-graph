---
id: bruch-fusion-functions
title: An Analysis of Fusion Functions for Hybrid Retrieval
author: Sebastian Bruch, Siyu Gai, Amir Ingber (Pinecone)
url: https://arxiv.org/abs/2210.11934
published: 2023-05-04          # v2; v1 2022-10-21; journal DOI 10.1145/3596512 (ACM TOIS)
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The main study of how to merge lexical (BM25) and semantic scores. Compares a convex (weighted) combination of normalized scores with RRF on MS MARCO and BEIR datasets. Finds that the weighted combination beats RRF in and out of domain, that RRF is sensitive to its k, and that the weight can be tuned with a handful of labeled queries. Read the abstract and the HTML full text.

## Key claims

- The findings. "Contrary to existing studies, we find RRF to be sensitive to its parameters; that the learning of a CC fusion is generally agnostic to the choice of score normalization; that CC outperforms RRF in in-domain and out-of-domain settings; and finally, that CC is sample efficient, requiring only a small set of training examples to tune its only parameter to a target domain." (Abstract)
- Convex combination: f = α·f_Sem + (1 − α)·f_Lex with 0 ≤ α ≤ 1; scores are normalized first because "lexical scores (such as BM25) and semantic scores (such as dot product) may be unbounded, often they are normalized with min-max scaling" (§1 Introduction)
- RRF throws away score distances. "Observe that the distance between raw scores plays no role in determining their hybrid score—a behavior we find counter-intuitive in a metric space where distance does matter." (§1)
- RRF's parameters matter. "we note that NDCG swings wildly as a function of rrf parameters." (§5.1) Performance improves with a different k for the lexical and semantic lists. (§5.1)
- A tuned RRF transfers badly. "a tuned rrf generalizes poorly to out-of-domain datasets." (§1)
- Default RRF (k = 60) is still good zero-shot. "asserting once more the remarkable performance of rrf in zeros-shot settings." (§4/§6 discussion of Table 2)
- But tuned convex combination wins. "we find that TM2C2 significantly outperforms rrf on all datasets in terms of NDCG, and does generally better in terms of Recall." (same)
- Tuning α is cheap. "tuning α in a convex combination fusion function is extremely sample-efficient, requiring just a handful of labeled queries to arrive at a value suitable for a target domain" (§1)
- Datasets: MS MARCO passage v1 (train queries for tuning, 6,980 dev queries for evaluation) plus 8 BEIR datasets: NQ, Quora, NFCorpus, HotpotQA, Fever, SciFact, DBPedia, FiQA. "We additionally experiment with 8 datasets from the BeIR collection" (§3.2 Empirical Setup, Table 1)
- Hybrid is motivated by the two being complementary: "fused together with the intuition that the two are complementary in how they model relevance." (Abstract)

## Visuals worth redrawing

- Figure 7: heatmaps of NDCG over the two RRF parameters (lexical k, semantic k). Shows the sensitivity.

## My notes

- TM2C2 = convex combination with theoretical min-max normalization.
- Authors worked at Pinecone, a vector database company. The results are careful, but it's a single paper, and Qdrant's 2026 measurements find DBSF (a normalization method) winning on some datasets and RRF on others.
