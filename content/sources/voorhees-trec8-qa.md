---
id: voorhees-trec8-qa
title: The TREC-8 Question Answering Track Report
author: Ellen M. Voorhees (NIST)
url: https://trec.nist.gov/pubs/trec8/papers/qa_report.pdf
published: 2000              # NIST SP 500-246; the proceedings page was last updated 2000-08-01
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The report on the first large-scale question answering evaluation at TREC. Systems got 200 fact questions and returned five ranked answer
snippets each. Each question was scored by the reciprocal of the rank of the
first correct snippet, and a run's score was the mean over questions: mean
reciprocal rank. The report explains why they chose it and its drawbacks.
The PDF has no text layer; I rendered the six pages and ran OCR (tesseract)
on 2026-09-27 to read it, then checked the quotes below against the OCR text.

## Key claims

- What it was. "The TREC-8 Question Answering track was the first large-scale evaluation of domain-independent question answering systems." (Abstract)
- The best systems. "The most accurate systems found a correct response for more than 2/3 of the questions." (Abstract)
- The task: 200 fact questions, five ranked answers each. "Participants returned a ranked list of five [document-id, answer-string] pairs per question such that each answer string was believed to contain an answer to the question." (§1 The Task)
- Human assessors made a yes/no call per answer. "Human assessors read each string and made a binary decision as to whether the string actually did contain an answer to the question" (§1)
- MRR definition. "An individual question received a score equal to the reciprocal of the rank at which the first correct response was returned, or 0 if none of the five responses contained a correct answer. The score for a submission was then the mean of the individual questions’ reciprocal ranks." (§1; OCR read the 0 as "O")
- Why it was chosen. "It is bounded between 0 and 1, inclusive, and averages well." It is also "closely related to the average precision measure used extensively in document retrieval." (§1)
- Missing an answer is penalized, but not too hard. "A run is penalized for not retrieving any correct answer for a question, but not unduly so." (§1)
- Drawback: few possible values with a cutoff of 5. "The score for an individual question can take on only six values (0, .2, .25, .33, .5, 1)." (§1)
- Drawback: only the first right answer counts. "Question answering systems are given no credit for retrieving multiple (different) correct answers." (§1)
- Drawback: no credit for knowing you don't know. "since the track required at least one response for each question, a system could receive no credit for realizing it did not know the answer." (§1)
- Results: the best run had MRR .660 (Cymfony, 50-byte run), with 54 questions not answered. (§2, Table 1)
- When the best systems found an answer, it was usually at rank 1: "the mean reciprocal rank is also close to 2/3 for these systems." (§2)
- 20 organizations, 45 runs, scored over 198 questions. (§2)

## Visuals worth redrawing

- None. Table 1 (MRR per run) is data, not a diagram.

## My notes

- This is the verified primary for MRR that the 2026-09-23 candidate pass couldn't open. The fix was OCR: `pdftoppm -r 300` then `tesseract`. OCR text can have small character errors (for example "19927" for "1992?" in the example questions), so quotes above were checked by eye against the surrounding text.
- The cutoff here is 5 answers, so this is MRR@5 in today's notation. The "six values" point generalizes: with cutoff k, a question can only score 0 or 1/1 ... 1/k.
- The companion paper "The TREC-8 Question Answering Track Evaluation" (Voorhees and Tice) has implementation details; not opened.
