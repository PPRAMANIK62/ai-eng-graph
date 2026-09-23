---
id: nguyen-min-p-sampling
title: "Turning Up the Heat: Min-p Sampling for Creative and Coherent LLM Outputs"
author: Minh Nguyen, Andrew Baker, Clement Neo, Allen Roush, Andreas Kirsch, Ravid Shwartz-Ziv
url: https://arxiv.org/abs/2407.01082
published: 2025-11-20         # v8; v1 2024-07-01; ICLR 2025 oral
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

Argues that top-p breaks down at high temperature and proposes min-p: keep only tokens whose probability is at least some fraction of the top token's probability. When the model is confident the cut is tight; when it's unsure, more tokens stay in. Only the abstract page was read.

## Key claims

- The setting. "Large Language Models (LLMs) generate text by sampling the next token from a probability distribution over the vocabulary at each decoding step." (Abstract)
- Top-p's weakness at high temperature. "Popular sampling methods like top-p (nucleus sampling) often struggle to balance quality and diversity, especially at higher temperatures which lead to incoherent or repetitive outputs." (Abstract)
- Min-p scales the cutoff by the top token's probability. "a dynamic truncation method that adjusts the sampling threshold based on the model's confidence by using the top token's probability as a scaling factor." (Abstract)
- Tested on GPQA, GSM8K and AlpacaEval Creative Writing, Mistral and Llama 3, 1B to 123B parameters; better quality and diversity "especially at higher temperatures." (Abstract)
- Human raters preferred it. "Human evaluations further show a clear preference for min-p sampling, in both text quality and creativity." (Abstract)
- Adopted by open-source tools. "Min-p sampling has been adopted by popular open-source LLM frameworks, including Hugging Face Transformers, VLLM, and many others" (Abstract)
- Oral presentation at ICLR 2025. (Comments)

## Visuals worth redrawing

- None from the abstract. Our own: the same peaked and flat distributions as in the top-p figure, with a min-p cutoff line drawn at a fraction of the top bar.

## My notes

- Only the abstract read; the body's exact numbers weren't checked. Keep claims to the abstract.
- Open models only in practice: closed APIs don't expose min-p (and Claude/GPT-6 with reasoning lock sampling settings anyway).
- The claim that top-p struggles is theirs; Holtzman et al. found top-p best in 2019-20 at ordinary settings (p 0.9–0.95, t = 1). Not a direct contradiction: min-p is about pushing temperature higher.
