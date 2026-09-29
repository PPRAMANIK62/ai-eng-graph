---
id: huang-llama3-quantization
title: "An empirical study of LLaMA3 quantization: from LLMs to MLLMs"
author: Wei Huang, Xingyu Zheng, Xudong Ma, Haotong Qin, Chengtao Lv, Hong Chen, Jie Luo, Xiaojuan Qi, Xianglong Liu, Michele Magno
url: https://arxiv.org/abs/2404.14047
published: 2024-04-22
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Tests 10 post-training quantization and LoRA fine-tuning methods on LLaMA3-8B and 70B from 1 to 8 bits, plus a LLaMA3-based vision-language model (LLaVA-Next-8B). At 4 bits the loss is small for all methods; at 3 bits plain rounding falls apart while GPTQ, AWQ and others hold up; at 2 bits most collapse. Latest revision v3, 2025-01-13. Read in full (HTML v3).

## Key claims

- Headline. "Our experimental results indicate that LLaMA3 still suffers from non-negligible degradation in linguistic and visual contexts, particularly under ultra-low bit widths." (Abstract)
- 4 bits vs 3 bits, by method. "overall, the 4-bit methods had a slight performance decrease (approximately 2%) compared to the original 16-bit LLM, with no significant differences between the different methods." and "In the context of 3-bit scenarios, traditional RTN quantization methods faced substantial performance losses (over 10% lower than 4 bits), while methods such as GPTQ, AWQ, SliM-LLM, and QuIP were able to maintain performance close to that of 4 bits (with less than 5% performance degradation)." (Section 3, results)
- RTN defined. "round-to-nearest (RTN) is a vanilla rounding quantization method" (Section 3)
- GPTQ mechanism. "GPTQ [10] is one of the most effective weight-only quantization methods, utilizing an error compensation strategy based on second-order loss." (Section 3)
- Table 1, LLaMA3-8B WikiText2 perplexity (lower is better), weights only, group size 128: FP16 6.1; RTN 4-bit 8.5, 3-bit 27.9, 2-bit 1.9×10^3; GPTQ 4-bit 6.5, 3-bit 8.2, 2-bit 2.1×10^2; AWQ 4-bit 6.6, 3-bit 8.2, 2-bit 1.7×10^6. RTN 8-bit (no groups) 6.2. (Table 1)
- Quantizing activations too: SmoothQuant "can maintain the accuracy of LLaMA3 with 6/8-bit weights and activations, but collapses at 4 bits." (Section 3)
- Bigger model, more robust. "the LLaMA3-70B model shows significant robustness to different quantization methods, even for ultra-low bit-width quantization." (Section 3)
- Vision-language: "under several advanced PTQ methods, the 4-bit MLLM exhibits a loss of less than 2% on multi-modal benchmarks"; at 2 bits the model gave repetitive character responses. (Section 5)
- Low-rank fine-tuning didn't repair LLaMA3-8B: fine-tuning on Alpaca "not only fails to compensate for the errors introduced by quantization, but actually exacerbates the degradation." (Section 4)

## Visuals worth redrawing

- Table 1 as grouped bars: perplexity by method at 16/4/3 bits, with 2-bit off the chart.

## My notes

- Mostly academic benchmarks (perplexity, CommonSenseQA, MMLU). Kurtic et al. argue untuned settings exaggerate losses.
