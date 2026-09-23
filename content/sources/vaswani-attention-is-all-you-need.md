---
id: vaswani-attention-is-all-you-need
title: Attention Is All You Need
author: Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin (Google Brain, Google Research)
url: https://arxiv.org/abs/1706.03762
published: 2017-06-12         # v1; v7 (the one read) revised 2023-08-02
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The 2017 paper that introduced the transformer: a translation model built only from attention and small feed-forward networks, with no recurrence. It defines scaled dot-product attention (queries, keys, values, softmax), multi-head attention, the causal mask in the decoder, positional encodings, and the stack of identical layers with residual connections. The main selling point was parallel training: it matched or beat the best translation models at a fraction of the training cost.

## Key claims

- The architecture in one line: attention only, no recurrence or convolution. "We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely." (Abstract)
- Why: recurrent models process one position after another, which blocks parallel training. "This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths" (1 Introduction)
- The payoff: much faster training. Best English–French result after 3.5 days on eight GPUs; a good result "after being trained for as little as twelve hours on eight P100 GPUs." (1 Introduction; Abstract)
- Attention defined as a lookup: a query is compared with keys, and the output is a weighted sum of values. "An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors." (3.2 Attention)
- Scaled dot-product attention: dot products of the query with all keys, divided by the square root of the key size, then softmax gives the weights on the values. "We compute the dot products of the query with all keys, divide each by √dk, and apply a softmax function to obtain the weights on the values." (3.2.1)
- Self-attention relates positions within one sequence. "Self-attention, sometimes called intra-attention is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence." (2 Background)
- Multi-head attention: several attention layers run in parallel on smaller projections; the base model uses 8 heads of size 64 (d_model = 512). "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions." (3.2.2)
- Causal mask: in the decoder, a position can't see later positions; illegal connections are set to −∞ before softmax. "We need to prevent leftward information flow in the decoder to preserve the auto-regressive property." (3.2.3)
- Layer structure: a stack of N = 6 identical layers, each with a self-attention sub-layer and a feed-forward sub-layer, with a residual connection around each. "The encoder is composed of a stack of N = 6 identical layers." (3.1)
- The feed-forward network is applied to each position separately: two linear layers with a ReLU, inner size 2048 vs model size 512. "This consists of two linear transformations with a ReLU activation in between." (3.3)
- Attention alone ignores order, so position information is added to the embeddings. "Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence." (3.5)
- Learned position embeddings worked about as well as the fixed sine/cosine ones. "found that the two versions produced nearly identical results" (3.5)
- Cost: self-attention per layer is O(n²·d) in sequence length n, but any two positions are one step apart (path length O(1)), versus O(n) sequential steps for a recurrent layer. (Table 1, no quotable sentence)
- Heads end up doing different jobs, some tied to grammar. "Not only do individual attention heads clearly learn to perform different tasks, many appear to exhibit behavior related to the syntactic and semantic structure of the sentences." (4 Why Self-Attention)
- One head alone is worse than several, and too many heads also hurts. "While single-head attention is 0.9 BLEU worse than the best setting, quality also drops off with too many heads." (6.2 Model Variations)

## Visuals worth redrawing

- Figure 1, the encoder–decoder architecture: two stacks of N layers, each with attention, feed-forward, "Add & Norm". The standard transformer picture; for today's LLMs redraw only the decoder side.
- Figure 2, scaled dot-product attention (MatMul → Scale → Mask → SoftMax → MatMul) next to multi-head attention (h parallel heads → Concat → Linear).
- Figure 3 (appendix): attention from the word "making" reaching the distant words "more difficult" in layer 5. Figure 4: heads resolving what "its" refers to.

## My notes

- This is the 2017 encoder–decoder model for translation. GPT-style LLMs keep only the decoder stack (see `huggingface-how-transformers-work`, `elhage-transformer-circuits`). Don't present the encoder–decoder diagram as "how ChatGPT works".
- The sizes (512, 8 heads, 6 layers, 2048) are the base model's. Tiny by today's standards; label them as 2017 numbers.
- Placement of layer norm (after each sub-layer here) changed in later models; see `raschka-llm-architecture-comparison`.
- Read the v7 PDF on arXiv (pdftotext). The √dk sign is garbled in the text extraction, so the quote above has it retyped as the symbol.
- The paper's Figure 2 and the decoder mask are the same idea 3Blue1Brown shows as a grid with the upper part blanked out.
