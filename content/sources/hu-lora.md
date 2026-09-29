---
id: hu-lora
title: "LoRA: Low-Rank Adaptation of Large Language Models"
author: Edward J. Hu, Yelong Shen, Phillip Wallis, et al. (Microsoft)
url: https://arxiv.org/abs/2106.09685
published: 2021-06-17        # v2 2021-10-16
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The paper that introduced LoRA. Instead of updating every weight, freeze the model and train a pair of small matrices per layer whose product is the change to the weights. Far fewer trainable parameters and less GPU memory, quality on par with full fine-tuning on the models they tried, and no extra latency at inference.

## Key claims

- The problem. "As we pre-train larger models, full fine-tuning, which retrains all model parameters, becomes less feasible." Keeping a separate 175B-parameter copy per task is "prohibitively expensive". (Abstract)
- The method. LoRA "freezes the pre-trained model weights and injects trainable rank decomposition matrices into each layer of the Transformer architecture, greatly reducing the number of trainable parameters for downstream tasks." (Abstract)
- The savings, vs GPT-3 175B fine-tuned with Adam. "LoRA can reduce the number of trainable parameters by 10,000 times and the GPU memory requirement by 3 times." (Abstract)
- Quality and latency. "LoRA performs on-par or better than fine-tuning in model quality on RoBERTa, DeBERTa, GPT-2, and GPT-3, despite having fewer trainable parameters, a higher training throughput, and, unlike adapters, no additional inference latency." (Abstract)

## Visuals worth redrawing

- Figure 1: frozen weight W beside the A and B matrices, outputs added. Redraw with our own labels.

## My notes

- Read at the abstract level. The claim of parity was on 2021 models and tasks; later work disagreed (see `biderman-lora-learns-less`, `thinking-machines-lora-without-regret`).
