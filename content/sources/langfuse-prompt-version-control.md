---
id: langfuse-prompt-version-control
title: Prompt version control
author: Langfuse
url: https://langfuse.com/docs/prompt-management/features/prompt-version-control
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The prompt-registry model. Every saved prompt gets a new version number automatically. Labels such as `production`, `staging` or `latest` point at versions, your code fetches by label, and rolling back means moving the `production` label to an older version, with no deploy.

## Key claims

- Automatic versions: "Each prompt version is automatically assigned a `version ID`." (Versions and labels)
- Labels mark environments, tenants or experiments; `latest` tracks the newest version and `production` the one in use. (same)
- Default fetch: "When using a prompt without specifying a label, Langfuse will serve the version with the `production` label." (same)
- Fetch by version or label: `get_prompt("name", version=1)`, `get_prompt("name", label="staging")`. (Fetching prompts)
- A missing label returns a 404 instead of silently falling back. (Label resolution)
- Rollback: "You can quickly rollback to a previous version by setting the `production` label to that previous version in the Langfuse UI." (Rollbacks)
- Protected labels (enterprise plan) stop non-admins from changing labels like `production`. (Protected labels)

## Visuals worth redrawing

- Versions as a row of boxes with `production` and `latest` as movable pointers; rollback as moving the pointer back.

## My notes

- Same idea as git tags or a deploy pointer. The tradeoff vs prompts in the repo: fast changes without a deploy, but the prompt lives outside your code review and depends on the vendor.
