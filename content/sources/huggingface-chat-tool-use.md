---
id: huggingface-chat-tool-use
title: Tool use (chat templates)
author: Hugging Face (Transformers docs)
url: https://huggingface.co/docs/transformers/main/en/chat_extras
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The Transformers guide to tool use with open models. It shows what hosted APIs hide: tool definitions (JSON Schema, or Python functions turned into schema) are rendered into the prompt by the chat template, the model writes its tool call as ordinary text in a trained format, and your code parses it, runs the function, and appends the result as a `tool` message.

## Key claims

- Tools are functions the model can choose to call. "Tools are functions supplied by the user, which the model can choose to call as part of its response." (intro)
- Pass tools to `apply_chat_template()` as JSON Schema or Python functions; for functions, "the arguments, argument types, and function docstring are parsed in order to generate the JSON schema automatically." (Passing tools)
- What the model sees is a signature. "These create the \"signature\" the model will use to decide whether to call the tool." (Passing tools)
- Example output from Hermes-2-Pro-Llama-3-8B asked about Paris: `<tool_call> {"arguments": {"location": "Paris, France", "unit": "celsius"}, "name": "get_current_temperature"} </tool_call>` (Tool-calling Example)
- The model doesn't run anything. "A model **cannot actually call the tool itself**. It requests a tool call, and it's your job to handle the call and append it and the result to the chat history." (Tool-calling Example)
- For models without response parsing support, "you'll need to manually translate the output string into a tool call dict." (Tool-calling Example)
- The result goes back with the `tool` role, always as a string; the model then answers "The temperature in Paris, France right now is 22°C." (Tool-calling Example)
- "in most cases, models only emit a single tool call at a time"; parallel calls need tool call IDs to match results. (Warning, Tool-calling Example)
- `get_json_schema` shows the schema generated from a function with a Google-style docstring. (JSON schemas)

## Visuals worth redrawing

- The raw text of a tool call inside the model's output, next to the parsed dict.

## My notes

- Ties tool calling back to next-token prediction: a tool call is text in a format the model was trained to write.
