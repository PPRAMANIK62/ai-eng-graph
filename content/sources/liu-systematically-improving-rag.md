---
id: liu-systematically-improving-rag
title: Systematically Improving Your RAG
author: Jason Liu
url: https://jxnl.co/writing/2024/05/22/systematically-improving-your-rag/
published: 2024-05-22
accessed: 2026-09-27
kind: blog
primary: false
---

## Summary

A consultant's runbook for improving RAG apps. The first step is to check
retrieval before touching the answer: have an LLM write questions for each
chunk, see whether search brings that chunk back, and record recall and
precision as a baseline. Then use the baseline to decide what to try (full
text vs embeddings, metadata, rerankers), and weigh recall gains against
latency.

## Key claims

- Most people skip checking retrieval. "most people are spending too much time on the actual synthesis without actually understanding whether or not the data is being retrieved correctly." (Start with Synthetic Data)
- The recipe: "Create synthetic questions for each text chunk in your database", "Use these questions to test your retrieval system", "Calculate precision and recall scores to establish a baseline". (Start with Synthetic Data)
- The question per chunk: "for every text chunk, I want it to synthetically generate a set of questions that this text chunk answers. For those questions, can we retrieve those text chunks?" (Start with Synthetic Data)
- On essays, full-text search and embeddings "basically performed the same, except full text search was about 10 times faster." (Start with Synthetic Data)
- On issues pulled from a repository, "full text search got around 55% recall, and then embedding search got around 65% recall." (Start with Synthetic Data)
- Why the baseline matters. "just knowing how challenging these questions are on the baseline is super important to figure out what kind of experimentation you need to perform better." (Start with Synthetic Data)
- Use recall with and without a change to decide if it's worth it, weighed against latency: "Well, recall doubles. The latency increases by 20%, then a conversation can happen." (Balance Latency and Performance)
- The right trade depends on stakes: for a medical tool "maybe I do care that the 1% is included because the stakes are so high" but for a docs page latency may matter more. (Balance Latency and Performance)
- Thumbs up/down feedback is too noisy to build an eval set; ask a specific question. "We had to change the copy to just "Did we answer the question correctly? Yes or no."" (Implement Clear User Feedback Mechanisms)

## Visuals worth redrawing

- None.

## My notes

- Practitioner post, written up from a 30-minute conversation, so light on method. The 55% vs 65% numbers are his own client data, not published with details.
- One odd line: synthetic data "should just be around 97% recall precision." Unclear what he means (a target? a typical result?). Don't use it.
- Synthetic questions written from a chunk tend to reuse that chunk's words, which may make retrieval look easier than it is; `chroma-generative-benchmarking` measured this (naive generated queries scored higher than real ones).
