---
id: radford-clip
title: Learning Transferable Visual Models From Natural Language Supervision
author: Alec Radford, Jong Wook Kim, Chris Hallacy, et al. (OpenAI)
url: https://arxiv.org/abs/2103.00020
published: 2021-02-26
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The CLIP paper. It trains an image encoder and a text encoder together on 400 million image-caption pairs from the internet, with one task: given a batch of images and captions, pick which caption goes with which image. The result is an image encoder whose vectors line up with text vectors, which transfers to new tasks with no extra training. One of its image encoders is a ViT. Abstract read on arxiv; sections 2.3 and 2.4 through the ar5iv HTML rendering.

## Key claims

- Training data and task: "predicting which caption goes with which image" on "400 million (image, text) pairs collected from the internet". (abstract)
- The contrastive objective. "CLIP learns a multi-modal embedding space by jointly training an image encoder and text encoder to maximize the cosine similarity of the image and text embeddings of the N real pairs in the batch while minimizing the cosine similarity of the embeddings of the N²−N incorrect pairings." (section 2.3)
- Zero-shot result: they "match the accuracy of the original ResNet-50 on ImageNet zero-shot without the need for any of the 1.28 million training examples it was trained on." (abstract)
- ViT is one of the two image-encoder families. "For the second architecture, we experiment with the recently introduced Vision Transformer (ViT)." They trained "a ViT-B/32, a ViT-B/16, and a ViT-L/14." (section 2.4)

## Visuals worth redrawing

- Figure 1: text encoder and image encoder, an N×N grid of image-text similarities with the matching pairs on the diagonal.

## My notes

- ViT-L/14 is the encoder LLaVA later plugs into an LLM (see liu-llava).
