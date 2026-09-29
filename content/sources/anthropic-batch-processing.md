---
id: anthropic-batch-processing
title: Batch processing
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/build-with-claude/batch-processing
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The guide to Anthropic's Message Batches API. You send up to 100,000 ordinary Messages requests in one batch, each with a `custom_id`; they run asynchronously, most batches finish within an hour, anything not done in 24 hours expires, and every token costs half the normal price. Results come back in any order and are kept for 29 days. Prompt caching works inside batches, but only on a best-effort basis.

## Key claims

- What it's for. "This approach is well-suited to tasks that do not require immediate responses, with most batches finishing in less than 1 hour while reducing costs by 50% and increasing throughput." (Message Batches API)
- Price. "All usage is charged at 50% of the standard API prices." Example: Claude Haiku 4.5 batch $0.50 / MTok input, $2.50 / MTok output; Sonnet 5.5 $1 / $5. (Pricing)
- Use cases: large-scale evaluations, content moderation, data analysis, bulk content generation. (How the Message Batches API works)
- Limits. "A Message Batch is limited to either 100,000 Message requests or 256 MB in size, whichever is reached first." (Batch limitations)
- Timing. "The system processes each batch as fast as possible, with most batches completing within 1 hour." "Batches expire if processing does not complete within 24 hours." (Batch limitations)
- Retention. "Batch results are available for 29 days after creation." (Batch limitations)
- Under load, "processing may be slowed down based on current demand and your request volume. In that case, you may see more requests expiring after 24 hours." (Batch limitations)
- Almost anything can be batched, including tool use, vision, system messages, multi-turn and extended thinking; `stream: true` is not supported ("Batch results come back as a single file, not a stream."). (What can be batched)
- Validation is asynchronous: bad `params` show up as errors only when the whole batch has ended; dry-run one request with the Messages API first. (Prepare and create your batch; Best practices)
- Statuses: `processing_status` starts `in_progress` and becomes `ended`. Each request's result is `succeeded`, `errored`, `canceled` or `expired`; errored, canceled and expired requests aren't billed. (Tracking your batch; Retrieving batch results)
- Order. "Batch results can be returned in any order, and may not match the ordering of requests when the batch was created." Match on `custom_id`. (Retrieving batch results)
- One failure doesn't sink the batch. "Note that the failure of one request in a batch does not affect the processing of other requests." (Troubleshooting common issues)
- Caching stacks with the batch discount but is best effort: "Users typically experience cache hit rates ranging from 30% to 98%, depending on their traffic patterns." "Because batches can take longer than 5 minutes to process, consider using the 1-hour cache duration with prompt caching for better cache hit rates"; cache entries otherwise expire "after their 5-minute lifetime". (Using prompt caching with Message Batches; tip under What can be batched)
- Batch rate limits: "Rate limits apply to both Batches API HTTP requests and the number of requests within a batch waiting to be processed." (Batch limitations)
- Creating a batch: `client.messages.batches.create(requests=[...])`, each entry a `custom_id` plus `params` holding a normal Messages request. (Prepare and create your batch)

## Visuals worth redrawing

- Submit, poll, fetch results; results out of order, matched by `custom_id`.

## My notes

- Handy for running eval sets and backfills cheaply. Not for anything a user is waiting on.
