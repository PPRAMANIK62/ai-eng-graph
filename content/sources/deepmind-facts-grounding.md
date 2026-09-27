---
id: deepmind-facts-grounding
title: "FACTS Grounding: A new benchmark for evaluating the factuality of large language models"
author: Google DeepMind FACTS team
url: https://deepmind.google/discover/blog/facts-grounding-a-new-benchmark-for-evaluating-the-factuality-of-large-language-models/
published: 2024-12-17
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

DeepMind's benchmark for grounding: can a model write a long answer about a document it's given, using only that document? Each example is a document (up to 32k tokens), a system instruction to use only the document, and a user request. Three LLM judges from three different companies grade each answer, first on whether it actually answers the request, then on whether every claim is supported by the document.

## Key claims

- What it measures: responses "not only factually accurate with respect to given inputs, but also sufficiently detailed to provide satisfactory answers to user queries." (intro)
- Dataset: 1,719 examples. "Each example comprises a document, a system instruction requiring the LLM to exclusively reference the provided document, and an accompanying user request." (FACTS Grounding dataset)
- Split: "a "public" set (860) and a "private" (859) held out set", to guard against contamination and leaderboard hacking. (dataset)
- Documents "up to a maximum of 32,000 tokens (roughly 20,000 words)", across finance, technology, retail, medicine and law; tasks are summarization, Q&A generation and rewriting. No creativity, math or complex reasoning tasks. (dataset)
- Three judges: "Gemini 1.5 Pro, GPT-4o, and Claude 3.5 Sonnet", chosen "to mitigate any potential bias of a judge giving higher scores to the responses produced by a member of its own model family." (Collective judgement)
- Two phases. Responses are "disqualified if they don’t sufficiently address the user’s request", then judged accurate "if they are fully grounded in information contained in the provided document, with no hallucinations." (Collective judgement)
- A factually correct answer that doesn't address the request fails. (figure caption under judging)
- Final score: "the average of all judge models’ scores across all examples." (Collective judgement)

## Visuals worth redrawing

- The two-phase judging flow (eligibility, then grounding, three judges, average). Simple enough to redraw as boxes.

## My notes

- The eligibility phase is the interesting design choice: it stops a model from scoring well by saying very little. Same idea as ALCE scoring correctness next to citation quality.
- The leaderboard numbers moved on; in December 2025 this became "Grounding Benchmark - v2" inside the FACTS Benchmark Suite (`deepmind-facts-benchmark-suite`). Don't quote 2024 leaderboard scores.
- The page now lives at deepmind.google/blog/...; the /discover/blog/ URL redirects.
