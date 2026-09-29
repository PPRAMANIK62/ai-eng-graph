---
id: li-same-model-not-same-service
title: "When Is the Same Model Not the Same Service? A Measurement Study of Hosted Open-Weight LLM APIs"
author: Haorui Li et al.
url: https://arxiv.org/abs/2605.02821
published: 2026-05-04
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

A measurement study of open-weight models sold as hosted APIs by many providers, using request logs, probes, prices and continuous latency measurements from the AI Ping platform in Q4 2025. The same model name hides different services: latency, throughput, context length, protocol support and error behavior differ by provider and change over time. Routing across providers cut cost and raised throughput in two examples. A new preprint (revised 2026-05-07), not peer reviewed. Only the abstract page was read.

## Key claims

- The unit you actually buy. "the operational unit is a service object: a provider-specific, time-varying endpoint defined by model variant, protocol behavior, context capacity, listed price, latency and throughput distribution, reliability, and task feasibility." (abstract)
- Price is stable, the rest moves. "listed prices are more anchored than latency, throughput, context length, protocol support, and error semantics." (abstract)
- Choice depends on the task. "provider choice is a constrained decision over provider-model-task-time tuples rather than a lookup by model name." (abstract)
- Routing results. "routing lowers Qwen3-32B cost by 37.8% and raises DeepSeek-V3.2 average throughput by about 90% relative to direct official access." (abstract)

## Visuals worth redrawing

- None used.

## My notes

- All data come from one platform (AI Ping), whose results show routing paying off. Read the routing gains with that in mind.
