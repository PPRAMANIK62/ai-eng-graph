---
id: anthropic-long-running-harnesses
title: Effective harnesses for long-running agents
author: Justin Young (Anthropic)
url: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
published: 2025-11-26
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

How Anthropic got a coding agent to keep making progress on one project across many context windows. Compaction alone wasn't enough. The fix was a first "initializer" session that writes a feature list (JSON), a progress file and an init script and makes a git commit, and later sessions that start by reading the progress file and git log, work on one feature, test it end to end, commit, and update the progress file.

## Key claims

- The problem. "Each new session begins with no memory of what came before." (The long-running agent problem)
- Analogy. "Imagine a software project staffed by engineers working in shifts, where each new engineer arrives with no memory of what happened on the previous shift." (The long-running agent problem)
- Compaction isn't enough. "However, compaction isn't sufficient. Out of the box, even a frontier coding model like Opus 4.5 running on the Claude Agent SDK in a loop across multiple context windows will fall short of building a production-quality web app if it's only given a high-level prompt." (The long-running agent problem)
- Failure modes: the agent would "try to do too much at once", and later sessions would "declare the job done" too early. (The long-running agent problem)
- Initializer. "The very first agent session uses a specialized prompt that asks the model to set up the initial environment." (Environment management)
- Progress file: "A claude-progress.txt file that keeps a log of what agents have done." (Environment management)
- Feature list: "a structured JSON file with a list of end-to-end feature descriptions", "over 200 features" for a claude.ai clone. (Feature list)
- Why JSON: "the model is less likely to inappropriately change or overwrite JSON files compared to Markdown files." (Feature list)
- Editing rule: agents may only change a `passes` field, with instructions like "It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality." (Feature list)
- Git: the agent should "commit its progress to git with descriptive commit messages" and can "revert bad code changes and recover working states." (Incremental progress)
- Session start: "(1) Run `pwd` to see the directory you're working in. (2) Read the git logs and progress files to get up to speed on what was recently worked on. (3) Read the features list file and choose the highest-priority feature that's not yet done to work on." (Getting up to speed)
- Testing: Claude tended "to mark a feature as complete without proper testing"; it "mostly did well at verifying features end-to-end once explicitly prompted to use browser automation tools". (Testing)

## Visuals worth redrawing

- Session timeline: initializer writes files; each coding session reads them, does one feature, writes them back.

## My notes

- One team's harness for one kind of task (building a web app). Not a benchmark.
