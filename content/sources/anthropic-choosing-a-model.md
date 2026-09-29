---
id: anthropic-choosing-a-model
title: Choosing the right model
author: Anthropic
url: https://platform.claude.com/docs/en/about-claude/models/choosing-a-model
published: 2026
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Anthropic's guide to picking a Claude model. It lists what to weigh (capabilities, speed, cost, effort), offers two ways to pick a starting model (start cheap and upgrade, or start strong and step down), and says the most important step is an eval set built from your own prompts and data. It also suggests tuning the effort setting before switching models, and pairing a cheap model with a frontier one. The page is undated; model names on it (Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 4.5 as of 2026-09) go stale fast, so cite the method.

## Key claims

- The balance. "Choosing a Claude model means balancing capabilities, speed, and cost." (intro)
- Effort is a lever inside one model. "Several Claude models support an effort parameter that trades intelligence for latency and cost within a single model. Tuning effort is often a better lever than switching models." (Establish key criteria)
- Option 1, efficiency-first: start with a fast, cheap model, test, and "Upgrade only if necessary for specific capability gaps." Best for prototyping, tight latency, cost-sensitive and high-volume simple tasks. (Option 1: Start efficiency-first)
- Option 2, capability-first: start with the strongest model, optimize prompts, then consider "lowering effort or downgrading models over time with greater workflow optimization." Best for complex reasoning, and where "accuracy outweighs cost considerations". (Option 2: Start capability-first)
- Your own eval set is the key step. "Create benchmark tests specific to your use case - having a good evaluation set is the most important step in the process." (Decide whether to upgrade or change models)
- Test on your real inputs. "Test with your actual prompts and data." Compare accuracy, response quality and "Handling of edge cases", then "Weigh performance and cost tradeoffs." (same)
- Combining models. "Multi-model strategies pair a lower-cost model with a frontier model so that most tokens are billed at the lower rate." Two patterns: an executor that escalates to an advisor, and an orchestrator that delegates to cheaper workers. (Combine models)
- A faster mode exists at a premium: fast mode "delivers up to 2.5x higher output speed at premium pricing" on some Opus models. (Establish key criteria)

## Visuals worth redrawing

- The two starting strategies as two paths.

## My notes

- Vendor guide: it only covers its own models, and never suggests another vendor.
