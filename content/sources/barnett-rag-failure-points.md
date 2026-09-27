---
id: barnett-rag-failure-points
title: Seven Failure Points When Engineering a Retrieval Augmented Generation System
author: Scott Barnett, Stefanus Kurniawan, Srikanth Thudumu, Zach Brannelly, Mohamed Abdelrazek (Deakin University)
url: https://arxiv.org/abs/2401.05856
published: 2024-01-11
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

An experience report from building three RAG systems (research, education, biomedical). It names seven places a RAG system fails, from the answer not being in the documents at all to the model leaving out part of it. Its main lesson is that you only find these failures by running the system on real questions.

## Key claims

- FP1 Missing content. "When asking a question that cannot be answered from the available documents." (5 Failure Points of RAG Systems)
- FP2 Missed the top ranked documents. "The answer to the question is in the document but did not rank highly enough to be returned to the user." (5)
- FP3 Not in context. "Documents with the answer were retrieved from the database but did not make it into the context." (5)
- FP4 Not extracted. "The answer is present in the context, but the large language model failed to extract out the correct answer." (5)
- FP5 Wrong format: the question asked for a table or list and the model ignored it. (5)
- FP6 Incorrect specificity. "The answer is returned in the response but is not specific enough or is too specific to address the user's need." (5)
- FP7 Incomplete. "Incomplete answers are not incorrect but miss some of the information even though that information was in the context." (5)
- In the good case for FP1: "In the happy case the RAG system will respond with something like 'Sorry, I don't know'." (5)
- The two takeaways: "1) validation of a RAG system is only feasible during operation, and 2) the robustness of a RAG system evolves rather than designed in at the start." (Abstract)
- Case studies: Cognitive Reviewer (research PDFs), AI Tutor (education), BioASQ (4,017 PDFs, 1,000 Q&A pairs). (4 Case Studies)

## Visuals worth redrawing

- Their pipeline diagram with failure points marked on it. Redraw as a pipeline with the seven points placed on the stage where each happens.

## My notes

- Opened the HTML version. Models are 2023-era (GPT-3.5/4). The failure points are about the pipeline shape, so they age well.
