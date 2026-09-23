---
id: zhao-calibrate-before-use
title: "Calibrate Before Use: Improving Few-Shot Performance of Language Models"
author: Tony Z. Zhao, Eric Wallace, Shi Feng, Dan Klein, Sameer Singh
url: https://arxiv.org/abs/2102.09690
published: 2021-02-19        # v1; v2 2021-06-10; ICML 2021
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

Shows that few-shot prompting on GPT-3 was fragile: which examples you pick, and even their order, could swing accuracy from near chance to near state of the art. It traces this to three biases: the model favors labels that appear often in the prompt, labels near the end, and tokens common in its training data. It proposes a fix ("contextual calibration") that rebalances the model's answers.

## Key claims

- Headline. "the choice of prompt format, training examples, and even the order of the training examples can cause accuracy to vary from near chance to near state-of-the-art." (Abstract)
- Order alone. On SST-2 sentiment (4-shot, GPT-3 2.7B), "varying the permutation of the training examples can cause accuracy to go from near chance (54.3%) to near state-of-the-art (93.4%)." (§3)
- Order can matter as much as choice. "varying the permutation can be as important, or even more important, than which training examples are chosen." (§3)
- More examples don't fix it. "Adding more training examples into the prompt does not necessarily reduce the variance in accuracy." "The variance remains high even when we use 16 training examples." (§3)
- Bigger models don't fix it either. "The variance in accuracy can also remain high when using larger models" (§3)
- Majority label bias. "GPT-3 is biased towards answers that are frequent in the prompt." With imbalanced examples, it heavily predicts the more common class. (§4)
- On a fact-retrieval task (4-shot LAMA), 50.2% of predictions repeated one of the four example answers, against a correct repeat rate of 24.7%. (§4)
- Recency bias. "the tendency to repeat answers that appear towards the end of the prompt." Examples ordered P P P N led to nearly 90% Negative predictions even though 3 of 4 examples were Positive. (§4)
- Common token bias. "GPT-3 is biased towards outputting tokens that are common in its pretraining distribution" e.g. predicting "America" when the answer is a rare entity. (§4)
- The fix. Ask the model for its answer on a content-free input like "N/A", then adjust so that input gets equal odds for every label. This "substantially improves GPT-3 and GPT-2's average accuracy (up to 30.0% absolute) and reduces variance across different choices of the prompt." (Abstract)

## Visuals worth redrawing

- Figure 2: SST-2 accuracy for different sets of 4 examples, each set shown under all its orderings, spread from ~54% to ~93%. Redraw as dot strips per example set. Shows order sensitivity at a glance.
- Figure 4: bars for prompts like P P N N, N N P P, P P P N showing prediction skew toward the last or most common label.

## My notes

- 2021, GPT-3 and GPT-2 base models, before instruction tuning and RLHF. Modern chat models are likely less fragile, but I have no source that measures by how much. Say "on GPT-3-era models".
- Calibration needs access to label probabilities, which many 2026 APIs no longer give (see the logprobs/sampling nodes). The biases are the lasting lesson, not the fix.
- `agarwal-many-shot-icl` found order still matters at 50 examples on Gemini 1.5 Pro, so this didn't fully go away with scale.
