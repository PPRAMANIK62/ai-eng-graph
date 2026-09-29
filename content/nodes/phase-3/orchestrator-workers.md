---
id: orchestrator-workers
title: What is the orchestrator-workers pattern?
depth: short
phase: 3
note: >-
  One LLM call splits a task into subtasks it picks at run time, worker calls do them, and the results are combined.
needs: [llm-workflows]
leads_to: []
compare_with: [multi-agent]
updated: 2026-09-29
---

# What is the orchestrator-workers pattern?

In the orchestrator-workers pattern, one LLM call reads the task and
decides how to split it. Your code then sends each piece to a worker call,
and a last step combines what the workers wrote. It's one of the
[[llm-workflows]], and the one to reach for when you can't know the
subtasks until you've seen the input.

## One question, a plan made on the spot

Say someone asks a docs assistant: "How do I build a RAG chatbot?" The
answer needs several concepts, but which ones depends on the question. A
question about evaluation needs different pieces than one about
deployment.

1. **The orchestrator** gets the question and returns a plan: a short
   list of subtasks, each with a description. Here that might be "explain
   chunking", "explain embeddings", "explain the vector index", "explain
   how to test it". The list comes back in a fixed format (XML tags, or
   JSON) so code can read it.
2. **Your code** parses the list and calls a worker once per subtask.
   Each worker gets the original question and its own subtask, so it
   knows what the piece is for.
3. **A synthesizer call** reads all the worker outputs and writes one
   answer.

![The orchestrator-workers pattern on a docs question. The orchestrator call reads the question and returns a list of subtasks; how many and which ones are decided at run time. Code calls one worker per subtask, with the original question and that subtask. A synthesizer call combines the worker outputs into one answer. The orchestrator plans once and the workers each answer once; code runs the loop.](img/orchestrator-workers-flow.svg)

The model decides *what* the subtasks are. Your code still decides *how*
the work runs: plan once, fan out, combine once, stop. That's why it
counts as a workflow and not an agent.

## How it differs from parallelization

On a diagram it looks the same as [[parallel-calls|parallelization]]:
one input fans out to several calls, and the results come back together.
The difference is who writes the list of subtasks.

- **Parallelization:** you write the subtasks in code. Every input gets
  the same ones, like "answer" and "screen for abuse".
- **Orchestrator-workers:** a model writes the subtasks for this input.
  Another input gets a different list, maybe a longer one.

So use it when the split really depends on the input. Anthropic's
examples are a coding tool that has to change several files, where how
many files and what changes in each depend on the task, and a search
task that has to gather and compare information from several sources. If every input splits the same
way, write the split in code and use plain parallel calls. That's
cheaper and easier to test.

## Between a workflow and an agent

This pattern sits closest to an agent, because a model is making a
planning decision. But it stops there. In an [[agent-loop|agent]], the
model uses tools in a loop and keeps deciding what to do next based on
what comes back, for as many steps as it takes. Here the orchestrator
plans once, and each worker is a single call.

When the orchestrator and the workers are agents themselves, each running
its own loop with tools, you have a [[multi-agent]] system. It's the same
shape with more freedom, and with the costs agents bring: higher spend
and errors that compound.

## Where it gets tricky

**The plan is the weak point.** If the orchestrator splits the task
badly, every worker does the wrong job well. Anthropic's cookbook lists
this as the first failure mode and says prompt engineering for the
orchestrator is critical. Test the plans on their own before you test
the final answers.

**The plan has to parse.** The orchestrator's output drives your code,
so a malformed list means missing work. The cookbook reads XML tags and
warns that parsing fails when the model doesn't follow the format, and
suggests JSON instead. A strict schema ([[structured-output]]) goes a step
further.

**The cookbook version is a sketch.** Its class says it runs subtasks in
parallel, but the code calls the workers one after another, and the
notebook admits it. It also has no combining step: it returns the list
of worker outputs and names synthesis as a next step. An empty worker
reply gets swapped for an error string, with no retry. Add all three
before you ship something like it.

**It costs one call per subtask, plus the plan.** That's N+1 calls
before the synthesizer, and the orchestrator is the one choosing N.
Put a cap on the number of subtasks in the prompt and in code. One suggestion from the cookbook: a strong model for the
orchestrator, a cheaper one for the workers.

**The guidance is from 2024.** The pattern comes from Anthropic's
2024-12 post, which now carries a note that much of the tooling it
describes has changed. The idea still holds, but check your provider's
current docs for how they'd build it now.

## What this means when you build

- Use it only when the subtasks change with the input. Otherwise use
  [[parallel-calls]].
- Ask the orchestrator for the plan in a strict schema, and cap the
  number of subtasks.
- Give every worker the original task as well as its own piece.
- Run the workers at the same time, retry the ones that fail, and add a
  synthesizer call.
- Log the plan with every answer. When an answer is bad, check the plan
  first.

## Further reading

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents),
  Erik Schluntz and Barry Zhang (Anthropic), 2024. The definition of the
  pattern, how it differs from parallelization, and when to use it.
- [Orchestrator-Workers Workflow](https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/orchestrator_workers.ipynb),
  Anthropic cookbook, 2026. A short working version, with an honest list
  of what it leaves out and how it can fail.
