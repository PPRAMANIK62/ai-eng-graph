---
id: husain-shankar-how-many-examples
title: "Q: How many examples do I need for an eval?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/how-many-examples-do-i-need-for-an-eval.html
published: 2026-09-01
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

One page of Husain and Shankar's AI Evals FAQ. It breaks building evals into three stages that each need a different amount of data: read about 100 traces to find how the app fails (error discovery), build and check an evaluator for each important failure, then keep a repeatable eval set you run on every change. It gives concrete numbers for each stage.

## Key claims

- "Building evals is a pipeline, and each stage needs a different amount of data." (intro)
- Stage 1: "Read traces and write down the ways your application fails. This process is called error discovery. Start with 100 diverse traces and annotate at least the first 30 yourself." (stage table)
- Stage 2: "Use a code-based eval when an objective rule can identify the failure." "Use an LLM judge when the failure requires human judgment. Label 100 to 200 examples for each failure mode." (stage table)
- Stage 3: "Collect examples that represent important workflows and confirmed failures. Run this set when you change your application. These sets often grow to 100 or more examples." (stage table)
- A trace: "A trace is a complete record of one user session with your application." (Stage 1)
- Stop rule: "Continue until new traces stop revealing failure modes or changing existing ones. Qualitative researchers call this theoretical saturation." (When to stop)
- The output of reading traces: "a failure taxonomy, which is a list of the specific ways your application fails. Use that taxonomy to decide which evaluators to build." (When to stop)
- Keep the first pass manual, because an agent suggesting problems too early "can bias your judgment." (Review at least 30 traces yourself)
- Code-based examples: "checking whether JSON parses or whether a tool call uses the correct arguments." "At minimum, include examples that should Pass and Fail for every condition." (Code-based evals need coverage)
- LLM judge labels "should come from a trusted domain expert and contain enough Pass and Fail examples to evaluate both classes." (LLM judges need labeled examples)
- Size of the repeatable set: "Coverage determines the final size. Each important workflow and known failure should be represented, and the set should remain cheap enough to run often." (Stage 3)

## Visuals worth redrawing

- The three-stage table (review, create evaluators, repeatable set) as a pipeline with the numbers on each stage.

## My notes

- Part of a FAQ that is edited over time; this page is dated 2026-09-01. The main FAQ index shows newer dates.
- 100 traces to read here vs "20-50 simple tasks" to start (anthropic-demystifying-evals). They count different things: traces you read to find failures, versus tasks in the first eval set.
- The judge train/dev/test split details belong to a future llm-as-judge node.
