---
id: rahmanzadehgervi-vlms-blind
title: "Vision language models are blind: Failing to translate detailed visual features into words"
author: Pooyan Rahmanzadehgervi, Logan Bolton, Mohammad Reza Taesiri, Anh Totti Nguyen
url: https://arxiv.org/abs/2407.06581
published: 2024-07-09
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

A test suite (BlindTest) of seven tasks that are trivial for people: do two circles overlap, how many times do two lines cross, which letter is circled. Four 2024 vision-language models averaged 58% and the best, Claude 3.5 Sonnet, got 78%. Linear probes show the image encoder does hold the information; the language model fails to turn it into the right answer. Latest version (v6) 2025-03-27.

## Key claims

- The tasks: "(a) whether two circles overlap; (b) how many times two lines intersect; (c) which letter is being circled in a word; and (d) the number of circles in an Olympic-like logo". (abstract)
- Scores: "four state-of-the-art VLMs are only 58.07% accurate on average. Claude 3.5 Sonnet performs the best at 77.84% accuracy, far from the human expected accuracy of 100%." (abstract)
- Failures cluster where shapes overlap or sit close: models "consistently struggle with those tasks that require precise spatial information when geometric primitives overlap or are close. Yet, VLMs perform at near-100% accuracy when much more space is added to separate shapes and letters." (abstract)
- Where it breaks: "vision encoders contain sufficient visual information to solve BlindTest and that language models fail to decode this information into correct answers." (abstract)
- Models named in the abstract include GPT-4o and Gemini 1.5 Pro. (abstract)

## Visuals worth redrawing

- Example BlindTest images (overlapping circles, crossing lines).

## My notes

- Models tested are 2024 generation. Treat the numbers as history and the failure mode (fine spatial detail) as the lasting point; it matches the provider docs' own limitation lists.
