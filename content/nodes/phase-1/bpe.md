---
id: bpe
title: What is byte-pair encoding?
depth: short
phase: 1
note: >-
  The merge algorithm most tokenizers use to build their vocabulary.
needs: [tokenization]
leads_to: []
compare_with: []
status: review
updated: 2026-09-23
---

# What is byte-pair encoding?

Byte-pair encoding (BPE) is the recipe most tokenizers use to decide which
chunks of text get their own token. It starts from single characters and
keeps gluing together the pair that shows up most often. You won't write
one yourself, but knowing how it works explains why your tokens look the
way they do.

## Start with five words

[[tokenization]] covers what tokens are and why models use chunks instead of
letters or whole words. BPE answers the next question: which chunks?

Say your training text contains only five words, with these counts:

| Word | Times it appears |
|---|---|
| hug | 10 |
| pug | 5 |
| pun | 12 |
| bun | 4 |
| hugs | 5 |

Split every word into single letters. Your starting vocabulary is every
letter you saw: `b g h n p s u`. Seven tokens.

## Merge the most common pair, then repeat

Now count every pair of neighbouring symbols, weighted by how often each
word appears.

- `h u` shows up in "hug" and "hugs": 15 times.
- `u g` shows up in "hug", "pug" and "hugs": 20 times.
- `u n` shows up in "pun" and "bun": 16 times.

`u g` wins. So you add a new token, `ug`, to the vocabulary, and everywhere
`u g` appears you now write it as one symbol. "hug" is now `h ug`.

Count again. `u n` at 16 is now the top pair, so `un` becomes a token.
Count again. `h ug` appears 15 times and wins, giving you `hug`, your first
three-letter token.

That's the whole algorithm. Count pairs, merge the most frequent one,
record the merge, repeat. Early merges make two-letter tokens. Later ones
build longer pieces, and very common words end up as a single token.

![The words hug, pug, pun, bun and hugs, with counts 10, 5, 12, 4 and 5, split into letters. Three merges follow: u and g become ug (20 times), then u and n become un (16 times), then h and ug become hug (15 times). The vocabulary grows from 7 tokens to 8, 9 and 10.](img/bpe-merges.svg)

You stop when the vocabulary reaches the size you want. That size is the
one real choice you make: the final vocabulary is the starting symbols plus
one token per merge.

## Using it on new text

Training gives you an ordered list of merge rules. To tokenize new text,
split it into characters and apply the rules in the same order they were
learned.

With the three rules above:

- "bug" becomes `b` + `ug`. The word was never in the training text, and
  that's fine.
- "mug" becomes `[UNK]` + `ug`. The letter "m" was never seen, so it has no
  token at all.

The first case is why BPE caught on. Any new word can be built from
smaller pieces, so rare words, typos and new names still get tokens. The
second case is the weak spot, and it has a neat fix.

## Starting from bytes means nothing is unknown

Instead of starting from letters, start from bytes. All text is stored as
bytes, and there are only 256 possible byte values. Put all 256 in the
starting vocabulary and every possible character, emoji included, can
always be spelled, even if only as raw bytes.

This is **byte-level BPE**, and GPT-2 used it. GPT-2's tokenizer has no
"unknown" token, because with bytes as the base there's no such thing as an
unknown character. Before this trick, characters outside the training text
became an unknown token, which is one reason older NLP models handled
emojis badly.

## Where it came from

BPE started as a data compression method from 1994: find the most common
pair of bytes in a file and replace it with a single unused byte. In 2015,
Rico Sennrich and colleagues reused the idea for machine translation. Their
models had a fixed vocabulary and kept tripping over rare words, and
splitting words into subword pieces fixed it, beating a dictionary-based
fallback on English-German and English-Russian. OpenAI later used BPE for
GPT, and it spread to many other models.

## Where it gets tricky

**Two BPE tokenizers trained on the same text can differ.** When two pairs
tie for most frequent, implementations break the tie differently, so the
merge lists drift apart. Don't assume two tokenizers match just because both
say "BPE".

**Word boundaries are handled differently.** The 2015 version marked the end
of each word with a special symbol. GPT-2's tokenizer instead glues the space to
the front of the next word, so the pieces it learns look like "␣is" and
"␣the", space included.

## What this means when you build

- You'll never train BPE for an API model; the tokenizer ships with it.
  What you get from knowing it is the ability to predict splits: common
  words are one token, rare words and unusual strings are several.
- The merge list is learned from one particular pile of text, and the
  vocabulary size is picked by whoever trained it. So each model family's
  tokenizer is its own, and counts from one don't carry over to another
  (see [[tokenization]]).

## Further reading

- [Byte-Pair Encoding tokenization](https://huggingface.co/learn/llm-course/chapter6/5),
  Hugging Face LLM Course. The five-word example worked step by step, then a
  small Python version, plus byte-level BPE.
- [Neural Machine Translation of Rare Words with Subword Units](https://arxiv.org/abs/1508.07909),
  Sennrich, Haddow and Birch, 2016. The paper that brought BPE from
  compression to neural translation, with a short Python version.
