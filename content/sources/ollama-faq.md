---
id: ollama-faq
title: FAQ (Ollama docs)
author: Ollama
url: https://docs.ollama.com/faq
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Ollama's FAQ covers the settings you trip over when running models locally: the context window size and how to change it, checking whether a model sits on the GPU, CPU or both, how long a model stays loaded, running several models or requests at once, and shrinking the KV cache with quantization.

## Key claims

- Default context. "By default, Ollama uses a context window size of 4096 tokens." (How can I specify the context window size?)
- How to raise it: the `OLLAMA_CONTEXT_LENGTH` environment variable, `/set parameter num_ctx` in `ollama run`, or `"options": {"num_ctx": ...}` in the API. (same)
- `ollama ps` shows where the model was loaded. "`48%/52% CPU/GPU` means the model was loaded partially onto both the GPU and into system memory" (How can I tell if my model was loaded onto the GPU?)
- Example: `llama3:70b` shown at 42 GB, 100% GPU. (same)
- Models stay loaded 5 minutes by default. "By default models are kept in memory for 5 minutes before being unloaded." `keep_alive` changes it; -1 keeps it loaded, 0 unloads. (How do I keep a model loaded in memory...)
- Parallel requests multiply the context. "Parallel request processing for a given model results in increasing the context size by the number of parallel requests. For example, a 2K context with 4 parallel requests will result in an 8K context and additional memory allocation." (How does Ollama handle concurrent requests?)
- "Required RAM will scale by `OLLAMA_NUM_PARALLEL` \* `OLLAMA_CONTEXT_LENGTH`." Default `OLLAMA_NUM_PARALLEL` is 1. (same)
- Multi-GPU: a model that fits on one GPU goes on one GPU; this "typically provides the best performance as it reduces the amount of data transferring across the PCI bus during inference." (How does Ollama load models on multiple GPUs?)
- Quantized KV cache (needs Flash Attention), set with `OLLAMA_KV_CACHE_TYPE`, global for all models. "`q8_0` - 8-bit quantization, uses approximately 1/2 the memory of `f16` with a very small loss in precision" and "`q4_0` - 4-bit quantization, uses approximately 1/4 the memory of `f16` with a small-medium loss in precision that may be more noticeable at higher context sizes." (How can I set the quantization type for the K/V cache?)

## Visuals worth redrawing

- None.

## My notes

- The FAQ's 4096 default disagrees with the Context length page (VRAM-based: 4k under 24 GiB, 32k at 24–48 GiB, 256k at 48 GiB or more) and with the Modelfile reference table ("Default: 2048"). Ollama's own docs contradict each other; check `ollama ps`.
