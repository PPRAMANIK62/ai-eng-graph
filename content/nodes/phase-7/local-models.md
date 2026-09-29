---
id: local-models
title: How do you run a model locally?
depth: deep
phase: 7
note: >-
  Running an open model on your own machine: the tools, the memory it takes, the speed you get.
needs: [open-vs-closed-models]
leads_to: [quantization]
compare_with: []
updated: 2026-09-29
---

# How do you run a model locally?

Running a model locally means the weights of an open model sit on your own
machine, and a program on that machine turns your prompt into tokens. No API
key, no per-token bill, and nothing leaves the laptop. Whether it works comes
down to three things: enough memory to hold the model, enough memory
bandwidth to make it fast, and a few settings that quietly change what the
model sees.

## Three pieces: a file, an engine, a server

You need something you're allowed to download, which is where
[[open-vs-closed-models]] comes in: only open-weight models can run on your
machine. Take Llama 3.1 8B as the running example.

**The file.** Models are trained in PyTorch or similar, then converted for
local use. llama.cpp uses **GGUF**: one file that holds the weights plus
everything needed to load them, stored as key-value metadata. It's built to
be memory-mapped, so loading is fast. The file name tells you what's inside, for example
`Llama-3.1-8B-Instruct-Q4_K_M.gguf`: the model, its size, the fine-tune, and
the **encoding**, meaning how many bits each weight was squeezed into. That
last part is [[quantization]], and it decides most of what follows. Vision
models ship the image encoder as a second file, prefixed `mmproj`.

**The engine.** The one in the examples here is llama.cpp: plain C/C++ with no
dependencies, running on Apple's Metal, NVIDIA's CUDA, AMD's HIP, Vulkan, and
plain CPUs. It supports weights stored in 1.5 to 8 bits, and it can split a
model between CPU and GPU when the model is bigger than your GPU memory.

**The server.** Your app talks to the engine over HTTP. llama.cpp's
`llama serve -hf <repo>` downloads a GGUF from Hugging Face and starts an
OpenAI-compatible server in one command. Ollama wraps the same idea with
model downloads, a model manager and a server on `localhost:11434`. LM Studio
and vLLM are other options. There's no neutral comparison of these
tools, so this article doesn't rank them. The concepts below apply to all of
them; the examples use Ollama and llama.cpp because their docs are open and
specific.

## Will it fit? Memory comes first

A model has to fit in memory before speed matters. Two things take space:
the weights and the [[kv-cache]].

**The weights** are a fixed cost. Llama 3.1 8B in 16-bit is a 14.96 GiB
file. Quantized to Q4_K_M (about 4.9 bits per weight), it's 4.58 GiB. The
bigger models make the point harder. The table below is llama.cpp's own; it
doesn't say what precision its "original" sizes are, and the 8B one is about
twice the 16-bit file, so read them as 32-bit:

| Llama 3.1 | Original | Q4_K_M |
|---|---|---|
| 8B | 32.1 GB | 4.9 GB |
| 70B | 280.9 GB | 43.1 GB |
| 405B | 1,625.1 GB | 249.1 GB |

So a 70B model at 4 bits needs more than 43 GB of GPU or unified memory
before you've stored a single token of context. An 8B model at 4 bits needs
under 5.

**The KV cache** grows with the [[context-window]]. Every token of context
you allow reserves room for its keys and values. Raising the context length
raises the memory needed, and serving several requests at once multiplies
it: in Ollama, a 2K context with 4 parallel requests becomes an 8K context's
worth of memory. You can shrink the cache by quantizing it too. At 8 bits it
takes about half the memory of 16-bit with a very small loss; at 4 bits,
about a quarter, with a loss that shows more at long contexts.

**When it doesn't fit,** the engine spills layers onto the CPU and system
RAM. It still runs, just slower. In Ollama, `ollama ps` shows the split:
`100% GPU`, `100% CPU`, or something like `48%/52% CPU/GPU`. Ollama's own
advice is to avoid offloading to the CPU when you care about speed. With
several GPUs, a model that fits on one is kept on one, because moving data
across the PCI bus between cards costs time.

## How fast? Memory bandwidth sets the pace

