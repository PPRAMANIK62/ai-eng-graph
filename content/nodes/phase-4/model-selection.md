---
id: model-selection
title: How do you choose a model?
depth: deep
phase: 4
note: >-
  Picking a model on your own evals, cost and latency, not the leaderboard.
needs: [benchmarks, token-pricing, llm-latency]
leads_to: [open-vs-closed-models]
compare_with: [routing]
updated: 2026-09-29
---

# How do you choose a model?

Choosing a model means running a few candidates on your own test cases,
then weighing quality against cost and speed for your task. Public
leaderboards help you make the shortlist. Your own eval set makes the
choice. Most of the work is setting it up so the comparison is fair and
the numbers mean something.

## A worked example: a ticket classifier

Say you're building a feature that reads each incoming support ticket and
labels it: billing, bug, account, or other. It runs on every ticket, tens
of thousands a day. Nobody waits on the answer in real time, but the label
has to be right, because it decides which team sees the ticket.

That one paragraph already tells you a lot. Quality matters a lot. Volume
is high, so cost per call matters. Latency matters little. A different
feature, like a coding assistant a person watches as it types, would weigh
the same three things very differently.

So before looking at any model, write down what "good enough" means: a
target accuracy, a budget per ticket, a latency limit (see
[[success-criteria]]). Every step after this compares models against those
numbers.

![The model selection loop. Step 1, shortlist: use public benchmarks to rule out models that are weak at your kind of task. Step 2, pick a starting point: either the cheapest model that might work, or the strongest one. Step 3, run your own eval set on each candidate. Step 4, check it against your quality bar. Step 5, work out cost per task and measure latency on your real prompts. Then keep the lightest model and setting that passes. When a new model comes out, run the loop again.](img/model-selection-loop.svg)

## Step 1: shortlist with benchmarks

Public [[benchmarks]] are good at one thing here: ruling models out. A model
that does badly on a benchmark close to your task will probably do badly
for you. The reverse doesn't hold. A top score doesn't make a model the
best for your tickets, and many public benchmarks are contaminated anyway.

Think of what you're building as a private leaderboard. Same idea as a
public one, but the questions are yours and the ranking only has to be
right for your task.

## Step 2: pick where to start

There are two sensible starting points.

**Cheap first.** Start with a small, fast model. Test it properly. Move up
only when you find a specific thing it can't do. This keeps iteration fast
and costs low, and it fits high-volume, simple tasks like the ticket
classifier.

**Strong first.** Start with the most capable model, get the prompt
working, then try cheaper models or lower settings once you know what good
output looks like. This fits hard tasks where being right matters more than
the bill: complex reasoning, long agent runs, advanced coding. If cost and latency
don't matter at all, you can simply default to the strongest model.

Both end in the same place: use the lightest setting that meets your
quality bar, tested on the same inputs.

"Setting" is the key word. On many current models, a reasoning or effort
setting trades quality against speed and cost inside one model (see
[[reasoning-models]]). As of 2026-09, OpenAI ranks nine model and
effort pairs, from its cheapest model on low effort to its strongest on
extra high. Tuning the effort setting is often a better lever than
switching models. So your candidates are pairs, like "small model,
medium effort", not just model names.

## Step 3: run your eval set on each candidate

This is the step that decides, and a good evaluation set is the most
important thing you build for it. Use your real prompts and real
inputs, including the awkward ones: the ticket written in two languages,
the one that's half a stack trace. Compare accuracy, output quality and
how each model handles those edge cases. How to build the set is covered in
[[evals]].

Then be careful with small differences. An eval score is a sample. Your 100
tickets are a handful drawn from all the tickets you'll ever get, and a
different 100 would give a slightly different score.

Here's what that means in numbers, for a pass/fail score on 100 questions.
If model A gets 82 right, the standard error of that score is about 3.8
points (the square root of 0.82 × 0.18 / 100). A 95% confidence interval
is 1.96 standard errors either side, so roughly 74% to 90%. If model B
gets 78, its interval is roughly 70% to 86%. The ranges overlap a lot. On
100 questions, a 4-point gap isn't much evidence.

![Two models scored on the same 100 pass/fail questions, as dots with 95% confidence intervals. Model A scores 82% (interval about 74% to 90%) and model B 78% (about 70% to 86%). The intervals overlap heavily, so the 4-point gap is weak evidence on its own. Worked example, not measured data.](img/model-selection-error-bars.svg)

A few habits make the comparison sharper:

- **Compare question by question.** Both models answered the same
  questions, so look at the difference on each one (a paired comparison).
  Frontier models tend to get the same questions right and wrong, with
  correlations between 0.3 and 0.7 on popular evals. Pairing removes the
  shared difficulty and leaves a much tighter estimate of the gap.
