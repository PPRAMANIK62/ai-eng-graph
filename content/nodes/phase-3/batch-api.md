---
id: batch-api
title: What is a batch API?
depth: short
phase: 3
note: >-
  Send many requests at once, get the results within hours, pay about half.
needs: [chat-api]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# What is a batch API?

A batch API takes many model requests as one job and returns the results
later instead of right away. As of 2026-09, both Anthropic and OpenAI
charge half the normal price for it and give each batch a 24-hour window
(on Anthropic, most batches finish in under an hour). If no person is
waiting on the answer, you're paying double to run it any other way.

## Same requests, delivered differently

Say you want to label 20,000 old support tickets with the
[[classification]] prompt you just built, or rerun your eval set against a
new model. Each of those is an ordinary [[chat-api]] request. A batch just
bundles them:

1. **Build the list.** Each request gets a `custom_id` you choose, like
   `ticket-18342`, plus the usual body: model, messages, `max_tokens`. On
   OpenAI the list is a JSONL file (one request per line) that you upload
   first. On Anthropic you send the list in the create call.
2. **Create the batch.** OpenAI asks for a completion window, which is
   `"24h"`.
3. **Poll.** The batch moves through states until it's done: on Anthropic
   from `in_progress` to `ended`; on OpenAI through `validating`,
   `in_progress` and `finalizing` to `completed` (or `expired`, `failed`,
   `cancelled`).
4. **Fetch the results** and match each one to its request by
   `custom_id`. Results can come back in any order, so never rely on
   position.

![How a batch runs. You build a list of ordinary requests, each with a custom_id such as ticket-1, ticket-2 and ticket-3. You submit it as one batch and poll its status. Most batches finish within an hour; anything not done in 24 hours expires. Results come back as a file in any order, for example ticket-3, ticket-1, ticket-2, and you match them to requests by custom_id. Each result is succeeded, errored, canceled or expired. Everything is billed at 50% of the normal price.](img/batch-api-flow.svg)

## What you get and what you give up

| | Anthropic (Message Batches) | OpenAI (Batch API) |
|---|---|---|
| Price | 50% of standard, input and output | 50% of standard |
| Turnaround | most under 1 hour; expires at 24 hours | within 24 hours, often sooner |
| Size limit | 100,000 requests or 256 MB | 50,000 requests or 200 MB |
| Covers | Messages requests, incl. tools and vision | Responses, chat, embeddings, moderation, images |
| Results kept | 29 days | output file deleted 30 days after completion |

For a sense of the prices (see [[token-pricing]]): as of 2026-09, Claude
Haiku 4.5 in a batch costs $0.50 per million input tokens and $2.50 per
million output tokens.

What you give up is time and interactivity. There's no
[[streaming]]: results come back as a file. And you can't count on a fast
answer, only on one within the window.

On OpenAI there's a second benefit: batch requests use a separate
rate-limit pool, so a big batch doesn't eat into the limits your live
traffic needs (see [[rate-limits]]). Anthropic has batch-specific rate
limits too, on how many requests can sit waiting.

## Where it gets tricky

**Some requests may not finish.** Anything not done in 24 hours expires.
Under heavy demand, processing can slow down and more requests expire. On
OpenAI, an expired batch still returns the requests that did complete (and
you pay for those). Plan to collect the expired ones and resubmit.

**Mistakes show up late.** On Anthropic, each request's parameters are
checked only when the whole batch has run, so a typo in the request shape
can cost you a full wait. Send one request through the normal API first to check it.

**Failures are per request.** One bad request doesn't sink the batch. On
Anthropic, each result is `succeeded`, `errored`, `canceled` or `expired`,
and you're not billed for the last three. Handle all four.

**Caching still works, but less reliably.** The batch discount and
[[prompt-caching]] stack. But requests in a batch run concurrently and in
any order, so cache hits are best effort: typically 30% to 98%, depending
on traffic. Keep the shared part (a long system prompt, a document)
identical in every request, and consider the 1-hour cache, since a batch
can take longer than the 5-minute cache lifetime.

## What this means when you build

- Run eval sets, backfills and bulk extraction or classification through
  the batch API. Keep the live API for anything a user is waiting on.
- Give every request a meaningful `custom_id`, and join results on it.
- Handle every result type, and resubmit expired requests.
- Test one request through the normal API before submitting thousands.

## Further reading

- [Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing),
  Anthropic, undated. Limits, timing, result types, pricing per model,
  and how prompt caching behaves inside a batch.
- [Batch API](https://developers.openai.com/api/docs/guides/batch),
  OpenAI, undated. The JSONL file format, supported endpoints, the
  separate rate-limit pool, and what happens when a batch expires.
