---
id: github-evaluate-llms-before-production
title: How to evaluate LLMs before production
author: Mariko Wakabayashi and Zixiao Chen (GitHub)
url: https://github.blog/ai-and-ml/llms/how-to-evaluate-llms-before-production/
published: 2026-08-25
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

GitHub's secret-scanning team on how they evaluated an LLM feature before shipping it. They treat the offline eval like an integration test, rerun on every meaningful change to prompt, model, input or system logic, record every version in each run, and change one thing at a time. Testing new models should be cheap enough to be routine.

## Key claims

- Rerun on every change: "We reran it whenever we made a meaningful change to the prompt, model, input construction, or broader system logic." (2. Treat offline evaluation like integration testing)
- Record versions: "For every run, we recorded the prompt, model, dataset version, and system configuration." (same)
- One change at a time: "We changed one major variable at a time and compared each run against a known baseline." (same)
- Heading "Test model upgrades regularly": "A stronger model may perform better with a simpler prompt than an older model does with extensive tuning." (same)
- "The evaluation process should be inexpensive and repeatable enough that testing a new model becomes routine." (same)
- Metrics: false-positive reduction as the main outcome, recall as a safety limit, and latency, cost, reliability as guardrails. (Metrics)
- Result: "we reached a 95% reduction in false positives on the evaluated offline dataset while keeping recall within our defined guardrail." (8. What secret scanning taught us)
- Offline isn't the end: "It provided enough structured evidence to justify moving to online experimentation with clearly understood risks and guardrails." (same)

## Visuals worth redrawing

- None needed.

## My notes

- Primary: the team that built the feature. Good for the upgrade workflow, not for drift evidence.
