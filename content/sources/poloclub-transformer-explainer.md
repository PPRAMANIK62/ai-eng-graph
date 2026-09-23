---
id: poloclub-transformer-explainer
title: "Transformer Explainer: LLM Transformer Model Visually Explained"
author: Aeree Cho, Grace C. Kim, Alexander Karpekov and others (Georgia Tech, Polo Club)
url: https://poloclub.github.io/transformer-explainer/
published: 2024-08-08          # arXiv v1; paper v2 (CHI 2026) revised 2026-08-10
accessed: 2026-09-23
kind: code
primary: true
---

## Summary

An interactive page that runs GPT-2 (small) live in the browser and shows every step from prompt to next-token probabilities: tokenization, token and position embeddings, the stack of transformer blocks (masked multi-head self-attention, then an MLP), and the final logits and sampling. The text under the tool gives GPT-2's real sizes. The companion paper (arXiv 2408.04619) reports a 90-person user study.

## Key claims

- The model shown is GPT-2 small, 124 million parameters, chosen because it shares the parts of current models. "it shares many of the same architectural components and principles found in the current state-of-the-art models" (intro)
- Three parts of every text-generating transformer: embedding, transformer blocks, output probabilities. "Every text-generative Transformer consists of these three key components" (intro)
- Attention lets tokens talk to each other; the MLP works on each token alone. "While the goal of the attention layer is to route information between tokens, the goal of the MLP is to refine each token's representation." (intro, component list; the line wraps on the page)
- The embedding steps: tokenize, look up token embeddings, add position information, sum them. Example prompt: "Data visualization empowers users to". (Embedding)
- GPT-2's vocabulary is 50,257 tokens and each is a 768-number vector; the table is 50,257 × 768, about 39 million parameters. "GPT-2 (small) represents each token in the vocabulary as a 768-dimensional vector" (Embedding, token embedding step)
- Similar tokens sit close together in that space. "tokens with similar usage or meaning in language are placed close together in this high-dimensional space, while dissimilar tokens are farther apart." (Embedding, token embedding step)
- GPT-2 learns its position table during training, and adds it to the token embedding. "GPT-2 trains its own positional encoding matrix from scratch, integrating it directly into the training process." (Embedding, positional encoding step)
- Blocks are stacked; representations get richer layer by layer. GPT-2 small has 12. "The GPT-2 (small) model we are examining consists of 12 such blocks." (Transformer Block)
- Heads look at different relationships. "one head may capture short-range syntactic links while another tracks broader semantic context." (Multi-Head Self-Attention)
- GPT-2 small has 12 heads; the mask sets the upper triangle of scores to negative infinity so a token can't see future tokens. "a mask is applied to the upper triangle of the attention matrix to prevent the model from accessing future tokens, setting these values to negative infinity." (Multi-Head Self-Attention, masked self-attention step)
- The MLP expands each token's vector four-fold, 768 → 3072, then back to 768. "The first linear transformation expands the dimensionality of the input four-fold from 768 to 3072." (MLP: Multi-Layer Perceptron)
- At the end, a final layer maps to one score (logit) per vocabulary token and softmax turns them into probabilities. (Output Probabilities)
- Layer norm, dropout and residual connections are there to make training work, not to explain the core idea. "While important for the model's overall performance, they are not as important for understanding the core concepts of the architecture." (Auxiliary Architectural Features)
- Residual connections add a layer's input to its output, which is what made very deep networks trainable. "residual connections are shortcuts that bypass one or more layers, adding the input of a layer to its output." (Auxiliary Architectural Features, residual connection)

## Visuals worth redrawing

- The whole tool is the visual: embedding → 12 blocks → probabilities, with attention matrices you can click into. Link to it rather than redraw.
- Figure 1 (Embedding): tokenization → token embedding → positional encoding → sum. Good small diagram for the embeddings article.
- Figure 3 (Multi-Head Self-Attention, masked self-attention step): QKᵀ → scale → mask upper triangle → softmax → multiply by V.

## My notes

- GPT-2 (2019) numbers. Current frontier models are far bigger and their sizes aren't published.
- The MLP quote is joined across HTML line breaks on the page ("from 768" / "to" / "3072"). The page also says the MLP uses a GELU activation between the two linear layers.
- The CHI 2026 paper (arXiv 2408.04619, opened) says the tool has "attracted over 490,000 users" and ran a 90-participant study. Only the tool page is used for facts about transformers.
- Explains layer norm as reducing "internal covariate shift"; that explanation is debated, and we don't need it.
