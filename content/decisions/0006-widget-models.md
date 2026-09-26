---
id: 0006-widget-models
title: Run the phase 1 widgets on open models in the reader's browser
phase: 1
status: proposed
date: 2026-09-26
replaced_by:
---

## What I had to decide

Phase 1 needs widgets that show a real model at work: how text splits into
tokens, what the next-token list looks like and how [[temperature]] and
[[top-p]] reshape it, and how long [[prefill-decode|prefill and decode]] take.
The site is public and I want to use open or free models, so whatever the
widgets call can't cost money per visitor or need a key in the browser.

## Options

- **Open models in the browser (Transformers.js).** Tokenizers and a small
  model are downloaded from the Hugging Face Hub and run on the reader's GPU
  (WebGPU) or CPU (WebAssembly). No server, no key, no per-visitor cost. The
  model returns its full logits, so temperature and top-p can be applied
  exactly. The costs are the download and the fact that a small model writes
  weak answers.
- **A free hosted API.** Free tiers have rate limits and need a key, so a
  public site needs a server in between plus a spend cap and rate limiter.
  Logprobs, where offered at all, are capped to a short top list.
- **Precomputed runs.** Run an open model once on my machine and ship the
  results as JSON. Free and fast, but readers can't try their own text.
- **My own inference server** (llama.cpp or Ollama). Full control, but
  something to host and pay for, and it needs the same abuse protection.

## What I measured

Sizes are from the Hugging Face Hub API, 2026-09-26. Timings are from the
production build in headless Chromium 152 on an Intel i5-13500H, which had no
WebGPU, so they're the WebAssembly fallback (q8 weights). WebGPU isn't measured
yet.

| What | Result |
|---|---|
| SmolLM2-135M-Instruct download | 118 MB (q4f16, WebGPU with f16), 182 MB (q4, WebGPU), 137 MB (q8, WebAssembly) |
| Tokenizer downloads | 2.1 MB (SmolLM2) to 20.3 MB (Gemma 3); all six are 57 MB |
| First model load, download included | 46 s |
| One next-token pass, 18 tokens | 191 ms |
| Timer, 40-token prompt, 64 out | first token 489 ms, then 54 ms per token |
| Timer, 1,072-token prompt, 64 out | first token 40.2 s, then 106 ms per token |

The long prompt took 40 s to the first token on the CPU, so I cut the timer's
filler context to about half that length. Time per token also doubled with the
long prompt, which the timer shows rather than hides.

The sampling math (softmax, temperature, top-p, weighted draw) has unit tests
in `components/widgets/sampling.test.ts`, including the softmax article's worked
example (logits 3, 2, 1 give 0.665, 0.245, 0.090).

## What I picked and why

Open models in the browser, through Transformers.js 4.3:

- **Tokenizers:** GPT-4o and GPT-4 (Xenova's ports of OpenAI's o200k and
  cl100k), Llama 3, Gemma 3, Qwen3 and SmolLM2, each loaded only when the
  reader picks it.
- **Model:** SmolLM2-135M-Instruct, the smallest of the ONNX builds I checked
  (SmolLM2 135M and 360M, Gemma 3 270M, Qwen2.5 0.5B, Qwen3 0.6B). The worker picks q4f16 on a GPU with f16 support,
  q4 on other GPUs, and q8 on the CPU, and falls back to the CPU if the GPU
  load fails.
- **Shape:** one web worker per tab, shared by every widget on the page, so the
  model downloads and loads once. It only starts when the reader clicks
  "Load the model"; nothing downloads with the page.

It's the only option with no running cost and no abuse problem, and the only
one that gives the full logit row.

## What I gave up

- **Answer quality.** A 135M model writes weak answers; it's here to show
  mechanics, not to be right.
- **Slow devices.** Without WebGPU, a long prompt takes tens of seconds to
  prefill. WebAssembly runs single-threaded here because the site doesn't send
  the cross-origin isolation headers multi-threading needs.
- **Real product numbers.** Timings are the reader's own hardware, not a
  provider's servers, so they show the shape of prefill and decode, not what
  an API would give.

What would change it: if I want readers to compare against a frontier model's
logprobs or speed, that's a server-side feature with a key, a spend cap and
rate limiting, which fits phase 6.
