---
id: openai-structured-outputs
title: Structured model outputs
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/structured-outputs
published: undated (docs page, checked 2026-09-23)
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

OpenAI's guide to Structured Outputs: supply a JSON Schema and the model's reply is guaranteed to follow it. The page contrasts it with the older JSON mode, which only promises valid JSON, not your schema. It lists the schema rules (all fields required, `additionalProperties: false`), size limits, and the edge cases you still have to handle: refusals, cut-off responses, and inputs that don't fit the schema.

## Key claims

- What it is. "Structured Outputs is a feature that ensures the model will always generate responses that adhere to your supplied JSON Schema, so you don't need to worry about the model omitting a required key, or hallucinating an invalid enum value." (intro)
- Benefits: no validate-and-retry loop, refusals you can detect in code, simpler prompts. "No need for strongly worded prompts to achieve consistent formatting" (intro list)
- SDKs let you define the schema as a Pydantic model (Python) or Zod object (JavaScript). (intro)
- JSON mode vs Structured Outputs. "While both ensure valid JSON is produced, only Structured Outputs ensure schema adherence." (Structured Outputs vs JSON mode)
- Recommendation. "We recommend always using Structured Outputs instead of JSON mode when possible." (Structured Outputs vs JSON mode)
- Enabling: `text: { format: { type: "json_schema", "strict": true, "schema": ... } }` vs `text: { format: { type: "json_object" } }` for JSON mode. (comparison table)
- Model support: from GPT-4o on (`gpt-4o-mini`, `gpt-4o-2024-08-06` and later); older models like `gpt-4-turbo` may use JSON mode instead. (Supported models)
- First request with a new schema is slower. "the first request you make with any schema will have additional latency as our API processes the schema" (Step 2, note)
- It can still fail. "In some cases, the model might not generate a valid response that matches the provided JSON schema." (Step 3: Handle edge cases)
- Refusals come back in a separate `refusal` field. "Since a refusal does not necessarily follow the schema you have supplied in `response_format`, the API response will include a new field called `refusal`" (Refusals with Structured Outputs)
- Unrelated input leads to made-up values. "The model will always try to adhere to the provided schema, which can result in hallucinations if the input is completely unrelated to the schema." (Handling user-generated input)
- Values can still be wrong. "Structured Outputs can still contain mistakes." (Handling mistakes)
- Keep schema and code types in sync: use SDK schema helpers, or generate one from the other in CI. (Avoid JSON schema divergence)
- Schema rules: all fields must be `required`; `additionalProperties: false` must always be set. "To use Structured Outputs, all fields or function parameters must be specified as `required`." (Supported schemas)
- Optional fields: every field must be required, but you can emulate an optional one with a union type that includes `null`. "it is possible to emulate an optional parameter by using a union type with `null`." (All fields must be required)
- Size limits: up to 5000 object properties, 10 levels of nesting, 1000 enum values, 120,000 characters of total names/enum strings. "A schema may have up to 5000 object properties total, with up to 10 levels of nesting." (Supported schemas)
- Key order follows the schema. "outputs will be produced in the same order as the ordering of keys in the schema." (Key ordering)
- JSON mode's trap: if you don't tell the model to write JSON, it can loop on whitespace. "the model may generate an unending stream of whitespace and the request may run continually until it reaches the token limit." (JSON mode)
- JSON mode guard: the API rejects the request unless "JSON" appears somewhere in the messages. "the API will throw an error if the string "JSON" does not appear somewhere in the context." (JSON mode)
- Hitting the output limit: the response comes back with `status: "incomplete"` and `incomplete_details.reason: "max_output_tokens"` (code examples). "if for example you reach a max tokens limit and the response is incomplete." (Step 3: Handle edge cases)
- JSON mode doesn't check your schema. "JSON mode will not guarantee the output matches any specific schema, only that it is valid and parses without errors." (JSON mode)

## Visuals worth redrawing

- The comparison table (valid JSON / follows schema / how to enable) for JSON mode vs Structured Outputs. Rebuild as a three-row table with "plain prompting" added as a third column.

## My notes

- The "Chain of thought" example on the page puts a `steps` array before `final_answer` in the schema. Since keys come out in schema order, that ordering lets the model reason before answering. Relevant to the "Let Me Speak Freely" dispute.
- The launch blog post with before/after adherence numbers (openai.com) returned 403 per `_candidates.md`, so no numbers here.
- The page recommends `gpt-6-astra` for new projects as of 2026-09-23. Don't quote model names in the article without a date.
