---
id: petrov-tokenizer-unfairness
title: Language Model Tokenizers Introduce Unfairness Between Languages
author: Aleksandar Petrov, Emanuele La Malfa, Philip H.S. Torr, Adel Bibi (University of Oxford)
url: https://arxiv.org/abs/2305.15425
published: 2023-05-17        # v1; v2 2023-10-20; NeurIPS 2023
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The same text, translated into different languages, turns into very different numbers of tokens: up to 15 times more for some languages than English. Because APIs charge per token, run slower on longer inputs and have a fixed context window, speakers of those languages pay more, wait longer and fit less into the model. The authors measure this "tokenization premium" on the FLORES-200 corpus (the same 2000 sentences in 200 languages) for many tokenizers, including GPT-4's `cl100k_base`, and find no tokenizer close to parity.

## Key claims

- Headline gap: the same text can take up to 15 times more tokens in one language than another. "with differences up to 15 times in some cases" (Abstract)
- Tokenizers built for many languages still have the gap. "These disparities persist even for tokenizers that are intentionally trained for multilingual support." (Abstract)
- Going down to characters or bytes doesn't fix it. "Character-level and byte-level models also exhibit over 4 times the difference in the encoding length for some language pairs." (Abstract)
- GPT-4 / ChatGPT tokenizer (`cl100k_base`), relative to English: Italian 1.6x, Bulgarian 2.6x, Arabic 3x, Shan up to 15x. "uses about 1.6 times more tokens to encode the same text in Italian as it does in English, 2.6 times for Bulgarian and 3 times for Arabic." (§1 Introduction)
- More `cl100k_base` premiums from Table 1: French 1.60, German 1.58, Portuguese 1.48, Spanish 1.55, Japanese 2.30, Chinese (Simplified) 1.91, Vietnamese 2.45, Standard Arabic 3.04, Burmese 11.70, Dzongkha 12.33, Odia 12.48, Santali 12.80, Shan 15.05. The cheapest language is still about half again as long. "still requires about 50% more tokens for the same content." (§4.1 Summary, about Portuguese)
- Cost follows directly because APIs bill per token. "the cost to process a text in German or Italian is about 50% higher than to process the same text in English" (§5.1 Cost); the worst languages cost "more than 12 times more than in English." (§5.1)
- Context windows hold far less text in some languages. "one can process less than a tenth of the content in languages like Burmese and Dzongkha than they can in English." (§5.3 Long context processing)
- Latency grows with token count; in their RoBERTa test time was roughly linear in token length, and Shan took almost twice as long as English. "Some languages can require twice the time to process the same content as English." (§1, Latency)
- Common words in non-English scripts get shredded while odd internet strings get their own token. In GPT-2, `BuyableInstoreAndOnline` is one token, but Arabic "why" is one token per letter and Bulgarian "защо" needs 6 tokens: "resulting in 6 tokens for this 4 letter word." (§2)
- A Shan word for "you" (one consonant plus three diacritics, 4 Unicode codepoints) becomes 9 tokens in ChatGPT/GPT-4, while English "you" is one token. "there are four Unicode codepoints for this Shan character, resulting in 9 tokens." (§4.1)
- Why bytes aren't fair either: in UTF-8, English letters are 1 byte, Greek/Cyrillic/Arabic/Hebrew 2 bytes, Chinese/Japanese/Korean 3 bytes. "Chinese, Japanese and Korean characters require three bytes." (§4.4)
- Giving vocabulary space to other languages costs English little. "with only a third of the vocabulary, English sequences will become just 10% longer for ChatGPT/GPT-4" (§6; Figure 3 also says a 10-fold smaller vocabulary gives only 30% longer English)

## Visuals worth redrawing

- Table 1 (p. 3): premiums relative to English for GPT-2/RoBERTa, ChatGPT/GPT-4 and FlanT5. Redraw the ChatGPT/GPT-4 column as a horizontal bar chart (English 1.0 → Shan 15.05). This is the best visual for the "different languages cost different amounts" section.
- The token-id strips in §2 and §4.1: Arabic "why" letter by letter, Bulgarian "защо" as 6 ids, 言 as 3 ids, the Shan "you" as 9 ids. Redraw one or two as word → token boxes.
- Figure 2 (p. 6): RoBERTa processing time vs tokenized length per language, coloured by script family. English bottom-left, Shan top-right.
- Figure 3 (p. 9): English token count vs share of the `cl100k_base` vocabulary kept. Shows diminishing returns of a big vocabulary.

## My notes

- The HTML version (https://arxiv.org/html/2305.15425) returns 404; this paper predates arXiv's HTML rendering. I read the full text from the arXiv PDF, v2 (https://arxiv.org/pdf/2305.15425v2). Quotes are from the PDF text with line breaks joined.
- Dated: the numbers are for tokenizers from 2023 (`cl100k_base` for GPT-4/ChatGPT). OpenAI's later `o200k_base` (GPT-4o) and Claude's newer tokenizer are not measured. Newer tokenizers with bigger vocabularies probably narrow the gap for some languages, but I have no source for that; don't claim it. A small experiment (tokenize the same FLORES sentence in several languages with `cl100k_base` vs `o200k_base`) would make a good "something of our own" for the article.
- The paper reports prices "at the time of writing" (OpenAI pricing page, 2023). The 2.5x and 12x cost figures are token ratios, so they still hold for any per-token price with that tokenizer.
- Premiums depend on the corpus: the authors note FLORES-200 has many English-centric names, which may favour English (§6).
- Agrees with Karpathy (`karpathy-minbpe`), who lists "worse at non-English languages" as a tokenization problem; Petrov gives the numbers.
- Also in the source: Across services, some language users pay at least 2.5 times more. "users of some languages paying at least 2.5 times more for the same task as users of English." (§1, Cost)
- Also in the source: Even `cl100k_base` splits single characters. "three tokens for more than 65% of kanji characters" (§2, about `cl100k_base`); in GPT-2 the common kanji 言 ("to say") is 3 tokens.
