---
id: meincke-decreasing-value-cot
title: "Prompting Science Report 2: The Decreasing Value of Chain of Thought in Prompting"
author: Lennart Meincke, Ethan Mollick, Lilach Mollick, Dan Shapiro (Wharton Generative AI Labs)
url: https://arxiv.org/abs/2506.07142
published: 2025-06-08
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

A short, careful test of "think step by step" on 2025 models, using the hard GPQA Diamond science benchmark, 25 runs per question. For regular (non-reasoning) models, a CoT prompt gives a small average gain but more variation, sometimes breaking questions the model would otherwise get right, and many of these models already reason a little without being asked. For reasoning models, CoT prompts add almost nothing but time.

## Key claims

- Benchmark: GPQA Diamond, 198 PhD-level multiple-choice questions in biology, physics and chemistry. "The GPQA Diamond set comprises 198 multiple-choice PhD-level questions across biology, physics, and chemistry." (Methods)
- Each prompt was run 25 times per question: 4,950 runs per prompt per model. "Each prompt condition was tested 25 times each across all 198 questions" (Methods)
- Models: non-reasoning Claude 3.5 Sonnet, Gemini 2.0 Flash, GPT-4o-mini, GPT-4o, Gemini 1.5 Pro; reasoning o3-mini, o4-mini, Gemini 2.5 Flash. (Methods)
- Three prompts compared: "Answer directly without any explanation or thinking. Just provide the answer.", "Think step by step", and no instruction at all. (Methods)
- Non-reasoning models: small average gain. "For non-reasoning models, CoT generally improves average performance by a small amount, particularly if the model does not inherently engage in step-by-step processing by default." (Abstract)
- But more variation. "CoT can introduce more variability in answers, sometimes triggering occasional errors in questions the model would otherwise get right." (Abstract)
- Many models already reason without being asked. "many recent models perform some form of CoT reasoning even if not asked; for these models, a request to perform CoT had little impact." (Abstract)
- Telling a model to answer with only the answer can hurt. "we found the common practice of prompting a model to reply with only the answer and nothing else is likely to harm the performance of non-reasoning models" (Discussion and Conclusion)
- Reasoning models: marginal gains, if any. "For models designed with explicit reasoning capabilities, CoT prompting often results in only marginal, if any, gains in answer accuracy." (Abstract)
- It costs time: 35–600% (5–15 s) longer for non-reasoning models, 20–80% (10–20 s) longer for reasoning models. "CoT requests took between 35-600% (5-15 seconds) longer than direct requests" (Results, non-reasoning); "CoT requests took between 20-80% (10-20 seconds) longer than direct requests" (Results, reasoning)
- Different CoT wordings made little difference. "in our tests, different CoT prompt variants had negligible effects" (Methods)

## Visuals worth redrawing

- Figures 1–3: per-model accuracy for Direct vs Step-by-step vs Default. Could be summarized as a small table: model type → accuracy change → time cost.

## My notes

- 2025. One benchmark (GPQA), multiple choice, a simple CoT prompt; the authors list these limits.
- The "answer only" finding matters for builders who force short outputs for parsing: that can remove the model's chance to reason.
- Matches OpenAI's advice to avoid CoT prompts on reasoning models (`openai-reasoning-best-practices`).
