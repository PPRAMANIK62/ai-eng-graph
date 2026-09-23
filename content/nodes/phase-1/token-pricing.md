---
id: token-pricing
title: Why do output tokens cost more?
depth: short
phase: 1
note: >-
  Why output tokens cost several times more than input tokens.
needs: [prefill-decode]
leads_to: []
compare_with: []
status: review
updated: 2026-09-23
---

# Why do output tokens cost more?

LLM APIs charge per token, with one price for the tokens you send and a
higher one for the tokens the model writes. As of 2026-09, Anthropic and OpenAI
both charge 5 times as much for output as for input. That ratio decides where
your bill comes from, and it's worth knowing why it might exist, even though
no provider says.

## Two prices on every model

Here's what a million tokens cost on 2026-09-23:

| Model | Input | Output | Ratio |
|---|---|---|---|
| Claude Haiku 4.5 | $1 | $5 | 5x |
| Claude Sonnet 5 | $2 | $10 | 5x |
| Claude Opus 5.5 | $4 | $20 | 5x |
| OpenAI gpt-6-luna | $0.10 | $0.50 | 5x |
| OpenAI gpt-6-sol | $2 | $10 | 5x |
| OpenAI gpt-6-astra | $10 | $50 | 5x |

Every Claude model on Anthropic's list has the same 5x ratio, and so do
OpenAI's GPT-6 models at normal context lengths. Only the base price
changes.

![Paired bars of input and output price per million tokens on 2026-09-23, on a log scale: gpt-6-luna $0.10 and $0.50, Claude Haiku 4.5 $1 and $5, Claude Sonnet 5 $2 and $10, gpt-6-sol $2 and $10, Claude Opus 5.5 $4 and $20, gpt-6-astra $10 and $50. Output is 5 times input on every model.](img/token-pricing-input-output-prices.svg)

## What that does to a bill

Anthropic's own worked example: a session on Claude Opus 5 with 50,000 input
tokens and 15,000 output tokens. Input costs $0.25. Output costs $0.375.
Output is less than a quarter of the tokens but most of the token cost.

So when you estimate cost, don't just count tokens. Weight them:

> cost ≈ input tokens × input price + output tokens × 5 × input price

## Why output might cost more

Neither Anthropic nor OpenAI explains the ratio on its pricing page. What
follows is our inference from how models run, not a stated reason.

Recall the two stages of a call from [[prefill-decode]]:

- **Prefill** reads all your input tokens at once, in parallel. The GPU is
  kept busy doing useful math.
- **Decode** writes output tokens one at a time. Each one needs its own
  pass, and each pass is limited by how fast the model's weights can be read
  from memory, not by how fast the GPU can calculate.

The result is a big gap in time per token. In one set of measurements,
adding 512 input tokens added less latency than generating 8 more output
tokens. If a provider's cost is mostly GPU time, an output token uses far
more of it than an input token does. A higher output price would follow.

Two cautions about that reasoning. The measured time gap is much bigger than
5x (one output token added more delay than 64 input tokens), so prices
don't track that gap directly. Servers also
batch many users' requests together, which raises total throughput and
spreads the cost. So treat the 5x as a pricing choice that points the same
way as the hardware, not as a measure of what a token costs to make.

## Discounts that change the picture

The per-token price isn't the whole story. As of 2026-09:

- **Cached input** costs a tenth of the normal input price on most models,
  on both providers (a twentieth on Claude Opus 5.5). Writing to the cache
  costs extra on Claude: 1.25x for 5 minutes, 2x for an hour.
- **Batch jobs**, which run in the background instead of right away, are 50%
  off both input and output on both providers.
- **Long context** is priced differently. Anthropic bills a 900k-token
  request at the same per-token rate as a 9k one. OpenAI has separate,
  higher long-context prices: gpt-6-sol goes to $4 input and $15 output.
- **Tokenizer changes** move the bill too. Claude models from 4.7 on produce
  about 30% more tokens for the same text.

## What this means when you build

- **Control output length.** Set a sensible `max_tokens`, and ask for short
  answers when that's all you need. Output is the expensive side.
- **Long input is often fine.** Sending a big document costs less than you'd
  guess next to a long answer, and caching cuts repeated input further.
- **Date your cost estimates.** Prices change often. Recheck them when you
  switch models.

## Further reading

- [Pricing](https://platform.claude.com/docs/en/about-claude/pricing),
  Anthropic docs. Claude prices, caching and batch multipliers, and a worked
  cost example.
- [Pricing](https://developers.openai.com/api/docs/pricing), OpenAI docs.
  A second provider with the same 5x ratio, plus long-context prices.
- [LLM Inference Performance Engineering: Best Practices](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices),
  Databricks, 2023. Why output tokens take so much longer than input tokens.
