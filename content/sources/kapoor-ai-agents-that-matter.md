---
id: kapoor-ai-agents-that-matter
title: AI Agents That Matter
author: Sayash Kapoor, Benedikt Stroebl, Zachary S. Siegel, Nitya Nadgir, Arvind Narayanan
url: https://arxiv.org/abs/2407.01502
published: 2024-07-01
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

A critique of how agents are benchmarked. Accuracy is reported without cost, simple baselines are skipped, holdout sets are weak, and results are hard to reproduce. On HumanEval, three simple baselines (retry, warming, escalation) match or beat published agent architectures at a fraction of the cost. Abstract and PDF read.

## Key claims

- The headline. "SOTA agents are needlessly complex and costly, and the community has reached mistaken conclusions about the sources of accuracy gains." (Abstract)
- The baselines: retry the same model at temperature zero up to five times if the tests fail; "warming", the same but raising temperature from 0 to 0.5; "escalation", start with Llama-3 8B and move up to GPT-3.5, Llama-3 70B, GPT-4 on a test failure. (2.2)
- Result. "'State-of-the-art' agent architectures for HumanEval do not outperform simple baselines. There is no significant accuracy difference between our warming strategy and the best-performing agent architecture." (2.3)
- Cost gap. "For substantially similar accuracy, the cost can differ by almost two orders of magnitude." Reflexion and LDB cost over 50% more than warming, LATS over 50 times more. (2.3)
- Escalation "strictly improves accuracy while costing less than half of LDB (GPT-3.5)." (2.3)
- Whether planning, reflection and debugging are what drive the gains "remains open"; they might help on harder tasks such as SWE-bench. (2.3)
- "Accuracy alone cannot identify progress because it can be improved by scientifically meaningless methods such as retrying." (2.3)
- Evaluated on the 164 HumanEval problems, each agent run five times. (Figure 1)

## Visuals worth redrawing

- Figure 1: accuracy vs cost Pareto chart of agents and baselines on HumanEval.

## My notes

- 2024 models. The lesson (compare against a cheap baseline, count cost) still holds.
- HumanEval has built-in tests, which is exactly where retry loops shine.
