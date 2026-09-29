---
id: langsmith-trajectory-evals
title: How to evaluate your agent with trajectory evaluations
author: LangChain
url: https://docs.langchain.com/langsmith/trajectory-evals
published: 2026
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

LangSmith docs for grading an agent's path: the list of messages and tool calls it made. The `agentevals` package compares that path with a reference in four modes (strict, unordered, subset, superset), or asks an LLM judge to rate the path.

## Key claims

- Why: some behaviors show up only with a real model, like "which tool the agent decides to call, how it formats responses, or whether a prompt modification affects the entire execution trajectory." (intro)
- Package: `agentevals` (Python and TypeScript). (setup)
- Strict: "Exact match of messages and tool calls in the same order." Use for "testing specific sequences (e.g., policy lookup before authorization)." (trajectory match evaluators)
- Unordered: "Same tool calls allowed in any order." (trajectory match evaluators)
- Subset: "Agent calls only tools from reference (no extras)." Used to check "that the agent did not call any irrelevant or unnecessary tools." (trajectory match evaluators)
- Superset: "Agent calls at least the reference tools (extras allowed)." (trajectory match evaluators)
- Tool arguments: `tool_args_match_mode` controls how tool-call arguments are compared. (trajectory match evaluators)
- LLM judge: uses "an LLM to qualitatively validate your agent's execution trajectory"; "more flexible and can assess nuanced aspects like efficiency and appropriateness, but requires an LLM call and is less deterministic." (LLM-as-judge evaluator)

## Visuals worth redrawing

- The four match modes as reference vs actual tool sequences.

## My notes

- Vendor docs, primary for their own package.
