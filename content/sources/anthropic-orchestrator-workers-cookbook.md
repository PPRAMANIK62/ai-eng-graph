---
id: anthropic-orchestrator-workers-cookbook
title: Orchestrator-Workers Workflow (claude-cookbooks notebook)
author: Anthropic
url: https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/orchestrator_workers.ipynb
published: 2026-02-17          # date of the last commit touching the file
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

A short notebook that implements the orchestrator-workers pattern from "Building effective agents" as one Python class. An orchestrator call reads the task, writes an analysis and a list of subtasks in XML; the code parses that list and calls a worker once per subtask, giving each worker the original task plus its own subtask. The example writes marketing copy for a water bottle, and the orchestrator picks which styles to write. The notebook is honest about what's missing: workers run one after another, and there's no step that combines their outputs.

## Key claims

- The idea: a central LLM analyzes each task and will "dynamically determine the best subtasks to delegate to specialized worker LLMs." (Introduction)
- Two phases: an "Analysis & Planning Phase" where the orchestrator "generates structured subtask descriptions in XML format", then an "Execution Phase" where each worker gets "The original task for context" and "Its specific subtask type and description". (How It Works)
- Run time is the point: "The orchestrator decides *at runtime* what subtasks to create, making this more adaptive than pre-defined parallel workflows." (How It Works)
- When not to use it: "Subtasks are predictable and can be pre-defined (use simpler parallelization)"; "Latency is critical (multiple LLM calls add overhead)"; and simple single-output tasks. (When to use this workflow)
- The example orchestrator prompt asks to "break it down into 2-3 distinct approaches" and return `<analysis>` and `<tasks>` tags. (Example Use Case, code cell)
- Cost: "Requires N+1 LLM calls (1 orchestrator + N workers)". (Limitations & Considerations)
- Workers aren't parallel here: "Sequential processing in this implementation (workers run one at a time)", with `asyncio` or thread pools suggested instead. The class docstring still says it runs subtasks "in parallel". (Limitations & Considerations; code cell 2)
- No combining step yet: listed as a next step, "Add a synthesis phase where an LLM combines worker outputs". The code returns the analysis and the list of worker results. (Next Steps; code cell 2)
- Failure modes: "Orchestrator might not break down tasks optimally (prompt engineering is critical)", "Workers may return empty or malformed responses", and "XML parsing can fail if models don't follow format exactly". (Limitations & Considerations)
- Mixing models: "Consider using Claude Opus for the orchestrator and Claude Haiku for workers to optimize cost vs. quality". (Next Steps)
- The code swaps an empty worker response for an error string rather than retrying; retry logic is another listed next step. (code cell 2; Next Steps)

## Visuals worth redrawing

- None in the notebook. The two phases (plan, then one worker call per subtask) are easy to draw.

## My notes

- `parse_tasks` reads the XML line by line and expects each tag on its own line; a task written on one line would be skipped silently. Observed from reading the code, not from running it.
- The helper calls `claude-sonnet-4-6` for both roles.
