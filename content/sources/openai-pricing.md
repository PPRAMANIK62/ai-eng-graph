---
id: openai-pricing
title: Pricing
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/pricing
published: undated           # no date on the page; mentions a 2026-07-30 rename, so current as of the access date
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

OpenAI's API price list. Its current flagship text models (the GPT-6 family) also charge 5x more for output than input at standard context lengths, with cached input at a tenth of the input price and batch at half price. Unlike Anthropic, it has separate, higher "long context" prices. It doesn't explain why output costs more.

## Key claims

- Standard prices per million tokens, short context (input / cached input / output): gpt-6-astra $10 / $1 / $50; gpt-6-sol $2 / $0.20 / $10; gpt-6-luna $0.10 / $0.01 / $0.50. gpt-6-sol row: "$2.00 | $0.20 | $2.50 | $10.00 | $4.00 | $0.40 | $5.00 | $15.00" (Flagship models, Standard)
- So output is 5x input at short context (my arithmetic).
- The table has separate short-context and long-context columns. Long context for gpt-6-sol: $4 input, $15 output, so long input costs 2x and long output 1.5x. (Flagship models, Standard; column headers)
- The page doesn't state the token count where "long context" starts (not found in what I opened).
- Batch is half price, for example gpt-6-sol batch: $1 input, $5 output. "| gpt-6-sol | $1.00 | $0.10 | $1.25 | $5.00 |" (Batch tab)
- Tiers: Standard, Batch, Flex and Fast mode; "Priority processing was renamed Fast mode on July 30, 2026." (tabs)
- Data residency endpoints cost 10% more for models released on or after 2026-03-05. "Regional processing (data residency) endpoints are charged a 10% uplift" (footnote)
- No explanation of why output costs more than input. (whole page)

## Visuals worth redrawing

- None on the page.

## My notes

- openai.com/api/pricing returned 403 in earlier research; this developers.openai.com page loaded.
- The tables were read through a summarizing fetch; the gpt-6-sol row was re-fetched and returned word for word.
- I didn't find anything about reasoning tokens on the page, so don't claim how OpenAI bills them from this note.
