---
id: anthropic-prompt-caching-launch
title: Prompt caching with Claude
author: Anthropic
url: https://claude.com/blog/prompt-caching
published: 2024              # launch post; the page now shows "August 14, 2025", but its own update note on general availability is dated 2024-12-17 and it announces a beta for Claude 3.5 Sonnet, so the text is from 2024
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Anthropic's announcement of prompt caching for Claude, with the first measured speed and cost numbers. It gives a table of time-to-first-token with and without caching for three workloads, and the original pricing (writes 25% above input, reads 10% of input). The prices are for Claude 3 models and are out of date; the percentages are the useful part.

## Key claims

- Headline numbers. "reducing costs by up to 90% and latency by up to 85% for long prompts." (intro)
- Measured time to first token, without / with caching, and cost reduction: chat with a book (100,000-token cached prompt) 11.5 s / 2.4 s (−79%), −90% cost; many-shot prompting (10,000-token prompt) 1.6 s / 1.1 s (−31%), −86% cost; multi-turn conversation (10 turns, long system prompt) ~10 s / ~2.5 s (−75%), −53% cost. (table)
- Pricing at launch. "Writing to the cache costs 25% more than our base input token price for any given model, while using cached content is significantly cheaper, costing only 10% of the base input token price." (How we price cached prompts)
- Use cases: conversational agents, coding assistants, large documents, detailed instruction sets with "dozens of diverse examples", agentic tool use, long-form content. (When to use prompt caching)
- Launched in public beta for Claude 3.5 Sonnet, Claude 3 Opus and Claude 3 Haiku; update: "Prompt caching is Generally Available on the Anthropic API." (December 17, 2024) (intro)

## Visuals worth redrawing

- The latency table as paired bars (without vs with caching) per workload.

## My notes

- The numbers are Anthropic's own, from 2024 models. The shape (bigger saving for longer cached prefixes) is the lasting point.
