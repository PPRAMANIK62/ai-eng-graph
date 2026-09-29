---
id: anthropic-model-deprecations
title: Model deprecations
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/about-claude/model-deprecations
published: undated           # table includes a 2026-06-05 notice and 2026-09 retirement dates
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Anthropic's model lifecycle and retirement table. Models go from active to legacy to deprecated to retired, and requests to a retired model fail. Customers get at least 60 days' notice, and the page tells you to test replacements well before the retirement date. So even a pinned model has to be upgraded eventually.

## Key claims

- Lifecycle: Active, Legacy, Deprecated ("still functional but no longer recommended"), Retired: "The model is no longer available for use. Requests to retired models will fail." (Overview)
- Notice: "providing at least 60 days' notice before model retirement for publicly released models." (Notifications)
- Test first: "consider thorough testing of your applications with the new models well before the retirement date." (Migrating to replacements)
- Example: `claude-opus-4-1-20250805` deprecated 2026-06-05, retired 2026-08-05, replacement `claude-opus-4-8`. `claude-sonnet-4-20250514` deprecated 2026-04-14, retired 2026-06-15, replacement `claude-sonnet-4-6`. (Deprecation history)
- As of the access date, `claude-sonnet-4-5-20250929` is active with retirement "Not sooner than September 29, 2026". (Model status table)
- The status table lists both `claude-sonnet-5` (retirement not sooner than 2027-06-30) and `claude-sonnet-5-5` (not sooner than 2027-09-28) as active. (Model status table)
- Parameters get deprecated too: `temperature`, `top_p`, `top_k` return a 400 error when set to a non-default value on Claude 4.7 and later. (API parameter deprecations)

## Visuals worth redrawing

- A timeline for one model: release, deprecation notice, 60+ days, retirement.

## My notes

- Opus 4.1 had exactly two months between notice and retirement (2026-06-05 to 2026-08-05).
