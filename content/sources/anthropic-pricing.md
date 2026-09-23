---
id: anthropic-pricing
title: Pricing
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/about-claude/pricing
published: undated           # no date; notes Sonnet 5 introductory pricing through 2026-08-31 became standard, so current as of the access date
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

Anthropic's price list for the Claude API. Every model listed charges 5 times as much per output token as per input token. The page also covers the discounts that change the bill: cached input at a fraction of the input price, 50% off for batch jobs, and flat pricing across the full 1M window. It doesn't say why output costs more.

## Key claims

- Prices as of 2026-09-23, per million tokens (input / output): Fable 5.1 $10 / $50; Opus 5.5 $4 / $20; Opus 5 $5 / $25; Sonnet 5 $2 / $10; Sonnet 4.6 $3 / $15; Haiku 4.5 $1 / $5; retired Opus 4.1 $15 / $75; Haiku 3.5 $0.80 / $4. "Claude Sonnet 5 | $2 / MTok" (Model pricing table)
- So output is 5x input on every model in the table (my arithmetic from the table).
- Cache reads cost 0.1x the input price on most models (0.05x on Opus 5.5, 0.025x on Fable 5.1 and Mythos 5.1). "A cache hit costs 10% of the standard input price" (Prompt caching)
- Cache writes cost more than normal input: 1.25x for 5 minutes, 2x for 1 hour. "caching pays off after one cache read for the 5-minute duration (1.25x write), or after two cache reads for the 1-hour duration (2x write)." (Prompt caching)
- Caching reuses already-processed parts of the prompt. "Instead of reprocessing the same large system prompt, document, or conversation history on every request, the API reads from cache at a fraction of the standard input price." (Prompt caching)
- Batch API: 50% off input and output. "The Batch API allows asynchronous processing of large volumes of requests with a 50% discount on both input and output tokens." (Batch processing)
- Flat pricing across the 1M window on Claude 4.6 and later. "A 900k-token request is billed at the same per-token rate as a 9k-token request." (Long context pricing)
- Fast mode costs 2x standard on Opus 5.5 ($8 / $40). (Fast mode pricing)
- Newer tokenizer from Claude 4.7: about 30% more tokens for the same text. "This tokenizer produces approximately 30% more tokens for the same text." (Model pricing, note)
- Rough guide: 1 token is about 4 characters or 0.75 words in English. "1 token is approximately 4 characters or 0.75 words in English." (FAQ)
- Tools add hidden input tokens: a tool-use system prompt of 286 to 804 tokens depending on model and tool choice. "These token counts are added to your normal input and output tokens" (Tool use pricing)
- Worked example: Opus 5, 50,000 input and 15,000 output tokens: input $0.25, output $0.375. Output is less than a third of the tokens but most of the token cost. (Claude Managed Agents pricing, Worked example)
- No explanation of why output is priced higher appears anywhere on the page. (whole page)

## Visuals worth redrawing

- A bar per model: input price and output price side by side, showing the constant 5x. Main visual for token-pricing.

## My notes

- Thinking tokens being billed as output is stated on `anthropic-context-windows`, not here.
- Prices change often. Date every number.
- The OpenAI side, for a second provider, is in `openai-pricing`.
