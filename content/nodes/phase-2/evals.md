---
id: evals
title: What are evals?
depth: deep
phase: 2
note: >-
  Tests for AI features: a fixed set of inputs, a way to score outputs, a number to track.
needs: [llm-use-cases]
leads_to: [retrieval-evaluation, success-criteria]
compare_with: []
updated: 2026-09-27
---

# What are evals?

An eval is a test for an AI feature. You keep a fixed set of inputs, run
your feature on them, score each output with some grading logic, and get a
number you can track from one change to the next. Without one, every prompt
tweak or model upgrade is a guess, and you find out it broke something when
users complain.

## An eval is a test that returns a score

Take a small feature: sort support tickets into one label, `billing`, `bug`
or `account`. You've written the prompt and tried it on a few tickets. It
looks right.

Now make it a test. Collect 30 real tickets and write down the label each
one should get. Run the prompt on all 30. For each output, check whether it
matches the expected label, after trimming spaces and lowercasing. Say 27
match. Your eval score is 90%.

That's the whole shape, and every eval has the same three parts:

- **Inputs.** A fixed set of test cases, each with what a good answer looks
  like. One test case is usually called a task.
- **A grader.** Logic that scores one output. Here it's an exact string
  match. It could be a regex, a check that JSON parses, another model, or a
  person.
- **A number.** The pass rate, or an average score, over the whole set.

The number is what makes it useful. Change one line of the prompt, run the
30 tickets again, and you get a new number to compare with the old one.
That's what [[prompts-as-code]] means by testing a prompt: a prompt change
goes through the eval the way a code change goes through its tests.

