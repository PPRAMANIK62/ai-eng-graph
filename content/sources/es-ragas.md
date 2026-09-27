---
id: es-ragas
title: "Ragas: Automated Evaluation of Retrieval Augmented Generation"
author: Shahul Es, Jithin James, Luis Espinosa-Anke, Steven Schockaert
url: https://arxiv.org/abs/2309.15217
published: 2025-04-28         # v2; v1 2023-09-26; EACL 2024 system demonstrations
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The paper behind the Ragas library. It scores a RAG pipeline on three
dimensions (faithfulness, answer relevance, context relevance) using an LLM
as the judge, with no human-labelled answers or relevance labels needed.
It is the main alternative to building a labelled retrieval test set. Read
the abstract page and the PDF.

## Key claims

- RAG has several parts to evaluate. "the ability of the retrieval system to identify relevant and focused context passages, the ability of the LLM to exploit such passages in a faithful way, or the quality of the generation itself." (Abstract)
- No labels needed. The metrics work "without having to rely on ground truth human annotations". (Abstract)
- The pitch is speed: it "can crucially contribute to faster evaluation cycles of RAG architectures" (Abstract)
- Context relevance is about focus, not completeness. "The context c(q) is considered relevant to the extent that it exclusively contains information that is needed to answer the question. In particular, this metric aims to penalise the inclusion of redundant information." (§3, Context relevance)
- It's computed by an LLM: the LLM "extracts a subset of sentences, Sext , from c(q) that are crucial to answer q" and the score is the number of extracted sentences divided by the total number of sentences in the context. (§3, Context relevance)

## Visuals worth redrawing

- None.

## My notes

- Context relevance as defined here penalizes extra text in the retrieved context. It doesn't tell you whether the right chunk was found out of all the chunks that exist; for that you need labels (recall@k). The two answer different questions.
- The judge is an LLM (the paper used gpt-3.5-turbo-16k via the OpenAI API, §3), so the scores inherit the judge's errors. The Ragas library has changed a lot since 2023; this note is about the paper only.
