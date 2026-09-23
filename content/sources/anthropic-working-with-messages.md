---
id: anthropic-working-with-messages
title: Using the Messages API
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/build-with-claude/working-with-messages
published: undated           # no date on the page; examples use claude-opus-5-5, so current as of 2026-09
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

Anthropic's guide to the basic shape of a Claude API call. A request is a model name, a `max_tokens` limit and a list of `messages`, each with a `role` and `content`. The API is stateless: every call carries the whole conversation, and earlier assistant turns can be written by you. The system prompt is a separate top-level `system` field, and newer models also accept `system` messages partway through a conversation. Prefilling the assistant's reply no longer works on Claude 4.6 and later.

## Key claims

- A basic request is `model`, `max_tokens` and `messages`, each message a `role` and `content`. Example body: `{"model": "claude-opus-5-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hello, Claude"}]}` sent to `https://api.anthropic.com/v1/messages`. (Basic request and response)
- The reply is a message with `role: "assistant"`, a `content` list of blocks (`{"type": "text", "text": "Hello!"}`), a `stop_reason` (`"end_turn"`) and `usage` with `input_tokens: 12, output_tokens: 6`. (Basic request and response, Output)
- The API keeps nothing between calls. "The Messages API is stateless, which means that you always send the full conversational history to the API." (Multiple conversational turns)
- Earlier assistant turns can be made up by you. "Earlier conversational turns don't necessarily need to actually originate from Claude. You can use synthetic `assistant` messages." (Multiple conversational turns)
- The three-turn example (user "Hello, Claude", assistant "Hello!", user "Can you describe LLMs to me?") reports `input_tokens: 30`, versus 12 for the single-turn call, because the whole history is sent again. (Multiple conversational turns, Output)
- System instructions that apply from the start go in a top-level field. "Use the top-level `system` field for instructions that apply from the start." (System role in messages)
- On newer models (Claude Fable 5.1, Mythos 5.1, Fable 5, Mythos 5, Opus 5.5, Opus 4.8, Opus 5) you can add a `"role": "system"` message after a user turn, but not as the first message. "A `system` message cannot be the first entry in `messages`." (System role in messages)
- A mid-conversation system message carries the same weight and doesn't break the cache. "A mid-conversation system message has the same authority as the top-level `system` field" and "it does not invalidate any cached prefix that came before it." (System role in messages)
- Prefill (starting Claude's reply for it) is gone on new models. "Prefilling is not supported on Claude 4.6 and later models and Claude Mythos Preview. Requests using prefill with these models return a 400 error." It points to structured outputs or system prompt instructions instead. (Prefilling Claude's response, Warning)
- The old prefill example: assistant message `"The answer is ("` with `max_tokens: 1` returned `"C"` with `stop_reason: "max_tokens"` on claude-sonnet-4-5. (Prefilling Claude's response)
- Sampling knobs are off on newer models. "The `temperature`, `top_p`, and `top_k` sampling parameters are not supported on Claude 4.7 and later models and Claude Mythos Preview." (Basic request and response, Note)
- Content can be a list of blocks, e.g. an `image` block plus a `text` block in one user message; the image example used 1,030 input tokens. (Vision)

## Visuals worth redrawing

- No diagrams. The single-turn vs three-turn example makes a good side-by-side: same endpoint, the messages list grows, `input_tokens` goes 12 → 30.

## My notes

- The page never says "the model remembers nothing" in those words; "stateless" plus "always send the full conversational history" is the claim.
- Contrast with OpenAI's Responses API (`openai-conversation-state`), which can store history server-side. Both still process (and bill) the whole history each call.
- Model names on the page (Fable, Mythos, Opus 5.5) date it to 2026; date anything model-specific in an article.
- Prefill removal matters for older tutorials that use it to force JSON; they break on new models.
