---
id: mistral-ocr-4
title: Mistral OCR 4
author: Mistral AI
url: https://mistral.ai/news/ocr-4/
published: 2026-06-23
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Mistral's launch post for OCR 4, a hosted document OCR model (also self-hostable for enterprise customers). $4 per 1,000 pages, $2 with the Batch API. Returns Markdown with bounding boxes, block types and confidence scores. Reports 85.20 on olmOCR-Bench (top among the models Mistral tested) and 93.07 on OmniDocBench, then spends a section on why both benchmarks mis-score correct output and recommends testing on your own documents. Replaces the 2025 Mistral OCR post, which now says it's no longer maintained.

## Key claims

- Price: "Mistral OCR 4 through the API is priced at $4 per 1,000 pages, with a 50% Batch-API discount, reducing the cost to $2 per 1,000 pages. Document AI is priced at $5 per 1,000 pages." (pricing)
- Output: "bounding boxes, block classification, and inline confidence scores"; Markdown text; 170 languages. (features)
- Benchmarks: "OCR 4 achieves the top overall score amongst the models we tested on the public OlmOCRBench (85.20)"; "On OmniDocBench, OCR 4 achieves a score of 93.07". (benchmarks)
- Benchmark problems: "Ground-truth errors. Some reference annotations are themselves incorrect: missing or extra text, transcriptions of redacted regions, or typos"; "Equivalent math notation. Different LaTeX that renders identically is counted as a mismatch."; "Multi-column reading order. Words split across a column boundary and column-ordering assumptions cause correct extractions to be scored as reading-order failures." (benchmark caveats)
- These issues "more often penalize correct output than reward incorrect output". (same)
- "We therefore treat the aggregate score as directional rather than definitive"; "We recommend evaluating on your own documents." (same)
- Human preference: annotators preferred OCR 4 with win rates averaging 72% against competitors, on 600+ multilingual documents. (human evaluation)
- Deployment: "a compact model deployable in a single container", available for "fully self-hosted deployments". (deployment)

## Visuals worth redrawing

## My notes

- Mistral doesn't claim first place on OmniDocBench; 93.07 is self-reported and OCR 4 isn't on the public leaderboard. On that leaderboard (2026-09-11), 93.07 would sit behind 14 entries, just ahead of MinerU-2.5 (93.04) and Gemini 3 Pro (92.91).
