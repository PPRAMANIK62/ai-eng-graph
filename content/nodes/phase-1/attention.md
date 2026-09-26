---
id: attention
title: What is attention?
depth: deep
phase: 1
note: >-
  How each token decides which earlier tokens matter for predicting the next one.
needs: [embeddings]
leads_to: [transformer, kv-cache, context-window]
compare_with: []
updated: 2026-09-23
---

# What is attention?

Attention is the step inside an LLM where each token looks back at the
tokens before it and pulls in whatever it needs from them. It's how the
model works out that "bank" in your prompt means a river bank, and how the
last word of a long prompt ends up carrying everything needed to predict
the next one. It's also the reason long prompts cost more memory and time.

## A token on its own doesn't know what it means

When text enters a model, each token is swapped for a row from a big table,
its [[embeddings|embedding]]. That lookup ignores the neighbours. The word
"tower" gets the same vector whether the text says "the Eiffel tower" or "a
miniature tower".

You'd want those to end up different. After "Eiffel", the vector for tower
should move toward Paris, France and iron. Add "miniature" in front, and it
should stop meaning large and tall.

There's a bigger reason too. A model predicts the next token from the
vector at the **last** position only (see [[next-token-prediction]]).
Imagine a whole mystery novel in the prompt, ending with:

> Therefore the murderer was

The final token, "was", starts out as the plain vector for "was". To
predict the name, that vector has to end up holding the clues from hundreds
of pages earlier. Attention is the mechanism that carries information from
earlier tokens into later ones.

## Queries, keys and values

Take a short phrase:

> A fluffy blue creature roamed the verdant forest

Suppose you want each noun to pick up its adjectives, so "creature" becomes
something closer to "fluffy blue creature". Attention does this by giving
every token three new vectors, each made by multiplying its embedding by a
learned matrix:

- **Query:** what this token is looking for. For "creature", think of it as
  asking "any adjectives in front of me?"
- **Key:** what this token can offer. The keys for "fluffy" and "blue" are
  made to look like a good answer to that question.
- **Value:** what this token will pass along if someone picks it. For
  "fluffy", roughly "make it fluffy".

It works like a fuzzy dictionary lookup. A normal dictionary returns the
one entry whose key matches exactly. Attention compares the query with
every key, and returns a blend of all the values, weighted by how well each
key matched.

The adjective-and-noun story is a teaching example. Nobody programs a head
to look for adjectives. The matrices are learned in training, and what a
real head ends up doing is usually much harder to describe.

## The steps, one at a time

For each token, attention runs these steps:

1. **Score every earlier token.** Compare this token's query with each
   key using a dot product: multiply the numbers pairwise and add them up.
   A big number means a good match. "creature" scores high against "fluffy"
   and "blue", low against "the".
2. **Scale the scores down.** Divide by the square root of the key size.
   It keeps the numbers in a range where the next step behaves well.
3. **Hide the future.** Any score for a *later* token is set to minus
   infinity. More on why below.
4. **Turn scores into weights.** Run them through [[softmax]], which makes
   them positive and makes them add up to 1. Minus infinity becomes exactly
   0. These weights are the **attention pattern**.
5. **Blend the values.** Multiply each value vector by its weight and add
   them up. The result is a change, and that change is added to the
   token's own vector.

So "creature" ends up as its original vector plus a mix of mostly "fluffy"
and "blue". Every token goes through the same steps at the same time, each
with its own query.

![An attention grid for the phrase a fluffy blue creature roamed the verdant forest, with queries as rows and keys as columns. Dots show the weights: creature takes most from fluffy and blue, forest takes most from verdant. Every cell above the diagonal is masked to 0. On the right, the creature row is pulled out: its weights times the value vectors of fluffy, blue and the rest add up to one change that is added to creature.](img/attention-pattern.svg)

## Why a token can only look backward

Step 3, the mask, is what lets a GPT-style model learn from every position
of a text at once.

During training, the model predicts the next token at **every** position of
a text at once. From "a fluffy blue creature roamed", it predicts "fluffy"
after "a", "blue" after "a fluffy", and so on. That turns one sentence into
many practice questions. But if "creature" could look ahead and see
"roamed", the answer would be sitting right there.

So later tokens are blocked. In the 2017 paper that introduced the
transformer, this was described as preventing "leftward" flow of
information. In the attention grid, it shows up as a triangle of zeros.

One side effect: a token's vector can never be changed by anything written
after it. Only later positions get to combine earlier and later parts of
the prompt.

## Many heads, each learning its own pattern

Everything above is one **attention head**: one set of query, key and value
matrices, so one kind of relationship. Adjectives to nouns is one. A pronoun
finding the name it refers to is another. "They crashed the" tells you
something about the car that follows.

So models run many heads side by side, each with its own matrices, and add
up all their changes. The numbers, from models whose sizes are public:

| | Heads per layer | Layers |
|---|---|---|
| The 2017 transformer (base) | 8 | 6 |
| GPT-3 (2020) | 96 | 96 |

When researchers looked inside the 2017 model, different heads had picked
up different jobs, many tied to grammar. One figure shows several heads
connecting "making" to "more difficult" several words away. Another shows
heads working out what "its" refers to.

