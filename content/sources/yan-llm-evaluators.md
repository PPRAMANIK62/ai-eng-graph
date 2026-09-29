---
id: yan-llm-evaluators
title: Evaluating the Effectiveness of LLM-Evaluators (aka LLM-as-Judge)
author: Eugene Yan
url: https://eugeneyan.com/writing/llm-evaluators/
published: 2024-08-18
accessed: 2026-09-29
kind: blog
primary: false
---

## Summary

A long survey of about two dozen papers on using LLMs as graders. It sorts the choices into direct scoring vs pairwise comparison, correlation vs classification metrics, and API models vs fine-tuned evaluators, and reports what each paper found. The rough picture: judges beat old metrics like ROUGE, but correlation with humans is often low to moderate and short of human-human agreement, and results vary a lot by task. Secondary: it reports other people's results.

## Key claims

- Definition: "LLM-evaluators, also known as “LLM-as-a-Judge”, are large language models (LLMs) that evaluate the quality of another LLM’s response to an instruction or query." (intro)
- Why they're used: "conventional evals that rely on n-grams, semantic similarity, or a gold reference have become less effective at distinguishing good responses from the bad." (intro)
- The target: "we aim for the LLM-human correlation to match human-human correlation." (Key considerations)
- Direct scoring "is more suitable for objective assessments such as measuring faithfulness to a source text or detecting policy violations such as toxicity." (Key considerations)
- Pairwise "is typically used—and more reliable—for subjective evals such as persuasiveness, tone, coherence, etc." (Key considerations)
- Not interchangeable: "a response is either faithful to the provided context or it is not". (Key considerations)
- Binary outputs: "where possible, I have my evaluators return binary outputs. This improves model performance while making it easier to apply classification metrics." (Key considerations)
- Kappa scale: "Values of 0.21 - 0.40 can be interpreted as fair agreement while 0.41 - 0.60 suggest moderate agreement." (Key considerations)
- A summarization study: human expert correlation with the expert average was "0.8 - 0.9", higher than the gpt-3.5-turbo judge's correlation with humans "(0.3 - 0.6)". (Use cases)
- A factual-consistency study: the judge "identified >95% of consistent summaries" but "only identified 30 - 60% of the inconsistent summaries (low recall for defects)." (Use cases)
- Pairwise didn't help on factual consistency: "0.47 for pairwise vs. 0.46 for direct scoring" for gpt-4-turbo, and worse for gpt-3.5-turbo; the author suspects "this is because factual consistency evaluation is more objective than subjective." (Techniques)
- Percentage agreement can flatter: one judge "had percentage agreement of 80%, it’s Cohen’s $\kappa$ was only 0.62". (Critiques)
- Zheng et al.'s agreement numbers "could be high because the agreement metric doesn’t account for agreement due to random chance". (Critiques)
- Judges agree more with non-experts: "LLM-evaluators correlated better with non-expert annotators compared to expert annotators." (Critiques)
- The decision rule: objective task, use direct scoring, since "the better option from a pair might still be a defect"; subjective task, "pairwise comparisons will likely be more reliable." (summary)
- For production guardrails with low latency, "consider investing in finetuning a classifier or reward model". (summary)
- Development vs production: as an evaluator during development "you’ll likely evaluate only a few hundred samples and can tolerate the latency/cost of prompting an LLM API." (summary)

## Visuals worth redrawing

- The decision tree at the end (objective or subjective, then binary or scale, then which metric).

## My notes

- 2024, so the judges are GPT-4-era. The method advice still matches the 2025-2026 sources.
- The range often quoted from this post ("0.3 to 0.8") is my summary of several studies it reports, not a single number it gives. Cite the specific studies' ranges instead.
