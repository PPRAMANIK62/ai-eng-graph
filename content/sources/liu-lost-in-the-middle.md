---
id: liu-lost-in-the-middle
title: "Lost in the Middle: How Language Models Use Long Contexts"
author: Nelson F. Liu, Kevin Lin, John Hewitt, Ashwin Paranjape, Michele Bevilacqua, Fabio Petroni, Percy Liang
url: https://aclanthology.org/2024.tacl-1.9/
published: 2024              # TACL vol. 12, pp. 157–173; arXiv 2307.03172 first posted 2023-07
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The paper that named the effect. Give a model 10, 20 or 30 documents where only one holds the answer, move that document around, and accuracy traces a U: best at the start, next best at the end, worst in the middle. Models built for longer windows didn't use their context any better, and piling in more retrieved documents stopped helping long before the retriever stopped finding more answers.

## Key claims

- The finding. "performance is often highest when relevant information occurs at the beginning or end of the input context, and significantly degrades when models must access relevant information in the middle of long contexts, even for explicitly long-context models." (Abstract)
- Tasks: multi-document QA and key-value retrieval. (Abstract)
- Setup: 10, 20 or 30 Wikipedia passages from NaturalQuestions-Open, one with the answer, the rest distractors retrieved by Contriever. (2.1 Experimental Setup)
- Models: MPT-30B-Instruct, LongChat-13B (16K), GPT-3.5-Turbo, GPT-3.5-Turbo (16K), Claude-1.3, Claude-1.3 (100K). (2.2 Models)
- Worse than no documents at all. "GPT-3.5-Turbo's multi-document QA performance can drop by more than 20%—in the worst case, performance in 20- and 30-document settings is lower than performance without any input documents (i.e., closed-book performance; 56.1%)." (2.3 Results and Discussion)
- Bigger windows don't help. "When the input context fits in the context window of both a model and its extended-context counterpart, we see that performance between them is nearly identical." (2.3)
- Base models show it too. "Surprisingly, we see that both MPT-30B and MPT-30B-Instruct exhibit a U-shaped performance curve" (4.3 Effect of Instruction Fine-Tuning)
- Putting the query both before and after the documents fixed the synthetic key-value task but "minimally affects performance trends in the multi-document question answering task" (4.2 Effect of Query-Aware Contextualization)
- More documents stop paying off. "We see that reader model performance saturates long before retriever performance saturates, indicating that readers are not effectively using the extra context." (5 Is More Context Is Always Better?)
- "using 50 documents instead of 20 retrieved documents only marginally improves performance (∼1.5% for GPT-3.5-Turbo and ∼1% for claude-1.3)" (5)
- The name for the shape in psychology. "The U-shaped curve we observe in this work has a connection in psychology known as the serial-position effect" (6.3 The Serial-Position Effect)

## Visuals worth redrawing

- Figure 1 / Figure 5: accuracy vs position of the answer document (1st to 20th), U-shaped, with a flat closed-book line. Redraw as an illustrative U with a closed-book reference line.

## My notes

- Opened the ACL Anthology page (abstract, citation) and the arXiv HTML (v3) for the details.
- Claude-1.3 was near perfect on the key-value task at all lengths, so the U is not universal even in 2023.
- 2023 models. Chroma's 2025 tests found no position effect on their needle task (see chroma-context-rot).
