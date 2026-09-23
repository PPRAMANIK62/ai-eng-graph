---
id: karpathy-minbpe
title: minbpe (README and lecture.md, "LLM Tokenization")
author: Andrej Karpathy
url: https://github.com/karpathy/minbpe/blob/master/lecture.md
published: 2024-02-23         # last commit to lecture.md; repo created 2024-02-16
accessed: 2026-09-23
kind: code
primary: true
---

## Summary

minbpe is a small, readable implementation of byte-level BPE that reproduces GPT-4's tokenizer exactly; lecture.md is the text version of Karpathy's "Let's build the GPT Tokenizer" video. The lecture explains what a token is (an integer that picks a row of the model's embedding table), shows how GPT-2 tokenizes words and numbers, and lists the odd LLM behaviors Karpathy blames on tokenization. The text version stops early ("to be continued..."), so the list of oddities is there but the explanations of most of them are only in the video.

## Key claims

- Many LLM failures that look like model problems come from the tokenizer. "Tokenization is at the heart of a lot of weirdness in LLMs" (lecture, Brief taste of the complexities of tokenization)
- The oddities list, spelling and string tasks: models can't spell words or reverse a string. "Why can't LLM do super simple string processing tasks like reversing a string?" (lecture, same section; the item before it is "Why can't LLM spell words?")
- The oddities list, languages: "Why is LLM worse at non-English languages (e.g. Japanese)?" (lecture, same section)
- The oddities list, arithmetic and code: "Why is LLM bad at simple arithmetic?" and "Why did GPT-2 have more than necessary trouble coding in Python?" (lecture, same section)
- The oddities list, format and strange strings: the model halting on the text `<|endoftext|>`, a warning about a trailing whitespace, breaking on "SolidGoldMagikarp", and the advice to prefer YAML. "Why should I prefer to use YAML over JSON with LLMs?" (lecture, same section)
- Numbers are split into tokens arbitrarily (GPT-2 tokenizer, shown in the Tiktokenizer web app): 127 is one token; 677 is " 6" + "77"; the answer 804 has to be emitted as " 8" then "04"; 1275 is "12" + "75"; 6773 is " 6" + "773"; 8041 is " 8" + "041". "numbers may be inconsistently decomposed by the tokenizer." (lecture, Visual preview of tokenization)
- Spaces are part of tokens. In GPT-2, " is" (with the leading space) is token 318, " at" is 379, " the" is 262, and "Tokenization" is 30642 followed by 1634. "Be careful with whitespace because it is absolutely present in the string and must be tokenized along with all the other characters" (lecture, Visual preview of tokenization)
- A token id is a row index: the id picks a learned vector from the embedding table, and that vector is what the Transformer gets. "this row is the vector that represents this token." (lecture, Previously: character-level tokenization)
- The simplest tokenizer is one token per character; for the Shakespeare example that gives a vocabulary of 65 and a 65-row embedding table. Real models instead use chunks of characters. "these schemes work not on a character level, but on character chunk level." (lecture, "Character chunks" for tokenization using the BPE algorithm)
- GPT-2 (2019) popularized byte-level BPE, with a 50,257-token vocabulary and a 1024-token context. "The vocabulary is expanded to 50,257" (lecture, quoting GPT-2 paper §2.2)
- Same BPE family across labs, and GPT-4's tokenizer is reproducible with a ~100K vocabulary. "Today, all modern LLMs (e.g. GPT, Llama, Mistral) use this algorithm to train their tokenizers." (README, intro) and "with a vocabulary size of 100K, you would reproduce the GPT-4 tokenizer" (README, training)
- Byte-level BPE starts from the 256 byte values and merges from there, so any text can be encoded. "minbpe always allocates the 256 individual bytes as tokens, and then merges bytes as needed from there." (README, quick start)

## Visuals worth redrawing

- The Tiktokenizer screenshot (lecture, Visual preview of tokenization, `assets/tiktokenizer.png`): text on the left, the same text as coloured token chunks with ids on the right, 300 tokens for the example with the `gpt2` tokenizer. Redraw with our own sentence plus a number line (127 vs 677 vs 1275) to show arbitrary number splits.
- The pipeline: string → UTF-8 bytes → BPE merges → token ids → embedding rows (lecture, character-level section plus README). Good as the article's main diagram.
- README "GPT-4 comparison" example: the string `hello123!!!? (안녕하세요!) 😉` encodes to 12 tokens under `cl100k_base`: [15339, 4513, 12340, 30, 320, 31495, 230, 75265, 243, 92245, 16715, 57037]. Mixed English, digits, Korean and an emoji in one line; nice for a small figure.

## My notes

- The lecture's list of oddities is a list of questions, each answered "**Tokenization**." Only the number-splitting and whitespace points are explained in the text; the text ends "(to be continued...)". Explanations for SolidGoldMagikarp, trailing whitespace, YAML vs JSON and `<|endoftext|>` are in the video, which I did not watch. Don't cite this note for how those work, only that Karpathy lists them.
- Two list items not quoted above: "Why is LLM not actually end-to-end language modeling?" and a joke line, "What is the real root of suffering?"
- Examples use the GPT-2 tokenizer (2019). The lecture text doesn't show how GPT-4's `cl100k_base` or newer tokenizers split the same numbers, so the exact splits above are GPT-2 splits only. Run tiktoken on current encodings before stating how a current model splits a number.
- Counting letters ("how many r's in strawberry") is not in the lecture text. It follows from the spelling point but needs its own source or our own experiment.
- "All modern LLMs use BPE" is Karpathy's claim from February 2024. His own todo list says a Llama tokenizer would need a separate "sentencepiece equivalent", so even within BPE the families differ. That supports the article's "different families, different tokenizers" point.
- Also in the source: Tokens are the unit everything is counted in; Llama 2 was trained on 2 trillion tokens. "the paper claims that they trained on 2 trillion tokens" (lecture, "Character chunks" section)
- Also in the source: Special tokens are a security edge: if user text is allowed to parse as special tokens, a user can inject control tokens. "unintentionally tokenizing attacker-controlled data (e.g. user prompts) with special tokens" (README, inference: GPT-4 comparison)
