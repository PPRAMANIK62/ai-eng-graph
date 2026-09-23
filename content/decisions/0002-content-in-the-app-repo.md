---
id: 0002-content-in-the-app-repo
title: Keep the articles in the same repo as the app, read at build time, deploy on Vercel
phase: 1
status: proposed
date: 2026-09-23
replaced_by:
---

## What I had to decide

Where the markdown lives and how the site gets it. The articles, source
notes, figures and check script started in a notes folder with no app.

## Options

- **One repo, content read at build time.** The Next.js app is the repo
  root and the markdown sits in `content/`. Pages are generated from the
  files during `next build`. No database, no CMS.
- **Separate content repo.** The app pulls the markdown in as a git
  submodule or fetches it at build time. Two repos to keep in step.
- **A CMS or database.** Articles edited in a UI and fetched at runtime.
  That conflicts with how the articles are written and checked: plain
  files, reviewed in git, validated by `scripts/check.ts`.

## What I measured

Nothing. This is about workflow, not speed.

## What I picked and why

One repo at `~/projects/ideas/ai-eng-graph`, moved out of the notes
folder entirely. Content in `content/`, figures copied to `public/figures/`
before each build. Every article page is static HTML, generated with
`generateStaticParams`. Vercel builds it with no setup.

Production builds show only `published` articles. Drafts get pages
locally, and on any build with `SHOW_DRAFTS=1` (meant for Vercel preview
deploys). Unwritten nodes still show on the map, greyed out.

## What I gave up

Editing an article means a git commit and a rebuild. That's fine for one
writer. It would matter if other people contributed through a web form.
