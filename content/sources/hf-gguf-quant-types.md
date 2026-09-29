---
id: hf-gguf-quant-types
title: GGUF (Hugging Face Hub docs)
author: Hugging Face
url: https://huggingface.co/docs/hub/gguf
published: undated
accessed: 2026-09-29
kind: docs
primary: false
---

## Summary

Hugging Face's page on GGUF files on the Hub, with a table decoding each llama.cpp quantization type: how weights are grouped into blocks and super-blocks, what each block stores (a scale, sometimes a minimum), and the resulting bits per weight. Secondary: it documents llama.cpp's formats and links to the llama.cpp pull requests that define them.

## Key claims

- Q4_0: "4-bit round-to-nearest quantization (`q`). Each block has 32 weights. Weight formula: `w = q * block_scale`. Legacy quantization method (not used widely as of today)." Q8_0 is the same with 8 bits and also marked legacy. (Quantization types table)
- Q4_K: "4-bit quantization (`q`). Super-blocks with 8 blocks, each block has 32 weights. Weight formula: `w = q * block_scale(6-bit) + block_min(6-bit)`, resulting in 4.5 bits-per-weight." (same)
- Q6_K: "6-bit quantization (`q`). Super-blocks with 16 blocks, each block has 16 weights. Weight formula: `w = q * block_scale(8-bit)`, resulting in 6.5625 bits-per-weight." (same)
- Q2_K 2.625 and Q3_K 3.4375 bits per weight. (same)
- I-quants use an importance matrix: IQ2_XXS "Weight `w` is obtained using `super_block_scale` & `importance matrix`, resulting in 2.06 bits-per-weight." (same)
- MXFP4: "4-bit Microscaling Block Floating Point." (same)

## Visuals worth redrawing

- Block layout: 32 weights plus one scale, and the bits per weight that follow.

## My notes

- The scales stored per block are why "4-bit" files come out at 4.5 or more bits per weight.
