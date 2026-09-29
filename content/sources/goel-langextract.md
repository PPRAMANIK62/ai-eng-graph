---
id: goel-langextract
title: "Introducing LangExtract: A Gemini powered information extraction library"
author: Akshay Goel and Atilla Kiraly (Google)
url: https://developers.googleblog.com/en/introducing-langextract-a-gemini-powered-information-extraction-library/
published: 2025-07-30
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Google's launch post for LangExtract, an open-source Python library for pulling structured information out of unstructured text with Gemini or other LLMs. It goes past "fill this schema": each extracted item is tied back to its exact character position in the source, few-shot examples define the output, and long documents are handled by chunking and running several extraction passes, because recall drops when a model has to find many facts in one huge context.

## Key claims

- Source grounding. "Every extracted entity is mapped back to its exact character offsets in the source text." It makes extractions easy to highlight, check and verify. (What makes LangExtract effective, Precise source grounding)
- The output is defined by a data description plus "few-shot" examples; LangExtract "uses this to enforce a schema, leveraging Controlled Generation in supported models like Gemini to ensure consistently structured outputs." (Reliable structured outputs)
- Long documents lose recall. "needle-in-a-haystack tests across million-token contexts show that recall can decrease in multi-fact retrieval scenarios." (Optimized long-context information extraction)
- The fix. "LangExtract is built to handle this using a chunking strategy, parallel processing and multiple extraction passes over smaller, focused contexts." (same)
- Demonstrated on a full-text analysis of Romeo and Juliet. (Reliable structured outputs)
- Output can be turned into a self-contained HTML page for reviewing extractions. (Interactive visualization)
- Works with cloud models and open models run locally. (Flexible LLM support)
- Example domains: medication extraction from clinical notes, and a radiology report demo (RadExtract). (Applications)

## Visuals worth redrawing

- A long document split into chunks, several passes each, merged into one list of entities with character spans.

## My notes

- Character offsets are a direct fix for the "value not in the document" failure: if the span doesn't exist, the extraction is made up.
- No accuracy numbers in the post.
