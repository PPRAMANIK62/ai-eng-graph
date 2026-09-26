@AGENTS.md

# Workspace rules

This folder is my path to an AI engineer job: a learning resource on AI
engineering, with a research article for every concept in a knowledge graph,
and a site built around it with real AI features. Read `PLAN.md` for the why
and the phases, and `WRITING.md` for how articles are written and linked.

## Hard rules

- Stay inside this directory. Don't read, write, or reference files outside
  it, including parent and sibling folders and agent memory. Keep notes and
  state here.
- AI engineering only. Backend and distributed systems are handled elsewhere,
  not in this folder.
- One concept per node. Not a whole topic, not half a concept. Each node is
  `deep` or `short`. Sizing rules are in `WRITING.md`.
- You write the articles, built only from source notes in `content/sources/`. I
  review them. Committing publishes, so don't commit an article until I say so.
- Never write a case study. It's mine, written after I've built the
  phase. You gather the facts and numbers for it.
- Never claim an experiment, measurement or build that didn't happen.
- Never cite from memory. Every citation points to a file in `content/sources/`, and
  every source file comes from a page you actually opened. If you can't open
  it, say so and don't cite it.
- Quotes stay short (a sentence or two). No full copies of anyone's article.
  Diagrams get redrawn and credited, not copied.
- Plain language everywhere, in articles and in replies. No bookish tone, no
  AI filler words. See the style section in `WRITING.md`.
- Use absolute dates (2026-09-23), never "today" or "last week".

## Folder layout

The repo is a Next.js app (App Router, bun) deployed on Vercel. The content
lives inside it and is read at build time. See `content/decisions/0002-...`.

```
PLAN.md                 why, the 15 skills, the seven build phases
WRITING.md              how articles are sized, written, cited and linked
content/templates/      node, source, decision, case-study; copy these
content/nodes/          one article per concept (content/nodes/phase-N/<id>.md);
                        figures built into content/nodes/phase-N/img/
content/sources/        one note per source (<id>.md); files starting with _
                        are working lists (e.g. _candidates.md), not notes
content/decisions/      one record per real build choice (<id>.md)
content/case-studies/   one per phase (phase-N.md)
visuals/                figures as TypeScript (bun run figures), see visuals/README.md
scripts/check.ts        checks citations, quotes, links, orphans, size, staleness
                        (bun run check; bun run check --map prints the graph)
app/ components/ lib/   the site: a metro map of the concepts at /, articles
                        (station pages) at /n/<id>; design tokens in app/globals.css
```

Run the site with `bun dev`, live at aieng.purbayan.me. What's committed is
published: every node with text gets a page. A planned node (headings and
template comments only) stays off. There's no status field.

## Workflow at the start of a phase

Before any article in a phase is written, plan its part of the map:

1. List every concept the phase in `PLAN.md` needs, and pick `deep` or
   `short` for each.
2. Create a `planned` node for each from `content/templates/node.md`: id, title,
   depth, phase, note, and all links, mirrored on both sides.
3. Run `bun run check --map` and show me the map. Point out
   concepts that look too big or too small, missing links, and orphans.
4. Wait for my OK. Then propose a writing order where `needs` come first.

## Workflow for one article

1. **Pick.** Take the next node in the phase's writing order, or the one I
   name. If it's really two concepts, say so and propose the split, and
   update the map.
2. **Set up.** Check the planned node's note, depth and links still look
   right. If new linked concepts come up, create `planned` nodes for them
   with mirrored links, so everything resolves.
3. **Sources.** Start from the node's list in `content/sources/_candidates.md`:
   3 to 6 for `deep`, 1 or 2 for `short`, primary ones first. Re-open each
   one; if it's dead, changed, or replaced by something newer, search for a
   replacement.
4. **Source notes.** For each source used, copy `content/templates/source.md` to
   `content/sources/<id>.md` (skip if it exists; one source serves many nodes).
   Summary in plain words, key claims each with a short quote copied
   word for word and its location, visuals worth redrawing, open questions.
   Mark `primary` honestly.
5. **Write.** Write the whole article as an explanation in our own words,
   following "The shape of every article" in `WRITING.md`: no quotes or
   "X says" in the body, sources listed once in Further reading as real
   links. Every concept that has a node is linked as `[[id]]` on first
   mention. Plan the main visual as a `VISUAL:` comment: what it shows and
   why. If it starts explaining a second concept at length, stop and
   propose a new node for it.
6. **Review.** Run `bun run check` and fix every error and warning. Then
   check by hand:
   - every fact is in the note of a source in Further reading; anything
     that isn't gets verified on the page or removed
   - it reads as an explanation, not a digest of what sources said
   - links are right: `needs`, `leads_to`, `compare_with` are honest, and
     every concept with a node is linked in the text
   - "Where it gets tricky" covers disagreements and what's changed
   - the note reads well as a hover card on its own
   - style rules from `WRITING.md`
   Draw each `VISUAL:` as a figure in `visuals/` and swap the comment for
   the image. Tell me what you changed and what you're unsure about.
7. **Publish.** Only when I say so: update the `updated` date and commit.

## Workflow for build work

The site, the chat, the evals and the agent follow the phases in `PLAN.md`.
Don't start a phase before the one before it is done unless I say so.

- **Success criteria first.** Before building an AI feature, write down what
  "good" means for it and how it'll be measured. Check it against the
  phase 1 success criteria doc.
- **Evals ship with the feature.** No AI feature is done without a small
  eval set and a recorded baseline score.
- **Decision records.** Any choice with real alternatives (a model, a
  chunking strategy, a library, a prompt design) gets a record in
  `content/decisions/` from `content/templates/decision.md`, with what was measured. Number
  them in order: `0001-...`, `0002-...`.
- **Log real usage.** Once the chat exists, every question and answer gets
  logged, and failures get turned into new eval cases.
- **Articles follow the build.** When a build step uses a concept that has
  no written node, flag it. The concepts a phase uses get written in that
  phase.
- **Don't publish secrets.** API keys go in environment variables, never in
  this folder's files.

## Workflow at the end of a phase

1. Check every "done when" line in `PLAN.md` for the phase. Show me the
   evidence for each, or say what's missing.
2. Run `bun run check`. Every node the phase planned is
   written and committed, or I've agreed to move it.
3. Gather the numbers, decision records and "what broke" notes into a
   draft outline in `content/case-studies/phase-N.md` from
   `content/templates/case-study.md`. I write the case study itself.
4. Review the concept lists for the next phase in `PLAN.md` against what
   this phase taught. Propose changes.

## Other work
- **Run `bun run check`** after any change to `content/nodes/` or
  `content/sources/`.
- **Re-check stale nodes.** When the script says a written node is 6
  months old, check its sources are still current and the article is still
  right, then update `updated`. Tell me what changed.
- **Keep this file short.** Update it only for lasting rules, not task
  history.
