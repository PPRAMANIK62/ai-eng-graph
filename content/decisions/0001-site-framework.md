---
id: 0001-site-framework
title: Build the site with Next.js, not Astro
phase: 1
status: proposed
date: 2026-09-23
replaced_by:
---

## What I had to decide

What the site is built on. Phase 1 needs a static site for the articles and
the graph. From phase 2 on it needs server code too: a chat that streams
answers, retrieval, logging, and later an agent and an MCP server.
`PLAN.md` proposed Astro, but the choice was left for a record like this.

## Options

- **Astro.** Built for content sites. Ships no JavaScript unless a component
  asks for it, and markdown is first class. Server routes and streaming
  exist, but the AI tooling and examples mostly assume React frameworks.
- **Next.js (App Router).** React, static generation for the articles, route
  handlers for the chat and agent later. Pairs with the Vercel AI SDK, and
  runs on Vercel with no setup.
- **Two apps.** Astro for content, a separate API for the AI features. Two
  things to deploy and keep in sync, for a one-person project.

## What I measured

Nothing. This was picked on fit with the later phases, not on a benchmark. The article pages are static either way, so page speed
shouldn't differ much; that could be checked with Lighthouse once both
exist, but I don't plan to build the Astro version to find out.

## What I picked and why

Next.js 16 with the App Router, TypeScript, Tailwind, shadcn/ui and Motion,
run with bun. One app covers the static articles now and the streaming chat,
evals page and agent later, and it pairs directly with the Vercel AI SDK that
`PLAN.md` proposes.

## What I gave up

Astro's zero-JavaScript default. The map is interactive anyway, but article
pages ship React they mostly don't need. Next.js also changes its APIs
often; version 16 already differs from older tutorials. If article pages
turn out slow on phones, that's the reason to look again.
