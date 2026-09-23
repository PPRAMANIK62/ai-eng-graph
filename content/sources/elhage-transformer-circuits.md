---
id: elhage-transformer-circuits
title: A Mathematical Framework for Transformer Circuits
author: Nelson Elhage, Neel Nanda, Catherine Olsson, Chris Olah and others (Anthropic)
url: https://transformer-circuits.pub/2021/framework/index.html
published: 2021-12-22
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

Anthropic's first interpretability paper on transformers, studying tiny attention-only models. For our purposes it gives one strong mental model: the "residual stream". Every layer reads from a shared running vector per token and adds its output back into it. Attention heads are the only part that moves information between tokens; the rest works on each token alone. It also names "induction heads", heads that find an earlier copy of the current token and copy what came after it.

## Key claims

- Scope: decoder-only models like GPT-3; the original encoder–decoder is a translation special case. "We focus on autoregressive, decoder-only transformer language models, such as GPT-3." (Transformer Overview, High-Level Architecture)
- The whole model in one sentence: embedding, a stack of residual blocks, unembedding. "A transformer starts with a token embedding, followed by a series of “residual blocks”, and finally a token unembedding." (High-Level Architecture)
- Each block is attention then MLP; both read from the stream and add their result back. "Each residual block consists of an attention layer, followed by an MLP layer." (High-Level Architecture)
- The residual stream is just a running sum and a shared channel. "The residual stream is simply the sum of the output of all the previous layers and the original embedding." (Virtual Weights and the Residual Stream as a Communication Channel)
- What people call "the embedding" inside the model is this stream. "In transformers, the residual stream vectors are often called the “embedding.”" (same section)
- Size: hundreds of dimensions in small models, tens of thousands in large ones; heads work on small slices of 64 or 128. "In small models, it may be hundreds of dimensions; in large models it can go into the tens of thousands." (Subspaces and Residual Stream Bandwidth)
- Information stays in the stream until something removes it. "Once added, information persists in a subspace unless another layer actively deletes it." (Subspaces and Residual Stream Bandwidth)
- An MLP layer typically has four times as many neurons as the stream has dimensions. "Just a single MLP layer typically has four times more neurons than the residual stream has dimensions." (Subspaces and Residual Stream Bandwidth)
- Heads act independently and add their results. "Attention heads can be understood as independent operations, each outputting a result which is added into the residual stream." (Summary of Results)
- What heads do: move information between tokens. "The fundamental action of attention heads is moving information." (Attention Heads as Information Movement)
- Where to look and what to move are separate: a QK part makes the pattern, an OV part decides what gets copied. "a QK (“query-key”) circuit which computes the attention pattern, and an OV (“output-value”) circuit which computes how each token affects the output if attended to." (Summary of Results)
- With zero layers of attention, a model can only use the current token, so it learns word-pair (bigram) statistics. "Because the model cannot move information from other tokens, we are simply predicting the next token from the present token." (Zero-Layer Transformers)
- Induction heads search back for the current token and copy what followed it; they only appear with two or more attention layers. "Induction heads search over the context for previous examples of the present token." (Induction Heads) and "these heads only develop in models with at least two attention layers." (Summary)
- MLP layers were much harder to understand than attention. "we've also simply had much less success in understanding MLP layers so far" (Model Simplifications)

## Visuals worth redrawing

- The residual stream diagram (Transformer Overview): a vertical line per token, with the embedding at the bottom, attention and MLP blocks branching off and adding back in, and the unembedding at the top. Best single picture for "what a transformer block does". Redraw with our own labels.
- Attention patterns on the Harry Potter passage with induction heads attending to the token after an earlier "Dursley"/"Potters" (Induction Heads). Interactive in the original.

## My notes

- Toy models (attention-only, no MLP in most of the paper). Use it for the mental model, not for claims about large models. The authors say a later paper shows the ideas are "at least partially relevant" for bigger models.
- The paper is long and math-heavy. We only need the residual stream picture and "heads move information, MLPs work per token".
- Pairs with `3blue1brown-attention` (attention adds a ΔE to each token's vector) and `poloclub-transformer-explainer` (attention routes between tokens, MLP refines each token).
