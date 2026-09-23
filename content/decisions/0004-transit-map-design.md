---
id: 0004-transit-map-design
title: Show the graph as a metro map, and use it as the whole site's design
phase: 1
status: proposed
date: 2026-09-23
replaced_by:
---

## What I had to decide

How the site shows the knowledge graph, and what the site looks like around it. The first
version (0003) was a layered node-link map on a graph-paper background. It worked, but I
didn't like how it looked or felt, so I asked for completely different designs.

## Options

Five prototypes, all on the real 33 nodes, built as throwaway routes and compared in the
browser:

- **Course reader.** A reading spine of every concept in order, the article in the middle,
  concept links as margin notes. The graph stays in the background.
- **Index.** A dense searchable list with prerequisites drawn as an arc diagram beside it.
- **Atlas.** A zoomable canvas of cards in level bands; articles slide in over the map.
- **Orbit.** The graph from one concept: it sits at the center, what it needs and what it
  opens up orbit around it; clicking another re-centers everything.
- **Transit.** The graph as a subway map: learning paths are colored lines built from the
  `needs` links, concepts are stations, and you plan a trip to a destination and ride it
  stop by stop.

## What I measured

Nothing measured; this was a look-and-feel call made by using each prototype. I wanted the
graph to stay the main view, so the course reader and index went first, then atlas and orbit.

## What I picked and why

Transit, applied to the whole site: the map at `/`, articles as station pages at `/n/<id>`,
the same tokens (`--t-*`, `--line-N` in `app/globals.css`) for the figures in `visuals/`, and a
night version for dark mode. It turns "what do I read before X" into a trip you plan, which
the other designs only showed.

## What I gave up

A true free-form view of the graph: lines are a path cover of the `needs` links, so a
concept's other connections show only as the lines passing through it. `compare_with`
links aren't drawn on the map at all. The map also gets crowded where many lines start
(eight leave next-token-prediction), and it will need layout work as the graph grows past
phase 1.
