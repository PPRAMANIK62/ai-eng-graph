---
id: agent-loop
title: What is the agent loop?
depth: deep
phase: 5
note: >-
  A model calls tools in a loop, choosing its own next step, until it decides it's done.
needs: [tool-calling]
leads_to: [react-pattern, agent-memory, human-in-the-loop, sandboxing, agent-evals, multi-agent, when-not-to-use-agents, excessive-agency]
compare_with: [llm-workflows]
updated: 2026-09-29
---

# What is the agent loop?

An agent is a model that calls tools in a loop until it decides the job is
done. Your code sends the task, runs whatever tools the model asks for,
sends the results back, and repeats. That loop is small, but it's where an
agent's cost, its failures and your control over it all live, so it's worth
knowing exactly how it runs.

## One task, four turns

Say you give a coding agent this prompt: "Fix the failing tests in
auth.ts". Here's the run the Claude Agent SDK docs use as their example:

1. The model asks to run `npm test`. Your side runs it and sends back the
   output: three failures.
2. The model asks to read `auth.ts` and `auth.test.ts`. You send back both
   files.
3. The model asks to edit `auth.ts`, then to run `npm test` again. All
   three tests pass.
4. The model replies with plain text and no tool call: "Fixed the auth bug,
   all three tests pass now."

Each of the first three steps is a [[tool-calling|tool call]] round trip:
the model asks for one or more functions, your code runs them, the results
go back.
The agent loop is nothing more than doing that round trip again and again.
Each full cycle is called a **turn**. This run took four: three with tool
calls and a last one with only text.

Nobody wrote "run the tests, then read the files, then edit" anywhere. The
model picked each step after seeing the result of the one before. If the
first test run had shown a missing dependency instead, it would have gone
a different way.

## In code, it's a while loop

Strip away any framework and the loop looks like this:

```python
messages = [system_prompt, user_task]
while True:
    response = model(messages, tools)
    messages.append(response)
    if not response.tool_calls:
        break                      # the model says it's done
    for call in response.tool_calls:
        result = run_tool(call)    # your code, your permissions
        messages.append(result)
```

That's the whole mechanism. Both Anthropic's and OpenAI's agent SDKs run
this shape. The loop ends when the model answers without asking for a
tool. OpenAI's Agents SDK also ends it when the model calls a special
"final output" tool that returns a structured answer. Frameworks add
limits, hooks and logging around it, but the core stays a few lines, which
is why the usual advice is to write it against the API yourself first so
you can see every prompt and response.

![The agent loop. The task and the system prompt go to the model. The model either asks for one or more tool calls, which your code runs and feeds back as results for the next model call, or it answers with no tool call, which ends the loop. Around the loop, your code enforces a turn limit and a budget, and can pause for a person to approve risky actions.](img/agent-loop-cycle.svg)

## The model picks the next step

This is what separates an agent from an [[llm-workflows|LLM workflow]]. In
a workflow, your code fixes the path: call the model to classify, then
call it to draft, then call it to check. The model fills in each step but
never chooses the next one. In the agent loop, the model directs its own
process and picks which tool to use and when. Your code only decides
whether to keep going.

That trade is the reason to use an agent at all. It fits open-ended
problems where you can't predict how many steps it will take and can't
hard-code the path. Debugging is the classic case: you don't know whether
the fix takes one edit or ten until you look. The same freedom is also the
reason not to use one when a fixed path would do. That's its own article,
[[when-not-to-use-agents]].

## Results from the world keep it on track

The loop works because each tool result is ground truth. The test output
is what the code actually does, not what the model guessed. The model
checks its progress against that at every turn and adjusts.

This idea predates native tool calling. In 2022 the [[react-pattern|ReAct]]
paper prompted a model to write a thought, then an action, then read the
observation the action produced, and repeat. Reasoning without actions
made facts up; actions without reasoning lost track of the goal. Today's
models do the same interleaving through tool calls instead of parsed text,
but the shape is the one ReAct named.

A short definition that has stuck since 2025: an LLM agent runs tools in a
loop to achieve a goal. Each part matters. "Tools" means it acts on
something outside itself. "In a loop" means results feed back in. "To
achieve a goal" means there is a point where it stops.

## Every turn carries everything before it

The context window doesn't reset between turns. The system prompt, the
tool definitions, every message, every tool call and every tool result pile
up. In the auth.ts run, turn 3 is sent with both full files and the first
test output still in it.

