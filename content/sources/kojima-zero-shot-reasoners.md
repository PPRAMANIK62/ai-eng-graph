---
id: kojima-zero-shot-reasoners
title: Large Language Models are Zero-Shot Reasoners
author: Takeshi Kojima, Shixiang Shane Gu, Machel Reid, Yutaka Matsuo, Yusuke Iwasawa
url: https://arxiv.org/abs/2205.11916
published: 2022-05-24        # v4 2023-01-29; NeurIPS 2022
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The "Let's think step by step" paper. You don't need worked examples to get chain-of-thought reasoning: adding that one sentence before the answer makes a large model write out its reasoning, and accuracy jumps on math and logic tasks. The paper uses two calls, one to generate the reasoning and a second to pull out the final answer, and tests how much the exact wording matters.

## Key claims

- One phrase, no examples. "we show that LLMs are decent zero-shot reasoners by simply adding "Let's think step by step" before each answer." (Abstract)
- Big gains on 2022 models: MultiArith 17.7% → 78.7%, GSM8K 10.4% → 40.7% with text-davinci-002. "increasing the accuracy on MultiArith from 17.7% to 78.7% and GSM8K from 10.4% to 40.7% with large InstructGPT model (text-davinci-002)" (Abstract)
- Similar gains on the 540B PaLM. "as well as similar magnitudes of improvements with another off-the-shelf large model, 540B parameter PaLM." (Abstract)
- Worked examples (few-shot CoT) still do better than the zero-shot phrase. "While our Zero-shot-CoT underperforms Few-shot-CoT with carefully-crafted and task-specific step-by-step examples" (§4.1)
- The juggler example (Figure 1): "A juggler can juggle 16 balls. Half of the balls are golf balls, and half of the golf balls are blue. How many blue golf balls are there?" Direct zero-shot answers 8 (wrong); with "Let's think step by step" the model works out 16/2 = 8 golf balls, 8/2 = 4 blue. (Figure 1)
- Two-stage prompting: first extract the reasoning, then call again with "Therefore, the answer (arabic numerals) is" to extract the answer. (§3.1 Two-stage prompting, Figure 2)
- Wording matters. On MultiArith: "Let's think step by step." 78.7%, "Let's think about this logically." 74.5%, "Let's think" 57.5%, misleading "Don't think. Just feel." 18.8%, irrelevant "Abrakadabra!" 15.5%, no phrase 17.7%. (Table 4)
- No gain on commonsense tasks. "In commonsense reasoning tasks, Zero-shot-CoT does not provide performance gains." (§4.1)

## Visuals worth redrawing

- Figure 1: four panels (few-shot, few-shot CoT, zero-shot, zero-shot CoT) on the juggler question. A compact way to show all four prompt styles at once.
- Table 4 as a small bar chart: the prompt wording vs accuracy. Shows reasoning-inviting phrases help and random phrases don't.

## My notes

- 2022, text-davinci-002 and PaLM. The 17.7% → 78.7% jump is a historical number; current models reason unprompted on many tasks.
- Clear evidence that the model needs to *write* the steps: phrases that don't invite reasoning give baseline accuracy.
