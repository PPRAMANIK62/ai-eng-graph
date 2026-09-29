---
id: anthropic-classification-cookbook
title: Classification with Claude
author: Garvan Doyle (Anthropic)
url: https://platform.claude.com/cookbook/capabilities-classification-guide
published: 2024-05-19
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

An Anthropic cookbook that classifies insurance support tickets into 10 categories with Claude Haiku 4.5, improving step by step: random guessing, a simple prompt with category definitions, then five retrieved similar labeled examples (RAG), then chain of thought. It reports accuracy at each step on a 68-ticket test set and re-checks the results with Promptfoo.

## Key claims

- When LLMs help. "LLMs have demonstrated remarkable success in handling classification problems characterized by complex business rules and scenarios with low-quality or limited training data." (intro)
- Data. "The training data contains 68 labeled examples that we'll use for retrieval-augmented generation (RAG) later. The test set also contains 68 examples that we'll use to evaluate our classification approaches." Ten categories, e.g. Billing Inquiries, Claims Disputes, Policy Comparisons. (Data)
- Random baseline. "This confirms our baseline of approximately 10% accuracy—purely chance performance with 10 categories." (Random baseline)
- Simple prompt: Claude writes one label, parsed by prefilling `<category>` and stopping at `</category>`, `temperature=0.0`. "This ~70% overall accuracy significantly outperforms random guessing" The printed report for that run shows `accuracy 0.74` on 68. (Simple classifier)
- Retrieved examples: the 5 nearest labeled training tickets (voyage-2 embeddings) go into the prompt. "RAG boosted our accuracy from ~70% to 94% ." (RAG results)
- Chain of thought on top. "Chain-of-thought reasoning pushed our accuracy to 97% , resolving most of the edge cases that challenged the previous approaches." Summary: random ~10%, simple ~70%, RAG 94%, RAG + CoT 97%. (Chain-of-thought results)
- Promptfoo re-check: RAG w/ CoT 95.59% at T=0.0, 0.2 and 0.8; RAG 94.12%; simple 70.59%. "Use temperature=0.0 with RAG w/ CoT for maximum consistency and accuracy (95.59%)" (Key Findings)
- Where the simple prompt goes wrong: "the confusion between similar categories suggests Claude needs more context to make finer distinctions" (Simple classifier results)

## Visuals worth redrawing

- Accuracy by step as bars (10, 70, 94, 97), with the Promptfoo re-run next to it.

## My notes

- 68 test tickets: one ticket is about 1.5 points, so 94 vs 97 is two tickets.
- Three different numbers for the simple prompt on one page (~70% in prose, 0.74 in the report, 70.59% in Promptfoo), and the ticket-routing guide quotes 71% to 93% for this recipe.
- Prefilling and `temperature` aren't accepted by every current Claude model (see `anthropic-structured-outputs` on prefilling, and `_candidates.md` on sampling settings), so the code may need changes on newer models.
