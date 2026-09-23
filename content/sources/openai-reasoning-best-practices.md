---
id: openai-reasoning-best-practices
title: Reasoning best practices
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/reasoning-best-practices
published: undated           # no date on the page; mentions o1-2024-12-17, o3 and o4-mini
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

OpenAI's guide to reasoning models (the o-series) versus GPT models: when to use which, and how to prompt them. Reasoning models do better with short, high-level prompts. Classic tricks like "think step by step" are unnecessary, and few-shot examples often aren't needed: try zero-shot first, and if you add examples, make sure they match your instructions exactly.

## Key claims

- Keep it simple. "Keep prompts simple and direct: The models excel at understanding and responding to brief, clear instructions." (Advice on prompting)
- Skip step-by-step prompts. "Since these models perform reasoning internally, prompting them to “think step by step” or “explain your reasoning” is unnecessary." (Advice on prompting)
- Old tricks can backfire. Some prompt engineering techniques, like instructing the model to "think step by step", "may not enhance performance (and can sometimes hinder it)." (Advice on prompting, intro)
- Use delimiters. "Use delimiters like markdown, XML tags, and section titles to clearly indicate distinct parts of the input" (Advice on prompting)
- Examples: zero-shot first. "Reasoning models often don’t need few-shot examples to produce good results, so try to write prompts without examples first." (Advice on prompting)
- If you add examples, match them to the instructions. "Just ensure that the examples align very closely with your prompt instructions, as discrepancies between the two may produce poor results." (Advice on prompting)
- Developer messages. "Starting with o1-2024-12-17, reasoning models support developer messages rather than system messages, to align with the chain of command behavior described in the model spec." (Advice on prompting)
- Two model families. Reasoning models (o3, o4-mini) vs GPT models (GPT-4.1): o-series are "the planners", trained "to think longer and harder about complex tasks"; GPT models are "the workhorses", "designed for straightforward execution". (Reasoning models vs. GPT models)
- How to choose. "Speed and cost → GPT models are faster and tend to cost less" and "Accuracy and reliability → o-series models are reliable decision makers". "Most AI workflows will use a combination of both models" (How to choose)
- Reasoning models handle vague prompts and may ask back: they "will often ask clarifying questions before making uneducated guesses or attempting to fill information gaps." (When to use our reasoning models, 1)
- Regular models suit well-defined tasks. "Executing well defined tasks → GPT models handle explicitly defined tasks well" (How to choose)
- Reasoning models suit complex, ambiguous problems. "Complex problem-solving → o-series models work through ambiguity and complexity" (How to choose)

## Visuals worth redrawing

- None.

## My notes

- Vendor advice, no numbers given. Contrasts with Anthropic's "3–5 examples" and "multishot examples work with thinking" (`anthropic-prompting-best-practices`). Both can hold: examples are optional for reasoning models, and when used they must agree with the instructions.
- The page's model names (o1, o3, o4-mini) are older than the 2026 GPT-6 models on other OpenAI pages; the guide may not have been refreshed. Date the advice.
