---
id: liu-llava
title: Visual Instruction Tuning
author: Haotian Liu, Chunyuan Li, Qingyang Wu, Yong Jae Lee
url: https://arxiv.org/abs/2304.08485
published: 2023-04-17
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The LLaVA paper (NeurIPS 2023). It connects a pre-trained CLIP image encoder to an LLM (Vicuna) with one trainable projection that turns image features into vectors the size of the LLM's word embeddings, so the LLM reads them like extra tokens. Training has two stages: first only the projection learns (alignment), then the projection and the LLM are fine-tuned on instruction data generated with text-only GPT-4. Latest version 2023-12-11. Abstract read on arxiv; sections 4.1 and 4.2 through the ar5iv HTML rendering.

## Key claims

- The design in one line: LLaVA is "an end-to-end trained large multimodal model that connects a vision encoder and LLM for general-purpose visual and language understanding." (abstract)
- Parts: "the pre-trained CLIP visual encoder ViT-L/14" and Vicuna as the LLM. (section 4.1)
- The connector: "a trainable projection matrix W to convert Z_v into language embedding tokens H_v, which have the same dimensionality as the word embedding space." (section 4.1)
- Stage 1 trains only the projection on 595K image-text pairs from CC3M, "with both the visual encoder and LLM weights frozen". (section 4.2)
- Stage 2: "keep the visual encoder weights frozen, and continue to update both the pre-trained weights of the projection layer and LLM." (section 4.2)
- Other connectors exist: "more sophisticated schemes ... such as gated cross-attention in Flamingo" or "Q-former in BLIP-2". (section 4.1)
- Training data: "the first attempt to use language-only GPT-4 to generate multimodal language-image instruction-following data." (abstract)

## Visuals worth redrawing

- Figure 1 (architecture): image → vision encoder → projection W → visual tokens, next to text tokens, into the language model.

## My notes

- An open research design from 2023. Closed providers don't publish theirs, so this is the clearest public example of the "encoder + projection + LLM" shape, not proof of how any product works.
