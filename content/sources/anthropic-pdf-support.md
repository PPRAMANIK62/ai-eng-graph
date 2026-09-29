---
id: anthropic-pdf-support
title: PDF support
author: Anthropic
url: https://platform.claude.com/docs/en/build-with-claude/pdf-support
published: 2026              # undated page marked GA; examples use claude-opus-5-5, so current as of 2026-09
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Claude API docs on sending PDFs. Each page is turned into an image, the page's text is extracted, and both go to the model, so you pay for the text tokens and the image tokens of every page. Covers limits (32 MB request, 600 pages), cost estimates, and a text-only mode on Amazon Bedrock's Converse API that shows the cost difference: about 1,000 tokens for a 3-page PDF as text only, about 7,000 with page images.

## Key claims

- The mechanism: "The system converts each page of the document into an image." and "The text from each page is extracted and provided alongside each page's image." (Process PDFs with Claude, steps)
- Why both: it lets you ask about "charts, diagrams, and other non-textual content". (same)
- Text cost: "Each page typically uses 1,500–3,000 tokens per page depending on content density." (Estimate your costs)
- Image cost: "Because each page is converted into an image, the same image-based cost calculations are applied." (Estimate your costs)
- Limits: maximum request size 32 MB; "600 (100 when the request's context window is under 1M tokens)" pages per request; no passwords or encryption. (Check PDF requirements, table)
- Dense PDFs "can fill the context window before reaching the page limit". (tip under requirements)
- PDF support "relies on Claude's vision capabilities" and has the same limitations as other vision tasks. (Check PDF requirements)
- Bedrock Converse, text-only mode: "Cannot analyze images, charts, or visual layouts within PDFs" and "Uses approximately 1,000 tokens for a 3-page PDF". Full mode: "Processes each page as both text and image" and "Uses approximately 7,000 tokens for a 3-page PDF". (Amazon Bedrock PDF support)
- Tips: place PDFs before text, "Rotate pages to proper upright orientation", "Split large PDFs into chunks when needed", "Enable prompt caching for repeated analysis"; the Message Batches API for high volume. (Optimize PDF processing)

## Visuals worth redrawing

- The three steps (page to image plus extracted text, model reads both).

## My notes

- The 1,000 vs 7,000 comparison is from the Bedrock Converse section (Opus 4.6 and earlier), but it's the only place any provider puts numbers on text-only vs text-plus-images for the same file.
