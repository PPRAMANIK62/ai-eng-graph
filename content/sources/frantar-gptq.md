---
id: frantar-gptq
title: "GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers"
author: Elias Frantar, Saleh Ashkboos, Torsten Hoefler, Dan Alistarh
url: https://arxiv.org/abs/2210.17323
published: 2022-10-31
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

ICLR 2023 paper. GPTQ quantizes a trained model's weights to 3 or 4 bits in one pass, using second-order information to correct for rounding errors as it goes. It quantized 175B-parameter models in about four GPU hours and ran them faster than FP16.

## Key claims

- One-shot, second-order. "GPTQ, a new one-shot weight quantization method based on approximate second-order information, that is both highly-accurate and highly-efficient." (Abstract)
- Speed and bit width. "GPTQ can quantize GPT models with 175 billion parameters in approximately four GPU hours, reducing the bitwidth down to 3 or 4 bits per weight, with negligible accuracy degradation relative to the uncompressed baseline." (Abstract)
- First 175B model on one GPU. "allowing us for the first time to execute an 175 billion-parameter model inside a single GPU for generative inference." (Abstract)
- Speedups. "around 3.25x when using high-end GPUs (NVIDIA A100) and 4.5x when using more cost-effective ones (NVIDIA A6000)." (Abstract)

## Visuals worth redrawing

- None needed.

## My notes

- Huang et al. describe GPTQ as "utilizing an error compensation strategy based on second-order loss", using the inverse Hessian. Kurtic et al. describe it as "second-order weight adjustments using calibration data". That's the plain-words mechanism: round one weight, nudge the others to make up for the error.
