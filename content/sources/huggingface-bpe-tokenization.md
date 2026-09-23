---
id: huggingface-bpe-tokenization
title: Byte-Pair Encoding tokenization (LLM Course, chapter 6.5)
author: Hugging Face
url: https://huggingface.co/learn/llm-course/chapter6/5
published: 2026              # course page is undated; checked live 2026-09-23
accessed: 2026-09-23
kind: docs
primary: false
---

## Summary

A step-by-step walk through BPE training and use, with a five-word toy corpus you can follow by hand, then a from-scratch Python version that mimics GPT-2. Training learns an ordered list of merge rules; tokenizing new text means splitting it into characters and applying those rules in the same order. It also explains byte-level BPE, the GPT-2 trick that starts from 256 bytes so no character is ever unknown.

## Key claims

- Origin and users. "Byte-Pair Encoding (BPE) was initially developed as an algorithm to compress texts, and then used by OpenAI for tokenization when pretraining the GPT model." and it is "used by a lot of Transformer models, including GPT, GPT-2, RoBERTa, BART, and DeBERTa." (intro)
- Step 1: the base vocabulary is every symbol used in the corpus's words. For "hug", "pug", "pun", "bun", "hugs" it is ["b", "g", "h", "n", "p", "s", "u"]. "The base vocabulary will then be ["b", "g", "h", "n", "p", "s", "u"]." (Training algorithm)
- Step 2: learn merges until the vocabulary is the size you want. "we add new tokens until the desired vocabulary size is reached by learning merges" (Training algorithm)
- Each step merges the most frequent neighbouring pair. "the BPE algorithm will search for the most frequent pair of existing tokens" (Training algorithm)
- Merges start with two-character tokens and grow to longer subwords. "at the beginning these merges will create tokens with two characters, and then, as training progresses, longer subwords." (Training algorithm)
- Worked example, frequencies hug 10, pug 5, pun 12, bun 4, hugs 5. ("h","u") appears 15 times, but ("u","g") appears 20 times, so the first merge is ("u","g") → "ug". "that honor belongs to ("u", "g") , which is present in "hug" , "pug" , and "hugs" , for a grand total of 20 times" (Training algorithm)
- Second merge ("u","n") → "un" (16 times); third ("h","ug") → "hug", "our first three-letter token." (Training algorithm)
- Tokenizing new text: normalize, pre-tokenize, split into characters, then apply "the merge rules learned in order on those splits" (Tokenization algorithm)
- With those three rules: "bug" → ["b", "ug"]; "mug" → ["[UNK]", "ug"] because "m" was never seen; "thug" → ["[UNK]", "hug"]. "The word "bug" will be tokenized as ["b", "ug"] ." (Tokenization algorithm)
- Unknown characters become the unknown token, which is why many models handle emojis badly. "That’s one reason why lots of NLP models are very bad at analyzing content with emojis" (Training algorithm)
- Byte-level BPE (GPT-2, RoBERTa) avoids this with a 256-symbol base. "This way the base vocabulary has a small size (256), but every character you can think of will still be included and not end up being converted to the unknown token." (Training algorithm)
- GPT-2 has no unknown token at all. "GPT-2 doesn’t actually have an unknown token (it’s impossible to get an unknown character when using byte-level BPE)" (Implementing BPE)
- In the code version (GPT-2 pre-tokenizer), spaces show up as 'Ġ' glued to the next word, and the first merge learned on the sample corpus is ('Ġ', 't') → 'Ġt'. (Implementing BPE)
- Ties are broken differently by different implementations, so two BPE trainers on the same data can give different vocabularies. "when there is a choice of the most frequent pair, we selected the first one encountered" (Implementing BPE)

## Visuals worth redrawing

- The toy corpus after each merge (Training algorithm): five words with frequencies, split into boxes, with the merged pair highlighted each round (ug, un, hug). Best main visual for the `bpe` node.
- "bug" / "mug" / "thug" tokenized with the three rules: shows rules applied in order and the unknown-character problem.

## My notes

- The page is undated; it's a living course. The claim about which models use BPE is not dated either.
- Secondary source (course), but Hugging Face maintains the `tokenizers` library, so it's close to primary on how their implementation works.
- The page leaves the byte-level handling out of its own code ("beyond the scope of this section").
