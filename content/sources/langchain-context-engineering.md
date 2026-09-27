---
id: langchain-context-engineering
title: Context Engineering
author: LangChain team
url: https://www.langchain.com/blog/context-engineering-for-agents
published: 2025-07-02
accessed: 2026-09-27
kind: blog
primary: false
---

## Summary

LangChain's overview of context engineering for agents. It sorts the techniques into four moves: write context out of the window, select what comes back in, compress what's there, and isolate pieces into separate windows. Each comes with examples from real agents.

## Key claims

- Karpathy's analogy. "The LLM is like the CPU and its context window is like the RAM, serving as the model's working memory." (Context Engineering)
- Kinds of context: instructions (prompts, memories, few-shot examples, tool descriptions), knowledge (facts, memories), tools (feedback from tool calls). (Context types commonly used in LLM applications)
- Write: "Saving context outside the context window to help an agent perform a task" (Write Context)
- Select: "Pulling context into the context window to help an agent perform a task" (Select Context)
- Compress: "Retaining only the tokens required to perform a task" (Compressing Context)
- Isolate: "Splitting context up to help an agent perform a task" (Isolating Context)
- Tool selection by retrieval: "retrieval augmented generation to fetch only the most relevant tools for a task" (Select Context, Tools)
- "Claude Code runs 'auto-compact' after you exceed 95% of the context window and it will summarize the full trajectory of user-agent interactions." (Context Summarization)
- Trimming: removing parts of the context by a rule, such as dropping older messages. (Context Trimming)
- Sub-agents "operate in parallel with their own context windows". (Isolating Context)
- "Anthropic reports that subagents can use up to 15× more tokens than chat." (Multi-agent)

## Visuals worth redrawing

- The four-box write/select/compress/isolate diagram. Redraw as four arrows in and out of one window.

## My notes

- Vendor of agent tooling; useful as a way to organize the topic, not for measurements.
- The 95% auto-compact figure is from 2025 and about one product; it will change.
