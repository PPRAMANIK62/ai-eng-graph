---
id: anthropic-compaction
title: Compaction overview
author: Anthropic
url: https://platform.claude.com/docs/en/build-with-claude/compaction
published: 2026
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Claude API docs for server-side compaction: the model writes a summary that replaces older turns, so a long conversation or agent run stays inside the window. The overview compares three ways to do it (on demand, at a token threshold, or your own summarizer). Claims below also come from the two pages it links to and that were opened with it: "Compaction on demand" (https://platform.claude.com/docs/en/build-with-claude/compaction-on-demand) and "Compaction at a token threshold" (https://platform.claude.com/docs/en/build-with-claude/compaction-threshold). Both kinds are in beta as of 2026-09.

## Key claims

- What it is. "Compaction replaces the older turns of a conversation with a summary that Claude writes on the server, so you need no summarization code of your own." (Overview, intro)
- Why. It "keeps the active context small, because response quality degrades as a conversation grows." (Overview, intro)
- Three options: on demand (you decide when), at a token threshold (the API decides "when input tokens reach the trigger you set"), or your own summarizer. All three can keep recent turns word for word. (Overview, Choose how to compact table)
- Rule-based clearing is separate: "To clear old tool results or old thinking blocks by rule instead of summarizing them, see Context editing." (Overview, intro)
- On-demand beta header is `compact-2026-09-04`. (Overview table; On demand page)
- On demand: "you send one request with the `compaction` parameter, and Claude returns a summary in place of a reply." (On demand page, intro)
- The block replaces what it summarizes: "It goes first in `messages`, the summarized messages are removed, and your next turn follows it." (On demand, How on-demand compaction works)
- Silent mistakes: "If summarized messages remain after the block, the API sends them to Claude again. If a later request leaves the block out, Claude gets no summary." (On demand, Continue from the summary)
- Custom prompt: a non-blank `instructions` string "(up to 16,384 characters) replaces that prompt entirely", for "when the default summary drops something a later turn needs". (On demand, Write your own summarization prompt; Overview)
- Billing: "The summarization call is billed and rate-limited like any other request". (On demand, Count compaction usage)
- Lost content: "Images, documents, `container_upload` blocks, and fetched URLs inside the summarized messages are gone once the block replaces them. Restate or re-upload anything a later turn still needs." (On demand, Limits and interactions)
- Instructions get summarized too: `role: "system"` messages in the summarized range "are summarized too, so their text instructions stop applying once the block replaces them." (On demand, Limits and interactions)
- Compact again: "The new block summarizes the old summary and everything after it." (On demand, Compact again)
- Threshold: default trigger `{"type": "input_tokens", "value": 150000}`; "`value` must be at least 50,000 tokens." Beta header `compact-2026-01-12`. (Threshold page)
- Threshold billing: "Compaction requires an additional sampling step, which contributes to rate limits and billing." (Threshold page)
- Default prompt asks Claude to "Write down anything that would be helpful, including the state, next steps, learnings etc." inside `<summary></summary>` tags. (Threshold page, default summarization prompt)
- On-demand supported models as of 2026-09 include claude-opus-5-5, claude-sonnet-5-5, claude-fable-5-1 and back to claude-opus-4-6 and claude-sonnet-4-6. (On demand page metadata)

## Visuals worth redrawing

- The on-demand swap: four messages plus the compaction parameter return one block; next request starts with the block.

## My notes

- Third-party guides still quote the older `compact-2026-01-12` header for everything; it's the threshold header, the on-demand one is newer.
