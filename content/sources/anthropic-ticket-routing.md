---
id: anthropic-ticket-routing
title: Ticket routing
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

A use-case guide for routing support tickets with Claude: when an LLM beats a traditional ML classifier, how to define intent categories, which success criteria to set, a classification prompt with reasoning then intent in XML tags, an evaluation function for accuracy and cost, and ways to improve (a hierarchy of classifiers for 20+ intents, retrieving similar examples from a vector database, and edge cases). Recommends `claude-haiku-4-5-20251001`.

## Key claims

- When to use an LLM over traditional ML: limited labeled data ("with just a few dozen labeled examples"), categories that change, unstructured text, rules based on meaning, need for explanations, edge cases, and many languages. (Define whether to use Claude for ticket routing)
- Categories decide accuracy. "Claude’s ability to route tickets effectively within your system is directly proportional to how well-defined your system’s categories are." (Define user intent categories)
- Routing uses more than intent: "urgency, customer type, SLAs, or language". (same)
- Example LLM-specific success criteria: consistency "of 95% or higher" on standard inputs, at least 80% accuracy on an edge-case set, no more than 5–10% drop for non-primary languages. General ones: routing accuracy "Industry benchmarks often aim for 90–95% accuracy", rerouting rate "below 10%". (Establish success criteria)
- Model choice: "Many customers have found claude-haiku-4-5-20251001 an ideal model for ticket routing, as it is the fastest and most cost-effective model in the Claude 4 family"; use the larger Sonnet model for deep expertise, many intents or complex reasoning. (Choose the right Claude model)
- "Ticket routing is a type of classification task." (Build a strong prompt)
- The prompt asks for reasoning in `<reasoning>` tags then one label in `<intent>` tags, with few-shot examples, and the code pulls both out with regular expressions. (Build a strong prompt; Deploy your prompt)
- Example thresholds: "Accuracy: 95% (out of 100 tests)". (Run your evaluation)
- Hierarchy for many intents: for "20+ intent categories", organize intents as a tree with "a series of classifiers at every level of the tree, enabling a cascading routing approach." Pro: "greater nuance and accuracy". Con: "multiple classifiers can lead to increased latency". (Use a taxonomic hierarchy)
- Retrieved examples: pulling the most similar labeled examples from a vector database "has been shown to improve performance from 71% accuracy to 93% accuracy." (Use vector databases and similarity search retrieval)
- Known failure modes: implicit requests ("I've been waiting for my package for over two weeks now"), "Claude prioritizes emotion over intent", and multiple issues in one ticket. (Account specifically for expected edge cases)
- Integration: push-based (webhook from the ticket system) vs pull-based (poll on a schedule). (Integrate Claude into your greater support workflow)
- The regex step in its own words: "Having Claude split its response into separate XML tag sections lets you use regular expressions to extract the reasoning and intent from the output independently." The code returns an empty string if the `<intent>` tag is missing, and scores by exact string match against the true intent. (Build a strong prompt; Deploy your prompt; Build an evaluation function)
- Why a hierarchy past 20 intents: "As the number of classes grows, the number of examples required also expands, potentially making the prompt unwieldy." (Use a taxonomic hierarchy)

## Visuals worth redrawing

- The taxonomic hierarchy: a top-level classifier fanning out to sub-classifiers.

## My notes

- The 71% → 93% figure points to the classification cookbook, which itself reports ~70% → 94% (97% with chain of thought) on 68 test examples. Small test set.
- Parsing labels with regex conflicts with Anthropic's tool-use advice; a tool with an enum or structured output is the current way.
