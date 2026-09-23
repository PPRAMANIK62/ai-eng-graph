---
id: lambert-rlhf-book-intro
title: Introduction (Reinforcement Learning from Human Feedback, ch. 1)
author: Nathan Lambert
url: https://rlhfbook.com/c/01-introduction
published: 2026-09-11        # the site shows this build date; print edition Manning 2026
accessed: 2026-09-23
kind: book
primary: false
---

## Summary

The opening chapter of Nathan Lambert's online book on RLHF and post-training. It places RLHF inside post-training (SFT, preference tuning, RL with verifiable rewards), shows a base model and a post-trained model answering the same prompt, walks through the classic three-step recipe, and argues for the "elicitation" view: post-training draws out ability already in the base model, but it's more than style. It also tells the history: InstructGPT, the DPO era, then RLVR and reasoning models.

## Key claims

- Post-training in three methods: SFT, preference fine-tuning, RLVR. "Post-training can be summarized as a many-stage training process using three optimization methods" (Introduction)
- SFT teaches format and instruction following. "Instruction / Supervised Fine-tuning (IFT/SFT), where we teach formatting and form the base of instruction-following abilities." (Introduction)
- Preference tuning is about style and hard-to-measure preferences. "This is largely about style of language and subtle human preferences that are hard to quantify." (Introduction)
- RLVR is the newest stage. "Reinforcement Learning with Verifiable Rewards (RLVR), the newest type of post-training that boosts performance on verifiable domains with more RL training." (Introduction)
- Base model vs post-trained model: Llama 3.1 405B Base continues "The president of the united states in 2006 was" with a ramble of internet-style text; Tülu 3 405B answers in one clean sentence. "What is clear is that this model is completing the sentence and adding other common internet metadata." (What Does RLHF Do?)
- The base model's continuation opens with the answer, then drifts to other 2006 politicians and an executive order (re-opened 2026-09-23 for the post-training figure). "George W. Bush, the governor of Florida in 2006 was Jeb Bush, and John McCain was an Arizona senator in 2006 - who later lost to obama. September 1 – U.S. President Bush signs an executive order" (What Does RLHF Do?)
- Tülu 3 405B's full answer to the same prompt. "George W. Bush was the president of the United States in 2006. He served two terms in office, from January 20, 2001, to January 20, 2009." (What Does RLHF Do?)
- RLHF generalizes better than instruction tuning. "Compared to other techniques for post-training, such as instruction fine-tuning, RLHF generalizes far better across domains" (What Does RLHF Do?)
- RLHF works on whole responses and uses negative examples, unlike SFT's per-token imitation. "RLHF on the other hand tunes completions on the response level rather than looking at the next token specifically." (What Does RLHF Do?)
- The reward is only a proxy, so over-optimization is a built-in risk. "the optimization itself is prone to over-optimization because our reward signal is at best a proxy objective, requiring regularization." (What Does RLHF Do?)
- RLHF has side effects such as length bias, and costs more than SFT. "implementing RLHF is far more costly than simple instruction fine-tuning and can come with unexpected challenges such as length bias" (What Does RLHF Do?)
- The reward model is usually the SFT model fine-tuned on preference pairs, and outputs one score per answer. "The goal of a reward model is to create a scalar signal that can then later be optimized with RL." (Walkthrough of an RLHF Recipe)
- The elicitation view. "all we are doing is extracting potential by amplifying valuable behaviors in the base model." (An Intuition for Post-Training)
- Changing only post-training can move benchmarks a lot: OLMoE Instruct went from 35 to 48 average between versions. "the evaluation average on popular benchmarks went from 35 to 48 without changing the majority of pretraining" (An Intuition for Post-Training)
- He disagrees with LIMA's Superficial Alignment Hypothesis. "The superficial alignment hypothesis is wrong for the same reason that people who think RLHF and post-training are just for vibes are still wrong." (An Intuition for Post-Training)
- Post-training compute is growing: DeepSeek R1 used about 5% of its compute on post-training (147K H800 GPU hours for RL vs 2.8M for pretraining V3). "DeepSeek R1, famous for popularizing RLVR, used only about 5% of their overall compute in post-training" (An Intuition for Post-Training)
- DPO solved the same problem with fewer parts, and took off in late 2023. "showed that you can solve the same optimization problem as RLHF with fewer moving parts by taking gradient steps directly on pairwise preference data." (How We Got Here)
- Preference tuning became standard from late 2023. "Preference-tuning was something you needed to do to meet the table stakes of releasing a good model since late 2023." (How We Got Here)
- Current innovation is in RLVR and reasoning. "The primary areas of innovation in post-training are now in reinforcement learning with verifiable rewards (RLVR), reasoning training generally, and related ideas." (How We Got Here)
- The DPO era started with a few breakthrough open models. "Zephyr-Beta [26], Tülu 2 [27], and many other models showed that the DPO era of post-training had begun." (How We Got Here)
- RLHF behind ChatGPT's success. "RLHF was the technique that enabled the massive success of the release of ChatGPT" (Introduction)
- Human preference data is expensive, $100K to $1M budgets. "groups cannot afford data budgets on the order of $100K to $1M." (How We Got Here)

## Visuals worth redrawing

- Figure 1: the early three-stage RLHF process (SFT → reward model → RL optimization). Same shape as InstructGPT's figure.
- The side-by-side base vs post-trained answers to "The president of the united states in 2006 was". Good opening example for the post-training article (short, redraw as two boxes).

## My notes

- Actively updated online book; the site shows 2026-09-11 as its build date. Lambert is first author of the Tulu 3 paper (Ai2), so he's close to a primary source for RLVR, but this chapter is an explainer.
- Main disagreement with LIMA (`zhou-lima`): LIMA says post-training is mostly format; Lambert says that's true only for light recipes, and RL now adds real capability.
- The "5%" DeepSeek figure is his calculation from the R1 and V3 reports.
