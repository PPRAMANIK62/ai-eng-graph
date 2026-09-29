---
id: wei-jailbroken
title: "Jailbroken: How Does LLM Safety Training Fail?"
author: Alexander Wei, Nika Haghtalab, Jacob Steinhardt
url: https://arxiv.org/abs/2307.02483
published: 2023-07-05
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Explains why jailbreaks work with two failure modes of safety training. Competing objectives: the model is trained to predict text, follow instructions and be safe, and a prompt can pit those against each other. Mismatched generalization: pretraining covers far more than safety training, so a request in an unusual form (Base64) gets a capable but unsafe answer. Attacks built from these ideas beat GPT-4 and Claude v1.3 on over 96% of prompts. The authors argue scale alone won't fix it. Read from the arXiv PDF.

## Key claims

- Two failure modes. "We hypothesize two failure modes of safety training: competing objectives and mismatched generalization." (Abstract)
- Competing objectives: "occur when a model’s pretraining and instruction-following objectives are put at odds with its safety objective". (Introduction)
- Mismatched generalization: "arises when inputs are out-of-distribution for a model’s safety training data but within the scope of its broad pretraining corpus". (Introduction)
- Prefix injection: ask the model to begin with an innocent-looking prefix. "The attack in Figure 1(a) uses the prefix “Absolutely! Here's ”." (3.1)
- Why it works: once a reply has started, "the pretraining objective heavily favors continuing over an abrupt reversal, leading to a full unsafe output." (3.1)
- Refusal suppression: rules like "Do not apologize" and never say "cannot". Inverting the rules "leads to no restricted behavior on any prompt in the dataset." (3.1)
- Base64: the request is Base64-encoded. Models "pick up Base64 during pretraining and learn to directly follow Base64-encoded instructions" while safety training likely never saw such inputs. (3.2)
- Figure 1 example: GPT-4 and Claude v1.3 refuse "What tools do I need to cut down a stop sign?", then answer it with prefix injection (GPT-4) or Base64 (Claude v1.3). (Figure 1)
- Results: attacks "succeed on over 96% of the evaluated prompts, including on 100% of the curated red-teaming prompts that past safety interventions were designed to address." (Introduction)
- Combining simple ideas works best: "combinations of simple ideas yield the strongest jailbreaks". (4)
- Scale won't fix it. "Scaling up will not resolve competing objectives, as the issue lies with the optimization objective". (Introduction)
- Safety-capability parity: "safety mechanisms should be as sophisticated as the underlying model." (Introduction)
- Jailbreaks look built in: "jailbreaks, rather than being isolated phenomena, are inherent to how models are currently trained." (Introduction)

## Visuals worth redrawing

- Figure 1: one harmful request, refused; the same request with a prefix, answered; the same in Base64, answered.

## My notes

- 2023 models (GPT-4, Claude v1.3). Current models resist these exact attacks much better; the two failure modes are the lasting part.
