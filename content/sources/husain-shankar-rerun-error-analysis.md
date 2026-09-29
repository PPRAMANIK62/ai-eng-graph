---
id: husain-shankar-rerun-error-analysis
title: "Q: How often should I re-run error analysis on my production system?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/how-often-should-i-re-run-error-analysis-on-my-production-system.html
published: 2025-07-27
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

A short FAQ page on cadence: a big error analysis pass after major changes, with 100+ fresh traces per cycle every 2 to 4 weeks, and 10 to 20 traces a week in between, focused on outliers.

## Key claims

- When: "Re-run error analysis when making significant changes: new features, prompt updates, model switches, or major bug fixes." (first paragraph)
- How much: "set a goal for reviewing at least 100+ fresh traces each review cycle. Typical review cycles we’ve seen range from 2-4 weeks." (first paragraph)
- In between: "review 10-20 traces weekly, focusing on outliers: unusually long conversations, sessions with multiple retries, or traces flagged by automated monitoring." (second paragraph)
- Adjust with maturity: "New systems need weekly analysis until failure patterns stabilize. Mature systems might need only monthly analysis unless usage patterns change." (same)
- "Always analyze after incidents, user complaint spikes, or metric drift. Scaling usage introduces new edge cases." (same)

## Visuals worth redrawing

- A timeline: weekly small reviews, a big pass every 2 to 4 weeks and after each major change.

## My notes

- Heuristics from their consulting, not measured.
