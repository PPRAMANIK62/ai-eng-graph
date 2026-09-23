---
id: min-rethinking-demonstrations
title: "Rethinking the Role of Demonstrations: What Makes In-Context Learning Work?"
author: Sewon Min, Xinxi Lyu, Ari Holtzman, Mikel Artetxe, Mike Lewis, Hannaneh Hajishirzi, Luke Zettlemoyer
url: https://arxiv.org/abs/2202.12837
published: 2022-02-25        # v1; v2 revised 2022-10-20; EMNLP 2022
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

A test of what the examples in a few-shot prompt actually teach. On classification and multiple-choice tasks, swapping the correct labels in the examples for random ones barely hurt accuracy, across 12 models up to GPT-3. What mattered was that the examples showed the set of possible labels, what typical inputs look like, and the format. The model seems to already know how to do the task, and the examples mostly tell it which task and what shape of answer.

## Key claims

- Headline. "randomly replacing labels in the demonstrations barely hurts performance on a range of classification and multi-choce tasks, consistently over 12 different models including GPT-3." (Abstract)
- What matters instead. "(1) the label space, (2) the distribution of the input text, and (3) the overall format of the sequence." (Abstract)
- Size of the drop. "models see performance drop in the range of 0–5% absolute." Less on multi-choice (1.7% average) than classification (2.6%). (§4, Results)
- Examples still beat no examples. "using the demonstrations with gold labels significantly improves the performance over no demonstrations" (§4)
- Format matters even without meaning. "when the label space is unknown, using random English words as labels is significantly better than using no labels" (§1)
- Setup: "We experiment with 12 models in total." Six decoder-only LMs from 774M to 175B parameters (GPT-2, MetaICL, GPT-J, fairseq 6.7B and 13B, GPT-3), each used two ways. (§3)
- Default number of examples. "We use k = 16 examples as demonstrations by default" (§3, Other Details)
- Their reading of why. "the models are capable of recovering the expected input-label correspondence for the task; however, it is not directly from the pairings in the demonstrations." (§4)
- Limitation: some datasets care more. The largest gap was "nearly 14% absolute on the financial_phrasebank dataset with GPT-J", and later work found "using negated labels substantially lowers the performance in classification." (Limitation)
- Limitation: only classification and multiple choice; generation tasks weren't tested. "Our experiments are limited to classification and multi-choice tasks." (Limitation)

## Visuals worth redrawing

- Figure 1 / Figure 3: three bars per model (no demos, demos with gold labels, demos with random labels). Gold and random are nearly the same height; no-demos is clearly lower. The single best picture for "examples teach format, not facts".

## My notes

- 2022 models, before instruction tuning was standard. The effect may differ on today's chat and reasoning models; nobody in my sources re-ran it on them.
- Pairs with `agarwal-many-shot-icl`: with a few examples the model sticks to what it already believes; with hundreds, flipped labels do get learned. So "labels barely matter" is a few-shot result.
- Practical reading: example correctness still matters for your product (wrong examples can't help), but format and coverage of the label set are what the model picks up first.
