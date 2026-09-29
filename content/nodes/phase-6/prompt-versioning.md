---
id: prompt-versioning
title: How do you version prompts?
depth: short
phase: 6
note: >-
  Tracking every prompt change so you can compare versions and roll back.
needs: [prompts-as-code]
leads_to: []
compare_with: [model-upgrades]
updated: 2026-09-29
---

# How do you version prompts?

Prompt versioning means every change to a prompt gets a number you can
point to, so you can tell which version produced which answer, compare two
versions on the same tests, and go back when a change makes things worse.
There are two ways to do it: keep prompts in your repo and let git do the
versioning, or keep them in a prompt registry that versions them for you.

## The registry way: versions and labels

Say your support bot's system prompt is on version 6, and you save a
change. A registry stores it as version 7 automatically. Nothing in
production changes yet.

What production uses is decided by a **label**, a movable pointer to one
version. Langfuse has `production` for the version in use and `latest`,
which always points at the newest one, and you can add your own, such as
`staging`. Your code asks for the prompt by name, and by default it gets
the version labelled `production`. It can also ask for a specific version
number or a different label.

To ship version 7, you move the `production` label to it. To roll back,
you move the label back to version 6. No code change, no deploy. Braintrust
works the same way with environments: you pin a version or load whichever
version is assigned to an environment, and a change in the UI reaches the
running app right away.

![Prompt versions 5, 6 and 7 in a row. The latest label points at version 7. The production label first points at version 6, moves to version 7 to ship it, and moves back to version 6 to roll back. Code asks for the prompt by label, so none of these moves needs a deploy.](img/prompt-versioning-labels.svg)

## The repo way: git is the registry

The other way is [[prompts-as-code]]: the prompt is a function in your
codebase, it changes through a pull request, and its version is the git
commit. Rolling back is a revert and a deploy. You lose the "change it
without a deploy" speed, but the prompt gets code review, tests, and the
same history as the code that calls it.

Either way, record the version on every trace. The OpenTelemetry
conventions have fields for it (`gen_ai.prompt.name` and
`gen_ai.prompt.version`), so every answer in [[llm-tracing]] can be tied
to the exact prompt that produced it.

## Where it gets tricky

**Where should the prompt live?** The registry side values speed: you
change or roll back a prompt without a deploy. The prompts-as-code side says the prompt is the main interface
to the model and should be owned, reviewed and tested like the rest of your
code. Both have a point. A registry is faster to change, and the repo is
easier to review.

**The vendor can disappear.** Humanloop, a hosted prompt and eval platform,
was acquired and shut down. Its notice told customers that every prompt,
version, log and evaluation they stored there would be permanently deleted
on 2025-09-08. The notice
offered an export tool and pointed customers to other platforms. It's a strong argument for having a
copy of every production prompt in your own repo, even if you also use a
registry.

**A label move is a deploy.** Moving `production` to a new version changes
live behavior as much as shipping code does. Run your [[evals]] on the new
version before you move the label. Some registries let you lock labels so
only admins can move them (in Langfuse it's an enterprise feature).

**A prompt version isn't the whole story.** The same prompt on a different
model is a different system. Version the prompt and the model together
(see [[model-upgrades]]).

## What this means when you build

- Pick one home for the source of truth. If it's a registry, export to the
  repo regularly.
- Tag every trace with prompt name and version.
- Run evals on a new version before it gets the `production` label, and
  record the score next to the version.
- Rolling back should take one step. Try it once before you need it.

## Further reading

- [Prompt version control](https://langfuse.com/docs/prompt-management/features/prompt-version-control),
  Langfuse docs. Automatic versions, labels as pointers, and rollback by
  moving a label.
- [Use prompts in code](https://www.braintrust.dev/docs/guides/prompts),
  Braintrust docs. Loading a pinned version or an environment's version,
  with changes that skip the deploy.
- [12-Factor Agents, Factor 2: Own your prompts](https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-02-own-your-prompts.md),
  Dex Horthy, 2025. The case for prompts as first-class code in your repo.
- [Migrating from Humanloop](https://humanloop.com/docs/guides/migrating-from-humanloop),
  Humanloop, 2025. The shutdown notice: what was deleted and when.
