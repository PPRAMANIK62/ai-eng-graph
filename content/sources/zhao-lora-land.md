---
id: zhao-lora-land
title: "LoRA Land: 310 Fine-tuned LLMs that Rival GPT-4, A Technical Report"
author: Justin Zhao, Timothy Wang, Wael Abid, et al. (Predibase)
url: https://arxiv.org/abs/2405.00732
published: 2024-04-29
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Predibase fine-tuned 10 open base models on 31 narrow tasks with 4-bit LoRA (310 models) and compared them with the base models and GPT-4. On average the fine-tunes won clearly. They also serve 25 of the adapters on one GPU by sharing the base model weights.

## Key claims

- Scale of the test. "across 10 base models and 31 tasks for a total of 310 models." (Abstract)
- Narrow fine-tunes beat GPT-4 on average. "We find that 4-bit LoRA fine-tuned models outperform base models by 34 points and GPT-4 by 10 points on average." (Abstract)
- Many adapters, one GPU. "hosts 25 LoRA fine-tuned Mistral-7B LLMs on a single NVIDIA A100 GPU with 80GB memory." (Abstract)
- The argument for specialists. "LoRA Land highlights the quality and cost-effectiveness of employing multiple specialized LLMs over a single, general-purpose LLM." (Abstract)

## Visuals worth redrawing

## My notes

- GPT-4 (2023-24) is the baseline; frontier models have moved a lot since. Read at the abstract level.