Recall [[prefill-decode]]: a model reads your prompt all at once (prefill),
then writes one token at a time (decode). Each decoded token needs a full
read of the weights from memory. So decode speed is set mostly by how fast
memory can be read, not by how fast the chip can calculate.

You can see this in measurements. llama.cpp keeps a community benchmark
thread for Apple chips, where everyone runs the same test on Llama 2 7B with
one fixed 2023 build. Here is text generation (decode) speed against each
chip's memory bandwidth:

![Scatter chart of text generation speed against memory bandwidth for Apple M-series chips running Llama 2 7B with llama.cpp. At 4-bit (Q4_0): M1 at 68 GB/s makes 14 tokens per second, M2 at 100 GB/s 22, M4 at 120 GB/s 24, M3 Pro at 150 GB/s 31, M2 Pro at 200 GB/s 38, M4 Pro at 273 GB/s 51, M2 Max at 400 GB/s 61, M4 Max at 546 GB/s 83, M2 Ultra at 800 GB/s 94. At 16-bit (F16) every chip is much slower: M2 Ultra 41, M4 Max 32, M2 Max 24, M2 Pro 12. Speed rises with bandwidth in both cases.](img/local-models-bandwidth.svg)

Two things stand out.

**Speed tracks bandwidth.** Going from 68 GB/s (M1) to 800 GB/s (M2
Ultra) takes 4-bit decode from 14 to 94 tokens per second. The 16-bit
version of the same model is much slower on every chip, because it has more
bytes to read per token.

**More compute barely helps decode.** Two M2 Ultra configurations have the
same 800 GB/s but 60 or 76 GPU cores. The extra cores make prompt processing
24% faster (1,129 to 1,402 tokens per second at 16-bit) but decode only 3%
faster (39.9 to 41.0).

You can sanity-check a number with arithmetic. As a worked example, the
16-bit Llama 2 7B file in this test is 12.55 GiB, about 13.5 GB. Reading
13.5 GB at 800 GB/s takes about 17 ms, so the ceiling is about 59 tokens per
second. The measured 41 sits under that ceiling, as it should: real kernels
don't reach full bandwidth.

These are community measurements, not a spec. They come from one build of
llama.cpp from 2023-11. Newer builds are faster: the same M2 Ultra went from
94 to 109 tokens per second at 4 bits by 2024-11. Your hardware and version
will give different numbers, but the shape holds.

**Prefill is the other half, and it follows compute.** It matters for RAG,
where prompts are long. On the base M1, 4-bit prompt processing ran at
about 118 tokens per second, so a 4,000-token prompt (a made-up example) takes over half a
minute before the first token appears. On the M2 Ultra, at about 1,240 tokens
per second, it takes about 3 seconds. That wait is your
[[time-to-first-token]], and on small machines it's often the thing users
notice most.

## Calling it from your code

Both llama.cpp's server and Ollama speak the OpenAI API format, so existing
code often works after changing one line. With the OpenAI SDK and Ollama, you set the base URL
to `http://localhost:11434/v1/` and pass any string as the API key (it's
required by the SDK but ignored).

"Compatible" doesn't mean identical. As of 2026-09, Ollama's
OpenAI-compatible chat endpoint doesn't support:

- [[logprobs]], so anything built on token probabilities won't work;
- `tool_choice`, so you can offer tools (see [[tool-calling]]) but can't force one;
- image URLs (send images as base64 instead);
- `n`, `logit_bias` and `user`.

There's also no field for context length in the OpenAI format. To change it
for code that uses the OpenAI SDK, you create a derived model with a
`Modelfile` (`PARAMETER num_ctx 16384`, then `ollama create`) and call that
model's name. Or set `OLLAMA_CONTEXT_LENGTH` for the whole server.

One more default to know: Ollama unloads a model after 5 minutes idle. The
next request then waits for it to load again. The `keep_alive` parameter (or
`OLLAMA_KEEP_ALIVE`) changes this; `-1` keeps it loaded.

## The context-length trap

This is the setting most likely to break a local RAG system without anyone
noticing.

A model might support 128K tokens of context, but the server decides how
much it actually allocates, and the default is small. Ollama's FAQ says
4,096 tokens. Say your [[rag]] chat keeps the whole conversation, with
retrieved chunks added on each turn. After a few turns it no longer fits.

