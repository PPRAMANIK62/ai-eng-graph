---
id: husain-shankar-synthetic-data
title: "Q: What is the best approach for generating synthetic data?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/what-is-the-best-approach-for-generating-synthetic-data.html
published: 2025-06-01
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

One page of Husain and Shankar's AI Evals FAQ (modified 2026-09-01). It says when synthetic test inputs are worth using and how to make them varied: pick dimensions of user behavior, write tuples of dimension values by hand, have an LLM make more tuples, then turn each tuple into a natural query in a separate prompt. It also lists what synthetic data can't tell you.

## Key claims

- The common mistake: "prompting an LLM to "give me test queries" without structure, resulting in generic, repetitive outputs." (intro)
- When to use it: "to start error analysis before you have enough production traffic, or to test a known failure that appears rarely in real data." Then "run them through the full system, and review the resulting traces." (When should I use synthetic data for evals?)
- Limits: "Synthetic data cannot tell you how common a failure is in production. It can also miss details that matter in specialized domains. Compare synthetic examples with real data as soon as real data becomes available." (same)
- Dimensions: "categories that describe different aspects of user queries. Each dimension captures one type of variation in user behavior." Support bot example: Issue Type (billing, technical, general), Customer Mood (frustrated, neutral, happy), Prior Context (new issue, follow-up, resolved). (Define important dimensions first)
- "Start with failure hypotheses." If you have none, "use your application extensively or recruit friends to use it." (same)
- "Write 20 tuples by hand. Each tuple selects one value from each dimension." "This manual work helps you understand your problem space." (same)
- Two-step generation: first more tuples, then "In a separate prompt, turn each tuple into natural language". "This separation avoids repetitive phrasing." Example: (Vegan, Italian, Multi-step) becomes "I need a dairy-free lasagna recipe that I can prep the day before." (Scale with two-step generation)
- Cross product then filter "Guarantees coverage including edge cases". Direct LLM generation "produces more realistic combinations, but it tends toward generic outputs and misses rare scenarios." (Generation approaches)
- "Don’t generate synthetic data for issues you can fix immediately." If the prompt ignores dietary restrictions, "fix the prompt rather than generating specialized test queries." (Fix obvious problems first)
- Then run the queries through the real system and review about 100 diverse traces: "A pool of roughly 100 diverse traces is a useful starting point for failure discovery." (last paragraph)

## Visuals worth redrawing

- Dimensions → tuples → queries → traces, as a pipeline.

## My notes

- A companion FAQ page lists where synthetic data fails (specialized documents, low-resource languages, high-stakes domains, underrepresented user groups). Not used here, but worth a note if the article grows.
