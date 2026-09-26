---
id: prompts-as-code
title: Why treat prompts as code?
depth: short
phase: 1
note: >-
  Prompts kept in version control and tested like code.
needs: [system-prompt]
leads_to: []
compare_with: []
updated: 2026-09-23
---

# Why treat prompts as code?

In an LLM app, the prompt decides more of the behavior than most of your
functions do. Change one sentence in the [[system-prompt]] and the product
behaves differently. So the prompt deserves what any important code gets:
version control, review, tests, and a normal deploy.

## A prompt is a function

Here's a prompt as it often starts life, pasted into a string somewhere:

```python
SYSTEM = "You are a support bot. Be nice. Answer questions."
```

And here's the same thing treated as code:

```python
# prompts/ticket_triage.py
def triage_prompt(ticket: str, product: str) -> dict:
    return {
        "system": (
            f"You sort support tickets for {product} into one label: "
            "billing, bug or account. Reply with the label only."
        ),
        "messages": [{"role": "user", "content": ticket}],
    }
```

It lives in one small module next to the feature that uses it. The inputs
are typed arguments, not string glue. It changes through a pull request, so
someone reviews the diff. And it has tests: a handful of real tickets with
the labels you expect, run before any change ships.

A useful way to think about it: the developer instructions are the function
body, the business rules. The user's message is the argument.

![A prompt change moving left to right through four steps: the prompt lives in a file in the repo, a pull request changes one line of the system prompt, an eval run compares the score before and after the change, and the change deploys behind a feature flag with the model snapshot pinned.](img/prompts-as-code-pipeline.svg)

## Even the providers moved this way

OpenAI used to let you store reusable prompt objects on its side and call
them by id. It's now deprecating them. Creating new ones was de-emphasized
from 2026-06-03, and the `v1/prompts` endpoint is scheduled to shut down on
2026-11-30. OpenAI's own guide now tells you to store production prompts in
your application code, so you can use typed inputs, code review, tests and
your normal deploy process. If you already call a saved prompt by id, it
has a migration guide for moving it into code.

The same guide gives the rest of the recipe:

- Keep prompt builders in a small module near the feature.
- Pass dynamic values (customer data, files, options) as typed arguments.
- Add fixtures, tests and eval checks before changing a production prompt.
- Roll out changes through your deploy system, with feature flags when you
  need a staged release.
- Pin your app to a specific model snapshot, because even snapshots in the
  same model family can behave differently.

## Don't let a framework hide the prompt

The other way to lose control of a prompt is to let a framework write it.
Some agent frameworks take fields like `role`, `goal` and `personality` and
assemble the prompt for you. That gets you started fast. But when the
output is wrong, you can't easily see or tune the exact text the model got.

The "12-Factor Agents" guide (2025) puts it as a rule: own your prompts.
Write the full prompt yourself, as a function, so you know exactly what
instructions the model gets, and so you can test and change them like any
other code.

## Where it gets tricky

**A prompt is tied to a model.** The same prompt can behave differently on
another model, or even another snapshot of the same model. That's why
pinning the model matters as much as versioning the prompt: the prompt and
the model version form one unit you test together.

**Tests for prompts aren't like unit tests.** The output is open-ended
text, so exact-match asserts only go so far. "Test your prompts" really
means an eval set: real inputs, expected results, and a score you track
over time. That's its own topic, coming in a later phase.

**Code review doesn't catch everything.** A reviewer can read a one-line
prompt diff and still have no idea what it does to the output. The eval run
is what tells you.

## What this means when you build

- Keep every production prompt in your repo, in one place per feature.
- Build prompts with functions and typed inputs, not string concatenation
  spread across files.
- Pin the model version in the same place, and change the two together.
- Run a small eval set on every prompt change, and record the score.
- If you use a framework, make sure you can print the exact prompt it
  sends.

## Further reading

- [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering),
  OpenAI docs. The deprecation of hosted prompt objects, and the practical
  recipe for prompts in code, snapshots and evals.
- [12-Factor Agents, Factor 2: Own your prompts](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-02-own-your-prompts.md),
  Dex Horthy, 2025. A short argument against letting frameworks hide your
  prompts.
