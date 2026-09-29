---
id: auer-docling
title: Docling Technical Report
author: Christoph Auer, Maksym Lysak, Ahmed Nassar, Michele Dolfi, Nikolaos Livathinos, et al. (IBM Research)
url: https://arxiv.org/abs/2408.09869
published: 2024-08-19
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The technical report for Docling, IBM's open-source (MIT) PDF converter. It is a pipeline: a PDF backend pulls out the text tokens with their positions and renders each page as an image, then separate models find the layout (a detector trained on DocLayNet) and rebuild tables (TableFormer), with OCR as an option. A last step works out reading order and assembles one structured document. Latest version (v5) 2024-12-09; the code has moved on since. Abstract read on arxiv, sections 3 and 4 in the arxiv HTML version.

## Key claims

- What it is: "an easy to use, self-contained, MIT-licensed open-source package for PDF document conversion", "powered by state-of-the-art specialized AI models for layout analysis (DocLayNet) and table structure recognition (TableFormer), and runs efficiently on commodity hardware". (abstract)
- Step 1, the PDF backend "retrieves the programmatic text tokens, consisting of string content and its coordinates on the page, and also renders a bitmap image of each page". (section 3, Processing pipeline)
- Step 2, models per page: "applies a sequence of AI models independently on every page in the document to extract features and content, such as layout and table structures." (section 3)
- Step 3, assembly: results pass "through a post-processing stage, which augments metadata, detects the document language, infers reading-order and eventually assembles a typed document object." (section 3)
- The layout model is "re-trained on DocLayNet, our popular human-annotated dataset for document-layout analysis", with "an architecture derived from RT-DETR". (section 3.2)
- OCR is optional and slow: EasyOCR "runs fairly slow on CPU (upwards of 30 seconds per page)." (section 3.2)
- Speed on the test set: Apple M3 Max, 4 threads, native backend: 1.27 pages per second; Intel Xeon, 16 threads: 0.92 pages per second. (section 4, Table 1)

## Visuals worth redrawing

- The pipeline figure: parse → layout model → table model → assemble → export.

## My notes

- 2024 paper; current Docling adds a VLM path (GraniteDocling) per the GitHub repo, not cited here.
