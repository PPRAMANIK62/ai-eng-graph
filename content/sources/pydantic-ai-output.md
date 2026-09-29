---
id: pydantic-ai-output
title: Output (Pydantic AI)
author: Pydantic
url: https://pydantic.dev/docs/ai/core-concepts/output/
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Pydantic AI's docs on getting typed output from an agent run. There are three ways to get structured output: Tool Output (the default: the schema becomes the parameters of an output tool), Native Output (the provider's strict JSON schema feature), and Prompted Output (schema in the instructions, parse the text). Output is validated with Pydantic, and you can add output validators or output functions that raise `ModelRetry` to send the model back for another try. The output retry budget defaults to 1.

## Key claims

- Three modes. "Tool Output, where tool calls are used to produce the output." "Native Output, where the model is required to produce text content compliant with a provided JSON schema." "Prompted Output, where a prompt is injected into the model instructions including the desired JSON schema" (Output modes)
- Tool Output is the default. "This is the default as it’s supported by virtually all models and has been shown to work very well." (Tool Output)
- Native Output isn't everywhere. "Note that this is not supported by all models, and sometimes comes with restrictions." (Native Output)
- Prompted Output is the weakest. "This is usable with all models, but is often the least reliable approach as the model is not forced to match the schema." (Prompted Output)
- Output function arguments are validated with Pydantic and can raise `ModelRetry` "to ask the model to try again with modified arguments (or with a different output type)." (Output functions)
- Output validators are for checks Pydantic validators can't do, like ones that need IO: "in particular when the validation requires IO and is asynchronous." (Output validators)
- The retry budget. "Each ModelRetry raised here consumes one unit of the run’s output retry budget. The budget defaults to 1" and is set with `Agent(retries={'output': N})`, per run, or per output tool with `ToolOutput(max_retries=N)`. (Output validators)
- Example output validator: run the generated SQL through `EXPLAIN` against the database and raise `ModelRetry(f'Invalid query: {e}')` if it fails. (Output validators example)
- When streaming, output validators run on every partial output as well as the final one; check the flag to validate only the complete result. "You should check the RunContext.partial_output flag when you want to validate only the complete result, not intermediate partial values." (Handling partial output in output validators)
- The SQL example's output type is `Success | InvalidRequest`, so the model can return an error message instead of a query. (Output validators example)

## Visuals worth redrawing

- None.

## My notes

- The SQL example is a good case of a check no schema can express: the value is well-typed but must also run.
