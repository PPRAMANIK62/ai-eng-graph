---
id: anyscale-fine-tuning-llama-2
title: "Fine-Tuning Llama-2: A Comprehensive Case Study for Tailoring Models to Unique Applications"
author: Kourosh Hakhamaneshi, Rehaan Ahmad (Anyscale)
url: https://www.anyscale.com/blog/fine-tuning-llama-2-a-comprehensive-case-study-for-tailoring-models-to-unique-applications
published: 2023-08-11
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Full-parameter fine-tunes of Llama-2 (7B, 13B, 70B) on three tasks. Two are about output form (turning a sentence into a structured "functional representation", and text to SQL), where fine-tuned small models beat GPT-4. The third is grade-school math (GSM8k), where fine-tuning helped but the models stayed behind GPT-4. Framed around the rule "fine-tuning is for form, not facts".

## Key claims

- The rule of thumb. "fine-tuning is for form, not facts" (intro)
- ViGGO (structured functional representation): "With the Llama-13b variant we observed an increase in accuracy from, 58% to 98% on functional representations." GPT-4's accuracy "significantly drops when attribute precedence is considered." (ViGGO section)
- SQL: "Both the Llama-7b and 13b fine-tuned models outperform the 70b-chat and GPT-4 models" (SQL section)
- GSM8k math: Llama-13B went from 28% to 47%, still below GPT-4. "there are tasks like math reasoning and understanding that OSS models are just behind even after significant gains obtained by fine-tuning." (GSM8k section)
- GSM8k's training set is small for learning reasoning: "only 8k data points". (GSM8k section)
- The 47% came after two rounds: first on MathQA ("a collection of 30,000 question/answer pairs that are much noisier"), then on GSM8k. "This extra round of fine-tuning resulted in a further 10% increase from the initial fine-tuned model results, adding up to a 20% increase from the base model." (Further Improving Fine-Tuning Results)
- Same Llama-13b summary also gives SQL: "42% to 89% on SQL generation". (intro)
- Method: full-parameter fine-tuning of "all parameters in the model", not LoRA. (setup)

## Visuals worth redrawing

- Before/after accuracy per task: ViGGO 58 → 98, GSM8k 28 → 47.

## My notes

- 2023 models and GPT-4 as baseline; the split between form tasks and reasoning tasks is the lasting part.
