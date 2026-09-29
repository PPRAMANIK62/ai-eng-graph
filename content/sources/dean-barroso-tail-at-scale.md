---
id: dean-barroso-tail-at-scale
title: The Tail at Scale
author: Jeffrey Dean, Luiz André Barroso (Google)
url: https://www.barroso.org/publications/TheTailAtScale.pdf
published: 2013-02
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Google's paper on why rare slow responses matter a lot in big systems. When one user request waits on many servers, a slowdown that hits 1 in 100 calls on a single server hits most user requests. It lists why latency varies and ways to live with it, such as hedged requests: send a backup copy of a slow request and take whichever answer comes first. Communications of the ACM, vol. 56, no. 2, February 2013. The author's PDF was used; the CACM page returns 403.

## Key claims

- Fast feels better. "Systems that respond to user actions quickly (within 100ms) feel more fluid and natural to users than those that take longer." (intro)
- Aim is a predictable whole from unpredictable parts. "large online services need to create a predictably responsive whole out of less-predictable parts" (intro)
- Why latency varies: shared resources, background daemons, maintenance and garbage collection, and queueing. "Multiple layers of queueing in intermediate servers and network switches amplify this variability." (Why Variability Exists?)
- Fan-out example. A server "typically responds in 10ms but with a 99th-percentile latency of one second." With one server, "one user request in 100 will be slow". With 100 in parallel, "63% of user requests will take more than one second". (Component-Level Variability Amplified By Scale)
- Even 1 in 10,000 hurts at scale: with 2,000 servers, "almost one in five user requests taking more than one second". (same)
- Real Google service: p99 for one leaf request 10 ms, for all requests 140 ms; "waiting for the slowest 5% of the requests to complete is responsible for half of the total 99%-percentile latency." (same, Table 1)
- Hedged requests. "issue the same request to multiple replicas and use the results from whichever replica responds first." (Hedged requests)
- Wait until the p95 before hedging to cap extra load. "This approach limits the additional load to approximately 5% while substantially shortening the latency tail." (Hedged requests)
- Why hedging works. "the source of latency is often not inherent in the particular request but rather due to other forms of interference." (Hedged requests)
- Result. Hedging after 10 ms "reduces the 99.9th-percentile latency for retrieving all 1,000 values from 1,800ms to 74ms while sending just 2% more requests." (Hedged requests)
- Queueing is a common source; once a request starts running, variability "goes down substantially". (Hedged requests / tied requests)

## Visuals worth redrawing

- The fan-out figure: share of user requests over 1 s vs number of servers, for different per-server slow rates.

## My notes

- About Google search-style fan-out, not LLMs. The math (1 − 0.99^n) carries over to any request that waits on several calls, such as parallel LLM calls or an agent step that waits on several tools.
- Hedging an LLM call means paying for the duplicate tokens; the paper's "2% more requests" is cheap RPCs, not model calls.
