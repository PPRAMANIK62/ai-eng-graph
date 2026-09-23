---
id: wei-chain-of-thought
title: Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
author: Jason Wei, Xuezhi Wang, Dale Schuurmans, Maarten Bosma, Brian Ichter, Fei Xia, Ed Chi, Quoc Le, Denny Zhou (Google)
url: https://arxiv.org/abs/2201.11903
published: 2022-01-28        # v6 2023-01-10; NeurIPS 2022
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The paper that named chain-of-thought prompting. Instead of few-shot examples that go straight from question to answer, each example shows the working ("Roger started with 5 balls. 2 cans of 3 tennis balls each is 6..."). Large models then write out their own steps before answering, and get much better at math word problems and other multi-step tasks. The effect only appeared in models around 100B parameters; smaller ones wrote fluent nonsense.

## Key claims

- Definition: a chain of thought is a series of intermediate reasoning steps. "We explore how generating a chain of thought -- a series of intermediate reasoning steps -- significantly improves the ability of large language models to perform complex reasoning." (Abstract)
- The method: put worked reasoning into the few-shot examples. "a few chain of thought demonstrations are provided as exemplars in prompting." (Abstract)
- The running example (Figure 1): "Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many tennis balls does he have now?" Standard exemplar: "A: The answer is 11." CoT exemplar: "A: Roger started with 5 balls. 2 cans of 3 tennis balls each is 6 tennis balls. 5 + 6 = 11. The answer is 11." (Figure 1)
- Figure 1's test question and outputs (re-opened 2026-09-23 from the arXiv HTML figure image, for the chain-of-thought figure). Question: "Q: The cafeteria had 23 apples. If they used 20 to make lunch and bought 6 more, how many apples do they have?" Standard output: "A: The answer is 27." (marked wrong). CoT output: "A: The cafeteria had 23 apples originally. They used 20 to make lunch. So they had 23 - 20 = 3. They bought 6 more apples, so they have 3 + 6 = 9. The answer is 9." (marked right) (Figure 1)
- Headline: eight CoT examples gave a 540B model state of the art on GSM8K. "prompting a 540B-parameter language model with just eight chain of thought exemplars achieves state of the art accuracy on the GSM8K benchmark of math word problems, surpassing even finetuned GPT-3 with a verifier." (Abstract)
- PaLM 540B on GSM8K: 17.9% with standard prompting, 56.9% with chain of thought. (Table 2 in the appendix, arithmetic reasoning results, PaLM 540B row, GSM8K column: standard 17.9, chain of thought 56.9 (+39.0))
- It only works at large scale. "chain-of-thought prompting does not positively impact performance for small models, and only yields performance gains when used with models of ∼100B parameters." (§3.2 Results)
- Small models write fluent but wrong reasoning. "models of smaller scale produced fluent but illogical chains of thought, leading to lower performance than standard prompting." (§3.2)
- Why it might help: more steps means more computation for harder problems. "additional computation can be allocated to problems that require more reasoning steps." (§2, list of properties)
- It gives a readable window into the model, with a caveat. "a chain of thought provides an interpretable window into the behavior of the model" (§2), "(although fully characterizing a model’s computations that support an answer remains an open question)" (§2)
- Ablation: just emitting dots (extra tokens with no content) didn't help. "This variant performs about the same as the baseline, which suggests that variable computation by itself is not the reason for the success" (§3.3 Ablation study)
- Ablation: writing the reasoning after the answer didn't help, so the model uses the reasoning it writes first. "the sequential reasoning embodied in the chain of thought is useful for reasons beyond just activating knowledge." (§3.3)
- Limits: no guarantee the reasoning is right, and it's unclear whether it's real reasoning. "there is no guarantee of correct reasoning paths, which can lead to both correct and incorrect answers" (§6 Discussion)

## Visuals worth redrawing

- Figure 1: standard prompting vs chain-of-thought prompting, side by side, with the tennis-ball exemplar and a cafeteria-apples test question (wrong answer vs right answer). The main visual for the article. Redraw with the tennis-ball example.
- Figure 4: GSM8K solve rate vs model size for standard and CoT prompting; the CoT line only crosses above around 100B. Shows "emergent with scale".

## My notes

- 2022, with LaMDA, GPT-3 (InstructGPT variants), Codex, PaLM. Today's models are instruction-tuned and often reason unprompted, so the size of the gain is much smaller now (`meincke-decreasing-value-cot`).
- The "reasoning after the answer" ablation is the clearest argument for *why order matters*: the model can only use tokens it has already written.
- Turpin et al. (`turpin-unfaithful-cot`) push on the "interpretable window" claim: the written reasoning can hide the real cause.
