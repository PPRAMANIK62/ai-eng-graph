---
id: poznanski-olmocr
title: "olmOCR: Unlocking Trillions of Tokens in PDFs with Vision Language Models"
author: Jake Poznanski, Aman Rangapur, Jon Borchardt, et al. (Ai2)
url: https://arxiv.org/abs/2502.18443
published: 2025-02-25
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Ai2's paper on olmOCR, a 7B VLM fine-tuned to turn PDF pages into clean text in reading order, with tables and equations kept. It explains why PDFs are hard (they store positioned characters, not paragraphs), adds "document anchoring" (feeding the PDF's own text and positions to the VLM next to the page image), and introduces olmOCR-Bench, which scores with pass/fail unit tests instead of fuzzy text matching. Cost: about $176 per million pages vs over $6,240 for GPT-4o. Latest version (v3) 2025-07-02. Abstract on arxiv, body in the arxiv HTML version.

## Key claims

- Why PDFs are hard: "PDFs store not units of text—headings, paragraphs, or other meaningful prose elements—but single characters alongside their spacing, placement, and any metadata used for visual rendering on a page." (introduction)
- Goal: "clean, linearized plain text in natural reading order while preserving structured content like sections, tables, lists, equations, and more." (abstract)
- Model and data: "a fine-tuned 7B vision language model" trained on "260,000 pages from over 100,000 crawled PDFs". (abstract)
- Cost: "can convert a million PDF pages for only 176 USD", versus GPT-4o at "over 6,240 USD per million PDF pages". (abstract)
- Document anchoring uses "text blocks and position information" from the PDF alongside raw extracted text in the prompt. (method)
- Without anchoring, "GPT-4o is prone to omitting content, rewriting or completing content in a manner unfaithful to the original, or captioning images when not instructed to do so." (method)
- Pages were "rendered to a maximum dimension of 1024 pixels on the longest edge". (training)
- olmOCR-Bench: "1,400 PDFs capturing many content types", with tests that are "simple, unambiguous, and deterministically machine-verifiable". (abstract; benchmark section)
- Scores in the paper on olmOCR-Bench: olmOCR 75.5, Mistral OCR 72.0, Marker 70.1, GPT-4o with anchoring 69.9, Qwen 2.5 VL 65.5. (results table)

## Visuals worth redrawing

## My notes

- The benchmark's own authors' model tops their table. Marker's README later reports Marker at 76.0 on the same benchmark, with a newer version.
