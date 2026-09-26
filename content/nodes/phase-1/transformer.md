---
id: transformer
title: What is a transformer?
depth: deep
phase: 1
note: >-
  The architecture behind LLMs: stacked attention and feed-forward layers. Concept level, no math derivations.
needs: [attention]
leads_to: [prefill-decode]
compare_with: []
updated: 2026-09-23
---

# What is a transformer?

The transformer is the network design inside GPT, Llama, DeepSeek and the
other LLMs you'll build on. It's a stack of identical blocks, and each block
does two things: let the tokens share information, then work on each token
by itself. You won't need to build one as an AI engineer, but its shape explains
a lot of what you'll pay for: why a prompt is read all at once, why answers come
out one token at a time, and why a "671 billion parameter" model can be
cheaper to run than its size suggests.

## One trip through the model

Follow one prompt through GPT-2 small (2019), a model small enough to run
in your browser and built from the same parts as today's LLMs:

> Data visualization empowers users to

1. **Split into tokens.** The text becomes a list of token ids from a
   vocabulary of 50,257. See [[tokenization]].
2. **Look up a vector for each token.** Each id picks a row of 768 numbers
   from the embedding table, its [[embeddings|embedding]]. Information about
   the token's position is added in, so the model knows the order.
3. **Run through 12 blocks.** Each block takes one vector per token and
   hands back one vector per token, same size, a little richer in meaning.
4. **Score every possible next token.** The last position's vector is
   turned into 50,257 scores, one per vocabulary token. [[softmax]] turns
   the scores into probabilities.
5. **Pick one, add it, repeat.** One token is chosen from those
   probabilities, appended to the text, and the whole trip runs again. This
   is the loop from [[next-token-prediction]].

