---
id: li-rag-vs-long-context
title: "Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach"
author: Zhuowan Li, Cheng Li, Mingyang Zhang, Qiaozhu Mei, Michael Bendersky (Google DeepMind, University of Michigan)
url: https://arxiv.org/abs/2407.16833
published: 2024-07-23        # v2 2024-10-17, EMNLP 2024 industry track
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

A head-to-head of RAG and putting the whole text in the prompt (long context, LC) on three 2024 models. LC scores higher on average, RAG costs far less, and for most questions both give the same answer. Their Self-Route method tries RAG first and only falls back to the full text when the model says the retrieved chunks aren't enough.

## Key claims

- Models and benchmarks: Gemini-1.5-Pro, GPT-4O, GPT-3.5-Turbo on LongBench and ∞Bench. (3.1, 3.2)
- LC wins on quality. "LC surpasses RAG by 7.6% for Gemini-1.5-Pro, 13.1% for GPT-4O, and 3.6% for GPT-3.5-Turbo." (3.3 Benchmarking results)
- RAG wins on cost. "RAG significantly decreases the input length to LLMs, leading to reduced costs, as LLM API pricing is typically based on the number of input tokens." (body; exact section not recorded)
- Mostly the same answers. "For 63% queries, the model predictions are exactly identical; and for 70% queries, the score difference is less than 10." (4.1 Motivation)
- Self-Route step 1: give the model the question and retrieved chunks, "and prompt it to predict whether the query is answerable" (4.2 Self-Route)
- Self-Route step 2: "For the queries deemed unanswerable, we proceed to the second step, providing the full context to the long-context LLMs." (4.2)
- Savings. "The cost is reduced by 65% for Gemini-1.5-Pro and 39% for GPT-4O." (4.3 Results)
- Token share: Gemini-1.5-Pro "uses 38.6% of the tokens" with Self-Route vs LC. (4.3)
- Why RAG fails: "(A) multi-step reasoning, (B) general queries, (C) long and complex queries, (D) implicit queries demanding thorough context understanding." (5.2 Why does RAG fail?)
- Retrieval setup: Contriever and Dragon, 300-word chunks, top k=5 by default. (3.2 Models and Retrievers)
- When the text is much bigger than the window (GPT-3.5-Turbo, 16k window, on ∞Bench), RAG beats LC because LC has to truncate. (3.3)
- The gap shrinks with more chunks. "when k is larger than 50, all three methods get similar performance" (5.1 Ablations of k)
- Quality holds. "Self-Route significantly reduces the computation cost while maintaining a comparable performance to LC." (Abstract)
- Share of questions the model called answerable from the chunks: 81.74% for Gemini-1.5-Pro, 57.36% for GPT-4O, 74.10% for GPT-3.5-Turbo. (Table 1 / 3.3)
- Benchmark lengths. "LongBench contains a collection of 21 datasets, with an average context length of 7k words." and "∞Bench consists of even longer contexts with an average length of 100k tokens." (3.1 Datasets and metrics)

## Visuals worth redrawing

- The Self-Route flow: question + chunks → "answerable?" → yes: answer; no: send the full text. Redraw as a two-branch flow.

## My notes

- Opened abstract and HTML. 2024 models. Benchmarks are around 7k words (LongBench) to about 100k tokens (∞Bench), so "long" here fits in the window.
