---
id: ggml-gguf-spec
title: GGUF (file format specification)
author: ggml-org
url: https://github.com/ggml-org/ggml/blob/master/docs/gguf.md
published: undated
accessed: 2026-09-29
kind: spec
primary: true
---

## Summary

The spec for GGUF, the single-file model format used by GGML-based tools such as llama.cpp. A GGUF file holds the weights plus all the metadata needed to load the model, as typed key-value pairs, so new fields can be added without breaking old files. Models are trained in PyTorch or similar and converted to GGUF. The spec also sets a file naming convention that includes the weight encoding (for example F16 or Q4_0).

## Key claims

- What GGUF is. "GGUF is a file format for storing models for inference with GGML and executors based on GGML." (intro)
- Models are converted into it. "Models are traditionally developed using PyTorch or another framework, and then converted to GGUF for use in GGML." (intro)
- One file, everything included. "Single-file deployment: they can be easily distributed and loaded, and do not require any external files for additional information." (Specification)
- Fast loading via mmap. "`mmap` compatibility: models can be loaded using `mmap` for fast loading and saving." (Specification)
- The change from GGJT is key-value metadata. "The key difference between GGJT and GGUF is the use of a key-value structure for the hyperparameters (now referred to as metadata), rather than a list of untyped values." (Specification)
- Successor to older formats. "It is a successor file format to GGML, GGMF and GGJT" (intro)
- Naming convention includes the encoding: `<BaseName><SizeLabel><FineTune><Version><Encoding><Type><Shard>.gguf`, example `Hermes-2-Pro-Llama-3-8B-F16.gguf` and `Grok-100B-v1.0-Q4_0-00003-of-00009.gguf`. (GGUF Naming Convention)
- Multimodal parts ship as a separate sidecar file prefixed `mmproj`, "Multimodal projector (vision/audio encoder and projection layer for use with a base LLM)". (GGUF Naming Convention)

## Visuals worth redrawing

- None needed.

## My notes

- The file names you see on Hugging Face (Q4_K_M etc.) are the "Encoding" part.
