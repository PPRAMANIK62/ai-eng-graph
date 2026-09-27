---
id: openai-using-logprobs
title: Using logprobs (OpenAI Cookbook)
author: James Hills, Shyamal Anadkat (OpenAI)
url: https://developers.openai.com/cookbook/examples/using_logprobs
published: 2023-12-20
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

OpenAI's notebook on the `logprobs` option in Chat Completions: turn it on and the API returns, for every output token, the log of the probability the model gave it, plus the top few alternatives at that position. It shows five uses with real outputs: confidence on classification, checking whether retrieved text answers a question, autocomplete, token highlighting with raw bytes, and perplexity. The page is now marked archived.

## Key claims

- What you get back: the log probability of each output token, plus a few top alternatives at each position. "When logprobs is enabled, the API returns the log probabilities of each output token, along with a limited number of the most likely tokens at each token position and their log probabilities." (intro)
- Two request parameters: `logprobs` (true/false) and `top_logprobs`, "An integer between 0 and 5 specifying the number of most likely tokens to return at each token position" (intro; range as of this notebook)
- Definition. "a logprob is log(p) , where p = probability of a token occurring at a specific position based on the previous tokens in the context." (intro)
- Range. "Logprob can be any negative number or 0.0 . 0.0 corresponds to 100% probability." (intro)
- Whole-sequence probability: add the token logprobs, then exponentiate. "Logprobs allow us to compute the joint log probability of a sequence by summing the logprobs of its tokens. Exponentiating that sum gives the joint probability." (intro)
- Classification example (gpt-4o-mini, `top_logprobs` 2): "Tennis Champion Showcases Hidden Talents in Symphony Orchestra Debut" → Art at logprob −0.028 (97.23%), Sports second at −4.28 (1.39%). The clear tech and politics headlines came out at 100%. (1. classification)
- The clear-cut headline for comparison: "Tech Giant Unveils Latest Smartphone Model with Advanced Photo-Editing Features." came back as "Output token 1: Technology, logprobs: 0.0, linear probability: 100.0%". (1. classification, printed output; re-opened 2026-09-23)
- Use: set confidence thresholds and send low-confidence cases to a person. "we can automatically classify headlines that exceed a certain threshold and send less certain ones for manual review." (1. classification)
- Warning shown by their own RAG example: the model said False at 99.14% for one partly covered question and True at 99.59% for another. "This shows that confidence measures certainty in the classification, not whether the classification is correct." (2. retrieval confidence)
- Retrieval self-check: the model outputs a "contrived has_sufficient_context_for_answer boolean, which can serve as a confidence score for whether the answer is contained in the retrieved content." Tested on an article about Ada Lovelace; fully covered questions came back True at ~100%. (intro list and 2. Retrieval confidence scoring; re-checked 2026-09-27)
- Their caveat on that check: "validate its classifications and thresholds with task-specific evals before using it to restrict answers or ask follow-up questions." (2.; re-checked 2026-09-27)
- Autocomplete example: after "My least", top next token "favorite" had only 11.92% while a restart token "My" had 88.06%; they suggest a word only when its probability is above 0.95. (3. Autocomplete, code threshold `> 0.95`)
- Each token also comes with its UTF-8 bytes; an emoji can be split across two tokens ("\xf0\x9f\x92" then "\x99"), and joining the bytes rebuilds it. "the emoji is split across two tokens whose byte values combine into its UTF-8 sequence." (4. Highlighter and bytes)
- Joint probability of that whole directive answer: 72.19%. A less constrained prompt "may produce a lower joint probability". (4.)
- Perplexity = exp(−mean logprob); higher means less sure. "Perplexity can be calculated by exponentiating the negative of the average of the logprobs." Their factual question scored 1.16, the speculative one 1.23. (5. Calculating perplexity)
- Confidence isn't correctness. "While a high confidence doesn’t guarantee result accuracy, it can be a helpful signal" (5.)

## Visuals worth redrawing

- The classification output (Art 97.23% vs Sports 1.39%) as a two-bar chart per headline. Good main visual for `logprobs`.
- The token highlighter with the emoji split across two byte-tokens.

## My notes

- The page now says: "This recipe is archived and may reference outdated models or APIs." Dated 2023-12-20 (the date is from the cookbook registry, per `_candidates.md`). Models used: gpt-4, gpt-4o, gpt-4o-mini.
- The 0–5 range for `top_logprobs` is from this notebook. A search snippet said the current reference allows 0–20, but that page 404'd; unverified. Don't state a current range.
- For newer models see `openai-gpt6-model-guidance`: logprobs are removed when reasoning is on.
