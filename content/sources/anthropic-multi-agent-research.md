---
id: anthropic-multi-agent-research
title: How we built our multi-agent research system
author: Jeremy Hadfield, Barry Zhang, Kenneth Lien, Florian Scholz, Jeremy Fox, Daniel Ford (Anthropic)
url: https://www.anthropic.com/engineering/multi-agent-research-system
published: 2025-06-13
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

How Anthropic built the Research feature in Claude: a lead agent plans and spawns subagents that search in parallel, each in its own context window, then a citation agent attributes claims. Reports a big win over a single agent on an internal eval, explains it mostly by tokens spent, and is frank about the cost, the failure modes and where the approach fits badly.

## Key claims

- The result. "We found that a multi-agent system with Claude Opus 4 as the lead agent and Claude Sonnet 4 subagents outperformed single-agent Claude Opus 4 by 90.2% on our internal research eval." (Benefits of a multi-agent system)
- Where it wins: "breadth-first queries that involve pursuing multiple independent directions simultaneously." Example: finding all board members of the companies in the Information Technology S&P 500, which it did by decomposing into subagent tasks. (same)
- Why it wins. On BrowseComp, "three factors explained 95% of the performance variance", and "token usage by itself explains 80% of the variance, with the number of tool calls and the model choice as the two other explanatory factors". (same)
- Cost. "agents typically use about 4× more tokens than chat interactions, and multi-agent systems use about 15× more tokens than chats." "For economic viability, multi-agent systems require tasks where the value of the task is high enough to pay for the increased performance." (same)
- Where it fits badly. "some domains that require all agents to share the same context or involve many dependencies between agents are not a good fit for multi-agent systems today. For instance, most coding tasks involve fewer truly parallelizable tasks than research, and LLM agents are not yet great at coordinating and delegating to other agents in real time." (same)
- Compression. "Subagents facilitate compression by operating in parallel with their own context windows, exploring different aspects of the question simultaneously before condensing the most important tokens for the lead research agent." Each subagent also gives "separation of concerns". (same)
- Architecture: "orchestrator-worker pattern, where a lead agent coordinates the process while delegating to specialized subagents"; the lead saves its plan to memory; a CitationAgent finds the locations for citations. (Architecture overview for Research)
- Early failures. "Early agents made errors like spawning 50 subagents for simple queries, scouring the web endlessly for nonexistent sources, and distracting each other with excessive updates." Without detailed task descriptions, subagents duplicated work, e.g. several investigating the same aspects of a semiconductor shortage question. (Prompt engineering and evaluations for research agents)
- Scaling rules in the prompt: "Simple fact-finding requires just 1 agent with 3-10 tool calls, direct comparisons might need 2-4 subagents with 10-15 calls each, and complex research might use more than 10 subagents". (same)
- Parallel subagents plus parallel tool calls "cut research time by up to 90% for complex queries". (same)
- Evals: started with about 20 queries from real usage; one LLM judge call with a 0.0-1.0 score and pass/fail was most consistent; judge the end state rather than each turn. (Effective evaluation of agents)
- Production: "minor system failures can be catastrophic for agents"; they built resume-from-failure, and use rainbow deployments to avoid breaking running agents. The lead runs subagents synchronously, which "simplifies coordination, but creates bottlenecks". (Production reliability and engineering challenges)

## Visuals worth redrawing

- Lead agent fanning out to parallel subagents, each with its own context, results flowing back and then to a citation agent.

## My notes

- One internal eval, models from mid-2025 (Opus 4, Sonnet 4). The multi-agent system also spent far more tokens than the single agent, so the comparison isn't at equal compute.
