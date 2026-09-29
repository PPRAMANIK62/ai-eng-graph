---
id: openai-function-calling
title: Function calling
author: OpenAI
url: https://developers.openai.com/api/docs/guides/function-calling
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI's function calling guide. Its "best practices for defining functions" section is a second vendor's view of tool design: clear descriptions, the intern test, make invalid states impossible, let code fill what you already know, merge functions always called together, keep the initial set under about 20, use tool search for large tool surfaces, and turn on strict mode.

## Key claims

- "Write clear and detailed function names, parameter descriptions, and instructions." (Best practices for defining functions)
- The intern test: "Can an intern/human correctly use the function given nothing but what you gave the model?" (same)
- "Use enums and object structure to prevent invalid states." (same)
- "Offload the burden from the model and use code where possible." Don't make the model fill arguments you already have, and "combine functions that are always called in sequence". (same)
- Tool count: "Aim for fewer than 20 functions available at the start of a turn at any one time, though this is just a soft suggestion." (same)
- Large surfaces: "use tool search to defer large or infrequently used parts of your tool surface instead of exposing everything up front." (same)
- Strict mode: "We recommend always enabling strict mode." (Strict mode)
- Also called tool calling. "Function calling (also known as tool calling ) provides a powerful and flexible way for OpenAI models to interface with external systems and access data outside their training data." (intro)
- Five steps: "Make a request to the model with tools it could call", "Receive a tool call from the model", "Execute code on the application side with input from the tool call", "Make a second request to the model with the tool output", "Receive a final response from the model (or more tool calls)". (The tool calling flow)
- `tool_choice`: Auto (default, "Call zero, one, or multiple functions."), Required ("Call one or more functions."), Forced Function ("Call exactly one specific function."), Allowed tools (a subset), None. (Tool choice)
- Parallel calls: setting `parallel_tool_calls` to false "ensures exactly zero or one tool is called." (Parallel function calling)
- Strict mode: "Setting strict to true will ensure function calls reliably adhere to the function schema, instead of being best effort." It needs `additionalProperties` false on every object and every field in `required`; optional fields add `null` as a type. "Chat Completions requests remain non-strict by default." (Strict mode)
- Tools cost tokens. "Under the hood, functions are injected into the system message in a syntax the model has been trained on. This means callable function definitions count against the model's context limit and are billed as input tokens." (Token Usage)
- Strict mode is built on structured outputs: "Under the hood, strict mode works by leveraging our structured outputs feature and therefore introduces a couple requirements" (Strict mode)

## Visuals worth redrawing

- None.

## My notes

- Agrees with Anthropic on direction (fewer, clearer tools; search for the long tail). Differs in method: OpenAI gives a number, Anthropic says consolidate with an `action` parameter.
