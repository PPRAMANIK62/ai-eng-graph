---
id: anthropic-reduce-latency
title: Reducing latency
author: Anthropic
url: https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Anthropic's short guide to making Claude calls faster: pick a faster model, trim prompt and output tokens, cap output with `max_tokens`, and stream. It also says to get quality right before cutting latency.

## Key claims

- What latency depends on. "Latency can be influenced by various factors, such as the size of the model, the complexity of the prompt, and the underlying infrastructure supporting the model and point of interaction." (intro)
- Quality first. "It's always better to first engineer a prompt that works well without model or prompt constraints, and then try latency reduction strategies afterward." (Note, intro)
- TTFT defined. "This metric measures the time it takes for the model to generate the first token of the response, from when the prompt was sent." (How to measure latency)
- Model choice is a direct lever; Haiku 4.5 is named as fastest. "For speed-critical applications, **Claude Haiku 4.5** offers the fastest response times while maintaining high intelligence" (1. Choose the right model)
- Fewer tokens, faster response. "The fewer tokens the model has to process and generate, the faster the response will be." (2. Optimize prompt and output length)
- Ask for sentence or paragraph limits, not word counts. "asking for an exact word count or a word count limit is not as effective a strategy as asking for paragraph or sentence count limits." (2, Tip)
- `max_tokens` is blunt. "When the response reaches `max_tokens` tokens, the response will be cut off, perhaps mid-sentence or mid-word" (2, Note)
- Streaming improves how fast it feels. "This can significantly improve the perceived responsiveness of your application, as users can see the model's output in real time." (3. Stream responses)

## Visuals worth redrawing

- None.

## My notes

- Names Claude Haiku 4.5 as the fast model as of 2026-09. Model names will go stale.
