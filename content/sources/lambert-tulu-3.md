---
id: lambert-tulu-3
title: "Tulu 3: Pushing Frontiers in Open Language Model Post-Training"
author: Nathan Lambert, Jacob Morrison, Valentina Pyatkin, et al. (Allen Institute for AI)
url: https://arxiv.org/abs/2411.15124
published: 2024-11-22        # v5 2025-04-14
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

A fully open post-training recipe from Ai2, applied to Llama 3.1 base models, with all data, code and evaluations released. The pipeline has four stages: curate prompts, supervised fine-tuning, preference tuning with DPO, and a new stage the paper names Reinforcement Learning with Verifiable Rewards (RLVR), where the model is rewarded only when its answer checks out as correct. It's the best public picture of what a modern post-training pipeline looks like.

## Key claims

- Post-training shapes behavior and adds skills. "Language model post-training is applied to refine behaviors and unlock new skills across a wide range of recent language models" (Abstract)
- The recipe is the part labs don't share. "The underlying training data and recipes for post-training are simultaneously the most important pieces of the puzzle and the portion with the least transparency." (Abstract)
- The algorithms: SFT, DPO, and RLVR. "The training algorithms for our models include supervised finetuning (SFT), Direct Preference Optimization (DPO), and a novel method we call Reinforcement Learning with Verifiable Rewards (RLVR)." (Abstract)
- Early post-training followed the InstructGPT recipe; it's since become multi-round with synthetic data. "moving towards multiple rounds of training, human data plus synthetic data, and multiple training algorithms and objectives" (§2 Tülu 3 Overview)
- RLVR gives a reward only for verified-correct answers. "Reinforcement learning with verifiable rewards, an RL-based method that only gets a reward if the model’s completions are verified to be correct" (§1)
- RLVR replaces the reward model with a check. "trains the model on verifiable rewards instead of a reward model, as is common for traditional RLHF training." (§2, Stage 4)
- In their setup the reward is a constant (α = 10) if correct and 0 otherwise, with a KL penalty to stay near the starting model (§6, Eq. 7–8). "We set α = 10 based on pilot experiments and did not tune it further." (§6)
- Tasks used for RLVR: math (GSM8K, MATH) and precise instruction following (IFEval). (Table of RLVR datasets, "RLVR-GSM-MATH-IF-Mixed-Constraints")
- Preference data was made by generating several responses and having GPT-4o rate them, not humans. "we use an LLM-as-a-judge (Zheng et al., 2023), specifically GPT-4o-2024-0806, to rate each response from 1 to 5 across four different aspects: helpfulness, instruction-following, honesty, and truthfulness." (§5.2)
- Scale of data: 939,344 prompts used in SFT; 354,192 preference pairs for the 8B model's DPO. "Careful multi-skill selection of preference data yields 354,192 instances for preference tuning" (§1; SFT count from Table 7)
- They chose DPO over PPO for preference tuning for simplicity and cost. "used length-normalized DPO throughout the development process and training our final models, in lieu of more costly investigations into RL-based methods, such as PPO." (§1)
- Result: beats the instruct versions of Llama 3.1, Qwen 2.5 and Mistral, and closed models like GPT-4o-mini and Claude 3.5 Haiku. "achieves results surpassing the instruct versions of Llama 3.1, Qwen 2.5, Mistral, and even closed models such as GPT-4o-mini and Claude 3.5-Haiku." (Abstract)
- Over-optimization shows up even with verifiable rewards: some higher-KL IFEval runs produced odd outputs. "found some higher KL runs to have interesting overoptimized outputs." (Appendix B.4)

## Visuals worth redrawing

- Figure 1 (overview): the four stages as a pipeline, base model → SFT → DPO → RLVR, with the data each stage uses. Good main visual for the post-training article.
- The RLVR loop (§6): prompt → model answer → check answer → reward 10 or 0 → update.

## My notes

- 2024–25. Open 8B/70B/405B models built on Llama 3.1.
- The term RLVR was coined here (Lambert's book says so too: `lambert-rlhf-book-intro`).
- The LLM-as-judge preference labels are worth noting in the RLHF article: "human feedback" is now often AI feedback.
