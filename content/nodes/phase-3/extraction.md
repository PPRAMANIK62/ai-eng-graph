---
id: extraction
title: How does LLM extraction work?
depth: deep
phase: 3
note: >-
  Pulling structured fields out of messy text, like names, dates and amounts from an email.
needs: [structured-output]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# How does LLM extraction work?

Extraction is turning messy text into fields your code can use: the
invoice number, amount and due date buried in an email, every medication
and dose in a clinical note, the people and companies in a news story. It's
the plainest way to put an LLM to work inside other software. As of
2026-09, getting valid JSON out is a solved problem. Getting the *right
values*, and all of them, is where the work is.

## From an email to a row in a table

Say your accounts team gets this:

> Hi, invoice INV-2291 for $4,300 is due on 15 October. Please pay into the
> usual account and send the remittance to accounts@acme.example. Thanks,
> Priya (Acme Ltd)

You want one row: `invoice_number`, `amount`, `currency`, `due_date`,
`vendor`, `contact_email`. You write that shape down once as a Pydantic or
Zod model, send the email with a request for [[structured-output]], and
parse the reply into a typed object. That's the whole pipeline for one
short email.

Three decisions make the difference between a demo and something you can
trust:

1. **The schema.** What fields, which ones can be empty, what counts as a
   valid value.
2. **The text you feed in.** One short email is easy. A 200-page contract
   is not.
3. **How you check.** A valid object can still hold a wrong date.

## Design the schema for the documents you really get

A few habits carry most of the weight.

**Let fields be empty.** The model will always try to fill your schema.
If the email doesn't give a due date and the field is required, you may
get one anyway, made up (see [[structured-output]]). Make it nullable and say in the prompt when to use
`null`. This is [[hallucination]] in a tidy wrapper, and the schema can't
catch it.

**Use a list for things that repeat.** For entities, use a list of
objects, each with `name`, `type` and the surrounding `context`, rather
than `person_1`, `person_2`, so any number of them fits.

**Ask for evidence.** A field holding the exact words the value came from,
or better its character position in the source, lets you check later that
the value is really there. More on that below.

**Keep it flat.** Strict schemas support only a subset of JSON Schema, and
Claude's structured outputs don't enforce numeric ranges or string
lengths, so "amount must be positive" has to be checked in your own code.

## Three ways to get the JSON out

The method has changed fast, and you'll meet all three in code you
inherit.

**Ask and parse.** Describe the JSON in the prompt, parse the reply, and
try again if it breaks. This still works with any model, and it's what
libraries like Instructor wrap: you pass a Pydantic model as
`response_model`, it parses and validates the reply, and on a validation
error it sends the error back to the model and asks again, up to
`max_retries`. It supports 15+ providers, including local models.
The retry loop itself is covered in [[schema-validation]].

**Force a fake tool.** Before native structured outputs, the trick on
Claude was to define
a "tool" whose input schema was the shape you wanted, force the model to
call it with `tool_choice`, and read the arguments. No function ever runs;
the arguments *are* the extraction. A 2024 Claude cookbook did
summaries, named entities, sentiment and classification this way. It's
[[tool-calling]] used for its schema, not for an action.

**Native structured outputs.** Now you send the schema itself and the
provider guarantees the reply matches it. On Claude, JSON outputs are the
feature for extracting data from text or images. There's no parse error to
retry, and as of 2026-09 the newest Claude models reject forced tool
calls, so the fake-tool trick doesn't carry over.

