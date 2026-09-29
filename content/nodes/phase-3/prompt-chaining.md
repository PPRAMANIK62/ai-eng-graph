---
id: prompt-chaining
title: What is prompt chaining?
depth: short
phase: 3
note: >-
  The output of one LLM call becomes the input to the next, with checks in between.
needs: [llm-workflows]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# What is prompt chaining?

Prompt chaining splits a task into a fixed sequence of LLM calls, where
each call works on the output of the one before. Between calls, your code
can check the result and stop if something's off. It's the simplest of
the [[llm-workflows]], and in code it's little more than a loop over
prompts.

## Outline, check, write

Say you want a model to write a short technical document. One prompt
could ask for the whole thing. A chain splits it:

1. **Call 1** writes an outline.
2. **A gate in code** checks the outline against your rules: does it have
   the sections you require, is it under the length limit? If not, stop
   (or retry) before spending tokens on the full text.
3. **Call 2** writes the document from the approved outline.

![A three-step prompt chain. Call 1 writes an outline. A gate in code checks the outline against fixed rules; if it fails, the chain stops or retries. If it passes, call 2 writes the document from the outline. Each arrow carries the previous step's output as the next step's input.](img/prompt-chaining-outline-chain.svg)

Another common shape: write marketing copy, then translate it. The
steps are known before you see any input. That's what makes it a chain
and not an agent.

## Why chain at all

Each call gets a smaller, easier job. You trade latency (several calls in
a row instead of one) for accuracy.

The other reason is visibility. Each step is a separate API call, so you
can log it, evaluate it on its own, or branch on its result. When the
final output is bad, you can see which step went wrong. With one big
prompt you only see the end result.

The gate matters as much as the calls. A bad outline fed into call 2 turns
into a bad document with nothing to catch it. A cheap check in code
between steps stops that. It can be as simple as parsing the output
against a schema ([[structured-output]]).

Chaining fits when the task splits cleanly into steps you can name ahead
of time. If you can't say what the steps are until you see the input,
look at [[routing]] or an agent instead.

## Where it gets tricky

**It may matter less on current models.** In Anthropic's 2024 guidance,
chaining was a main way to get better accuracy out of a model. Its 2026
prompting guide is more cautious: Claude, with adaptive thinking, handles
most multistep reasoning inside one call, and explicit chaining is kept
for when you need to inspect intermediate outputs or enforce a fixed
pipeline. The dates explain most of the gap. In between came
[[reasoning-models]], which do their own step-by-step work
([[chain-of-thought]]) before answering.

So the old reason ("the model can't do it all at once") is weaker, and
the other reason (you can see, test and control each step) is unchanged.
We found no published measurement comparing one call with a chain on
2025–2026 models. If accuracy is your reason to chain, measure it on your
own task.

**The most common chain now is a review loop.** As of 2026-09, the chain
Anthropic calls most common is generate a draft, review it against
criteria, then refine. That's the [[evaluator-optimizer]] pattern written
as three fixed steps. Whether the review step helps depends on what the
reviewer can check against, which that article covers.

**Every step adds latency.** Calls in a chain run one after another, so
their times add up. If two steps don't depend on each other, run them at
the same time instead ([[parallel-calls]]).

## What this means when you build

- Chain only when the steps are fixed and you can name them.
- Put a check in code after every step whose output feeds the next.
- Log each step's input and output. That's most of the benefit.
- Try the one-call version first and compare. Keep the chain only if your
  eval says it wins, or if you need the intermediate outputs anyway.

## Further reading

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents),
  Erik Schluntz and Barry Zhang (Anthropic), 2024. The definition of
  prompt chaining, the gate between steps, when to use it, and examples.
- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices),
  Anthropic docs, current as of 2026-09. The "Chain complex prompts"
  section: the newer, narrower case for chaining, and the draft, review,
  refine chain.
