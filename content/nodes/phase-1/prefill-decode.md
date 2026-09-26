---
id: prefill-decode
title: What are prefill and decode?
depth: deep
phase: 1
note: >-
  The two stages of a call: read the whole prompt at once, then write one token at a time.
needs: [transformer, next-token-prediction]
leads_to: [kv-cache, token-pricing, streaming]
compare_with: []
status: review
updated: 2026-09-23
---

# What are prefill and decode?

Every call to an LLM runs in two stages. First the model reads your whole
prompt at once (**prefill**), then it writes the answer one token at a time
(**decode**). The two stages use the hardware in opposite ways, and that
explains most of what you'll notice about speed: why the first word takes a
moment, why long answers are slow, and why a long prompt costs less time
than you'd expect.

## One request, two stages

Take a request with a 2,000-token prompt that gets a 500-token answer.

**Prefill.** The model takes all 2,000 prompt tokens and runs them through
the network together, in parallel. Along the way it works out the
intermediate results for every prompt token that later steps will need. At
the end of prefill, it has the first output token.

**Decode.** Now the model writes the other 499 tokens, one at a time. Each
new token needs a pass through the network, and each pass has to wait for
the token before it. There's no way to write token 300 before token 299
exists. This is the loop from [[next-token-prediction]]: each new token is
added to the text and fed back in to get the next one. The name for that is
autoregressive.

So the prompt goes in as one big batch of work, and the answer comes out as
499 small steps in a row.

![A timeline for one request drawn to scale. Prefill, all 2,000 prompt tokens at once, is a thin block of half a second that ends at the first token. Decode follows as 499 thin ticks of 20 ms each, filling the rest of the roughly 10.5 seconds. Below: total time equals TTFT plus TPOT times the number of output tokens.](img/prefill-decode-timeline.svg)

The network itself is the same in both stages. What's inside it, the stack
of layers, is covered in [[transformer]]. What changes is how much work each
pass gets to do at once.

## Two numbers for speed

Because the stages are so different, speed is measured with two numbers:

- **Time to first token (TTFT):** how long until the first token of the
  answer appears. This is mostly prefill.
- **Time per output token (TPOT):** how long each token after that takes.
  This is decode.

Total response time is roughly:

$$
\text{total time} = \text{TTFT} + \text{TPOT} \times \text{output tokens}
$$

With made-up but realistic numbers for our request, say a TTFT of half a
second and a TPOT of 20 ms, that's 0.5 s + 499 × 0.02 s, about 10.5 seconds.
Prefill is a small slice of that. The answer length drives the rest.

Flip TPOT around and you get the speed a user sees: a TPOT of 100 ms is 10
tokens per second.

This split is why answers are usually sent to you as they're produced,
covered in [[streaming]]. You can't make decode faster by waiting, but you
can show the first tokens as soon as prefill is done.

## Why decode is the slow part

Prefill and decode do the same kind of math. The difference is how much of
it they do per trip to memory.

A GPU has two limits: how fast it can calculate, and how fast it can read
from its memory. The model's weights live in memory, and every pass through
the network has to read all of them.

**In prefill,** one read of the weights is used for thousands of tokens at
once. The GPU does a lot of math for every byte it reads, so it runs close
to its full calculating speed. Prefill is **compute-bound**.

**In decode,** one read of the weights produces one token. The GPU finishes
the math quickly and then waits for the next batch of data from memory.
Decode is **memory-bound**: its speed is set by how fast the weights can be
moved, not how fast the GPU can calculate.

Here are the numbers on a real, if older, GPU:

| | Value |
|---|---|
| NVIDIA A10 calculating speed | 125 trillion operations per second |
| A10 memory bandwidth | 600 GB per second |
| Operations the A10 can do per byte read | about 208 |
| Operations Llama 2 7B does per byte during decode | about 62 |

Decode asks for about 62 operations per byte, while the GPU could do about
208. Most of the calculating power sits idle.

You can estimate decode speed from memory alone. A 7-billion-parameter model
at 2 bytes per parameter is 14 GB of weights. Reading 14 GB at 600 GB/s
takes about 23 ms, so that's about the fastest one token can come out on an
A10, whatever the math costs.

Run it the other way round. If a 7B model in 16-bit manages 14 ms per token,
the hardware is moving 14 GB of weights every 14 ms, about 1 TB per second.
That's why faster decode mostly means more memory bandwidth, not more
calculating power.

