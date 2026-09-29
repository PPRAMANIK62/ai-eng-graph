---
id: schema-validation
title: Why validate structured output?
depth: short
phase: 3
note: >-
  Checking the output's values after the fact, and retrying or repairing when they're wrong.
needs: [structured-output]
leads_to: []
compare_with: [constrained-decoding]
updated: 2026-09-29
---

# Why validate structured output?

A strict schema (see [[structured-output]]) guarantees the *shape* of the
JSON you get back: the right
keys, the right types. It doesn't guarantee the values make sense. Schema
validation is the check you run after the reply arrives, and when it fails,
you send the error back to the model and ask it to fix its answer. It's
cheap to add, and it catches the mistakes [[constrained-decoding]] can't.

## The shape is right, the value is wrong

Say you ask for `{"name": string, "age": integer}` from the text "jason is 25
years old", and your system needs names in capitals. The model returns
`{"name": "jason", "age": 25}`. It parses. The types match. Your rule is still
broken.

Some rules a schema can't carry at all. Others it could in principle, but
the API won't enforce them. As of 2026-09, Claude's structured outputs don't
support numeric limits like `minimum` and `maximum`, or string length limits
like `minLength` and `maxLength`. Send them in the schema and you get a 400
error. Anthropic's Python, TypeScript, Ruby and PHP SDKs work around this: they strip the
unsupported limit out of the schema you send, write it into the field's
description instead ("Must be at least 100"), and then check the reply
against your original schema. So the limit becomes a hint to the model plus a
check in your code. The model is asked nicely; only the check is a guarantee.

Then there are rules no schema language can express:

- A quote the model says it found must actually appear in the source text.
- A generated SQL query must run against your database.
- An answer must not say anything objectionable, judged by a second model.

All three are checks on values, and all three need your own code.

## Validate, then ask again with the error

In Python the usual tool is a Pydantic model with validators on the
fields. Parsing the reply runs the validators. If one fails, you get an
error message that says what's wrong, in plain words.

That error message is the useful part. Libraries like Instructor and Pydantic
AI turn it into a retry loop:

1. Call the model with the schema.
2. Parse the reply and run the validators.
3. If they pass, you're done.
4. If not, add the model's bad reply and the error message to the
   conversation as a new user message ("Please correct the function call;
   errors encountered: ..."), and call again.
5. Stop after a set number of retries.

![A loop. Call the model with the schema. Parse and validate the reply. If it passes, use it. If it fails, append the bad reply and the error message to the messages and call again, until the retry budget runs out. The example from Instructor's docs: the input says jason is 25 years old, a validator requires the name in uppercase, the first reply has name jason and fails with the error Name must be in uppercase, and the retry comes back with JASON.](img/schema-validation-retry-loop.svg)

The model sees exactly what it got wrong. Instructor calls this reasking,
and frames "self-correction" as nothing more than validation errors with
clear messages. The same loop also catches replies that don't parse as JSON
at all.

The two libraries differ in the details:

- **Instructor** takes `max_retries` on the call. Validators can be plain
  code or `llm_validator`, where another model checks a rule and writes the
  error message. You can pass extra `context` to validators, like the source
  document, so a validator can check that a quoted passage really exists in it.
- **Pydantic AI** validates output with Pydantic, and lets you add output
  validators for checks that need IO, like running `EXPLAIN` on a generated
  SQL query. A validator raises `ModelRetry` to send the model back. The
  retry budget defaults to 1.

## Where it gets tricky

**"No retries needed" is about the shape.** Anthropic's docs sell strict
schemas as needing no retries for schema violations, and for the shape that's
true. It says nothing about values. You still need the loop for your own
rules.

**Retries cost a full call each.** Every retry resends the whole
conversation plus the bad reply and the error, so it's a longer prompt than
the first. Pydantic even puts a documentation URL in every error message,
and Instructor ships a helper to strip it, just to save tokens. Keep error
messages short and specific.

**A retry can't fix a missing fact.** If the value isn't in the input, no
error message can make it appear, and a model pushed to fill the field will
make something up (see [[hallucination]]). Give the model a way out instead. Pydantic AI's SQL example makes the output
either a query or an "invalid request" with an error message, so the model
can decline instead of forcing a bad query past the validator.

**Streaming runs validators early.** In Pydantic AI, output validators run on
every partial output while streaming, not only the final one. A check that
needs the whole object should look at the `partial_output` flag and wait for
the final one.

## What this means when you build

- Use strict schemas for shape, and validators for values. You need both.
- Put every rule the API won't enforce (ranges, lengths, formats) in a
  validator, and let your SDK move it into the field description.
- Write error messages for the model: what's wrong, and what a right answer
  looks like.
- Keep the retry budget small (1 or 2), and decide what happens when it runs
  out: fall back, flag for a human, or fail loudly.
- Log retries. A field that fails often is a prompt or schema problem, and a
  good case for your [[evals]].

## Further reading

- [Validation and Reasking](https://python.useinstructor.com/concepts/reask_validation/),
  Instructor docs. The reask loop, LLM-based validators, and context-aware
  validation, with code.
- [Output](https://pydantic.dev/docs/ai/core-concepts/output/), Pydantic AI
  docs. Tool, native and prompted output, output validators, `ModelRetry` and
  the retry budget.
- [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs),
  Anthropic docs. Which JSON Schema limits Claude doesn't enforce, and how the
  SDKs move them into descriptions and validate afterwards.
