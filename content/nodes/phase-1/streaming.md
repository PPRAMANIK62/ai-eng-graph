---
id: streaming
title: How does streaming work?
depth: deep
phase: 1
note: >-
  Sending tokens to the client as they come out, over server-sent events.
needs: [prefill-decode, chat-api]
leads_to: [streaming-ui, text-to-speech]
compare_with: []
updated: 2026-09-23
---

# How does streaming work?

Streaming means the API sends you the model's reply in small pieces while
it's still being written, instead of one big response at the end. That's
why chat apps show text appearing word by word. Every major LLM API does
it the same basic way, over server-sent events, but the events themselves
differ by provider, and the browser's built-in tool for server-sent events
can't read them.

## Without streaming, you wait for the whole answer

A normal call to the [[chat-api]] is one HTTP request and one HTTP
response. The provider generates the model's entire output first, then
sends it back in one piece. For a short answer that's fine. For a long one,
your user stares at a spinner the whole time the model is writing.

The model doesn't produce its answer all at once anyway. It reads your
prompt, then writes the reply one token at a time (the two stages are
explained in [[prefill-decode]]). Streaming just passes those pieces on as
they're made. You flip one flag, `"stream": true`, on the same request, and
you can start showing or processing the beginning of the reply while the
rest is still being generated.

Streaming doesn't make the model write faster. The whole reply still takes
as long to generate. What changes is when the first words reach the user.

## What arrives on the wire

The response comes back with the content type `text/event-stream`. That's
the server-sent events (SSE) format from the HTML standard, and it's plain
text. Each event is a few lines like `event: ...` and `data: ...`, and a
blank line ends the event. Lines starting with a colon are comments and get
ignored. The stream is always UTF-8.

Here's a real Claude stream for the prompt "Hello", trimmed:

```
event: message_start
data: {"type": "message_start", "message": {"content": [], "usage": {"input_tokens": 25, "output_tokens": 1}, ...}}

event: content_block_start
data: {"type": "content_block_start", "index": 0, "content_block": {"type": "text", "text": ""}}

event: ping
data: {"type": "ping"}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "Hello"}}

event: content_block_delta
data: {"type": "content_block_delta", "index": 0, "delta": {"type": "text_delta", "text": "!"}}

event: content_block_stop
data: {"type": "content_block_stop", "index": 0}

event: message_delta
data: {"type": "message_delta", "delta": {"stop_reason": "end_turn"}, "usage": {"output_tokens": 15}}

event: message_stop
data: {"type": "message_stop"}
```

To show the reply, you glue the `text` pieces together in order. Everything
else tells you where you are in the message.

![A timeline of one streamed Claude reply. Your app sends one POST. The API sends back events over time: message_start, content_block_start, a ping, a text delta "Hello", a text delta "!", content_block_stop, message_delta with stop reason end_turn, and message_stop. Below, the text on screen goes from empty to "Hello" to "Hello!". The gap before the first text delta is the time to first text; the whole span takes as long as it would without streaming.](img/streaming-timeline.svg)

## Each provider shapes the events differently

SSE is only the envelope. What goes inside is up to each provider, so your
parser is provider-specific.

**Claude** nests things. The flow is always the same:

1. `message_start`, carrying a message with empty `content`.
2. One or more content blocks. Each has a `content_block_start`, one or more
   `content_block_delta` events, and a `content_block_stop`. A block's
   `index` is its position in the final message's `content` list, so a text
   block and a tool call can each be tracked separately.
3. One or more `message_delta` events with top-level changes such as the
   stop reason and token usage.
4. `message_stop`.

`ping` events can appear anywhere. The deltas come in types: `text_delta`
for text, `input_json_delta` for a tool call's arguments, and
`thinking_delta` for the model's thinking when that's turned on.

**OpenAI's Responses API** uses a flat list of typed events instead. For
plain text, the ones you care about are `response.created`, many
`response.output_text.delta`, `response.completed`, and `error`. Some fire
once, others many times.

**OpenAI's older Chat Completions API** has no event names at all. Every
line is `data:` followed by a `chat.completion.chunk` whose
`choices[0].delta.content` holds the next bit of text, and the stream ends
with the literal line `data: [DONE]`. Token usage only shows up if you ask
for it with `stream_options: {"include_usage": true}`, as one last chunk.

**Gemini** (in a 2024 test) only sent SSE when asked with `alt=sse` on its
`streamGenerateContent` URL, and sent much bigger chunks than the others.

| | Claude | OpenAI Responses | OpenAI Chat Completions |
|---|---|---|---|
| Event names | Yes (`event:` lines) | Yes (in `type`) | No |
| Text pieces | `text_delta` | `response.output_text.delta` | `choices[0].delta.content` |
| End signal | `message_stop` | `response.completed` | `data: [DONE]` |

![Three columns of raw stream lines. Claude sends named events, with event: and data: lines, and the text sits in a text_delta's text field. OpenAI's Responses API sends typed events such as response.created, response.output_text.delta and response.completed, with the text in a delta field. OpenAI's Chat Completions sends unnamed data: chunks with the text in the first choice's delta.content, and ends with data: (DONE). The text-bearing field is highlighted in each.](img/streaming-providers.svg)

