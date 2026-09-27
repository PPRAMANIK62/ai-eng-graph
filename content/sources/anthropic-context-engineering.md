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
- Prompt engineering defined, for contrast. "Prompt engineering refers to methods for writing and organizing LLM instructions for optimal outcomes" (Context engineering vs. prompt engineering; added 2026-09-27)
- Context engineering defined: "The set of strategies for curating and maintaining the optimal set of tokens (information) during LLM inference, including all the other information that may land there outside of the prompts." (Context engineering vs. prompt engineering; added 2026-09-27)
- It's repeated every turn. "context engineering is iterative and the curation phase happens each time we decide what to pass to the model" (Context engineering vs. prompt engineering; added 2026-09-27)
- Bloated tool sets. "One of the most common failure modes we see is bloated tool sets that cover too much functionality" (The anatomy of effective context; added 2026-09-27)
- Tool choice test. "If a human engineer can't definitively say which tool should be used in a given situation, an AI agent can't be expected to do better." (The anatomy of effective context; added 2026-09-27)
- Just in time. "agents built with the 'just in time' approach maintain lightweight identifiers (file paths, stored queries, web links, etc.)" and load data at runtime with tools (Context retrieval and agentic search; added 2026-09-27)
- Claude Code uses head and tail to look at large data "without ever loading the full data objects into context." (Context retrieval and agentic search; added 2026-09-27)
- The cost of it. "runtime exploration is slower than retrieving pre-computed data" (Context retrieval and agentic search; added 2026-09-27)
- Hybrid. "CLAUDE.md files are naively dropped into context up front, while primitives like glob and grep allow it to navigate its environment and retrieve files just-in-time" (Context retrieval and agentic search; added 2026-09-27)
- Compaction keeps "architectural decisions, unresolved bugs, and implementation details" and drops redundant tool outputs. (Compaction; added 2026-09-27)
- "One of the safest lightest touch forms of compaction is tool result clearing" (Compaction; added 2026-09-27)
- Tuning a compaction prompt. "Start by maximizing recall to ensure your compaction prompt captures every relevant piece of information from the trace, then iterate to improve precision" (Compaction; added 2026-09-27)
- Notes. "Structured note-taking, or agentic memory, is a technique where the agent regularly writes notes persisted to memory outside of the context window" (Structured note-taking; added 2026-09-27)
- Sub-agents: each works in its own clean window and "returns only a condensed, distilled summary of its work (often 1,000-2,000 tokens)" (Sub-agent architectures; added 2026-09-27)
- Won't go away with better models. "treating context as a precious, finite resource will remain central to building reliable, effective agents." (Conclusion; added 2026-09-27)

## Visuals worth redrawing

- None needed for the context-window node. A small n² grid (every token connected to every other) would show why pairs grow fast.

## My notes

- The n² and training-data reasons are Anthropic's explanation, not a measured result in this post. Present them as the likely reasons.
- Most of the post is about agents; the context-engineering node should use the rest.
