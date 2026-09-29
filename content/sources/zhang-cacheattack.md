---
id: zhang-cacheattack
title: "From Similarity to Vulnerability: Key Collision Attack on LLM Semantic Caching"
author: Zhixiang Zhang, Zesen Liu, Yuchong Xie, Quanfeng Huang, Dongdong She
url: https://arxiv.org/abs/2601.23088
published: 2026              # v2 on arXiv; accepted to ICML 2026
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Argues that a semantic cache key is a fuzzy hash: to get hits it must map similar prompts to the same entry, which is exactly what makes it easy to craft a colliding prompt. The authors' automated attack, CacheAttack, gets attacker-chosen cached responses served to other queries. Only the abstract page was read.

## Key claims

- The trade-off: "the locality required to maximize cache hit rates fundamentally conflicts with the cryptographic avalanche effect necessary for collision resistance." (Abstract)
- So "semantic caching is naturally vulnerable to key collision attacks." (Abstract)
- Result: CacheAttack "achieves a hit rate of 86% in LLM response hijacking and can induce malicious behaviors in LLM agent, while preserving strong transferability across different embedding models." (Abstract)
- Semantic caching is used by major providers "including AWS and Microsoft". (Abstract)

## Visuals worth redrawing

- None from the abstract.

## My notes

- I only read the abstract, so don't cite details of the attack method or the mitigations.
