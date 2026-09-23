---
id: zheng-personas-system-prompts
title: "When \"A Helpful Assistant\" Is Not Really Helpful: Personas in System Prompts Do Not Improve Performances of Large Language Models"
author: Mingqian Zheng, Jiaxin Pei, Lajanugen Logeswaran, Moontae Lee, David Jurgens
url: https://arxiv.org/abs/2311.10054
published: 2023-11-16        # v1; v3 revised 2024-10-09; Findings of EMNLP 2024
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

A large test of whether putting a persona in the system prompt ("You are a lawyer") makes models answer factual questions better. Across 162 roles and 2,410 MMLU questions on open instruction-tuned models, it doesn't: accuracy is no better than with no persona. Some persona helps on some question, but you can't predict which, and automatic persona picking did about as well as random.

## Key claims

- The practice being tested. "Commercial AI systems commonly define the role of the LLM in system prompts. For example, ChatGPT uses ``You are a helpful assistant'' as part of its default system prompt." (Abstract)
- Size of the test. "We curate a list of 162 roles covering 6 types of interpersonal relationships and 8 domains of expertise." and "4 popular families of LLMs and 2,410 factual questions" (Abstract)
- Main result. "adding personas in system prompts does not improve model performance across a range of questions compared to the control setting where no persona is added." (Abstract)
- Persona details still move results a little. "the gender, type, and domain of the persona can all influence the resulting prediction accuracies." (Abstract)
- You can't pick the winning persona in advance. "automatically identifying the best persona is challenging, with predictions often performing no better than random selection." (Abstract)
- Conclusion. "the effect of each persona can be largely random." (Abstract)
- Models (v3): "FLAN-T5-XXL (11B) ..., Llama3-Instruct (8B and 70B) ..., Mistral7B-Instruct-v0.2 ... and Qwen2.5Instruct (3B to 72B)". (§ Models)
- Questions come from MMLU, 2,410 questions balanced across 26 subjects, grouped into 8 domains. (§ Dataset)
- Two framings were tested: speaker ("You are a/an {role}") and audience ("You are talking to a/an {role}"). "Audience-specific prompts are significantly better than speaker-specific prompts with small effect sizes" (Figure 3 caption)
- Some models ignore personas entirely: "Qwen2.5-7B and Qwen2.5-72B are insensitive to all 162 personas." (§ Results)

## Visuals worth redrawing

- None needed. A single bar pair "no persona vs persona, average accuracy" would summarize it, but I didn't copy exact numbers, so don't plot values.

## My notes

- Open models only (Llama 3, Qwen 2.5, Mistral, FLAN-T5), multiple-choice factual questions. It doesn't test tone, style, or closed frontier models.
- Pairs with `basil-expert-personas` (2025, closed models incl. reasoning models, harder questions), which reaches the same result.
