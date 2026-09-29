---
id: openai-pdf-files
title: "File inputs: PDF files"
author: OpenAI
url: https://developers.openai.com/api/docs/guides/file-inputs
published: 2026              # undated page; covers GPT-5.6, so current as of 2026-09
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI API docs on PDF input. On vision-capable models the API extracts both the text and an image of each page and sends both, like Claude. Files must be under 50 MB each and 50 MB combined per request. A `detail` field sets the page-image resolution; `auto` means high on GPT-5.6 and later, low before.

## Key claims

- Mechanism: "On models with vision capabilities, such as `gpt-4o` and later models, the API extracts both text and page images and sends both to the model." (PDF files)
- Cost: "PDF parsing includes both extracted text and page images in context, which can increase token usage." (usage considerations)
- Size: "each file must be under 50 MB. The combined limit across all files in the request is 50 MB." (file size limits)
- Detail: set `detail` to `auto`, `low` or `high`; "For GPT-5.6 and later models, `auto` uses `high`; for earlier models, it uses `low`." (detail)
- "Use `low` for fewer input tokens, or `high` for more visual detail, such as dense charts, small print, or diagrams." (detail)

## Visuals worth redrawing

## My notes

- The default changed with GPT-5.6: the same PDF costs more on a newer model unless you set `detail` yourself.
