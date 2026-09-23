---
id: zhou-lima
title: "LIMA: Less Is More for Alignment"
author: Chunting Zhou, Pengfei Liu, Puxin Xu, et al. (Meta AI, 15 authors)
url: https://arxiv.org/abs/2305.11206
published: 2023-05-18
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

Meta fine-tuned a 65B LLaMa base model on just 1,000 hand-picked prompt–response pairs, with no preference training or RL, and got an assistant that people rated close to the big commercial ones of early 2023. The authors read this as evidence that a model's knowledge comes from pretraining, and that the later stages mostly teach it which style and format to answer in. They call this the Superficial Alignment Hypothesis.

## Key claims

- The two-stage picture of LLM training. "Large language models are trained in two stages: (1) unsupervised pretraining from raw text, to learn general-purpose representations, and (2) large scale instruction tuning and reinforcement learning, to better align to end tasks and user preferences." (Abstract)
- The setup: 65B LLaMa, 1,000 examples, standard supervised loss, no RL. "a 65B parameter LLaMa language model fine-tuned with the standard supervised loss on only 1,000 carefully curated prompts and responses, without any reinforcement learning or human preference modeling." (Abstract)
- The data: 750 top Q&A pairs from sites like Stack Exchange and wikiHow, plus 250 written by the authors; about 750,000 tokens in total. "amount of training data is roughly 750,000 tokens, split over exactly 1,000 sequences." (§2)
- Results against other assistants in a human study. "responses from LIMA are either equivalent or strictly preferred to GPT-4 in 43% of cases; this statistic is as high as 58% when compared to Bard and 65% versus DaVinci003" (Abstract)
- The conclusion on knowledge. "these results strongly suggest that almost all knowledge in large language models is learned during pretraining" (Abstract)
- The Superficial Alignment Hypothesis. "A model’s knowledge and capabilities are learnt almost entirely during pretraining, while alignment teaches it which subdistribution of formats should be used when interacting with users." (§2 Alignment Data)
- Quantity alone doesn't help much; diversity and quality do. "Ablation experiments reveal vastly diminishing returns when scaling up data quantity without also scaling up prompt diversity" (§1; sentence continues)
- Doubling the training set didn't improve answers. "doubling the training set does" not improve response quality (§5 Quantity; the sentence continues "not improve response quality")
- With zero dialogue examples it could still hold a multi-turn conversation. "despite having zero dialogue examples, we find that LIMA can conduct coherent multi-turn dialogue" (§1)
- Known weakness: fragile on unlucky samples and adversarial prompts. "an unlucky sample during decoding or an adversarial prompt can often lead to a weak" response (§7 Discussion)

## Visuals worth redrawing

- Figure 1 (human preference study): stacked bars of LIMA wins / ties / losses against Alpaca 65B, DaVinci003, Bard, Claude and GPT-4. Could be redrawn simply.

## My notes

- 2023, against 2023 models. The comparison is human preference on 300 test prompts, not capability benchmarks.
- Lambert (`lambert-rlhf-book-intro`) argues this hypothesis is "wrong" for modern post-training: RL on math can add real reasoning ability, and post-training compute has grown a lot. That's the main disagreement for the post-training article.
- Good source for "where knowledge comes from": pretraining.
