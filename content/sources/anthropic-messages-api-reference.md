---
id: anthropic-messages-api-reference
title: Create a Message (Claude API reference)
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/api/messages/create
published: 2026              # undated reference page; example request uses claude-opus-5
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

The reference page for Claude's Messages API. For sampling, it documents `temperature`, `top_k` and `top_p` as deprecated: models released after Claude Opus 4.6 reject non-default values with a 400 error. It still describes what each one does, and notes that even temperature 0 was never fully deterministic. The request parameter list has no logprobs option.

## Key claims

- Temperature is deprecated for newer models, with only the default accepted. "Models released after Claude Opus 4.6 do not support setting temperature. A value of 1.0 will be accepted for backwards compatibility, all other values will be rejected with a 400 error." (Body parameters, temperature)
- Claude's temperature scale was 0 to 1, default 1. "Defaults to 1.0 . Ranges from 0.0 to 1.0 ." (temperature)
- The old advice. "Use temperature closer to 0.0 for analytical / multiple choice, and closer to 1.0 for creative and generative tasks." (temperature)
- Temperature 0 isn't fully deterministic. "Note that even with temperature of 0.0 , the results will not be fully deterministic." (temperature)
- top_k: any value is rejected on newer models. "Models released after Claude Opus 4.6 do not accept top_k; any value will be rejected with a 400 error." (top_k)
- What top_k did. "Only sample from the top K options for each subsequent token." and it was "Used to remove "long tail" low probability responses." (top_k)
- top_p: only values ≥ 0.99 accepted on newer models. "A value >= 0.99 will be accepted for backwards compatibility, all other values will be rejected with a 400 error." (top_p)
- What top_p did (nucleus sampling). "we compute the cumulative distribution over all the options for each subsequent token in decreasing probability order and cut it off once it reaches a particular probability specified by top_p ." (top_p)
- All three were "Recommended for advanced use cases only." (top_k, top_p)
- No logprobs: the body parameters listed are max_tokens, messages, model, metadata, stop_sequences, stream, system, temperature, thinking, tools, top_k, top_p and others; none mentions logprobs, and the word "logprob" doesn't appear on the page. (Body parameters, checked by searching the page text 2026-09-23)

## Visuals worth redrawing

- None.

## My notes

- An earlier fetch (per `_candidates.md`) came back cut off mid-sentence; this time the full parameter list loaded.
- "After Claude Opus 4.6" matches `anthropic-sonnet-5-whats-new`, which says the lock came with Opus 4.7 and then Sonnet 5. Slight wording difference: this page says top_p ≥ 0.99 is accepted; the Sonnet 5 page says "the default value (or omitting the parameter)". Treat "leave them unset" as the safe reading.
- "No logprobs parameter" is an absence on one reference page as of 2026-09-23, not an official statement that Claude never returns logprobs. Word it that way.
