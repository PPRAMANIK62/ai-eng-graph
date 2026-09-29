---
id: dosovitskiy-vit
title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale"
author: Alexey Dosovitskiy, Lucas Beyer, Alexander Kolesnikov, et al. (Google)
url: https://arxiv.org/abs/2010.11929
published: 2020-10-22
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The Vision Transformer (ViT) paper. It cuts an image into fixed-size square patches, flattens each patch, maps it to a vector with a learned linear layer, adds a position embedding, and feeds the sequence to a standard transformer encoder, the same way text tokens are fed. It showed this works about as well as convolutional networks when pre-trained on enough data. v2 is from 2021-06-03. Abstract read on arxiv; section 3.1 read through the ar5iv HTML rendering of the same paper.

## Key claims

- A plain transformer on image patches works. "a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks." (abstract)
- Patches play the role of words. "Image patches are treated the same way as tokens (words) in an NLP application." (introduction)
- The image is reshaped into a sequence of flattened patches; with patch size P, the number of patches is N = HW/P², which is also the sequence length. (section 3.1)
- Each patch becomes a vector through a learned linear layer. "we flatten the patches and map to D dimensions with a trainable linear projection" (section 3.1)
- Position is added separately. "Position embeddings are added to the patch embeddings to retain positional information." (section 3.1)
- Whole pipeline in one line. "We split an image into fixed-size patches, linearly embed each of them, add position embeddings, and feed the resulting sequence of vectors to a standard Transformer encoder." (Figure 1 caption)
- Naming. "ViT-L/16 means the 'Large' variant with 16×16 input patch size." (section 4.1)
- Needs lots of pre-training data to match CNNs: results are "When pre-trained on large amounts of data and transferred to multiple mid-sized or small image recognition benchmarks". (abstract)

## Visuals worth redrawing

- Figure 1: image split into a grid of patches, each linearly embedded, position embeddings added, fed into a transformer encoder.

## My notes

- 2020 paper about image classification, not chat models. It's the base idea that later vision encoders (CLIP's ViT variants) use.
