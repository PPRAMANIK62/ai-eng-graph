---
id: anthropic-rate-limits
title: Rate limits
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/api/rate-limits
published: undated           # no date on the page; tier tables list Opus 5.5 and Fable 5.x, so current as of the access date
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

How the Claude API limits usage. Two kinds: monthly spend caps per tier, and rate limits in requests per minute (RPM), input tokens per minute (ITPM) and output tokens per minute (OTPM), per model class, enforced with a token bucket. Cached reads don't count toward ITPM on most models, and `max_tokens` doesn't count toward OTPM. A 429 comes with `retry-after`, except the spend-cap 429, which retrying won't fix. Read in full through the page's markdown version.

## Key claims

- Two kinds of limit: "Spend limits set a maximum monthly cost" and "Rate limits set the maximum number of API requests an organization can make over a defined period of time." (intro)
- Set per organization, by usage tier; new organizations may start in a lower Evaluation tier. (About rate limits)
- Short bursts can trip a per-minute limit: "a rate of 60 requests per minute (RPM) might be enforced as 1 request per second." (About rate limits)
- Token bucket. "your capacity is continuously replenished up to your maximum limit, rather than being reset at fixed intervals." (About rate limits)
- Spend caps per month: Start $500, Build $1,000, Scale $200,000. (Spend limits)
- The spend-cap 429 "has no `retry-after` header. Retrying, including the SDKs' automatic retries, fails until access resumes." Tell it apart by `error.details.error_code` = `enforced_spend_limit_reached`. (Reaching your spend cap)
- Three limits per model class, and the error: "If you exceed any of the rate limits you will get a 429 error describing which rate limit was exceeded, along with a `retry-after` header indicating how long to wait." (Rate limits)
- Acceleration limits: sharp increases in usage can also cause 429s; "ramp up your traffic gradually and maintain consistent usage patterns." (Rate limits, note)
- Cache-aware ITPM. "For most Claude models, only uncached input tokens count toward your ITPM rate limits." `input_tokens` and `cache_creation_input_tokens` count; `cache_read_input_tokens` don't (Haiku 3.5 is the exception). (Cache-aware ITPM)
- Worked example: "With a 2,000,000 ITPM limit and an 80% cache hit rate, you could effectively process 10,000,000 total input tokens per minute (2M uncached + 8M cached)". (Cache-aware ITPM)
- ITPM is estimated at the start of the request and adjusted as it runs. (Cache-aware ITPM)
- OTPM counts only real output. "The `max_tokens` parameter does not factor into OTPM rate limit calculations, so there is no rate limit downside to setting a higher `max_tokens` value." (Cache-aware ITPM)
- Limits are per model. "Rate limits are applied separately for each model; therefore you can use different models up to their respective limits simultaneously." (same)
- Start tier examples (RPM / ITPM / OTPM): Opus 5.5, Sonnet 5 and Haiku 4.5 each 1,000 / 2,000,000 / 400,000; Fable 5.x 1,000 / 500,000 / 100,000. (Start tier table)
- Headers: `retry-after` ("The number of seconds to wait until you can retry the request. Earlier retries will fail."), and `anthropic-ratelimit-requests-*`, `-input-tokens-*`, `-output-tokens-*` with limit, remaining and reset. (Response headers)

## Visuals worth redrawing

- A token bucket: capacity refilling continuously, requests draining it.

## My notes

- Contrast with OpenAI: OpenAI counts `max_tokens` toward the limit and counts cached tokens toward TPM.
