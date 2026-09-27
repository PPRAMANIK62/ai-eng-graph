---
id: husain-shankar-what-are-evals
title: "Q: What are AI Evals?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/what-are-llm-evals.html
published: 2025-07-03        # modified 2026-09-01
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

The opening page of Husain and Shankar's AI Evals FAQ. It defines evals, and separates model benchmarks (shared tasks for comparing general models) from product evals (tests of your own product on your own tasks). An order-cancellation agent shows why a benchmark score says little about your product.

## Key claims

- Definition: "AI evals are tests that tell you whether an AI system is doing what you want." (first paragraph)
- Failures become data: "The failures they catch also become data you can use to improve the system." (first paragraph)
- "Each eval checks one behavior on relevant examples and returns a score or structured review. Most AI products need several evals because they can fail in different ways." (second paragraph)
- Two meanings: "model benchmarks or product evals." (third paragraph)
- Benchmarks: "Model benchmarks compare general-purpose models on shared tasks." Examples given: GPQA Diamond, Terminal-Bench, MMLU. "These scores can help you choose a promising model as a starting point." (Model benchmarks)
- Product evals: "Product evals measure whether your specific AI product does what you want it to do." They cover "the model, prompts, retrieval, tools, and application code." (Product evals)
- Example: an order-cancellation agent's evals "might check whether it selected the correct order and waited for the cancellation tool to succeed before telling the user the order was canceled." A benchmark score "gives you little information on this, because those benchmarks don’t have access to your systems." (Product evals)
- Ways to implement: "code assertions, human review, LLM judges, and online experiments. The right method depends on the failure being measured". (Product evals)
- The loop: start by "analyzing traces to discover real failure modes", turn failures into targeted evals, then "rerunning the evals tells us whether the system improved." (Product evals)

## Visuals worth redrawing

- None on the page beyond cover images.

## My notes

- Short and current (modified 2026-09-01). Good for the benchmark vs product eval split.
