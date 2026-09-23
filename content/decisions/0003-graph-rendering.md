---
id: 0003-graph-rendering
title: Draw the map as 2D SVG laid out by prerequisites, with 3D as an extra view
phase: 1
status: replaced
date: 2026-09-23
replaced_by: 0004-transit-map-design
---

## What I had to decide

How the site shows the graph. The idea came from the AI Coding Dictionary
(aicodingdictionary.com), which puts its terms in a 3D force graph. This
graph is different: its edges have a direction ("read this first"), and the
reader's progress matters.

## Options

- **3D force graph** (three.js with `3d-force-graph`), like the dictionary.
- **2D force graph** (d3-force), free layout.
- **2D layered by prerequisites.** Each row is how many steps of
  prerequisites sit above a node. Start-here concepts at the top.

## What I measured

No numbers. I built a throwaway prototype of all three on the 33 phase 1
nodes and compared screenshots. The prototype was deleted on 2026-09-23
once the real map replaced it. In 3D, labels shrink
with distance and the reading order is lost unless you rotate it. The
layered view shows "what do I read next" without any interaction.

## What I picked and why

Layered 2D as the default, free 2D and 3D as other views. The layout is
computed at build time with d3-force, so the map arrives already settled
and the same on every load. It's drawn as SVG with React, so switching
views can animate nodes between positions. The 3D view loads only when
someone opens it.

## What I gave up

The first impression of a 3D graph. The layered view also depends on the
`needs` links being honest: a wrong link puts a node on the wrong row.
That's a feature for me as the writer, but readers see the mistake too.
