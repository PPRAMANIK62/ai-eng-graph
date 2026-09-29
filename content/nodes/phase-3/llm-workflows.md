---
id: llm-workflows
title: What are LLM workflows?
depth: deep
phase: 3
note: >-
  LLM calls wired together by fixed code paths. Most products run on these, not on agents.
needs: [chat-api]
leads_to: [prompt-chaining, parallel-calls, routing, evaluator-optimizer, when-not-to-use-agents, orchestrator-workers]
compare_with: [agent-loop]
updated: 2026-09-29
---

# What are LLM workflows?

An LLM workflow is a program that makes several model calls in an order
you wrote. Your code decides what happens first, what happens next, and
when it stops. The model does the language work inside each step. It's how
most LLM features get built once a single prompt stops being good enough,
and it's the thing to reach for before an agent.

## From one call to a few

Start with one question sent to a docs assistant: "How is reranking
different from hybrid search?" The simplest version is a single
[[chat-api]] call: system prompt, the question, some retrieved text, one
answer.

Now say you want it to be better. You might:

1. First ask a small model what kind of question this is (a comparison).
2. Pick the comparison prompt and fetch both articles.
3. Write the answer.
4. Run a second call that checks the answer against the articles.

Each model step is still one ordinary call. What's new is the Python (or
TypeScript) around them: an `if` that picks the prompt, a loop, a check
that can send the draft back. That surrounding code is the workflow.

The name comes from Anthropic's 2024 post on building agents, which
defined workflows as LLM calls and tools orchestrated through predefined
code paths. The paths are written ahead of time. The model fills them in;
it doesn't choose them.

## Workflow or agent: who picks the next step

An [[agent-loop|agent]] is the other kind of system. There, the model
decides its own next step: which tool to call, whether to call another,
when it's done. Your code only runs the loop.

So the one-line difference is who holds the control flow. In a workflow,
your code does. In an agent, the model does.

That difference drives everything else:

- A workflow takes the same path for the same kind of input, so it's
  predictable and you can test each step on its own.
- An agent can handle tasks where you can't predict the number of steps
  in advance, like a coding change that touches an unknown number of
  files. The price is higher cost and errors that compound over many
  turns.

The usual rule: workflows for well-defined tasks, agents where you need
flexibility and the model has to make the decisions. Deciding between the
two is its own topic, [[when-not-to-use-agents]].

## Why split one job into several calls

If a model can read your whole prompt, why not put everything in one call?
A few reasons hold up.

**Each call gets an easier job.** A prompt that only classifies, or only
checks, can be short and specific. You pay in latency and get accuracy
back, because each call has an easier task. And when one prompt tries to
serve every kind of input, tuning it for one kind can hurt the others.

**System design can beat a bigger model.** Here's a thought experiment
from the 2024 case for "compound AI systems": if the best model solves
30% of coding contest problems, tripling its training budget might get
35%, while a system that samples many solutions and tests each one might
reach 80%. And changing a pipeline is usually much faster than waiting
for a training run.

The best measured example is AlphaCodium (2024). On the CodeContests
benchmark, GPT-4 solved 19% of validation problems (pass@5) with one
carefully written prompt, and 44% with a fixed multi-step flow: reflect on
the problem, reason about the tests, draft solutions, rank them, write
extra tests, then generate code and fix it by running it against the
tests.