## Why the browser's EventSource doesn't fit

Browsers have a built-in SSE client called `EventSource`. It handles the
parsing, reconnects on its own, and even tells the server where it left off
with a `Last-Event-ID` header. It looks like exactly the right tool.

It isn't. The `EventSource` constructor takes a URL and a single option,
`withCredentials`. There's no way to set the HTTP method, a request body or
custom headers, so it can only make GET requests. LLM APIs take a POST with
a JSON body full of messages, so `EventSource` can't call them.

You have two options:

- **Read the stream with `fetch()`.** Make the POST, get a reader on the
  response body, and parse it yourself: decode the bytes to text, split on
  blank lines, and pull out the `data:` lines. Decode with
  `{ stream: true }` so a character that's split across two chunks comes out
  right.
- **Proxy through your own server.** Your backend calls the provider (which
  also keeps your API key off the client) and passes the stream on. If your
  own endpoint takes the question as a GET parameter, `EventSource` works
  against it. If it takes a POST, you're back to `fetch()`.

In practice, the official SDKs do the parsing for you on the server, and
you only write the browser side.

## Where it gets tricky

**A 200 doesn't mean success.** Once a stream has started, the status code
is already sent. So errors arrive as events inside the stream. On Claude,
an `overloaded_error` that would be an HTTP 529 without streaming shows up
as an `error` event partway through. Your code has to watch for it.

**Deltas aren't whole words.** A Claude text delta can be `"ello frien"`.
Don't try to do per-word work on raw deltas. Append them and work on the
accumulated text.

**Tool calls and JSON stream as broken JSON.** A tool call's arguments
arrive as partial JSON strings, like `{"location": "San Fra`. You collect
them and parse once the block closes, or use a partial-JSON parser or the
SDK helpers if you want to act earlier. As of 2026-09, Claude emits a tool's
input one complete key and value at a time, so there can be pauses in the
stream while the model works. The same goes for [[structured-output]]
when streamed: you're holding half an object until the end.

**Usage numbers are running totals.** On Claude, the token counts in
`message_delta` are cumulative. Don't add them up.

**New event types can appear.** Providers add event types over time. Ignore
ones you don't recognize instead of crashing.

**Resuming isn't built in.** SSE has a resume mechanism (`id` fields and
`Last-Event-ID`), but these LLM APIs don't document using it. If the
connection drops, you save the text you already have and send a new
request asking the model to continue. How you do that changed with model
versions: for Claude 4.5 and earlier you put the partial text in an
assistant message; for Claude 4.6 and later you send it in a user message
with an instruction to carry on. Tool calls and thinking blocks can't be
resumed halfway, only text.

**The network in between can get in the way.** Some proxies drop HTTP
connections that stay open with nothing on them for a while. The SSE spec
suggests sending a comment line about every 15 seconds to keep them open.
It also warns that HTTP chunking done by a layer that doesn't know about
the stream can hurt reliability. If you proxy LLM streams through your own
server, that server is one of those layers.

**Moderation gets harder.** If you check outputs before showing them,
streaming breaks that: partial text is harder to judge. On OpenAI, the
moderation scores you can request with a generation arrive only after the
full output, not with the deltas.

**Sometimes you must stream even if you don't want to.** For requests with
a large `max_tokens`, Anthropic's SDKs require streaming to avoid HTTP
timeouts. They offer a helper that streams underneath and hands you the
finished message, so your code doesn't have to handle events.

## What this means when you build

- Stream anything a person waits on. Skip it for background jobs where
  nobody watches, unless the output is long enough to risk timeouts.
- Don't reach for `EventSource`. Use `fetch()` with a stream reader in the
  browser, and keep the provider call on your server.
- Treat the stream as a state machine: handle start, deltas, stop, errors
  and unknown events explicitly.
- Keep the accumulated text so you can show it, log it, and resume from it
  if the connection drops.
- Check the final stop reason at the end of the stream, same as without
  streaming.
- Test streaming through your real server and hosting setup early, not
  only against the provider directly.

## Further reading

- [Streaming messages](https://platform.claude.com/docs/en/build-with-claude/streaming),
  Anthropic, undated (checked 2026-09-23). The full Claude event flow, delta
  types, errors inside the stream, and how to recover a broken stream.
- [Streaming API responses](https://developers.openai.com/api/docs/guides/streaming-responses),
  OpenAI, undated (checked 2026-09-23). The Responses API's typed events and
  the moderation tradeoff.
- [HTML Living Standard: Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html),
  WHATWG, living standard. The wire format, the `EventSource` API, and
  practical notes on proxies and keep-alives.
- [How streaming LLM APIs work](https://til.simonwillison.net/llms/streaming-llm-apis),
  Simon Willison, 2024. Raw curl output from OpenAI, Anthropic and Gemini
  side by side, and a `fetch()` parser for the browser.
