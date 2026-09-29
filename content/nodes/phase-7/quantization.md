---
id: quantization
title: What is quantization?
depth: deep
phase: 7
note: >-
  Storing weights in fewer bits: smaller and faster, with some quality lost.
needs: [local-models]
leads_to: []
compare_with: [vector-index, lora]
updated: 2026-09-29
---

# What is quantization?

Quantization stores a model's weights in fewer bits: 8 or 4 instead of 16.
The model gets roughly two to three times smaller, and because generating text is
mostly waiting on memory, it also gets faster. You pay with some quality.
How much depends on two things: how many bits you keep, and how cleverly the
rounding is done.

## Rounding weights onto a small grid

A weight in a trained model is a 16-bit number like 0.0213 or −0.1187. A
4-bit number can only take 16 different values. Quantizing means mapping
every weight onto one of those 16 levels.

The simplest way works on small groups of weights at a time. Take a block of
32 neighbouring weights:

1. Find a **scale** for the block, so the weight furthest from zero lands
   on the top or bottom level.
2. Divide each weight by the scale and round to the nearest level. Each
   weight is now a 4-bit integer.
3. Store the 32 integers plus the one scale.

To use a weight, the engine multiplies the integer back by the scale. You
get something close to the original, not the original: the gap is the
rounding error. That's the whole trick, and it has a name, **round-to-nearest**
(RTN). llama.cpp's `Q4_0` format is exactly this: blocks of 32 weights, each
rebuilt as integer times block scale.

![Diagram of round-to-nearest quantization on one block of eight example weights. The weights, such as 0.021, −0.118 and 0.074, are divided by a single block scale and rounded to the nearest of 16 levels, giving small integers from −8 to 7. To use them, each integer is multiplied back by the scale. The rebuilt values are close to the originals but not equal; the difference is the rounding error. A second row shows the same block with one large outlier weight: the scale stretches to fit it, and the other weights collapse onto just a few levels, so their error grows.](img/quantization-rounding.svg)

**Why blocks.** One scale per block means one unusually large weight only
hurts its own block. It stretches that block's scale, and the ordinary
weights next to it get squeezed onto a few levels. Large language models do
have such outliers. The 2022 LLM.int8() paper found a few systematic outlier features with very large values that dominate how the model
behaves, and plain 8-bit rounding broke on them. Its fix kept those few
dimensions in 16-bit and ran more than 99.9% of the math in 8-bit, which
halved memory with no loss even at 175B parameters.

**Why "4-bit" files aren't 4 bits.** The scales take space too. llama.cpp's
newer "K-quant" formats group blocks into super-blocks and store a small scale
(sometimes also a minimum) per block, so `Q4_K` comes to 4.5 bits per weight and `Q6_K` to
6.56. A file labelled `Q4_K_M` mixes types across tensors and averages 4.89
bits per weight. The older `Q4_0` and `Q8_0` are now marked legacy.

## What you get: smaller files, faster decode

Here is one model, Llama 3.1 8B, at each quantization level in llama.cpp:

![Two bar charts for Llama 3.1 8B in llama.cpp at five quantization levels. File size: F16 14.96 GiB, Q8_0 7.95, Q6_K 6.14, Q4_K_M 4.58, Q2_K 2.95. Text generation speed: F16 29 tokens per second, Q8_0 51, Q6_K 59, Q4_K_M 72, Q2_K 80. Prompt processing barely changes, from 923 tokens per second at F16 to between 784 and 865 for the quantized types.](img/quantization-size-speed.svg)

Going from 16-bit to Q4_K_M cuts the file from 14.96 GiB to 4.58 GiB, and
generation speed goes from 29 to 72 tokens per second. Prompt processing
barely moves.

That pattern comes straight from [[prefill-decode]]. Decode reads every
weight once per token, so its speed is set by how many bytes it has to move.
Fewer bits per weight, fewer bytes, faster tokens. Prefill processes the
whole prompt in one pass and is limited by arithmetic, so smaller weights
don't help it much. [[local-models]] shows the same thing from the hardware
side: decode speed tracks memory bandwidth.

