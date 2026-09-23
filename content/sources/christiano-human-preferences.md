---
id: christiano-human-preferences
title: Deep reinforcement learning from human preferences
author: Paul Christiano, Jan Leike, Tom B. Brown, Miljan Martic, Shane Legg, Dario Amodei
url: https://arxiv.org/abs/1706.03741
published: 2017-06-12
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The paper that started RLHF, before language models. Instead of writing a reward function by hand, a person watches two short clips of an agent (in Atari games or a physics simulator) and picks the better one. A reward model learns to predict those picks, and the agent is trained to maximize the predicted reward. It needed feedback on under 1% of the agent's actions, and taught new behaviors like a backflip with about an hour of human time.

## Key claims

- The goal: learn tasks where you can't write down the reward. "we explore goals defined in terms of (non-expert) human preferences between pairs of trajectory segments." (Abstract)
- It works without the true reward and needs little feedback. "providing feedback on less than one percent of our agent's interactions with the environment." (Abstract)
- New behaviors from about an hour of human time. "we show that we can successfully train complex novel behaviors with about an hour of human time." (Abstract)
- The method: learn a reward from feedback, then optimize it. "Our approach is to learn a reward function from human feedback and then to optimize that reward function." (§1 Introduction)
- Why comparisons instead of scores: easier for people, equally useful. "We found comparisons to be easier for humans to provide in some domains, while being equally useful for learning human preferences." (§1)
- The clips are short: 1 to 2 seconds. "In all of our experiments, these clips are between 1 and 2 seconds long." (§2.2.2)
- The rater can also say both are equally good, or skip. "The human then indicates which segment they prefer, that the two segments are equally good, or that" they can't compare them (§2.2.2; sentence continues)
- Examples of novel behaviors: a backflip, driving with the flow of traffic. "such as performing a backflip or driving with the flow of traffic." (§1)
- Asking for feedback during training (online) stops the agent exploiting holes in the learned reward. "collecting feedback online improves the system’s performance and prevents it from exploiting weaknesses of the learned reward function." (§1)
- Early reward hacking example: with a reward model trained offline, the Pong agent learned to avoid losing points without scoring, giving endless volleys. "on Pong offline training sometimes leads our agent to avoid losing points but not to score points" (§3.3 Ablation Studies)

## Visuals worth redrawing

- Figure 1: the loop. Human feedback → reward predictor → predicted reward → RL algorithm → actions in the environment → clips back to the human. Redraw as the origin of the RLHF loop.

## My notes

- 2017, robots and Atari, not language. Historical, but it's where pairwise comparisons and learned rewards come from; InstructGPT cites it for RLHF.
- The Pong example is a good plain illustration of optimizing a proxy reward.
