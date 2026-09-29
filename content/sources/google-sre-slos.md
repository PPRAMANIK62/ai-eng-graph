---
id: google-sre-slos
title: "Service Level Objectives (Site Reliability Engineering, ch. 4)"
author: Chris Jones, John Wilkes, Niall Murphy, Cody Smith (Google)
url: https://sre.google/sre-book/service-level-objectives/
published: 2016
accessed: 2026-09-29
kind: book
primary: true
---

## Summary

The SRE book chapter on choosing and measuring service level indicators and objectives. The part used here is on aggregation: treat latency as a distribution, look at percentiles, because the average hides a slow tail.

## Key claims

- Distributions, not averages. "Most metrics are better thought of as _distributions_ rather than averages." (Aggregation)
- Example: most requests take about 50 ms, but "5% of requests are 20 times slower!" (Aggregation)
- Averages hide the tail. "A simple average can obscure these tail latencies, as well as changes in them." (Aggregation)
- Use percentiles. "Using percentiles for indicators allows you to consider the shape of the distribution and its differing attributes" (Aggregation)
- High percentiles (99th, 99.9th) show the plausible worst case; the 50th shows the typical case. (Aggregation)
- Users prefer steady. "User studies have shown that people typically prefer a slightly slower system to one with high variance in response time" (Aggregation)

## Visuals worth redrawing

- The chapter's figure of 50th, 85th, 95th and 99th percentile latency over time.

## My notes

- 2016, general web services. No LLM numbers.
