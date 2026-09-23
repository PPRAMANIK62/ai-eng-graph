---
id: tam-let-me-speak-freely
title: "Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of Large Language Models"
author: Zhi Rui Tam, Cheng-Kuang Wu, Yi-Lin Tsai, Chieh-Yen Lin, Hung-yi Lee, Yun-Nung Chen
url: https://arxiv.org/abs/2408.02442
published: 2024-08-05
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

A study asking whether forcing a model to answer in JSON, XML or similar formats hurts it. The authors compare format-restricted and free-form answers across common tasks and report that reasoning gets worse under format restrictions, more so the stricter the format. Only the abstract was read.

## Key claims

- Structured generation is common in real apps. "Structured generation, the process of producing content in standardized formats like JSON and XML, is widely utilized in real-world applications" (abstract)
- The question: do format constraints hurt reasoning and domain knowledge? "This study investigates whether such constraints on generation space impact LLMs abilities, including reasoning and domain knowledge comprehension." (abstract)
- Headline finding. "we observe a significant decline in LLMs reasoning abilities under format restrictions." (abstract)
- Stricter is worse. "stricter format constraints generally lead to greater performance degradation in reasoning tasks." (abstract)

## Visuals worth redrawing

- None recorded (abstract only).

## My notes

- v1 2024-08-05, v3 2024-10-14.
- Disputed by `kurt-say-what-you-mean`, which re-ran the tasks and found the opposite. The rebuttal says the paper used different prompts for the two conditions and used an LLM (Claude 3 Haiku) to parse free-text answers. I didn't read the paper body, so I can't judge the rebuttal's details myself.
