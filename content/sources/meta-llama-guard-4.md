---
id: meta-llama-guard-4
title: Llama Guard 4 (model card)
author: Meta
url: https://huggingface.co/meta-llama/Llama-Guard-4-12B
published: 2025-04-05
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Model card for Llama Guard 4, an open 12-billion-parameter safety classifier that reads a prompt or a response (text and images) and answers "safe" or "unsafe" plus the hazard categories broken, from a list of 14 (S1–S14). The card reports its own recall and false-positive rates and says plainly that it can be attacked; for prompt injection it points to a separate model, Prompt Guard 2.

## Key claims

- What it is: a "natively multimodal safety classifier with 12 billion parameters trained jointly on text and multiple images". Classifies both LLM inputs and responses, and outputs "safe" or "unsafe" with the violated categories. (Model details)
- Categories: S1 Violent Crimes, S2 Non-Violent Crimes, S3 Sex-Related Crimes, S4 Child Sexual Exploitation, S5 Defamation, S6 Specialized Advice, S7 Privacy, S8 Intellectual Property, S9 Indiscriminate Weapons, S10 Hate, S11 Suicide & Self-Harm, S12 Sexual Content, S13 Elections, S14 Code Interpreter Abuse. (Hazard taxonomy)
- Measured, English text: recall 69%, false positive rate 11%, F1 61%. Multilingual: recall 43%, FPR 3%, F1 51%. Single image: recall 41%, FPR 9%. Multi-image: recall 61%, FPR 9%. "Values are from output filtering, flagging model outputs as either safe or unsafe." Multilingual is "an average over the 7 shipped non-English languages of Llama Guard 3-8B". Measured on an "in-house test set". (Evaluation table and note)
- Limits: "Lastly, as an LLM, Llama Guard 4 may be susceptible to adversarial attacks or prompt injection attacks that could bypass or alter its intended use: see Llama Prompt Guard 2 for detecting prompt attacks." (Limitations)
- Categories like Defamation, Intellectual Property and Elections need current factual knowledge the classifier may not have. (Limitations)

## Visuals worth redrawing

- None.

## My notes

- Release date taken from the Llama 4 license date on the card.
