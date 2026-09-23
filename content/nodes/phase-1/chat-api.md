---
id: chat-api
title: What does a chat API call look like?
depth: short
phase: 1
note: >-
  A list of messages with roles, sent every call. The model remembers nothing; some APIs store history for you, but you still pay for all of it.
needs: [context-window]
leads_to: [system-prompt, few-shot-prompting, structured-output, streaming]
compare_with: []
status: review
updated: 2026-09-23
---

# What does a chat API call look like?

Every chat app built on an LLM comes down to one HTTP request: a model name,
a limit on how long the answer can be, and a list of messages. The model
reads the list and writes the next message. Once you see that shape, most of
prompting is deciding what goes into that list.

## One request, one list of messages

Here's the smallest call to Claude, as of 2026-09:

```json
{
  "model": "claude-opus-5-5",
  "max_tokens": 1024,
  "messages": [
    {"role": "user", "content": "Hello, Claude"}
  ]
}
```

And what comes back:

```json
{
  "role": "assistant",
  "content": [{"type": "text", "text": "Hello!"}],
  "stop_reason": "end_turn",
  "usage": {"input_tokens": 12, "output_tokens": 6}
}
```

Three things to notice:

- **Each message has a role.** `user` is the person, `assistant` is the
  model. Instructions from you, the developer, go in a separate place,
  covered in [[system-prompt]].
- **Content can be a list of blocks.** Text is one block type. An image and a
  question can sit side by side in the same user message.
- **The reply tells you why it stopped and what it cost.** `stop_reason`
  says whether the model finished (`end_turn`) or hit your `max_tokens`
  limit. `usage` counts the tokens you'll be billed for.

OpenAI's APIs have the same shape: a list of alternating `user` and
`assistant` messages.

## The model remembers nothing between calls

Send a second message and the model has no idea what you said before. To
hold a conversation, you send the whole thing again every time:

```json
"messages": [
  {"role": "user", "content": "Hello, Claude"},
  {"role": "assistant", "content": "Hello!"},
  {"role": "user", "content": "Can you describe LLMs to me?"}
]
```

That call used 30 input tokens instead of 12. Each turn you add makes every
later call bigger, because the model reads the full history from the start
each time.

![Three request bodies for the same chat, side by side. Call 1 sends one user message and uses 12 input tokens. Call 2 sends that message again, plus the reply "Hello!" and a new question, and uses 30 input tokens. Call 3 sends all of that again plus the next reply and message, so its input is bigger still. Older messages are grey, new ones are highlighted.](img/chat-api-resend.svg)

Two consequences follow:

- **The conversation has to fit.** The whole list, plus the reply, has to
  fit in the model's [[context-window]]. Long chats eventually need
  trimming or summarizing.
- **The history is yours to edit.** The `assistant` turns don't have to be
  real. You can write them yourself, which is how you show the model worked
  examples (see [[few-shot-prompting]]).

## Some APIs store the history, but you still pay for it

"Stateless" is only half the story for OpenAI. Its Responses API can keep
the conversation on OpenAI's side. You pass `previous_response_id` to chain
onto the last reply, or create a Conversation object that lasts across
sessions. Responses are stored for 30 days by default (turn it off with
`store: false`), and Conversation objects don't expire.

This saves you from shipping the history over the wire. It doesn't change
what the model does. Every earlier input token in the chain is still
processed and billed as input on each new turn. Server-side history makes
your code simpler, and your bill stays the same.

Claude's Messages API doesn't store anything: you always send the full list.

## Where it gets tricky

**Old tricks stop working on new models.** A common trick was to start the
assistant's reply for it, say `"The answer is ("`, so the model would just
fill in a letter. On Claude 4.6 and later, that request returns a 400 error.
Use [[structured-output]] or plain instructions instead. As of 2026-09,
Claude 4.7 and later also reject non-default `temperature`, `top_p` and
`top_k`, so tutorials that set them will fail too.

**Where instructions go differs by provider.** Claude takes the system
prompt as a top-level `system` field, not a message. Newer Claude models
(Opus 4.8, Opus 5, Opus 5.5 and the 5-series Fable and Mythos models) also
accept a `system` message partway through a conversation, as long as it
isn't the first message. OpenAI handles developer instructions its own
way. Code written for one provider won't just work on the other.

## What this means when you build

- Your app owns the conversation. Store it, trim it, and resend it.
- Cost grows with conversation length even if each user message is short.
  Watch `usage` on every response.
- Check `stop_reason`. `max_tokens` means the answer was cut off.
- For long replies, you'll usually want [[streaming]] so text shows up as
  it's written.

## Further reading

- [Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages),
  Anthropic docs. The request and response shape, multi-turn history, the
  `system` field, and why prefill now fails.
- [Conversation state](https://developers.openai.com/api/docs/guides/conversation-state),
  OpenAI docs. Manual history vs `previous_response_id` and Conversations,
  retention, and the line on billing the whole chain.
