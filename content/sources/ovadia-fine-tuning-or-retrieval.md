---
id: ovadia-fine-tuning-or-retrieval
title: "Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs"
author: Oded Ovadia, Menachem Brief, Moshik Mishaeli, Oren Elisha (Microsoft)
url: https://arxiv.org/abs/2312.05934
published: 2023-12-10        # v3 2024-01-30
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Compares two ways to give a model knowledge it lacks: unsupervised fine-tuning on the text, and RAG. On knowledge-heavy question sets, RAG wins both for facts the model had seen in training and for facts that are new to it. Fine-tuning helps a little, and models struggle to pick up new facts from it unless they see the same fact phrased many ways.

## Key claims

- RAG beats fine-tuning for knowledge. "while unsupervised fine-tuning offers some improvement, RAG consistently outperforms it, both for existing knowledge encountered during training and entirely new knowledge." (Abstract)
- New facts are hard to learn by fine-tuning. "LLMs struggle to learn new factual information through unsupervised fine-tuning" (Abstract)
- Repetition in varied forms helps. "exposing them to numerous variations of the same fact during training could alleviate this problem." (Abstract)

## Visuals worth redrawing

## My notes

- "Unsupervised" fine-tuning here means training on raw text, not on question-answer pairs. Older models (2023). Read at the abstract level.
