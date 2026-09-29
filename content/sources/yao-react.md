---
id: yao-react
title: "ReAct: Synergizing Reasoning and Acting in Language Models"
author: Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao
url: https://arxiv.org/abs/2210.03629
published: 2022-10-06
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The paper that named ReAct: prompt a model to alternate free-text thoughts with actions, and feed each action's observation back in. Tested with PaLM-540B on question answering (HotpotQA), fact checking (FEVER), a text household game (ALFWorld) and a shopping site (WebShop). v3 revised 2023-03-10, published at ICLR 2023. Abstract and full PDF read.

## Key claims

- The idea: generate "both reasoning traces and task-specific actions in an interleaved manner". Reasoning traces "help the model induce, track, and update action plans as well as handle exceptions, while actions allow it to interface with external sources". (Abstract)
- Setup: few-shot prompting of PaLM-540B with 6 (HotpotQA) and 3 (FEVER) hand-written example trajectories; "We find more examples do not improve performance." (3.2, footnote 2)
- The Wikipedia tool has three actions: `search[entity]` (first 5 sentences of the page, or 5 similar titles), `lookup[string]` (next sentence containing the string), `finish[answer]`. (3.1 Action Space)
- Figure 1 example: "Aside from the Apple Remote, what other device can control the program Apple Remote was originally designed to interact with?" CoT answers from memory (Apple TV, so iPhone, iPad, iPod Touch). ReAct searches Apple Remote, learns it was designed for the Front Row media center program, fails to find "Front Row", searches "Front Row (software)" instead, and answers keyboard function keys. (Figure 1)
- HotpotQA exact match: CoT 29.4, ReAct 27.4. FEVER accuracy: CoT 56.3, ReAct 60.9. "ReAct outperforms CoT on Fever (60.9 vs. 56.3) and slightly lags behind CoT on HotpotQA (27.4 vs. 29.4)." (3.3)
- Error analysis on 200 hand-labeled HotpotQA trajectories (50 correct and 50 incorrect each for ReAct and CoT): hallucination is 56% of CoT failures and 0% of ReAct's; reasoning error is 47% of ReAct failures vs 16% for CoT; non-informative search is 23% of ReAct failures. (Table 2)
- A ReAct-specific failure: "the model repetitively generates the previous thoughts and actions" and can't "jump out of the loop". (3.3 B)
- Best results combine ReAct with CoT self-consistency, backing off from one to the other. (3.3)
- ALFWorld success: ReAct 71 (best of 6) vs Act-only 45 (best of 6); ReAct average 57. WebShop success rate: ReAct 40.0, Act 30.1, IL 29.1. (Tables 3 and 4)
- Abstract: beats imitation and reinforcement learning methods "by an absolute success rate of 34% and 10% respectively, while being prompted with only one or two in-context examples." (Abstract)
- Humans can correct the agent by editing its thoughts mid-run: solving a task goes "from typing tens of actions to only editing a couple of thoughts". (Introduction, Appendix A.3)
- Figure 1, ReAct's last step (text in the PDF figure is font-encoded, decoded by hand): the thought says Front Row software is controlled by an Apple Remote or the keyboard function keys, so the answer is keyboard function keys. (Figure 1 (1d))
- ALFWorld: an agent navigating and interacting with a simulated household via text actions. WebShop: a shopping site "with 1.18M real-world products and 12k human instructions". (Sections 4)
- Combining: "ReAct → CoT-SC: when ReAct fails to return an answer within given steps, back off to CoT-SC" (7 steps for HotpotQA, 5 for FEVER); "CoT-SC → ReAct: when the majority answer among n CoT-SC samples occurs less than n/2 times". (3.2)
- The Wikipedia tool is weak on purpose: it "mostly can only retrieve a small part of a passage based on exact passage name". (3.1)

## Visuals worth redrawing

- Figure 1: Standard vs CoT vs Act-only vs ReAct on the Apple Remote question.

## My notes

- 2022 prompting technique, text-format actions parsed from the output. Today's models do the same loop through native tool calling.
