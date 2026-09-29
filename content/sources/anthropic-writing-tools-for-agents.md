---
id: anthropic-writing-tools-for-agents
title: Writing effective tools for agents — with agents
author: Ken Aizawa (Anthropic)
url: https://www.anthropic.com/engineering/writing-tools-for-agents
published: 2025-09-11
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Anthropic's guide to designing tools for agents. Tools are a contract with a non-deterministic caller, so you design them for how an agent reads and spends context, not as thin wrappers over an API. It covers choosing a few high-impact tools, namespacing, returning meaningful names instead of raw IDs, a `response_format` switch, capping and truncating big responses, error messages that say what to do next, and improving tools in a loop driven by evals on held-out tasks.

## Key claims

- Tools are a new kind of contract. "Tools are a new kind of software which reflects a contract between deterministic systems and non-deterministic agents." An agent might call the tool, answer from memory, ask a question, or misuse the tool. (What is a tool?)
- Don't just wrap APIs. "A common error we’ve observed is tools that merely wrap existing software functionality or API endpoints—whether or not the tools are appropriate for agents." (Choosing the right tools for agents)
- Context is the scarce resource. An agent reading a tool that returns ALL contacts "is wasting its limited context space on irrelevant information"; build `search_contacts` or `message_contact` instead of `list_contacts`. (same)
- Consolidate. "Instead of implementing a list_users, list_events, and create_event tools, consider implementing a schedule_event tool which finds availability and schedules an event." Also `search_logs` instead of `read_logs`, `get_customer_context` instead of three lookups. (same)
- "Too many tools or overlapping tools can also distract agents from pursuing efficient strategies." (same)
- Namespacing by service and resource (e.g. `asana_search`, `jira_search`, `asana_projects_search`) helps agents pick; prefix vs suffix naming had "non-trivial effects on our tool-use evaluations", varying by model. (Namespacing your tools)
- Names over IDs. Resolving "arbitrary alphanumeric UUIDs to more semantically meaningful and interpretable language (or even a 0-indexed ID scheme) significantly improves Claude’s precision in retrieval tasks by reducing hallucinations." (Returning meaningful context from your tools)
- A `response_format` enum lets the agent choose "concise" or "detailed". In the Slack example, the detailed response was 206 tokens and the concise one 72: "we use ~⅓ of the tokens with “concise” tool responses." The detailed form keeps IDs like `thread_ts` needed for follow-up calls. (same)
- Response structure (XML, JSON, Markdown) affects eval scores; "there is no one-size-fits-all solution." (same)
- Cap output. Use "pagination, range selection, filtering, and/or truncation with sensible default parameter values". "For Claude Code, we restrict tool responses to 25,000 tokens by default." (Optimizing tool responses for token efficiency)
- Errors should teach. "prompt-engineer your error responses to clearly communicate specific and actionable improvements, rather than opaque error codes or tracebacks." Truncation messages can steer the agent toward filters or pagination. (same)
- Describe tools like you would to a new hire, and name parameters without ambiguity: "instead of a parameter named user, try a parameter named user_id." (Prompt-engineering your tool descriptions)
- Small description changes matter. "Even small refinements to tool descriptions can yield dramatic improvements." Claude Sonnet 3.5 reached state of the art on SWE-bench Verified after precise refinements to tool descriptions. (same)
- A real bug found by evals: when Anthropic launched its web search tool, Claude was "needlessly appending 2025 to the tool’s query parameter"; fixed by improving the tool description. (Analyzing results)
- The loop: prototype, generate realistic multi-step eval tasks, run them with simple agent loops, read transcripts and metrics (tool calls, tokens, errors), let Claude Code refactor the tools, repeat. Held-out test sets showed gains "even beyond what we achieved with "expert" tool implementations". (How to write tools)

## Visuals worth redrawing

- Held-out test set charts for internal Slack and Asana tools (human-written vs Claude-optimized). No numbers given in the text, so not redrawable as data.
- The concise vs detailed Slack response (206 vs 72 tokens).

## My notes

- Strong on design, from one vendor; the numbers are few (206/72, 25,000).
