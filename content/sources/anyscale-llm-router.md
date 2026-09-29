---
id: anyscale-llm-router
title: Building an LLM Router for High-Quality and Cost-Effective Responses
author: Amjad Almahairi (Anyscale)
url: https://www.anyscale.com/blog/building-an-llm-router-for-high-quality-and-cost-effective-responses
published: 2024-07-01
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

A tutorial for fine-tuning Llama 3 8B into a router that decides, per query, whether a cheap open model (Mixtral-8x7B) is good enough or the query needs GPT-4. Labels come from GPT-4 grading Mixtral's answers. The router cut cost a lot on benchmarks while keeping quality close.

## Key claims

- The router is a fine-tuned classifier: "a causal-LLM classifier" built on Llama 3 8B that sends easy queries to Mixtral-8x7B and hard ones to GPT-4. (Approach)
- Labels from an LLM judge: GPT-4 scored Mixtral's answers 1 to 5; "LLM-as-a-Judge approach". (Data labeling)
- Training data: 109,101 labeled examples from the public Nectar dataset (the tutorial subsamples 1,000). (Data)
- Results, for the routers in the accompanying paper as a group, not only this one: "Overall, our LLM Routers can achieve the same performance as our baselines with up to a 70% cost reduction on MT Bench, a 30% cost reduction on MMLU, and a 40% cost reduction on GSM8K." (TLDR)
- The comparison with Unify AI and Martian is for "our best-performing LLM routers, the Causal LLM and a Matrix Factorization (MF) model", on MT Bench. (TLDR)
- It beat random routing and "public LLM routing systems from Unify AI and Martian." (Results)

## Visuals worth redrawing

## My notes

- Close to the phase 7 build (a fine-tuned router). Paper behind it: RouteLLM (arXiv 2406.18665), not opened here.
