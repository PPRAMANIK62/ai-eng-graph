---
id: databricks-long-context-rag
title: Long Context RAG Performance of LLMs
author: Quinn Leng, Jacob Portes, Sam Havens, Matei Zaharia, Michael Carbin (Databricks)
url: https://www.databricks.com/blog/long-context-rag-performance-llms
published: 2024-08-12
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

Databricks ran over 2,000 experiments on 13 models, varying how much retrieved text went into the prompt, from 2k to 192k tokens. Retrieving more helps up to a point, then most models get worse, and each model fails in its own way. Long context and RAG work together rather than one replacing the other.

## Key claims

- Scale: over 2,000 experiments, 13 open and commercial models (GPT-4o, Claude-3.5-Sonnet, Llama-3.1-405b, Mixtral, DBRX and others). "We ran over 2,000 experiments on 13 popular open source and commercial LLMs" (Background)
- Context lengths tested: 2k to 192k tokens. (Experiment 1: The benefits of retrieving more documents)
- Datasets: Databricks DocsQA, FinanceBench, Natural Questions, HotPotQA. (Methodology)
- More retrieval helps recall. "Retrieving more information for a given query increases the likelihood that the right information is passed on to the LLM." (opening summary of findings)
- Most models get worse past a size. "Most model performance decreases after a certain context size." (opening summary of findings)
- "Llama-3.1-405b performance starts to decrease after 32k tokens, GPT-4-0125-preview starts to decrease after 64k tokens" (opening summary of findings)
- Only a few held up. "only a few models can maintain consistent long context RAG performance on all datasets" (opening summary of findings)
- Failures differ by model. "Models fail on long context in highly distinct ways" (opening summary of findings)
- "Claude-3-sonnet's copyright failure increases from 3.7% at 16k to 21% at 32k to 49.5% at 64k context length" (Experiment 3: Failure analysis)
- DBRX-Instruct summarized instead of answering; Mixtral produced repeated or random content. (OSS model long context failure analysis)
- Synergy, not replacement. "longer context models and RAG are synergistic: long context enables RAG systems to effectively include more relevant documents." (Conclusions)

## Visuals worth redrawing

- Line charts of answer correctness vs context length per model: rises, then falls for most. Redraw as an illustrative rise-then-fall shape.

## My notes

- 2024 models. GPT-4o and Claude 3.5 Sonnet already held up well; newer models may hold up longer.