![Bar chart of AlphaCodium's results on CodeContests, pass@5. GPT-4 validation: 19% with one direct prompt, 44% with the flow. GPT-4 test: 12% to 29%. GPT-3.5 validation: 15% to 25%. GPT-3.5 test: 8% to 17%. The flow made about 15 to 20 model calls per solution.](img/llm-workflows-alphacodium.svg)

That flow cost about 15 to 20 model calls per solution, so a pass@5
submission took around 100 calls. More calls for better answers is the
basic trade of every workflow.

**You get control.** A step in code can filter an output, enforce a
format, or check a fact before anything reaches the user. A retrieval
step can bring in fresh data and only show a user the files they're
allowed to see. A trained model can't do either by itself.

**You can tune cost and quality per step.** A cheap model can do the
classification and a strong one the writing. One model has a fixed price
and quality; a system lets you mix.

By early 2024 this was already common: Databricks found that 60% of
enterprise LLM applications used some form of RAG, and 30% used multi-step
chains.

## Five patterns you'll see everywhere

Five workflow patterns cover most of what gets built. Real systems are
usually one of these, or a few combined.

![Five workflow patterns as small flow diagrams. Prompt chaining: call, gate, call in a line. Routing: a router sends the input to one of several specialist calls. Parallelization: several calls run at once and an aggregator combines them. Orchestrator-workers: one call decides the subtasks at run time and hands them to workers. Evaluator-optimizer: a generator and an evaluator in a loop until the output passes. For contrast, an agent: the model calls tools in a loop and decides when to stop.](img/llm-workflows-patterns.svg)

- **[[prompt-chaining|Prompt chaining]].** A fixed sequence. Each call
  works on the previous call's output, with checks in code between steps.
- **[[routing|Routing]].** Classify the input first, then send it to a
  prompt, model or path made for that kind of input.
- **[[parallel-calls|Parallelization]].** Run calls at the same time,
  either on different parts of the task (sectioning) or on the same task
  several times to vote.
- **[[orchestrator-workers|Orchestrator-workers]].** One call breaks the task into subtasks and
  hands them out. The subtasks aren't fixed in advance, so this pattern
  sits closest to an agent.
- **[[evaluator-optimizer|Evaluator-optimizer]].** One call writes,
  another grades against clear criteria and gives feedback, and they loop.

## A workflow is ordinary code

Chaining, parallelization and routing fit in about a page of Python. In
Anthropic's cookbook version, `chain()` is a `for` loop that passes each
result into the next prompt. `parallel()` sends the same prompt over several
inputs with a thread pool. `route()` asks the model to pick a route in an
XML tag, then looks the name up in a dictionary of specialist prompts.

So you don't need a framework to build a workflow. Start with the API
directly: frameworks add layers that hide the prompts and responses you're
trying to debug. If you do use one, know what it sends. (The cookbook
marks its code as not for production, and it isn't: more on that in the
[[routing]] article.)

## Where it gets tricky

**Every extra step costs time and money.** Each call adds latency and
tokens. Look for the simplest solution first, which may be no multi-step
system at all. For many applications, one good call with retrieval and
examples in the prompt is enough. Add a step only
when you can measure that it helps.

**The advice has moved with the models.** In mid-2024, practitioners
treated splitting a big prompt into smaller ones as settled wisdom, and
told teams to prefer deterministic workflows over agents because agents
failed step by step. AlphaCodium's numbers are from the same GPT-4 era.
Since then two things changed:

- Reasoning models do much of the step-by-step work inside one call. As
  of 2026-09, Anthropic's own prompting guide expects Claude to handle
  most multistep reasoning internally, and keeps explicit chaining for
  when you need to inspect intermediate outputs or enforce a pipeline.
  See [[reasoning-models]].
- Agents started working in practice during 2025, above all for coding and
  search.

So the reason to use a workflow in 2026 is less often "the model can't do
it in one go" and more often "I need to see, test and control each step".
We found no published head-to-head of one call versus a chain on
2025–2026 models, so treat the old gains as history and measure on your
own task.

**The design space is big.** Even a plain RAG pipeline has choices at
every step, and a latency budget has to be split between them. For a
100 ms target, do you give 20 ms to retrieval and 80 to the model, or the
reverse? Each of these is a choice you settle by measuring, with
[[evals]].

**Operating it is harder than one call.** When something goes wrong, you
need to know which step did it. That's why step-by-step traces matter
([[llm-tracing]]). Fixed steps help here: when a workflow fails, you can
point to the step that failed, which is much harder with an agent.

## What this means when you build

- Start with one call. Write down what "good" means and measure it first.
- Add a step only when an eval shows it helps, and record what it costs in
  latency and tokens.
- Keep the control flow in your own code, where you can read and test it.
- Give each step a small job with its own prompt, and test steps one at a
  time.
- Put checks in code between steps: parse the output, validate it, stop
  early if it's wrong.
- Log every step's input and output so you can find which one failed.
- Reach for an [[agent-loop]] only when you can't write the path down
  ahead of time.

## Further reading

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents),
  Erik Schluntz and Barry Zhang (Anthropic), 2024. The workflow vs agent
  split and the five patterns, each with when to use it. The source of
  most of the vocabulary here.
- [The Shift from Models to Compound AI Systems](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/),
  Matei Zaharia et al. (Berkeley AI Research), 2024. Why products are
  built from several calls and components, and the new problems that
  creates.
- [Code Generation with AlphaCodium](https://arxiv.org/abs/2401.08500),
  Tal Ridnik, Dedy Kredo and Itamar Friedman, 2024. The clearest
  measurement of a fixed flow against one prompt, from the GPT-4 era.
- [Basic Multi-LLM Workflows](https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/basic_workflows.ipynb),
  Anthropic cookbook, 2025. Chaining, parallelization and routing in a page
  of Python.
- [What We've Learned From A Year of Building with LLMs](https://applied-llms.org/),
  Eugene Yan et al., 2024. The mid-2024 practitioner case for multi-step
  flows and deterministic workflows.
- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices),
  Anthropic docs, current as of 2026-09. The newer view: models reason
  through most steps internally, and chaining is for inspection and control.
- [2025: The year in LLMs](https://simonwillison.net/2025/Dec/31/the-year-in-llms/),
  Simon Willison, 2025. How agents went from unreliable to useful for
  coding and search during 2025.
