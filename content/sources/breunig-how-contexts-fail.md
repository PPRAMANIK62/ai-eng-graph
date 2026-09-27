---
id: breunig-how-contexts-fail
title: How Long Contexts Fail
author: Drew Breunig
url: https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html
published: 2025-06-22
accessed: 2026-09-27
kind: blog
primary: false
---

## Summary

A short post that names four ways a long context goes wrong: poisoning, distraction, confusion and clash. Each comes with a number from someone else's study. The point is that a bigger window doesn't remove the need to manage what's in it.

## Key claims

- Context poisoning. "When a hallucination or other error makes it into the context, where it is repeatedly referenced." (Context Poisoning)
- Context distraction. "When a context grows so long that the model over-focuses on the context, neglecting what it learned during training." (Context Distraction)
- Gemini 2.5 playing Pokémon: "as the context grew significantly beyond 100k tokens, the agent showed a tendency toward favoring repeating actions from its vast history" (Context Distraction)
- Context confusion. "When superfluous content in the context is used by the model to generate a low-quality response." (Context Confusion)
- Too many tools: "When they gave a quantized (compressed) Llama 3.1 8b a query with all 46 tools it failed"; "But when they only gave the model 19 tools, it succeeded." (Context Confusion)
- Context clash. "When you accrue new information and tools in your context that conflicts with other information in the context." (Context Clash)
- Splitting a prompt across turns hurts: "The sharded prompts yielded dramatically worse results, with an average drop of 39%." and "OpenAI's vaunted o3's score dropped from 98.1 to 64.1" (Context Clash, citing Microsoft/Salesforce, arXiv 2505.06120)
- "Long contexts do not generate better responses. Overloading your context can cause your agents and applications to fail in surprising ways." (body)
- The Pokémon agent's poisoned goals: it could "become fixated on achieving impossible or irrelevant goals" (Context Poisoning)

## Visuals worth redrawing

- None.

## My notes

- "Sharded" in the Microsoft/Salesforce study means the task's details were split across several messages instead of given all at once (my reading of the post's description, not a quote).

- Secondary: every number is from another study (Gemini 2.5 report, Berkeley Function-Calling Leaderboard work, Microsoft/Salesforce). I didn't open those; present the numbers as reported examples, dated 2025.
- Follow-up post "How to Fix Your Context" (2025-06-26) lists six fixes; opened but not used.
