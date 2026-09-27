---
id: streamdown-termination
title: Unterminated Block Parsing (Streamdown docs)
author: Vercel (Streamdown docs)
url: https://streamdown.ai/docs/termination
published: undated (checked 2026-09-27)
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

Streamdown is Vercel's Markdown renderer for streamed AI output. This page covers one problem: while an answer streams, Markdown arrives half-finished (an opened `**` with no close, a link with half a URL). Its preprocessor, remend, closes the open syntax before rendering, then the real closing text replaces it when it arrives.

## Key claims

- The problem. "When AI models stream Markdown content token-by-token, the content often arrives incomplete". Without handling, it would "Not render any formatting at all", "Display the raw Markdown syntax" or "Break the layout". (The Challenge)
- The fix: remend "automatically adds the closing syntax so the content renders correctly, then seamlessly updates when the actual closing syntax arrives." (How It Works)
- Patterns handled: bold, italic, bold italic, inline code, strikethrough, links, images, block math. (Supported Incomplete Patterns)
- Incomplete links become `[Click here](streamdown:incomplete-link)`, which "renders visually but doesn't navigate anywhere"; or `linkMode: 'text-only'` shows plain text until the link completes. (Links)
- Incomplete images are removed "rather than showing broken image placeholders". (Images)
- Single tildes between word characters are escaped so "20~25°C" isn't read as strikethrough. (Single Tilde Escape)
- It can be turned off (`parseIncompleteMarkdown={false}`), but then "incomplete Markdown syntax being displayed literally, which is generally not desirable for user-facing applications." (Configuration)
- Works standalone: `remend("This is **incomplete bold")` returns `"This is **incomplete bold**"`. (Using Remend Standalone)
- Custom handlers can close your own markers (e.g. custom tags). (Custom Handlers)

## Visuals worth redrawing

- None. A before/after of one streamed string is easy to draw ourselves.

## My notes

- Vendor docs, no dates or version on the page.
- Custom handlers matter if you stream your own citation markers.
