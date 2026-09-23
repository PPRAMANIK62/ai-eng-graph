---
id: willison-2025-year-in-llms
title: "2025: The year in LLMs"
author: Simon Willison
url: https://simonwillison.net/2025/Dec/31/the-year-in-llms/
published: 2025-12-31
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

Willison's year-end review of 2025: reasoning models trained on verifiable rewards, agents becoming real (mostly for coding and search), coding agents led by Claude Code, longer tasks, and the security worries that come with letting agents act on their own. Useful as a dated marker of how LLM use changed between mid-2024 and end of 2025.

## Key claims

- Reasoning as the 2025 trend: started by OpenAI's o1 in 2024-09, then everywhere. "reasoning has since become a signature feature of models from nearly every other major AI lab." (The year of “reasoning”)
- How it works, quoting Karpathy. "By training LLMs against automatically verifiable rewards across a number of environments (e.g. think math/code puzzles), the LLMs spontaneously develop strategies that look like “reasoning” to humans" (The year of “reasoning”)
- His agent definition. "an LLM that runs tools in a loop to achieve a goal." (The year of agents)
- He expected agents not to work. "I didn’t think agents would happen because I didn’t think the gullibility problem could be solved" (The year of agents)
- They did, in a narrower sense. "if you define agents as LLM systems that can perform useful work via tool calls over multiple steps then agents are here and they are proving to be extraordinarily useful." (The year of agents)
- Where. "The two breakout categories for agents have been for coding and for search." (The year of agents)
- Claude Code, released February 2025, as the year's biggest event. "The most impactful event of 2025 happened in February, with the quiet release of Claude Code." (The year of coding agents and Claude Code)
- Coding agent definition. "LLM systems that can write code, execute that code, inspect the results and then iterate further." (The year of coding agents and Claude Code)
- Revenue marker. "As-of December 2nd Anthropic credit Claude Code with $1bn in run-rate revenue!" (The year of coding agents and Claude Code)
- Longer tasks: per METR's chart, GPT-5, GPT-5.1 Codex Max and Claude Opus 4.5 could do tasks that take humans multiple hours; "2024’s best models tapped out at under 30 minutes." (The year of long tasks)
- Risk: agents asking for confirmation makes sense "In a world where an agent mistake could wipe your home folder or a malicious prompt injection attack could steal your credentials" (The year of YOLO and the Normalization of Deviance)

## Visuals worth redrawing

- A timeline for `llm-use-cases`: ChatGPT launch 2022-11 → applied-llms "prefer deterministic workflows" 2024-06 → o1 reasoning 2024-09 → Claude Code 2025-02 → Claude Code $1bn run-rate 2025-12 → Anthropic "sessions increasingly agentic" 2026-06. Built from this note plus `yan-year-of-building-llms`, `chatterji-how-people-use-chatgpt`, `anthropic-economic-index-cadences`.

## My notes

- Commentary, not primary, but by a builder who tracks this closely and links to his sources.
- He says his agent prediction was "half right": the do-anything assistant didn't show up.
- The METR "doubling every 7 months" claim is METR's; he's not convinced it holds. Don't use it as a fact.
