---
id: openai-gpt6-model-guidance
title: Model guidance (GPT-6)
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/latest-model
published: 2026              # undated page; describes the GPT-6 family current on 2026-09-23
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

OpenAI's guide to its newest model family as of 2026-09: GPT-6 Astra, Sol and Luna, with prompting advice and a migration checklist. For sampling, the key line is in the migration section: whenever reasoning is on, you must remove `temperature`, `top_p` and `top_logprobs` (and `logprobs`). GPT-6 Astra can't turn reasoning off at all.

## Key claims

- The family and model ids. "Use gpt-6-astra for our highest level of capability, gpt-6-sol for strong reasoning on demanding tasks, or gpt-6-luna for efficient, repeatable work at scale." (intro)
- Sampling and logprob parameters go away when reasoning is on. "When reasoning effort is not none , remove temperature , top_p , and top_logprobs ." (Migration quickstart, Unsupported parameters)
- Same for the logprobs switch itself. "For Chat Completions, also remove logprobs . For Responses, remove message.output_text.logprobs from include ." (Migration quickstart, Unsupported parameters)
- Astra has no "none" reasoning setting, so on Astra these parameters are never available. "GPT-6 Astra does not support the none reasoning effort; GPT-6 Sol and Luna do." (Limitations)
- The migration advice for Astra is to use `low` instead of `none`. "GPT-6 Astra does not support none ; use low instead." (Migration quickstart, Reasoning effort)
- Reasoning effort is set with `reasoning.effort` (Responses) or `reasoning_effort` (Chat Completions). (Migration quickstart)
- Style is steered by instructions in the prompt, not sampling knobs: the page gives prompt text for writing style, e.g. "Default to using clear, concise paragraphs, each developing one main idea." (Personality and writing style)

## Visuals worth redrawing

- None. Our own: a small table "model / reasoning on? / temperature / top_p / logprobs".

## My notes

- Page title in the browser is "Model guidance | OpenAI API"; `_candidates.md` calls it "Using GPT-6". URL is the "latest-model" guide, so it will change when the next model ships. Re-check on every review.
- The page doesn't say why these parameters are removed. Don't guess.
- It doesn't say what happens if you send them anyway (error or ignored).
