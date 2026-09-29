---
id: braintrust-prompts
title: Use prompts in code
author: Braintrust
url: https://www.braintrust.dev/docs/guides/prompts
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

How Braintrust's hosted prompts are loaded from code. Your app calls `loadPrompt()` / `load_prompt()` to fetch the prompt's configuration and builds the request from it. You can pin one version or load whatever version is assigned to an environment, and edits in the UI reach the running app without a redeploy.

## Key claims

- Loading: `loadPrompt()` (TypeScript), `load_prompt()` (Python) fetch a prompt's configuration, then `build()` turns it into request parameters. (Loading prompts)
- Pinning or environments: "To pin a specific version or load the version assigned to an environment, see Version prompts." (same)
- No redeploy: "changes you make in the UI take effect immediately without redeploying your application." (same)
- The `bt` CLI lists versions (`bt prompts versions`) and assigns a version to an environment. (CLI)

## Visuals worth redrawing

- None.

## My notes

- The page doesn't describe a rollback flow as such; rolling back would mean reassigning the environment to an older version.
