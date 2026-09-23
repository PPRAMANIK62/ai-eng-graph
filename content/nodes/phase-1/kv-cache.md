---
id: kv-cache
title: What is the KV cache?
depth: deep
phase: 1
note: >-
  Keeping attention results for past tokens so each new token doesn't redo the work.
needs: [attention, prefill-decode]
leads_to: []
compare_with: []
status: review
updated: 2026-09-23
---

# What is the KV cache?

When a model writes an answer, every new token needs to look back at all the
tokens before it. The KV cache stores the part of that work that never
changes, so the model doesn't redo it for every token. It makes generation
several times faster, and it's paid for in memory, which is why long
contexts and many users at once are expensive to serve.

## The waste it removes

Start with a three-word example. You give a model the prompt "Time". It
writes "flies". To write the next token, the simplest approach runs the
whole text so far, "Time flies", through the network again. Then it writes
"fast", and to get the token after that it runs "Time flies fast" through
again.

Each step recomputes everything for "Time", even though nothing about
"Time" has changed. For a 2,000-token prompt and a 500-token answer, that's
the prompt reprocessed 500 times over.

The KV cache fixes this. Compute the reusable parts for each token once,
store them, and on each new step only compute them for the one new token.

## Why keys and values, and not queries

Recall how [[attention]] works. Each token is turned into three vectors:

- a **query**: what this token is looking for
- a **key**: what this token offers to others
- a **value**: the information it passes on if it's picked

To write the next token, the model compares the newest token's query with
the keys of all earlier tokens, and uses the best matches to pull in their
values.

Now look at what each step actually needs:

- **The new token's query.** Only the newest token asks the question, so you
  need one fresh query per step.
- **Every earlier token's key and value.** These come from projecting each
  token with fixed learned weights. Once a token is in the text, its key and
  value stay the same for the rest of the generation.

So the old queries are never needed again, and the old keys and values never
change. That's exactly what gets cached: keys and values, hence "KV". The
cache has one entry per token, per layer of the network.

![Two panels for the prompt Time, generating flies then fast. Without a cache, each step recomputes keys and values for every token so far, and the repeated work is shaded red: 6 token computations in three steps. With a cache, keys and values for earlier tokens are read from the cache and only the newest token gets a fresh query, key and value: 3 computations.](img/kv-cache-recompute.svg)

## How it fits with prefill and decode

The cache lines up with the two stages of a call from [[prefill-decode]]:

1. **Prefill fills it.** The model reads the whole prompt in parallel and
   computes keys and values for every prompt token, in every layer. They go
   into the cache.
2. **Decode adds one entry per step.** For each new token, the model
   computes that token's query, key and value. The key and value are
   appended to the cache. The query is compared against all the cached keys.
3. **The cache is dropped when the request ends.** A new, unrelated prompt
   starts with an empty cache. If your own code forgets to clear it, the new
   prompt ends up attending to stale keys from the last one.

## How much faster it is

Without a cache, step t has to compute keys and values for all t tokens so
far, so the total work grows with the square of the length. With a cache,
each key and value is computed once, and the total work grows in step with
the length.

In one from-scratch test in 2025, a small model (124 million parameters)
wrote 200 tokens on a Mac Mini's CPU:

| | Time |
|---|---|
| Without KV cache | about 50.5 s |
| With KV cache | about 10.2 s |

About 5 times faster, on a small model and a short answer. The gain grows
with longer sequences, since there's more past work to skip.

## What it costs: memory

The cache has to sit in GPU memory, next to the model's weights, for as long
as the request runs. Its size is:

> batch size × sequence length × 2 (keys and values) × layers × hidden size × bytes per number

Everything in that formula is fixed by the model except two: how many
requests are running (batch size) and how long each one is (sequence
length). The cache grows in a straight line with both.

Some real numbers:

| Setup | KV cache size |
|---|---|
| Llama 2 7B, per token (16-bit) | about 0.5 MB |
| Llama 2 7B, one 4,096-token sequence | about 2 GB |
| A large model, batch of 512, 2,048 tokens each | about 3 TB, 3 times the model's own size |

The 7B model's weights are about 14 GB. On an NVIDIA A10 GPU, that leaves
room for about 19,230 tokens of cache in total. That could be four full-length
sequences at once, or many more short ones, but not both.