The gain flattens out at the bottom. Below about 4 bits, llama.cpp's table
shows generation speed mostly staying between about 70 and 80 tokens per
second while quality keeps dropping (more on that below).

The same logic applies on servers. A 2024 study of Llama 3.1 in vLLM found
that 4-bit weights with 16-bit activations (written **W4A16**) cut latency by
1.5 to 2.5 times and cost per query by 2 to 3 times for the 8B and 70B
models, when requests are served one at a time. The 405B model met its speed
targets on 4 GPUs instead of 16. Under heavy batching, though, formats that
quantize both weights and activations to 8 bits (**W8A8**) gave the highest
throughput. Quantizing weights speeds up decode by moving less data;
quantizing activations too speeds up the arithmetic, which is what batched
serving and long prompts are limited by.

## Smarter than rounding: GPTQ, AWQ and importance matrices

Plain rounding treats every weight the same. The methods people actually
use don't. GPTQ and AWQ look at a small sample of text, called **calibration
data**, to see how the model uses its weights, and use that to decide how to
round.

**GPTQ** (2022) corrects for rounding error as it goes: when rounding adds
error, it adjusts other weights to compensate. To decide how, it uses
second-order information about how sensitive the model's output is to each
weight. It quantized 175B-parameter models to 3 or 4 bits in about four GPU
hours with little loss.

**AWQ** (2023) starts from the observation that about 1% of weights matter
far more than the rest, and that you find them by looking at the size of the
activations flowing through them, not at the weights themselves. It scales
those important channels up before rounding, so they lose less precision,
without storing anything in a mixed format. It needs no backpropagation, so
it's less likely to overfit the calibration data.

**Importance matrices** are llama.cpp's version of the same idea: a file,
passed to the quantizer with `--imatrix`, that tells it which weights matter
most so it loses less quality. The low-bit "I-quants" like `IQ2_XXS` are
built on it.

Calibration data matters more than it sounds. In the 2024 Llama 3.1 study,
random tokens were enough to calibrate 8-bit on the 8B model, but at
4-bit they hurt accuracy, so the
authors used a curated dataset instead.

## How much quality you lose

This is where the bit width and the method meet. A 2024 study quantized
LLaMA3-8B with ten methods and measured perplexity, where lower is better:

![Grouped bar chart of WikiText2 perplexity for LLaMA3-8B, lower is better. The 16-bit model scores 6.1. At 4 bits: round-to-nearest 8.5, GPTQ 6.5, AWQ 6.6. At 3 bits: round-to-nearest 27.9, GPTQ 8.2, AWQ 8.2. At 2 bits all three are far off the chart: round-to-nearest about 1,900, GPTQ about 210, AWQ about 1.7 million.](img/quantization-perplexity.svg)

- **At 4 bits,** GPTQ and AWQ stay close to the 16-bit model (6.5 and 6.6
  against 6.1). Plain rounding is visibly worse (8.5).
- **At 3 bits,** plain rounding falls apart (27.9) while GPTQ and AWQ hold at
  8.2.
- **At 2 bits,** everything breaks. Perplexities run into the hundreds,
  thousands and millions.

A different study, from 2024 and revised in 2026, looked at Llama 3.1
Instruct in 8B, 70B and 405B with more than 500,000 evaluations, including
real tasks like chat, coding and long context. With carefully tuned methods:

- FP8 (8-bit floating point) was effectively lossless.
- INT8 lost 1 to 3%.
- INT4 weights (GPTQ, tuned) kept 99.4% of the 16-bit score on academic
  benchmarks and 98.9% on coding. The worst task on those academic
  benchmarks kept 96.9%.

Model size matters too. In the LLaMA3 study, the 70B model held up much
better at low bit widths than the 8B. In the Llama 3.1 study's reasoning tests,
the smallest distilled reasoning models lost the most at 4 bits.

## Where it gets tricky

**Two studies, two headlines.** One finds that 4-bit weights rival 8-bit on
Llama 3.1. The other finds that LLaMA3 still loses a noticeable amount of
quality, especially at very low bit widths. They mostly agree once you
line them up by method and bit width. The pessimistic result includes plain
rounding, which is poor at 4 bits and broken at 3, and its warning is mostly
about 3 bits and below. The optimistic one used GPTQ at 4 bits, tuned with
better clipping and real calibration data, and tested on real tasks as well
as perplexity. The optimistic authors also argue that untuned settings in
other studies make losses look bigger than they need to be. When you quote a number, say
which method and how many bits.

