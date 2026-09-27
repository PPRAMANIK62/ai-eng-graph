---
id: steck-cosine-similarity
title: Is Cosine-Similarity of Embeddings Really About Similarity?
author: Harald Steck, Chaitanya Ekanadham, Nathan Kallus (Netflix)
url: https://arxiv.org/abs/2403.05440
published: 2024-03-08
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

A short paper from Netflix researchers (WWW '24 Companion) that asks whether cosine similarity between learned embeddings means what people think. Working with regularized linear models, where the math can be solved exactly, they show the cosine between two embeddings can depend on training choices that have nothing to do with meaning, and so can be arbitrary. They warn the same kind of effect can happen in deep models.

## Key claims

- The definition: cosine is the angle, or the dot product of the length-1 versions. "Cosine-similarity is the cosine of the angle between two vectors, or equivalently the dot product between their normalizations." (Abstract)
- In practice cosine is sometimes better and sometimes worse than a plain dot product. "This can work better but sometimes also worse than the unnormalized dot-product between embedded vectors in practice." (Abstract)
- For some learned embeddings, cosine scores can be meaningless. "We derive analytically how cosine-similarity can yield arbitrary and therefore meaningless 'similarities.'" (Abstract)
- For some models the similarities aren't even unique; for others the regularization quietly controls them. "For some linear models the similarities are not even unique, while for others they are implicitly controlled by the regularization." (Abstract)
- Deep models mix several regularizations, which can have unintended effects on cosine. "these have implicit and unintended effects when taking cosine-similarities of the resulting embeddings, rendering results opaque and possibly arbitrary." (Abstract)
- Their advice. "we caution against blindly using cosine-similarity and outline alternatives." (Abstract)

- The models they analyze are linear matrix-factorization models, the kind used in recommender systems. "this is possible for linear Matrix Factorization (MF) models" (Section 1, PDF)

## Visuals worth redrawing

- None used. Only the abstract page was read.

## My notes

- Read the arXiv abstract page and the PDF's first pages (2026-09-27). Affiliations from the PDF title page: all three at Netflix (Kallus also Cornell). The alternatives they propose aren't in these notes.
- The analysis is on matrix-factorization-style models (recommendation systems), not on text embedding APIs. It's a warning about how far to trust a cosine score, not proof that API embeddings are broken.
