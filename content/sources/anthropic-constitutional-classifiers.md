---
id: anthropic-constitutional-classifiers
title: "Constitutional Classifiers: Defending against universal jailbreaks"
author: Anthropic Safeguards Research Team
url: https://www.anthropic.com/research/constitutional-classifiers
published: 2025-02-03
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Anthropic's first-generation Constitutional Classifiers: an input classifier and an output classifier around Claude, trained on synthetic data generated from a written list of what is and isn't allowed (a "constitution"), aimed at universal jailbreaks for dangerous chemical and biological information. On 10,000 synthetic jailbreak prompts, success fell from 86% to 4.4%, at the cost of 0.38% more refusals and 23.7% more compute. A public demo still ended with one universal jailbreak.

## Key claims

- Baseline. "Under baseline conditions, with no defensive classifiers, the jailbreak success rate was 86%—that is, Claude itself blocked only 14% of these advanced jailbreak attempts." (Results from automated evaluations)
- With classifiers. "the jailbreak success rate was reduced to 4.4%, meaning that over 95% of jailbreak attempts were refused." (same)
- Test set: "we synthetically generated 10,000 jailbreaking prompts including many of the most-effective attacks on current LLMs, as well as attacks designed to circumvent classifier safeguards." (same)
- Costs. Refusals rose "by 0.38%", not statistically significant in 5,000 conversations; "the compute cost was moderately higher (by 23.7%) than that of the unguarded model." (same)
- How they're built: "input and output classifiers trained on synthetically generated data", using "a constitution: a list of principles to which the model should adhere". (The Constitutional Classifiers approach)
- Bug bounty on a prototype: "183 active participants spent an estimated >3,000 hours over a two-month experimental period", and "no universal jailbreak was discovered." (Human red teaming)
- Public demo, 2025-02-03 to 2025-02-10: "By the end of the demo, one jailbreaker was able to get detailed answers from the system for all eight questions using a universal jailbreak." (Demo results)
- Limits: new jailbreak techniques "might be developed in the future that are effective against the system; we therefore recommend using complementary defenses". (Limitations)

## Visuals worth redrawing

- Before/after bar: 86% vs 4.4% jailbreak success.

## My notes

- These are jailbreak classifiers for harmful content, not prompt injection detectors. The paper is Sharma et al. (2025).
