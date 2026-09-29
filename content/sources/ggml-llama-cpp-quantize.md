---
id: ggml-llama-cpp-quantize
title: llama.cpp quantize README
author: ggml-org
url: https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

How to turn a 16- or 32-bit model into a smaller GGUF with `llama-quantize`, and a measured table for Llama-3.1-8B across every quant type: bits per weight, file size, prompt-processing speed and text-generation speed. Also a memory table for Llama 3.1 8B, 70B and 405B before and after Q4_K_M. The hardware for the speed table isn't stated.

## Key claims

- What quantization does and costs. "Quantization reduces the precision of model weights (e.g., from 32-bit floats to 4-bit integers), which shrinks the model's size and can speed up inference." and "This process however, may introduce some accuracy loss which is usually measured in [Perplexity](...) (ppl) and/or [Kullback–Leibler Divergence](...) (kld)." (intro)
- An importance matrix reduces the loss. "This can be minimized by using a suitable imatrix file." (intro)
- Two steps: convert to GGUF, then quantize. "Quantization is done in two phases: Convert the original model to GGUF format. Quantize the converted GGUF file." (Overview)
- Re-quantizing hurts. "`--allow-requantize` allow requantizing tensors that have already been quantized. Warning: This can severely reduce quality compared to quantizing from 16bit or 32bit" (Options)
- Multimodal parts are kept at higher precision. "multimodal components are usually kept in a high-quality format such as bf16 or q8." (Convert the multimodal components)
- Why: they are small and feed the LLM its inputs. "Multimodal components are usually much smaller than the LLMs they come with." and "The impact on speed and memory from using a smaller quant is negligible, but overall quality could be impacted." (same)
- `--pure` "disable k-quant mixtures and quantizes all tensors to the same type", so a default K-quant like Q4_K_M mixes types across tensors. (Options)
- Memory, Llama 3.1, original vs Q4_K_M: 8B 32.1 GB → 4.9 GB; 70B 280.9 GB → 43.1 GB; 405B 1,625.1 GB → 249.1 GB. "At the moment, memory and disk requirements are the same." (Memory/Disk Requirements) The column header is "Original size"; the precision isn't stated.
- Measured on Llama-3.1-8B (bits/weight, size GiB, prompt processing t/s @ 512, text generation t/s @ 128): F16 16.0005, 14.96, 923.49, 29.17; Q8_0 8.5008, 7.95, 865.09, 50.93; Q6_K 6.5633, 6.14, 812.01, 58.67; Q5_K_M 5.7036, 5.33, 758.69, 67.23; Q4_K_M 4.8944, 4.58, 821.81, 71.93; Q3_K_M 3.9960, 3.74, 783.44, 71.68; Q2_K 3.1593, 2.95, 784.45, 79.85; IQ2_XXS 2.3824, 2.23, 852.39, 79.86; IQ1_S 2.0042, 1.87, 858.88, 79.73. (Quantization tables)
- Text generation t/s for the other types under 4 bits per weight: IQ1_M 72.92, IQ2_XS 78.04, IQ2_S 77.30, IQ2_M 74.44, IQ3_XXS 73.95, IQ3_XS 71.67, IQ3_S 69.31, IQ3_M 70.15, Q2_K_S 90.01, Q3_K_S 69.84. Mostly 69 to 80, with Q2_K_S the exception. (Quantization tables)

## Visuals worth redrawing

- Size and text-generation speed per quant type as bars: generation speed rises as the file shrinks, then flattens below about 4 bits; prompt processing barely moves.

## My notes

- The table doesn't name the hardware, so the absolute t/s numbers only compare types against each other.
- The 8B "original" 32.1 GB is about twice the F16 file (14.96 GiB, about 16.1 GB), so it looks like 32-bit weights. Our inference, not stated.
- Q4_K_M is about 4.9 bits per weight, not 4, because it mixes types and stores scales.
