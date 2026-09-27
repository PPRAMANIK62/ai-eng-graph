---
id: lewis-rag
title: Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks
author: Patrick Lewis, Ethan Perez, Aleksandra Piktus, Fabio Petroni, Vladimir Karpukhin, Naman Goyal, Heinrich Küttler, Mike Lewis, Wen-tau Yih, Tim Rocktäschel, Sebastian Riedel, Douwe Kiela (Facebook AI Research, UCL, NYU)
url: https://arxiv.org/abs/2005.11401
published: 2020-05-22        # v4 2021-04-12, NeurIPS 2020
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The paper that named RAG. It pairs a text generator (BART) with a retriever (DPR) that searches a vector index of Wikipedia, and feeds the retrieved passages to the generator along with the question. Unlike today's API RAG, the retriever's query side and the generator are trained together on each task. It set the state of the art on three open-domain QA tasks and gave more factual text than the model alone.

## Key claims

- The name and the idea: combine what's in the weights with retrieved text. "models which combine pre-trained parametric and non-parametric memory for language generation" (Abstract)
- The setup: seq2seq model plus a vector index of Wikipedia. "the parametric memory is a pre-trained seq2seq model and the non-parametric memory is a dense vector index of Wikipedia, accessed with a pre-trained neural retriever" (Abstract)
- Why: models alone can't easily update what they know or show where an answer came from. "providing provenance for their decisions and updating their world knowledge remain open research problems" (Abstract)
- Models without retrieval "cannot easily expand or revise their memory, can't straightforwardly provide insight into their predictions, and may produce 'hallucinations'" (1 Introduction)
- Retrieved knowledge can be edited and inspected. "knowledge can be directly revised and expanded, and accessed knowledge can be inspected and interpreted" (1 Introduction)
- Trained together, unlike API RAG today. "We jointly train the retriever and generator components without any direct supervision on what document should be retrieved." (2.4 Training)
- Combining retrieved text with the input is plain concatenation. "To combine the input x with the retrieved content z when generating from BART, we simply concatenate them." (2.3 Generator: BART)
- Retriever is DPR, a bi-encoder; top-k found by maximum inner product search. (2.2 Retriever: DPR)
- Results: state of the art on three open-domain QA tasks; more factual generation. "RAG models generate more specific, diverse and factual language than a state-of-the-art parametric-only seq2seq baseline." (Abstract)
- Swapping the index updates knowledge. "the non-parametric memory can be replaced to update the models' knowledge as the world changes" (1 Introduction)

## Visuals worth redrawing

- Figure 1: query encoder → MIPS over document index → top-k docs → generator, with end-to-end backprop. Redraw only as the simple retrieve → generate flow.

## My notes

- Opened the abstract page and pages 1–3 of the PDF (v4).
- Generator is BART-large (400M params), a 2020 model. The word "RAG" now means the general pattern with a frozen API model, not this trained system.
