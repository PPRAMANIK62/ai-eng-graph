---
id: anthropic-structured-outputs
title: Structured outputs
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/build-with-claude/structured-outputs
published: undated (docs page, generally available as of 2026-09)
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

Anthropic's guide to getting JSON that matches a schema from Claude. There are two features: JSON outputs (`output_config.format`) for the reply itself, and strict tool use (`strict: true`) for tool inputs. Both work by compiling your JSON Schema into a grammar and constraining sampling to it. The page is frank about the costs and the gaps: first-request compile latency, schema features that aren't supported, complexity limits, and three cases where the output can still fail to match.

## Key claims

- What it is. "Structured outputs constrain Claude's responses to follow a specific schema, ensuring valid, parseable output for downstream processing." (intro)
- Two features, usable together: JSON outputs for the response, strict tool use for tool names and inputs. "You can use these features independently or together in the same request." (intro)
- What goes wrong without it: invalid JSON syntax, missing required fields, inconsistent data types, schema violations. "Even with careful prompting, you may encounter:" (Why use structured outputs)
- What it promises. "Structured outputs guarantee schema-compliant responses through constrained decoding" (Why use structured outputs)
- How you turn it on: `output_config.format` with `type: "json_schema"` and the schema; the reply comes back as JSON in the text block. "Claude's response is valid JSON matching your schema, returned in the response's text content block." (JSON outputs, How it works)
- Beta history: the parameter used to be `output_format` behind the beta header `structured-outputs-2025-11-13`; it moved to `output_config.format` and no longer needs a header. "beta headers are no longer required" (tip under intro)
- Mechanism: the schema is compiled into a grammar that constrains sampling. "Structured outputs use constrained sampling with compiled grammar artifacts." (Important considerations, Grammar compilation and caching)
- First use of a schema is slower; the compiled grammar is cached. "Compiled grammars are cached for 24 hours from last use, making subsequent requests much faster" (Grammar compilation and caching)
- It adds a hidden system prompt, so input tokens go up slightly. "Claude automatically receives an additional system prompt explaining the expected output format." (Prompt modification and token costs)
- Unsupported schema features: recursive schemas, complex types in enums, external `$ref`, numeric constraints (`minimum`, `maximum`, `multipleOf`), string length constraints, array constraints beyond `minItems` (only 0 or 1). (JSON Schema limitations)
- Property order: kept from the schema, except required properties come first. "required properties appear first, followed by optional properties" (Property ordering)
- It can still fail to match. "While structured outputs guarantee schema compliance in most cases, there are scenarios where the output may not match your schema:" (Invalid outputs)
- Refusals: `stop_reason: "refusal"`, a 200 status, and you're billed. "The output may not match your schema because the refusal message takes precedence over schema constraints" (Invalid outputs)
- Token limit: `stop_reason: "max_tokens"`. "The output may be incomplete and not match your schema" (Invalid outputs)
- Enum casing isn't guaranteed: Claude may return an enum value that differs only in capitalization, with no error. "Structured outputs don't guarantee the capitalization of string `enum` and `const` values" (Invalid outputs, Enum value casing)
- Complexity limits: at most 20 strict tools per request and 24 optional parameters across all strict schemas; each optional parameter "roughly doubles a portion of the grammar's state space". (Schema complexity limits)
- Incompatible with citations (400 error) and with message prefilling. "Incompatible with JSON outputs" (Feature compatibility)
- Worked example: extracting name, email, plan interest and whether a demo was requested from a sales email. (Example in JSON outputs quick start)

## Visuals worth redrawing

- None on the page worth redrawing. The email-to-JSON example makes a good before/after box: messy sentence on the left, four typed fields on the right.

## My notes

- The docs promise the *shape*, not the *content*. Nothing on the page claims values are correct.
- The enum-casing caveat is a nice example that "guaranteed" has fine print even with constrained decoding.
- Supported models listed on 2026-09-23 run from Claude Haiku 4.5 / Sonnet 4.5 up through Opus 5.5; don't list them in an article, they change.
- Compare with OpenAI (`openai-structured-outputs`): OpenAI keeps schema key order; Anthropic moves required keys first.
