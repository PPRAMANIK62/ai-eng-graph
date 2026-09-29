---
id: cognition-multi-agents-working
title: "Multi-Agents: What's Actually Working"
author: Walden Yan (Cognition)
url: https://cognition.com/blog/multi-agents-working
published: 2026-04-22
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Ten months after "Don't Build Multi-Agents", the same author reports which multi-agent setups did work at Cognition: ones where extra agents add intelligence (reviewing, advising, planning) while only one agent writes. Three patterns: a separate code-review agent, a "smart friend" model to escalate to, and a manager that delegates to child agents. Open problems are all about communication.

## Key claims

- The revision. "10 months ago, I wrote Don't Build Multi-Agents, arguing that most people shouldn't try to build multi-agent systems." Now: "we've found a narrower class of patterns that do: setups where multiple agents contribute intelligence to a task while writes stay single-threaded." (opening)
- The rule. "multi-agent systems work best today when writes stay single-threaded and the additional agents contribute intelligence rather than actions." (main text)
- What's common: "most multi-agent setups in the world are limited to 'readonly' subagents, like web search subagents and code search subagents." (main text)
- Code review loop: a separate review agent reads the code without the coder's context. "Devin Review catches an average of 2 bugs per PR, of which roughly 58% are severe (logic errors, missing edge cases, security vulnerabilities)." A fresh context helps because it avoids the context rot of the long coding session. (main text)
- Smart friend: a primary model escalates hard parts to a stronger one. "SWE 1.5 was not good enough at being the primary model for this setup to really work." "Where the pattern did work, and worked well, was across frontier models." (main text)
- Manager-workers: "A manager Devin can break a larger task into pieces, spawn child Devins to work on them, and coordinate their progress through an internal MCP." Problems: managers "default to being overly prescriptive", and cross-agent communication "doesn't happen by default." (main text)
- Still a distraction: the "unstructured-swarm approach, arbitrary networks of agents negotiating with each other". (main text)
- Context: share as much as possible between the agents so they stay on the same page. (main text)
- "The open problems are all communication problems." (end)

## Visuals worth redrawing

- One writer in the middle, several read-only helpers around it (reviewer, advisor, searchers).

## My notes

- The phrase "single writer, many readers" used in our candidates list is a summary, not a quote from the post. The post says "writes stay single-threaded".
