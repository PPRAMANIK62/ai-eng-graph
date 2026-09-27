---
id: deepmind-facts-benchmark-suite
title: "FACTS Benchmark Suite: a new way to systematically evaluate LLMs factuality"
author: Google DeepMind FACTS team, with Kaggle
url: https://deepmind.google/blog/facts-benchmark-suite-systematically-evaluating-the-factuality-of-large-language-models/
published: 2025-12-09
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

The follow-up to FACTS Grounding. It adds three more factuality benchmarks (answering from memory, answering with web search, answering about images) and updates grounding to a v2. The overall FACTS Score is the average across the four. No model scored above 70%.

## Key claims

- Four benchmarks. Parametric "measures the model’s ability to access its internal knowledge accurately in factoid question use-cases"; Search "tests a model’s ability to use Search as a tool to retrieve information and synthesize it correctly"; Multimodal tests answers about input images. (The FACTS Benchmark Suite)
- Grounding updated. "Grounding Benchmark - v2 , an extended benchmark to test a model’s ability to provide answers grounded in the context of a given prompt." (same section)
- 3,513 public examples in total; private sets held out and run by Kaggle. FACTS Score = average accuracy over public and private sets across the four benchmarks. (same section)
- Result. "All evaluated models achieved an overall accuracy below 70%, leaving considerable headroom for future progress." Gemini 3 Pro top at 68.8%. (Results)

## Visuals worth redrawing

- None needed.

## My notes

- The split is the useful idea for our graph: grounding (answer from given text) is measured separately from parametric knowledge (answer from memory) and search. Those map to grounding vs hallucination vs RAG.
- Google's own post, and Google's model tops it. Treat the ranking with that in mind.
