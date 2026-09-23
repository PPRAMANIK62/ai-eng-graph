---
id: openai-conversation-state
title: Conversation state
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/conversation-state
published: undated           # no date on the page; examples use gpt-6-astra, so current as of 2026-09
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

OpenAI's guide to multi-turn conversations. Each request is stateless underneath, so you can resend the history yourself as alternating `user` and `assistant` messages. The Responses API can also keep state for you: chain calls with `previous_response_id`, or keep a durable Conversation object. Either way, all earlier input tokens are still billed as input on every turn.

## Key claims

- Each call is independent. "While each text generation request is independent and stateless, you can still implement multi-turn conversations by providing additional messages as parameters to your text generation request." (Manually manage conversation state)
- Doing it by hand means resending alternating turns. "By using alternating `user` and `assistant` messages, you capture the previous state of a conversation in one request" (Manually manage conversation state)
- OpenAI steers you to the Responses API because it holds state. "We recommend using the Responses API instead. Because it's stateful, managing context across conversations is a simple parameter." (Manually manage conversation state)
- Chaining with `previous_response_id`. "This parameter lets you chain responses and create a threaded conversation." (Passing context from the previous response)
- The Conversations API stores a long-lived conversation. "The Conversations API works with the Responses API to persist conversation state as a long-running object with its own durable identifier." It stores items: "messages, tool calls, tool outputs, and other data." (Using the Conversations API)
- Storage and retention. "Response objects are saved for 30 days by default." You can turn it off: "setting `store` to `false` when creating a Response." Conversations don't expire: "Conversation objects and items in them are not subject to the 30 day TTL." (Data retention for model responses)
- You still pay for the full history. "Even when using `previous_response_id`, all previous input tokens for responses in the chain are billed as input tokens in the API." (Data retention for model responses)
- The context window limit covers everything in one request. "The context window is the maximum number of tokens that can be used in a single request. This max tokens number includes input, output, and reasoning tokens." (Managing the context window)
- Overflow gets cut. "Tokens generated in excess of the context window limit may be truncated in API responses" (Managing the context window)
- Code examples use the model `gpt-6-astra` with `client.responses.create(...)` and `store: true`. (Passing context from the previous response)

## Visuals worth redrawing

- None on the page. Worth drawing: two timelines, "you resend history" vs "server keeps history (previous_response_id)", with the same growing input-token bar under both, to show the bill doesn't change.

## My notes

- This is the counterpoint to Anthropic's "stateless" framing: the API can hold state, but the model still reads the whole history each turn and you pay for it.
- Chat Completions (the older endpoint) is the manual one; Responses is the stateful one.
- Compaction is mentioned but moved to a separate page; not read here.
