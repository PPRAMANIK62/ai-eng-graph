---
id: google-react-blog
title: "ReAct: Synergizing Reasoning and Acting in Language Models (Google Research blog)"
author: Shunyu Yao and Yuan Cao (Google Research)
url: https://research.google/blog/react-synergizing-reasoning-and-acting-in-language-models/
published: 2022-11-08
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

The paper's authors explain ReAct in plain terms: why reasoning alone hallucinates, why acting alone loses the plot, and what happens when the two take turns. Has the result tables and a thought-editing example.

## Key claims

- The mechanism. "ReAct enables language models to generate both verbal reasoning traces and text actions in an interleaved manner. While actions lead to observation feedback from an external environment ("Env" in the figure below), reasoning traces do not affect the external environment." (main text)
- Reasoning alone: "a model is not grounded in the external world and uses its own internal representations to generate reasoning traces, limiting its ability to reactively explore and reason or update its knowledge." (main text)
- Acting alone: such models "do not reason abstractly about high-level goals or maintain a working memory to support acting over long horizons." (main text)
- Best result combines both: "a combination of ReAct and CoT that uses both internal knowledge and externally obtained information during reasoning." HotpotQA 35.1 and FEVER 64.6 for the best ReAct + CoT. (results table)
- Fine-tuning: trajectories from ReAct-prompted PaLM-540B that succeeded were used to fine-tune PaLM-8B/62B. (main text)
- Human in the loop: "by simply replacing a hallucinating sentence with inspector hints, ReAct can change its behavior to align with inspector edits and successfully complete a task." (main text)

## Visuals worth redrawing

- The Reason only / Act only / ReAct comparison of loops between model and environment.

## My notes

- Same authors as the paper, so same numbers.
