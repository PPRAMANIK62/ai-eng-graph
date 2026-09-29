---
id: openai-voice-agents
title: Voice agents (OpenAI API docs)
author: OpenAI
url: https://developers.openai.com/api/docs/guides/voice-agents
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI's page on choosing how to build a voice agent. As of 2026-09 it
offers three shapes: GPT-Live (a full-duplex voice model that hands the
thinking to a separate text backend), the Realtime API (one model hears,
decides and speaks), and a chained pipeline of speech-to-text, a text agent
and text-to-speech that you control stage by stage. It also says how to
evaluate and time a voice agent. The page has no date.

## Key claims

- The main choice. "The key design choice is how speech connects to reasoning and tools: a continuous conversation with a separate backend, a single voice model, or a pipeline you control stage by stage." (intro)
- Realtime API, one model. "Use one model to interpret audio, decide what to do, and respond in speech." (Choose the right architecture, table)
- Chained pipeline. "Inspect or transform intermediate text and replace each component independently." (Choose the right architecture, table)
- GPT-Live. "Keep your existing text workflow and choose its backend independently while the conversation continues." (Choose the right architecture, table)
- Full duplex. "GPT-Live can listen and speak at the same time, a capability called full duplex ." "Users can keep talking while backend work runs." (Build a full-duplex voice agent)
- The Realtime session does the turn-taking for you. "The session handles audio turns, tools, interruptions, and handoffs." (Build a speech-to-speech voice agent)
- When to chain. "Use this path when each stage needs to be visible or replaceable. For example, you might store the transcript, run policy checks before the text agent responds, call internal systems, then generate speech only after the workflow reaches an approved answer." (Build a chained voice workflow)
- Evaluate the task, not only the talk. "Test both the conversation and the completed task. For a booking assistant, listen to the confirmation and check that the correct appointment was saved." (Evaluate your voice agent)
- What to compare between runs. "Repeat scenarios and compare task completion, audible response latency, interruptions, and unwanted silence." (Evaluate your voice agent)
- Test input across hard cases. "Test input recognition across accents, background noise, language switches, names, and numbers." (Evaluate your voice agent)
- How to measure latency. "Measure how long callers wait for a useful spoken answer. Track backend time separately to find delays, and compare the median and 95th percentile across similar calls." (Measure latency)
- Fillers are not answers. "Measure acknowledgments such as "I'm checking" separately from the answer the caller needs." (Measure latency)
- The rest is a normal agent. "The voice surface changes the transport and audio loop, but the core workflow decisions are the same" (Voice agents still use the same core agent building blocks)

## Visuals worth redrawing

- None; the architecture table is text.

## My notes

- No latency numbers or cost comparison on this page. For those, see kramer-voice-ai-primer.
- GPT-Live is new as of 2026-09. Product names here will date quickly.
