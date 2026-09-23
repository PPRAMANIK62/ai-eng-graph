---
id: anthropic-context-windows
title: Context windows
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/build-with-claude/context-windows
published: undated           # no date on the page; lists Claude Opus 5.5, Fable 5.1 and Mythos 5.1, so current as of the access date
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

Anthropic's docs page on the context window: what it is, what counts toward it, how big it is per Claude model, what happens when a request overflows it, and how thinking and tool use fit in. It says plainly that more context isn't automatically better, because accuracy and recall drop as the token count grows ("context rot").

## Key claims

- Definition: all the text the model can refer to while answering, including the answer itself. "The "context window" refers to all the text a language model can reference when generating a response, including the response itself." (How the context window works)
- It's working memory, not the training data. "This is different from the large corpus of data the language model was trained on, and instead represents a "working memory" for the model." (How the context window works)
- Bigger isn't automatically better; accuracy and recall degrade with more tokens. "more context isn't automatically better. As token count grows, accuracy and recall degrade, a phenomenon known as *context rot*." (How the context window works)
- Each turn's input is the whole history plus the new message; earlier turns are kept in full. "each user message and assistant response accumulates within the context window, and previous turns are preserved completely." (How the context window works)
- The output becomes part of the next turn's input. "Generates a text response that becomes part of the input for the next turn" (How the context window works, Input-output flow)
- What counts: system prompt, every message (tool results, images, documents), tool definitions, and the output including thinking. "Everything in the request counts toward the context window" (How the context window works)
- Sizes as of 2026-09: Claude Fable 5.1, Mythos 5.1, Fable 5, Mythos 5, Opus 5.5, Opus 5, Opus 4.8, 4.7, 4.6, Sonnet 5, Sonnet 4.6 and Mythos Preview have 1M tokens and up to 128k output tokens per request; others, including Sonnet 4.5, have 200k. "A single request to any of them can generate up to 128k output tokens (`max_tokens`)." (Context window sizes by model)
- 1M is the default, no beta header, and billed at standard pricing. "1M is the default: you don't need a beta header" (Context window sizes by model)
- Up to 600 images or PDF pages per request (100 on 200k models); request size limits can hit before the token limit. "you might reach request size limits before the token limit." (Context window sizes by model)
- Thinking tokens count toward the window, are part of `max_tokens`, and are billed as output. "Thinking tokens are a subset of your `max_tokens` parameter, are billed as output tokens, and count toward rate limits." (The context window with thinking)
- Prompt caching changes the price of tokens, not whether they count. "prompt caching changes what you pay for those tokens, not whether they count." (Manage context with compaction)
- Overflow, input alone too long: a 400 error on every model. "If the input alone already exceeds the model's context window, the API returns a 400 `invalid_request_error` ("prompt is too long") on every model." (Context window overflow behavior)
- Overflow during generation (Claude 4.5 and newer): the request is accepted and generation stops at the limit. "it stops with `stop_reason: "model_context_window_exceeded"`." (Context window overflow behavior)
- Compaction summarizes earlier parts of the conversation on the server so it can continue past the limit (beta, Claude 4.6 and later). "Compaction automatically summarizes earlier parts of the conversation on the server, so the conversation can continue past the context window limit." (Manage context with compaction)
- Chat apps like claude.ai may instead drop the oldest turns. "can also manage the context window on a rolling "first in, first out" basis." (footnote 1)
- Some models (Sonnet 5, Sonnet 4.6, Sonnet 4.5, Haiku 4.5) are told their remaining budget after each tool call ("context awareness"). "these models track their remaining context window (their "token budget") throughout a conversation." (Context awareness)

## Visuals worth redrawing

- The context-window diagram (How the context window works): turns stacking up in the window until the conversation approaches the limit. Redraw as a bar that fills turn by turn, with output of turn N becoming input of turn N+1.
- The thinking-with-tools diagram: which blocks carry forward between turns. Too detailed for the context-window article; better for a thinking or tool-use node.

## My notes

- Undated page. Model list and prices change often; date any size quoted ("as of 2026-09").
- Whether earlier thinking blocks stay in context depends on the model (kept on Opus 4.5+, Sonnet 4.6+, Fable/Mythos 5.x; stripped on earlier models and Haiku). Too fiddly for the main article; mention only that thinking counts.
- The page links to Anthropic's context engineering post for why long context degrades (see `anthropic-context-engineering`).
- It agrees with Chroma and RULER that more tokens reduce accuracy, while also selling 1M windows at flat price. That's the tension worth explaining.
