---
id: husain-shankar-how-many-annotators
title: "Q: How many people should annotate my LLM outputs?"
author: Hamel Husain and Shreya Shankar
url: https://hamel.dev/blog/posts/evals-faq/how-many-people-should-annotate-my-llm-outputs.html
published: 2025-05-31        # modified 2026-09-01
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

One page of the AI Evals FAQ. For most small and medium companies, one domain expert (a "benevolent dictator") should set the quality bar and label outputs. Add more annotators only when you need to, and then measure their agreement and fix the rubric where they disagree.

## Key claims

- One expert: "For most small to medium-sized companies, appointing a single domain expert as a “benevolent dictator” is the most effective approach. This person becomes the definitive voice on quality standards." (first paragraph)
- Examples: "a psychologist for a mental health chatbot or a lawyer for legal document analysis." (first paragraph)
- Why: "A single expert eliminates annotation conflicts and prevents the paralysis that comes from “too many cooks in the kitchen”." (second paragraph)
- Scope signal: "If you feel like you need five subject matter experts to judge a single interaction, it’s a sign your product scope might be too broad." (second paragraph)
- More people: organizations "operating across multiple domains (like a multinational company with different cultural contexts) may need multiple annotators. When you do use multiple people, you’ll need to measure their agreement using metrics like Cohen’s Kappa, which accounts for agreement beyond chance." (third paragraph)
- Resolving disagreement: "Have annotators label the same examples independently before they discuss them. Measure agreement and collect the cases where their labels differ." Then "Update the rubric with a definition, rule, or example that covers the disputed case. Then relabel affected examples. If the annotators still disagree, assign a domain expert to make the final decision and record the reason." (How should annotators resolve disagreements?)

## Visuals worth redrawing

- None.

## My notes

- Short, current page. Pairs with hosking-human-feedback-not-gold: an expert with time beats quick crowd ratings, but nobody is infallible.
