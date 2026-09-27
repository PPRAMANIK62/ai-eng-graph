---
id: qdrant-reranker-worth-it
title: When Is a Reranker Worth It?
author: Dylan Couzon (Qdrant)
url: https://qdrant.tech/documentation/search-tuning/when-a-reranker-is-worth-it/
published: 2026-08-23
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

Part 5 of Qdrant's "Tune Your Retrieval Pipeline" series. Tests four cross-encoders reranking hybrid (RRF) candidates on five public datasets, against both default RRF and fusion tuned on labels, with held-out checks. Only two of five gains held up. Model fit (context window, training domain) mattered most, a reranker that loses at 10 candidates still loses at 200, and CPU throughput is low. Read in full as text on 2026-09-27.

## Key claims

- Measure the headroom first: score the candidate list as if perfectly ordered and compare. "The gap between the two is everything a better ranking stage could recover, so measure it before you reach for a model." At 200 candidates the nDCG@10 gap was 0.247 to 0.487 across the five datasets. (intro)
- Cross-encoders read query and candidate together. "Joint reading lets the model capture token interactions that separately encoded query and document vectors miss. Every candidate takes a forward pass at query time, which rules a cross-encoder out as a first stage and keeps it in the reranking slot." (intro)
- Setup: 5,183 to 100,000 documents, all-MiniLM-L6-v2 dense + BM25, four cross-encoders, 10 to 200 candidates, 200 queries per dataset; "read these reranker deltas as directional". (Note)
- A reranker only reorders what it gets. "missing documents are a candidate depth or retrieval problem." (Test a Reranker in Three Steps)
- Model choice mattered most. "model choice moved our results more than any other setting." (same)
- Compare with tuned fusion, not the default. "A reranker measured against the default can look like a win that tuning would have delivered for far less work at query time." (Compare with the Best First Stage)
- Results, best model per dataset, nDCG@10 change vs default RRF / vs tuned fusion / held out: SciFact +0.057 / +0.033 / no (37%); ArguAna +0.031 / +0.017 / no (2.5%); WANDS +0.039 / −0.008 / no (0%); CodeSearchNet +0.169 / +0.135 / yes (100%); DBPedia-entity +0.137 / +0.115 / yes (100%). Best model was jina-reranker-v2 on four, MiniLM-L-6 on WANDS. (table)
- MiniLM-L-6, MiniLM-L-12 and bge-reranker-base truncate at 512 tokens; jina-reranker-v2 reads 1024 and was trained on code too. (same)
- The worked case: on DBPedia-entity, fusion left the right page at rank 49 of 200 (35th dense, 45th sparse) for "John Lennon Yoko Ono album Starting Over"; "The cross-encoder read the query and page as one sequence and put it first." (same)
- Why rerankers lose: long queries (ArguAna queries average 168 words, little room in 512 tokens) and training-domain gaps (older models not trained on code). (Diagnose a Loss Before You Stop)
- Depth doesn't rescue a loser. "Every configuration that trailed tuned fusion at 10 candidates still trailed it at 200, so a deeper list does not rescue a reranker that loses at 10." (Set Candidate Count After a Win)
- More candidates can hurt: in ArguAna 90% of queries had the relevant document in the first 25; going to 200 raised that to 98% "but turned the gain into a loss". DBPedia-entity reached 96% of its gain by 50 candidates. (same)
- CPU speed (Apple M5 Pro, 15 threads): ms-marco-MiniLM-L-6-v2 64 to 212 docs/s; MiniLM-L-12 34 to 117; bge-reranker-base 16 to 45; jina-reranker-v2 under 2. At 100 candidates, half a second to five seconds per query for the three smaller models, vs 0.6 to 1.5 ms for the second hybrid search list. (Size Reranking for Production)
- "Ship a reranker gain only when it survives held-out validation." (Compare with the Best First Stage)

## Visuals worth redrawing

- The results table as bars: gain over tuned fusion per dataset, marked held-out yes/no.

## My notes

- Small, older cross-encoders on CPU; hosted rerankers (Voyage, Cohere) on GPUs will be much faster and possibly better. Not tested here.
