---
id: vercel-ai-sdk-chatbot
title: Chatbot (AI SDK UI, useChat)
author: Vercel (AI SDK docs)
url: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
published: undated (AI SDK v7 docs, checked 2026-09-27)
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

The guide to `useChat`, the AI SDK's React/Vue hook for chat UIs. It streams messages in, and exposes a `status` with four values you design the screen around: submitted, streaming, ready, error. It also gives `stop` and `regenerate`, a throttle for UI updates, and message `parts` for text, reasoning and sources.

## Key claims

- The four states. "`submitted`: The message has been sent to the API and we're awaiting the start of the response stream." "`streaming`: The response is actively streaming in from the API, receiving chunks of data." "`ready`: The full response has been received and processed; a new user message can be submitted." "`error`: An error occurred during the API request, preventing successful completion." (Customized UI, Status)
- What status is for: "To show a loading spinner while the chatbot is processing the user's message.", "To show a "Stop" button to abort the current message.", "To disable the submit button." (Status)
- The example shows a spinner only while `submitted`, and a Stop button during `submitted` or `streaming`; the input and submit button are disabled unless `status === 'ready'`. (Status example code)
- Errors. "We recommend showing a generic error message to the user, such as "Something went wrong." This is a good practice to avoid leaking information from the server." The example shows a retry button that calls `regenerate()`. (Error State)
- Stop. "When the user clicks the "Stop" button, the fetch request will be aborted. This avoids consuming unnecessary resources and improves the UX of your chatbot application." (Cancellation and regeneration)
- Regenerate: "the AI provider will regenerate the last message and replace the current one correspondingly." (Cancellation and regeneration)
- Throttling. "React and Vue applications can throttle reactive message updates with the `throttle` option." Example value 50 ms. (Throttling UI Updates)
- `onFinish` gets flags for abort, disconnect and error. (Event Callbacks)
- Reasoning tokens "are typically sent before the message content" and can be forwarded as reasoning parts. (Reasoning)
- Sources. "There are two types of sources: `source-url` for web pages and `source-document` for documents." Provider sources are "currently ... limited to web pages that ground the response." (Sources)

## Visuals worth redrawing

- None. Our own state diagram of the four statuses is the natural figure.

## My notes

- Read from the markdown version of the page (URL + `.md`).
- AI SDK is one library; the four states are its names, but any streamed chat UI has the same phases.
