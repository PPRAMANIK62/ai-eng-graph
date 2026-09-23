---
id: wallace-instruction-hierarchy
title: "The Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions"
author: Eric Wallace, Kai Xiao, Reimar Leike, Lilian Weng, Johannes Heidecke, Alex Beutel (OpenAI)
url: https://arxiv.org/abs/2404.13208
published: 2024-04-19
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

An OpenAI paper on why prompt injection works: models tend to treat the developer's system prompt and text from users or third parties as equally important. The authors define a hierarchy for which instruction wins when they conflict, generate training data that teaches it, and train GPT-3.5 on it. Robustness goes up a lot, with little loss in normal ability. It's a training fix, which shows that priority is something the model learns, not something the API enforces.

## Key claims

- Attacks overwrite the developer's instructions. "Today's LLMs are susceptible to prompt injections, jailbreaks, and other attacks that allow adversaries to overwrite a model's original instructions with their own malicious prompts." (Abstract)
- The root cause: no real priority. "LLMs often consider system prompts (e.g., text from an application developer) to be the same priority as text from untrusted users and third parties." (Abstract)
- The fix is a defined hierarchy. "we propose an instruction hierarchy that explicitly defines how models should behave when instructions of different priorities conflict." (Abstract)
- It's taught through generated training data. "a data generation method to demonstrate this hierarchical instruction following behavior, which teaches LLMs to selectively ignore lower-privileged instructions." (Abstract)
- Tested on GPT-3.5 with large gains, even on unseen attacks. "We apply this method to GPT-3.5, showing that it drastically increases robustness -- even for attack types not seen during training" (Abstract)
- Small cost to normal use. "while imposing minimal degradations on standard capabilities." (Abstract)

## Visuals worth redrawing

- None used; only the abstract was read.

## My notes

- Only the abstract was read (2026-09-23). Don't cite specific benchmark numbers from the body.
- 2024, GPT-3.5. The Model Spec's chain of command (`openai-model-spec`) is the current form of the same idea.
- "Drastically increases robustness" is not "immune". The paper's framing supports: the system prompt is a priority signal that training strengthens, not a security boundary.
