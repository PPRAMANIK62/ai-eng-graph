---
id: model-upgrades
title: How do you upgrade a model safely?
depth: short
phase: 6
note: >-
  Moving to a new model version without breaking things: pinned versions, evals first.
needs: [evals, online-evals]
leads_to: []
compare_with: [prompt-versioning, provider-fallback]
updated: 2026-09-29
---

# How do you upgrade a model safely?

The model name in your code decides a lot of your app's behavior, so
changing it is a release like any other. A safe upgrade has two parts: pin
an exact model version so nothing changes without you knowing, and run your
evals on the new version before you switch.

## The same name can mean a different model

In 2023, researchers ran the March and June versions of GPT-4 through the
same tests. On telling prime numbers from composite ones, accuracy fell from
84% to 51%. GPT-3.5 went the other way on the same task and got much
better. GPT-4 also answered fewer sensitive questions in June, and both
models made more formatting mistakes when writing code. One common cause
was that GPT-4 got worse at following instructions. For anyone calling the
API, the model name was the same. The behavior wasn't.

That's the risk: if the name you call can point to a different model
tomorrow, your app can change with no change in your code.

## Pinned IDs and aliases

Providers answer this with pinned versions. With Claude, every model ID is
a fixed snapshot: the weights behind it never change, and an improved model
ships under a new ID.

The catch is in which names are IDs. Older Claude models have a date in
the ID, like `claude-sonnet-4-5-20250929`, plus a shorter alias,
`claude-sonnet-4-5`, that points at the newest dated snapshot. The alias
can move. From the 4.6 generation on, the IDs have no date
(`claude-sonnet-4-6`, `claude-sonnet-5`), and many people assume they're
aliases too. They aren't. `claude-sonnet-5` is the snapshot.

![Two ways to name a model. Top, an alias: claude-sonnet-4-5 points at the newest dated snapshot, so it could move to a newer snapshot without a code change. Bottom, a pinned ID: from the 4.6 generation on, a dateless ID such as claude-sonnet-5 is the snapshot itself and never moves; a newer model gets a new ID. A timeline shows that even a pinned ID ends: deprecation, at least 60 days' notice, then retirement, after which requests fail.](img/model-upgrades-alias-vs-pinned.svg)

## Pinning doesn't let you stay forever

Pinned models get retired. Anthropic moves a model from active to
deprecated, gives at least 60 days' notice, and then retires it, after
which requests to it fail. Claude Opus 4.1 (`claude-opus-4-1-20250805`),
for example, was deprecated on 2026-06-05 and retired on 2026-08-05, with
`claude-opus-4-8` as the suggested replacement. So you pin to avoid
surprise changes, and you still plan an upgrade every so often.

## Evals first, one change at a time

The upgrade itself follows the [[evals]] loop:

1. Run your eval set on the current model and record the score. That's
   the baseline.
2. Change only the model ID, and run the same set.
3. Compare. Look at the failures, not only the score.
4. Then, if you want, adjust the prompt for the new model and run again.

GitHub's secret-scanning team works this way. They rerun their offline
evals on every meaningful change to the prompt, the model, the input or the
system logic, record the prompt, model, dataset version and configuration
with each run, and change one thing at a time against a known baseline. A
newer model sometimes does better with a simpler prompt than the old model
did with lots of tuning, which is why step 4 is its own step. Their goal is
that testing a new model is cheap enough to be routine.

## Where it gets tricky

**Pinned weights aren't a frozen system.** Even with a fixed ID, the
serving setup around the model can change: the request router, the safety
classifiers, the sampling logic. Updates there can cause small differences in
behavior with no change to the ID or the weights. Pinning reduces drift.
It doesn't remove it, so keep some [[online-evals]] running on production
traffic too.

**Upgrades can break requests, not just answers.** New models can drop
settings the old ones took. On Claude 4.7 and later, setting `temperature`,
`top_p` or `top_k` to a non-default value returns an error. Run your real
request code in the eval, not a simplified copy.

**Offline evals are a gate, not proof.** A passing offline eval is enough
evidence to start testing online, with guardrails. It doesn't show how the
new model behaves on every real case.

## What this means when you build

- Use exact model IDs in production, never an alias. Keep the ID in one
  place, next to the prompt it was tested with (see [[prompt-versioning]]).
- Record the model on every trace, so you can compare old and new in
  [[llm-tracing]].
- Keep a baseline eval score for the current model. An upgrade is a
  comparison against it.
- Watch the deprecation page. Start testing the replacement as soon as
  your model is deprecated.

## Further reading

- [How is ChatGPT's behavior changing over time?](https://arxiv.org/abs/2307.09009),
  Lingjiao Chen, Matei Zaharia and James Zou, 2023. The standard evidence
  that the "same" model can change a lot in a few months.
- [Model IDs and versioning](https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions),
  Anthropic docs. Pinned IDs vs aliases, the dateless IDs from 4.6 on, and
  why behavior can still shift.
- [Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations),
  Anthropic docs. The lifecycle from active to retired, the notice period,
  and real retirement dates.
- [How to evaluate LLMs before production](https://github.blog/ai-and-ml/llms/how-to-evaluate-llms-before-production/),
  Mariko Wakabayashi and Zixiao Chen (GitHub), 2026. A team's working
  process for evaluating prompt and model changes before shipping.