Anthropic's interpretability research offers a simpler way to see it: an
attention head's basic job is moving information from one token's position
to another's. In small models
they found **induction heads**, which look for an earlier copy of the
current token and copy whatever came after it. If "Mr Dursley" appeared
earlier and the text now says "Mr", the head finds the earlier "Mr" and
copies "Dursley" forward as a likely next token. That's a
basic form of learning from the prompt itself, the effect you use in
[[few-shot-prompting]].

Stacked in layers, heads build on each other. A layer-10 head works on
vectors that earlier heads have already filled with context. How attention
alternates with the other half of each layer is in [[transformer]].

## Where attention came from

Attention wasn't invented for chatbots. In 2014, translation models read a
whole sentence and squeezed it into a single fixed-length vector before
writing the translation. Bahdanau, Cho and Bengio argued that one vector was
a bottleneck, and let the model search back over the source words that
mattered for each word it wrote. Attention sat on top of a recurrent
network, which reads one word after another.

The 2017 paper "Attention Is All You Need" dropped the recurrent part and
kept only attention. Its main win was speed of training. A recurrent
network has to go word by word, but attention can process all positions at
once, which suits GPUs. The paper's model reached top translation quality
after as little as twelve hours on eight GPUs. Being easy to run in
parallel, more than any single behavior, is a big part of why attention
took over.

## What attention costs

Every token scores every earlier token. For a prompt of *n* tokens, that's
a grid of about *n* × *n* scores, per head, per layer. Double the prompt
and the grid gets four times bigger. That's why long [[context-window|context
windows]] were hard to build and still aren't free.

When a model generates text, it would be wasteful to recompute the keys
and values of every earlier token for each new one, so they're stored.
That store is the [[kv-cache]], and it grows with every token.

Newer open models change attention mainly to save that cost:

- **Grouped-query attention:** several heads share one set of keys and
  values, so there's less to store. It has largely replaced the original
  multi-head design.
- **Sliding window attention:** some layers only look at nearby tokens.
  Gemma 3 uses five such layers (with a 1,024-token window) for each layer
  that sees everything.
- **Linear attention hybrids:** in 2025, MiniMax-M1, Qwen3-Next and
  DeepSeek V3.2 swapped regular attention in most or all layers for cheaper
  variants whose cost doesn't grow with the square of the length.
  Qwen3-Next keeps one regular attention block for every three cheap ones,
  because the cheap kind is worse at finding a specific earlier detail.

## Where it gets tricky

**It isn't attention in the human sense.** The weights say how much each
token's value got mixed into another token's vector. They don't say what
the model "focused on" or why it answered as it did. The tidy stories
(adjectives, pronouns) come from picking heads that happen to look tidy.

**Attention is only part of the model.** It gets the fame, but in GPT-3 the
attention weights are just under 58 billion of the 175 billion parameters,
about a third. Most of the rest sit in the feed-forward blocks between
attention layers.

**Attention alone ignores word order.** Compare every token with every
other and "dog bites man" looks the same as "man bites dog". Models add
position information to the embeddings to fix that. Some newer models drop
explicit position information in some layers and rely on the mask alone,
since a token can still tell what came before it.

**Is regular attention on the way out?** Not clearly. Several 2025 models
moved to cheaper linear attention, and then MiniMax went back to regular
attention for its next model, M2, saying the linear kind was tricky in
production and weak on reasoning and multi-turn tasks. As of 2026-09,
hybrids that mix the two are the live experiment. All of this comes from
open-weight models, whose designs are public.

**The research on heads mostly uses small models.** Induction heads were
found in toy models built only from attention layers, and they only showed
up once there were at least two. The
authors argue the idea carries over to large models, but only partly.

## What this means when you build

- **Long prompts cost more than their length suggests.** The attention
  grid grows with the square of the tokens, and the KV cache grows with
  every token kept.
- **Anything in the context can reach any later token.** An instruction at
  the top can shape the last token of a 50-page prompt. That's attention
  doing its job, not memory.
- **Earlier tokens can't see later ones.** Only positions after both parts
  get to combine them. Where you put things in a prompt changes what gets
  mixed with what.
- **Don't read attention weights as an explanation** of why the model
  answered the way it did. They show what got mixed, not the reasoning.

## Further reading

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762),
  Vaswani et al. (Google), 2017. The original transformer paper: scaled
  dot-product attention, multi-head attention and the mask.
- [Neural Machine Translation by Jointly Learning to Align and Translate](https://arxiv.org/abs/1409.0473),
  Bahdanau, Cho and Bengio, 2014. Why attention was invented: the
  fixed-length bottleneck in translation.
- [Attention in transformers, step-by-step](https://www.3blue1brown.com/lessons/attention),
  3Blue1Brown, 2024. The best visual walk through queries, keys, values,
  masking and GPT-3's heads.
- [A Mathematical Framework for Transformer Circuits](https://transformer-circuits.pub/2021/framework/index.html),
  Elhage et al. (Anthropic), 2021. Heads as information movers, and
  induction heads. Heavy; read the summary and the induction heads section.
- [The Big LLM Architecture Comparison](https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison),
  Sebastian Raschka, 2025 (updated 2026). How open models changed attention
  since GPT-2: grouped-query, sliding window and linear attention.
