---
id: parallel-calls
title: Why run LLM calls in parallel?
depth: short
phase: 3
note: >-
  Several calls at once: split a task into parts for speed, or ask the same thing several times and vote.
needs: [llm-workflows]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# Why run LLM calls in parallel?

When the steps of a task don't depend on each other, you can send them as
separate LLM calls at the same time and combine the results in code. There
are two reasons to do it: to split a task into independent parts, which
saves time and lets each call focus, or to ask the same question several
times and take a vote, which buys confidence. They look alike in code and
do different jobs.

## Sectioning: independent parts at the same time

Take a docs assistant that has to answer a question and also check the
question isn't abuse. You could do both in one prompt. Or you run two
calls at once: one answers, the other screens the question (a
[[guardrails|guardrail]]). Splitting the guardrail from the answer tends to work better than asking one call to do
both, because each call attends to one thing. The same goes for grading:
one call per aspect (accuracy, tone, format) instead of one call judging
everything.

The time saving is simple. Calls in a chain wait for each other, so their
times add up. Calls in parallel overlap, so you wait roughly as long as the
slowest one.

![Three timelines, illustrative and not measured. Sequential: step A, then step B, total time is A plus B. Parallel: A and B start together, total time is the longer of the two. Speculative: A (a quick check) and B start together; if A comes back as expected, B's result is used; if not, B is cancelled and retried.](img/parallel-calls-timelines.svg)

**Speculative execution** stretches this to steps that do depend on each
other. If step 1 is a check that almost always passes, like moderation,
start step 2 at the same time anyway. When step 1 comes back as expected,
you've saved its whole wait. When it doesn't, cancel step 2 and retry.

In code, sectioning is a thread pool or `Promise.all` over the calls, then
a function that merges the results ([[llm-workflows]] shows the pattern).

## Voting: the same question several times

Voting runs the same task several times and combines the answers. The
research version is **self-consistency** (2022): sample several
[[chain-of-thought]] answers to a math question and take the answer that
comes up most often. With 2022 models, it raised accuracy over a single
greedy answer by 17.9 points on GSM8K, 11.0 on SVAMP and 12.2 on AQuA.

Three things make it work, and limit it:

- **The answers must be comparable.** A number or a multiple-choice
  letter can be counted. Two free-text paragraphs can't, unless you have
  a way to decide whether they agree.
- **It costs one call per vote.** In the paper, most of the gain came
  from the first few samples and then flattened, so 5 or 10 is a sensible
  start.
- **Agreement is a confidence signal.** When the samples mostly agree, the
  answer is more likely right. Low agreement is a sign the model isn't
  sure, which is useful for [[saying-i-dont-know]].

In products, voting also shows up as several different prompts checking
the same thing: several prompts reviewing code for security bugs, say,
with a threshold for how many must flag it. Changing the threshold trades false
positives against false negatives.

## Where it gets tricky

**More votes can make it worse.** It's tempting to think more samples
always help. A 2024 study of majority voting found accuracy can rise and
then fall as you add calls. The reason is that tasks mix easy and hard
questions. On an easy question, the model's most common answer is right,
so more votes make the vote more reliable. On a hard question, the most
common answer is wrong, and more votes lock that in. When a task has
both, total accuracy can peak and then drop. The same study shows how to
estimate the best number of calls from a small sample, so don't just pick
a big number.

**Nobody has published the latency savings.** The "wait as long as the
slowest call" logic is sound, but we found no source with measured
numbers for parallel LLM calls. The vendor guide we read that recommends it
(OpenAI's) gives no figures. And since you wait for the slowest call, one
slow response can eat most of the saving (see [[llm-latency]]). Measure
it in your own stack.

**Parallel pulls against "make fewer requests".** Each request costs a
round trip, so the same guide also says to merge sequential steps into one
prompt where you can. Merging saves round trips; splitting lets steps
overlap and focus. Which wins depends on your steps, and only a test on
your task will say.

**The models in the voting papers are old.** Self-consistency was tested
on 2022 models. Current [[reasoning-models]] already think at length
inside one call, and how much voting adds on top of that hasn't been
measured in these sources.

## What this means when you build

- Draw the dependency graph of your steps. Anything that doesn't need
  another step's output can run at the same time.
- Use sectioning when separate concerns (answer, guardrail, grading
  aspects) each deserve a focused prompt.
- Use voting only when answers can be compared exactly, and start with 5
  samples. Check on your eval set whether more helps or hurts.
- Remember that parallel calls cost the same tokens, often more with
  voting, even when they save time.
- Record latency before and after. You're likely to be the one who
  publishes the number.

## Further reading

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents),
  Erik Schluntz and Barry Zhang (Anthropic), 2024. The two kinds of
  parallelization, sectioning and voting, with examples of each.
- [Self-Consistency Improves Chain of Thought Reasoning in Language Models](https://arxiv.org/abs/2203.11171),
  Xuezhi Wang et al., 2022. The primary source for voting over sampled
  answers, its gains, and its limits.
- [Are More LLM Calls All You Need?](https://arxiv.org/abs/2403.02419),
  Lingjiao Chen et al., 2024. Why voting accuracy can rise and then fall
  as you add calls.
- [Latency optimization](https://developers.openai.com/api/docs/guides/latency-optimization),
  OpenAI docs. Parallelizing and speculative execution, and the pull the
  other way toward fewer requests. No measured numbers.
