---
id: husain-shankar-error-analysis
title: "Q: Why is “error analysis” so important in AI evals, and how is it performed?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html
published: 2025-06-27
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

One page of Husain and Shankar's AI Evals FAQ (modified 2026-09-01). It gives the four steps of error analysis: collect representative traces, write free-form notes on each (open coding), group the notes into a failure taxonomy and count them (axial coding), then refine with an agent's help until new traces stop showing new failures. It argues this step decides which evals are worth writing.

## Key claims

- Error analysis comes first. "Error analysis is the most important activity in evals. Error analysis helps you decide what evals to write in the first place." (intro)
- It finds failures specific to your app. "It allows you to identify failure modes unique to your application and data." (intro)
- Step 1, the dataset: "Gathering representative traces of user interactions with the LLM. If you do not have any data, you can generate synthetic data to get started." (1. Creating a Dataset)
- Step 2, open coding: a human reviewer writes "open-ended notes about traces, noting any issues." The method "is adapted from qualitative research methodologies." (2. Open Coding)
- Annotate yourself first: "Start by annotating at least 30 traces yourself before reviewing suggestions from an agent." (2. Open Coding)
- Note the first failure: "it is recommended to focus on noting the first failure observed in a trace, as upstream errors can cause downstream issues". (2. Open Coding)
- "A domain expert should be performing this step." Ideally one person, "a benevolent dictator". (2. Open Coding)
- Step 3, axial coding: "group similar failures into distinct categories. Axial coding is the most important step. At the end, count the number of failures in each category. You can use an LLM to help with this step." (3. Axial Coding)
- Step 4, refinement with an agent: after the first 30, let the agent search the rest for likely instances; "keep iterating until you reach theoretical saturation, meaning new reviews stop revealing failure modes or changing existing ones." (4. Iterative Refinement)
- Pool size: "A working pool of roughly 100 diverse traces is a useful guardrail for this human-agent loop." (4. Iterative Refinement)
- Repeat it: "You should frequently revisit this process." Smarter sampling includes "clustering, sorting by user feedback, and sorting by high probability failure patterns." (4. Iterative Refinement)
- Why not skip it: it keeps metrics "supported by real application behaviors instead of counter-productive generic metrics (which most platforms nudge you to use)." (last paragraphs)

## Visuals worth redrawing

- The page embeds a student's diagram of the process (Pawel Huryn). Our own version: traces → notes → categories → counts → evals.

## My notes

- "Open coding" and "axial coding" are terms from qualitative research (grounded theory); the page names the origin but doesn't go into it.
- The agent-assisted step is new in the 2026 edits; older versions of the FAQ describe a fully manual pass.
