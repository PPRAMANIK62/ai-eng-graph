---
id: otel-genai-spans
title: Semantic conventions for generative client AI spans
author: OpenTelemetry GenAI SIG
url: https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md
published: undated           # living spec in a GitHub repo; status Development
accessed: 2026-09-29
kind: spec
primary: true
---

## Summary

The OpenTelemetry standard for what a trace span of one model call should record: its name, the provider and model, token counts by type, finish reasons, errors, and optionally the messages themselves. It is still marked "Development", so names can change. The GenAI conventions moved out of the main OpenTelemetry spec into their own GitHub repo; the old opentelemetry.io pages are now stubs pointing there.

## Key claims

- Not stable. "**Status**: Development" (top of page)
- Span name format: "{gen_ai.operation.name} {gen_ai.request.model}" (Inference span, Span name)
- Span kind is CLIENT, but "MAY be set to `INTERNAL` on spans representing call to models running in the same process". (Span kind)
- Required: `gen_ai.operation.name` and `gen_ai.provider.name`. Conditionally required: `error.type` (on error), `gen_ai.request.model`, `gen_ai.prompt.version` (when a prompt name is set), and others. Recommended: `gen_ai.response.model`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, `gen_ai.response.finish_reasons`, `gen_ai.response.id`, request settings like `gen_ai.request.max_tokens`. (Attributes table)
- Token fields. `gen_ai.usage.input_tokens`: "The number of tokens used in the GenAI input (prompt)." `gen_ai.usage.output_tokens`: "The number of tokens used in the GenAI response (completion)." `gen_ai.usage.cache_read.input_tokens`: "The number of input tokens served from a provider-managed cache." Also `cache_write.input_tokens` and `gen_ai.usage.reasoning.output_tokens`: "The number of output tokens used for reasoning (e.g. chain-of-thought, extended thinking)." (Attributes)
- Input tokens include cached ones. "This value SHOULD include all types of input tokens, including cached tokens." (gen_ai.usage.input_tokens note)
- Prompt version on the span: `gen_ai.prompt.name` "The name of the prompt that uniquely identifies it." `gen_ai.prompt.version` "The version of the prompt template used." (Attributes)
- Message content is opt-in. `gen_ai.input.messages` and `gen_ai.output.messages` are "Opt-In": "This attribute is likely to contain sensitive information including user/PII data." (Attributes)
- Tool calls get their own span, with `gen_ai.operation.name` set to `execute_tool`. (Execute tool span)
- The repo covers more than model-call spans: "Semantic Conventions for Generative AI (GenAI), including spans, metrics, and events for GenAI clients, MCP (Model Context Protocol), and provider-specific conventions (OpenAI, etc.)." Its docs include spans, agent spans (`invoke_agent`), metrics, events and MCP. (repo README, github.com/open-telemetry/semantic-conventions-genai)
- The move. The old page at opentelemetry.io/docs/specs/semconv/gen-ai/ now says: "GenAI semantic conventions have moved to the OpenTelemetry GenAI semantic conventions repository." (opentelemetry.io stub)
- Metrics live on a sibling page in the same repo (docs/gen-ai/gen-ai-metrics.md, also "Development"): `gen_ai.client.operation.duration` (histogram, seconds, "GenAI operation duration") and, for streaming, `gen_ai.client.operation.time_to_first_chunk`: "time to receive the first chunk, measured from when the client issues the generation request to when the first chunk is received in the response stream". No cost metric. (gen-ai-metrics.md)
- No cost attribute. The spans page defines token counts but no price or cost field. (whole page)

## Visuals worth redrawing

- None on the page. A trace tree (agent span, model-call spans, tool spans) with the attributes on one span is our own drawing.

## My notes

- Input tokens include cached tokens here, while Langfuse wants non-overlapping buckets (`langfuse-cost-tracking`). Mapping one to the other naively double-counts cache reads.
