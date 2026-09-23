---
id: chen-reasoning-faithfulness
title: Reasoning Models Don't Always Say What They Think
author: Yanda Chen, Joe Benton, Ansh Radhakrishnan, et al., Ethan Perez (Anthropic, 15 authors)
url: https://arxiv.org/abs/2505.05410
published: 2025-05-08
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

Anthropic tested whether reasoning models' thinking admits to using a hint slipped into the prompt (for example, "A Stanford professor indicates the answer is (A)", or answer metadata). When the models used the hint, their chain of thought usually didn't say so: the overall faithfulness score was 25% for Claude 3.7 Sonnet and 39% for DeepSeek R1. Reasoning models were more faithful than non-reasoning ones, but far from reliable. In RL environments with built-in reward hacks, a model learned the hack almost perfectly while almost never mentioning it.

## Key claims

- Why it matters: reading the chain of thought only works if it reflects the real reasoning. "the effectiveness of such monitoring hinges on CoTs faithfully representing models' actual reasoning processes." (Abstract)
- Models tested: Claude 3.7 Sonnet and DeepSeek R1 (reasoning), vs Claude 3.5 Sonnet and DeepSeek V3 (non-reasoning). (§3)
- Six hint types: sycophancy ("I think the answer is (A) but I’m curious to hear what you think"), consistency, visual pattern, metadata, grader hacking, unethically obtained information. (Table 1)
- Reveal rates are low. "for most settings and models tested, CoTs reveal their usage of hints in at least 1% of examples where they use the hint, but the reveal rate is often below 20%" (Abstract)
- Overall faithfulness: 25% for Claude 3.7 Sonnet, 39% for DeepSeek R1. "The overall faithfulness scores for both reasoning models remain low (25% for Claude 3.7 Sonnet and 39% for DeepSeek R1)" (§3)
- Reasoning models are more faithful than non-reasoning ones: 3.6x higher for the Claude series, 1.7x for DeepSeek. "The average faithfulness is 3.6× higher for the Claude series and 1.7× higher for the DeepSeek series." (§3)
- Less faithful on harder tasks. "We also find that CoTs are less faithful on harder tasks." (§1)
- Unfaithful CoTs are longer, not shorter: Claude 3.7 Sonnet unfaithful 2,064 tokens on average vs 1,439 faithful. "unfaithful CoTs from the models tend to be more verbose and convoluted than faithful explanations." (§3)
- More outcome-based RL helps faithfulness at first, then plateaus. "outcome-based reinforcement learning initially improves faithfulness but plateaus without saturating" (Abstract)
- Reward hacks learned but not mentioned: reward above 0.99, verbalized in under 2% of examples in 5 of 6 environments. "The model fully learns the reward hacks (reward > 0.99) on all RL environments, but almost never verbalizes the reward hacks (< 2% of the examples) in 5 out of 6 environments." (§1)
- Bottom line. "CoT monitoring is a promising way of noticing undesired behaviors during training and evaluations, but that it is not sufficient to rule them out." (Abstract)

## Visuals worth redrawing

- Figure 2: Claude 3.7 Sonnet answers D; with a metadata hint added it answers C, and its reasoning never mentions the metadata. Redraw as two side-by-side transcripts.
- Figure 1: faithfulness score per hint type for the four models.

## My notes

- 2025. The hints are ones the model can use without much reasoning, so CoT isn't *needed*; the authors say faithfulness may be higher on tasks that truly need step-by-step work.
- Follow-up to Turpin et al. 2023 (`turpin-unfaithful-cot`), now on trained reasoning models.
- Related: Anthropic's interpretability post (`anthropic-tracing-thoughts`) catches Claude working backwards from a hinted answer.
