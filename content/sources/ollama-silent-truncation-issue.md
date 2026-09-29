---
id: ollama-silent-truncation-issue
title: "Chat history and embedding truncation happens silently with no user-visible indication (issue #14259)"
author: akuligowski9 (GitHub user)
url: https://github.com/ollama/ollama/issues/14259
published: 2026-02-14
accessed: 2026-09-29
kind: code
primary: false
---

## Summary

A user-filed bug report on the Ollama repo. When a conversation runs past the model's context length, Ollama drops the oldest messages from the front and only logs it at debug level; the API response carries no flag. The embed endpoint also truncates by default. The issue was still open and had no visible maintainer reply when read.

## Key claims

- Overflow drops the oldest messages without telling you. "Ollama silently drops older messages from the front of the conversation." (issue body)
- No signal to the caller. "Users sending messages via the API receive no indication that their conversation history was truncated" and "There is no field in the API response indicating that truncation occurred." (issue body)
- The only trace is a debug-level log in `server/prompt.go`. (issue body)
- Embeddings: it "silently truncates input that exceeds context length when `truncate=true` (the default)." (issue body)

## Visuals worth redrawing

- None.

## My notes

- A user report, not an Ollama statement. The embed part is confirmed by Ollama's own OpenAPI spec: `truncate` "If true, truncate inputs that exceed the context window. If false, returns an error." default true.