![A number line of operations per byte read from memory. Decode for Llama 2 7B sits at about 62. The NVIDIA A10 can do about 208 operations per byte. Everything left of 208 is memory-bound, waiting on memory; everything right is compute-bound, waiting on math. Prefill sits far off to the right.](img/prefill-decode-ops-per-byte.svg)

## What this means for input vs output

Because prefill handles prompt tokens in parallel and decode handles output
tokens one at a time, the two kinds of token cost very different amounts of
time. In one set of measurements, adding 512 tokens to the prompt added less
latency than generating 8 more tokens of output. Output length dominates how
long a response takes.

That gap between input and output shows up in prices too, covered in
[[token-pricing]].

## How servers make decode efficient

A single request in decode leaves most of the GPU idle. Servers fix that by
**batching**: running many users' requests through the same pass, so one
read of the weights serves many tokens. That raises total throughput, but
each request gets a bit slower. In one measurement, a batch of 64 gave 14
times the throughput at 4 times the latency.

Decode also doesn't redo the work for the prompt at every step. The
intermediate results from prefill are stored and reused, which is the
[[kv-cache]]. Those stored results also have to be read from memory for each
new token, which adds to the memory load of decode.

## Where it gets tricky

**Serving systems disagree on whether to keep the stages together.** Mixing
prefill and decode on the same GPUs means they get in each other's way. A new
user's long prompt can hold up the tokens other users are waiting for. There
are two opposite fixes:

- **Split them.** Run prefill and decode on different machines, each sized
  for its job. Splitwise (Microsoft, 2023) found decode doesn't need the
  calculating power of the newest GPUs, and got 1.4x the throughput at 20%
  lower cost. DistServe (2024) served up to 7.4x more requests within its
  latency targets this way.
- **Keep them together, but chop up prefill.** Sarathi-Serve (2024) cuts each
  prompt into chunks and fits them in around the decode steps, so decode
  never stalls. It reported 2.6x to 5.6x more serving capacity, depending on
  the model and setup.

As a user of an API you don't pick either. But it's why a provider's time to
first token and tokens per second can move independently.

**The numbers here are old.** The A10, Llama 2 7B and the latency
measurements come from 2023 to 2025 posts. Newer GPUs have more bandwidth
(NVIDIA's H100 has 2.15 times the A100's), and the exact milliseconds are
different. The shape isn't: prefill is
parallel and compute-bound, decode is sequential and memory-bound.

**"Long prompts are free" goes too far.** Input tokens are much cheaper in
time than output tokens, but not free. Prefill still has to process every
one of them, so a very long prompt does push up time to first token.

## What this means when you build

- **Measure both numbers.** Track time to first token and tokens per second
  separately. They answer different questions: "does it feel responsive?"
  and "how long until it's done?".
- **Shorten the output first.** If a response is too slow, cutting the answer
  length helps far more than cutting the prompt.
- **Stream long answers.** Show tokens as they arrive so the user isn't
  staring at a blank screen for the whole decode.
- **Expect variation.** A shared server batches your request with others,
  trading each request's speed for total throughput, so the same request
  won't always take the same time.

## Further reading

- [LLM Inference Performance Engineering: Best Practices](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices),
  Databricks, 2023. The clearest intro: prefill and decode, TTFT and TPOT,
  the latency formula, and why output length dominates.
- [A guide to LLM inference and performance](https://www.baseten.co/blog/llm-transformer-inference-guide/),
  Baseten, 2025. Works through the GPU arithmetic that makes decode
  memory-bound.
- [Mastering LLM Techniques: Inference Optimization](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/),
  NVIDIA, 2023. Prefill and decode in terms of GPU work, plus batching.
- [Splitwise: Efficient generative LLM inference using phase splitting](https://arxiv.org/abs/2311.18677),
  Patel et al. (Microsoft), 2023. Evidence that the two stages want
  different hardware.
- [DistServe](https://arxiv.org/abs/2401.09670), Zhong et al., 2024. Ties
  TTFT to prefill and TPOT to decode, and splits them across GPUs.
- [Sarathi-Serve](https://arxiv.org/abs/2403.02310), Agrawal et al., 2024.
  The opposite design: keep the stages together and chunk the prefill.
