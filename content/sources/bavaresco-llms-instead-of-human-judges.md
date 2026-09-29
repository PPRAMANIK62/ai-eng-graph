---
id: bavaresco-llms-instead-of-human-judges
title: "LLMs instead of Human Judges? A Large Scale Empirical Study across 20 NLP Evaluation Tasks"
author: Anna Bavaresco, Raffaella Bernardi, Leonardo Bertolazzi, et al.
url: https://arxiv.org/abs/2406.18403
published: 2024-06-26
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Builds JUDGE-BENCH, 20 datasets with human labels covering many properties (toxicity, coherence, factual consistency, instruction following, and more), and checks how well 11 LLMs used as judges reproduce those labels. Agreement swings widely by model, dataset and property. Judges are good on some tasks, poor on others, closer to non-expert labels than expert ones, and chain-of-thought doesn't reliably help. Accepted to the main conference of ACL 2025. Read from the arXiv PDF.

## Key claims

- Scale: "an extensible collection of 20 NLP datasets with human annotations" and "11 current LLMs, covering both open-weight and proprietary models". (Abstract)
- The main finding: "Models are reliable evaluators on some tasks, but overall display substantial variability depending on the property being evaluated, the expertise level of the human judges, and whether the language is human or model-generated." (Abstract)
- Where it works: "On some tasks, such as instruction following and the generation of mathematical reasoning traces, models can be reliably used as evaluators." (Conclusions)
- Where it doesn't: "Among the property types with the lowest human-model alignment are toxicity and safety", where "model scores can be even negative". (Results)
- Expert vs non-expert: "all models achieve higher correlations with annotations by non-expert human judges compared to expert annotators". The authors' guess, marked speculative: non-experts "might rely on surface-level features", while "experts apply stricter, domain-specific criteria." (Results)
- Chain-of-thought: "elicitation strategies such as Chain-of-Thought prompting do not consistently improve agreement levels". (Conclusions)
- Open vs closed: GPT-4o aligned best overall, "but there is a rather small gap with large open-source models". (Introduction)
- The recommendation: "we recommend validating LLM judges against task-specific human annotations before deploying them for any particular task." (Introduction)

## Visuals worth redrawing

- Figure 2: average correlation with expert vs non-expert annotators, per model.

## My notes

- Mostly academic NLP datasets, not product traces. Its value here is the spread: the same judge is fine on one property and poor on the next, so a published agreement number doesn't transfer to your task.