![Diagram of a long conversation sent to a model loaded with Ollama's default context window of 4,096 tokens. The messages run from oldest to newest. The conversation is longer than the window, so the oldest messages are dropped from the front and only the newest ones that fit are kept. The request still returns an answer, with no error and no field in the response saying anything was cut.](img/local-models-context-trap.svg)

What happens then isn't an error. A bug report filed on the Ollama repo on
2026-02-14, still open, describes it: when a conversation exceeds the
context length, Ollama drops the oldest messages from the front, the API
response carries no sign of it, and the only trace is a debug-level log
line. The embeddings endpoint truncates long inputs by default too. The
model answers without the earliest turns, and the answer just looks worse.

The fix is simple once you know: set the context length on purpose, and
check it. `ollama ps` shows a `CONTEXT` column with what was actually
allocated. Ollama suggests at least 64,000 tokens for agents, coding tools
and web search. Remember the memory cost from above: a bigger window means a
bigger KV cache.

## Where it gets tricky

**The docs disagree with each other.** As of 2026-09, Ollama's docs give
three different defaults: 4,096 tokens in the FAQ; a default that depends on
GPU memory on the context-length page (4K under 24 GiB, 32K from 24 to 48
GiB, 256K at 48 GiB or more); and 2,048 in the Modelfile reference table. They can't all be
right for your version, so don't trust any of them: read the `CONTEXT`
column in `ollama ps` for your setup.

**Silent truncation is a user report, not documented behaviour.** The
front-dropping comes from an open GitHub issue, not from Ollama's docs. It
may change. That's another reason to count tokens on your side and compare
against the window before sending.

**Benchmarks are narrow.** The bandwidth data above is from Apple chips,
one 7B model, and a 2023 build. It shows the relationship clearly, but it
won't predict your exact speed on an NVIDIA card or a newer build. Measure
on your own machine.

**No tool comparison to lean on.** We found no neutral comparison of
Ollama, LM Studio, llama.cpp's own server and vLLM. Pick one by what your
build needs (an OpenAI-compatible endpoint, the features in the list above,
how it handles several requests at once) and test it.

**Compatibility lists are a snapshot.** The list of unsupported fields above
is from 2026-09. If your code depends on a field, test that it works rather
than assuming it does.

## What this means when you build

- Check the memory budget first: weight file size plus KV cache for your
  context length, times the number of parallel requests.
- Keep the model fully on the GPU if you care about speed. Check with
  `ollama ps`.
- Expect decode speed to follow memory bandwidth. For long RAG prompts,
  measure time to first token too, because prefill follows compute.
- Set the context length explicitly and verify it. Count your prompt tokens
  and fail loudly if they exceed the window.
- Point your existing OpenAI SDK code at the local endpoint, then test every
  feature you rely on (logprobs, forced tool calls, image URLs).
- Choose the bit width with [[quantization]] in mind: it's the main lever on
  both memory and speed.

## Further reading

- [llama.cpp](https://github.com/ggml-org/llama.cpp), ggml-org. The engine
  itself: supported hardware, bit widths, CPU+GPU split, and the one-line
  OpenAI-compatible server.
- [GGUF](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md),
  ggml-org. The spec for the single-file model format, and how to read a
  model's file name.
- [llama.cpp quantize README](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md),
  ggml-org. File sizes and speeds for Llama 3.1 at every quantization
  level.
- [Performance of llama.cpp on Apple Silicon M-series](https://github.com/ggml-org/llama.cpp/discussions/4167),
  Georgi Gerganov and contributors, 2023 and still updated. Community
  measurements of prompt and generation speed against memory bandwidth.
- [FAQ](https://docs.ollama.com/faq), Ollama docs. The practical settings:
  context size, GPU/CPU split, keep-alive, parallel requests, KV cache
  quantization.
- [Context length](https://docs.ollama.com/context-length), Ollama docs. The
  VRAM-based default and how to check the allocated context.
- [OpenAI compatibility](https://docs.ollama.com/api/openai-compatibility),
  Ollama docs. Pointing OpenAI SDK code at a local model, and what isn't
  supported.
- [Chat history and embedding truncation happens silently](https://github.com/ollama/ollama/issues/14259),
  GitHub issue, 2026. A user report of prompts cut from the front with no
  signal to the caller.
