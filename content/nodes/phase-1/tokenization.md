---
id: tokenization
title: What is tokenization?
depth: deep
phase: 1
note: >-
  How text becomes the integer tokens a model actually sees, and why that explains odd behavior and pricing.
needs: [next-token-prediction]
leads_to: [bpe, embeddings, context-window]
compare_with: []
updated: 2026-09-23
---

# What is tokenization?

An LLM never sees your text. Before your prompt reaches the model, it's
chopped into chunks called **tokens**, and each chunk is swapped for a
number. Tokens are what you pay for, what fills up the context window, and
the reason behind some of the strangest mistakes LLMs make.

## From a sentence to numbers

Take this text:

> Tokenization is

GPT-2's tokenizer turns it into three numbers: `30642`, `1634`, `318`. The
first two together make "Tokenization". The third is " is", with the space
in front included. Those three numbers are all the model gets.

This matters because the model reads and writes tokens, not letters. When
[[next-token-prediction]] talks about predicting "the next token", this is
what it means: one entry from a fixed list.

Here's the full trip:

1. **Text becomes bytes.** Your string is stored as UTF-8. An English letter
   is 1 byte. Greek, Cyrillic, Arabic and Hebrew letters take 2 bytes.
   Chinese, Japanese and Korean characters take 3.
2. **Bytes are grouped into chunks.** The tokenizer merges bytes into
   chunks it learned from a large pile of text. The usual method is called
   byte-pair encoding, covered in [[bpe]].
3. **Each chunk gets an id.** The id is just the chunk's position in the
   tokenizer's list of chunks, its **vocabulary**.
4. **Each id picks a row of numbers.** Inside the model, the id selects one
   row from a big table. That row, a list of numbers called an
   [[embeddings|embedding]], is what the network actually works with.
5. **On the way out, it runs backwards.** The model outputs ids, and the
   tokenizer turns them back into text. Nothing gets lost along the way.

