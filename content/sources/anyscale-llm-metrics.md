---
id: anyscale-llm-metrics
title: Understand LLM latency and throughput metrics
author: Anyscale
url: https://docs.anyscale.com/llm/serving/benchmarking/metrics
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Anyscale's docs page on the numbers to watch when serving an LLM: TTFT, TPOT and ITL, end-to-end latency, tokens and requests per second. It explains what raises TTFT (prompt length, queueing, prefill), why to track p50, p95 and p99 instead of the average, and how more concurrency trades each user's speed for total throughput.

## Key claims

- TTFT defined. "The time elapsed between submitting a prompt and receiving the first token of the model's response." (TTFT)
- End-to-end latency. "The total time from when the server receives a prompt to when it finishes sending the full response" (End-to-end latency)
- Averages mislead. "Just looking at the average latency can be misleading and hide a wide range of experiences where a few very slow responses mask many fast ones." (Understand percentiles (p50, p95, p99))
- p50 is the typical case. "p50 (the median): This is the typical experience. 50% of users have a latency this fast or faster." (Understand percentiles)
- Track the high percentiles. "By tracking p95 or p99 latency, you ensure that almost everyone using your service has a reliable and acceptably fast experience, not just the 'average' user." (Understand percentiles)
- Longer prompts, longer TTFT. "Longer prompts typically result in longer TTFT because the model must first process the entire input before generating any output." (What influences TTFT)
- Queueing adds to TTFT. "When the server is under heavy usage, it may queue incoming requests. This queuing delay adds to the TTFT." (What influences TTFT)
- Prefill sets TTFT. The prefill step is "compute-intensive and directly determines how quickly the model can begin generating the first token." (What influences TTFT)
- Load trades throughput for latency. "Higher concurrency can raise RPS by keeping the GPU busy, but excessive load may increase TTFT, ITL, and E2E latency" (Concurrency and RPS)

## Visuals worth redrawing

- None.

## My notes

- Written for people running Ray Serve. The load-vs-latency point explains why a hosted API is slower at busy times, but the page doesn't measure any hosted API.
