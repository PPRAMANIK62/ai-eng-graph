---
id: openai-practical-guide-agents
title: A practical guide to building agents
author: OpenAI
url: https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf
published: 2025-04
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI's 34-page PDF guide for teams building their first agents: what counts as an agent, which workflows are worth one, the model-tools-instructions trio, the run loop, single-agent vs multi-agent orchestration (manager and handoff patterns), guardrails, and when to hand control to a human. The PDF parsed to text with pdftotext (download with a browser user agent); the file's metadata gives 2025-04-07 as its creation date.

## Key claims

- What an agent is. "Agents are systems that independently accomplish tasks on your behalf." Apps that use an LLM but don't let it control the workflow, "think simple chatbots, single-turn LLMs, or sentiment classifiers—are not agents." (What is an agent?, p. 4)
- An agent "recognizes when a workflow is complete and can proactively correct its actions if needed. In case of failure, it can halt execution and transfer control back to the user." (p. 4)
- Where agents fit: workflows "where traditional deterministic and rule-based approaches fall short". Three signs: complex decision-making (e.g. refund approval), difficult-to-maintain rules (e.g. vendor security reviews), heavy reliance on unstructured data (e.g. a home insurance claim). (When should you build an agent?, p. 5)
- Worked contrast: a rules engine for payment fraud "works like a checklist", an agent "functions more like a seasoned investigator". (p. 5)
- The gate. "Before committing to building an agent, validate that your use case can meet these criteria clearly. Otherwise, a deterministic solution may suffice." (p. 6)
- The run loop. "Every orchestration approach needs the concept of a 'run', typically implemented as a loop that lets agents operate until an exit condition is reached. Common exit conditions include tool calls, a certain structured output, errors, or reaching a maximum number of turns." (Single-agent systems, p. 14)
- In the Agents SDK, `Runner.run()` loops until a final-output tool is called or "The model returns a response without any tool calls". "This concept of a while loop is central to the functioning of an agent." (p. 15)
- Incremental. "While it's tempting to immediately build a fully autonomous agent with complex architecture, customers typically achieve greater success with an incremental approach." (Orchestration, p. 13)
- Single agent first. "Our general recommendation is to maximize a single agent's capabilities first." (When to consider creating multiple agents, p. 16)
- Split when: prompts have many if-then-else branches, or tool overload. "Some implementations successfully manage more than 15 well-defined, distinct tools while others struggle with fewer than 10 overlapping tools." (p. 16)
- Two multi-agent shapes: manager (agents as tools) and decentralized (handoffs). "In the manager pattern, edges represent tool calls whereas in the decentralized pattern, edges represent handoffs that transfer execution between agents." (Multi-agent systems, p. 17)
- Prefers code-first orchestration over declarative graphs, which it says "can quickly become cumbersome and challenging as workflows grow more dynamic and complex". (Declarative vs non-declarative graphs, p. 20)
- Human intervention triggers: "Exceeding failure thresholds" (limits on retries or actions) and "High-risk actions" such as "canceling user orders, authorizing large refunds, or making payments." (Plan for human intervention, p. 31)
- Conclusion: start "with a single agent and evolving to multi-agent systems only when needed." (Conclusion, p. 32)

## Visuals worth redrawing

- Manager pattern (translate "hello" into three languages via three agents-as-tools) vs decentralized triage handoff.

## My notes

- A vendor guide that also sells the Agents SDK. No numbers, and no head-to-head of agent vs workflow.
- LangChain's Harrison Chase argues with its declarative-vs-code framing (see chase-agent-frameworks).
