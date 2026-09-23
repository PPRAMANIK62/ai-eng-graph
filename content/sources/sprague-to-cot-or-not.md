---
id: sprague-to-cot-or-not
title: "To CoT or not to CoT? Chain-of-thought helps mainly on math and symbolic reasoning"
author: Zayne Sprague, Fangcong Yin, Juan Diego Rodriguez, Dongwei Jiang, Manya Wadhwa, Prasann Singhal, Xinyu Zhao, Xi Ye, Kyle Mahowald, Greg Durrett
url: https://arxiv.org/abs/2409.12183
published: 2024-09-18        # v3 2025-05-07; ICLR 2025
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

A meta-analysis of over 100 papers plus the authors' own tests on 20 datasets and 14 models, asking where chain-of-thought actually helps. Answer: mostly math, logic and symbolic tasks. Elsewhere the gain is tiny. On MMLU, nearly all of the CoT gain comes from questions involving an equals sign. And on the tasks where CoT helps, handing the computation to a real tool (a solver) does even better.

## Key claims

- Scope: 100+ papers and 20 datasets × 14 models. "we conducted a quantitative meta-analysis covering over 100 papers using CoT and ran our own evaluations of 20 datasets across 14 models." (Abstract)
- Main finding. "CoT gives strong performance benefits primarily on tasks involving math or logic, with much smaller gains on other types of tasks." (Abstract)
- MMLU: CoT and direct answers score almost the same unless there's an "=". "directly generating the answer without CoT leads to almost identical accuracy as CoT unless the question or model's response contains an equals sign" (Abstract)
- Up to 95% of the MMLU gain is from "=" questions. "As much as 95% of the total performance gain from CoT on MMLU is attributed to questions containing “=” in the question or generated output." (§1 Introduction)
- For non-math questions there's no signal for when CoT will help. "For non-math questions, we find no features to indicate when CoT will help." (§1)
- In the literature, the top three categories are symbolic reasoning, math and logic, averaging +14.2, +12.3 and +6.9 points. (§3 meta-analysis: "average improvements of 14.2, 12.3, 6.9, respectively")
- Other categories: 56.8 with CoT vs 56.1 without. "For other categories, the average performance with CoT was 56.8, compared to 56.1 without CoT." (§3)
- CoT mainly helps the execution part (doing the computation), and a tool does that better. "Much of CoT's gain comes from improving symbolic execution, but it underperforms relative to using a symbolic solver." (Abstract)
- Practical upshot: use it selectively. "Our results indicate that CoT can be applied selectively, maintaining performance while saving inference costs." (Abstract)

## Visuals worth redrawing

- Figure 1: CoT gain by task category (meta-analysis and own experiments), with math/symbolic/logic far to the right and everything else near zero. Redraw as a sorted bar chart.

## My notes

- Covers prompt-based CoT on 2023–24 models, not trained reasoning models.
- Agrees with Kojima's "no gain on commonsense", and with Meincke 2025 on shrinking value; disagrees in tone with Wei/Kojima, which showed CoT on the tasks where it shines.
- "Use a tool instead" links to tool calling in later phases.
