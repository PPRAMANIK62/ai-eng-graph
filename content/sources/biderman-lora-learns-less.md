---
id: biderman-lora-learns-less
title: LoRA Learns Less and Forgets Less
author: Dan Biderman, Jacob Portes, Jose Javier Gonzalez Ortiz, et al. (Columbia, Databricks Mosaic)
url: https://arxiv.org/abs/2405.09673
published: 2024-05-15        # v2 2024-09-20; TMLR 2024
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Compares LoRA with full fine-tuning on code and math, both with instruction data (about 100K pairs) and with continued pretraining (20B tokens). In the usual low-rank setups LoRA did clearly worse on the target task, but it kept more of what the base model could do elsewhere.

## Key claims

- Setup. "We consider both the instruction finetuning (approximately 100K prompt-response pairs) and continued pretraining (20B unstructured tokens) data regimes." Domains: programming and mathematics. (Abstract)
- LoRA fell short. "in the standard low-rank settings, LoRA substantially underperforms full finetuning." (Abstract)
- But forgot less. "LoRA better maintains the base model's performance on tasks outside the target domain." (Abstract)
- A possible reason. "full finetuning learns perturbations with a rank that is 10-100X greater than typical LoRA configurations, possibly explaining some of the reported gaps." (Abstract)

## Visuals worth redrawing

## My notes

- Published at TMLR (2024). Thinking Machines (2025) cites it and agrees on the pretraining-sized case; they attribute much of the rest to setup (attention-only LoRA, learning rate).
