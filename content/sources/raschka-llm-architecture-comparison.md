---
id: raschka-llm-architecture-comparison
title: The Big LLM Architecture Comparison
author: Sebastian Raschka
url: https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison
published: 2025-07-19          # last updated 2026-04-02 (added Gemma 4)
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

A long, regularly updated tour of the architectures of open-weight LLMs from 2024 to 2026 (DeepSeek V3, OLMo 2, Gemma 3, Qwen3, Kimi K2, Qwen3-Next, MiniMax, Kimi Linear and more). His framing: seven years after GPT, the core block is strikingly similar; what changed are refinements for efficiency (grouped-query and latent attention, sliding windows, mixture of experts, where the norm layers sit) and, since mid-2025, a revival of cheaper "linear" attention mixed with regular attention.

## Key claims

- The core hasn't changed much since GPT-2. "looking back at GPT-2 (2019) and forward to DeepSeek V3 and Llama 4 (2024-2025), one might be surprised at how structurally similar these models still are." (intro)
- The refinements, in one list: RoPE positions, grouped-query attention, SwiGLU. "positional embeddings have evolved from absolute to rotational (RoPE), Multi-Head Attention has largely given way to Grouped-Query Attention, and the more efficient SwiGLU has replaced activation functions like GELU." (intro)
- Grouped-query attention: several heads share one set of keys and values to save memory. "GQA groups multiple heads to share the same key and value projections." (1.1 Multi-Head Latent Attention)
- Why GQA helps at inference: fewer keys and values to store in the KV cache. "reduces the memory bandwidth usage for key and value tensors during inference since fewer keys and values need to be stored and retrieved from the KV cache." (1.1)
- Mixture of experts replaces each feed-forward module with many "expert" feed-forward modules, and a router uses only a few per token. "The core idea in MoE is to replace each FeedForward module in a transformer block with multiple expert layers" (1.2 Mixture-of-Experts)
- The feed-forward block holds a large share of the parameters, and the block is repeated many times: 61 times in DeepSeek V3. "The FeedForward block inside a transformer block (shown as the dark gray block in the figure above) typically contains a large number of the model's total parameters." (1.2)
- DeepSeek V3 numbers: 671 billion parameters total, 256 experts per MoE module, 9 active per token, 37 billion parameters used per step. "This means just 37 billion parameters are used per inference step as opposed to all 671 billion." (1.2)
- Norm placement: the 2017 transformer put normalization after attention and feed-forward; GPT and most later LLMs put it before (Pre-Norm). "GPT and most other LLMs that came after placed the normalization layers before the attention and FeedForward modules, which is known as Pre-LN or Pre-Norm." (2.1)
- Sliding window attention (local attention): each token only sees a window of nearby tokens. Gemma 3 uses 5 local layers per 1 global layer and a 1,024-token window (Gemma 2: 1:1 and 4,096). "we restrict the context size around the current query position." (3.1 Sliding Window Attention)
- Some models drop explicit position information entirely (NoPE); the causal mask still gives a sense of order. "the model still knows which tokens come before, thanks to the causal attention mask." (7.1 NoPE)
- Regular attention's cost grows with the square of the sequence length. "The original attention mechanism scales quadratically with the sequence length" (14.1)
- 2025 revival of linear attention: MiniMax-M1, Qwen3-Next and DeepSeek V3.2 replaced regular attention in most or all layers with cheaper variants. "All three models (MiniMax-M1, Qwen3-Next, DeepSeek V3.2) replace the traditional quadratic attention variants in most or all of their layers with efficient linear variants." (14.3)
- Then MiniMax went back to regular attention for M2, citing poor accuracy on reasoning and multi-turn tasks. "The team stated that linear attention is tricky in production LLMs." (14.3)
- Qwen3-Next mixes 3 Gated DeltaNet blocks with 1 regular gated attention block, because the cheaper block is less precise at finding things. "the tradeoff is that DeltaNet offers less precise content‑based retrieval than full attention, which is why one gated attention layer remains." (12.2)

## Visuals worth redrawing

- Figure 1: side-by-side block diagrams of many 2025 models. Too dense for phase 1; the idea "same block, small swaps" is what matters.
- Figure 2: multi-head vs grouped-query attention (each head with its own K/V vs heads sharing K/V). Good for the attention and KV cache articles.
- Figure 12: regular (global) attention vs sliding-window attention as two attention masks.
- Figure 36/41: hybrid stacks where 3 linear-attention blocks alternate with 1 full-attention block.

## My notes

- Open-weight models only. Closed models (GPT, Claude, Gemini) don't publish architectures, so "what's inside Claude" can't be checked here.
- Secondary source, but careful: he reads the model papers and configs and reimplements many models from scratch. Numbers like DeepSeek V3's 671B/37B come from DeepSeek's report.
- The article is edited over time (updated 2026-04-02). Section numbers may shift; section titles are more stable.
- His "not much changed" view vs the linear-attention revival is a live question as of 2026-09, and he reports the MiniMax reversal himself.
