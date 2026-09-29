---
id: letta-agent-memory
title: "Agent Memory: How to Build Agents That Learn and Remember"
author: Letta
url: https://www.letta.com/blog/agent-memory/
published: 2025-07-07
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Letta, a company that builds agent memory tooling, explains agent memory as managing what's in the context window over time. It names four kinds: the message buffer (recent turns), core memory (small editable blocks kept in context), recall memory (the full searchable history) and archival memory (processed knowledge in an external store). It argues retrieval is a tool for memory, not memory itself, and describes background "sleep-time" agents that tidy memory.

## Key claims

- Definition. "Agent memory is what and how your agent remembers information over time." (What is Agent Memory?)
- Stateless models. "Traditional LLMs operate in a stateless paradigm — each interaction exists in isolation, with no knowledge carried forward from previous conversations." (intro)
- The window decides. "What your agent 'remembers' is fundamentally determined by what exists in its context window at any given moment." (intro)
- Message buffer. "The message buffer stores the most recent messages in a conversation." (Types of Agent Memory)
- Core memory. "Core memory consists of in-context memory blocks that can be managed by the agent itself." One block might hold user preferences, another "the agent's persona or current objectives". (Types of Agent Memory)
- Recall memory. "Recall memory preserves the complete history of interactions that can be searched and retrieved when needed, even when not in the active context window." (Types of Agent Memory)
- Archival memory. "Archival memory represents explicitly formulated knowledge stored in external databases." (Types of Agent Memory)
- Self-editing. "Agents can update their own memory blocks based on new information, using tools to rewrite specific blocks." (Managing Memory Blocks)
- Eviction. "Evicted messages undergo recursive summarization—they're summarized along with existing summaries from previously summarized messages." (Message Eviction & Summarization)
- RAG is not memory. "While retrieval (or RAG) is a tool for agent memory, it is not 'memory' in of itself." (Techniques for Agent Memory)
- MemGPT: "MemGPT (MemoryGPT) is a system that intelligently manages different storage tiers to effectively provide extended context within the LLM's limited context window." (body)
- Archival storage is often vector search: "Memories are saved, embedded, and queried via vector search" (body)
- Sleep-time. "Sleep-time agents handle memory management asynchronously, improving both response times and memory quality." (Engineering Systems for Agent Memory)

## Visuals worth redrawing

- The four memory types, in context vs out of context.

## My notes

- A vendor post; no author shown. The taxonomy matches MemGPT's paper, which it cites. The page doesn't say Letta's team made MemGPT, so don't claim it.
