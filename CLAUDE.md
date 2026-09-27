@AGENTS.md

# Workspace rules

This folder is my path to an AI engineer job: a learning resource on AI
engineering, with a research article for every concept in a knowledge graph,
and a site built around it with one AI assistant, the guide. Read `PLAN.md`
for the why and the concepts per phase, `GUIDE.md` for what gets built each
phase, and `WRITING.md` for how articles are written and linked.

## Hard rules

- Stay inside this directory. Don't read, write, or reference files outside
  it, including parent and sibling folders and agent memory. Keep notes and
  state here.
- AI engineering only. Backend and distributed systems are handled elsewhere,
  not in this folder.
- One concept per node. Not a whole topic, not half a concept. Each node is
  `deep` or `short`. Sizing rules are in `WRITING.md`.
- You write the articles, built only from source notes in `content/sources/`. I
  review them. Committing publishes, so don't commit anything until I say so.
- Never claim an experiment, measurement or build that didn't happen.
- Never cite from memory. Every citation points to a file in `content/sources/`, and
  every source file comes from a page you actually opened. If you can't open
  it, say so and don't cite it.
- Quotes stay short (a sentence or two). No full copies of anyone's article.
  Diagrams get redrawn and credited, not copied.
- Plain language everywhere, in articles and in replies. No bookish tone, no
  AI filler words. See the style section in `WRITING.md`.
- Use absolute dates (2026-09-23), never "today" or "last week".
- Don't publish secrets. API keys go in environment variables, never in
  this folder's files.

## Folder layout

The repo is a Next.js app (App Router, bun) deployed on Vercel. The content
lives inside it and is read at build time. See `content/decisions/0002-...`.

```
PLAN.md                 why, the 15 skills, the concepts per phase
GUIDE.md                what gets built per phase: the guide, author tools, evals
WRITING.md              how articles are sized, written, cited and linked
tentative-shape.md      first guess at every node; node files win once they exist
content/templates/      node, source, decision; copy these
content/nodes/          one article per concept (content/nodes/phase-N/<id>.md);
                        figures built into content/nodes/phase-N/img/
content/sources/        one note per source (<id>.md); files starting with _
                        are working lists (e.g. _candidates.md), not notes
content/decisions/      one record per real build choice (<id>.md)
visuals/                figures as TypeScript (bun run figures), see visuals/README.md
scripts/check.ts        checks citations, quotes, links, orphans, size, staleness
                        (bun run check; bun run check --map prints the graph)
app/ components/ lib/   the site: a metro map of the concepts at /, articles
                        (station pages) at /n/<id>; design tokens in app/globals.css
```

Run the site with `bun dev`, live at aieng.purbayan.me. What's committed is
published: every node with text gets a page. A planned node (headings and
template comments only) stays off. There's no status field.

## The phase loop

Every phase runs these steps, in order. Nothing else.

1. **Start.** Read the phase in `PLAN.md` and `GUIDE.md`.
2. **Check the tentative shape.** Read the phase's table in
   `tentative-shape.md`.
3. **Suggest changes.** Compare it with what the written nodes already cover
   and hand off (grep them for the phase's topics), and with what the
   phase's build in `GUIDE.md` needs. Propose splits, merges, depth
   changes, moves between phases and new nodes. Tell me, then update
   `tentative-shape.md` and `PLAN.md`.
4. **Check sources.** Read the phase's section of
   `content/sources/_candidates.md`: every node has enough candidates
   (3 to 6 for `deep`, 1 or 2 for `short`), note the gaps.
5. **Build the nodes.** Create a planned node for each concept from
   `content/templates/node.md`: id, title, depth, phase, note, and links
   mirrored on both sides. Run `bun run check --map` and fix orphans and
   broken links.
6. **Write them,** with "Writing one article" below, `needs` first.
7. **Build the phase's piece of the guide,** with "Building" below. The
   phase is done when its "done when" line in `GUIDE.md` is true; show me
   the evidence for each part.

## Writing one article

1. **Set up.** Check the planned node's note, depth and links still look
   right. If it's really two concepts, propose the split. If new linked
   concepts come up, create planned nodes for them with mirrored links.
2. **Sources.** Start from the node's list in `_candidates.md`, primary ones
   first. Re-open each one; if it's dead, changed, or replaced by something
   newer, search for a replacement.
3. **Source notes.** For each source used, copy `content/templates/source.md` to
   `content/sources/<id>.md` (skip if it exists; one source serves many nodes).
   Summary in plain words, key claims each with a short quote copied
   word for word and its location, visuals worth redrawing, open questions.
   Mark `primary` honestly.
4. **Write.** The whole article as an explanation in our own words,
   following "The shape of every article" in `WRITING.md`: no quotes or
   "X says" in the body, sources listed once in Further reading as real
   links. Every concept that has a node is linked as `[[id]]` on first
   mention. If it starts explaining a second concept at length, stop and
   propose a new node for it.
5. **Review.** Run `bun run check` and fix every error and warning. Then
   check by hand: every fact is in a source note; it reads as an
   explanation, not a digest; links are honest; "Where it gets tricky"
   covers disagreements and what's changed; the note works as a hover card;
   the style rules hold. Draw each `VISUAL:` as a figure in `visuals/` and
   swap the comment for the image. Tell me what you changed and what you're
   unsure about.
6. **Publish.** Only when I say so: update the `updated` date and commit.

## Building

- **Success criteria first.** Before building a piece, turn its success
  criteria in `GUIDE.md` into numbers you can measure.
- **Evals ship with the piece.** No AI feature is done without a small eval
  set and a recorded baseline score.
- **Decision records.** Any choice with real alternatives (a model, a
  chunking strategy, a library, a prompt design) gets a record in
  `content/decisions/` from `content/templates/decision.md`, with what was
  measured. Number them in order.
- **Log real usage.** Once the guide exists, every question and answer gets
  logged, and failures get turned into new eval cases.
- **Articles follow the build.** When a build step uses a concept that has
  no written node, flag it.

## Other work

- **Run `bun run check`** after any change to `content/nodes/` or
  `content/sources/`.
- **Re-check stale nodes.** When the script says a written node is 6
  months old, check its sources are still current and the article is still
  right, then update `updated`. Tell me what changed.
- **Keep this file short.** Update it only for lasting rules, not task
  history.