![An eval in four parts. A fixed set of test cases, each an input with the answer you expect, goes into your feature (prompt, model, retrieval and code together). Each output goes to a grader: code, an LLM or a person. The grader's verdicts add up to one score, 27 of 30 in the ticket example. Version 1 scores 90%; after each change you run the same set again and compare, so a change that drops the score is caught before it ships.](img/evals-anatomy.svg)

## Why unit tests aren't enough

A normal unit test calls a function and asserts on the result. That works
because the function returns the same thing every time. An LLM doesn't: the
same input can give different outputs from run to run (see [[sampling]]).
That's one of the [[llm-use-cases|known weak spots]] of LLMs, and it's why
ordinary software tests don't cover them on their own.

Evals differ from unit tests in three ways.

**You run each case more than once.** One run of a flaky case tells you
little. For anything that varies, run several trials and look at the rate.

**The pass rate isn't 100%.** A unit test suite should be all green. An eval
often isn't, and that's fine. How many failures you'll accept is a product
decision, set by how bad each kind of failure is.

**The grader can be wrong.** An assertion in a unit test is usually right by
construction. An eval's grader, especially one that uses a model, is itself
a guess that needs checking.

Two ways of counting help when outputs vary. **pass@k** is the chance that
at least one of k tries succeeds. It rises as k grows, and it fits tools
where one good answer is enough. **pass^k** is the chance that all k tries
succeed. It falls as k grows. A task that works 75% of the time passes three
tries in a row only about 42% of the time (0.75³). For a customer-facing
feature, where people expect it to work every time, pass^k is the honest
number.

## Your product's evals, not benchmarks

"Evals" gets used for two different things. **Benchmarks** like MMLU, GPQA
Diamond and Terminal-Bench compare general models on shared tasks. They
help you pick a promising model to start with. They can't tell you whether
your feature works, because they know nothing about your data, your prompt
or your tools.

**Product evals** test your system: the model, the prompts, the retrieval,
the tools and your own code, together, on your tasks. Think of an agent that
cancels orders. The things that matter are whether it picked the right order
and whether it waited for the cancel call to succeed before telling the user
it was done. No benchmark checks that. This article is about product evals.

## Three kinds of graders

The grader is where most of the design work goes. There are three kinds.

| Grader | Examples | Good at | Weak at |
|---|---|---|---|
| Code | Exact match, regex, JSON parses, right tool called with the right arguments, tests pass | Fast, cheap, objective, easy to debug, same result every time | Brittle: fails valid answers worded differently. Misses nuance |
| Model | An LLM grades against a rubric, answers a yes/no question, or picks the better of two answers | Flexible, scales, handles open-ended text | Its verdicts vary too, it costs more than code, and it has to be checked against people |
| Human | A domain expert reviews outputs; spot checks of a sample | The best judgment you can get | Slow, expensive, hard to run often |

The usual advice is the same from every direction: use code wherever a
clear rule can decide, use a model grader where you need judgment, and use
people to check the other two. A few examples of which fits where:

- A label from a fixed list, like the ticket triage above: exact match.
- An internal ID that must never reach the user: a regex that fails if one
  shows up.
- Output that must be valid JSON in a given shape: parse it and check the
  fields (see [[structured-output]]).
- Tone, helpfulness, "did it answer the question": a model grader with a
  clear rubric, ideally a yes/no per point.
- Whether the model grader itself is right: a person labels a sample and
  you compare.

Model graders and human review are big enough to be their own topics later
on this map. For a first eval set, the point is only that each failure you
care about gets whichever grader can check it most cheaply and reliably.

One rule helps with agents and multi-step features: grade what came out,
not the path taken. A check that demands a certain sequence of tool calls
fails agents that found a different valid route. For a flight-booking agent,
what matters is whether the booking exists in the database, not whether its
last message said "booked".

## How to build your first eval set

You don't need hundreds of cases to start. Early on, each change makes a
big difference in behavior, so a small set is enough to see it. The most
common mistake is waiting.

![Five steps to a first eval set. 1: Write down what good means. 2: Read outputs, about 100 diverse traces, the first 30 yourself, and list how it fails. 3: Collect 20 to 50 tasks from real failures, manual checks and the support queue. 4: Pick a grader per failure, code first, a model where you need judgment. 5: Run on every change and track the number, then add each new failure as a task. An arrow runs from step 5 back to step 2: keep reading outputs.](img/evals-first-set.svg)

**1. Write down what good means.** Before any test cases, say what the
feature must do, in terms you could measure: "picks the right label", "never
shows an internal ID", "answers in under two seconds". That's
[[success-criteria]], and it gets its own short article. Expect to revise
it after step 2.

**2. Read outputs before writing tests.** Log what your feature does (each
logged session is a trace), then read them. About 100 diverse traces is a
good first pool; annotate at least the first 30 yourself before letting any
tool suggest problems. For each one, write a short note on anything that's
wrong. Then group the notes into categories and count them. This is called
error analysis, and the list you end up with (the ways your app fails) tells
you which evals to write. Stop reading when new traces stop showing new
kinds of failure. If you have no users yet, generate realistic inputs with
an LLM and read those.

**3. Collect 20 to 50 tasks.** Start with the checks you already do by hand
before each release. Add the failures you found in step 2. Once you have
users, the bug tracker and the support queue are the best source: each
real complaint becomes a task. Include the messy inputs real users send:
typos, a one-word request like "returns", two questions in one message,
someone trying to make the model misbehave.

**Make each task unambiguous.** A good task is one where two experts
would reach the same pass or fail on their own. If they wouldn't, fix the
task, because ambiguity in the task shows up as noise in the score. Where
you can, write a reference answer that passes every grader. It proves the
task can be solved and that the grader is set up right.

**Test both directions.** If you only test that the feature does
something when it should, you'll push it to do that thing all the time. An
assistant with web search needs cases where it should search (today's
weather) and cases where it shouldn't (who founded Apple). The same goes for
a chat that should refuse questions outside its sources: test the ones it
should answer too.

**4. Pick a grader for each failure.** Code first. A model grader only
where a rule can't decide.

**5. Run it on every change, and keep the number.** Record the score with
the prompt version and model version next to it, so you can see progress
over time. Your first run is your baseline. Every new failure you find later
becomes a new task, so the set grows with the product. Once it exists, the
same set gives you latency, token usage and cost per task for free.

A useful side effect: writing the tasks forces you to decide what the
feature should do. Two engineers reading the same spec can disagree about an
edge case. A task with a pass/fail answer settles it.

## Two kinds of eval sets

Once you have a set, split it by purpose.

A **regression set** holds tasks the feature already handles. Its pass rate
should sit near 100%. A drop means something broke. This is the set to run
on every change.

A **capability set** holds tasks it can't do yet. Its pass rate starts low,
and it gives you something to climb. When a new model comes out, running it
shows quickly what got better. Tasks that reach a high pass rate move into
the regression set.

A set that everything passes has stopped telling you anything new. It
still catches breakage, but it can't show improvement.

## Where it gets tricky

**How many cases, and how carefully graded?** One line of advice favors
volume: many cases with slightly noisier automated grading beat a few
graded carefully by hand. Another starts from 20 to 50 hand-picked tasks
and puts the value in reading about 100 traces closely. Even one vendor's
guides land on both sides. They fit together better than they sound.
Reading traces is how you find out what to test. Volume matters once you
know, and you need it to see small differences.

**Pass/fail or a score out of 5?** Some guides grade tone on a 1 to 5 scale
and average it. Practitioners who label a lot of data find yes/no labels
much easier to manage than finer ratings. There's no settled answer. If you
use a scale, show an example of what each score looks like, and add a
pass/fail threshold on top.

**Generic metrics feel like evals and often aren't.** Eval libraries offer
ready-made scores like helpfulness or coherence, and academic metrics like
BLEU or perplexity. They measure something, but not necessarily what your
users care about, and a good score can give false confidence. They're more
useful for finding odd outputs to read than as the number you track.

**The eval can be the bug.** When Anthropic first ran Claude Opus 4.5 on the
CORE-Bench benchmark, it scored 42%. Part of the problem was the grading:
a check that expected "96.124991…" rejected the answer "96.12". After
fixing the grading bugs and loosening the agent's setup, the score was 95%. A low score can mean a
broken task or a grader that rejects valid answers. That's why the advice
is to read the actual transcripts of failed cases before trusting any
number, and why a model grader needs checking against human labels before
you rely on it.

**An offline eval only knows what you put in it.** A set that doesn't look
like real traffic can pass while users hit failures it never tested. Other
signals fill the gap: monitoring production, A/B tests, user feedback. Each
has its own weakness (monitoring finds problems after users do, A/B tests
take days or weeks, feedback is sparse). Feeding production failures back
into the eval set is what keeps it honest. Those are later topics on this
map.

**What's changed.** Early evals were one prompt, one response, one grade.
Agents made it harder: many turns, tools that change state, and more than
one valid way to finish. The tooling is moving too. OpenAI is shutting down
its hosted Evals platform (read-only from 2026-10-31, shut down on
2026-11-30). As with prompts, the durable place for your eval set is your
own repo.

## What this means when you build

- Start before you feel ready: 20 to 50 real cases and a script that prints
  a score.
- Read your outputs before you write graders, and keep reading them after.
- Use code graders wherever a rule can decide. Add a model grader only where
  you need judgment, and check it against your own labels.
- Include cases where the feature should hold back, not only where it
  should act.
- Store the score with the prompt and model version, and run the set on
  every change to either.
- Turn every bug report into a test case.
- Before trusting a score that surprises you, read the failing cases.
- For a retrieval feature, test the retrieval step on its own as well:
  [[retrieval-evaluation]] covers that.

## Further reading

- [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/),
  Hamel Husain, 2024. The classic case for evals, with assertions, trace
  review and A/B tests as three levels by cost, told through a real product.
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents),
  Grace, Hadfield, Olivares and De Jonghe (Anthropic), 2026. The vocabulary
  (task, trial, grader), the three grader types, capability vs regression
  sets, pass@k and pass^k, and a step-by-step path from zero to a first set.
- [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests),
  Anthropic docs. Worked examples of graders from exact match to LLM
  grading, with code.
- [Evaluation best practices](https://developers.openai.com/api/docs/guides/evaluation-best-practices),
  OpenAI docs. A second vendor's process, a list of anti-patterns, and the
  edge cases worth putting in your set.
- [Q: What are AI Evals?](https://hamel.dev/blog/posts/evals-faq/what-are-llm-evals.html),
  Hamel Husain and Shreya Shankar, 2025. Short and clear on benchmarks vs
  product evals.
- [Q: How many examples do I need for an eval?](https://hamel.dev/blog/posts/evals-faq/how-many-examples-do-i-need-for-an-eval.html),
  Hamel Husain and Shreya Shankar, 2026. The numbers for each stage: traces
  to read, labels per failure, size of the set you rerun.
