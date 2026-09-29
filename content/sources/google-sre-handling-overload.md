---
id: google-sre-handling-overload
title: Handling Overload (Site Reliability Engineering, chapter 21)
author: Alejandro Forero Cuervo, edited by Sarah Chavis (Google)
url: https://sre.google/sre-book/handling-overload/
published: 2016
accessed: 2026-09-29
kind: book
primary: true
---

## Summary

Google's chapter on keeping services up when they get more traffic than they can handle. The retry part sets two budgets: at most three attempts per request, and a client retries only while retries are under 10% of its requests. It also says to retry at one layer only and to send an "overloaded; don't retry" error upward.

## Key claims

- Per-request budget: "we implement a per-request retry budget of up to three attempts." After three failures the error goes to the caller, because "the whole datacenter is likely overloaded." (Deciding to Retry)
- Per-client budget: "A request will only be retried as long as this ratio is below 10%." (Deciding to Retry)
- The numbers: with only the three-attempt cap, a mostly-rejecting datacenter sees requests grow "to somewhere just below 3X"; with the 10% budget, "reduces the growth to just 1.1x in the general case". (Deciding to Retry)
- Retry counters in request metadata let backends answer "overloaded; don't retry" when many retries show the whole cluster is struggling. (Deciding to Retry)
- One layer only: "requests should only be retried at the layer immediately above the layer that is rejecting them." "If multiple layers retried, we'd have a combinatorial explosion." (Deciding to Retry)
- If a large share of backends are overloaded, "requests should not be retried and errors should bubble up all the way to the caller". (Handling Overload Errors)
- Batch traffic is sheddable: it "can retry requests minutes or even hours later." (Criticality)

## Visuals worth redrawing

- Figure 21-2: a stack of backends where only the layer above the failing one retries.

## My notes

- Google-internal RPC, not LLM APIs; the budgets are a starting point, not a law.
