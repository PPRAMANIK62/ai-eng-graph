---
id: error-analysis
title: What is error analysis?
depth: short
phase: 4
note: >-
  Reading real outputs, naming the ways they fail, and counting them before you write evals.
needs: [evals]
leads_to: [data-flywheel, synthetic-test-data, llm-as-judge]
compare_with: []
updated: 2026-09-29
---

# What is error analysis?

Error analysis means reading what your AI feature actually did, writing
down what went wrong in each case, then grouping those notes into
categories and counting them. The counted list tells you which
[[evals]] to write and which fix will help most. Skip it and you end up
measuring whatever your tools suggest instead of the ways your app
really fails.

## Start from traces, not from metrics

Say you run an assistant that answers questions from people renting
apartments and books tours. You could start with a dashboard of ready-made
scores like "helpfulness" or "hallucination". The trouble is that those
scores are guesses about what might go wrong. They often miss the problems
specific to your product, and a score can go up while users still
struggle.

Error analysis starts from the other end. You collect traces, where a trace
is the full record of one user session. About 100 diverse traces is a good
pool. If you have no users yet, generate realistic inputs with
[[synthetic-test-data]] and run them through the system to get traces.

## Open coding: a note per trace

Read each trace and write a short, free-form note on anything that's wrong.
No categories yet, just what you see: "offered a tour slot on a Sunday when
the office is closed", "didn't hand over to a person when asked twice",
"booked the tour for the wrong week".

A few rules help:

- **Note the first failure in each trace.** An early mistake often causes
  the later ones, so fixing it can clear the rest.
- **Have a domain expert do it.** Ideally one person who decides what
  counts as a failure, so the notes stay consistent.
- **Do the first 30 yourself.** Tools and agents can suggest problems, but
  letting them in too early bends your judgment toward what they notice.

The name comes from qualitative research, where reading raw material and
labeling it freely is called open coding.

## Axial coding: group and count

Next, group similar notes into categories. "Booked the wrong week" and
"misread two weeks from now" both go under something like
*date handling*. This list of categories is your failure taxonomy. Then
count how many traces fall into each one. An LLM can help cluster the
notes, and a spreadsheet pivot table is enough for the counting.

This is the step that matters most, because the counts turn a pile of
complaints into a priority list.

![Error analysis in four steps. 1: Collect about 100 diverse traces. 2: Open coding, a free-form note on the first thing wrong in each, the first 30 by hand. 3: Axial coding, group the notes into failure categories such as conversation flow, handoff to a person, and date handling. 4: Count each category; in the Nurture Boss case, three categories made up over 60% of all problems. The counted list decides which evals to write and what to fix first. An arrow loops back from new traces: repeat until new traces stop showing new kinds of failure.](img/error-analysis-steps.svg)

In a case published in 2025, Nurture Boss, a company with an AI assistant
for the apartment industry, did exactly this. Three categories made up over 60% of all
problems: conversation flow (missing context, awkward replies), failing to
hand over to a person, and date handling. Date handling failed 66% of the
time when users said things like "two weeks from now". They wrote tests for
exactly those date cases, fixed the behavior, and reported date handling
going from 33% to 95% success.

## When to stop, and what comes out

Keep reading new traces until they stop showing new kinds of failure or
changing the categories you have. Qualitative researchers call this
theoretical saturation. An agent can speed this up once you've done the
first 30 by hand: it can search the rest of the pool for likely examples of
the failures you described, and you accept or reject what it finds.

What you end up with is a short list of named failures with counts. Each
important one becomes an eval: a [[code-based-evals|code check]] when a
rule can spot it, an [[llm-as-judge|LLM judge]] when it needs judgment.
The taxonomy also often sharpens your [[success-criteria]], because it
shows what "good" means in practice.

## Where it gets tricky

**It's never done.** Your product and its users keep changing, so you come
back to it often, on fresh traces. Doing that on a schedule, and feeding
what you find back into the evals, is the [[data-flywheel]].

**Generic metrics feel like a shortcut.** Many eval platforms nudge you
toward ready-made scores. They can look like progress while measuring the
wrong thing. Use them, if at all, to find odd traces to read.

**Letting a model do the reading.** Using an LLM to group notes or find more
examples is fine and saves time. Letting it write the first notes means you
only find the failures it already knows how to see.

**The before/after numbers are thin.** The Nurture Boss result is one
client's case, reported by the consultant who worked on it, with no sample
size given. It shows what the method can find, not what you should expect.

## What this means when you build

- Log full traces from the start, and make them easy to read. A simple
  viewer with a notes column is enough.
- Read about 100 diverse traces before writing graders. Annotate the first
  30 yourself.
- Note the first failure in each trace, group the notes, count them.
- Turn each important category into an eval, and fix the biggest first.
- Come back to it often, on fresh traces.

## Further reading

- [Q: Why is “error analysis” so important in AI evals, and how is it performed?](https://hamel.dev/blog/posts/evals-faq/why-is-error-analysis-so-important-in-llm-evals-and-how-is-it-performed.html),
  Hamel Husain and Shreya Shankar, 2025. The method in four steps: traces,
  open coding, axial coding, and agent-assisted refinement until
  saturation.
- [A Field Guide to Rapidly Improving AI Products](https://hamel.dev/blog/posts/field-guide/),
  Hamel Husain, 2025. The Nurture Boss case, bottom-up vs top-down
  analysis, and why generic metric dashboards mislead.
