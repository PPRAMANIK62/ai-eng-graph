---
id: anthropic-model-ids
title: Model IDs and versioning
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

How Claude model IDs map to model versions. Every model ID is a fixed snapshot: its weights never change. Older models carry a date in the ID and also have dateless aliases that point to the newest dated snapshot. From the 4.6 generation on, the dateless ID is itself the snapshot, not an alias. The serving setup around the model (router, safety classifiers, sampling) can still change and shift behavior slightly.

## Key claims

- IDs are pinned. "Each Claude model ID identifies a pinned version of the model." "the underlying model remains constant for the lifetime of that ID." (intro)
- Old format with a date: `claude-{name}-{major}-{minor}-{YYYYMMDD}`, e.g. `claude-sonnet-4-5-20250929`. (Before the 4.6 generation)
- Old aliases move: "these models also have shorter aliases (for example, `claude-sonnet-4-5`) that point to the most recent dated snapshot for that minor version." (same)
- New dateless format from 4.6: `claude-{name}-{major}[-{minor}]`, e.g. `claude-sonnet-4-6`, `claude-sonnet-5`, `claude-opus-5`. (The 4.6 generation and later)
- The misconception: "A common misconception is that dateless model IDs such as `claude-sonnet-4-6` behave as evergreen pointers that route to the latest or best-performing version. That is not the case." (Dateless IDs are pinned snapshots)
- "Anthropic does not update the weights or configuration of an existing model ID. When an updated version is available, it ships under a new model ID." (same)
- "A 4.6-generation ID such as `claude-sonnet-4-6` is not an alias. It is the snapshot." (same)
- Infrastructure still changes: "the serving infrastructure around the model can change over time. This infrastructure includes components such as the request router, safety classifiers, and sampling logic." (Model weights versus serving infrastructure)
- "Occasionally, infrastructure updates produce minor differences in observable behavior even when the model ID and weights have not changed." (same)

## Visuals worth redrawing

- Alias vs pinned ID: an alias arrow that moves from one dated snapshot to the next, next to a fixed ID.

## My notes

- Pairs with `chen-chatgpt-behavior-drift`: that paper is the evidence that an unpinned name can change under you.