**GPTQ vs AWQ isn't settled.** AWQ's own paper and the LLaMA3 study
favoured AWQ or found a tie. The Llama 3.1 study found them tied on academic
benchmarks but GPTQ ahead on real tasks, especially coding, once GPTQ was
tuned. The honest summary is that setup matters as much as the method's name.

**Perplexity isn't your task.** Most published numbers are perplexity or
multiple-choice benchmarks. A drop that looks small there can matter more
for your use, or less. Run your own [[evals]] on the quantized model before
you switch.

**Weights, activations and the KV cache are separate choices.** Most local
formats quantize only the weights. Quantizing activations too is harder: in
the LLaMA3 study, 8-bit weights and activations were fine but 4-bit
collapsed. The [[kv-cache]] can be quantized separately (see
[[local-models]]), and the Llama 3.1 study didn't test it at all.

**Don't quantize twice.** Re-quantizing a file that's already quantized can
severely reduce quality, and llama.cpp warns about it. Always start from the 16- or
32-bit original.

**Keep the small parts precise.** Vision encoders that ship next to a model
are usually kept at 16 or 8 bits. They're small, so shrinking them saves
little, and errors there feed straight into everything the model sees.

**Fine-tuning won't easily win it back.** In the LLaMA3 study, adding
[[lora]] fine-tuning on a small general dataset after quantizing made the
8B model worse, not better.

**A different "quantization".** The [[vector-index]] and [[pgvector]]
articles use the same word for compressing embedding vectors in a search
index. Same idea of fewer bits, different thing being compressed.

## What this means when you build

- For running locally, a 4-bit K-quant like `Q4_K_M` is the usual starting
  point: about a third of the 16-bit size and more than twice the decode
  speed of 16-bit, with a small loss when made well.
- Go below 4 bits only if the model doesn't fit otherwise, and test it hard.
  At 3 bits the method matters a lot; at 2 bits most models break.
- Prefer files made with GPTQ, AWQ or an importance matrix over plain
  rounding.
- If the model barely fits at 4 bits, compare it with a smaller model at 8
  bits on your own eval set.
- For a server under heavy batching, 8-bit weights and activations can beat
  4-bit weights. For one-at-a-time requests, 4-bit weights usually win.
- Always measure on your own task. Published numbers are for specific
  models, methods and benchmarks.

## Further reading

- [LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale](https://arxiv.org/abs/2208.07339),
  Tim Dettmers et al., 2022. Why outlier features break naive rounding, and
  the mixed-precision fix.
- [GPTQ: Accurate Post-Training Quantization for Generative Pre-trained Transformers](https://arxiv.org/abs/2210.17323),
  Elias Frantar et al., 2022. Rounding with error correction; 3 to 4 bits on
  175B models.
- [AWQ: Activation-aware Weight Quantization for LLM Compression and Acceleration](https://arxiv.org/abs/2306.00978),
  Ji Lin et al. (MIT Han Lab), 2023, revised 2026. Protecting the 1% of
  weights that matter, found from activations.
- ["Give Me BF16 or Give Me Death"? Accuracy-Performance Trade-Offs in LLM Quantization](https://arxiv.org/abs/2411.02355),
  Eldar Kurtic et al. (Red Hat), 2024, revised 2026. The
  largest accuracy study on Llama 3.1, plus when 4-bit or 8-bit serves
  faster.
- [An empirical study of LLaMA3 quantization: from LLMs to MLLMs](https://arxiv.org/abs/2404.14047),
  Wei Huang et al., 2024. Ten methods from 1 to 8 bits on LLaMA3, showing
  where plain rounding and smarter methods break.
- [llama.cpp quantize README](https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md),
  ggml-org. How to quantize a GGUF, and measured size and speed for every
  type on Llama 3.1 8B.
- [GGUF](https://huggingface.co/docs/hub/gguf), Hugging Face Hub docs. What
  each llama.cpp quantization type stores and its bits per weight.
