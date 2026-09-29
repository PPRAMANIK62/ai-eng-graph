---
id: rate-limits
title: How do LLM rate limits work?
depth: short
phase: 6
note: >-
  Provider limits on requests and tokens per minute, and designing around them.
needs: [chat-api]
leads_to: [retries]
compare_with: []
updated: 2026-09-29
---

# How do LLM rate limits work?

Every LLM provider caps how much your organization can send through its
[[chat-api|API]]: how many requests, and how many tokens, per minute. Go over and the call fails with
HTTP 429 instead of an answer. The limits are counted in tokens as well as
requests, and each provider counts them a bit differently, so the same
traffic can fit under one provider's limit and not another's.

## Three numbers, not one

A plain web API usually limits requests per second. An LLM call can be 50
tokens or 200,000, so providers limit tokens too. On the Claude API there
are three separate limits for each model class:

- **RPM**, requests per minute.
- **ITPM**, input tokens per minute.
- **OTPM**, output tokens per minute.

OpenAI uses requests and tokens per minute (RPM, TPM) plus daily versions
(RPD, TPD). Whichever limit you hit first stops you. With a 20 RPM limit,
20 tiny requests of 100 tokens each block the 21st, even with almost all
your tokens per minute unused.

For a sense of size, as of 2026-09, an organization on Anthropic's entry
Start tier gets 1,000 RPM, 2,000,000 ITPM and 400,000 OTPM on Claude Sonnet
5. The limits are per organization, not per user or API key, so every
feature and every developer shares one pool. They're also per model, so
traffic on one model doesn't eat into another's. Limits rise with usage
tiers as you spend more.

## A bucket that refills, not a counter that resets

"Per minute" suggests a counter that goes back to zero at the top of each
minute. It doesn't work that way. The Claude API uses a token bucket: your
capacity refills continuously up to the maximum. Send a burst and you
drain the bucket, then capacity trickles back.

This has a practical side effect. A limit of 60 requests per minute can be
enforced as about one per second, so a burst fired in the same second
can fail even though you're far under 60 for the minute. Spread traffic
out.

![A token bucket for a limit of 60 requests per minute. The bucket holds up to the limit and refills continuously at about one per second. A burst of requests drains it, and requests arriving while it's empty get a 429 with a retry-after header saying how long to wait. Below, a second kind of 429: the monthly spend cap. It has no retry-after header, and retrying fails until the next month or a higher tier.](img/rate-limits-bucket.svg)

Two more kinds of 429 look like a rate limit but aren't one:

- **Ramping too fast.** Both providers also limit how fast your usage
  grows. A sudden jump can get 429s while you're under every per-minute
  limit. OpenAI's rule of thumb, as of 2026-09: past 1 million input tokens
  per minute, grow by at most 50% every 15 minutes.
- **Running out of money.** Anthropic's tiers have monthly spend caps
  ($500 on Start, as of 2026-09). Hitting one returns a 429 too, but with
  no `retry-after` header and an error code of
  `enforced_spend_limit_reached`. Retrying fails until the next month starts or you move up a tier.

## What counts toward the limit differs

This is where providers diverge, and where estimates go wrong.

**Cached tokens.** On Claude, input read from the [[prompt-caching|prompt
cache]] doesn't count toward ITPM on most models. With a 2 million ITPM
limit and 80% of input cached, you can process 10 million input tokens a
minute. On OpenAI, cached input tokens still count toward TPM.

**`max_tokens`.** On Claude, OTPM counts only the tokens the model really
writes, so a high `max_tokens` costs nothing against the limit. On OpenAI,
each request counts as the larger of `max_tokens` and an estimate of its
input, so a generous `max_tokens` on every call eats your limit before a
token is written. Set it close to the answer length you expect.

**Failed requests.** On OpenAI, requests that fail still count toward the
per-minute limit, so hammering the API after a 429 only makes it worse.

## Reading where you stand

Every response tells you how much room is left. Claude sends
`anthropic-ratelimit-requests-remaining`, `-input-tokens-remaining` and
`-output-tokens-remaining`, with a reset time for each. OpenAI sends
`x-ratelimit-remaining-requests` and `x-ratelimit-remaining-tokens`. A 429
carries `retry-after`, the number of seconds to wait. Treat it as a
minimum: retrying earlier fails. How to retry well is its own topic, in
[[retries]].

## What this means when you build

- Estimate your peak tokens per minute, input and output separately, and
  compare with your tier before launch, not after.
- Cache long stable prompts. On Claude it raises your effective input limit
  as well as cutting cost.
- On OpenAI, set `max_tokens` close to the real answer length.
- Ramp new traffic up gradually, and spread bursts out instead of firing
  them in the same second.
- Read the remaining-capacity headers and slow down before you hit zero,
  instead of waiting for 429s.
- Tell a spend-cap 429 apart from a rate-limit 429 by its error code, and
  alert a human instead of retrying.
- Send work that can wait to the [[batch-api]]. On OpenAI, batch jobs have
  their own queue limit and don't touch your live limits.

## Further reading

- [Rate limits](https://platform.claude.com/docs/en/api/rate-limits),
  Anthropic docs. The token bucket, RPM/ITPM/OTPM, cache-aware limits, spend
  caps, tier tables and headers.
- [Rate limits](https://developers.openai.com/api/docs/guides/rate-limits),
  OpenAI docs. RPM/TPM/RPD/TPD, usage tiers, ramp limits, headers, and how
  `max_tokens` and failed requests count.
