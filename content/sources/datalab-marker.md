---
id: datalab-marker
title: Marker (GitHub repo)
author: Datalab
url: https://github.com/datalab-to/marker
published: 2026              # live README; the benchmark table names Gemini Flash 3.5, so current as of 2026-09
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

Marker converts documents to Markdown, JSON, chunks and HTML. It's a hybrid: it takes the PDF's embedded text first, detects layout, sends only garbled or scanned pages to a VLM for OCR, rebuilds tables with CPU heuristics and falls back to the VLM when unsure. The README benchmarks it on olmOCR-bench with speed, and puts Marker's balanced mode ahead of MinerU and Docling. These are the vendor's own numbers.

## Key claims

- "Marker converts documents to markdown, JSON, chunks, and HTML quickly and accurately." (top of README)
- Pipeline: "Extract embedded text with pdftext, in the PDF's reading order"; "Detect page layout" (light detector in fast mode, VLM in balanced mode); "Decide per page whether the embedded text is usable; garbled or scanned pages are OCR'd by the VLM."; "Tables are reconstructed from the text layer with CPU heuristics; low-confidence reconstructions fall back to the VLM." (How it works)
- Benchmark: olmocr-bench, 1,403 PDFs with about 8,400 pass/fail unit tests; overall is the macro-average of 8 categories. (benchmark section)
- Results (overall / digital-only / throughput on one B200 host): Chandra 2 hosted 85.8; Gemini Flash 3.5 API 76.4 / 79.1; Marker balanced 76.0 / 83.5 / 2.9 pg/s; MinerU pipeline 72.7 / 83.3 / 0.54 pg/s; Marker fast 66.6 / 71.6 / 7.4 pg/s; docling 50.3 / 64.0 / 2.1 pg/s; Marker fast no OCR (CPU) 43.6 / 55.8 / 23.7 pg/s; liteparse 22.4 / 27.3 / 8.9 pg/s. (benchmark table)
- Per-category, no-OCR mode scores 0.0 on arXiv math and old scans math, 14.3 on old scans; balanced gets 83.9, 63.8, 43.2. (per-category table)
- License: code Apache 2.0; model weights under "a modified AI Pubs Open Rail-M license (free for research, personal use, and startups under $5M funding/revenue)". (License)

## Visuals worth redrawing

- Quality vs throughput scatter from the table.

## My notes

- Chandra 2 is Datalab's own hosted model too, so the top two lines of the table are the vendor's products.
- OmniDocBench's Marker row is from an older Marker (1.7.1 added 2025-07-31), so the two benchmarks aren't testing the same version.
