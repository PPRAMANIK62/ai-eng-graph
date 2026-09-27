---
id: qu-semantic-chunking
title: Is Semantic Chunking Worth the Computational Cost?
author: Renyi Qu, Ruixuan Tu, Forrest Bao
url: https://arxiv.org/abs/2410.13070
published: 2024-10-16
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

A study comparing semantic chunking (cutting where the meaning shifts, found with embeddings) against plain fixed-size chunking on three tasks: document retrieval, evidence retrieval, and answer generation. The extra cost of semantic chunking didn't buy consistent gains.

## Key claims

- What semantic chunking is. It "aims to improve retrieval performance by dividing documents into semantically coherent segments." (Abstract)
- The baseline. "fixed-size chunking, where documents are split into consecutive, fixed-size segments" (Abstract)
- Tasks: "document retrieval, evidence retrieval, and retrieval-based answer generation." (Abstract)
- The finding. "The results show that the computational costs associated with semantic chunking are not justified by consistent performance gains." (Abstract)

## Visuals worth redrawing

- None used.

## My notes

- Abstract page only, 2026-09-27. Single version, submitted 2024-10-16.
- Chroma's report (chroma-evaluating-chunking) found its own cluster-based semantic chunker best on precision and IoU, while Kamradt's default semantic chunker scored below average. So "semantic chunking" isn't one thing, and the two studies measure differently.