![GPT-2 small from left to right. The prompt Data visualization empowers users to is split into tokens, each token becomes a vector of 768 numbers, all vectors go through 12 blocks of attention then MLP, only the last token's vector goes on to become 50,257 probabilities, one token is picked and appended to the text, and the loop starts again.](img/transformer-pipeline.svg)

Steps 1, 2 and 4 are the plumbing at each end. The interesting part is the
stack of blocks in step 3.

## Inside a block: attention, then a feed-forward network

Every block has the same two parts, in the same order.

**First, attention: the tokens talk to each other.** Each token looks back
at the earlier tokens and pulls in what it needs. After this step, the
vector for "users" carries some information about "data visualization".
How that works is in [[attention]].

**Second, a feed-forward network: each token thinks alone.** This part is
also called the MLP (multilayer perceptron). It takes each token's vector,
runs it through two layers, and hands it back. The tokens don't talk to
each other here. The same operation runs on every position in parallel. In
GPT-2 small, each vector is stretched from 768 numbers to 3,072, then
squeezed back to 768. One way to picture it: the MLP asks a long list of
questions about each vector and updates it based on the answers.

The two parts split the work. Attention moves information between
positions. The feed-forward network works on what each position now holds.

| | Attention | Feed-forward (MLP) |
|---|---|---|
| Looks at | This token and all earlier ones | This token only |
| Job | Move information between tokens | Transform each token's vector |
| Share of GPT-3's parameters | About a third | Most of the rest |

![One transformer block drawn as a column per token. In the attention band, arrows run from earlier tokens to later ones, never backward. In the MLP band above it, each column has its own identical box and nothing crosses between columns.](img/transformer-block.svg)

## The running total that holds it together

One detail makes the stacking work. Neither part replaces a token's vector.
Each one computes a change and **adds** it to the vector that came in.

Take "creature" in "a fluffy blue creature". Attention works out a change
that says roughly "fluffy and blue", and that change is added on top of the
plain vector for "creature". The MLP then adds its own change on top of
that. So you can think of each token as having one running vector that
flows up through the model: the embedding starts it off, and every layer
adds to it.

Those "add it back" shortcuts are called residual connections. They're what
made very deep networks trainable at all. Each block also has
normalization steps that keep training stable. You can treat both as
plumbing.

![Four tokens, a fluffy blue creature, each drawn as a vertical line running from embedding at the bottom to scores at the top. Along each line, attention and MLP boxes read from the line and add their result back with a plus sign. Attention boxes also take arrows from earlier tokens' lines; MLP boxes don't.](img/transformer-running-vector.svg)

## Stack the block many times

A single block can only do so much. So the block is copied, each copy with
its own learned weights, and stacked. Vectors come out of block 1 with a
bit of context, and block 2 works on those. By the top, the last token's
vector holds what the model needs to predict the next token.

| Model | Year | Blocks | Numbers per token vector | Parameters |
|---|---|---|---|---|
| Transformer (base) | 2017 | 6 (encoder) + 6 (decoder) | 512 | — |
| GPT-2 small | 2019 | 12 | 768 | 124 million |
| GPT-3 | 2020 | 96 | 12,288 | 175 billion |
| DeepSeek V3 | 2024 | 61 | — | 671 billion (37 billion used per token) |

That's the whole architecture: embed, a tall stack of attention-plus-MLP
blocks, score. The size of a model is mostly how many blocks it has and how
wide its vectors are. The hope, as the layers pile up, is that the vectors
can hold more abstract ideas about the text than the words themselves.

## The 2017 original isn't quite what LLMs run

The transformer was introduced in June 2017 in "Attention Is All You Need",
built for translation. It had two halves:

- An **encoder** reads the whole source sentence, with every word able to
  look at every other word.
- A **decoder** writes the translation one word at a time. It looks at
  the encoder's output and at the words it has already written, but never
  ahead.

Later models kept one half or both, and that gives three families:

| Family | Example | Good for |
|---|---|---|
| Encoder-only | BERT (2018) | Understanding: classifying sentences, finding names |
| Decoder-only | GPT (2018), GPT-2, GPT-3 | Generating text |
| Encoder-decoder | T5 (2019) | Tasks with an input and an output, like translation or summaries |

GPT-style LLMs are **decoder-only**. There is no separate encoder. Your prompt
and the model's answer are one sequence, read left to right, each token
seeing only what came before. Predicting the next token this way is called
causal language modeling.

This matters when you read about transformers. The standard diagram, from
the 2017 paper, shows both towers. For an LLM, keep only the decoder
side, and drop its link to the encoder.

## Why this design won

Before transformers, language models were mostly recurrent networks. They
read text one position after another, each step waiting for the previous
one. That made them slow to train, because the work couldn't be spread
across a GPU.

A transformer has no such chain inside a text. Attention compares all
positions at once, and the MLP runs on every position at once. The 2017
paper reached top translation quality after as little as twelve hours on
eight GPUs. And the path between any two words is a single attention step,
however far apart they are.

The same shape shows up in how long you wait for an answer. All
the tokens of your prompt can go through the stack together. The answer
can't: each new token needs the one before it, so the model runs the whole
stack once per output token. Those two phases have their own article,
[[prefill-decode]].

## What's changed since GPT-2

Less than you might expect. Comparing GPT-2 (2019) with open models from
2024 and 2025, the block is recognisably the same. The changes are mostly
swaps of parts:

- **Position information** is now usually added by rotating vectors
  (RoPE) instead of adding a learned position table.
- **Attention** mostly uses grouped-query attention, where heads share keys
  and values to save memory.
- **Normalization** moved to before each part instead of after it, which
  GPT and most later models do.
- **Mixture of experts.** Instead of one MLP per block, the block has many
  "expert" MLPs and a router that picks a few for each token. DeepSeek V3
  has 256 experts per MoE module and uses 9 per token, so only 37 billion of
  its 671 billion parameters do work on any one token.
- **Cheaper attention in some layers.** Since 2025, some models mix
  standard attention with cheaper variants that don't grow with the square
  of the prompt length. Qwen3-Next, for example, uses three cheap blocks
  for every standard one.

## Where it gets tricky

**Attention isn't the whole model.** It gets the name and the fame. In
GPT-3, the attention weights are just under 58 billion of the 175 billion
parameters, about a third. Most of the rest sit in the MLP blocks in
between.

**Total parameters aren't the work per token.** With mixture of experts, a model's
headline size and the work done per token come apart. DeepSeek V3 stores
671 billion parameters but runs 37 billion per token. Compare models on
both numbers.

**The core has barely moved, or has it?** One view: since GPT-2, labs have
polished the same block rather than replaced it. The other: the 2025 wave
of hybrid attention is a real change. It's not settled. MiniMax tried
linear attention and then went back to standard attention for its next
model, finding the cheap kind weak on reasoning and multi-turn tasks.

**What you can see is open-weight models.** Every architecture detail in
this article comes from a paper or an open model. Treat claims about what's
inside a closed model as guesses unless the lab published it.

**Many numbers here are old on purpose.** GPT-2 and GPT-3 are used because
their sizes were published. The design carries over to current open
models; the sizes don't.

## What this means when you build

- **Output tokens run the full stack, one at a time.** That's why long
  answers are slow. See [[prefill-decode]], and [[token-pricing]] for how
  that shows up on the bill.
- **Read model sizes with care.** For a mixture-of-experts model, look at
  active parameters as well as the total.
- **You can read an open model's config now.** Number of layers, vector
  width, heads, experts: these map straight onto the parts above. The
  architecture is the skeleton; a checkpoint is one set of trained weights
  for it.
- The stored keys and values that make token-by-token generation affordable
  are the [[kv-cache]].

## Further reading

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762),
  Vaswani et al. (Google), 2017. The original paper. Read it for the
  block structure and why dropping recurrence sped up training.
- [Transformers, the tech behind LLMs](https://www.3blue1brown.com/lessons/gpt),
  3Blue1Brown, 2024. A visual overview of a GPT from input to output, with
  GPT-3's real sizes.
- [Transformer Explainer](https://poloclub.github.io/transformer-explainer/),
  Cho et al. (Georgia Tech), 2024. GPT-2 running live in your browser; click
  into each part.
- [How do Transformers work?](https://huggingface.co/learn/llm-course/chapter1/4),
  Hugging Face LLM Course. Encoder-only vs decoder-only vs encoder-decoder,
  and a short history.
- [Attention in transformers, step-by-step](https://www.3blue1brown.com/lessons/attention),
  3Blue1Brown, 2024. How the attention half of each block adds its change
  to each token's vector, with GPT-3's heads, layers and parameter counts.
- [The Big LLM Architecture Comparison](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison),
  Sebastian Raschka, 2025 (updated 2026). What changed in open models since
  GPT-2, part by part.
