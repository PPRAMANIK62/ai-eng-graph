---
id: 0007-one-guide-not-widgets
title: Build one AI guide that grows each phase, and drop the browser widgets
phase: 2
status: decided
date: 2026-09-27
replaced_by:
---

## What I had to decide

What the AI part of the site is. Phase 1 shipped three widgets that ran a
small open model in the reader's browser (a tokenizer playground, a
next-token explorer, a request timer; decision 0006). The plan for later
phases was a list of separate features: a chat, a router, a tutor agent, a
link suggester. The question was whether to keep adding demos per article,
or build one thing that grows.

## Options

- **Keep the widgets, add more.** A search playground, a vector index
  explorer, and so on, one per cluster of articles. Cheap to run, no API
  keys. But each is a demo of one concept, they don't use the site's own
  content, and they don't grow when the graph grows.
- **Separate AI features per phase.** A chat in phase 2, a tutor in
  phase 5, a link suggester somewhere. Each gets built and measured, but
  they don't add up to one product or one story.
- **One guide that learns a skill per phase.** A single assistant on the
  map that answers from the graph (phase 2), routes and checks its answers
  (phase 3), gets measured end to end (phase 4), becomes a tutor agent and
  an MCP server (phase 5), gets hardened (phase 6), and goes beyond text
  (phase 7). Plus author tools that check my own writing.

## What I measured

Nothing. This is a product choice made before any of the options were
built past phase 1, so there was nothing to measure yet. The phase 2
guide's evals will be the first numbers.

## What I picked and why

One guide, described phase by phase in `GUIDE.md`. It grows with the
content: every new node is more for it to answer from, quiz on and check.
Every phase's build uses that phase's concepts. And it's one story for an
interview, from retrieval to an agent, with evals the whole way.

The widgets, their code (`components/widgets/`, `lib/widgets.ts`), the
`{{widget:name}}` markdown hook, the check for it, and the
`@huggingface/transformers` dependency are removed. The six articles that
embedded them keep their text and figures.

## What I gave up

- Readers lose hands-on toys on six phase 1 articles.
- The guide needs a hosted model, so it costs money per question and needs
  an API key on the server. The widgets cost nothing.
- If the guide turns out slow or expensive to run in public, a lighter
  article-level demo could come back for a specific concept.
