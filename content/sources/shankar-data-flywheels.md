---
id: shankar-data-flywheels
title: Data Flywheels for LLM Applications
author: Shreya Shankar
url: https://www.sh-reya.com/blog/ai-engineering-flywheel/
published: 2024-07-01
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

A researcher's framework for LLM apps that improve from their own production data, in three parts: evaluation (pick metrics from real outputs and implement them in code or as LLM judges), monitoring (keep the metrics and the judges aligned as production data drifts, with regular human labels), and continual improvement (fix low-scoring outputs and feed them back, by hand or as retrieved few-shot examples). It ends with open research questions, and says plainly where ideas are untested.

## Key claims

- Human labels keep being needed: "Humans need to be in the loop for evaluation regularly, as human preferences on LLM outputs change over time." (intro)
- The three parts: "Evaluation, Monitoring, and Continual Improvement." (intro)
- Metrics come from data: "you can’t determine effective criteria purely through theorizing about possible failure modes for your task. You need to examine actual data—many LLM outputs". (1a)
- Example of a quirk you only see in outputs: words like "delve" and "crucial" give off a "GPT smell", which suggests a check for their absence. (1a)
- Binary metrics: "binary metrics (True/False) are much easier to align and reason about". (1b)
- Metrics change after launch: "When you deploy your application, you will learn of new failure modes, and you may want to update your metric set. Moreover, LLM APIs are constantly changing under the hood, and your ideal system behavior will evolve over time." (2a)
- Judges drift: "Alignment has to be continually reassessed as production data drifts over time. This is particularly important for LLM-based metric evaluators." (2b)
- Workflow: "For each metric, regularly sample and label a set of responses from production data." Store them "with timestamps for recency tracking". (2b)
- Labeling is the bottleneck: "ensuring regular human labeling of data for each metric. It’s important but can be burdensome." LLM-drafted labels that humans edit help, but "it’s unclear how well the LLM labeler will align with human judgment over time". (2b)
- Prerequisite for improvement: "maintain a comprehensive log of outputs and their associated metric scores". (3)
- Manual improvement: "Regularly review the distribution of metric scores across your production data. Look for patterns or clusters of low-performing instances." (3a)
- Fix bad outputs on a cadence: "Regularly review and “fix” low-scoring outputs. This can be done on a daily or weekly cadence". Steps: what went wrong, rewrite it correctly, document why. (3b)
- Automatic loop: keep "a database of production traces along with their metric scores and any human-provided fixes", then at runtime "retrieve the most similar “fixed” traces to the current query and include these as few-shot demonstrations in the prompt." (3b)
- Untested parts are flagged: prioritizing examples where humans disagreed with the LLM, "TBD on how much lift it provides over uniformly randomly sampling examples." Recency weighting: "I don’t know of anyone who is doing this right now". (2b)
- Risk raised by a reviewer (footnote 2): "what’s the risk of prompt poisoning here—can someone adversarially write queries that get included in the prompt as few-shot examples?" Also legal teams wanting to sign off on prompts. (Footnotes)
- Breaking quality into separate metrics makes labels more consistent, judges easier to align, and "If most outputs are failing due to a specific metric, it pinpoints the area needing improvement." (3b)
- Open problem: multi-step pipelines, where "Errors from one node can amplify through subsequent nodes". (Data Flywheels for “Graphs” of LLM Calls)

## Visuals worth redrawing

- Figure 1, the continually-evolving pipeline (input validation, dynamic few-shot retrieval, code and LLM metrics, logs). Redraw simplified as a loop.

## My notes

- 2024, written before agents were common. The framework is ideas plus what the author sees at companies; there are no before/after numbers.
