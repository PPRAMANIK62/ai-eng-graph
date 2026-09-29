---
id: ollama-context-length
title: Context length (Ollama docs)
author: Ollama
url: https://docs.ollama.com/context-length
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

A short Ollama page on the context window: the default now depends on how much GPU memory you have, a bigger window costs more memory, and `ollama ps` shows the context actually allocated and whether the model spilled onto the CPU.

## Key claims

- Default depends on VRAM. "Ollama defaults to the following context lengths based on VRAM: \< 24 GiB VRAM: 4k context; 24-48 GiB VRAM: 32k context; \>= 48 GiB VRAM: 256k context" (Note at top)
- Big tasks need more. "Tasks which require large context like web search, agents, and coding tools should be set to at least 64000 tokens." (intro)
- Memory cost. "Setting a larger context length will increase the amount of memory required to run a model." (Setting context length)
- Check the real value. "For best performance, use the maximum context length for a model, and avoid offloading the model to CPU. Verify the split under `PROCESSOR` using `ollama ps`." The example output has a `CONTEXT` column (131072 for gemma4). (Check allocated context length and model offloading)

## Visuals worth redrawing

- None.

## My notes

- Contradicts the FAQ's flat 4096 default. The page doesn't say when the VRAM-based default was introduced.
