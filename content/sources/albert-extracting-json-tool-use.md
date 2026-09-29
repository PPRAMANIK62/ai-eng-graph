---
id: albert-extracting-json-tool-use
title: Extracting Structured JSON using Claude and Tool Use
author: Alex Albert (Anthropic)
url: https://platform.claude.com/cookbook/tool-use-extracting-structured-json
published: 2024-04-03
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

An Anthropic cookbook from before native structured outputs. It gets JSON out of Claude by defining a "tool" whose input schema is the shape you want; Claude "calls" it, and the code reads the arguments from the `tool_use` block and never runs any function. Five examples: article summary, named entities, sentiment, text classification, and an open schema for unknown keys.

## Key claims

- Purpose. "In this cookbook, we'll explore various examples of using Claude and the tool use feature to extract structured JSON data from different types of input." (intro)
- Tasks. "We'll define custom tools that prompt Claude to generate well-structured JSON output for tasks such as summarization, entity extraction, sentiment analysis, and more." (intro)
- Examples: 1 article summarization, 2 named entity recognition (entities with `name`, `type`, `context`), 3 sentiment, 4 text classification (category scores), 5 working with unknown keys. (Examples 1 to 5)
- Unknown keys: an `input_schema` of `{"type": "object", "additionalProperties": True}` and a prompt telling Claude what to put in it. (Example 5)
- Forcing the tool: `tool_choice={"type": "tool", "name": "print_all_characteristics"}`; the code then reads `content.input` from the `tool_use` block. (Example 5, code)
- The code now sets `MODEL_NAME = "claude-haiku-4-5"`. (Set up the environment)

## Visuals worth redrawing

- None.

## My notes

- History: this predates `strict: true` and structured outputs. On Claude Opus 5.5 and Sonnet 5.5 forced `tool_choice` returns a 400 (see `anthropic-define-tools`), so the trick doesn't carry over to the newest models.
