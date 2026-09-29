---
id: brooker-timeouts-retries-backoff
title: Timeouts, retries, and backoff with jitter
author: Marc Brooker (Amazon Builders' Library)
url: https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf
published: 2019
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

How Amazon uses three tools to survive failures between services: timeouts on every remote call, retries for transient errors, and backoff with jitter so retries don't pile up. The main warning is that retries are selfish: under overload they add load, and retries at several layers multiply. Read in full as the PDF version; the HTML page (aws.amazon.com/builders-library/...) redirects to a JavaScript shell that didn't render.

## Key claims

- Timeouts free resources: without one, waiting requests hold memory, threads and connections until the server runs out. "Timeouts are the maximum amount of time that a client waits for a request to complete." (Failures Happen)
- Retries work because failures are often partial or transient. (Failures Happen)
- Side effects make retries unsafe: "A timeout or failure doesn't necessarily mean that side effects haven't happened." The fix is idempotent APIs, "meaning they can be safely retried." (Failures Happen)
- Choosing a timeout: pick an acceptable false-timeout rate (such as 0.1%) and use the matching latency percentile of the downstream service (p99.9). (Timeouts)
- "Retries are “selfish.”" Under overload, "retries that increase load can make matters significantly worse." (Retries and backoff)
- Backoff: exponential, capped, and limit the number of retries. (Retries and backoff)
- Layers multiply: a five-deep stack with three retries at each layer means "the load on the database will increase 243x". Best practice: "retry at a single point in the stack." (Retries and backoff)
- Local retry limit with a token bucket instead of circuit breakers: retry while tokens last, then at a fixed rate; added to the AWS SDK in 2016. (Retries and backoff)
- Client errors shouldn't be retried with the same request; server errors may succeed later. (Retries and backoff)
- Jitter spreads retries in time: "If all the failed calls back off to the same time, they cause contention or overload again when they are retried." (Jitter)
- "We avoid this amplification by retrying only when we observe that the dependency is healthy." (Conclusion)

## Visuals worth redrawing

- The 3 × 3 × 3 × 3 × 3 = 243 retry multiplication through a five-layer stack.

## My notes

- Written for service-to-service calls inside AWS, not LLM APIs. The ideas carry over; the timeout advice needs adapting because LLM calls take seconds to minutes.
- The companion 2015 post "Exponential Backoff and Jitter" has the simulation comparing jitter types; not opened for this note.
