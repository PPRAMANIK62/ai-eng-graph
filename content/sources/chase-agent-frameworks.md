---
id: chase-agent-frameworks
title: How to think about agent frameworks
author: Harrison Chase (LangChain)
url: https://www.langchain.com/blog/how-to-think-about-agent-frameworks
published: 2025-04-20
accessed: 2026-09-29
kind: blog
primary: false
---

## Summary

LangChain's CEO on workflows vs agents as a spectrum, why agents fail (mostly wrong context, not a weak model), and why he disagrees with OpenAI's practical guide on declarative graphs. A framework vendor (LangGraph) with a stake in the answer.

## Key claims

- Adopts Anthropic's definitions: workflows are "LLMs and tools orchestrated through predefined code paths", agents are where "LLMs dynamically direct their own processes and tool usage". (main text)
- Treats "agentic" as a spectrum rather than a yes/no. (main text)
- Production mix. "Nearly all of the 'agentic systems' we see in production are a combination of workflows and agents." (main text)
- The hard part of reliable agents is making sure the LLM has the right context at each step. (main text)
- Two reasons an LLM step fails: the model isn't good enough, or it was given the wrong or incomplete context; the second is the more common one in practice. (main text)
- Workflows give predictability; more agentic systems give flexibility and are less predictable. (main text)
- Argues OpenAI's guide mixes up "declarative vs imperative" with "workflows vs agent abstractions", and that the real value is reliable orchestration that gives the developer explicit control over context. (main text)

## Visuals worth redrawing

- The spectrum from workflow to agent.

## My notes

- Vendor view. Useful for the disagreement, not for numbers.
