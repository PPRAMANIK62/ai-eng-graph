---
id: anthropic-citations
title: Citations (Claude API docs)
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/build-with-claude/citations
published: undated (docs page, checked 2026-09-27)
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

The reference page for Claude's built-in citations. You pass documents (plain text, PDF, or "custom content" you've already split), set `citations.enabled`, and the API splits them into citable chunks (sentences by default). The answer comes back as several text blocks, each claim carrying a list of citations that point to exact locations in your documents, with the cited text copied out for you. The page also lists what it doesn't do: no image citations, and it can't be combined with structured outputs.

## Key claims

- Status. "All active models support citations." Marked GA on the Claude API, Bedrock, Google Cloud and Microsoft Foundry. (intro, page metadata)
- Pointers are guaranteed valid, unlike prompt-based quoting. "citations are guaranteed to contain valid pointers to the provided documents." (Tip: Comparison with prompt-based approaches)
- Quality vs prompting, measured by Anthropic (vendor claim, no number on this page). "In Anthropic's evaluations, the citations feature is significantly more likely to cite the most relevant quotes from documents than purely prompt-based approaches." (same Tip)
- Documents are chunked to set the smallest citable unit. "Document contents are "chunked" to define the minimum granularity of possible citations." Plain text and PDF are split into sentences; custom content blocks are used as-is. (How citations work, step 2)
- Each text block can hold one claim plus its citations. "each text block can contain a claim that Claude is making and a list of citations that support the claim." (How citations work, step 3)
- Citation location depends on document type: character range (0-indexed) for plain text, page range (1-indexed) for PDFs, content block index for custom content. (How citations work, step 3; Citation indices)
- All or none. "Currently, citations must be enabled on all or none of the documents within a request." (step 1)
- No image citations. "Only text citations are currently supported." Scanned PDFs with no extractable text "are not citable". (step 1; PDF documents)
- For RAG: put each retrieved chunk in its own plain text document to let Claude cite single sentences; use custom content to stop further chunking. (Tip: Automatic chunking vs custom content)
- `title` and `context` fields are passed to the model but can't be cited. (Citable versus non-citable content)
- Cost: slightly more input tokens; `cited_text` doesn't count as output tokens. "The `cited_text` field is provided for convenience and does not count toward output tokens." (Token costs)
- Incompatible with structured outputs. "If you enable citations on any user-provided document (`document` blocks or `search_result` blocks) and also include the `output_config.format` parameter (or the deprecated `output_format` parameter), the API returns a 400 error." Reason: "citations require interleaving citation blocks with text output, which is incompatible with the strict JSON schema constraints of structured outputs." (Warning under Feature compatibility)
- Works with prompt caching, token counting and batch processing. (Feature compatibility)
- Response shape: text blocks, some with a `citations` array; a `char_location` citation has `cited_text`, `document_index`, `document_title`, `start_char_index`, `end_char_index` (end exclusive). Example: blocks "According to the document, " (no citation), "the grass is green" (cites "The grass is green.", document_index 0, chars 0–20), " and ", "the sky is blue" (cites "The sky is blue.", chars 20–36). (Response structure)
- Streaming: "citations arrive as a `citations_delta` delta type inside `content_block_delta` events. Each delta contains a single citation to add to the `citations` list on the current `text` content block." (Streaming support)

## Visuals worth redrawing

- The response structure example: plain text blocks alternating with cited blocks, each citation pointing back into a document. Good as "answer on the left, source on the right, lines between".

## My notes

- Read from the page's markdown version (same URL + `.md`), since the HTML page is too long for the fetch tool. Code blocks skipped.
- "Significantly more likely" has no number here. The launch post (`anthropic-citations-api-launch`) gives "up to 15%". Both are Anthropic's own evals.
