---
id: wang-self-consistency
title: Self-Consistency Improves Chain of Thought Reasoning in Language Models
author: Xuezhi Wang, Jason Wei, Dale Schuurmans, Quoc Le, Ed Chi, Sharan Narang, Aakanksha Chowdhery, Denny Zhou (Google)
url: https://arxiv.org/abs/2203.11171
published: 2022-03-21          # v4, camera-ready for ICLR 2023, 2023-03-07
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Instead of taking one greedy chain-of-thought answer, sample many reasoning paths from the same prompt and take the answer that comes up most often. Big gains on math and commonsense benchmarks with 2022-era models. It only works when answers can be compared exactly (a number, a multiple-choice letter), and it costs one call per sample. Agreement among samples also works as a confidence signal.

## Key claims

- The method. It "first samples a diverse set of reasoning paths instead of only taking the greedy one, and then selects the most consistent answer by marginalizing out the sampled reasoning paths." (Abstract)
- The intuition: "a complex reasoning problem typically admits multiple different ways of thinking leading to its unique correct answer." (Abstract)
- Gains over greedy chain of thought: "GSM8K (+17.9%), SVAMP (+11.0%), AQuA (+12.2%), StrategyQA (+6.4%) and ARC-challenge (+3.9%)." (Abstract)
- Aggregation is a majority vote over final answers. (Section 2)
- Main results used 40 sampled outputs per question, averaged over 10 runs. (3.2 Main Results)
- Needs a fixed answer set. "self-consistency can be applied only to problems where the final answer is from a fixed answer set", though it could extend to open text "if a good metric of consistency can be defined between multiple generations". (Section 2)
- Cost and how many samples: "One limitation of self-consistency is that it incurs more computation cost. In practice people can try a small number of paths (e.g., 5 or 10) as a starting point to realize most of the gains while not incurring too much cost, as in most cases the performance saturates quickly". (5 Conclusion and Discussion)
- Agreement as confidence: consistency "is highly correlated with accuracy", so "one can use low consistency as an indicator that the model has low confidence". (3.5, discussion of Figure 8)

## Visuals worth redrawing

- Figure 1: one prompt, several sampled reasoning paths, different final answers, majority vote.
- Figure 2: accuracy vs number of sampled paths, rising and flattening.

## My notes

- Models tested (LaMDA-137B, PaLM-540B, GPT-3, UL2) are old. Reasoning models in 2026 already think at length inside one call; how much voting adds on top isn't measured here.
- Contrast with `chen-more-llm-calls`: accuracy can rise then fall as votes grow.
