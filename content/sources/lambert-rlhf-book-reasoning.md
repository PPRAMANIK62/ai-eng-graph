---
id: lambert-rlhf-book-reasoning
title: Reasoning and Inference-Time Scaling (Reinforcement Learning from Human Feedback, ch. 7)
author: Nathan Lambert
url: https://rlhfbook.com/c/07-reasoning
published: 2026-09-11        # the site shows this build date
accessed: 2026-09-23
kind: book
primary: false
---

## Summary

The reasoning chapter of Lambert's RLHF book. It explains RL with verifiable rewards (RLVR) in plain terms: instead of a reward model judging quality, a simple check scores the answer (does the math answer match, do the unit tests pass). It shows a regular model and a reasoning model answering the same prompt, describes the training loop (sample answers, step toward the correct ones, repeat), and links it to inference-time scaling: models trained this way produce more tokens, and more tokens correlate with better answers.

## Key claims

- Inference-time scaling defined. "Inference-time scaling is the ability to improve model performance by using more computation during generation, such as producing longer reasoning chains or sampling multiple responses." (intro)
- Reasoning models are trained with lots of RLVR and still use RLHF. "These models, trained with a large amount of reinforcement learning with verifiable rewards (RLVR) [1], still utilize large amounts of RLHF." (intro)
- RLVR swaps the reward model for a scoring function. "it makes the reward model optional in lieu of a scoring function that returns a positive reward when the answer is correct and 0 otherwise." (The Role of RLVR)
- Math example: "What is the sum of all prime numbers less than 20?"; the answer 77 is extracted from the box and checked, reward 1. (The Role of RLVR)
- Code example: unit tests as the check; all pass gives reward 1, any failure gives 0, or partial credit in some setups. "If all assertions pass, the reward is 1; if any fail, the reward is 0." (The Role of RLVR)
- The training loop. "Sample multiple answers to multiple questions," then "Take gradient steps towards the answers that are correct, and" then "Repeat, revisiting the same data." (The Role of RLVR)
- Gains carry over to unseen questions. "the improvements on these training questions generalize to questions and (some) domains the models have never seen!" (The Role of RLVR)
- First successful deployments: OpenAI's o1 and DeepSeek R1. "The first models to successfully deploy this type of training were OpenAI’s o1 [2] and the open-weight model DeepSeek R1 [3]." (The Role of RLVR)
- Reasoning models write thinking tokens first; on hard problems that can be thousands of tokens. "For more complex problems the reasoning stage can take thousands of tokens before producing an answer." (The Role of RLVR)
- The goldfish poem example: DeepSeek V3 writes the poem directly; R1 first writes a paragraph of planning inside thinking tags, then the poem. (The Role of RLVR)
- A base level of ability was needed first. "Multiple resources point to RL training for reasoning only being viable with leading models coming out from about 2024 onwards" (Why Does RL Work Now?)
- More tokens correlate with better performance. "Training models heavily with RL often enables them to generate more tokens per response in a way that is strongly correlated with improved downstream performance" (RL Training vs. Inference-Time Scaling)
- Contrast with early RLHF's length bias. "the human preference training had a side effect of increasing the response average length for marginal gains on preference rankings." (RL Training vs. Inference-Time Scaling)
- RLVR revisits the same data many times, unlike SFT's 1–2 epochs. "RLVR gets its name by doing hundreds or thousands of epochs over the same few data points" (The Future (Beyond Reasoning) of RLVR)
- Distillation is the other route: instruction-tune a model on a reasoning model's outputs. "or a large-scale instruction tuning run on outputs of another model that had undergone a substantial portion of RLVR training (referred to as distillation)." (Understanding Reasoning Training Methods)

## Visuals worth redrawing

- Figure 1: RLVR as an RL loop with a verification function where the reward model used to be. Redraw with the prime-sum example.
- Table 1: the 2025 wave of reasoning-model reports (R1, Kimi 1.5, Qwen 3, Magistral, ...). Too detailed for our article; useful context.

## My notes

- Book chapter, not primary, but Lambert co-authored the paper that coined RLVR (`lambert-tulu-3`).
- "RLVR gets its name by doing hundreds or thousands of epochs" is odd wording (the name comes from verifiable rewards); use it only for the epochs fact.
