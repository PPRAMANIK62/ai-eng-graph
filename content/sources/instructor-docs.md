---
id: instructor-docs
title: "Instructor: Top Multi-Language Library for Structured LLM Outputs"
author: Jason Liu and contributors (567 Labs)
url: https://python.useinstructor.com/
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The home page of Instructor, the most used library for LLM extraction in Python. You describe what you want as a Pydantic model, pass it as `response_model`, and get a validated object back; if validation fails, it re-asks the model with the error, up to `max_retries`. It works across many providers, including local models.

## Key claims

- What it is. "Extract structured data from any LLM with type safety, validation, and automatic retries." (header)
- Positioning. "Instructor for extraction, PydanticAI for agents." (header)
- Core pattern: a Pydantic `Person(name, age, occupation)`, `instructor.from_provider(...)`, then `client.create(response_model=Person, messages=[... "Extract: John is a 30-year-old software engineer"])` returns `Person(name='John', age=30, ...)`. (Quick Start)
- Retries. "Built-in retry logic when validation fails - no more manual error handling" (Key Features for LLM Data Extraction); set with `max_retries=3` in the nested-model example. (Complex example)
- Providers. Works with "OpenAI, Anthropic, Google, Mistral, Cohere, Ollama, DeepSeek, and 15+ LLM providers" (Key Features)
- Popularity claim: "over 3 million monthly downloads, 11k stars, and 100+ contributors" (What is Instructor?)

## Visuals worth redrawing

- None.

## My notes

- The retry mechanics (what gets sent back to the model) are in `instructor-reask-validation`.
- Retries still matter with strict schemas: the schema can't express every rule (see `anthropic-structured-outputs` on unsupported constraints).
