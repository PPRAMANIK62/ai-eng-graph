---
id: huyen-rlhf
title: "RLHF: Reinforcement Learning from Human Feedback"
author: Chip Huyen
url: https://huyenchip.com/2023/05/02/rlhf.html
published: 2023-05-02
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

A long, engineer-friendly explainer of the three stages behind ChatGPT-style models (pretraining, supervised fine-tuning, RLHF), built mostly on the InstructGPT paper. Strongest on the reward model: why labelers compare answers instead of scoring them, what the comparison data looks like, and the loss that turns comparisons into scores. It also discusses whether RLHF helps or hurts hallucination.

## Key claims

- Pretraining is by far the most expensive stage: 98% of compute and data for InstructGPT. "For the InstructGPT model, pretraining takes up 98% of the overall compute and data resources ." (overview)
- SFT and RLHF unlock what's already there. "You can think of SFT and RLHF as unlocking the capabilities that the pretrained model already has but are hard for users to access via prompting alone." (overview)
- Pretraining optimizes for completion, so a question can get any plausible continuation. "Pretraining optimizes for completion." (Phase 2. Supervised finetuning)
- OpenAI calls SFT behavior cloning. "OpenAI calls supervised finetuning behavior cloning : you demonstrate how the model should behave, and the model clones this behavior." (Phase 2)
- InstructGPT's labelers wrote about 13,000 prompt–response pairs. "OpenAI’s 40 labelers created around 13,000 (prompt, response) pairs for InstructGPT ." (Phase 2)
- Why comparisons: people disagree on absolute scores. "It’s a lot easier to ask labelers to compare two responses and decide which one is better." (Phase 3.1 Reward model)
- Comparison data format. "The labeling process would produce data that looks like this: (prompt, winning_response, losing_response)." (Phase 3.1)
- Human preferences vary; she prefers the "losing" answer in an HH-RLHF example. "Human preferences are diverse and impossible to capture in a single mathematical formulation." (Phase 3.1)
- The reward model's goal is to score the winner above the loser. "the objective is to maximize the difference in score between the winning response and the losing response" (Phase 3.1)
- Labeler agreement is about 73%. "Their inter-labeler agreement is around 73%, which means if they ask 10 people to rank 2 responses, 7 of them will have the same ranking ." (Phase 3.1, UI to collect comparison data)
- Why the RL step stays close to the SFT model: the reward model can give crazy scores to answers it never saw. "For many of those unknown (prompt, response) pairs, the RM might give an extremely high or low score by mistake." (Phase 3.2 Finetuning using the reward model)
- Dataset sizes: Anthropic's public hh-rlhf has about 170K comparisons. "Anthropic has an older version of their data open-sourced ( hh-rlhf ), which consists of roughly 170K comparisons." (Phase 3.1)
- Her reading of InstructGPT: RLHF made hallucination worse than SFT alone, while being preferred overall. "the InstructGPT paper shows that RLHF actually made hallucination worse." (RLHF and hallucination)
- Schulman's hypothesis (reported): SFT on human-written answers can teach hallucination when the human knows things the model doesn't. "If we give a response using the knowledge that we have but the LLM doesn’t have, we’re teaching the LLM to hallucinate." (RLHF and hallucination)

## Visuals worth redrawing

- The "Shoggoth with smiley face" meme (pretrained monster → SFT → RLHF smiley). Credited to twitter.com/anthrupad; memorable but don't copy. A plain three-stage version works.
- Her diagram of the three phases with data sizes per phase.

## My notes

- 2023, before DPO and RLVR became standard. Pair with Lambert and Tulu 3 for the current picture.
- Her "50,000 prompts" for InstructGPT's reward model doesn't match the paper's "33k training prompts" (§3.2 of `ouyang-instructgpt`); use the paper's number.
- "RLHF made hallucination worse" compares PPO models to SFT. InstructGPT's abstract reports lower hallucination than base GPT-3 (21% vs 41%). Both can be true; say which comparison.
- The Schulman point is her summary of a talk, not something I opened. Treat as a hypothesis, attributed.
