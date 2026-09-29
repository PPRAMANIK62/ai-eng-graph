---
id: husain-shankar-agentic-workflows
title: "Q: How do I evaluate agentic workflows?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/how-do-i-evaluate-agentic-workflows.html
published: 2025-06-29
accessed: 2026-09-29
kind: blog
primary: false
---

## Summary

An entry in Husain and Shankar's evals FAQ (modified 2026-09-01). Evaluate an agent in two phases: first end to end, as a black box, did it meet the user's goal; then, using traces, score individual steps to find where it broke. Record the first upstream failure, and use a transition failure matrix to see which step-to-step handoffs fail most.

## Key claims

- Phase one: "Treat the agent as a black box and decide whether it met the user's goal." (first phase: end-to-end)
- "Record the first upstream failure during error analysis." (first phase: end-to-end)
- Phase two: "After you log the system's traces, you can score individual components such as:" tool choice, parameter extraction, error handling, keeping constraints across steps, efficiency (steps, time, tokens), and milestones. (second phase: step-level diagnostics)
- Tool calls: "Test the tool name, arguments, result, and resulting state as separate checks." (second phase: step-level diagnostics)
- Transition matrix: "Create a matrix where rows represent the last successful state and columns represent where the first failure occurred." (transition failure matrix part)
- In their text-to-SQL example, "GenSQL → ExecSQL transitions cause 12 failures while DecideTool → PlanCal causes only 2". (transition failure matrix part)

## Visuals worth redrawing

- The transition failure matrix heat map (last good state vs first failure).

## My notes

- Practitioners, not builders of a product; the FAQ is widely used and kept updated.
