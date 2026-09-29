---
id: openai-streaming-responses
title: Streaming API responses
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/streaming-responses
published: undated
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

A short guide to streaming with OpenAI's Responses API. By default the whole output is generated before one HTTP response comes back; with `stream=true` you get typed server-sent events as the output is produced. It names the common events and warns that streamed output is harder to moderate.

## Key claims

- The default is all-at-once. "By default, when you make a request to the OpenAI API, we generate the model's entire output before sending it back in a single HTTP response." (intro)
- Why stream. "Streaming responses lets you start printing or processing the beginning of the model's output while it continues generating the full response." (intro)
- Transport: HTTP streaming over SSE; there's also a separate WebSocket mode. "This guide focuses on HTTP streaming (`stream=true`) over server-sent events (SSE)." (intro)
- Events are typed; some fire once, others many times. "Some key lifecycle events are emitted only once, while others are emitted multiple times as the response is generated." (Read the responses)
- Common events for text: `response.created`, `response.output_text.delta`, `response.completed`, `error`. (Read the responses)
- The text piece of a `response.output_text.delta` event is in its `delta` field, per the page's JavaScript example: "`process.stdout.write(event.delta);`" (Read the responses, code sample). The page shows no raw SSE lines or full event JSON.
- Tool calls and structured output can be streamed too (separate guides). (Advanced use cases)
- Moderation is harder. "partial completions may be more difficult to evaluate." (Moderation risk)
- Moderation scores come only at the end. "the scores arrive after the full generated output is available." (Moderation risk)

## Visuals worth redrawing

- None. The event list pairs well with Anthropic's flow in one side-by-side diagram.

## My notes

- This is the Responses API. Chat Completions uses a different chunk format (`chat.completion.chunk` with `choices[].delta`, ending in `data: [DONE]`), seen in `willison-streaming-llm-apis` (2024).
- The page doesn't say anything about latency numbers or time to first token.
