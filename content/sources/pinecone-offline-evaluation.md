---
id: pinecone-offline-evaluation
title: Evaluation Measures in Information Retrieval
author: Laura Carnevali (Pinecone)
url: https://www.pinecone.io/learn/offline-evaluation/
published: 2023-06-30
accessed: 2026-09-27
kind: blog
primary: false
---

## Summary

A practical walkthrough of the four offline metrics people use for search:
recall@K, MRR, MAP@K and NDCG@K. Uses one small example (eight images, a
"cat in a box" query, relevant results at ranks 2, 4, 5 and 7) with Python
code for each. Splits metrics into order-aware and order-unaware, and gives
the pros and cons of each.

## Key claims

- Offline vs online metrics. "Offline metrics are measured in an isolated environment before deploying a new IR system." Online metrics come from real use, like click-through rate. (Metrics in Information Retrieval)
- Teams use offline metrics first to predict how a system will do. "It begins, however, with offline metrics to predict the system’s performance before deployment." (Metrics in Information Retrieval)
- Order-aware vs order-unaware. "This refers to whether the order of results impacts the metric score. If so, the metric is order-aware. Otherwise, it is order-unaware." (Metrics in Information Retrieval)
- Recall@K definition. "It measures how many relevant items were returned ( ) against how many relevant items exist in the entire dataset ( )." (Recall@K)
- K is the number of results returned. "The K in this and all other offline metrics refers to the number of items returned by the IR system." (Recall@K)
- Worked example, relevant at ranks 2, 4, 5, 7 out of 8: Recall@1 = 0.0, @2 = 0.25, @3 = 0.25, @4 = 0.5, @5 = 0.75, @6 = 0.75, @7 = 1.0, @8 = 1.0. (Recall@K, code output)
- Recall@K can be gamed. "By increasing K to N or near N, we can return a perfect score every time, so relying solely on recall@K can be deceptive." (Recall@K, Pros and Cons)
- Recall@K ignores order. "if we used recall@4 and returned one relevant result at rank one, we would score the same as if we returned the same result at rank four." (Recall@K, Pros and Cons)
- A smaller K is harder. "a smaller k value makes it harder for the IR system to score well with recall@K." (Recall@K, Pros and Cons)
- MRR is order-aware and averaged over queries; the rank used is that of the first relevant result. "the rank of the first *actual relevant* result for query" (Mean Reciprocal Rank)
- MRR worked example: three queries with first relevant results at ranks 2, 1 and 5 give 1/2, 1/1 and 1/5, so MRR = 0.57. (Mean Reciprocal Rank, code output)
- Where MRR fits. "It is order-aware, a massive advantage for use cases where the rank of the first relevant result is important, like chatbots or question-answering." (MRR, Pros and Cons)
- Where it doesn't. "we consider the rank of the first relevant item, but no others. That means for use cases where we’d like to return multiple items like recommendation or search engines, MRR is not a good metric." (MRR, Pros and Cons)
- MRR is harder to read than recall. "MRR is less readily interpretable compared to a simpler metric like recall@K." (MRR, Pros and Cons)
- NDCG needs graded labels, which cost more. "we need to know whether each item is more/less relevant than other items; the data requirements are more complex." (NDCG@K, Pros and Cons)
- Several metrics together. "you can use several metrics, just as Spotify did with recall@1, recall@30, and MRR@30." (end of NDCG@K section)

## Visuals worth redrawing

- The "cat in a box" ranking with relevant results highlighted at 2, 4, 5 and 7, and the recall@K curve that steps up as K grows. Easy to redraw with our own example.

## My notes

- Secondary, but clear and with runnable code. The math for MRR matches Voorhees' TREC-8 definition (`voorhees-trec8-qa`).
- The Spotify detail is second-hand (it cites a Spotify engineering blog, which I didn't open). Don't lean on it.
- The formula images didn't come through in the text; the claims above are from the prose and the code output.
