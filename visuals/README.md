# visuals

The figures in the articles, drawn as code. Each figure is a TypeScript
function that returns an SVG string. `build.ts` writes them next to the
articles, in `content/nodes/phase-N/img/<node>-<slug>.svg`, and the article embeds
them with a plain markdown image. The site inlines the SVG into the page, so figures
use the site's typefaces and follow its day/night theme.

```
bun install
bun build.ts                  # every figure
bun build.ts bpe softmax      # only these nodes
bun build.ts bpe --png        # also PNG previews in out/ (light + .dark)
```

`out/` is only for looking at the result. The SVG in `content/nodes/` is what the
site uses. Don't edit an SVG by hand; change the figure file and rebuild.

## Layout

```
lib/svg.ts        theme, text, boxes, arrows, the svg() frame
lib/chart.ts      bars, axes, lines (d3-scale, d3-shape)
figures/phase-N/<node>.ts   default export: Figure[] for that node
```

## Rules for a figure

- One file per node, named after the node id. Each figure has a `slug`,
  an `alt` (plain words: what it shows) and `render()`.
- Colors only through tones (`blue`, `orange`, `green`, `red`, `purple`,
  `grey`, `muted`, `ink`). Figures share the site's design system, the metro
  map: each tone reads a site token (`blue` is the cobalt line `--line-1`,
  `red` the red line, and so on; see `PALETTE` in `lib/svg.ts` and
  `app/globals.css`) with a fixed fallback for viewing the file on its own.
  Never hard-code a hex color. Titles use the signage face (Overpass), text
  the reading face (Public Sans).
- Every number and label comes from the article or its source notes in
  `content/sources/`. Nothing from memory. A curve that only shows a shape says so
  in the figure ("illustrative shape, not data").
- Redrawn from someone else's figure? Put the credit in `credit`
  ("Adapted from ..."). Never trace or paste their image.
- Titles say what the figure shows, in plain language.
- Keep it readable at 700 px wide: 12 px text minimum.

## In the article

The `<!-- VISUAL: ... -->` comment is the plan. When the figure is drawn,
replace the comment with the image:

```
![Alt text, the same as the figure's alt.](img/<node>-<slug>.svg)
```

`scripts/check.ts` warns about VISUAL comments left in articles past
drafting, images no node uses, and errors on image links to missing files.
