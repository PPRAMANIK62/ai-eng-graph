---
id: 3blue1brown-attention
title: Attention in transformers, step-by-step | Deep Learning Chapter 6
author: Grant Sanderson (3Blue1Brown)
url: https://www.3blue1brown.com/lessons/attention
published: 2024-04-07
accessed: 2026-09-23
kind: talk
primary: false
---

## Summary

A visual, step-by-step walk through one attention head in a GPT-style model, then multi-head attention, using GPT-3's real sizes. The running example is "A fluffy blue creature roamed the verdant forest": nouns send out a query ("any adjectives in front of me?"), adjectives answer with keys, dot products plus softmax give the attention pattern, and value vectors carry the update that gets added to the noun's embedding. It also covers the causal mask and why the attention grid grows with the square of the context.

## Key claims

- The starting embedding of a word ignores context. With "American shrew mole", "One mole of carbon dioxide" and "Take a biopsy of the mole", the first vector for mole is identical: "this initial token embedding is effectively a lookup table with no reference to the context." (Motivating Examples)
- Attention's job is to add a context-dependent change to that generic vector. "It is the job of an attention block to calculate what it needs to add to the generic embedding, as a function of its context, to move it to one of those specific directions." (Motivating Examples)
- Example: "tower" after "Eiffel" should move toward Paris, France, iron; add "miniature" and it should stop meaning large and tall. "If it was also preceded by the word miniature , then the vector should be updated even further so that it no longer correlates with large, tall things." (Motivating Examples)
- Only the last vector predicts the next token, so it has to soak up everything relevant, e.g. a mystery novel ending "Therefore the murderer was...". "It will have to have somehow encoded all of the information from the full context window that's relevant to predicting the next word." (Motivating Examples)
- The query is a question each token asks, encoded as a smaller vector. For the noun creature: "Hey, are there any adjectives sitting in front of me?" (The Attention Pattern)
- Keys are potential answers; a query–key dot product measures how well they match. "Conceptually, we want to think of these keys as potential answers to the queries." and "A larger dot product corresponds to stronger alignment." (The Attention Pattern)
- Softmax on each column of the score grid turns scores into weights between 0 and 1 that sum to 1; the result is called the attention pattern. "We call this grid the attention pattern ." (The Attention Pattern)
- The adjective–noun behavior is a made-up illustration; real heads are hard to read. "The true behavior of an attention head is much harder to parse" (The Attention Pattern)
- Masking: later tokens must not influence earlier ones, so those scores are set to −∞ before softmax and become 0. "what we want is for all of these spots where later tokens influence earlier ones to somehow be forced to be zero." (Masking)
- The attention pattern is context length squared, which is why long context is hard. "the size of this attention pattern is equal to the square of the context size." and "This is why context size could act as a significant limitation for large language models and why scaling it up is nontrivial." (Context Size)
- Value vectors carry what gets added: the weighted sum of values, using the pattern's weights, is added to the original embedding to give a refined one. "adding this \Delta \vec{E} to the original embedding hopefully results in a refined vector \vec{E}' that encodes a much more contextually rich meaning" (Values)
- A single head is three learned matrices: query, key and value. "this single head of attention is parameterized by three distinct matrices: the key matrix , the query matrix , and the value matrix" (Values)
- GPT-3 sizes: query and key space of 128 dimensions against a 12,288-dimensional embedding; about 6.3 million parameters per head. "adding them all up gets about 6.3 million parameters for one attention head." (Counting parameters)
- Multi-head: GPT-3 runs 96 heads per block, each with its own matrices, and their proposed changes are added up. "GPT-3, for example, uses 96 attention heads inside each block." (Multi-headed attention)
- Why many heads: each learns a different way context changes meaning. "by running many distinct heads in parallel, the model is given the capacity to learn many distinct ways that context changes meaning." (Multi-headed attention)
- Other examples of context: "they crashed the" before car; "wizard" near Harry suggests Harry Potter, while "Queen", "Sussex" and "William" suggest the prince. (Multi-headed attention, no single quotable sentence)
- Per block about 600 million attention parameters; across GPT-3's 96 layers just under 58 billion, about a third of the total. "So even though attention gets all of the attention, the majority of parameters come from the blocks sitting in between these steps." (Going Deeper)
- Its success is mostly about running in parallel on GPUs. "A big part of the story for the success of the attention mechanism is not so much any specific kind of behavior that it enables, but the fact that it's extremely parallelizable" (Going Deeper)
- Cross-attention (keys from one text, queries from another, as in translation) differs from the self-attention used in GPT. "the only difference being that the key and query maps act on different data sets." (Cross-attention head)

## Visuals worth redrawing

- The query–key grid for "a fluffy blue creature roamed the verdant forest" (The Attention Pattern): big dots where fluffy/blue meet creature and verdant meets forest. The main visual for the attention article. Redraw as a lower-triangular heat map to show the mask.
- The same grid with the upper triangle set to −∞, then 0 after softmax (Masking).
- "mole" in three sentences, one arrow each from the same starting vector to three different meanings (Motivating Examples).
- The value vectors being scaled by one column's weights and summed into ΔE for "creature" (Values).

## My notes

- The lesson draws keys as rows and queries as columns, so its grid is the transpose of the paper's QKᵀ. It says so itself. Doesn't matter at concept level.
- "Attention gets all of the attention" but only about a third of GPT-3's parameters: the feed-forward blocks hold most of them. Useful for the transformer article.
- All numbers are GPT-3 (2020). Current closed models don't publish head counts or sizes.
- It mentions newer variants that make long context cheaper only in passing; `raschka-llm-architecture-comparison` covers them.
