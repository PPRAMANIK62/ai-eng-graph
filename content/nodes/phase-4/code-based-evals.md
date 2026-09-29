---
id: code-based-evals
title: What are code-based evals?
depth: short
phase: 4
note: >-
  Checks a script can run on an output: exact match, regex, valid JSON, has a citation.
needs: [evals]
leads_to: []
compare_with: [llm-as-judge]
updated: 2026-09-29
---

# What are code-based evals?

A code-based eval is a grader written as ordinary code: a function that takes
the model's output and returns pass or fail by a fixed rule. It's the
cheapest, fastest and most repeatable kind of grader in an [[evals|eval]],
so it's the one to reach for first, and the one to rule out before you pay
for a model or a person to grade.

## One output, several small checks

Say your feature drafts a reply to a support ticket and also tags the ticket
`billing`, `bug` or `account`. You don't need a model to check most of
what matters about that output. A few lines of code each:

- **The tag is right.** Compare it with the label you wrote down, after
  trimming spaces and lowercasing. That's an exact match.
- **Required words are there.** The reply mentions the refund policy when
  the tag is `billing`. That's a string check: is this phrase in the output?
- **Forbidden words aren't.** No internal ticket IDs, no "as an AI". The
  same check, flipped.
- **The length is in range.** Between two and six sentences. Count them.
- **The output has the right shape.** If the feature returns JSON, parse it
  and check the fields (see [[structured-output]] and
  [[schema-validation]]).

![One support reply going through five code checks. The output: tag "billing" and a four-sentence reply that mentions the refund policy but also contains the internal ID TCK-88213. Checks: tag equals the expected label, pass. Contains "refund policy", pass. Contains no internal ID, fail. Two to six sentences, pass. Valid JSON with the right fields, pass. Each check is a few lines of code, returns pass or fail, and gives the same answer every time.](img/code-based-evals-checks.svg)

Each check is tiny, runs fast and costs nothing per run. Together they
cover a surprising share of what can go wrong. A useful rule of thumb from
practitioners: write at least three such checks per feature. If you can't
think of three, the feature may not be defined well enough yet, or it's too
open-ended to test this way, like a general chatbot. Run them on every change
to the pipeline: a prompt edit, new retrieved context, a new model.

## The common kinds

**Exact match.** The output equals the expected answer, usually after
normalizing case and whitespace. Right for anything with a fixed set of
answers: a label, a yes/no, a number.

**Contains, or doesn't.** A phrase or pattern must appear, or must not. A
regex is the same idea with more power.

**Counts in a range.** Words, sentences, list items.

**Run it.** For generated code, execute it and check the result. If the user
asked for a function named `foo`, then after running the output, `foo`
should exist and be callable. The same goes for SQL that should run, or a
tool call whose arguments should validate (see [[tool-calling]]).

**Overlap with a reference.** Metrics like ROUGE-L compare the output with a
reference answer you wrote, by counting shared words in order. Embedding
[[cosine-similarity]] compares meaning instead of words, and can check that
paraphrased questions get similar answers. These are code too, but they
return a score, not a clear pass or fail, so you need a threshold.

## Some checks need a reference, some don't

An exact match needs the right answer stored next to each test case.
Many useful checks don't: "no internal IDs", "valid JSON", "under 200
words" work on any output, including live traffic where nobody knows the
right answer.

Those reference-free checks can do double duty. The same function that
fails a test case can block a bad reply in production before a user sees
it. That's a [[guardrails|guardrail]], and it's why code checks often end
up in both places.

## Where it gets tricky

**Brittle in both directions.** A check that's too strict fails good
answers. "Paris" fails an exact match against "The capital is Paris." A
check that's too loose passes bad ones. The practical advice for code that
the model writes is to relax each check to the weakest condition any
correct answer must meet, and no weaker. The same goes for text: check for
"Paris", not for the whole sentence.

**Code can't judge meaning.** A reply can mention the refund policy and
still get it wrong, and a code check will pass it. ROUGE-L and similar
scores tell you the output shares words with a reference, not that it's
correct or helpful. A correct answer in different words scores low. For
tone, helpfulness or "did it answer the question", you need
[[llm-as-judge|a model grader]] or a person.

**Test the check.** A regex with a typo passes everything, and you'd never
know. Feed each check one output that should pass and one that should fail
before you trust it.

## What this means when you build

- Start every eval with code checks. Add a model grader only for what code
  can't decide.
- Write at least three checks per feature, from real inputs and outputs.
- Make checks as loose as correctness allows.
- Run them on every prompt, context or model change. They're cheap enough
  to run in CI.
- Reuse the reference-free ones as guardrails in production.

## Further reading

- [Define success criteria and build evaluations](https://platform.claude.com/docs/en/test-and-evaluate/develop-tests),
  Anthropic docs. Worked code graders (exact match on sentiment labels,
  cosine similarity for consistency, ROUGE-L for summaries) with Python.
- [What We’ve Learned From A Year of Building with LLMs](https://applied-llms.org/),
  Eugene Yan, Bryan Bischof, Charles Frye, Hamel Husain, Jason Liu and
  Shreya Shankar, 2024. Assertion-based tests from real samples, relaxing
  assertions, and reference-free evals as guardrails.
