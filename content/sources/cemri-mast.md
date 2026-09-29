---
id: cemri-mast
title: Why Do Multi-Agent LLM Systems Fail?
author: Mert Cemri, Melissa Z. Pan, Shuyi Yang, et al. (UC Berkeley)
url: https://arxiv.org/abs/2503.13657
published: 2025-03-17
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

A Berkeley study of 1,642 execution traces from 7 open-source multi-agent frameworks, sorted into a taxonomy (MAST) of 14 failure modes in 3 groups. Most failures come from how the system is designed and how agents talk to each other, not from the model alone. NeurIPS 2025 Datasets and Benchmarks; v3 (2025-10-26) read as PDF.

## Key claims

- Motivation. "Despite enthusiasm for Multi-Agent LLM Systems (MAS), their performance gains on popular benchmarks are often minimal." (Abstract)
- Failure rates of 41% to 86.7% across 7 state-of-the-art open-source multi-agent systems. (Introduction)
- Data: 1,642 annotated traces; the taxonomy was built from 150+ traces with six expert annotators, inter-annotator agreement κ = 0.88. (Abstract; Introduction)
- 14 failure modes in 3 categories: "(i) system design issues, (ii) inter-agent misalignment, and (iii) task verification." (Abstract)
- Category shares in Figure 1: system design issues 44.2%, inter-agent misalignment 32.3%, task verification 23.5%. (Figure 1)
- Largest single modes: step repetition 15.7%, reasoning-action mismatch 13.2%, unaware of termination conditions 12.4%, disobey task specification 11.8%. Also fail to ask for clarification 6.8%, task derailment 7.4%, premature termination 6.2%, no or incomplete verification 8.2%, incorrect verification 9.1%. (Figure 1; Section 4)
- Example of weak verification: a ChatDev chess program passes superficial checks but doesn't follow chess rules. (Section 4, FM-3.2)
- Fixes help but aren't enough: a workflow change in ChatDev gave +9.4% task success; "achieving robust MAS reliability often requires more than isolated fixes". (Introduction)

## Visuals worth redrawing

- Figure 1: the taxonomy with shares per category.

## My notes

- Frameworks studied are open-source research systems (ChatDev, MetaGPT, AG2, etc.) with GPT-4-era and Claude 3 models, not production systems.
