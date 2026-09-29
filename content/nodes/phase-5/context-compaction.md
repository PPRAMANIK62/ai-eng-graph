---
id: context-compaction
title: What is context compaction?
depth: short
phase: 5
note: >-
  Shrinking old turns, by summary or by dropping tool output, so a long run fits in the window.
needs: [agent-memory, context-engineering]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# What is context compaction?

Context compaction shrinks the older part of a long agent run so the run
can keep going inside the [[context-window]]. There are two main ways: have
a model write a summary that replaces old turns, or just hide old tool
output the agent has already used. Summaries get most of the attention, but
on coding tasks the plain version did about as well for less money.

## Why a run outgrows its window

Picture a coding agent fixing a bug. Every step of its [[agent-loop]] adds
a thought, a tool call and the tool's output: a whole file, a long test
log, a directory listing. Fifty steps in, most of the context is old tool
output. The window is filling up, every call pays for all of it again, and
a fuller window makes the model less precise.

[[context-engineering]] introduced compaction as the "compress" move. Here
are the two ways to do it, and what's known about how they compare.

## Way one: summarize the old turns

A model reads the history and writes a summary. The summary replaces the
old turns, and the most recent turns are usually kept word for word so the
agent doesn't lose its footing. Claude Code, for example, summarizes the
history and carries on with that summary plus the five files it opened
most recently.

As of 2026-09, Claude's API can do this on the server, in beta. You can
ask for a summary whenever you choose, or set a token threshold (150,000
input tokens by default, at least 50,000) and let the API compact when a
request crosses it. The default prompt asks the model to write down the
state, next steps and what it learned, so a future context can continue.
You can replace that prompt when the default drops something you need. The
summary call is a real model call, billed like any other.

Summaries are hard to get right. Cognition argued for a separate model
whose only job is to compress a history into key details, events and
decisions, and has fine-tuned a smaller model for it.

## Way two: mask old tool output

The cheaper option leaves the agent's own reasoning and actions alone and
replaces old tool outputs with a short placeholder. In a 2025 JetBrains
study, anything the tools returned more than 10 turns ago became a line
like "Previous 8 lines omitted for brevity". The agent still sees what it
did and why, just not the raw output it already read.

![Three versions of the same agent run of 14 turns. Raw: every turn keeps its reasoning, tool call and full tool output. Observation masking: every turn keeps its reasoning and tool call, but tool outputs older than the last 10 turns become a one-line placeholder. LLM summary: the older turns are replaced by one model-written summary, and the last 10 turns are kept in full.](img/context-compaction-methods.svg)

The study ran a coding agent on SWE-bench Verified with several models
and compared both methods against doing nothing. Two of them:

| Model | Method | Solved | Cost per task |
|---|---|---|---|
| Qwen3-Coder 480B | Masking | 54.8% | $0.61 |
| Qwen3-Coder 480B | Summary | 53.8% | $0.64 |
| Gemini 2.5 Flash | Masking | 35.6% | $0.18 |
| Gemini 2.5 Flash | Summary | 36.0% | $0.24 |

For these two models, both cut cost a lot compared with the unmanaged
agent: masking by more than half, summaries by about 42% to 50%. Masking solved about as many tasks and
cost less. Two reasons came out of the
analysis:

- **The summary call costs money.** Up to 7.2% of a task's cost went on
  writing summaries, and each one reads a different stretch of history, so
  [[prompt-caching]] helps little.
- **Summaries made runs longer.** With Gemini, runs averaged 52 turns with
  summaries against 44 with masking. The authors' guess is that a
  tidy summary encourages the agent to keep going.

A mix did best: mask as the run goes, and summarize only as a last resort.
That cut cost a further 7% against masking alone and 11% against
summaries alone.

## Where it gets tricky

**A summary loses things.** Images, documents and fetched pages in the
summarized turns are gone once the summary replaces them. So are
instructions that arrived mid-conversation, since they're summarized along
with everything else. Restate anything a later turn still needs.

**The masking result is narrow.** It was measured on coding tasks, where
tool outputs are long and wordy. The authors say it may not hold where
tool outputs are short. It was also measured on SWE-bench Verified, a
benchmark OpenAI has since stopped reporting over flawed tests and
contamination (see [[agent-evals]]). The comparison between methods on the
same tasks still holds, but don't read the solve rates as current.

**Compaction doesn't carry anything across sessions.** It keeps one run
going. Anything that must survive the end of a session belongs in
[[agent-memory]], and the two work best together.

**Easy to get the plumbing wrong.** With Claude's on-demand compaction, if
you keep the summarized messages after the summary block, they're sent
again; if you drop the block, the model gets no summary. Neither raises an
error.

## What this means when you build

- Start with the cheap move: clear or mask old tool output.
- Add summaries only when masking isn't enough, and keep recent turns word
  for word.
- Write your own summary prompt that names what must survive (decisions,
  open bugs, the user's latest request), and test it on real long runs.
- Count the summary calls in your cost, and watch whether runs get longer.
- Put anything that must outlive the session in memory files, not only in
  the summary.

## Further reading

- [Compaction overview](https://platform.claude.com/docs/en/build-with-claude/compaction),
  Anthropic docs. Server-side summaries on demand or at a threshold, what
  they cost and what they drop, with links to each mode.
- [The Complexity Trap: Simple Observation Masking Is as Efficient as LLM Summarization for Agent Context Management](https://arxiv.org/abs/2508.21433),
  Lindenbauer et al. (JetBrains), 2025. The head-to-head test of masking
  against summaries, with costs and run lengths.
- [Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents),
  Walden Yan (Cognition), 2025. The case for a dedicated model that
  compresses long histories.
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents),
  Anthropic, 2025. How Claude Code compacts, and tool result clearing as
  the lightest form.
