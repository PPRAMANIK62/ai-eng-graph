---
id: anthropic-streaming
title: Streaming messages
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/build-with-claude/streaming
published: undated
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

How Claude's Messages API streams a reply. Set `"stream": true` and the response arrives as server-sent events with named types: one `message_start`, then content blocks that each open, receive deltas and close, then `message_delta` and `message_stop`. The page covers text, tool-input and thinking deltas, pings, errors that arrive mid-stream, and how to resume a stream that broke.

## Key claims

- Turning it on. "When creating a Message, you can set `"stream": true` to incrementally stream the response using server-sent events (SSE)." (intro)
- SDKs need streaming for big outputs, even if you only want the final message. "This is especially useful for requests with large `max_tokens` values, where the SDKs require streaming to avoid HTTP timeouts." (Get the final message without handling events)
- Each event has an SSE event name and a matching `type` in its JSON. "Each server-sent event includes a named event type and associated JSON data." (Event types)
- The flow: `message_start` (a Message with empty `content`), then content blocks each with `content_block_start`, one or more `content_block_delta`, `content_block_stop`; then one or more `message_delta`; then `message_stop`. (Event types)
- Each block's `index` matches its position in the final `content` array. "Each content block has an `index` that corresponds to its index in the final Message `content` array." (Event types)
- Usage in `message_delta` is a running total. "The token counts shown in the `usage` field of the `message_delta` event are *cumulative*." (Event types, warning)
- Pings can appear anywhere. "Event streams may also include any number of `ping` events." (Ping events)
- Errors can arrive inside a stream that started with 200: e.g. `overloaded_error`, which would be HTTP 529 without streaming. "The API may occasionally send errors in the event stream." (Error events)
- Unknown event types may be added; handle them. "your code should handle unknown event types gracefully." (Other events)
- Text arrives as `text_delta` pieces, e.g. `"text": "ello frien"`, which don't line up with words. (Text delta)
- Tool inputs stream as partial JSON strings; parse once the block stops. "the deltas are *partial JSON strings*, whereas the final `tool_use.input` is always an *object*." (Input JSON delta)
- Tool input can pause: current models emit one complete key and value at a time, "there may be delays between streaming events while the model is working." (Input JSON delta, note)
- Thinking streams as `thinking_delta`, with a `signature_delta` just before the block closes. (Thinking delta)
- Example raw stream for "Hello": `message_start` (input_tokens 25), `content_block_start`, `ping`, two `text_delta` events ("Hello", "!"), `content_block_stop`, `message_delta` with `stop_reason: "end_turn"`, `message_stop`. (Basic streaming request, Response)
- Recovery after a dropped stream: save what arrived and ask for the rest. For Claude 4.5 and earlier, put the partial text in an assistant message; for 4.6 and later, send it in a user message with an instruction to continue. (Error recovery)
- Tool use and thinking blocks can't be partly recovered. "Tool use and extended thinking blocks cannot be partially recovered." (Error recovery best practices)

## Visuals worth redrawing

- The event flow as a nested timeline: message_start → [block 0: start, delta, delta, stop] → [block 1 …] → message_delta → message_stop, with pings sprinkled in. The main visual for the streaming article, next to OpenAI's flatter event list.

## My notes

- The recovery change at 4.6 lines up with prefill being removed on newer models (see `_candidates.md` chat-api note: prefilling the assistant turn returns a 400 on 4.6+).
- The "text delta" example ("ello frien") is a nice reminder that deltas are arbitrary chunks, not words or tokens you can rely on.
