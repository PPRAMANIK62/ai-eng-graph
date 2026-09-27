---
id: anthropic-reduce-hallucinations
title: Reduce hallucinations
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations
published: undated (docs page, checked 2026-09-23)
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

A short practical guide from Anthropic on cutting down made-up answers in Claude's output. Basic moves: give the model permission to say "I don't know", have it pull word-for-word quotes before answering from long documents, and make it back every claim with a quote (and retract claims it can't back). Advanced moves: step-by-step reasoning, running the same prompt several times and comparing, iterative checking, and restricting it to the provided documents. It ends by saying none of this removes hallucinations entirely.

## Key claims

- Definition used. "Even the most advanced language models, like Claude, can sometimes generate text that is factually incorrect or inconsistent with the given context." (intro)
- Allow uncertainty. "Explicitly give Claude permission to admit uncertainty. This simple technique can drastically reduce false information." (Basic strategies, Allow Claude to say I don't know)
- Quotes first for long documents. "For tasks involving long documents (>20k tokens), ask Claude to extract word-for-word quotes first before performing its task." (Basic strategies, Use direct quotes for factual grounding)
- Verify with citations, and retract what can't be supported. "If it can't find a quote, it must retract the claim." (Basic strategies, Verify with citations)
- Chain-of-thought as a check. "Ask Claude to explain its reasoning step-by-step before giving a final answer. This can reveal faulty logic or assumptions." (Advanced techniques)
- Best-of-N. "Run Claude through the same prompt multiple times and compare the outputs. Inconsistencies across outputs could indicate hallucinations." (Advanced techniques)
- Iterative refinement: feed outputs back and ask the model to verify or expand them. (Advanced techniques)
- Restrict knowledge. "Explicitly instruct Claude to only use information from provided documents and not its general knowledge." (Advanced techniques)
- Limits. "while these techniques significantly reduce hallucinations, they don't eliminate them entirely." (closing note)
- Give it the words to use. The M&A example prompt ends: "If you're unsure about any aspect or if the report lacks necessary information, say "I don't have enough information to confidently assess this."" (Allow Claude to say I don't know, example; re-checked 2026-09-27)
- Quotes-first with an explicit empty case. "If you can't find relevant quotes, state "No relevant quotes found."" then "Only base your analysis on the extracted quotes." (Use direct quotes, privacy policy example; re-checked 2026-09-27)
- Retracted claims are marked, not silently dropped: "remove that claim from the press release and mark where it was removed with empty [] brackets." (Verify with citations, example; re-checked 2026-09-27)

## Visuals worth redrawing

- None. The three example prompts (M&A report, privacy policy audit, press release) are good as short text boxes.

## My notes

- No numbers anywhere on the page. "Drastically reduce" is the vendor's claim, not a measured result.
- Best-of-N as a detector is the same idea as SelfCheckGPT in `weng-extrinsic-hallucinations`: facts the model really knows tend to come out the same across samples.
- The grounding moves here (quotes, citations, only-use-these-docs) overlap with the `grounding` node, which is the planned compare_with for hallucination.
