---
id: artificial-analysis-methodology
title: Language Model API Performance Benchmarking Methodology
author: Artificial Analysis
url: https://artificialanalysis.ai/methodology/performance-benchmarking
published: 2026-03-02
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

How Artificial Analysis measures the speed of hosted LLM APIs for its public charts: what output speed, TTFT and end-to-end time mean, how often they test, from where, with what prompt sizes, and how they aggregate. They report medians (P50) over a rolling window, and split TTFT for reasoning models into first token and first answer token.

## Key claims

- Output speed counts from after the first token. "The average number of tokens received per second, after the first token is received." (Output Speed)
- TTFT. "The time in seconds between sending a request to the service or system and receiving the first token of the response." (Time to First Token)
- For reasoning models, a separate "first answer token" time, measured after thinking. "the time in seconds between sending a request to the service or system and receiving the first answer token of the response." (Time to First Answer Token)
- End-to-end time includes reasoning. "The total time to receive a complete response, including input processing time, model reasoning time, and answer generation time." (End-to-End Response Time)
- Medians over 72 hours. Figures are median (P50) "over the past 72 hours to reflect sustained changes in performance that users can expect." The 100k-token workload is "the median (P50) over the past 14 days." (Aggregation)
- Test frequency: 1k and 10k token workloads "8 times per day, approximately every 3 hours"; 100k weekly. (Testing Frequency)
- Workloads range from about 1,000 to 100,000 input tokens. (Prompt Specifications)
- One test location. "Our primary testing server is a virtual machine hosted in Google Cloud's `us-central1-a` zone." (Testing Location)

## Visuals worth redrawing

- None.

## My notes

- I found no p95 or p99 figures on the methodology page, only P50. A median over 72 hours says nothing about the slow calls.
- One location in a US Google Cloud zone: your network distance will differ.
