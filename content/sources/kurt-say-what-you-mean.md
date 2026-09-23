---
id: kurt-say-what-you-mean
title: "Say What You Mean: A Response to 'Let Me Speak Freely'"
author: Will Kurt (.txt, the Outlines team)
url: https://blog.dottxt.ai/say-what-you-mean.html
published: 2024 (no date on the page; it calls the paper it answers, from 2024-08, "recent")
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

The Outlines team re-ran the tasks from "Let Me Speak Freely?" with the same model and found structured generation slightly *better* than free text, not worse. They argue the paper compared different prompts, gave the structured prompts too little information, leaned on an LLM to parse the free-text answers, and mixed up JSON mode with real constrained generation.

## Key claims

- The short answer. "For those needing a quick answer as to whether or not structured generation hurts performance: the answer is a clear no." (The Quick Rebuttal)
- Their re-run on Llama-3-8B-Instruct, unstructured vs structured: GSM8K 0.77 vs 0.78, Last Letter 0.73 vs 0.77, Shuffle Object 0.41 vs 0.44. (The Quick Rebuttal, Figure 2 table)
- The prompts weren't comparable. "The prompts used for unstructured (NL) generation are markedly different than the ones used for structured generation, so the comparisons are not apples-to-apples to begin with." (key issues list)
- The structured prompts didn't explain the task well enough. "The structured generation prompts do not provide the model with adequate information to solve the task" (key issues list)
- The paper parsed free-text answers with another LLM (claude-3-haiku-20240307); a handful of hand-written regexes beat that parser. "our hand crafted flexible regex parser outperforms a call to Claude (and is much faster and cheaper!)." (Issue #1: The AI Parser)
- JSON mode isn't structured generation. "It’s a common misunderstanding (one made by the paper) to think that structured generation is merely another name for JSON-mode" (Issue #1, end)
- Their definition of JSON mode. "JSON mode has no guarantees about the returned value" (footnote 1)
- Their structured runs keep a reasoning step: a regex lets the model write 30 to 250 characters of reasoning before the answer. "we are simply going to add structure for the reasoning step, and then append our answer regex to that." (Issue #1, end)
- With the same JSON prompt: structured JSON 0.77 vs unstructured JSON 0.73 (and structured natural language 0.68). "Once again we see that structured generation outperforms unstructured generation." (Figure 8 and text)

## Visuals worth redrawing

- The three-task bar chart (Figure 2): unstructured vs structured on GSM8K, Last Letter, Shuffle Object. Small and clear.

## My notes

- Not neutral: .txt builds Outlines and sells structured generation. The page says so plainly ("We here at .txt are passionate about structured generation").
- Only one small model (Llama-3-8B-Instruct). Says nothing about hosted APIs like Claude or GPT, whose constrained decoding is a separate implementation.
- Undated page; the server's last-modified header is 2026-06-23, which is a site rebuild, not the publish date.
- The fair reading of both sides: *how* you add structure matters (prompt, whether reasoning comes before the answer), more than structure itself.
