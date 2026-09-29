---
id: anthropic-basic-workflows-cookbook
title: Basic Multi-LLM Workflows (claude-cookbooks notebook)
author: Anthropic
url: https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/basic_workflows.ipynb
published: 2025-11-28          # date of the last commit touching the file
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

A short notebook that implements three workflow patterns from "Building effective agents" as plain Python functions: `chain()` runs prompts one after another, feeding each output into the next; `parallel()` runs the same prompt over several inputs with a thread pool; `route()` asks the model to reason and pick a route in XML tags, then calls that route's specialist prompt. Examples: a four-step chain that turns a quarterly report into a sorted markdown table, a parallel stakeholder analysis, and support-ticket routing to billing, technical, account and product prompts. The helper `llm_call` in `util.py` calls `claude-sonnet-4-6` with `temperature=0.1`.

## Key claims

- The framing. The three workflows "trade off cost or latency for potentially improved task performances". (intro cell)
- Not for production. "These are sample implementations meant to demonstrate core concepts - not production code." (intro cell)
- Chain: "Chain multiple LLM calls sequentially, passing results between steps." A `for` loop over prompts with `result = llm_call(f"{prompt}\nInput: {result}")`. (code cell 2)
- Parallel: "Process multiple inputs concurrently with the same prompt." Uses `ThreadPoolExecutor(max_workers=3)` by default. (code cell 2)
- Route: "Route input to specialized prompt using content classification." The selector prompt asks the model to "First explain your reasoning, then provide your selection in this XML format", then `extract_xml` pulls `<selection>`, and the code looks it up with `routes[route_key]`. (code cell 2)
- Chain example steps: extract numbers and metrics, convert to percentages, sort descending, format as a markdown table. (Example 1)
- Route example: four specialist prompts ("billing", "technical", "account", "product"), each with its own role and response rules. (Example 3)

## Visuals worth redrawing

- None in the notebook; the three functions side by side make a good code-shaped figure.

## My notes

- `routes[route_key]` has no fallback: if the model returns a label that isn't a key (a typo, different casing after `.lower()`, an extra word), the lookup raises a `KeyError`. A real router needs a default route. Observed from reading the code, not from running it.
- `extract_xml` is a regex; Anthropic's tool-use docs now suggest a tool call or structured output for this kind of decision.
