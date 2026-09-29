---
id: cognition-dont-build-multi-agents
title: Don't Build Multi-Agents
author: Walden Yan (Cognition)
url: https://cognition.com/blog/dont-build-multi-agents
published: 2025-06-12
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Cognition's case against splitting work across parallel agents: agents should share full context, because actions carry implicit decisions. For very long tasks, it proposes a separate model whose job is to compress the history into key details, events and decisions. The author narrowed his position in 2026 ("Multi-Agents: What's Actually Working").

## Key claims

- A compression model for long tasks: "we introduce a new LLM model whose key purpose is to compress a history of actions & conversation into key details, events, and decisions." (passage on "truly long-duration tasks")
- It's hard. "This is _hard to get right._ It takes investment into figuring out what ends up being the key information and creating a system that is good at this." (same passage)
- Fine-tuned compressor. "Depending on the domain, you might even consider fine-tuning a smaller model (this is in fact something we've done at Cognition)." (same passage)
- Simple first. "To be honest, the simple architecture will get you very far" (same passage)
- Principle 1. "Share context, and share full agent traces, not just individual messages" (main text)
- Principle 2. "Actions carry implicit decisions, and conflicting decisions carry bad results" (main text)
- Flappy Bird example: the task "build a Flappy Bird clone" is split in two. One subagent builds a background that "looks like Super Mario Bros.", the other builds a bird that "doesn't look like a game asset and it moves nothing like the one in Flappy Bird"; "the final agent is left with the undesirable task of combining these two miscommunications." (main text)
- Recommended default: a single-threaded linear agent, where the context stays continuous. (main text)
- On subagents: "The subtask agent lacks context from the main agent that would otherwise be needed to do anything beyond answering a well-defined question." (main text)
- Criticizes OpenAI's Swarm and Microsoft's AutoGen for pushing multi-agent architectures: "Libraries such as OpenAI's Swarm and Microsoft's AutoGen actively push concepts which I believe to be the wrong way of building agents." (main text)
- Edit-apply history: small apply models would "misinterpret the instructions of the large model and make an incorrect edit due to the most slight ambiguities in the instructions"; deciding and applying an edit is now more often done by one model in one action. (main text)

## Visuals worth redrawing

- None for compaction.

## My notes

- Only the compaction part was checked for this note. The multi-agent argument belongs to the multi-agent node.
