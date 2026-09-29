---
id: openai-rate-limits
title: Rate limits
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/rate-limits
published: undated           # no date on the page; mentions GPT-5.5 and GPT-5.6, so current as of the access date
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

How the OpenAI API limits usage: requests and tokens per minute and per day, set per organization and project and per model, with usage tiers that rise as you spend. It explains the `x-ratelimit-*` headers, the new `slow_down` 429 for ramping too fast, and how to retry: honour `Retry-After`, back off with jitter, cap attempts and total time, and don't stack your own retries on top of the SDK's. Read in full through the page's markdown version.

## Key claims

- Metrics: "RPM (requests per minute), RPD (requests per day), TPM (tokens per minute), TPD (tokens per day), IPM (images per minute)". Whichever is hit first applies: 20 requests of 100 tokens can fill a 20 RPM limit with TPM to spare. (How do these rate limits work?)
- Set "at the organization level" and project level, and vary by model; some model families share a limit. (same)
- Usage tiers by amount paid: Free and Tier 1 $100/month usage limit, up to Tier 5 ($1,000 paid) at $200,000/month. (Usage tiers)
- Headers: `Retry-After` ("The minimum number of seconds to wait before retrying a temporary rate-limit error, when present."), `x-ratelimit-limit-requests`, `x-ratelimit-remaining-tokens`, `x-ratelimit-reset-tokens` and others. (Rate limits in headers)
- `Retry-After` doesn't mean quota or billing errors can be fixed by retrying. (same)
- Ramp limits: `429 slow_down` when "Your request rate increased too quickly", even within RPM and TPM; "once your traffic reaches 1 million input tokens per minute (TPM), increase it by no more than 50% every 15 minutes." Overload is `503 server_is_overloaded`. (Handle rapid traffic increases and model overload)
- Streaming: "An error after streaming begins can arrive as a stream event; don't automatically replay a request after consuming output." (same)
- Treat `Retry-After` as a minimum: "wait at least that long and add a small random delay so multiple clients don't retry at the same time." (Retrying with exponential backoff)
- SDKs retry by themselves: "Each official OpenAI SDK automatically retries eligible `429` and `503` responses, subject to its retry settings." (same)
- Don't nest retries: "Limit both the number of attempts and the total time spent retrying. If you manage retries in your application, disable SDK retries or account for them in those limits so nested retry loops don't multiply requests." (same)
- Example retry setting with Tenacity: `@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(6))` (Example 1: Using the Tenacity library)
- Failed requests still count. "Note that unsuccessful requests contribute to your per-minute limit, so continuously resending a request won’t work." (same)
- `max_tokens` counts. "Your rate limit is calculated as the maximum of `max_tokens` and the estimated number of tokens based on the character count of your request." (Reduce the max_tokens)
- Batch API has its own queue limits and doesn't touch synchronous limits. (Batching requests)

## Visuals worth redrawing

- None on the page.

## My notes

- The prompt caching guide adds: cached input tokens still count toward TPM (`openai-prompt-caching`).
