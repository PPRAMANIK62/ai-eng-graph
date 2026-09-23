---
id: hoffmann-chinchilla
title: Training Compute-Optimal Large Language Models
author: Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, et al. (DeepMind, 22 authors)
url: https://arxiv.org/abs/2203.15556
published: 2022-03-29
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The "Chinchilla" paper. DeepMind trained over 400 models to work out how to split a fixed training budget between model size and amount of training text. The answer: grow both at the same rate. By that rule, the big models of 2021 were too big and trained on too little text. A 70B model trained on 4x more data (Chinchilla) beat the 280B Gopher with the same compute, and is cheaper to run afterwards.

## Key claims

- The question: for a fixed compute budget, how big should the model be and how many tokens should it see? "We investigate the optimal model size and number of tokens for training a transformer language model under a given compute budget." (Abstract)
- Big models of the time were undertrained. "We find that current large language models are significantly undertrained" (Abstract)
- The rule: scale parameters and tokens equally. "for every doubling of model size the number of training tokens should also be doubled." (Abstract)
- The evidence base: over 400 models, 70M to 16B+ parameters, 5B to 500B tokens. "By training over 400 language models ranging from 70 million to over 16 billion parameters on 5 to 500 billion tokens" (Abstract)
- Chinchilla: 70B parameters, same compute as Gopher, 4x the data (1.4 trillion tokens). "We verify this by training a more compute-optimal 70B model, called Chinchilla, on 1.4 trillion tokens." (§1 Introduction)
- It beats much bigger models. "Chinchilla uniformly and significantly outperforms Gopher (280B), GPT-3 (175B), Jurassic-1 (178B), and Megatron-Turing NLG (530B)" (Abstract)
- Table 1: GPT-3 (175B), Jurassic (178B) and Gopher (280B) were each trained on 300 billion tokens; Chinchilla (70B) on 1.4 trillion. "recently trained large models have been trained for approximately 300 billion tokens" (§1 Introduction)
- A smaller model is cheaper to use afterwards. "This also means that Chinchilla uses substantially less compute for fine-tuning and inference, greatly facilitating downstream usage." (Abstract)
- Training cost isn't the only cost; running the model counts too. "downstream fine-tuning and inference also make up substantial compute usage" (§4)
- MMLU result. "Chinchilla reaches a state-of-the-art average accuracy of 67.5% on the MMLU benchmark, greater than a 7% improvement over Gopher." (Abstract)
- Data becomes the bottleneck. "we find that larger, high quality datasets will play a key role in any" further scaling (§1, sentence continues onto next line)

## Visuals worth redrawing

- Figure 1: predicted optimal model size vs compute, with Chinchilla on the line and Gopher, GPT-3 and MT-NLG above it (too big for their compute). Redraw as a simple chart: parameters on one axis, training tokens on the other, dots for each model.
- Table 1: model name, parameters, training tokens. Easy to turn into the article's table.

## My notes

- 2022. The "tokens should grow with parameters" rule is about compute-optimal *training*. Later models trained far past this ratio to make inference cheaper, but I have no source open for that (the candidates list says Llama 3 paper, not opened). Don't claim it.
- The abstract's "4× more more data" has a typo on arXiv ("more more"); avoid quoting that sentence.
- Chinchilla supports the point that a pretraining run is a budget decision: size vs data.
