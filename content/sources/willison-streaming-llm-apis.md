---
id: willison-streaming-llm-apis
title: How streaming LLM APIs work
author: Simon Willison
url: https://til.simonwillison.net/llms/streaming-llm-apis
published: 2024-09-21
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

A hands-on note that calls the OpenAI, Anthropic and Gemini streaming APIs with curl and shows the raw bytes that come back. All three use `text/event-stream`, with `data:` lines of JSON separated by blank lines; Anthropic adds `event:` lines. He points out that the browser's `EventSource` can't read them because they're POST requests, and gives a fetch-based parser instead.

## Key claims

- The common pattern. "they return data with a content-type: text/event-stream header, which matches the server-sent events mechanism, then stream blocks separated by \r\n\r\n." (The general pattern)
- Anthropic adds event names. "Each block has a data: JSON line. Anthropic also include a event: line with an event type." (The general pattern)
- Why EventSource doesn't work. "Annoyingly these can't be directly consumed using the browser EventSource API because that only works for GET requests, and these APIs all use POST." (The general pattern)
- OpenAI Chat Completions (gpt-4o-mini, 2024): each chunk is `chat.completion.chunk` with `choices[].delta.content` holding a word or two ("Why", " did"); the stream ends with `data: [DONE]`. (OpenAI)
- OpenAI sends token usage only if you ask, as a final chunk. "The "stream_options": {"include_usage": true} bit requests that the final message in the stream include details of how many input and output tokens were charged" (OpenAI)
- Anthropic (Claude 3 Sonnet, 2024): message_start, content_block_start, ping, text_delta chunks, content_block_stop, message_delta, message_stop. (Anthropic Claude)
- Gemini sends bigger chunks. "Google Gemini returns much larger tokens chunks" (Google Gemini)
- Gemini streams SSE only when asked with `alt=sse` on the `streamGenerateContent` URL. (Google Gemini, curl example)
- In the browser, use `fetch()`, read the body stream, split on blank lines, and parse `data:` lines yourself. (Bonus 2: Processing streaming events in JavaScript with fetch())
- Decode bytes with `stream: true` so multi-byte characters split across chunks come out right (comment in his fetch code). (Bonus 2)

## Visuals worth redrawing

- The three raw streams side by side (OpenAI chunks, Anthropic named events, Gemini big chunks). Redraw trimmed to 4–5 lines each.

## My notes

- Created 2024-09-21, updated 2024-09-22. Model names (gpt-4o-mini, claude-3-sonnet-20240229, gemini-pro) are from 2024; the general shape still matches 2026 docs, but OpenAI now also has the Responses API with typed events (`openai-streaming-responses`).
- Not primary, but it's real captured output, which the docs don't give for all three.
