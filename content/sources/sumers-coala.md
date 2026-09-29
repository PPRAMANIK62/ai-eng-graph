---
id: sumers-coala
title: Cognitive Architectures for Language Agents
author: Theodore R. Sumers, Shunyu Yao, Karthik Narasimhan, Thomas L. Griffiths
url: https://arxiv.org/abs/2309.02427
published: 2023-09-05
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

CoALA is a framework paper that borrows from cognitive science to describe language agents: memory modules, actions that read and write memory or act on the world, and a decision loop. Its split into working memory and three kinds of long-term memory (episodic, semantic, procedural) is the vocabulary much later memory writing uses. Revised 2024-03-15 (v3). Section details from the HTML version.

## Key claims

- CoALA "describes a language agent with modular memory components, a structured action space to interact with internal memory and external environments, and a generalized decision-making process to choose actions." (Abstract)
- Working memory. "Working memory maintains active and readily available information as symbolic variables for the current decision cycle." (Section 4.1)
- Episodic. "Episodic memory stores experience from earlier decision cycles." (Section 4.1)
- Semantic. "Semantic memory stores an agent's knowledge about the world and itself." (Section 4.1)
- Procedural. "Language agents contain two forms of procedural memory: implicit knowledge stored in the LLM weights, and explicit knowledge written in the agent's code." (Section 4.1)
- Reading. Episodes "may be retrieved into working memory to support reasoning." (Section 4.1)
- Writing. "An agent can also write new experiences from working to episodic memory as a form of learning." (Section 4.1)

## Visuals worth redrawing

- None needed; the four memory types fit in a table.

## My notes

- A taxonomy, not a benchmark. Doesn't go stale quickly.
