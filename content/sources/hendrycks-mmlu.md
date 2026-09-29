---
id: hendrycks-mmlu
title: Measuring Massive Multitask Language Understanding
author: Dan Hendrycks, Collin Burns, Steven Basart, Andy Zou, Mantas Mazeika, Dawn Song, Jacob Steinhardt
url: https://arxiv.org/abs/2009.03300
published: 2020-09-07
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The paper that introduced MMLU, a multiple-choice test of 57 subjects from elementary math to law. When it came out, most models scored near chance and the largest GPT-3 was about 20 points above chance. It's the classic example of a static knowledge benchmark. Accepted at ICLR 2021 (v3 revised 2021-01-12). Only the abstract page was read.

## Key claims

- What it tests: 57 subjects. "The test covers 57 tasks including elementary mathematics, US history, computer science, law, and more." (abstract)
- What a high score is supposed to require. "To attain high accuracy on this test, models must possess extensive world knowledge and problem solving ability." (abstract)
- Scores at launch (2020). "the very largest GPT-3 model improves over random chance by almost 20 percentage points on average." (abstract)
- Models don't know when they're wrong. "Models also have lopsided performance and frequently do not know when they are wrong." (abstract)

## Visuals worth redrawing

- None used.

## My notes

- The abstract doesn't give the format details (number of options, question count). Don't state them without opening the paper.
- Used as history: the "how benchmarks start" end of the lifecycle.