![What catches each kind of extraction error, for the invoice email. A strict schema catches invalid JSON, a missing required key, a wrong type and an enum value that isn't on the list. Your validation code catches rule breaks the schema can't express, like a negative amount or a due date before the invoice date, and a value whose quoted evidence doesn't appear in the email. Only a labelled test set catches a wrong value that is still plausible, like a valid date with the wrong year guessed for 15 October. In one 2026 benchmark, wrong values were the most common error under every prompting setup.](img/extraction-layers.svg)

## A valid shape is not a right answer

LLMStructBench, a 2026 benchmark, tested 22 open models on 995 hand-checked
extraction cases, under five prompting setups. Each setup was a mix of two
things: whether the JSON Schema was enforced through the runtime (Ollama's
`format` option) and whether the prompt included the schema and an
example. It scored each output two ways: is the document valid, and is
each value right.

The results line up with what the schema guarantee does and doesn't cover:

- The prompting setup mattered more than model size for getting valid
  JSON.
- The strictest setup (schema enforced, plus schema and example in the
  prompt) was the safest way to get parseable output from small models,
  but it produced *more* wrong values.
- Across every setup, wrong values were the biggest source of errors,
  ahead of missing keys and missing values.
- GPT-4o, added as a closed-model reference, showed no clear edge over the
  best open model (Gemma 3 27B).

So when you move to strict schemas, the errors don't vanish. They move
from "can't parse" to "parsed fine, says the wrong thing". The second kind
is quieter and worse: a wrong value flows into the next system with no
error at all.

## Long documents: split them up and read more than once

A model can take a million tokens in one go, but finding *many* facts in a
very long input is weaker than finding one. Needle-in-a-haystack tests at
that length show recall dropping when there are several facts to pull out
(see [[long-context]] and [[lost-in-the-middle]]).

Google's LangExtract library is built around that. It splits the document
into chunks (see [[chunking]]), runs the extraction on the chunks in
parallel, and makes several passes over each smaller context rather than
one pass over the whole thing. Several passes can find the same item more
than once, so the results have to be merged.

![Extraction over a long document. The document is split into chunks. Each chunk goes through the extraction model more than once, in parallel. The results are merged and duplicates are removed. Every extracted item keeps the character offsets of the text it came from, so you can highlight it in the original and check that the text is really there.](img/extraction-long-docs.svg)

## Tie every value to where it came from

LangExtract's other key idea is to map every extracted item back to its
exact character offsets in the source text. That buys you two things.

First, a cheap check for made-up values: if the text at those offsets
isn't what the model claimed, or the quoted evidence isn't in the document,
reject it. Second, faster human review: highlight each extraction in the
original, so checking it by eye is quick. This is [[grounding]] applied
to fields instead of sentences.

One catch on Claude: its built-in [[citations]] feature can't be combined
with JSON outputs (the API returns an error), so if you want evidence in a
structured reply, ask for it as a field.

## Measure it like a classifier

Extraction is scored the way you score a classifier. For each document in
a labelled set:

- **Recall**: of the values that should have been extracted, how many
  were?
- **Precision**: of the values that were extracted, how many are right?

Report both per field. An invoice extractor that nails `amount` but gets
`due_date` wrong one time in five has a due-date problem, and an average
over all fields hides it. It also helps to count errors by kind (missing
key, missing value, wrong value), because each has a different fix: schema,
prompt, or better evidence. Build the labelled set before you tune
anything; see [[evals]].

## Where it gets tricky

**"No retries needed" vs "always validate".** The structured-outputs docs
promise no retries for schema violations, and that's true. But the schema
can't express every rule, and it says nothing about whether the value is
correct. Both statements hold: constrained decoding guarantees the shape;
validating and re-asking is still how you enforce the rest.

**Forcing structure can cost accuracy.** The LLMStructBench result (more
structure, more wrong values, on small open models) echoes an older fight
over whether format constraints hurt reasoning, covered in
[[structured-output]]. The benchmark ran open models through Ollama, not
the hosted strict modes from OpenAI or Anthropic, so treat it as a warning
to measure, not a verdict on those APIs.

**There's no public scoreboard for your documents.** No benchmark tells
you how a hosted model does on your invoices or contracts. Extraction
quality depends on the documents, the fields and how ambiguous the text
is. You'll need your own labelled set.

**Old code, old tricks.** Much extraction code still forces a tool call to
get JSON. It works on older models and fails with a 400 on the newest
Claude models. When you upgrade, move it to native structured outputs.

**Good averages can hide a model you can't use.** If you use a confidence
score to decide what goes to a human, look at how the scores spread, not
just the averages. A model whose scores bunch up in the middle gives you
no safe threshold.

## What this means when you build

- Use native structured outputs for the shape. Make fields nullable and
  tell the model when to leave them empty.
- Validate every rule the schema can't express, and re-ask with the error
  ([[schema-validation]]).
- Ask for evidence: the quote or character span behind each value, and
  check it exists in the source.
- For long documents, chunk and extract in several passes, then merge.
- Label a set of real documents and report precision and recall per
  field before you change prompts or models.
- Count wrong values separately from missing ones. They're the common
  failure and the silent one.

## Further reading

- [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs),
  Anthropic, undated. JSON outputs for extraction, what the schema
  guarantee covers, and which constraints it can't enforce.
- [Extracting Structured JSON using Claude and Tool Use](https://platform.claude.com/cookbook/tool-use-extracting-structured-json),
  Alex Albert (Anthropic), 2024. The forced-tool method with five
  extraction examples. Useful as history and for reading older code.
- [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools),
  Anthropic, undated. Which Claude models no longer accept forced tool
  use, and what to use instead.
- [Instructor](https://python.useinstructor.com/), Jason Liu and
  contributors. The common library pattern: a Pydantic model in, a
  validated object out, with re-asking on errors.
- [LLMStructBench](https://arxiv.org/abs/2602.14743), Tenckhoff,
  Koddenbrock and Rodner, 2026. A benchmark that scores valid structure
  and correct values separately, and finds they pull apart.
- [Introducing LangExtract](https://developers.googleblog.com/en/introducing-langextract-a-gemini-powered-information-extraction-library/),
  Akshay Goel and Atilla Kiraly (Google), 2025. Character-offset
  grounding and multi-pass extraction over long documents.
- [Task-Specific LLM Evals that Do & Don't Work](https://eugeneyan.com/writing/evals/),
  Eugene Yan, 2024. How to score extraction and classification, and why
  good aggregate numbers can still hide an unusable model.
