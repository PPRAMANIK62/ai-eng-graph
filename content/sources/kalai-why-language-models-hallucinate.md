---
id: kalai-why-language-models-hallucinate
title: Why Language Models Hallucinate
author: Adam Tauman Kalai, Ofir Nachum, Santosh Vempala, Edwin Zhang (OpenAI, Georgia Tech)
url: https://arxiv.org/abs/2509.04664
published: 2025-09-04
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

An OpenAI paper with a statistical account of hallucination in two parts. Pretraining: even with perfect training data, a model fit to the distribution of text will make errors on facts that have no pattern, like birthdays, and the error rate is tied to how many facts appear only once in the data. Post-training: hallucinations survive because most benchmarks grade right/wrong with no credit for "I don't know", so a model that always guesses scores better than one that admits uncertainty. The proposed fix is to change how mainstream benchmarks are scored. Read via the arXiv HTML version (https://arxiv.org/html/2509.04664).

## Key claims

- The one-paragraph thesis. "We argue that language models hallucinate because the training and evaluation procedures reward guessing over acknowledging uncertainty" (abstract)
- Hallucinations aren't mysterious; they're classification errors. "Hallucinations need not be mysterious—they originate simply as errors in binary classification." (abstract, HTML version)
- Definition used. "Language models are known to produce overconfident, plausible falsehoods, which diminish their utility and trustworthiness." (1 Introduction)
- Example: asked for Kalai's birthday "If you know, just respond with DD-MM", DeepSeek-V3 gave three different wrong dates over three attempts ("03-07", "15-06", "01-01"); accessed 2025-05-11. "even though a response was requested only if known." (1 Introduction, footnote 1)
- Example: asked for the title of Kalai's dissertation, ChatGPT (GPT-4o), DeepSeek and Llama each gave a different, confident, wrong title and year; none searched the web (models accessed 2025-05-09). "None generated the correct title or year" (Table 1 and footnote 4)
- Example of a hallucination that contradicts the prompt: counting the Ds in DEEPSEEK, DeepSeek-V3 answered 2 or 3 over ten trials; Meta AI and Claude 3.7 Sonnet gave answers as high as 6 and 7. (1 Introduction)
- Errors happen even with clean data. "even if the training data were error-free, the objectives optimized during language model training would lead to errors being generated." (1 Introduction)
- Not special to next-word prediction or transformers. "the analysis does not rely on properties of next-word prediction or Transformer-based neural networks." (1 Introduction)
- The singleton rule of thumb. "if 20% of birthday facts appear exactly once in the pretraining data, then one expects base models to hallucinate on at least 20% of birthday facts." (1.1 Errors caused by pretraining)
- The exam analogy. "When uncertain, students may guess on multiple-choice exams and even bluff on written exams, submitting plausible answers in which they have little confidence." (1.2 Why hallucinations survive post-training)
- Bluffs are specific. "Bluffs are often overconfident and specific, such as “September 30” rather than “Sometime in autumn” for a question about a date." (1.2)
- Always-guess beats honest under 0-1 scoring: a model that never signals uncertainty (B) outscores one that does and never hallucinates (A). "Model B will outperform A under 0-1 scoring, the basis of most current benchmarks." (1.2)
- Core result for post-training. "Under binary grading, abstaining is strictly sub-optimal." (4.1 How evaluations reinforce hallucination)
- Of ten popular benchmarks surveyed (GPQA, MMLU-Pro, IFEval, Omni-MATH, WildBench, BBH, MATH L5, MuSR, SWE-bench, HLE), nine use binary grading with no credit for IDK; WildBench gives partial credit. (Table 2)
- Base models are often calibrated; post-trained ones may drift. "base models are often found to be calibrated, in contrast to post-trained models which may deviate from cross-entropy in favor of reinforcement learning." (3.x, discussion around Figure 2, GPT-4 calibration before/after RL)
- The fix: state a confidence target in the instructions, e.g. "Answer only if you are > t confident, since mistakes are penalized t/(1−t) points". At t = 0.9 a wrong answer costs 9 points. (4.2 Explicit confidence targets)
- Why more hallucination benchmarks won't fix it: the many primary benchmarks still penalize abstaining. "The numerous primary evaluations must be adjusted to stop penalizing abstentions when uncertain." (1.2)

## Visuals worth redrawing

- A scoring table for one uncertain question: guess (right with probability p → 1, wrong → 0) vs "I don't know" (0) under binary grading; then the same with a penalty for wrong answers. Our own diagram built from 1.2 and 4.2.
- Figure 1 (Is-It-Valid): three panels, spelling (easy to separate), a poor model, and arbitrary facts with no pattern. Redraw simplified.

## My notes

- Submitted 2025-09-04. OpenAI's blog post version (openai.com) returned 403 per `_candidates.md`; this note uses the arXiv HTML.
- 4.2 lists "t = 0.75 (penalty 2)", but t/(1−t) at 0.75 is 3. Looks like a typo in the paper; use the 0.5 (penalty 1) or 0.9 (penalty 9) examples only.
- Framed as the statistical "why". Pairs with the mechanism view in `anthropic-tracing-thoughts` (a known-entity feature that wrongly switches off the default "can't answer") and the data view in `weng-extrinsic-hallucinations`. They don't contradict each other.
- Its "not tied to next-word prediction" point is worth keeping in the article: the loop makes the model always produce something, but the deeper cause is fitting a distribution plus grading that rewards guesses.
