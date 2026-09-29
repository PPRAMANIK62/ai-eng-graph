---
id: anthropic-memory-tool
title: Memory tool
author: Anthropic
url: https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
published: 2026
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Claude API docs for the memory tool: a tool that lets the model create, read, edit and delete files under a `/memories` directory that persists between conversations. It runs client-side, so your code executes every file operation against storage you choose. The page covers the six commands, the instruction the API adds to the system prompt, security (path traversal, sensitive data, size caps, expiry), pairing with compaction, and a multi-session pattern for long software projects.

## Key claims

- What it is. "The memory tool lets Claude store and retrieve information across conversations in a directory of memory files." (intro)
- Just in time. "Rather than loading all relevant information up front, an agent records what it learns in memory files and reads them back on demand." (intro)
- Client-side. "The memory tool operates client-side: Claude requests file operations, and your application executes them." (intro)
- Storage is yours. "The `/memories` path is a prefix that your handler maps onto real storage, such as a per-user directory or keys in a database." (How it works)
- Claude checks memory first. "When the memory tool is enabled, Claude automatically checks its memory directory before starting a task." (How it works)
- Commands: `view`, `create`, `str_replace`, `insert`, `delete`, `rename`. (Tool commands)
- Models. "The memory tool is available on all Claude 4 and later models." (How it works)
- Tool type string. The `tools` entry is `{"type": "memory_20250818", "name": "memory"}`. (Getting started)
- Injected system prompt includes "ASSUME INTERRUPTION: Your context window might be reset at any moment, so you risk losing any progress that is not recorded in your memory directory." (Prompting guidance)
- Clutter. Suggested prompt: "You can rename or delete files that are no longer relevant. Do not create new files unless necessary." (Prompting guidance)
- Path traversal. "A malicious path such as `/memories/../../secrets.env` can reach files outside the `/memories` directory." (Path traversal protection)
- Sensitive data. "Claude usually refuses to write sensitive information to memory files. For stronger guarantees, add validation that strips sensitive data before your handler writes the file." (Security considerations)
- Expiry. "Periodically delete memory files that haven't been accessed in a long time." (Memory expiration)
- With compaction. "For long-running agents, consider using both: compaction keeps the active context small without client-side bookkeeping, and memory preserves the information that must survive summarization." (Using with compaction)
- Multi-session pattern: an initializer session sets up "a progress log (tracking what has been done and what comes next), a feature checklist (defining the scope of work)"; later sessions open by reading them; each session updates the log before it ends. (Multisession software development pattern)
- "Mark a feature complete only after end-to-end verification confirms it works, not when the code is written." (Key principle)

## Visuals worth redrawing

- The six-step example (user request, view /memories, read a file, answer) as a sequence.

## My notes

- Examples use claude-opus-5-5. No beta header is needed for the tool itself.
