---
id: weng-extrinsic-hallucinations
title: Extrinsic Hallucinations in LLMs
author: Lilian Weng
url: https://lilianweng.github.io/posts/2024-07-07-hallucination/
published: 2024-07-07
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

A long research survey on hallucination by an OpenAI researcher (at the time). It separates hallucinations that contradict the given context from those that contradict world knowledge, lists causes at the pretraining and fine-tuning stages, and maps the detection and mitigation methods: retrieval-based checking, sampling-based consistency checks, calibration, and fine-tuning for factuality.

## Key claims

- The broad meaning of the word. "Hallucination in large language models usually refers to the model generating unfaithful, fabricated, inconsistent, or nonsensical content." (intro)
- Two kinds: in-context (output should match the source content given in the context) and extrinsic (output should be grounded in world knowledge). "In-context hallucination: The model output should be consistent with the source content in context." (intro)
- Two requirements to avoid it. "LLMs need to be (1) factual and (2) acknowledge not knowing the answer when applicable." (intro)
- Cause 1, the data. "Data crawled from the public Internet is the most common choice and thus out-of-date, missing, or incorrect information is expected." (Pre-training Data Issues)
- Cause 2, fine-tuning on new facts (Gekhman et al. 2024): new knowledge is learned slower, and once learned it raises hallucination. "Once the examples with new knowledge are eventually learned, they increase the model’s tendency to hallucinate." (Fine-tuning New Knowledge)
- So fine-tuning is a risky way to add knowledge. "These empirical results from Gekhman et al. (2024) point out the risk of using supervised fine-tuning for updating LLMs’ knowledge." (Fine-tuning New Knowledge)
- FActScore findings: more errors on rarer entities and on facts later in a long answer; retrieval helps. "Error rates are higher for rarer entities in the task of biography generation." (Retrieval-Augmented Evaluation)
- "Using retrieval to ground the model generation significantly helps reduce hallucination." (Retrieval-Augmented Evaluation)
- SelfCheckGPT: detect hallucinations by sampling several answers and checking whether they agree; needs no external knowledge base. "SelfCheckGPT (Manakul et al. 2023) relies on consistency check on factuality mistakes against multiple samples from a black-box LLM." (Sampling-Based Detection)

## Visuals worth redrawing

- The Gekhman et al. known/unknown training curve (Fine-tuning New Knowledge): dev accuracy peaks when the model has learned most Known examples but few Unknown ones. Redraw as a simple two-line sketch, credited to Gekhman et al. via Weng.

## My notes

- 2024-07-07, before the 2025 papers (Kalai et al., Anthropic's circuit tracing). Its causes are about data and fine-tuning; Kalai adds the grading incentive; Anthropic adds the internal mechanism. Different levels, same story.
- Rare entities → more errors fits Kalai's singleton rule (facts seen once are the ones it gets wrong).
