---
id: deepseek-r1
title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning"
author: DeepSeek-AI (Daya Guo, Dejian Yang, Haowei Zhang, et al.)
url: https://arxiv.org/abs/2501.12948
published: 2025-01-22        # v2 2026-01-04; also published in Nature 645, 633-638 (2025)
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

DeepSeek's report on R1, the first open reasoning model with a detailed training recipe. They ran reinforcement learning on a base model (DeepSeek-V3-Base) with a simple reward: is the final answer right, and is it in the right format. With no human-written reasoning examples, the model (R1-Zero) learned to think longer, check its work and try other approaches. R1 then adds SFT and preference stages to fix readability and general helpfulness, and its outputs were used to train ("distill") smaller models.

## Key claims

- Reasoning can be trained with RL alone, without human reasoning examples. "Here we show that the reasoning abilities of LLMs can be incentivized through pure reinforcement learning (RL), obviating the need for human-labeled reasoning trajectories." (Abstract)
- Behaviors that emerged: reflection, verification, changing strategy. "The proposed RL framework facilitates the emergent development of advanced reasoning patterns, such as self-reflection, verification, and dynamic strategy adaptation." (Abstract)
- The reward only checks the final answer, not the reasoning. "The reward signal is solely based on the correctness of final predictions against ground-truth answers, without imposing constraints on the reasoning process itself." (§1 Introduction)
- The training template asks for reasoning inside think tags, then the answer. "The reasoning process and answer are enclosed within <think>...</think> and <answer>...</answer> tags" (Table 1)
- Rewards are rule-based: accuracy (e.g. a boxed math answer, or code that compiles and passes tests) plus format. "Our rule-based reward system mainly consists of two types of rewards: accuracy rewards and format rewards." (§2.2 Reward Design)
- They avoided learned reward models for reasoning because they get hacked. "neural reward models are susceptible to reward hacking during large-scale reinforcement learning." (§2.2)
- AIME 2024 accuracy rose from 15.6% to 77.9% during RL, and 86.7% with self-consistency (majority voting). "jumping from an initial 15.6% to 77.9%" (§2.3)
- R1-Zero's RL ran 10,400 steps (re-opened 2026-09-23 for the reasoning-models figure). "with training continuing for a total of 10,400 steps, corresponding to 1.6 training epochs." (§2.3, arXiv HTML version)
- Accuracy and response length both jump at step 8.2k, where the length limit was raised. "both the performance and response length of DeepSeek-R1-Zero exhibit a significant jump at the 8.2k step" (§2.3); "a maximum length of 32,768 tokens before the 8.2k step and 65,536 tokens afterward" (§2.3)
- Figure 1 has no per-step values in the text; its panels are (a) AIME accuracy during training and (b) "The average response length of DeepSeek-R1-Zero on the training set during the RL process." (Figure 1 caption)
- The model learned to think longer on its own. "DeepSeek-R1-Zero exhibits a steady increase in thinking time throughout training, driven solely by intrinsic adaptation rather than external modifications." (§2.3)
- Responses grew to hundreds or thousands of tokens. "generating hundreds to thousands of tokens to explore and improve its problem-solving strategies." (§2.3)
- The "aha moment": a sudden rise in the word "wait" as the model re-checks itself (Table 2 shows "Wait, wait. Wait. That’s an aha moment I can flag here."). (§2.3, Table 2)
- R1-Zero's problems: poor readability and mixing English and Chinese. "it faces challenges such as poor readability and language mixing" (§1)
- R1's full pipeline: thousands of "cold-start" examples → RL → rejection sampling and SFT on reasoning plus non-reasoning data → a second RL stage for helpfulness and harmlessness. "we collect thousands of cold-start data that exhibits a conversational, human-aligned thinking process." (§3)
- Model-based preference rewards got hacked with longer training, so they were only used in the last 400 of 1,700 steps. "We find that more training steps with the model based preference reward signal may lead to reward hacking" (§3.2)
- It spends fewer tokens on easy tasks and more on hard ones, but still overthinks simple questions. "instances of excessive reasoning—manifested as overthinking—are still observed in response to simpler questions." (§6 Limitations, Token efficiency)
- Few-shot prompting hurts R1. "Few-shot prompting consistently degrades its performance." (§6 Limitations, Prompting Engineering)
- They recommend zero-shot prompts. "we recommend users directly describe the problem and specify the output format using a zero-shot setting for optimal results." (§6)
- Pure RL needs a reliable reward; for tasks like writing it's hard to build one. "such dependable RMs are difficult to construct for certain tasks, such as writing." (§6, Reward Hacking)
- Distillation: small open models fine-tuned (SFT only) on 800,000 R1 samples got strong reasoning. "using a curated dataset comprising 800,000 samples generated with DeepSeek-R1." (Appendix F)
- Distilled base models and method (v1 HTML, §2.4): Qwen2.5-Math-1.5B, Qwen2.5-Math-7B, Qwen2.5-14B, Qwen2.5-32B, Llama-3.1-8B and Llama-3.3-70B-Instruct, SFT only. "For distilled models, we apply only SFT and do not include an RL stage, even though incorporating RL could substantially boost model performance." (§2.4, v1)
- Distillation vs RL on the same small model (v1 HTML, §4.1, Table 6): Qwen-32B-Base with over 10K steps of large-scale RL (DeepSeek-R1-Zero-Qwen-32B) scored 47.0% AIME 2024 pass@1; the same size distilled from R1 (DeepSeek-R1-Distill-Qwen-32B) scored 72.6%; QwQ-32B-Preview 50.0%. "First, distilling more powerful models into smaller ones yields excellent results, whereas smaller models relying on the large-scale RL mentioned in this paper require enormous computational power and may not even achieve the performance of distillation." (§4.1, v1)
- The limit of distillation. "Second, while distillation strategies are both economical and effective, advancing beyond the boundaries of intelligence may still require more powerful base models and larger-scale reinforcement learning." (§4.1, v1)
- Table 5 AIME 2024 pass@1 for the distilled models (v1): Qwen-1.5B 28.9, Qwen-7B 55.5, Qwen-14B 69.7, Qwen-32B 72.6, Llama-8B 50.4, Llama-70B 70.0; GPT-4o-0513 9.3, Claude-3.5-Sonnet-1022 16.0, o1-mini 63.6. (Table 5, v1)
- Example: DeepSeek-R1-Distill-Qwen-1.5B scored 28.9% on AIME 2024 vs 9.3% for GPT-4o-0513 and 16.0% for Claude-3.5-Sonnet-1022 (Table 15, pass@1).
- Training scale: R1-Zero took about 198 hours on 512 H800 GPUs (64×8); R1 about 80 more hours on the same. "we employed 64*8 H800 GPUs, and the process required approximately 198 hours." (Appendix B.4.4)

## Visuals worth redrawing

- Figure 1: (a) AIME 2024 accuracy rising over RL steps; (b) average response length rising over RL steps. The best picture of "the model learned to think longer". Redraw both lines on one timeline.
- Figure 2: the R1 multi-stage pipeline.
- Table 2: the "aha moment" transcript, shortened.

## My notes

- Primary and detailed, unlike OpenAI's o1 reports. Peer-reviewed in Nature (2025).
- R1-Zero skipped SFT entirely; R1 did not. Articles often blur them.
- The distilled-model numbers are from Jan 2025 comparisons with 2024 models; date them.
- "Few-shot hurts" agrees with OpenAI's advice to try zero-shot first on reasoning models (`openai-reasoning-best-practices`).
