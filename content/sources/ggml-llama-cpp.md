---
id: ggml-llama-cpp
title: llama.cpp (GitHub repository README)
author: ggml-org
url: https://github.com/ggml-org/llama.cpp
published: undated
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

The README of llama.cpp, the C/C++ inference engine under many local-model tools. It lists the hardware it runs on (Apple Metal, CUDA, HIP, Vulkan, CPUs and more), the integer quantization levels it supports, CPU+GPU split for models bigger than VRAM, and a one-line way to download a GGUF model from Hugging Face and serve it over an OpenAI-compatible API.

## Key claims

- The goal is local inference with little setup on many kinds of hardware. "The main goal of `llama.cpp` is to enable LLM (and VLM) inference with minimal setup and state-of-the-art performance on a wide range of hardware - locally and in the cloud." (Description)
- Plain C/C++ with no dependencies; Apple silicon is first-class. "Plain C/C++ implementation without any dependencies" and "Apple silicon is a first-class citizen - optimized via ARM NEON, Accelerate and Metal frameworks" (Description)
- Quantization from 1.5 to 8 bits. "1.5-bit, 2-bit, 3-bit, 4-bit, 5-bit, 6-bit, and 8-bit integer quantization for faster inference and reduced memory use" (Description)
- CPU+GPU split. "CPU+GPU hybrid inference to partially accelerate models larger than the total VRAM capacity" (Description)
- Backends table: CUDA (Nvidia), HIP (AMD), Metal (Apple Silicon), Vulkan (GPU), SYCL (Intel GPU), plus CPU paths (AVX, AVX2, AVX512, AMX on x86; ARM NEON). (Supported backends)
- One command downloads a model from Hugging Face and starts an OpenAI-compatible server: `llama serve -hf ggml-org/Qwen3.5-0.8B-GGUF`, commented "Launch OpenAI-compatible API server". (Quick start)
- Built on the ggml library. "The `llama.cpp` project is build on top of the [ggml](https://github.com/ggml-org/ggml) library." (Description)

## Visuals worth redrawing

- None.

## My notes

- The README doesn't say which tools (Ollama, LM Studio) build on it. Don't claim that from this source.
