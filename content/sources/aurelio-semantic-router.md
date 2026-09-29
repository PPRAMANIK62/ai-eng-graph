---
id: aurelio-semantic-router
title: Semantic Router (README)
author: Aurelio AI
url: https://github.com/aurelio-labs/semantic-router
published: undated
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

A Python library that routes without calling an LLM. You define each route by a handful of example phrases ("utterances"); the library embeds them, and at query time embeds the query and picks the closest route, or returns nothing if no route is close enough. Supports hosted and local encoders. As of 2026-09 it has a stable 0.x line and a 1.x rewrite in development.

## Key claims

- What it is: "a superfast decision-making layer for your LLMs and agents. Rather than waiting for slow LLM generations to make tool-use decisions, we use the magic of semantic vector space to make those decisions". (top)
- Routes are defined by example utterances, e.g. a `politics` route with five sample sentences and a `chitchat` route with five. (Quickstart)
- An encoder turns the utterances into vectors (Cohere, OpenAI, Hugging Face, FastEmbed and others). (Quickstart; Integrations)
- No match returns nothing: for an unrelated query "no decision could be made as we had no matches — so our route layer returned `None`!" (Quickstart)
- Thresholds can be trained: a "Route Optimization" notebook covers "How to train route layer thresholds to optimize performance". (Docs table)
- Versions: "The 0.x line (`v0` branch) is the current stable library"; "The 1.x line (`main` branch) is a breaking rewrite of the routing layer". (Versions)

## Visuals worth redrawing

- Query vector landing near one cluster of example utterances; an outlier query landing near none.

## My notes

- "Superfast" is a claim with no numbers in the README.
