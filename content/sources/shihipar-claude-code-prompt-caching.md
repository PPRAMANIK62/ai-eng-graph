---
id: shihipar-claude-code-prompt-caching
title: "Lessons from building Claude Code: Prompt caching is everything"
author: Thariq Shihipar (Anthropic, Claude Code team)
url: https://claude.dev/blog/lessons-from-building-claude-code-prompt-caching-is-everything/
published: 2026-04-30
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

How the Claude Code team designs a long-running agent around prompt caching. Static content goes first and dynamic content last; updates go into messages instead of the system prompt; tools and models never change mid-session; compaction reuses the parent's exact prefix. They alert on cache hit rate and treat drops as incidents.

## Key claims

- Why it matters to them. "A high prompt cache hit rate decreases costs and helps us create more generous rate limits for our subscription plans, so we run alerts on our prompt cache hit rate and declare SEVs if they're too low." (intro)
- Layout, static first: static system prompt and tools (globally cached), CLAUDE.md (per project), session context (per session), conversation messages. "The best way to do this is static content first, dynamic content last." (Lay out your prompt for caching)
- Ways they broke it: "putting an in-depth timestamp in the static system prompt, shuffling tool order definitions non-deterministically, and updating parameters of tools". (same)
- Put updates in the next message (a `<system-reminder>` tag) instead of editing the prompt. (Use messages for updates)
- The cache belongs to one model. "Prompt caches are unique to models and this can make the math of prompt caching quite unintuitive." 100k tokens into an Opus conversation, "it would actually be more expensive to switch to Haiku than to have Opus answer, because we would need to rebuild the prompt cache for Haiku." (Don't change models mid-session)
- To switch models, use a subagent with a hand-off message. (same)
- Tools are in the prefix. "adding or removing a tool invalidates the cache for the entire conversation." Plan mode is a tool call plus a message, not a tool swap; tools are deferred with `defer_loading` stubs instead of removed. (Never add or remove tools mid-session)
- Compaction trap: a separate summarize call with a different system prompt and no tools shares no prefix, so you pay full price for the whole conversation. Fix: "we use the exact same system prompt, user context, system context, and tool definitions as the parent conversation." (Compacting without breaking the cache)
- "Prompt caching is a prefix match. Any change anywhere in the prefix invalidates everything after it." (Lessons learned)
- "A few percentage points of cache miss rate can dramatically affect cost and latency." (Lessons learned)

## Visuals worth redrawing

- The prompt layout stack (global, per project, per session, growing messages).

## My notes

- Primary for Claude Code's design, and Anthropic staff, but it's one product's experience, not a measurement study. No numbers on hit rates.