![The auth.ts run as it grows. Turn 1 sends the system prompt, tool definitions and task, and gets back the npm test output. Turn 2 sends all of that plus the test output and gets back two files. Turn 3 sends all of that plus the two files, edits and re-runs the tests. The final turn sends everything and gets back a text reply. Each turn's input contains every earlier turn. Bar lengths show the shape, not measured token counts.](img/agent-loop-context.svg)

Two things follow from that pile.

**It's the agent's short-term memory.** The model knows what it already
tried because the earlier turns are right there. That's the simplest form
of [[agent-memory]], and for many tasks it's the only one you need.

**It's also the bill.** Each turn sends the whole history again as input.
A verbose command or a large file can add thousands of tokens in one turn,
and every later turn pays for it again. The parts that never change (the
system prompt, the tool definitions) get reused through
[[prompt-caching]], which cuts the cost and latency of that repeated
prefix. When the history gets close to the window's limit, the Claude
Agent SDK summarizes older turns to make room, which is
[[context-compaction]].

## The model decides it's done; you set the limits

The loop ends when the model replies without a tool call. That's the
model's judgment, and you shouldn't make it the only exit. Real systems
add their own:

- **A turn limit.** The Claude Agent SDK's `max_turns` counts tool-use
  turns. By default there is no limit, which is fine for a well-scoped
  task but can run long on something open like "improve this codebase".
- **A budget.** `max_budget_usd` stops the run once spend hits a cap, and
  the cap includes any sub-agents it started. A budget is a sensible
  default for any production agent.
- **Errors.** An error that interrupts the loop, like a cancelled
  request, ends the run.

When a limit trips, the result says so (`error_max_turns`,
`error_max_budget_usd`) rather than pretending to succeed, so your code
can tell "done" from "gave up". OpenAI's practical guide lists the same
exits: a final output, a response with no tool call, an error, or a
maximum number of turns.

You can also stop the loop from the inside. A hook that runs before each
tool call can check the arguments and block the call; the model gets a
rejection message as the tool result and usually tries something else.
That's the hook point for asking a person first on risky actions,
[[human-in-the-loop]], and for keeping actions inside a
[[sandboxing|sandbox]].

One more detail from the SDK: when the model asks for several tools in one
turn, read-only ones (read a file, search) can run at the same time, while
tools that change things (edit, write, run a shell command) run one after
another so they don't collide.

## Where it gets tricky

**"Agent" gets stretched.** OpenAI defines agents as systems that
independently accomplish tasks on your behalf, and rules out single-turn
chatbots and classifiers. The loop definition is the one most
engineers now share because it's concrete: tools, a loop, a goal. When
someone says "agent", ask whether the model chooses its own next step. If
not, it's a workflow.

**Errors compound.** Autonomy means each step builds on the last. A wrong
reading of a tool result leads to a wrong next action, which produces
another misleading result. Anthropic's guidance for exactly this reason is
to test agents in sandboxed environments with guardrails. ReAct's own
error analysis found a failure specific to the loop: the model repeats
its previous thoughts and actions and can't get out. A turn limit is the
blunt fix.

**"Done" is the model's opinion.** The loop stops when the model thinks
it's finished, not when the task is. In the auth.ts run it's easy to
trust, because passing tests are an outside check. Tasks without such a
check need one added, which is what [[agent-evals]] are for.

**The history isn't forever.** Once compaction kicks in, early turns are
summarized, and instructions given only at the start can get lost. Rules
that must hold for the whole run belong somewhere that's sent on every
turn, like the system prompt or a project file the SDK re-injects, not in
the first user message.

**More tools, more ways to go wrong.** The loop gives the model whatever
tools you hand it, and it can use any of them at any turn. Giving it more
than the task needs is its own risk, [[excessive-agency]].

## What this means when you build

- Write the loop against the API once before you pick a framework. It's a
  few lines, and you'll understand every trace after that.
- Always set a turn limit and a budget, and handle the "hit a limit"
  result separately from success.
- Give the model tools that return real feedback (test output, error
  messages), not just "ok". Its next step is only as good as what it sees.
- Watch context growth per turn. Trim large tool outputs before they go
  back in.
- Gate risky tools with a hook or an approval step, not with a line in the
  prompt.
- If one loop gets too big for its context, one option is to let it start
  another loop for a subtask, which is where [[multi-agent]] systems begin.

## Further reading

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents),
  Erik Schluntz and Barry Zhang (Anthropic), 2024. The workflow vs agent
  split, the loop with feedback from the environment, and why to start
  without a framework.
- [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop),
  Anthropic, Claude Agent SDK docs. The loop from the inside: turns, the
  auth.ts example, turn and budget limits, context growth, compaction and
  hooks.
- [A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf),
  OpenAI, 2025. The run loop and its exit conditions, and what OpenAI
  counts as an agent.
- [I think "agent" may finally have a widely enough agreed upon definition to be useful jargon now](https://simonwillison.net/2025/Sep/18/agents/),
  Simon Willison, 2025. The one-line definition and what each part means.
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629),
  Shunyu Yao et al., 2022. Where the thought, action, observation loop was
  first written down.
