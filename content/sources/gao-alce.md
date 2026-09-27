---
id: gao-alce
title: Enabling Large Language Models to Generate Text with Citations (ALCE)
author: Tianyu Gao, Howard Yen, Jiatong Yu, Danqi Chen (Princeton)
url: https://arxiv.org/abs/2305.14627
published: 2023-05-24          # v2 2023-10-31, EMNLP 2023
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The paper that set up a standard way to measure whether an LLM's citations actually back its answer. ALCE has three question sets (ASQA, QAMPARI, ELI5) with a retrieval corpus, and scores systems on fluency, correctness and citation quality. Citation quality is split into citation recall (is each sentence fully supported by what it cites?) and citation precision (are any citations irrelevant?), judged automatically with an NLI model. Even the best 2023 models left about half of ELI5 answers without full support.

## Key claims

- Goal. "our aim is to allow LLMs to generate text with citations, improving their factual correctness and verifiability." (abstract)
- Three dimensions. "automatic metrics along three dimensions -- fluency, correctness, and citation quality -- and demonstrate their strong correlation with human judgements." (abstract)
- Headline result. "on the ELI5 dataset, even the best models lack complete citation support 50% of the time." (abstract); in the intro: "around 50% generations of our ChatGPT and GPT-4 baselines are not fully supported by the cited passages." (§1)
- ELI5 questions come from Reddit's r/explainlikeimfive. "Most ELI5 questions are how/why/what questions that require long answers and multiple passages as evidence." (§2, datasets)
- Two citation metrics. "(1) citation recall , which determines if the output is entirely supported by cited passages, and (2) citation precision , which identifies any irrelevant citations." (§3.3)
- Recall is scored per statement (0 or 1) and averaged; a statement gets 1 only if it has at least one citation and the cited passages together entail it, per an NLI model. (§3.3)
- The judge is an NLI model, TRUE (a T5-11B fine-tuned on NLI data). "We use an NLI model to verify whether a statement is supported by its citations." (§3.3, Appendix C)
- A citation is "irrelevant" if it can't support the statement on its own and removing it doesn't hurt the rest. (§3.3)
- Why all three metrics are needed: an answer that just copies the top passage gets near-perfect citation recall and precision (99.4) but low fluency (MAUVE 20.8 vs ChatGPT's 66.6) and lower correctness (35.1 vs 40.4) on ASQA. (Appendix D, Table 11, "ASQA cheating cases")
- Adding citations after the fact works badly. "citation recall of ClosedBook + PostCite is lower than Vanilla by 47% on ASQA." (§5, main results.) PostCite: "For each statement, we find the best matching passage among the top-100 retrieved passages using GTR and cite it." Combined with ClosedBook (answering with no documents in context). (§4.3)
- Prompt used: "Cite at least one document and at most three documents in each sentence." (Appendix, prompts)
- Three challenges found: retrieval quality, limited context window, and models "distracted by irrelevant" passages when combining several documents. (§1)
- Automatic scores agreed with human judgments; Cohen's kappa showed "substantial agreement for citation recall" and "moderate agreement for citation precision". (§6)

## Visuals worth redrawing

- Figure 3: a statement with citations [2][4][5], showing how recall and precision are computed. Good for a small redrawn diagram.

## My notes

- Models are from 2023 (ChatGPT, GPT-4, LLaMA, Vicuna). The metrics are what lasts, not the scores.
- Read from the arXiv HTML version (v2).
