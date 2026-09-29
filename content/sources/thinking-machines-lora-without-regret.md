---
id: thinking-machines-lora-without-regret
title: LoRA Without Regret
author: John Schulman and others at Thinking Machines Lab
url: https://thinkingmachines.ai/blog/lora/
published: 2025-09-29
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

A careful set of experiments on when LoRA matches full fine-tuning, on Llama 3 and Qwen3 models (including a mixture-of-experts model) with Tulu3 and OpenThoughts3 data, sweeping the learning rate for every run. With LoRA on every layer and a learning rate about 10 times higher, it matches full fine-tuning on post-training-sized data and in RL. It falls behind when the data is too big for the adapter's capacity, and it dislikes very large batches.

## Key claims

- How LoRA works. "LoRA replaces each weight matrix W from the original model with a modified version W′=W+γBA, where B and A are matrices that together have far fewer parameters than W, and γ is a constant scaling factor." (intro)
- Serving many adapters. "a single inference server can keep many adapters (different model versions) in memory and sample from them simultaneously in a batched way." vLLM and SGLang implement this. (intro, Multi-tenant serving)
- Training memory: full fine-tuning stores gradients and optimizer state for every weight, often in float32, so it "usually requires an order of magnitude more accelerators than sampling from the same model does". (intro, Layout size for training)
- The earlier consensus. "There is agreement that LoRA underperforms in settings that resemble pre-training, namely those with very large datasets that exceed the storage limits of LoRA parameters." (intro, citing Biderman et al. 2024)
- Main result. "For supervised fine-tuning on small-to-medium-sized instruction-tuning and reasoning datasets, LoRA performs the same as full fine-tuning." (We find that)
- Capacity limit. "For datasets that exceed LoRA capacity, LoRA underperforms FullFT." (We find that)
- Batch size. "LoRA is less tolerant of large batch sizes than full fine-tuning" and more rank doesn't fix it. (We find that)
- Which layers. "Even in small data settings, LoRA performs better when applied to all weight matrices, especially MLP and MoE layers. Attention-only LoRA underperforms even when we match the number of trainable parameters" (We find that)
- RL needs little capacity. "LoRA performs equivalently to FullFT for reinforcement learning even with small ranks." Even at rank 1 it has enough capacity for their RL runs. (We find that; Reinforcement learning)
- Why RL needs so little. "policy gradient algorithms learn roughly 1 bit of information per episode, given that there’s a single reward value at the end of the episode." (later discussion of capacity)
- What they measured. "Log loss measurement gives clean results and scaling laws over ranges of training steps and training parameters." (intro)
- Learning rate. "We find that the optimal learning rate for FullFT is lower by a factor of 10 than for high-rank LoRAs." Biderman et al. found a similar 10x ratio. (Methods and results)
- The optimal learning rate is about the same across ranks. (Methods and results)
- B starts at zero. "Matrix B is initialized to zero" (Hyperparameters)
- Compute. "LoRA takes slightly more than ⅔ of the FLOPs that full fine-tuning does per pass." (Compute efficiency advantage of LoRA)
- Parameter counts on Llama-3.1-8B: all layers at rank 256 is 0.70B trainable parameters; attention-only rank 256 is 0.25B; MLP-only rank 128 is 0.24B. (Parameter counts table)
- The conclusion. A "low-regret regime" where LoRA performs like full fine-tuning "covers most post-training scenarios". (intro)

## Visuals worth redrawing

- Loss vs learning rate for several ranks and full FT: the minimum for LoRA sits about 10x to the right.

## My notes

- Blog post, not peer-reviewed, but from the team that ran the experiments, with sweeps. Measures log loss mainly.
