---
id: chroma-generative-benchmarking
title: "Generative Benchmarking (Chroma technical report)"
author: Kelly Hong, Anton Troynikov, Jeff Huber (Chroma), Morgan McGuire (Weights & Biases)
url: https://www.trychroma.com/research/generative-benchmarking
published: 2025-04-07
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

Chroma's technical report on testing embedding models on your own data instead of public benchmarks. Public benchmarks like MTEB are generic, overly clean, and may have been seen by the models in training. The report shows a way to generate realistic test queries from your own documents with an LLM, and checks it against real user queries from Weights & Biases' docs chatbot (WandBot). On that real data, the model ranking differs from MTEB.

## Key claims

- Public benchmarks don't look like your data. "These datasets are generic, which fail to capture the domain-specificity of real-world retrieval applications. The data is also overly clean, often containing polished queries and documents which contrasts with the messiness of real data." (Introduction; "generic" and "overly clean" are bold on the page)
- Models may have seen the benchmarks in training. "most embedding models have likely seen these benchmark datasets during training, which makes it difficult to distinguish true retrieval capabilities from memorization." (Introduction)
- LLMs asked to write "new" queries for public datasets reproduce old ones. "We present samples of reproduced queries—either verbatim or slightly reworded—across all 9 datasets we tested." (Contributions)
- The MTEB ranking flipped on real data. "Our results show that jina-embeddings-v3 exhibits lower retrieval performance than text-embedding-3-large—despite jina-embeddings-v3 consistently outperforming text-embedding-3-large across all MTEB English tasks." (Results, Query Generation)
- Ground-truth data: real WandBot queries from 2023. "we manually examine 693 out of 2003 queries, and account for the rest of the queries using weighted representation." (WandBot case study)
- Corpus: "we filter down from an initial set of 13,319 documents to a refined dataset of 8,490 documents" (WandBot case study, document filtering)
- Recall@10 / NDCG@10 on the real (ground truth) WandBot queries: text-embedding-3-small 0.439 / 0.282; text-embedding-3-large 0.552 / 0.356; jina-embeddings-v3 0.511 / 0.341; voyage-3-large 0.670 / 0.402. (Table "WandBot - metrics for ground truth and generated queries"; it also has Precision@10)
- Same table, generated queries: text-embedding-3-small 0.530 / 0.397; text-embedding-3-large 0.602 / 0.454; jina-embeddings-v3 0.532 / 0.389; voyage-3-large 0.679 / 0.512. Generated queries kept the same Recall@10 ranking as the real ones; the caption notes one small NDCG@10 swap between text-embedding-3-small and jina. (same table)
- The method: filter documents with an LLM judge aligned to human labels, then have an LLM write queries using context and example queries so they sound like real users. (Generative Benchmarking approach)
- How the real queries were labelled: "Retrieve 10 documents from each of the 4 embedding models." A person checked whether any was relevant; if none was, they searched the docs by hand "to either identify false negatives or confirm true negatives." (Ground Truth Labeling, Queries)
- Result of that labelling: "560 queries with relevant document pairs (including 76 false negatives)" and "133 queries were true negatives" (Ground Truth Labeling)
- Naive generated queries (no context or examples) kept the model ranking but scored too high. "they yielded higher retrieval metrics than the ground truth. This could misleadingly suggest better performance compared to what would be expected in a real production environment." (Query Generation, Results)
- Aligning the LLM judge for document filtering to human labels took it from "an initial baseline of 46% to 75.2%" agreement over 5 iterations on 250 labelled documents. (Document Filtering, Results)
- Queries with no answer in the docs fall outside the metrics. "Currently, our retrieval metrics do not capture these scenarios, as our evaluation solely considered queries with available relevant documents." (Limitations & Future Work)
- What it's for. "Our work introduces a query generation method for evaluating retrieval systems that addresses the limitations of publicly available benchmarks." (Conclusion)

## Visuals worth redrawing

- The WandBot metrics table as a bar chart: Recall@10 per model on real queries, with a note on how the MTEB order differs.

## My notes

- Read with WebFetch and curl, 2026-09-27. Chroma sells a vector database; the method is general.
- The models tested are the 2024–2025 generation (text-embedding-3, jina-v3, voyage-3-large). Voyage has since moved to the voyage-4 family (see anthropic-embeddings).
- One dataset (technical docs for one company). The point is the ranking flip, not which model wins in general.
