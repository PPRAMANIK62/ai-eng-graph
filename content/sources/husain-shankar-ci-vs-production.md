---
id: husain-shankar-ci-vs-production
title: "Q: How are evaluations used differently in CI/CD vs. monitoring production?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/how-are-evaluations-used-differently-in-cicd-vs-monitoring-production.html
published: 2025-06-29
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

One page of Husain and Shankar's AI Evals FAQ (modified 2026-09-01). CI evals run a small curated set before deploying to catch known regressions, favoring cheap deterministic checks. Production monitoring samples live traces and grades them asynchronously, usually with reference-free LLM judges, to find new failures and estimate how often they happen. New failures found in production go back into the CI set.

## Key claims

- The split: "CI evals protect against known regressions before deployment. Online monitoring find failures in production traffic and estimate how often they occur." (intro)
- CI sets are "small (in many cases 100+ examples) and purpose-built", covering core features, past bugs and known edge cases. "Favor assertions or other deterministic checks over LLM-as-judge evaluators." (Evals in CI)
- Production: "sample live traces and run evaluators against them asynchronously." (Online monitoring for production)
- No reference answers in production: "Since you usually lack reference outputs on production data, you might rely more on on more expensive reference-free evaluators like LLM-as-judge." (same)
- Alerting: "track confidence intervals for production metrics. If the lower bound crosses your threshold, investigate further." (same)
- Closing the loop: "when production monitoring reveals new failure patterns through error analysis and evals, add representative examples to your CI dataset. This mitigates regressions on new issues." (Connect the two systems)

## Visuals worth redrawing

- The two systems side by side with the arrow from production back into CI.

## My notes

- The page has typos ("Onnline", "on on"); quotes are copied as they appear.
- No numbers on sample rates or judge cost. None of the sources give those.
