---
id: anthropic-context-engineering
title: Effective context engineering for AI agents
author: Prithvi Rajasekaran, Ethan Dixon, Carly Ryan, Jeremy Hadfield (Anthropic)
url: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
published: 2025-09-29
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

Anthropic's engineering post on managing what goes into a model's context, mainly for agents. The useful part for the context window is its explanation of why long context degrades: every token relates to every other token, so the number of relationships grows with the square of the length, and models see fewer long sequences in training. The result is a gradual loss of precision, not a cliff.

## Key claims

- Context is finite and each extra token is worth less. "Context, therefore, must be treated as a finite resource with diminishing marginal returns." (Why context engineering is important to building capable agents)
- Context rot defined. "as the number of tokens in the context window increases, the model's ability to accurately recall information from that context decreases." (Why context engineering is important to building capable agents)
- Attention budget. "LLMs have an 'attention budget' that they draw on when parsing large volumes of context." (Why context engineering is important to building capable agents)
- Every token attends to every other, giving n² relationships. "This results in n² pairwise relationships for n tokens." (Why context engineering is important to building capable agents)
- Training has fewer long sequences. "Models develop their attention patterns from training data distributions where shorter sequences are typically more common than longer ones." (Why context engineering is important to building capable agents)
- Gradual, not a cliff. "These factors create a performance gradient rather than a hard cliff: models remain highly capable at longer contexts but may show reduced precision." (Why context engineering is important to building capable agents)
- The goal. "Finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome." (The anatomy of effective context)
- Compaction defined. "Compaction is the practice of taking a conversation nearing the context window limit, summarizing its contents, and reinitiating a new context window with the summary." (Context engineering for long-horizon tasks, Compaction)

## Visuals worth redrawing

- None needed for the context-window node. A small n² grid (every token connected to every other) would show why pairs grow fast.

## My notes

- The n² and training-data reasons are Anthropic's explanation, not a measured result in this post. Present them as the likely reasons.
- Most of the post is about agents; the context-engineering node should use the rest.
