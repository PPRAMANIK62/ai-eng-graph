---
id: whatwg-server-sent-events
title: "HTML Living Standard: 9.2 Server-sent events"
author: WHATWG
url: https://html.spec.whatwg.org/multipage/server-sent-events.html
published: living standard (continuously updated)
accessed: 2026-09-23
kind: spec
primary: true
---

## Summary

The spec for server-sent events: the `text/event-stream` wire format and the browser's `EventSource` API. A stream is plain UTF-8 text made of lines like `event: ...` and `data: ...`; a blank line ends one event. The browser API reconnects on its own and can send `Last-Event-ID` to resume. The constructor takes only a URL and a `withCredentials` flag.

## Key claims

- Purpose. "To enable servers to push data to web pages over HTTP or using dedicated server-push protocols, this specification introduces the EventSource interface." (9.2.1 Introduction)
- MIME type. "This event stream format's MIME type is text/event-stream." (9.2.5 Parsing an event stream)
- Always UTF-8. "Event streams are always decoded as UTF-8." (9.2.1)
- Fields: `event` sets the type, `data` appends a line of data, `id` sets the last event ID, `retry` sets reconnection time in ms; other fields are ignored. (9.2.6 Interpreting an event stream)
- A blank line dispatches the event. "If the line is empty (a blank line)Dispatch the event" (9.2.6) [page text runs the two phrases together]
- Lines starting with a colon are comments and ignored. (9.2.6)
- A half-sent event at the end of the stream is dropped. "If the file ends in the middle of an event, before the final empty line, the incomplete event is not dispatched." (9.2.6)
- Default type is message. "The default event type is "message"." (9.2.1)
- Browser clients reconnect automatically; HTTP 204 tells them to stop. "Clients will reconnect if the connection is closed" (9.2.1)
- Resuming: the browser sends the last seen id in a `Last-Event-ID` header when it reconnects. (9.2.4, and the worked example in 9.2.6)
- The `EventSource` constructor takes a URL plus an init dictionary whose only member is `withCredentials`; there's no way to set method, body or headers. (9.2.2 IDL: `constructor(USVString url, optional EventSourceInit eventSourceInitDict = {})`, `dictionary EventSourceInit { boolean withCredentials = false; }`)
- Why keep-alives: "Legacy proxy servers are known to, in certain cases, drop HTTP connections after a short timeout." (9.2.7 Authoring notes)
- Keep-alives for proxies. "authors can include a comment line (one starting with a ':' character) every 15 seconds or so." (9.2.7 Authoring notes)
- Chunking by a middle layer can hurt. "HTTP chunking can have unexpected negative effects on the reliability of this protocol" (9.2.7)

## Visuals worth redrawing

- The four-block example stream in 9.2.6 (comment, event with id, event that resets id, event with leading space). Good for a small "anatomy of an SSE stream" box.

## My notes

- The spec never says "GET only" in words. It follows from the IDL: no method, body or header options. Willison states it directly for LLM APIs (`willison-streaming-llm-apis`).
- The `Last-Event-ID` resume feature is something LLM APIs don't use: neither Anthropic's nor OpenAI's streaming docs mention event ids. Resuming an LLM stream is done by a new request (see `anthropic-streaming`, Error recovery).
