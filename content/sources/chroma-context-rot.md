---
id: chroma-context-rot
title: "Context Rot: How Increasing Input Tokens Impacts LLM Performance"
author: Kelly Hong, Anton Troynikov, Jeff Huber (Chroma)
url: https://www.trychroma.com/research/context-rot
published: 2025-07-14
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

A research report from Chroma that tested 18 models on tasks where only the input length changes. Performance got less reliable as input grew, even on simple tasks, which undercuts the idea that a model treats every token in its window equally. It also explains why the popular needle-in-a-haystack test makes long context look better than it is.

## Key claims

- 18 models tested, including GPT-4.1, Claude 4, Gemini 2.5 and Qwen3. "18 LLMs, including the state-of-the-art GPT-4.1, Claude 4, Gemini 2.5, and Qwen3 models" (Introduction)
- Results get less reliable as input grows. "Their performance grows increasingly unreliable as input length grows" (Introduction)
- Models don't use their context uniformly. "models do not use their context uniformly" (Introduction)
- The assumption they test against. "the model should handle the 10,000th token just as reliably as the 100th" (Introduction)
- Needle-in-a-haystack is a simple lookup, mostly word matching. "NIAH is fundamentally a simple retrieval task" (Needle in a Haystack Extension)
- It mostly tests direct word matching, unlike real tasks. "typically assesses direct lexical matching, which may not be representative of flexible, semantically oriented tasks" (Needle in a Haystack Extension)
- One similar-looking but wrong passage (a distractor) already hurts; four hurt more. "Even a single distractor reduces performance relative to the baseline (needle only), and adding four distractors compounds this degradation further." (Impact of Distractors)
- Distractor damage grows with input length. Described as a "non-uniform impact" that amplifies as input length grows. (Impact of Distractors)
- Surprising: a shuffled haystack gave better results than a coherent one. "Shuffling the haystack and removing local coherence consistently improves performance." (Haystack Structure)
- Even copying a list of repeated words with one odd word inserted gets worse with length. "performance consistently degrades" (Repeated Words)
- Scale of the study: 194,480 LLM calls. (Needle in a Haystack Extension)
- How information is presented matters, not just whether it's there. "What matters more is how that information is presented" (Conclusion)
- No position effect on their needle task. "Testing across 11 needle positions, we find no notable variation in performance for this specific NIAH task." (Needle-Question Similarity, Results; added 2026-09-27)
- But on the repeated-words task position did matter. "Accuracy is highest when the unique word is placed near the beginning of the sequence, especially as input length increases." (Repeated Words; added 2026-09-27)
- Less similar question and answer, faster decline. "performance degrades more quickly in input length with lower similarity needle-question pairs." (Needle-Question Similarity; added 2026-09-27)
- Focused vs full prompts on LongMemEval: about 300 tokens of relevant history vs about 113k tokens of full history. "Across all models, we see significantly higher performance on focused prompts compared to full prompts." (LongMemEval; added 2026-09-27)

## Visuals worth redrawing

- Line charts of accuracy vs input length per model family, falling as length grows. Redraw one simplified curve (accuracy down, tokens up) for the context-window article, credited "adapted from Chroma, 2025".

## My notes

- Tested 2025 models (GPT-4.1, Claude 4, Gemini 2.5). Newer models may do better; say the finding is from 2025 models.
- Their own experiments, so primary for the finding. Chroma sells a retrieval database, which gives them a reason to show long context isn't enough. The finding matches RULER (2024) and Anthropic's own docs, so it's not only their angle.
