---
id: ollama-openai-compat
title: OpenAI compatibility (Ollama docs)
author: Ollama
url: https://docs.ollama.com/api/openai-compatibility
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Ollama serves an OpenAI-style API at `http://localhost:11434/v1/`, so code written for the OpenAI SDK can point at a local model by changing the base URL. The page lists which features and request fields work and which don't, and how to change the context size given that the OpenAI API has no field for it.

## Key claims

- Point the SDK at localhost. `base_url='http://localhost:11434/v1/'` with `api_key='ollama',  # required but ignored` (examples)
- Chat completions support streaming, JSON mode, vision, tools; "[ ] Logprobs" is unchecked. (Supported features)
- Unsupported request fields on chat completions include `tool_choice`, `logit_bias`, `user`, `n`. (Supported request fields)
- Images: base64 is supported, "[ ] Image URL" is not. (same)
- No context field. "The OpenAI API does not have a way of setting the context size for a model. If you need to change the context size, create a `Modelfile` which looks like:" `PARAMETER num_ctx <context size>` then `ollama create mymodel`. (Setting the local context size)

## Visuals worth redrawing

- None.

## My notes

- Matters for the phase 7 eval: code using the OpenAI SDK can't pass num_ctx per request.
