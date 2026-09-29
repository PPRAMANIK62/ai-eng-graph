---
id: when-not-to-use-agents
title: When shouldn't you use an agent?
depth: deep
phase: 5
note: >-
  Why a fixed workflow is usually the better choice, and how to tell when it isn't.
needs: [agent-loop, llm-workflows]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# When shouldn't you use an agent?

Most of the time. An agent lets the model choose its own steps, and you pay
for that freedom in cost, latency and predictability. If you can write the
steps down ahead of time, a fixed workflow will usually do the job for
less and be far easier to test. This article is about telling the two
cases apart.

## The same task, built two ways

Take one feature: answer customer refund requests.

Built as an [[llm-workflows|LLM workflow]], your code sets the path. One
call reads the email and pulls out the order number and the reason. Your
code looks up the order. A second call checks the request against the
refund policy. A third drafts the reply. Every request takes the same four
steps, in the same order.

Built as an [[agent-loop|agent]], you hand the model the email and some
tools (look up an order, issue a refund, send an email) and let it loop.
It decides whether to look up the order first, whether to ask the customer
a question, whether to refund.

If your refund policy is a clear set of rules, the workflow wins. Each
step is small, so each is easy to get right and easy to test on its own.
A bad reply points you to one step. The cost per request is fixed.

The agent starts to earn its place when the rules stop working: refund
approval that depends on judgment and exceptions, or a policy so tangled
that keeping the rules up to date costs more than it saves. OpenAI's
practical guide uses exactly this refund approval case as an example of
work that suits an agent.

## What the agent's freedom costs

An agent doesn't get more ability for free. It trades latency and cost for
better results on the tasks that need it, and on the tasks that don't, you
pay the price and get nothing back. Four costs show up:

- **Money and time.** Every turn re-sends the whole history so far, and
  the model decides how many turns to take. A workflow's cost is known in
  advance; an agent's isn't.
- **Compounding errors.** Each step builds on the last one. A wrong
  reading of one tool result sends the next steps off course, with no
  fixed checkpoint to catch it.
- **Harder testing.** A workflow takes the same path every time, so you
  can test each step on its own. An agent can take a different path on
  every run, so you test the whole run and read traces to find the broken
  step.
- **Less predictability.** The more the model decides, the less you can
  say in advance about what it will do. That's the whole point of an
  agent, and it's also the risk.

There's also evidence that simple setups often match complex agents. In
2024, a group of researchers re-ran published coding agents on the HumanEval
benchmark next to a few simple baselines. One baseline just retried the
model when the provided tests failed, raising the temperature on later
tries. It matched the best agent's accuracy. The agents cost from
over 50% more to over 50 times more for about the same result.

![Relative cost of coding agents vs a simple retry loop on HumanEval, at about the same accuracy. The warming baseline, which retries the model up to five times while raising temperature, is the reference at 1×. Reflexion and LDB cost over 1.5 times as much. LATS costs over 50 times as much. There was no significant accuracy difference between the warming baseline and the best agent.](img/when-not-to-use-agents-cost.svg)

Look at what that winning baseline is: a fixed loop that runs the tests
and retries. That's a workflow with a check in it, not an agent choosing
its own steps. When there's a cheap, reliable check, a workflow can often
get most of the benefit.

## Four questions before you build an agent

**1. Can you write down the steps?** If you can draw the flow chart, build
the flow chart. Agents are for open-ended problems where you can't predict
how many steps it takes and can't hard-code the path. Fixing an unknown
bug is like that. Summarizing a document is not.

**2. Do rules really fail here?** OpenAI's guide gives three signs that a
task has resisted normal automation: decisions that need judgment and
handle exceptions, rule sets so big they've become costly and error-prone
to update, and heavy reliance on unstructured text such as documents or
conversations. If your task doesn't clearly show one of these, the guide's
own advice is that a deterministic solution may be enough.

**3. Can the agent tell if it's working?** Agents do best on problems with
clear success criteria where the answer takes trial and error: make the
failing tests pass, shrink the container image, upgrade a dependency
without breaking the build. The loop can try, check and try again. With
no way to check, the agent can't correct itself, and "done" is only its
guess.

**4. Is the task worth the extra cost?** An agent that does somewhat
better at many times the price only makes sense where the result is worth
that much.

![A decision flow. First: can you write down the steps ahead of time? If yes, build a workflow. If no: is there a clear way to check progress, like tests? If no, narrow the task or add a check before reaching for an agent. If yes: is the result worth more tokens, more latency and less predictability? If no, use a workflow with a retry loop. If yes, try a single agent with a turn and budget limit.](img/when-not-to-use-agents-decide.svg)

