---
id: husain-shankar-guardrails-vs-evaluators
title: "Q: What’s the difference between guardrails & evaluators?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/whats-the-difference-between-guardrails-evaluators.html
published: 2025-06-29
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

One page of Husain and Shankar's AI Evals FAQ. Guardrails sit inline and block clear, high-impact failures before the user sees them, so they must be fast and simple. Evaluators run after the response, usually asynchronously or in batch, measure fuzzier qualities, and feed dashboards and improvement work without blocking anything.

## Key claims

- Guardrails "are inline safety checks that sit directly in the request/response path." (first paragraph)
- They are "Fast and deterministic – typically a few milliseconds of latency budget", built from "regexes, keyword block-lists, schema or type validators, lightweight classifiers", aimed at "PII leaks, profanity, disallowed instructions, SQL injection, malformed JSON". (list)
- When one fires, "the system can redact, refuse, or regenerate the response." False positives "are treated as production bugs". (after list)
- Evaluators "typically run after a response is produced." They "measure qualities that simple rules cannot, such as factual correctness, completeness". (evaluators paragraph)
- "Their verdicts feed dashboards, regression tests, and model-improvement loops, but they do not block the original answer." (same)
- "Evaluators are usually run asynchronously or in batch to afford heavier computation such as a LLM-as-a-Judge." Inline judges only "when the latency budget and reliability targets allow it", e.g. "in a cascade that runs on the minority of borderline cases." (same)
- Use both: "Together, they create layered protection." (closing)
- Running guardrails: "teams version guardrail rules, log every trigger, and monitor rates to keep them conservative." (after list)

## Visuals worth redrawing

- One request path with the guardrail inline and the evaluator branching off after the response to a log.

## My notes

- Useful for both online-evals and guardrails (phase 6).