- **Run each question more than once** if outputs vary between runs.
  Average the runs per question before comparing.
- **Watch for grouped questions.** Ten tickets from the same customer
  aren't ten independent tests. On popular evals, errors that account for
  this grouping came out over three times as large as the naive ones.
- **Decide the size of gap you care about first,** then work out how many
  questions you need to see it. With a small set, only big differences show
  up.

## Step 4: price the whole task, not the token

Per-token prices are where most people start, and they're misleading on
their own. From [[token-pricing]], output tokens cost several times more
than input tokens. What you pay is the price times the tokens the model
actually uses.

That's where models differ a lot. A model that writes longer answers, or
spends many tokens reasoning before it answers, costs more per task even
at the same per-token price. So measure cost per task: run your eval set,
record input, output and reasoning tokens for each call, and multiply by
the prices.

Watch out for blended prices on comparison sites. Artificial Analysis, for
example, blends cached input, input and output at a fixed 7:2:1 ratio.
Your ratio will differ. A classifier reads a long ticket and writes one
word; a report writer does the opposite.

Then multiply by volume. A workflow that runs on every ticket adds up far
faster than one that runs once a week. That's why the ticket classifier
leans toward the cheapest setting that clears the accuracy bar.

You don't have to pick one model for everything. A common pattern pairs a
cheap model with a frontier one: the cheap model does most of the work and
hands hard cases up, or a strong model plans and hands bulk work down. Most
tokens get billed at the lower rate. Sending each input to the right model
is [[routing]].

## Step 5: measure latency on your own prompts

A response's total time covers reading your input, any reasoning, and
writing the answer (see [[llm-latency]]). A model that thinks longer or
writes more takes longer, the same way it costs more. So time your eval
runs on real inputs rather than relying on someone else's chart, and look
at [[time-to-first-token]] if a person is waiting.

Some providers sell speed directly. As of 2026-09, some Claude Opus models
have a fast mode with up to 2.5 times the output speed at a higher price.
Lowering the effort setting also cuts latency.

## Where it gets tricky

**What teams actually do.** The guides say start small and keep the
lightest model that works. Surveys of what teams do look different. In a
2025 survey of 150 technical leaders, 66% had upgraded to a newer model
from the same provider in the past year and only 11% had switched
providers. Teams paid for performance: when prices dropped 10x, they
didn't stay on the cheap older model, they moved to the newest top one.
Within a month of Claude 4's release, Claude 4 Sonnet had 45% of Anthropic
users. That may be a sensible choice when quality drives revenue. It's
also a choice made without the eval loop above.

**The vendors' guides only cover their own models.** Anthropic's guide
compares Claude models, OpenAI's compares OpenAI models. Neither tells you
when the other one, or an open model (see [[open-vs-closed-models]]), would
do the job better.

**Model names go stale fast.** Any lineup you read, including the ones in
these guides, will go out of date. The method lasts. Keep your eval set and
your cost script, so a new model can go through the same loop quickly.

**The choice isn't permanent.** Models get updated, retired and replaced.
Switching versions without breaking things is its own problem, covered in
[[model-upgrades]].

## What this means when you build

- Write the quality bar, cost budget and latency limit down before
  comparing anything.
- Use benchmarks to cut the list, then decide on your own eval set with
  your real inputs.
- Treat model plus effort setting as the thing you're choosing.
- Compare models on the same questions and don't trust small gaps on a
  small set.
- Measure cost per task from real token counts, not the per-token price.
- Keep the eval set and rerun it when a new model ships.

## Further reading

- [Choosing the right model](https://platform.claude.com/docs/en/about-claude/models/choosing-a-model),
  Anthropic docs. The cheap-first and strong-first strategies, effort as a
  lever, and why your own eval set is the key step.
- [Model selection](https://developers.openai.com/api/docs/guides/model-selection),
  OpenAI docs. Model and effort as one choice, and "keep the lightest
  setting that meets your quality bar".
- [A statistical approach to model evaluations](https://www.anthropic.com/research/statistical-approach-to-model-evals),
  Anthropic, 2024. Error bars, paired comparisons, clustering and how many
  questions you need. Summarizes Evan Miller's paper.
- [Artificial Analysis Benchmarking Methodology](https://artificialanalysis.ai/methodology),
  Artificial Analysis. How a third party defines blended price and cost per
  task, and why token-hungry models cost more.
- [2025 Mid-Year LLM Market Update](https://menlovc.com/perspective/2025-mid-year-llm-market-update/),
  Menlo Ventures, 2025. Survey data on how teams really pick and switch
  models. Written by an investor in some of the companies it covers.
- [AI Engineering book resources](https://github.com/chiphuyen/aie-book),
  Chip Huyen, 2025. The chapter 4 summary: model selection as building a
  private leaderboard.
