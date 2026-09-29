---
id: huang-cannot-self-correct
title: Large Language Models Cannot Self-Correct Reasoning Yet
author: Jie Huang, Xinyun Chen, Swaroop Mishra, Huaixiu Steven Zheng, Adams Wei Yu, Xinying Song, Denny Zhou (Google DeepMind, UIUC)
url: https://arxiv.org/abs/2310.01798
published: 2023-10-03          # v2 2024-03-14, ICLR 2024
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Tests "intrinsic self-correction": the model reviews and revises its own answer with no outside signal. On reasoning benchmarks, accuracy stayed flat or dropped, sometimes badly, because the model changes right answers to wrong ones about as often as the reverse. Earlier positive results had used the correct answer to decide when to stop, had compared against baselines with fewer calls, or had put task requirements only in the feedback prompt. Self-correction does help when there is real external feedback, such as code execution results or tools.

## Key claims

- Main finding. "LLMs struggle to self-correct their responses without external feedback, and at times, their performance even degrades after self-correction." (Abstract)
- Earlier gains used oracle labels: "the improvements in these studies result from using oracle labels to guide the self-correction process, and the improvements vanish when oracle labels are not available." (1 Introduction)
- With oracle labels (stop when correct), GPT-3.5: GSM8K 75.9 → 84.3, CommonSenseQA 75.8 → 89.7. (Table 2)
- Without them (intrinsic), GPT-3.5 over two rounds: GSM8K 75.9 → 75.1 → 74.7; CommonSenseQA 75.8 → 38.1 → 41.8. GPT-4: GSM8K 95.5 → 91.5 → 89.0; CommonSenseQA 82.0 → 79.5 → 80.0; HotpotQA 49.0 → 49.0 → 43.0. Two rounds cost 5 calls vs 1. (Table 3)
- Llama-2-70b-chat: GSM8K 62.0 → 43.5 → 36.5. (Table 4)
- Why: "The fundamental issue is that LLMs cannot properly judge the correctness of their reasoning." On GSM8K GPT-3.5 kept its answer 74.7% of the time, and when it changed, it was more likely to turn a right answer wrong than the reverse. (3.3)
- CommonSenseQA: "false answer options in CommonSenseQA often appear somewhat relevant to the question, and using the self-correction prompt might bias the model to choose another option, leading to a high “correct ⇒ incorrect’’ ratio." GPT-4 and GPT-4-Turbo were more likely to keep their first answer. (3.3)
- The multi-agent debate tested used several instances of one ChatGPT model (3 agents, 2 rounds). (4)
- Debate vs voting at equal cost: with 9 responses, multi-agent debate scored 83.0 on GSM8K vs 88.2 for self-consistency (majority vote). (4, Table 7)
- Prompt design: in Self-Refine's constrained generation task, simply telling the first prompt to include all concepts scored 81.8, higher than self-correction's 75.1 starting from it. "equal effort should be invested in designing the prompts for initial response generation and for self-correction". (5, Table 8; 6)
- Where it does work: "when valid external feedback is available, it is beneficial to leverage it properly", e.g. code execution results, where "the code executor serves as the perfect verifier". (6 Conclusion)
- Compare at equal cost: "strong baselines that leverage multiple model responses, like self-consistency, should be used for comparison." (6)
- Scope: reasoning tasks only; self-correction may help with style or safety. (7 Limitations)

## Visuals worth redrawing

- Table 3 as a small chart: accuracy by round for GPT-3.5 and GPT-4 on GSM8K and CommonSenseQA, next to the oracle-label result.

## My notes

- 2023–2024 models. Anthropic's 2026 docs say Claude Opus 5 "verifies its own work well" (`anthropic-prompting-best-practices`); no numbers given, so the question is open for current models.
