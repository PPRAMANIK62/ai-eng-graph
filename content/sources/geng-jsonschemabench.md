---
id: geng-jsonschemabench
title: "JSONSchemaBench: A Rigorous Benchmark of Structured Outputs for Language Models"
author: Saibo Geng, Hudson Cooper, Michał Moskal, Samuel Jenkins, Julian Berman, Nathan Ranchin, Robert West, Eric Horvitz, Harsha Nori
url: https://arxiv.org/abs/2501.10868
published: 2025-01-18
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

A benchmark of about 10,000 real JSON schemas (9,558 after cleaning) used to compare constrained decoding engines: Guidance, Outlines, llama.cpp, XGrammar, OpenAI and Gemini. It measures speed (compile time, time per token), coverage (how many schemas an engine accepts and then actually obeys), and quality on three reasoning tasks. Guidance, built by several of the authors, comes out on top on most measures. Read in full (v3, 2025-02-27) in the HTML version.

## Key claims

- The basic loop: at each step, mask out tokens that break the constraint given the prefix, then sample. "Constrained decoding intervenes in the decoding process of LMs by masking out invalid tokens based on given constraints and prefix tokens." (1 Introduction)
- Two costs of a naive setup: a mask per step and a one-time grammar compile. "Naïve implementations of constrained decoding add overhead to the standard LM inference process, including a per-step mask computation and an optional one-time grammar compilation." (4 Efficiency)
- Known ways to hide the overhead. "mask computation can run in parallel with the LM’s forward pass, and grammar compilation can be performed concurrently with pre-filling computations" (4 Efficiency)
- Setup for speed: Llama-3.1-8B-Instruct, llama.cpp backend, one A100, batch size 1; XGrammar tested separately on Hugging Face Transformers. (4.1)
- Speed numbers (Table 2, llama.cpp backend): LM only 15.3 to 16.7 ms per output token; Guidance 6.4 to 9.5 ms with about 0 s compile; llama.cpp 27 to 30 ms with 0.05 to 0.06 s compile; Outlines 30 to 47 ms, with 3.48 to 8.05 s grammar compile time. (4.1)
- Guidance beats unconstrained speed by skipping steps. "Guidance achieves even higher efficiency, which it accomplishes by fast-forwarding" (Time per output token)
- Outlines is slow to compile. "Outlines, which converts JSON schemas into regular-expression based constraints, has significantly higher compilation time." (Grammar compilation time)
- On the Transformers backend (Table 3): XGrammar 0.12 to 0.30 s compile, about 65 to 67 ms per token; Guidance 0.01 s compile, 36 to 44 ms per token. (4.1)
- Coverage terms: declared coverage (engine accepts the schema), empirical coverage (outputs actually valid), compliance rate = empirical / declared. (5)
- Hosted APIs accept fewer schemas but obey the ones they accept. "While closed-source implementations have low empirical coverage, they have very high compliance rates, indicating that their providers have taken a more conservative strategy, implementing only a subset of JSON Schema features that they can reliably support." (5.2)
- Example (Table 4, GitHub Easy): OpenAI declared 0.30, empirical 0.29, compliance 0.97; Gemini declared 0.08; Guidance declared 0.90, empirical 0.86. Unconstrained model ("LM only") empirical 0.65. (5.2)
- Over- vs under-constrained: an engine can block valid outputs, or let invalid ones through. "under-constrained engines cannot guarantee that all responses will be valid, often necessitating additional post-processing or retry logic." (5.3)
- On the official JSON Schema Test Suite, XGrammar had the most under-constrained failures (38 categories vs Guidance 1). "XGrammar minimizes compilation errors but shows the highest number of under-constrained failures, indicating a trade-off favoring permissiveness." (Failure Analysis, Table 6)
- Why quality could suffer in principle: tokenization ambiguity and distribution shift. Their toy case: a model that wants to write "89,000" is blocked from the comma "and generate '890000' instead." (6 Quality)
- They record the rebuttal's view: "Kurt [2024b] argued that the performance decline observed in previous studies [Tam et al., 2024] comes from inadequate prompting, insufficient contextual information, and poorly crafted schemas." (6 Quality)
- Quality setup: Llama-3.1-8B-Instruct, the three tasks from Tam et al. and Kurt, JSON with "reasoning" then "answer" fields, following Kurt's prompts. (6.1)
- Result. "The results in Table 8 show that the constrained decoding, regardless of the framework, achieves higher performance than the unconstrained setting." (6.2)
- Table 8: Last Letters LM only 50.7%, Guidance 54.0%, Outlines 53.3%; Shuffle Objects 52.6% vs Guidance 55.9%; GSM8K 80.1% vs XGrammar 83.7%, Guidance 83.8%. Llamacpp ties LM only on Shuffle Objects (52.6%), so "every engine beat" is really "matched or beat". Guidance about 3 points over LM only on every task, which they put down to token healing. (6.2)
- Some schema features are very slow for Outlines. "JSON Schema features like ‘minItems‘, ‘maxItems‘, ‘enum‘, and ‘Array’, while supported, often take 40 seconds to 10 minutes for Outlines to process." (5.2, Compliance Rate)
- Coverage drops on harder schema sets for everyone; the unconstrained model shows "significant performance drops on harder datasets". (5.2, Empirical Coverage)

## Visuals worth redrawing

- Table 8 as grouped bars (unconstrained vs each engine, three tasks).
- Table 2 as a compile-time vs per-token-time comparison.

## My notes

- Conflict of interest: Moskal, Cooper, Jenkins, Nori, Horvitz are at Microsoft, where Guidance and llguidance are built; Guidance wins most tables. The llguidance README lists this benchmark as its own release.
- Quality test follows the rebuttal's prompts (reasoning field first), so it tests "structure done well", not the setups in Let Me Speak Freely.
- Speed tests are batch size 1 on one model. Hosted APIs weren't timed.
