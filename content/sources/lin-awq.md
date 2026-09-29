---
id: lin-awq
title: "AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration"
author: Ji Lin, Jiaming Tang, Haotian Tang, Shang Yang, Wei-Ming Chen, Wei-Chen Wang, Guangxuan Xiao, Xingyu Dang, Chuang Gan, Song Han (MIT Han Lab)
url: https://arxiv.org/abs/2306.00978
published: 2023-06-01
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

MLSys 2024 Best Paper (latest revision v6, 2026-04-25). AWQ is a 4-bit weight-only method built on one observation: a small share of weights matter much more than the rest, and you find them by looking at the activations that flow through them, not at the weights. It protects them by scaling those channels up before rounding, which avoids mixed precision and needs no backpropagation.

## Key claims

- Not all weights are equal. "AWQ finds that not all weights in an LLM are equally important. Protecting only 1% salient weights can greatly reduce quantization error." (Abstract)
- Find them from activations. "To identify salient weight channels, we should refer to the activation distribution, not weights." (Abstract)
- Protect by scaling, not mixed precision. "we mathematically derive that scaling up the salient channels can reduce the quantization error." (Abstract)
- The scale comes from calibration statistics. "The scale is determined by collecting the activation statistics offline." (Abstract)
- No backprop, so less calibration overfit. "AWQ does not rely on any backpropagation or reconstruction, so it generalizes to different domains and modalities without overfitting the calibration set." (Abstract)
- Local deployment motivation. "running LLMs locally on edge devices can reduce the cloud computing cost and protect users' privacy." (Abstract)
- TinyChat runtime: "more than 3x speedup over the Huggingface FP16 implementation on both desktop and mobile GPUs." (Abstract)

## Visuals worth redrawing

- None needed.

## My notes

- Kurtic et al. find a tuned GPTQ beats AWQ on real-world tasks; AWQ's own paper and Huang et al. favoured or tied AWQ. Method tuning matters.
