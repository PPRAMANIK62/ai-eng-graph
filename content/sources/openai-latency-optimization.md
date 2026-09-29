---
id: openai-latency-optimization
title: Latency optimization
author: OpenAI
url: https://developers.openai.com/api/docs/guides/latency-optimization
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI's guide to making LLM apps faster, organized as seven principles: process tokens faster, generate fewer tokens, use fewer input tokens, make fewer requests, parallelize, make your users wait less, and don't default to an LLM. Its most useful part is a rule of thumb for where time goes: output tokens dominate, input tokens barely matter unless the context is huge.

## Key claims

- The seven principles: "Process tokens faster", "Generate fewer tokens", "Use fewer input tokens", "Make fewer requests", "Parallelize", "Make your users wait less", "Don't default to an LLM". (section headings)
- Model size is the main driver of speed. "The main factor that influences inference speed is **model size**—smaller models usually run faster (and cheaper), and when used correctly can even outperform larger models." (Process tokens faster)
- Predicted outputs cut latency when much of the output is known in advance. Named as "**Predicted outputs**" in the list of options. (Process tokens faster)
- Output is the slow part. "Generating tokens is almost always the highest latency step when using an LLM: as a general heuristic, **cutting 50% of your output tokens may cut ~50% of your latency**." (Generate fewer tokens)
- Input is a small part. "cutting 50% of your prompt may only result in a 1–5% latency improvement" (Use fewer input tokens)
- Except for very large contexts. "Unless you're working with truly massive context sizes (documents, images), you may want to spend your efforts elsewhere." (Use fewer input tokens)
- Each request adds a round trip. "Each time you make a request, you incur some round-trip latency—this can start to add up." (Make fewer requests)
- Split independent steps into parallel calls. "If the steps are not strictly sequential, you can split them out into parallel calls" (Parallelize)
- The analogy for parallel calls. "Two shirts take just as long to dry as one." (Parallelize)
- Speculative execution for steps that are sequential: start step 1 and step 2 at the same time (e.g. input moderation and story generation), check step 1, and cancel step 2 if step 1 didn't come out as expected. "This is particularly effective for classification steps where one outcome is more likely than the others (for example, moderation)." (Parallelize)
- The opposite pressure: for sequential steps, consider "putting them in a single prompt and getting them all in a single response" to save round trips. (Make fewer requests)
- Worked example: once the reasoning prompt no longer depends on the retrieved context, "we can parallelize and fire it off at the same time as the retrieval prompts." (Example, Part 2)
- No numbers are given for how much time parallel calls save. (Parallelize; Example)
- Waiting vs watching. "There's a huge difference between **waiting** and **watching progress happen**—make sure your users experience the latter." (Make your users wait less)
- Streaming is the biggest single fix for perceived wait. "**Streaming**: The single most effective approach, as it cuts the _waiting_ time to a second or less." (Make your users wait less)
- Sometimes a classical method is faster. "faster classical method would be more appropriate" (Don't default to an LLM)

## Visuals worth redrawing

- None.

## My notes

- The 50% / 1–5% figures are heuristics, with no measurement setup given.
- The page redirects from platform.openai.com to developers.openai.com.
