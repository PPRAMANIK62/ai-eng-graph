---
id: openai-batch-api
title: Batch API
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/batch
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI's guide to its Batch API. You upload a JSONL file where each line is one request with a `custom_id`, create a batch with a 24-hour completion window, poll its status, and download an output file and an error file. It costs half the synchronous price and draws on a separate, larger rate-limit pool. It covers more than chat: embeddings, moderation and images too.

## Key claims

- Why. "Learn how to use OpenAI's Batch API to send asynchronous groups of requests with 50% lower costs, a separate pool of significantly higher rate limits, and a clear 24-hour turnaround time. The service is ideal for processing jobs that don't require immediate responses." (intro)
- Timing. "Each batch completes within 24 hours (and often more quickly)" (Overview list)
- Input: a `.jsonl` file, one request per line, each with a unique `custom_id`; the body takes the same parameters as the normal endpoint. (1. Prepare your batch file)
- Endpoints: `/v1/responses`, `/v1/chat/completions`, `/v1/embeddings`, `/v1/completions`, `/v1/moderations`, `/v1/images/generations`, `/v1/images/edits`. (1. Prepare your batch file)
- `completion_window: "24h"` when creating the batch. (3. Create the batch)
- Limits. "A single batch may include up to 50,000 requests, and a batch input file can be up to 200 MB in size." Up to 2,000 batches per hour; per-model caps on queued prompt tokens. (Rate limits)
- Separate pool. "Because Batch API rate limits are a new, separate pool, using the Batch API will not consume tokens from your standard per-model rate limits" (Rate limits)
- Order. "Note that the output line order may not match the input line order. Instead of relying on order to process your results, use the custom_id field" (5. Retrieve the results)
- Expiry. "Batches that do not complete in time eventually move to an expired state; unfinished requests within that batch are cancelled, and any responses to completed requests are made available via the batch's output file." Completed requests are billed. (Batch expiration)
- Retention. "The output file will automatically be deleted 30 days after the batch is complete." (5. Retrieve the results)
- Statuses: validating, in_progress, finalizing, completed, expired, cancelling, cancelled, failed. (4. Check the status of a batch)

## Visuals worth redrawing

- None beyond the flow shared with Anthropic's version.

## My notes

- Same deal as Anthropic (half price, 24h) with different limits: 50,000 requests / 200 MB here vs 100,000 / 256 MB there.
