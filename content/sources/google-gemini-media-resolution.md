---
id: google-gemini-media-resolution
title: Media resolution
author: Google (Gemini API docs)
url: https://ai.google.dev/gemini-api/docs/media-resolution
published: 2026-09-23          # "Last updated" date shown on the page
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Gemini API docs on the `media_resolution` setting, which picks how many tokens an image, video frame or PDF page gets on Gemini 3 models. A PDF page is 560 tokens by default, 280 at low, 1,120 at high, plus the page's native text. Medium is the recommended level for documents.

## Key claims

- Token table of "approximate token counts", "Gemini 3 models", PDF column: unspecified (default) 560; low "280 + Native Text"; medium "560 + Native Text"; high "1120 + Native Text". Image column: 1120 default, 280 low, 560 medium, 1120 high, 2240 ultra_high. (token table)
- For documents, medium is "Optimal for document understanding; quality typically saturates at `medium`. Increasing to `high` rarely improves OCR results for standard documents." (recommendations)

## Visuals worth redrawing

## My notes

- 258 tokens per page (document-processing page) does not appear here. On Gemini 3, 560 is the default. Combine with google-gemini-document-processing: native text isn't charged on Gemini 3.
