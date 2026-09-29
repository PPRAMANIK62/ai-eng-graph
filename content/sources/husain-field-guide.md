---
id: husain-field-guide
title: A Field Guide to Rapidly Improving AI Products
author: Hamel Husain
url: https://hamel.dev/blog/posts/field-guide/
published: 2025-03-24
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

A consultant's list of what separates AI teams that improve quickly from those that stall, drawn from his client work. The parts used here: error analysis with a worked case (Nurture Boss, an apartment-leasing assistant), why generic metric dashboards mislead, and how to generate synthetic test inputs from dimensions (features, scenarios, personas) when you have no users yet.

## Key claims

- Generic metrics mislead. "Generic metrics are worse than useless – they actively impede progress". Teams celebrated a 10% better "helpfulness score" while users still struggled. (1. The Most Common Mistake)
- Error analysis is "the single most valuable activity in AI development and consistently the highest-ROI activity." (1.)
- Nurture Boss case: a viewer with "a space for open-ended notes about failure modes" next to each conversation. After "annotating dozens of conversations", date handling was failing "66% of the time when users said things like “let’s schedule a tour two weeks from now.”" (The Error Analysis Process)
- Their steps: looked at logs, categorized date-handling failures, "Built specific tests to catch these issues", measured. "Their date handling success rate improved from 33% to 95%." (The Error Analysis Process)
- Top-down vs bottom-up: top-down starts from metrics like "hallucination" or "toxicity" and "often misses domain-specific issues"; bottom-up lets "metrics naturally emerge" from the data. (Bottom-Up vs. Top-Down Analysis)
- The bottom-up method: "a spreadsheet where each row represented a conversation. We wrote open-ended notes on any undesired behavior. Then we used an LLM to build a taxonomy of common failure modes. Finally, we mapped each row to specific failure mode labels and counted the frequency of each issue." (same)
- Result: "just three issues accounted for over 60% of all problems": conversation flow issues, handoff failures, rescheduling problems. Counted with an Excel pivot table. (same)
- The findings kept the team busy: "they needed several weeks just to implement fixes for the problems we’d already found." (same)
- Synthetic data solves the no-users problem: "you need data to improve your AI, but you need a decent AI to get users who generate that data." (4. Bootstrapping Your AI With Synthetic Data)
- Quotes Bryan Bischof (former Head of AI at Hex): "LLMs are surprisingly good at generating excellent - and diverse - examples of user prompts." (4.)
- Three broad dimension categories: "Features", "Scenarios", "User Personas". Rechat example: features like "property search" and "scheduling", scenarios "exact match", "multiple matches", "no matches", "invalid criteria", personas like "first_time_buyer" and "investor". (A Framework for Generating Realistic Test Data)
- Generated queries must really trigger the scenario: needs "A test database with enough variety" and "A way to verify that generated queries actually trigger intended scenarios". (same)
- "Generate user inputs, not outputs". Reason: "This prevents your synthetic data from inheriting the biases or limitations of the generating model." (Guidelines for Using Synthetic Data)
- "Verify scenario coverage": "A query intended to test “no matches found” should actually return zero results when run against your system." (Guidelines)
- Ground it in real constraints: "use real availability windows and booking rules." (Guidelines)
- It sticks around: "What often starts as a stopgap measure becomes a permanent part of the evaluation infrastructure, even after real user data becomes available." (Guidelines)
- Judge critiques as few-shot examples: "often yields 15-20% higher agreement rates between human and LLM evaluations"; they also feed synthetic data, "creating a flywheel for improvement." (5. Maintaining Trust In Evals Is Critical, "Enhance Binary Judgments With Detailed Critiques")

## Visuals worth redrawing

- The Nurture Boss pivot table of failure counts (only the top three categories and the 60% share are given in text).

## My notes

- The Nurture Boss numbers are one client's result as reported by the consultant who worked with them. No sample size is given for the 33% → 95%.
- The author sells an evals course.
