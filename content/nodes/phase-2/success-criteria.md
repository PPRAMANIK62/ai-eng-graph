---
id: success-criteria
title: What are success criteria?
depth: short
phase: 2
note: >-
  Writing down what "good" means for an AI feature before building it.
needs: [evals]
leads_to: []
compare_with: []
updated: 2026-09-27
---

# What are success criteria?

Success criteria are the written, measurable answer to "what does good mean
for this feature?" You write them before you build, so you know what to
test and when you're done. They're the targets your [[evals]] check
against: an eval produces a number, and the criteria say what number is
good enough.

## From "works well" to a number

Say you're building a sentiment classifier for social media posts. The first
criterion most people write is "the model should classify sentiment well".
You can't test that. Nobody can tell you whether you've met it.

A usable version looks like this: an F1 score of at least 0.85 on a
held-out test set of 10,000 diverse Twitter posts, which is 5% better than
the current baseline.

That sentence has four properties, and a good criterion needs all four:

- **Specific.** It names the task: sentiment classification, not "good
  performance".
- **Measurable.** It has a number and a way to get it: F1 on a test set.
- **Achievable.** The target comes from somewhere real, here the current
  baseline. A target that current models can't reach just stalls the
  project.
- **Relevant.** It fits what the feature is for. Accurate citations might
  matter a lot for a medical app and much less for a casual chatbot.

Even things that sound fuzzy can be made measurable. "The outputs should be
safe" can't be tested. "Fewer than 0.1% of outputs across 10,000 trials get
flagged by the content filter" can.

## One feature needs several criteria

Accuracy is rarely the only thing that matters. Common dimensions to
consider:

- **Task fidelity:** how well it does the task, including rare or hard
  inputs.
- **Consistency:** whether similar questions get similar answers.
- **Relevance and coherence:** whether it answers what was asked, in an
  order that's easy to follow.
- **Tone and style:** whether it sounds right for the audience.
- **Privacy:** whether it keeps personal or sensitive details out.
- **Context use:** whether it uses the information it was given.
- **Latency:** how fast it has to respond.
- **Price:** what each call can cost.

Most features need several of these at once. The sentiment classifier above
might need all of this on the same 10,000 posts:

![A before and after card for a sentiment classifier. Before: "The model should classify sentiments well." After, on a held-out set of 10,000 diverse posts: F1 of at least 0.85, 99.5% of outputs non-toxic, 90% of errors an inconvenience rather than an egregious error, and 95% of responses in under 200 ms. A note says you'd still have to define "inconvenience" and "egregious".](img/success-criteria-before-after.svg)

Each line becomes one check in your eval. The F1 score and the latency are
easy to measure in code. "An inconvenience, not an egregious error" isn't,
until you write down what those two words mean for your product.

## You find some criteria by reading outputs

The advice above assumes you can write all your criteria before you see a
single output. In practice you can't, quite.

A 2024 study watched 9 experts define criteria and grade LLM outputs with
them. Grading kept changing the criteria. People added new ones when they
saw a new kind of bad output. They also reinterpreted old ones to fit what
the model actually did. In one task, a criterion that every extracted
entity must be a proper noun turned into "most of them should be" once
people saw real outputs. Even participants who graded before writing
criteria kept refining them, and went back to change earlier grades.
The researchers called this criteria drift: you need criteria to grade
outputs, but grading outputs is how you figure out the criteria.

That doesn't make writing criteria first a mistake. It means the first
version is a draft. Write it, read a batch of real outputs, then revise.

## Where it gets tricky

**Words inside the criteria still need defining.** "Non-toxic",
"egregious", "appropriate tone" all move the vagueness one level down. Each
one needs its own definition, with examples, before anyone can grade it the
same way twice.

**Some criteria are easy for code and hard for people.** A word count is
trivial to check in code and tedious for a person to judge. Tone is the
other way round: hard to capture with a fixed metric, easier for a person
or a model grader. Knowing which kind each criterion is tells
you what kind of grader it needs.

**"Achievable" depends on today's models.** A target has to be within
reach of current frontier models, and grounded in something: a benchmark,
an earlier experiment, expert knowledge, or best of all your own baseline.
As models change, what's within reach changes too, so revisit targets when
you switch models.

## What this means when you build

- Before you build, write one sentence per criterion with a number and a
  test set in it.
- Cover more than accuracy: at least consistency, latency and cost, plus
  whatever failure would hurt users most.
- Set targets from a baseline you measured, not from a guess.
- Read real outputs early, and expect to add and rewrite criteria after.
- Keep the criteria next to the eval that checks them, and change them
  together.

## Further reading

- [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests),
  Anthropic docs. The four properties of a good criterion, a list of common
  ones, and worked bad-vs-good examples.
- [Who Validates the Validators?](https://arxiv.org/abs/2404.12272),
  Shankar, Zamfirescu-Pereira, Hartmann, Parameswaran and Arawjo, 2024. The
  study that found criteria drift: people change their criteria as they
  grade outputs.
