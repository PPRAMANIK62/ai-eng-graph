---
id: rafailov-dpo
title: "Direct Preference Optimization: Your Language Model is Secretly a Reward Model"
author: Rafael Rafailov, Archit Sharma, Eric Mitchell, Stefano Ermon, Christopher D. Manning, Chelsea Finn
url: https://arxiv.org/abs/2305.18290
published: 2023-05-29        # v3 2024-07-29; NeurIPS 2023
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

DPO trains a language model directly on preference pairs (a preferred and a rejected answer to the same prompt), with a simple loss, instead of training a separate reward model and then running reinforcement learning. The math shows it optimizes the same goal as standard RLHF with a KL penalty. It's simpler, more stable and cheaper, and became the default preference-tuning method in open recipes.

## Key claims

- Base models know a lot but are hard to steer. "achieving precise control of their behavior is difficult due to the completely unsupervised nature of their training." (Abstract)
- RLHF is complex and unstable: fit a reward model, then RL against it without drifting too far. "RLHF is a complex and often unstable procedure, first fitting a reward model that reflects the human preferences, and then fine-tuning the large unsupervised LM using reinforcement learning to maximize this estimated reward without drifting too far from the original model." (Abstract)
- DPO solves the same problem with a classification loss. "allowing us to solve the standard RLHF problem with only a simple classification loss." (Abstract)
- It's lighter: no sampling from the model during training, little tuning. "eliminating the need for sampling from the LM during fine-tuning or performing significant hyperparameter tuning." (Abstract)
- What the update does, intuitively: push up the preferred answer's probability relative to the rejected one. "the DPO update increases the relative log probability of preferred to dispreferred responses" (§1 Introduction)
- A per-example weight stops the model from degenerating. "it incorporates a dynamic, per-example importance weight that prevents the model degeneration that we find occurs with a naive probability ratio objective." (§1)
- The model itself acts as the reward model (hence the title). "fitting an implicit reward model whose corresponding optimal policy can be extracted in closed form." (§1)
- Results: as good or better than PPO-based RLHF on sentiment control, summarization and single-turn dialogue, with models up to 6B parameters. "matches or improves response quality in summarization and single-turn dialogue while being substantially simpler to implement and train." (Abstract)

## Visuals worth redrawing

- Figure 1: RLHF (preference data → reward model → RL with sampling → policy) next to DPO (preference data → maximum likelihood → policy). The cleanest picture of "DPO removes two boxes". Redraw side by side.

## My notes

- Experiments are small (up to 6B) and 2023-era. Adoption evidence comes from elsewhere: Lambert (`lambert-rlhf-book-intro`) on the "DPO era" from late 2023, and Tulu 3 (`lambert-tulu-3`) using length-normalized DPO for its preference stage.
- DPO still needs preference pairs; it changes the training method, not the data.
- It's "offline": it learns from a fixed set of pairs rather than sampling fresh answers and scoring them. Tulu 3 generates "on-policy" pairs from its own SFT model to get some of that back.
