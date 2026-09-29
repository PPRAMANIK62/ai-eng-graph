---
id: google-gemini-document-processing
title: Document understanding
author: Google (Gemini API docs)
url: https://ai.google.dev/gemini-api/docs/document-processing
published: 2026-09-23          # "Last updated" date shown on the page
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Gemini API docs on PDFs. Gemini reads PDF pages with "native vision". The page gives a flat per-page cost of 258 tokens, up to 1,000 pages or 50 MB, and says that on Gemini 3 the text extracted from the PDF itself is not charged; page images are counted as image tokens. Non-PDF documents are read as plain text only.

## Key claims

- "Gemini models can process documents in PDF format, using native vision to understand entire document contexts." (intro)
- "Each document page is equivalent to 258 tokens." (Technical details)
- "Gemini supports PDF files up to 50MB or 1000 pages." (Technical details)
- Page scaling: "larger pages are scaled down to a maximum resolution of 3072 x 3072 while preserving their original aspect ratio, while smaller pages are scaled up to 768 x 768 pixels." (Technical details)
- Gemini 3: "You are not charged for tokens originating from the extracted native text in PDFs." Tokens from "processing PDF pages (as images) are now counted under the IMAGE modality". (Gemini 3 section)
- Gemini 3 adds `media_resolution`: "You can now set the resolution to low, medium, or high per individual media part." (Gemini 3 section)
- Other file types lose their layout: "Other types will be extracted as pure text, and the model won't be able to interpret what we see in the rendering of those files." (Technical details)
- Tips: "Rotate pages to the correct orientation before uploading. Avoid blurry pages. If using a single page, place the text prompt after the page." (Best practices)

## Visuals worth redrawing

## My notes

- The 258-token line isn't tied to a model on this page, and it doesn't match the Gemini 3 media-resolution table (560 per page by default). See google-gemini-media-resolution. Looks like 258 is the older-model figure.
- Opposite advice from Anthropic on order: Gemini says prompt after a single page; Claude says PDF before text. Both put the document first.