![The line hello123!!!? (안녕하세요!) 😉 on its way into GPT-4's tokenizer. Its 36 UTF-8 bytes are grouped into 12 tokens: hello, 123, !!!, ?, space plus bracket, four byte fragments that make up 안 and 녕, 하세요 as one token, !) and space plus emoji. Each token gets an id such as 15339, and each id picks one row of the embedding table.](img/tokenization-pipeline.svg)

## Why chunks, and not letters or words

**Why not one token per letter?** You could. A toy model trained on
Shakespeare only needs 65 characters in its vocabulary. The problem is
length. Every text becomes very long, and the model's work grows with the
number of tokens it has to process.

**Why not one token per word?** Then any word the tokenizer never saw, a
typo, a new product name, a word in another language, would have no id at
all.

Chunks sit in between. Common words get a single token. Rare words get split
into common pieces: "encoding" usually becomes "encod" + "ing". And because
the list starts with all 256 possible byte values, any text can be encoded,
even text the tokenizer never saw in training.

For English on OpenAI's tokenizers, a token averages about 4 bytes, so
roughly 4 characters. Keep that as a rough guide only. The sections below
show how far it can be off.

Vocabularies have grown over time. GPT-2's had 50,257 tokens. GPT-4's
tokenizer has about 100,000.

## Spaces are part of tokens

A space isn't a separator that gets thrown away. It's usually glued to the
front of the next word. In GPT-2, " is" (with a space) is token 318, " the"
is 262 and " at" is 379. "the" at the start of a line and " the" after a
space are different tokens to the model.

A trailing space at the end of a prompt is on the list of known causes of
odd LLM behavior for the same reason: the space is a real part of the text
the model has to tokenize.

## Every model family has its own tokenizer

The chunk list is learned, and each model family learns its own. OpenAI names
theirs: `cl100k_base` for GPT-4, `o200k_base` for GPT-4o. The same text gives
a different token count on each. A count you measured on one model tells you
little about another.

The two big providers also differ in how you count:

- **OpenAI** publishes its tokenizers as an open-source library, tiktoken.
  You can count tokens on your own machine.
- **Anthropic** doesn't publish Claude's tokenizer. You count by sending your
  request to a free token-counting endpoint, and the number it gives back is
  an estimate that can be off by a little.

Anthropic also switched to a new tokenizer with Claude Opus 4.7, so even
within one family, counts change between versions.

## Why LLMs are bad at spelling and arithmetic

A lot of "the model is dumb" moments are really "the model can't see
letters" moments.

**Spelling.** Ask a model to reverse "encoding" and it gets two ids,
"encod" and "ing", not eight letters. The ids don't show which letters are
inside each token.

**Arithmetic.** Numbers get cut up in ways that ignore place value. With
GPT-2's tokenizer:

| Number | Tokens |
|---|---|
| 127 | `127` |
| 677 | ` 6` + `77` |
| 804 | ` 8` + `04` |
| 1275 | `12` + `75` |

So to answer "804", the model has to produce " 8" and then "04", digit
clumps that have nothing to do with how anyone adds numbers.

![Six numbers as GPT-2 tokens. 127 is one token. 677 is space-6 plus 77, 804 is space-8 plus 04, 1275 is 12 plus 75, 6773 is space-6 plus 773, and 8041 is space-8 plus 041. Each piece has its own id underneath.](img/tokenization-number-splits.svg)

**Other known trouble spots.** Non-English text, code (GPT-2 had more trouble
with Python than it should have), and structured formats (YAML tends to work
better than JSON) all trace back to how their characters turn into tokens.
Odd internet strings can even get their own token: in GPT-2,
`BuyableInstoreAndOnline` is a single token, while the Bulgarian word for
"why" takes six.

## The same text costs more in some languages

Translate the same sentence into different languages and count the tokens.
With GPT-4's tokenizer, compared with English:

| Language | Tokens for the same text |
|---|---|
| English | 1× |
| Portuguese | 1.5× |
| German | 1.6× |
| Italian | 1.6× |
| Japanese | 2.3× |
| Bulgarian | 2.6× |
| Arabic | 3× |
| Burmese | 11.7× |
| Shan | 15× |

![Bar chart of tokens needed for the same text under GPT-4's tokenizer, relative to English: English 1, Portuguese 1.5, German 1.6, Italian 1.6, Japanese 2.3, Bulgarian 2.6, Arabic 3, Burmese 11.7, Shan 15.](img/tokenization-language-cost.svg)

Since APIs bill per token, that's a price difference for the exact same
content. Processing German or Italian costs about 50% more than English. The
worst languages cost over 12 times more. Speed follows the same pattern,
since more tokens take longer to process. And the context window holds less:
in Burmese you can fit less than a tenth of what fits in English.

Individual characters can blow up too. One Shan word for "you" is a single
letter with three marks. That's four Unicode characters, and GPT-4's
tokenizer turns them into 9 tokens. English "you" is one.

## A new tokenizer can change your bill

Tokenizers change between model versions, and that alone moves your costs.

When Anthropic released Claude Sonnet 5, the same text came out to about
30% more tokens than on Sonnet 4.6. The exact increase depends on the
content. The price per token dropped at the same time: $2 per million input
tokens instead of $3, and $10 per million output tokens instead of $15.

So a request doesn't get cheaper by the same share as the per-token price.
You pay less per token, but for more tokens.

Two side effects:

- **The context window holds less text.** It's the same number of tokens,
  but each token covers less text.
- **Output limits can cut answers short.** A `max_tokens` value that fit a
  full answer on the old model may truncate the same answer on the new one.

## Your text is rarely the expensive part

Here's what a few small requests to Claude Opus 5.5 count as:

| Request | Tokens |
|---|---|
| A one-line system prompt and "Hello, Claude" | 14 |
| The same, plus one tool definition | 403 |
| A short question about an image | 1,028 |
| A short question about a PDF | 2,188 |

The words you type are often the smallest part of the bill. Tool
definitions, images and documents dominate.

## Where it gets tricky

**"4 characters per token" is a rule of thumb, not a fact.** It holds for
English on OpenAI's tokenizers. The same content can take 1.5 to 15 times as
many tokens in other languages. Claude's newer tokenizer produces about 30%
more tokens for the same text, and Anthropic doesn't publish an average.

**Training a tokenizer on many languages doesn't close the gap.**
Tokenizers built for multilingual use still show big differences between
languages. Skipping tokenization and working on raw bytes doesn't solve it
either, because some scripts need 3 bytes for a character that takes 1 in
English. The fix may be cheap, though. One study estimated that giving two
thirds of GPT-4's vocabulary to other languages would make English text only
about 10% longer.

**Most of the examples here are old.** The number splits and space examples
come from GPT-2's tokenizer. The language numbers were measured on 2023
tokenizers. The mechanism hasn't changed, but newer tokenizers split things
differently, and nobody has published updated language numbers for them.

## What this means when you build

- **Count tokens on the model you'll actually use,** and count again when
  you upgrade models. Don't reuse old counts.
- **Budget for your users' languages.** If many of your users write in
  Japanese or Arabic, your costs and context limits are different from an
  English-only app.
- **Expect trouble with spelling and exact arithmetic.** The model sees
  tokens, not letters or digits.
- **Watch the non-text parts of a request.** Tools, images and documents
  often cost more than the conversation itself.
- Tokens are also the unit for the [[context-window]], and output tokens
  cost more than input tokens, for reasons covered in [[token-pricing]].

## Further reading

- [tiktoken](https://github.com/openai/tiktoken), OpenAI. Their open-source
  tokenizer library. Short and practical: what BPE gives you, and which
  encoding each model uses.
- [minbpe: LLM Tokenization lecture](https://github.com/karpathy/minbpe/blob/master/lecture.md),
  Andrej Karpathy, 2024. Minimal BPE code and lecture notes, with the list of
  tokenization-caused oddities and the GPT-2 examples.
- [Language Model Tokenizers Introduce Unfairness Between Languages](https://arxiv.org/abs/2305.15425),
  Petrov et al., 2023. The study that measured the language gap and what it
  does to cost, speed and context.
- [What's new in Claude Sonnet 5](https://platform.claude.com/docs/en/models/sonnet-5/whats-new-sonnet-5),
  Anthropic docs. Release notes on the new tokenizer and what it changes for
  token counts and costs.
- [Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting),
  Anthropic docs. How to count Claude tokens, with example counts for tools,
  images and PDFs.