![Two bars for the 24 GB of memory on an NVIDIA A10 running Llama 2 7B. The model weights take a fixed 14 GB. The 10 GB left holds the KV cache: either 4 requests of 4,096 tokens, about 2.1 GB each, or about 38 requests of 500 tokens, about 0.26 GB each. Total cache room is about 19,230 tokens either way.](img/kv-cache-gpu-memory.svg)

This is the heart of it for serving. The weights are a fixed cost. The
cache is the cost that grows with every token of context and every extra
user. When memory runs out, the server can't fit more requests in a batch,
and batching is how it keeps the GPU busy during decode.

The cache also doesn't make long contexts cheap to read. Each new token
still has to read every cached key and value from memory. A longer context
means more to read for every single output token.

## Ways to make the cache smaller

**Share keys and values across heads.** Attention runs as many heads in
parallel, and normally each head has its own keys and values. Two changes
cut that down:

- **Multi-query attention (MQA)** uses one shared set of keys and values for
  all the heads. It speeds up decoding a lot, but can lower quality.
- **Grouped-query attention (GQA)** sits in between: a few shared sets, each
  used by a group of heads. Its 2023 paper found quality close to full
  multi-head attention at a speed close to MQA. An existing model can be
  converted with about 5% of its original training compute.

Fewer sets of keys and values means a smaller cache.

![Three diagrams, each with 8 query heads on top. Multi-head attention gives each query head its own key-value head, 8 in all. Grouped-query attention has 2 key-value heads, each shared by 4 query heads. Multi-query attention has 1 key-value head shared by all 8. Fewer key-value heads means less to store in the cache.](img/kv-cache-gqa.svg)

**Store it without waste.** Reserving one big block of memory per request,
sized for the longest possible answer, wastes a lot of it, and that waste
limits how many requests fit. PagedAttention, the idea behind the vLLM
serving engine (2023), stores the cache in small fixed-size pages, the way
an operating system manages memory. Waste drops to near zero, requests can
share pages, and throughput went up 2 to 4 times at the same latency, with
bigger gains for longer sequences and bigger models.

**Keep only recent tokens.** A sliding window keeps just the last N tokens in
the cache and drops older ones. It caps memory, but the model can no longer
look at anything that fell out of the window.

## Where it gets tricky

**It's only for generation.** The cache is used at inference, when the model
writes tokens one at a time. It isn't used in training.

**It doesn't cut the work of reading the prompt.** Prefill still processes
every prompt token once. The cache only stops that work from being repeated
at every decode step.

**The basic cache lasts one request.** It's built during a call and thrown
away at the end. Keeping cached work around and sharing it between
requests is a further step on top, which serving engines like vLLM support.

**Most of the numbers are from 2023.** The formula and the trade-off haven't
changed, but the models and GPUs in the examples are a few generations old.
The formula needs the model's layer count and sizes, so you can only work it
out for a model whose architecture you know.

## What this means when you build

- **Long context costs memory, not just input tokens.** Every token you keep in the
  window takes cache memory for the whole time the answer is being written.
  That's part of why long-context serving is expensive.
- **Output speed drops as context grows.** Each new token reads the whole
  cache, so a request with a huge context generates more slowly per token.
- **If you run your own model,** the KV cache, not the weights, often sets
  how many users and how much context one GPU can handle. Check how big it
  gets at your real batch size and context length.
- **Pick models with GQA or similar** when you self-host and memory is
  tight. They're built to keep the cache small.

## Further reading

- [Understanding and Coding the KV Cache in LLMs from Scratch](https://magazine.sebastianraschka.com/p/coding-the-kv-cache-in-llms),
  Sebastian Raschka, 2025. Readable code, the "Time flies fast" example,
  and a measured speedup.
- [Mastering LLM Techniques: Inference Optimization](https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/),
  NVIDIA, 2023. The size formula with a Llama 2 7B example, plus MQA, GQA and
  paging.
- [A guide to LLM inference and performance](https://www.baseten.co/blog/llm-transformer-inference-guide/),
  Baseten, 2025. Works out how many tokens of cache fit next to a 7B model
  on one GPU.
- [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180),
  Kwon et al., 2023. The vLLM paper: the KV cache as the memory problem in
  serving, and paging as the fix.
- [GQA: Training Generalized Multi-Query Transformer Models from Multi-Head Checkpoints](https://arxiv.org/abs/2305.13245),
  Ainslie et al. (Google), 2023. Why models share keys and values across
  heads.
- [Large Transformer Model Inference Optimization](https://lilianweng.github.io/posts/2023-01-10-inference-optimization/),
  Lilian Weng, 2023. Why inference is memory-hungry, with the 3 TB example.
