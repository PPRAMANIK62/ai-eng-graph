---
id: agent-evals
title: How do you evaluate an agent?
depth: deep
phase: 5
note: >-
  Grading what an agent did: the outcome first, then its steps to find where it went wrong.
needs: [agent-loop, evals]
leads_to: []
compare_with: [benchmarks]
updated: 2026-09-29
---

# How do you evaluate an agent?

You evaluate an agent by setting it a task, letting it run, and checking
what it actually achieved: the state of the world when it stopped, not
what it said. Then, when it fails, you read the steps it took to find
where it went wrong. Agents make this harder than grading a single answer,
because a run has many steps, there's usually more than one right way to
do the task, and the same task can pass on one try and fail on the next.

## Two things you can grade: what it did and how

Take a support agent that handles refund requests. A customer writes in.
The agent looks up the order, checks the refund policy, verifies the
customer, and issues the refund through a tool. That run of the
[[agent-loop]] leaves two records behind.

- **The transcript** (also called the trace or trajectory). Everything
  that happened: each message, each tool call with its arguments, each
  result, the model's reasoning.
- **The outcome.** The state of the world at the end. Does a refund for
  the right amount exist in the payments database?

The agent's last message might say "your refund is on its way". That's
part of the transcript, not the outcome. The only proof is the refund
record.

The basic vocabulary (tasks, trials, graders, the three kinds of grader)
is covered in [[evals]]. This article is about what changes when the thing
under test is an agent.

## Grade the outcome first

The first question for any agent is the product question: did it do the
job? Treat the agent as a black box, run it on a task, and check the end
state.

Outcome checks are usually code, and usually cheap ([[code-based-evals]]):

- **A coding agent**: run the tests. Does the code run, and do the tests
  pass without breaking the old ones? That's how SWE-bench grades.
- **A support agent**: compare the database at the end of the
  conversation with the state you expected. τ-bench, a 2024 benchmark of
  retail and airline support, grades this way, with one model playing
  the customer.
- **Anything that writes to a system**: query the system.

Where there's no clean end state to query, like an answer to a research
question, you fall back on a model grader with a rubric
([[llm-as-judge]]), checked against people ([[human-review]]).

Give partial credit when a task has several parts. An agent that found the
problem and verified the customer but failed to issue the refund did
better than one that fell over on the first step, and your score should
show that.

## Then read the steps to find where it broke

An outcome score tells you *that* the agent failed. The transcript tells
you *why*. So the second phase is diagnosis: log every run with
[[llm-tracing]], and look at the steps of the failed ones.

For each failure, write down the **first upstream failure**: the earliest
step where things went wrong. This is the agent version of
[[error-analysis]].

Then check the steps that matter one by one:

- Did it pick the right tool?
- Were the arguments right and complete?
- Did the tool succeed, and did the state change the way it should?
- How did it handle an error or an empty result?
- Did it keep to the user's constraints across steps?
- How many steps, how long, how many tokens?

Check the tool name, the arguments, the result and the resulting state as
separate checks, so a failure points at one thing.

Once you have a set of failures, count them by where they happened. A
**transition failure matrix** does this: rows are the last step that
worked, columns are where the first failure hit. In one text-to-SQL
example, the step from generating the SQL to running it caused 12
failures, while another transition caused only 2. That tells you
where to spend your time.

![Outcome first, steps to diagnose. Two runs of a refund agent reach the same correct end state by different routes. Run A: look up the order, check the policy, verify the customer, issue the refund. Run B: look up the order, verify the customer, check the policy, issue the refund. An outcome check queries the payments database and passes both. A strict trajectory match against Run A as the reference passes Run A and fails Run B, even though Run B did the job. A rule check (the refund must come after verifying the customer) passes both.](img/agent-evals-outcome-vs-steps.svg)

## Why not grade the steps directly?

It's tempting to write down the "right" sequence of tool calls and fail
any run that doesn't match it. Tools exist for this. LangSmith's
trajectory evaluators compare a run's tool calls with a reference in four
modes:

| Mode | Passes when | Good for |
|---|---|---|
| Strict | Same calls, same order | A sequence that must hold, like checking policy before authorizing |
| Unordered | Same calls, any order | Gathering information where order doesn't matter |
| Subset | No calls outside the reference | Catching wasted or unneeded tool calls |
| Superset | At least the reference calls, extras allowed | Making sure a few key tools get used |

There's also an LLM-judge mode that rates the whole trajectory. It's more
flexible, but costs a model call and isn't deterministic.

The problem with strict matching as your main score is that agents
regularly find valid routes the eval's author didn't expect. A strict
match fails every one of them. Anthropic ran into a sharp version of this:
on a τ2-bench airline task, Claude Opus 4.5 found a loophole in the policy
that got the customer a better result. The eval marked it a failure.

So here's the side this article takes, because it's where the evidence
points:

1. **The outcome is the score.** It's what users care about, and it
   doesn't punish a different valid route.
2. **Steps are for diagnosis.** Read them to find the first failure,
   not to grade.
3. **Check steps directly only for rules that must hold on every route.**
   "Never issue a refund before verifying the customer." "Never call the
   delete tool." A rule like that is a property of the path itself, so
   grade it as one: with a targeted check, or a strict match on just that
   pair of calls. A subset match is a fair way to catch wasted calls.

![The four trajectory match modes, checked against one reference run: look up order, check policy, issue refund. A run with the same calls in the same order passes all four. A run with the same calls in a different order fails strict and passes unordered, subset and superset. A run with one extra call (search FAQ) fails strict, unordered and subset, and passes superset. A run that skips checking the policy fails strict, unordered and superset, and passes subset.](img/agent-evals-match-modes.svg)

