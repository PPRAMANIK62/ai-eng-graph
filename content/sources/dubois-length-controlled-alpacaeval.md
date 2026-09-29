---
id: dubois-length-controlled-alpacaeval
title: "Length-Controlled AlpacaEval: A Simple Way to Debias Automatic Evaluators"
author: Yann Dubois, Balázs Galambosi, Percy Liang, Tatsunori B. Hashimoto
url: https://arxiv.org/abs/2404.04475
published: 2024-04-06
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

AlpacaEval is a leaderboard where a GPT-4 Turbo judge compares a model's answers with a baseline model's answers on 805 instructions. The judge prefers longer answers, so a model can climb just by writing more. The paper fits a regression that predicts the judge's preference from length difference and other features, then asks what the preference would be at equal length. This length-controlled score is much harder to game by prompting for verbosity and tracks Chatbot Arena rankings more closely. COLM 2024. Read from the arXiv PDF.

## Key claims

- The problem: "Even simple, known confounders such as preference for longer outputs remain in existing automated evaluation metrics." (Abstract)
- "AlpacaEval is known to favor models that generate longer outputs." (Abstract)
- The setup: a baseline model and the evaluated model both answer; "A GPT-4 turbo-based evaluator then compares the responses head-to-head", and the win rate is computed "on the 805 instructions." (2)
- The counterfactual: "What would the preference be if the model's and baseline's output had the same length?" (Abstract)
- How much length moves the score: prompted with "Answer with as much detail as possible." (verbose) or "Be as concise as possible while still providing all the necessary information to answer the question." (concise), the baseline model itself (gpt4_1106_preview) "fluctuates from 22.9% to 64.3% by varying the verbosity instruction in the prompt." (4.1)
- "significant gains are possible by asking weaker models to be verbose, as seen with Claude-2.1." (4.1)
- With length control the same model moves only "from 41.9% to 51.6%"; the normalized standard deviation across the three prompts "decreases from 25% to 10%". (4.1)
- Agreement with humans: length control "increases the Spearman correlation with LMSYS Chatbot Arena from 0.94 to 0.98." (Abstract)

## Visuals worth redrawing

- Figure 3: win rate of the same model under concise, standard and verbose prompts, before and after length control.

## My notes

- The 22.9% to 64.3% swing is the clearest single number for length bias: the same model, judged against itself, with nothing changed but how long it was told to write.
- The fix is statistical (a regression over a whole leaderboard). For a small product eval the practical versions are simpler: keep compared answers similar in length, or tell the judge length isn't a criterion and check that it listens.
