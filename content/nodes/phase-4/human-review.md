---
id: human-review
title: What is human review in evals?
depth: short
phase: 4
note: >-
  People grading outputs. Slow and costly, and the usual reference point, though people miss things too.
needs: [evals]
leads_to: []
compare_with: [llm-as-judge]
updated: 2026-09-29
---

# What is human review in evals?

Human review means a person reads your feature's outputs and grades them.
It's the slowest and most expensive grader in an [[evals|eval]], so you
don't use it for everything. You use it where nothing else can decide, and
to produce the labels every automated grader gets checked against. Those
labels are the usual reference point, but they aren't perfect: people miss
things too, in ways you can predict.

## What the reviewer produces

Take a mental-health support chatbot. Every week, someone reads a sample of
its conversations and marks each one pass or fail against a short rubric:
did it stay supportive, did it avoid giving medical advice, did it point to
crisis resources when it should. Each verdict, with a note on why, is a
**label**.

Those labels do three jobs:

- **Grading directly**, for the cases where no code check or model grader
  can be trusted yet.
- **Finding failures** you didn't know to test for. Reading outputs and
  naming what goes wrong is [[error-analysis]].
- **Checking the other graders.** An [[llm-as-judge|LLM judge]] is only as
  good as its agreement with human labels on the same outputs.

## Who should review

For most small and medium teams, the advice from practitioners is one
person: a domain expert who sets the quality bar and has the final say. For
the mental-health bot, that's a psychologist. For a legal tool, a lawyer.
One person means no arguments over conflicting labels. If you feel you need
five experts to judge one conversation, that's a sign the product is trying
to do too much.

Sometimes you do need several reviewers, for example across markets with
different cultural norms. Then:

1. Have them label the same examples on their own, before discussing.
2. Measure how often they agree, with a statistic like Cohen's kappa that
   corrects for agreement by chance.
3. For each disagreement, find the part of the rubric that caused it, and
   add a rule or an example that settles it. Relabel the affected cases.
4. If they still disagree, the domain expert decides and writes down why.

## People miss things too

Human labels are the reference, but a reference with known blind spots.

**Confident answers hide errors.** In a 2023 study, crowdworkers rated model
answers and marked specific errors. The authors also labeled 300 examples
per error type carefully themselves. Crowdworkers under-counted factual
errors, and the gap grew when the model sounded sure of itself:

![Bar chart of how many factual errors crowdworkers missed compared with careful annotation, as the difference in error rates. When the model answered cautiously, crowdworkers found 5.3 points fewer factual errors. At the baseline, 16.2 points fewer. When it answered assertively, 22.3 points fewer. The more confident the answer, the more errors slipped past.](img/human-review-assertiveness.svg)

The same study found that overall quality ratings tracked confidence
closely (a correlation of 0.68), while factual errors counted for little
in the overall score. That matters beyond evals: models trained on human
preferences (see [[rlhf]]) may learn to sound more confident, not to be
more correct.

**Some errors are harder to see.** Reviewers agreed closely on whether an
answer refused the question (0.94) and much less on whether it had a factual
error (0.64). Spotting a refusal takes a glance. Checking a fact takes work.

**The criteria move while you grade.** People who grade outputs change their
minds about what "good" means as they see more outputs. They add criteria
when a new kind of bad output shows up, and they reinterpret old ones, even
going back to change earlier grades. This is called criteria drift. You
can't fully write the rubric before you start; you finish it by grading.

## What this means when you build

- Pick one domain expert to own quality, if you can. If you're a solo
  developer, that's you.
- Ask for pass or fail plus a short reason, not a bare score.
- Give reviewers what they need to check facts: the source documents, the
  user's account, the tool results. Otherwise they'll grade on tone.
- Expect the rubric to change in the first rounds. Relabel when it does.
- If more than one person labels, measure agreement before you use the
  labels to check a judge.
- Treat the labels as the best reference you have, not as the truth.

## Further reading

- [Q: How many people should annotate my LLM outputs?](https://hamel.dev/blog/posts/evals-faq/how-many-people-should-annotate-my-llm-outputs.html),
  Hamel Husain and Shreya Shankar, 2025. The single-expert approach, when to
  add annotators, and how to settle disagreements.
- [Human Feedback is not Gold Standard](https://arxiv.org/abs/2309.16349),
  Tom Hosking, Phil Blunsom and Max Bartolo, 2023 (ICLR 2024). Evidence that
  human ratings under-weight factual errors and reward confident answers.
- [Who Validates the Validators?](https://arxiv.org/abs/2404.12272),
  Shreya Shankar et al., 2024. Where the term criteria drift comes from:
  people refine what "good" means as they grade.