## Run each task more than once

Agents are not deterministic. A task that passes once may fail on the
next try. So you run several trials per task, and choose between
[[evals|pass@k and pass^k]] depending on whether one success is enough or
users need it to work every time.

For agents, the gap between the two is large. In 2024, the best
function-calling agents on τ-bench (gpt-4o among them) solved under 50%
of tasks, and on the retail tasks the chance of passing the same task 8
times out of 8 was under 25%.

Keep trials independent. Start each one from a clean environment. Leftover
files, cached data or a shared database make trials fail together for
reasons that have nothing to do with the agent.

## Count cost next to success

An agent that succeeds more often by retrying five times hasn't
necessarily improved. A 2024 review of agent benchmarks found that
accuracy was reported with no attention to cost, which led to agents that
were needlessly complex and costly, and to wrong conclusions about what
caused the gains. Its fix is to report cost and accuracy together.

The traces give you this for free: steps, tokens, time and dollars per
task. Track them next to the pass rate, and compare every fancy setup
against a simple, cheap baseline.

## Public agent benchmarks age fast

Public benchmarks ([[benchmarks]]) are useful for choosing a model, and
they wear out. SWE-bench Verified is the clearest case. It gives an agent
a real GitHub issue from a popular Python project and grades the fix by
running the tests. Scores rose from about 40% to over 80% in a year.

On 2026-02-23, OpenAI stopped reporting it. A deeper review of 138 problem
tasks found tests that were too narrow (49 of them rejected correct fixes)
or too wide (26 checked for features the issue never mentioned), so many
of the problems models still failed couldn't be solved as written. And frontier models
could reproduce the original fix, or the issue text, word for word from
the task ID alone, a sign they'd seen the answers in training. OpenAI now
reports SWE-Bench Pro, which has bigger, harder tasks.

Two lessons carry over to your own evals. Graders can be wrong: a test
that rejects a correct fix is the same bug as a strict trajectory match.
And a fixed test set leaks, or gets tuned against, over time. Many agent
benchmarks had weak holdout sets or none at all, which let agents learn
shortcuts that don't generalize.

## Where it gets tricky

**Outcome vs trajectory is a real disagreement.** Eval tooling ships
strict trajectory matching and pitches it for sequences that must hold.
Teams that build agents find step-sequence checks too brittle to grade
with in general. Practitioner guides put end-to-end success first and
steps second, for diagnosis. The positions are closer than they look:
strict matching fits a few hard rules, and outcome grading fits everything
else. The mistake is making the step sequence your main score.

**Your grader can fail the agent for the wrong reason.** A strict match
that rejects a better route, or a test that rejects a correct fix, both
make the agent look worse than it is. On CORE-Bench, Claude Opus 4.5 first
scored 42%, partly because a grader expected "96.124991…" and rejected
"96.12". Once the grading bugs were fixed and the scaffold loosened, it
scored 95%. Read the transcripts of failed runs before you trust the
number.

**Simulated users are models too.** For agents that talk to people, a
second model usually plays the user. Its behavior varies like any model's,
so it's part of what you're testing. Read some of those conversations
too.

**Some outcomes have no database to check.** A good explanation, a useful
plan, a well-judged question: these need a model grader or a person, with
all the care that brings.

**Evaluating a tutoring agent is an open question.** This site's phase 5
build turns the guide into a tutor that plans a trip through the map,
explains a station, quizzes you and updates your progress. Some of its
checks fit the pattern above. Whether a plan respects the `needs` order
and skips what you've marked understood is an outcome check. Whether a
quiz grade matches a labelled sample is a judge check against people.
"Never change progress without the reader confirming" is a rule that must
hold on every route, so it gets a direct step check. "Doesn't call tools
it doesn't need" fits a subset match. But none of the sources here cover
how to grade whether an explanation actually teaches, which is the part
that matters most for a tutor. That's a design question for the build,
and it'll get its own decision record.

## What this means when you build

- Define each task's outcome as something you can check in the
  environment: a row, a file, a passing test.
- Make outcome checks the score. Use code where you can.
- Log full traces, and for each failure note the first step that went
  wrong. Count failures by step before fixing anything.
- Add direct step checks only for rules that must hold on every route.
- Run each task several times from a clean start, and look at pass^k if
  users expect it to work every time.
- Report cost, steps and tokens next to the pass rate.
- Read failed transcripts regularly. Some "failures" are grader bugs or
  better solutions.

## Further reading

- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents),
  Anthropic, 2026. Transcript vs outcome, grader types, partial credit,
  and why rigid step checks break.
- [Q: How do I evaluate agentic workflows?](https://hamel.dev/blog/posts/evals-faq/how-do-i-evaluate-agentic-workflows.html),
  Hamel Husain and Shreya Shankar, 2025. End-to-end first, then step-level
  diagnosis, first upstream failures and the transition failure matrix.
- [How to evaluate your agent with trajectory evaluations](https://docs.langchain.com/langsmith/trajectory-evals),
  LangChain docs. The four trajectory match modes and the trajectory judge.
- [τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains](https://arxiv.org/abs/2406.12045),
  Yao et al., 2024. Grading by end state with a simulated user, and pass^k.
- [AI Agents That Matter](https://arxiv.org/abs/2407.01502),
  Kapoor et al., 2024. Why accuracy alone misleads, and the case for
  counting cost and keeping holdout sets.
- [The End of SWE-Bench Verified](https://www.latent.space/p/swe-bench-dead),
  Latent Space with Mia Glaese and Olivia Watkins (OpenAI), 2026. Why a
  leading agent benchmark was retired.
