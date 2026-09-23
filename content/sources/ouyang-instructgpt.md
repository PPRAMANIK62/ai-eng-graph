---
id: ouyang-instructgpt
title: Training language models to follow instructions with human feedback
author: Long Ouyang, Jeff Wu, Xu Jiang, et al. (OpenAI, 20 authors)
url: https://arxiv.org/abs/2203.02155
published: 2022-03-04
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The InstructGPT paper, the recipe behind ChatGPT's style of assistant. OpenAI took GPT-3 and trained it in three steps: supervised fine-tuning on answers written by labelers, a reward model trained on labelers' rankings of model answers, and reinforcement learning (PPO) against that reward model. The small 1.3B result was preferred over the raw 175B GPT-3. It also documents the costs and side effects: an "alignment tax" on some benchmarks, hedging, and going along with false premises.

## Key claims

- Bigger doesn't mean more helpful. "Making language models bigger does not inherently make them better at following a user’s intent." (Abstract)
- Why: the pretraining objective isn't the goal you want. "the language modeling objective is misaligned." (§1 Introduction)
- The three steps: demonstrations → supervised fine-tuning; rankings → reward model; RL (PPO) against the reward model. "We then collect a dataset of rankings of model outputs, which we use to further fine-tune this supervised model using reinforcement learning from human feedback." (Abstract)
- Labelers: a team of about 40 contractors chosen by a screening test. "We first hire a team of 40 contractors to label our data" (§1)
- Data sizes: about 13k prompts for SFT, 33k for the reward model, 31k for PPO. "The SFT dataset contains about 13k training prompts (from the API and labeler-written), the RM dataset has 33k training prompts" (§3.2 Dataset)
- Labelers ranked between 4 and 9 answers per prompt, giving many pairwise comparisons. "we present labelers with anywhere between K = 4 and K = 9 responses to rank." (§3.5 Models, Reward modeling)
- The headline: 1.3B InstructGPT beat 175B GPT-3 in labelers' eyes. "outputs from the 1.3B parameter InstructGPT model are preferred to outputs from the 175B GPT-3, despite having 100x fewer parameters." (Abstract)
- 175B InstructGPT beat 175B GPT-3 85% of the time, and few-shot-prompted GPT-3 71% of the time. "Outputs from our 175B InstructGPT are preferred to 175B GPT-3 outputs 85 ± 3% of the time, and preferred 71 ± 4% of the time to few-shot 175B GPT-3." (§1)
- Less made-up information on closed-domain tasks than GPT-3: 21% vs 41%. "InstructGPT models make up information not present in the input about half as often as GPT-3 (a 21% vs. 41% hallucination rate, respectively)." (§1)
- A KL penalty keeps the RL model close to the supervised one so it can't over-exploit the reward model. "we add a per-token KL penalty from the SFT model at each token to mitigate over-optimization of the reward model." (§3.5 Reinforcement learning)
- The alignment tax: RL made some benchmark scores drop; mixing in pretraining updates (PPO-ptx) fixed most of it. "This is an example of an “alignment tax” since our alignment procedure comes at the cost of" lower performance on some tasks (§1)
- Labelers agree with each other about 73% of the time. "training labelers agree with each-other 72.6 ± 1.5% of the time" (§3.4 Human data collection)
- It aligns to a specific group, not "humanity". "This procedure aligns the behavior of GPT-3 to the stated preferences of a specific group of people (mostly our labelers and researchers), rather than any broader notion of “human values”" (§1)
- Side effects: goes along with false premises, and hedges too much, partly because labelers rewarded humility. "We suspect that behavior (2) emerges partly because we instruct labelers to reward epistemic humility" (§5.3 Limitations / Figure 9 discussion)
- Post-training is cheap next to pretraining: 175B SFT took 4.9 petaflop/s-days and 175B PPO-ptx 60, vs 3,640 for GPT-3. "training our 175B PPO-ptx model requires 60 petaflops/s-days, compared to 3,640 petaflops/s-days for GPT-3" (§5.1)

## Visuals worth redrawing

- Figure 2: the three-step diagram (collect demonstrations → SFT; collect comparisons → train RM; optimize policy with PPO against the RM). The standard picture of RLHF. Redraw as three boxes left to right.
- Figure 1: labeler win rate vs model size for GPT, GPT prompted, SFT, PPO and PPO-ptx. Shows the 1.3B-beats-175B result.

## My notes

- 2022, GPT-3 era. Still the canonical RLHF recipe; later recipes (Tulu 3, DeepSeek-R1) change the stages.
- The 21% vs 41% hallucination figure is InstructGPT vs base GPT-3. Chip Huyen (`huyen-rlhf`) says RLHF "made hallucination worse" compared with SFT alone; those are different comparisons, don't mix them up.
- The hedging example is a clean case of "labelers' preferences leak into the model", which the sycophancy paper studies in depth.