## Climb the ladder one rung at a time

The advice from both Anthropic and OpenAI is the same: start with the
simplest thing and add complexity only when it clearly helps. In practice
that's a ladder:

1. **One model call**, with good retrieval and a few examples. For many
   features this is already enough.
2. **A workflow**: a few calls wired together by your code, such as
   [[prompt-chaining]] or [[routing]].
3. **A single agent** with a handful of tools, a turn limit and a budget.
4. **Several agents**, only when one agent clearly can't cope. That's
   [[multi-agent]], and it has its own costs.

Move up a rung only when your [[evals]] show the rung below can't reach
the quality you need. Without a baseline score from the simpler version,
you can't tell whether the agent is better or just more expensive.

## Most real systems are a mix

"Workflow or agent" is less a switch than a dial. Nearly all the agentic
systems that ship in production combine the two: a fixed path with one
open-ended step in it, or an agent whose tools are themselves small
workflows. A support bot might route every message with a fixed
classifier, handle the common cases with a workflow, and hand only the
odd cases to an agent.

Seen that way, the question is less "should this be an agent?" and more
"which step needs the model to choose what happens next?" Keep that step
as small as you can, and keep everything around it fixed.

## Where it gets tricky

**No one has published the head-to-head number.** There's no study that
builds the same production feature as a workflow and as an agent and
reports quality and cost side by side. The evidence is indirect: the
HumanEval result above (2024, older models, a benchmark with built-in
tests), and controlled studies on adding more agents, covered under
[[multi-agent]]. The rest of the advice, including Anthropic's and
OpenAI's, comes from their experience with customers and has no numbers
attached. Treat it as a good prior, then measure on your own task.

**The vendors frame it differently.** Anthropic draws a hard line between
workflows and agents. LangChain treats "agentic" as a spectrum, and
argues that OpenAI's guide mixes up two separate questions: whether you
define the flow as a graph up front, and whether the model or your code
picks the next step. LangChain also finds that most failed agent steps
come from the model getting the wrong context, not from a weak model,
which is an argument for keeping control of the flow yourself. Each
company sells tools that fit its own framing, so read the advice with that
in mind.

**"Agent" is a marketing word too.** By OpenAI's own definition, a
chatbot, a single model call or a sentiment classifier isn't an agent,
because the model doesn't control the workflow. So when a product is sold as an
agent, check whether the model really picks the next step. If it doesn't,
it's a workflow, which is often the better design anyway.

**Frameworks can hide the choice.** An agent framework makes the loop the
default, so it's easy to build an agent when a workflow would do. It also
wraps the prompts in layers that make failures harder to debug. Writing
the first version against the API shows you how simple the fixed version
could be.

**The advice is dated.** The guidance above is from 2024 and 2025, written
for the models of the time, and the HumanEval result used 2024 models. A
new model can move the line either way, so re-run your comparison when you
change models.

## What this means when you build

- Default to a workflow. Reach for an agent only when you can't write
  down the steps.
- Before building an agent, make sure there's a check the loop can run:
  tests, a validator, a clear goal.
- Build the simpler version first and score it. It's your baseline, and
  it's often good enough.
- Count cost next to quality. A win that costs 50 times more is only a win
  if the task is worth it.
- When you do use an agent, keep it small: one open-ended step inside a
  fixed flow, with a turn limit and a budget.

## Further reading

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents),
  Erik Schluntz and Barry Zhang (Anthropic), 2024. "Find the simplest
  solution", when agents fit, and what they cost.
- [A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf),
  OpenAI, 2025. The three signs a task suits an agent, and the advice to
  start with a single agent and grow step by step.
- [AI Agents That Matter](https://arxiv.org/abs/2407.01502), Sayash Kapoor
  et al., 2024. Simple baselines against published agents on HumanEval,
  with cost counted.
- [How the agent loop works](https://code.claude.com/docs/en/agent-sdk/agent-loop),
  Anthropic, Claude Agent SDK docs. How context and cost grow with every
  turn, and why the docs recommend a budget for production agents.
- [Designing agentic loops](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/),
  Simon Willison, 2025. Which problems suit an agent: clear success
  criteria and lots of trial and error.
- [How to think about agent frameworks](https://www.langchain.com/blog/how-to-think-about-agent-frameworks),
  Harrison Chase (LangChain), 2025. Workflows and agents as a spectrum,
  most production systems as a mix, and the argument with OpenAI's guide.
