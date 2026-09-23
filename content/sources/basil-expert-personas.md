---
id: basil-expert-personas
title: "Prompting Science Report 4: Playing Pretend: Expert Personas Don't Improve Factual Accuracy"
author: Savir Basil, Ina Shapiro, Dan Shapiro, Ethan Mollick, Lilach Mollick, Lennart Meincke (Wharton Generative AI Labs)
url: https://arxiv.org/abs/2512.05858
published: 2025-12-05
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

A 2025 test of expert and low-knowledge personas on hard multiple-choice benchmarks (GPQA Diamond and MMLU-Pro) across six OpenAI and Google models, including reasoning models. Expert personas ("you are a physics expert") gave no consistent accuracy gain. Personas outside the question's domain sometimes hurt, low-knowledge ones ("toddler") often hurt, and narrow expert roles made one model refuse questions. The authors say personas may still change tone and focus.

## Key claims

- The question. "we ask whether assigning personas to models improves performance on difficult objective multiple-choice questions." (Abstract)
- Setup: six models on GPQA Diamond and MMLU-Pro, "graduate-level questions spanning science, engineering, and law." (Abstract)
- Models: "GPT-4o, GPT-4o-mini, o3-mini, o4-mini, Gemini 2.0 Flash, and Gemini 2.5 Flash" — "both reasoning and non-reasoning models". (Methods)
- 25 runs per question per condition. "We collected 25 independent responses per question for each model-prompt condition" (Methods)
- Matched experts do nothing. An in-domain expert persona "had no significant impact on performance (with the exception of the Gemini 2.0 Flash model)." (Abstract)
- Overall. "Across both benchmarks, persona prompts generally did not improve accuracy relative to a no-persona baseline. Expert personas showed no consistent benefit across models, with few exceptions." (Abstract)
- Mismatched and low-knowledge personas can hurt. "Domain-mismatched expert personas sometimes degraded performance. Low-knowledge personas often reduced accuracy." (Abstract)
- Example personas used: "You are a world-class expert in physics, with deep knowledge across all areas of the field..." and "You are a 4-year-old toddler who thinks the moon is made of cheese." (Methods, persona list)
- Narrow roles can cause refusals. With an unrelated expert persona on GPQA Diamond, Gemini 2.5 Flash "refuses to answer an average of 10.56 out of the 25 trials per question", "typically asserting that it lacks the relevant expertise". The authors: "role instructions that are too narrow can cause models to under-utilize their actual knowledge." (Results)
- Scope limit, stated by the authors. "These results are about the accuracy of answers only; personas may serve other purposes (such as altering the tone of outputs), beyond improving factual performance." (Abstract)
- Personas may change focus. "personas may change what factors the AI focuses on and how it approaches reasoning about a problem." (Results/Discussion)
- Their example of a shift in focus. "Personas may shift what the AI prioritizes (emphasizing regulatory concerns for compliance officers vs. market opportunities for business developers)" (Results/Discussion)

## Visuals worth redrawing

- A small table: persona type (in-domain expert, off-domain expert, low-knowledge) × effect on accuracy (none / sometimes worse / often worse). Built from the abstract's wording, no invented numbers.

## My notes

- 2025, models from 2024–2025. No Claude models tested.
- The Gemini 2.0 Flash exception may be an outlier; the authors note Gemini 2.5 Flash didn't show it.
- Agrees with `zheng-personas-system-prompts` (2023, open models). Together: two studies, ~2 years apart, open and closed models, same answer on accuracy.
