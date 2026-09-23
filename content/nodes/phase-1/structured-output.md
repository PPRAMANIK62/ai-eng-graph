---
id: structured-output
title: How do you get structured output?
depth: deep
phase: 1
note: >-
  Getting JSON that matches a schema instead of free text.
needs: [chat-api]
leads_to: []
compare_with: []
status: review
updated: 2026-09-23
---

# How do you get structured output?

Most of the time, the thing reading a model's answer isn't a person. It's
your code. Structured output means getting the model to reply with JSON that
matches a schema you define, so your code can parse it without guessing. As
of 2026-09 the big APIs can guarantee the shape of that JSON, but not what's
inside it, and the gap between the two is where the bugs live.

## Start with one email

Say your sales tool receives this message:

> John Smith (john@example.com) is interested in our Enterprise plan and
> wants to schedule a demo for next Tuesday at 2pm.

Your CRM doesn't want a paragraph about John. It wants four fields:

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "plan_interest": "Enterprise",
  "demo_requested": true
}
```

This is the most common way an LLM ends up inside real software. The model
takes messy text in and hands typed data out. One way to put it: be liberal
in what you accept (any natural language) and strict in what you send
(typed, machine-readable objects). A real-estate CRM that needs fields to
render widgets, an idea generator that needs a title, summary and score for
each idea, a system that picks which skill to run and with what parameters:
all the same pattern.

The question is how you make sure the model's reply is actually that JSON,
every time.

## Three ways to ask, three levels of promise

You make a normal request through the [[chat-api]], and there are three
ways to ask for JSON. Each one promises more than the last.

| | Just ask in the prompt | JSON mode | Strict schema |
|---|---|---|---|
| Output parses as JSON | Usually | Yes | Yes |
| Output matches your schema | Usually | No | Yes |
| How | "Reply only with JSON like…" | A flag, e.g. `type: "json_object"` | Send the schema with strict mode on |

**Just asking** works surprisingly often and fails in annoying ways. Even
with a careful prompt you'll see invalid JSON syntax, missing required
fields, a number where you wanted a string, and a retry loop to clean it all
up.

**JSON mode** is the older fix. It promises the reply parses as JSON, and
nothing more. The keys can be anything. It also has a trap: if nothing in
your messages tells the model to write JSON, it can produce whitespace
forever until it hits the token limit. OpenAI's API guards against this by
returning an error unless the string "JSON" appears somewhere in the
context.

**A strict schema** is what OpenAI calls Structured Outputs and Anthropic
calls structured outputs (JSON outputs for the reply, strict tool use for
tool inputs). You send a JSON Schema with the request, and the reply is
guaranteed to follow it: every required key present, every type right, no
enum value that isn't on your list. Use it instead of JSON mode wherever
it's available. OpenAI supports it from GPT-4o (the
`gpt-4o-2024-08-06` snapshot, 2024) on; on Claude the current parameter is
`output_config.format`, which replaced a beta that used the header
`structured-outputs-2025-11-13`.

With the SDKs you usually don't write the schema by hand. You define a
Pydantic model in Python or a Zod object in JavaScript, and the SDK turns it
into a schema and parses the reply back into that type.

![The same sales email sent three ways. Just asking in the prompt can return JSON wrapped in code fences with the demo_requested field missing. JSON mode returns valid JSON but with its own keys, like customer and wants_demo set to "yes". A strict schema returns exactly the four fields: name, email, plan_interest and demo_requested as true. The labels read hopes, parses and matches.](img/structured-output-three-levels.svg)

## How a schema gets enforced

The model writes one token at a time, picking each from a probability list
(see [[next-token-prediction]] and [[sampling]]). A strict schema changes
that pick. Before the model chooses, every token that would break the
schema is ruled out, so only valid continuations can be picked. If the JSON
so far is `{"demo_requested": `, the only tokens left are the ones that
start `true` or `false`.

That's called constrained decoding. The trick that makes it fast is doing
the hard work ahead of time: the schema is compiled into a grammar, which
can be treated as a state machine, and for each state you work out once
which tokens from the model's vocabulary are allowed. At run time that's a
lookup, which adds little overhead per token. The phase 3 node on
constrained decoding covers this properly.

![One generation step with a strict schema. The JSON so far is {"demo_requested": . The model gives probabilities to true, false, yes, a quote mark and maybe. The grammar then rules out yes, the quote mark and maybe, which are greyed out and crossed, so only true and false are left to sample from. The probabilities are illustrative.](img/structured-output-one-step.svg)

Two costs come with this:

- **The first request is slower.** The first time you send a schema, the
  provider compiles it, which adds latency. After that it's cached. On
  Claude, a compiled grammar stays cached for 24 hours from its last use,
  and changing the schema's structure starts over.
- **A few extra input tokens.** Claude gets a short added
  [[system-prompt]] explaining the format, which you pay for like any other
  input.

## Not every schema is allowed

Both providers support a subset of JSON Schema, and the subsets differ.

On OpenAI, as of 2026-09, every field must be listed as `required` and
every object must set `additionalProperties: false`. A schema can have up
to 5,000 object properties and 10 levels of nesting.

On Claude, recursive schemas, numeric limits like `minimum` and `maximum`,
and string length limits aren't supported. There's also a complexity cap:
at most 20 strict tools per request and 24 optional parameters across all
strict schemas combined. Each optional parameter roughly doubles part of the
grammar, which is why the limit exists.

The practical rule: keep schemas flat, make fields required, and check any
constraint your schema can't express (like "age between 0 and 120") in
your own code.

## Where it gets tricky

**A valid shape can hold made-up values.** This is the big one. The schema
guarantees there's a `demo_requested` boolean. It doesn't guarantee the
email mentioned a demo. The model will always try to fit the schema, so
when the input has nothing to do with it, it fills the fields with made-up
values. Feed the email extractor a restaurant review and
you may still get a name and an email address back. Practitioners report
the same thing without schemas: ask an LLM to extract a field and it may
confidently return a value that isn't in the document. That's
[[hallucination]] in a tidy JSON wrapper. Give the model a way out, like a
field that can be `null` (on OpenAI, where every field is required, that's
a union type with `null`), and say in the prompt when to use it.

**"Guaranteed" has exceptions.** Three cases can still break the schema:

- **Refusals.** If the model refuses for safety reasons, the refusal wins
  over the schema. On Claude you get `stop_reason: "refusal"` with a 200
  status, and you're billed. On OpenAI the reply carries a separate
  `refusal` field.
- **Hitting the token limit.** If the output runs out of room, you get
  half a JSON object. Claude reports `stop_reason: "max_tokens"`; OpenAI
  returns `status: "incomplete"` with the reason `max_output_tokens`. Check the stop reason before you parse.
- **Small print.** Claude doesn't guarantee the capitalization of enum
  values: it can return "Conversation Topic 3" when your enum says
  "Conversation topic 3", with no error. Compare enums case-insensitively.

**Key order differs between providers.** OpenAI writes keys in the order
your schema lists them. Claude keeps your order too, except required
properties come before optional ones. This matters more than it sounds,
because the model writes left to right: a `reasoning` field placed before
`answer` lets it think before it commits (that's [[chain-of-thought]] inside
JSON). On Claude, if `reasoning` is optional and `answer` is required,
`answer` comes first.

**Does forcing a format make answers worse?** This is argued about. A 2024
paper, "Let Me Speak Freely?", reported that reasoning got noticeably worse
under format restrictions, and worse the stricter the format. The team
behind the Outlines library re-ran the tasks with the same model
(Llama-3-8B-Instruct) and got the opposite: structured slightly ahead on all
three, for example 0.78 vs 0.77 on GSM8K and 0.77 vs 0.73 on Last Letter.
Their explanation was that the paper had used different prompts for the two
setups, hadn't given the JSON prompts enough information, and had mixed up
JSON mode with real constrained generation. Neither side is neutral: the
rebuttal comes from a company that builds structured generation, and its
re-run used one small open model, not a hosted API. The fair reading is that how you add
structure matters: a clear prompt, and room to reason before the answer.
Neither provider promises anything about answer quality, only about
shape.

**Some features don't mix.** On Claude, JSON outputs can't be combined with
citations (the API returns a 400) or with prefilling the assistant's reply.

## What this means when you build

- Use strict schemas, not JSON mode and not "please reply in JSON". Parsing
  failures stop being your problem.
- Define the schema once in code (Pydantic, Zod) and let the SDK produce the
  JSON Schema, so the two can't drift apart.
- Always check the stop reason before you parse. Handle refusal and
  max-tokens as their own cases.
- Validate the values, not just the shape. Allow `null` or "not found", and
  check anything your schema can't express.
- Put a reasoning field before the answer field when the task needs
  thought, and make both required so the order holds.
- Don't build your own JSON repair tooling. In 2024 practitioners were
  already advising against deep investment here, since providers had every
  reason to solve it, and by 2026 they have.
- Expect a slower first call per schema, and test with your real schema
  early to find what isn't supported.

## Further reading

- [Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs),
  Anthropic, undated (checked 2026-09-23). Claude's version: how it works,
  grammar caching, unsupported schema features, complexity limits, and the
  cases where output can still break.
- [Structured model outputs](https://developers.openai.com/api/docs/guides/structured-outputs),
  OpenAI, undated (checked 2026-09-23). Structured Outputs vs JSON mode,
  schema rules and limits, refusals, and the warning that values can still
  be wrong.
- [Efficient Guided Generation for Large Language Models](https://arxiv.org/abs/2307.09702),
  Willard and Louf, 2023. The state-machine idea behind constrained
  decoding and the Outlines library.
- [Let Me Speak Freely?](https://arxiv.org/abs/2408.02442), Tam et al.,
  2024. The study claiming format restrictions hurt reasoning.
- [Say What You Mean: A Response to 'Let Me Speak Freely'](https://blog.dottxt.ai/say-what-you-mean.html),
  Will Kurt (.txt), 2024. The rebuttal, with a re-run that finds the
  opposite and a clear explanation of JSON mode vs constrained generation.
- [What We've Learned From A Year of Building with LLMs](https://applied-llms.org/),
  Yan et al., 2024. Why structured output is the lasting pattern for
  putting LLMs in software, with real product examples.
