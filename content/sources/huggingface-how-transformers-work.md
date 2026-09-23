---
id: huggingface-how-transformers-work
title: How do Transformers work? (LLM Course, chapter 1.4)
author: Hugging Face
url: https://huggingface.co/learn/llm-course/chapter1/4
published: 2024              # undated page; its history list runs to November 2024, so written then or later
accessed: 2026-09-23
kind: docs
primary: false
---

## Summary

A beginner course page from Hugging Face: a short history of transformer models from 2017, the split into encoder-only, decoder-only and encoder–decoder models, what attention layers do (with a translation example), and the difference between pretraining and fine-tuning. Useful for placing GPT-style LLMs as the decoder-only branch of the 2017 design.

## Key claims

- The transformer arrived in June 2017, built for translation. "The Transformer architecture was introduced in June 2017. The focus of the original research was on translation tasks." (A bit of Transformer history)
- Early milestones: GPT in June 2018 ("the first pretrained Transformer model"), BERT in October 2018, GPT-2 in February 2019, GPT-3 in May 2020. (A bit of Transformer history, list)
- Three families: GPT-like (auto-regressive), BERT-like (auto-encoding), T5-like (sequence-to-sequence). "Broadly, they can be grouped into three categories" (A bit of Transformer history)
- What each half is for. Encoder: "The encoder receives an input and builds a representation of it (its features)." Decoder: "The decoder uses the encoder’s representation (features) along with other inputs to generate a target sequence." (General Transformer architecture)
- Decoder-only models are the ones for text generation. "Decoder-only models : Good for generative tasks such as text generation." (General Transformer architecture)
- Encoder-only models are for understanding tasks like classification. "Encoder-only models : Good for tasks that require understanding of the input, such as sentence classification and named entity recognition." (General Transformer architecture)
- Causal language modeling is next-word prediction from the past only. "This is called causal language modeling because the output depends on the past and present inputs, but not the future ones." (Transformers are language models)
- Attention in plain words, with a translation example: to translate "like" in "You like this course" into French the model needs "You", because the verb is conjugated by subject. "this layer will tell the model to pay specific attention to certain words in the sentence you passed it (and more or less ignore the others) when dealing with the representation of each word." (Attention layers)
- Meaning depends on context. "a word by itself has a meaning, but that meaning is deeply affected by the context, which can be any other word (or words) before or after the word being studied." (Attention layers)
- In the decoder, a word can only look at earlier words. "For instance, when trying to predict the fourth word, the attention layer will only have access to the words in positions 1 to 3." (The original architecture)
- Architecture vs checkpoint: the architecture is the skeleton, a checkpoint is a set of trained weights for it. "Architecture : This is the skeleton of the model — the definition of each layer and each operation that happens within the model." (Architectures vs. checkpoints)
- Bigger models and more data has been the general route to better performance. "the general strategy to achieve better performance is by increasing the models’ sizes as well as the amount of data they are pretrained on." (Transformers are big models)

## Visuals worth redrawing

- The encoder (left) / decoder (right) block diagram, and the original architecture figure with the decoder's second attention layer reading the encoder output. Redraw only to contrast with today's decoder-only stack.

## My notes

- The history list has some shaky dates: it puts Llama in "January 2023" and Mistral 7B in "March 2023". Don't use this page for those dates.
- Secondary source (a course), but from the team that maintains the most used transformer library.
- BERT is described as "designed to produce better summaries of sentences". The page doesn't connect encoder models to embedding APIs, so don't claim that from here.
