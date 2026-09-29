---
id: yao-tau-bench
title: "τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains"
author: Shunyu Yao, Noah Shinn, Pedram Razavi, Karthik Narasimhan
url: https://arxiv.org/abs/2406.12045
published: 2024-06-17
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

A benchmark where a model plays the user and chats with a tool-using agent in retail and airline support, under written policies. It grades the database state at the end, not the words, and introduces pass^k: does the agent succeed on all k tries of the same task.

## Key claims

- Setup: "a user (simulated by language models) and a language agent provided with domain-specific API tools and policy guidelines." (Abstract)
- Grading the end state: it "compares the database state at the end of a conversation with the annotated goal state." (Abstract)
- New metric: "(pass^k) to evaluate the reliability of agent behavior over multiple trials." (Abstract)
- Results (2024): "even state-of-the-art function calling agents (like gpt-4o) succeed on <50% of the tasks, and are quite inconsistent (pass^8 <25% in retail)." (Abstract)

## Visuals worth redrawing

- pass^k falling as k grows.

## My notes

- τ²-bench (2025) is the follow-up; not opened for this note.
