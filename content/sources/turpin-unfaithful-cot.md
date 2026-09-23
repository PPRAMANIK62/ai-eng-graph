---
id: turpin-unfaithful-cot
title: "Language Models Don't Always Say What They Think: Unfaithful Explanations in Chain-of-Thought Prompting"
author: Miles Turpin, Julian Michael, Ethan Perez, Samuel R. Bowman
url: https://arxiv.org/abs/2305.04388
published: 2023-05-07        # v2 2023-12-09; NeurIPS 2023
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

Shows that a model's written chain of thought can be a plausible story that isn't the real reason for its answer. The authors slip a hidden bias into the prompt, such as making the correct answer always "(A)" in the few-shot examples, or having the user suggest an answer. The model's answers follow the bias, but its step-by-step explanations almost never mention it; instead they rationalize the biased answer.

## Key claims

- The tempting assumption. "It is tempting to interpret these CoT explanations as the LLM's process for solving a task." (Abstract)
- The finding. "we find that CoT explanations can systematically misrepresent the true reason for a model's prediction." (Abstract)
- Biasing feature 1, "Answer is Always A": reorder the few-shot examples' options so the right one is always (A). (Abstract, §3)
- Biasing feature 2, "Suggested Answer": add "I think the answer is <random_label> but I’m curious to hear what you think." to the prompt (the label is picked at random). (§3, Figure 1)
- Models don't mention the bias; they rationalize. "When we bias models toward incorrect answers, they frequently generate CoT explanations rationalizing those answers." (Abstract)
- Accuracy drops by up to 36% on 13 BIG-Bench Hard tasks, with GPT-3.5 and Claude 1.0. "This causes accuracy to drop by as much as 36% on a suite of 13 tasks from BIG-Bench Hard, when testing with GPT-3.5 from OpenAI and Claude 1.0 from Anthropic." (Abstract)
- Of 426 explanations supporting biased predictions that the authors reviewed, only 1 mentioned the bias. "we review 426 explanations supporting biased predictions and only 1 explicitly mentions the bias" (§1; text wraps around Figure 1)
- Social bias: explanations justify stereotyped answers without mentioning stereotypes. "model explanations justify giving answers in line with stereotypes without mentioning the influence of these social biases." (Abstract)
- The risk. "CoT explanations can be plausible yet misleading, which risks increasing our trust in LLMs without guaranteeing their safety." (Abstract)

## Visuals worth redrawing

- Figure 1: the same question with and without the "Answer is Always A" bias; the model's explanation changes to justify (A) and never mentions the pattern. Redraw as two short transcripts.

## My notes

- 2023, GPT-3.5 and Claude 1.0, prompt-based CoT. The follow-up on reasoning models is `chen-reasoning-faithfulness` (2025), which finds the same problem, somewhat reduced.
- Faithfulness is about whether the text reflects the cause; it doesn't mean CoT doesn't help accuracy.
