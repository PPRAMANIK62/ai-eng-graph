---
id: streaming-ui
title: How do you show a streamed answer?
depth: short
phase: 2
note: >-
  Showing a streamed answer well: partial text, loading states, what to do while the user waits.
needs: [streaming]
leads_to: []
compare_with: []
updated: 2026-09-27
---

# How do you show a streamed answer?

[[streaming|Streaming]] gets the model's words to the browser as they're
written. What the user sees is a separate job: what's on screen before the
first word, while text is arriving, when it stops early, and when it
breaks. Get these right and a slow answer feels responsive. Get them wrong
and a fast one feels broken.

## Four states to design for

Follow one question from the moment the user presses Enter. The screen
goes through four states. The names here are the ones Vercel's AI SDK
uses in its `useChat` hook, but any chat UI has the same phases.

1. **Submitted.** The message is sent and nothing has come back yet. This
   is the only moment a spinner or "thinking" placeholder makes sense,
   because there's nothing else to show.
2. **Streaming.** Text is arriving. Replace the spinner with the growing
   answer, and show a Stop button so the user can cut it off.
3. **Ready.** The whole answer is in. Now the input and send button come
   back, and actions like "regenerate" make sense.
4. **Error.** Something failed. Say so plainly and offer a retry.

![A state diagram for one chat turn. Submitted: the request is sent and nothing has arrived, so show a spinner and a Stop button. Streaming: text is arriving, so show the growing text and the Stop button. Ready: the answer is complete, so re-enable the input and offer regenerate. Error: show a generic message and a retry button. Stop from submitted or streaming aborts the request and goes to ready. Retry from error sends the request again.](img/streaming-ui-states.svg)

The simplest rule falls out of this: disable sending while the status is
anything but ready. Otherwise a second question can start while the first
answer is still arriving, and the two get tangled.

## Stop, retry, and errors

**Stop should really stop.** Pressing Stop should abort the request, not
just hide the text, so nothing keeps working on an answer nobody will
read. Keep the partial answer on screen, marked as stopped,
since the user may have stopped it because they'd already read enough.

**Errors should say little.** Show something like "Something went wrong"
with a retry button. The raw error from your server or the model provider
can leak details about your setup, and it means nothing to the user.

**Regenerate replaces.** A regenerate button asks for the last answer
again and swaps it in place, instead of adding a second answer below.

## Half-finished Markdown

Models write Markdown, and while it streams, the Markdown is incomplete.
Mid-answer, your buffer might hold `This is **very` with no closing `**`,
or `[the docs](https://exa` with half a URL. A normal Markdown renderer
will then show raw asterisks, or skip the formatting, or break the
layout.

The fix is to repair the text before each render. Vercel's Streamdown
renderer does this with a small preprocessor called remend:

- An open `**`, `*`, `` ` `` or `~~` gets a matching close, so bold text
  shows as bold straight away. When the real closing marker arrives, it
  replaces the fake one.
- A half-written link renders as a link that goes nowhere, or as plain
  text, until the URL is complete.
- A half-written image is left out rather than shown broken.

You can use remend with any Markdown renderer. If your model emits its
own markers (citation tags, for example), you can add handlers that close
those too.

## Keeping the page calm

**Don't re-render on every token.** Tokens can arrive faster than the
screen needs to update. The AI SDK has a `throttle` option (50 ms in its
example) that batches updates while the stream itself runs at full speed.

**Show extra parts where they belong.** A streamed message can carry more
than text. Reasoning from a thinking model usually arrives before the
answer, so show it first, collapsed or muted. Sources come as their own
parts too (the AI SDK has one type for web pages and one for documents),
so you can render them as chips next to the answer instead of parsing
them out of the text. How to tie each source to a claim is covered in
[[citations]].

## Where it gets tricky

**A spinner that outlives the first token is a bug.** Once text is
arriving, the text is the progress indicator. Keep the spinner to the
submitted state.

**Stopped isn't the same as failed.** A user stop, a dropped connection
and a server error all end the stream early. They need different
messages, so track which one happened. The AI SDK's finish callback
reports abort, disconnect and error as separate flags for this reason.

**Formatting fixes can guess wrong.** An auto-closer can mistake a single
tilde in "20~25°C" for the start of strikethrough. Streamdown escapes
single tildes between word characters to avoid exactly this, but custom
syntax needs custom handling.

## What this means when you build

- Model the UI as four states: submitted, streaming, ready, error. Base
  the spinner, the Stop button and the send button on them.
- Make Stop abort the request, and keep the partial text.
- Show a generic error with a retry, and log the real one on the server.
- Repair incomplete Markdown before rendering each update.
- Throttle re-renders, and place reasoning, sources and citations as
  their own parts.

## Further reading

- [Chatbot (AI SDK UI)](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot),
  Vercel, undated (AI SDK v7, checked 2026-09-27). The four states, stop,
  regenerate, errors, throttling and message parts, with code.
- [Unterminated Block Parsing](https://streamdown.ai/docs/termination),
  Vercel (Streamdown), undated (checked 2026-09-27). How half-finished
  Markdown is repaired while it streams.
