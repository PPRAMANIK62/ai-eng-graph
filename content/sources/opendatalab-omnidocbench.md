---
id: opendatalab-omnidocbench
title: OmniDocBench (GitHub repo and leaderboard)
author: Ouyang et al. (OpenDataLab)
url: https://github.com/opendatalab/OmniDocBench
published: 2026-09-11          # latest leaderboard update in the README's Updates list
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

A public benchmark for document parsing (accepted at CVPR 2025; the repo has been updated since). 1,651 PDF pages across 10 document types, with an end-to-end leaderboard that scores text, tables and formulas on each page and averages them. Specialized small VLMs lead (TeleOCR 96.91), general VLMs follow (Gemini 3 Pro 92.91, GPT-5.2 86.59), and pipeline tools sit lower (MinerU pipeline 86.47, Marker 78.44). The dataset moved to v1.6 on 2026-04-10 and v1.7 on 2026-04-30; the main table is labeled v1.6_full.

## Key claims

- Overall = "((1 - text Edit distance) * 100 + table TEDS + formula CDM) / 3". (Updates, 2025 entry; End-to-End Evaluation)
- Contents: "1651 PDF pages, covering 10 document types, 5 layout types, and 5 language types", including "academic papers, financial reports, newspapers, textbooks, and handwritten notes". (dataset intro)
- Versions: "[2026/04/10] Major update: Updated from v1.5 to v1.6" with 296 new, harder pages and "Fixed typos in some text and table annotations"; "[2026/04/30] Updated from v1.6 to v1.7". (Updates)
- New matching rule in v1.6 (MGAM): "keep the ground truth unchanged and search for the optimal segmentation granularity only on the prediction side." (Updates)
- Latest additions: "[2026/09/11] Added TeleOCR, OvisOCR2, and Unlimited-OCR leaderboard results." (Updates)
- Table caption: "Comprehensive evaluation of document parsing on OmniDocBench (v1.6_full)". Overall scores: TeleOCR (specialized VLM, 1.2B) 96.91; OvisOCR2 (0.8B) 96.47; PaddleOCR-VL-1.6 (0.9B) 96.34; MinerU2.5-Pro (1.2B) 95.75; PaddleOCR-VL 94.18; MinerU-2.5 93.04; Gemini 3 Pro (general VLM) 92.91; Gemini 3 Flash 92.62; dots.ocr 90.77; GPT-5.2 (general VLM) 86.59; MinerU-Pipeline (pipeline tool) 86.47; olmOCR (7B) 85.74; Mistral OCR 85.66; Marker (pipeline tool) 78.44. (end-to-end table)
- Also above 93: GLM-OCR 95.22, PaddleOCR-VL-1.5 94.93, Unlimited-OCR 94.00, Qianfan-OCR 93.90, Youtu-Parsing 93.74, Ovis2.6-30B-A3B (general VLM) 93.70, Logics-Parsing-v2 93.33, ABot-OCR 93.30, FireRed-OCR 93.26. With the rows above, 14 entries score above 93.07. (same)
- Formula CDM: TeleOCR 96.59, Marker 85.24. (same)
- Text edit distance (lower is better): TeleOCR 0.0267, Gemini 3 Pro 0.064, GPT-5.2 0.114, Mistral OCR 0.097, Marker 0.157. Table TEDS: TeleOCR 96.82, Gemini 3 Pro 89.15, Mistral OCR 76.78, Marker 65.77. (same)
- Marker entry was added as "Marker-1.7.1" on 2025-07-31; Mistral OCR on 2025-03-27. Docling was evaluated (2025-01-16) but isn't in the main end-to-end table. (Updates; table)

## Visuals worth redrawing

- Overall score by tool, grouped by type (specialized VLM, general VLM, pipeline).

## My notes

- No "Mistral OCR 4" row. The Mistral OCR row is the 2025 model.
- Paper: https://arxiv.org/abs/2412.07626 (not opened for this note; the numbers here are from the repo).
