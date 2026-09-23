---
id: openai-tiktoken
title: tiktoken (README)
author: OpenAI
url: https://github.com/openai/tiktoken
published: 2025-02-14        # date of the README's last commit on GitHub; the repo is live and maintained
accessed: 2026-09-23
kind: code
primary: true
---

## Summary

tiktoken is OpenAI's open-source library for turning text into the integer tokens its models read, and back again. The README's "What is BPE anyway?" section is a short, first-party answer to why models use tokens: BPE is lossless, handles any text, compresses it to about 4 bytes per token, and splits words into common subword pieces. It also shows that each OpenAI model has a named encoding (`o200k_base` for GPT-4o, `cl100k_base` for GPT-4).

## Key claims

- Models read numbers, not text. "Language models don't see text like you and I, instead they see a sequence of numbers (known as tokens)." (What is BPE anyway?)
- BPE is the method used to turn text into those tokens. "Byte pair encoding (BPE) is a way of converting text into tokens." (What is BPE anyway?)
- Nothing is lost: tokens decode back to the exact original text. "It's reversible and lossless, so you can convert tokens back into the original text" (What is BPE anyway?, property 1)
- It never hits an unknown word, even on text it wasn't trained on. "It works on arbitrary text, even text that is not in the tokeniser's training data" (What is BPE anyway?, property 2)
- The token sequence is shorter than the raw bytes; a token is about 4 bytes on average (roughly 4 characters of English, since ASCII letters are 1 byte each in UTF-8 per `petrov-tokenizer-unfairness` §4.4). "On average, in practice, each token corresponds to about 4 bytes." (What is BPE anyway?, property 3)
- Tokens are subwords. The README's example: "encoding" usually splits into "encod" + "ing", not "enc" + "oding". "It attempts to let the model see common subwords." (What is BPE anyway?, property 4)
- Seeing the same subword token in many contexts helps the model. "it helps models generalise and better understand grammar." (What is BPE anyway?, property 4)
- Each model has its own tokenizer, looked up by model name. The example loads `o200k_base` directly and gets GPT-4o's with `encoding_for_model("gpt-4o")`. "To get the tokeniser corresponding to a specific model in the OpenAI API:" (top code example)
- `cl100k_base` is the GPT-4 tokenizer. "Visualise how the GPT-4 encoder encodes text" (What is BPE anyway?, educational submodule code comment)
- A vocabulary includes special tokens with fixed ids beyond the normal ones; the extension example adds `<|im_start|>` as 100264 and `<|im_end|>` as 100265 on top of `cl100k_base`. "If you're changing the set of special tokens, make sure to use a different name" (Extending tiktoken, code comment)
- The vocabulary is learned from text (short mention for this article; detail belongs in `bpe`). "Train a BPE tokeniser on a small amount of text" (What is BPE anyway?, educational submodule code comment)
- Speed: tiktoken is 3 to 6 times faster than a comparable tokenizer, measured on 1GB of text with the GPT-2 tokenizer. "is between 3-6x faster than a comparable open source tokeniser" (Performance)

## Visuals worth redrawing

- The "encoding" → "encod" + "ing" split (What is BPE anyway?, property 4). Easy to redraw as a word cut into coloured token boxes with integer ids under them.
- Performance chart `perf.svg` (Performance section), comparing tiktoken with Hugging Face's `GPT2TokenizerFast`. I didn't open the image. Not needed for this article.

## My notes

- "About 4 bytes per token" is stated as a practical average. The README doesn't say which encoding, which language or which text it measured. Petrov et al. (`petrov-tokenizer-unfairness`) show the ratio changes a lot by language, so the article should present 4 bytes as "English-ish average", not a constant.
- Bytes are not characters: 4 bytes ≈ 4 English characters, but a Chinese or Japanese character is 3 bytes in UTF-8 (Petrov §4.4), so "4 characters per token" doesn't carry over.
- No vocabulary sizes are stated in the README. The names hint at them (`cl100k` ≈ 100k, `o200k` ≈ 200k) and the special-token ids 100264/100265 sit just above ~100k, but the README never states a size. Karpathy's minbpe README says a 100K vocabulary reproduces GPT-4's tokenizer, which fits.
- The README doesn't name the tokenizer for OpenAI's newest models (GPT-5/GPT-6 era). Only GPT-4o and GPT-4 appear. Check the OpenAI docs before claiming anything about current models.
- The claim about BPE helping models "generalise and better understand grammar" is stated without evidence in the README.
