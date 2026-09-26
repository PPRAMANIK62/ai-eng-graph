---
id: 0005-math-rendering
title: Write formulas in articles as LaTeX and render them with KaTeX at build time
phase: 1
status: decided
date: 2026-09-26
replaced_by:
---

## What I had to decide

The site had no way to show math. Formulas in articles were typed as plain text inside
`>` quote blocks (`softmax(o)ᵢ = e^oᵢ / (e^o₁ + …)`), so they came out as grey quoted text
with a caret for "to the power of". Phase 1 has four formulas (softmax, prefill and decode
timing, token cost, KV cache size) and later phases will add more (similarity, eval metrics).

## Options

- **KaTeX at build time.** `remark-math` + `rehype-katex` turn `$$ … $$` in the markdown
  into HTML when the page is built. The browser only loads a stylesheet and fonts, no script.
- **MathJax.** Handles more of LaTeX and can output SVG, but it's heavier, and its usual
  setup runs in the browser.
- **An SVG figure per formula.** Uses the existing `visuals/` pipeline and the site's fonts,
  but every formula becomes a separate figure file to write and rebuild.
- **Keep plain text.** Nothing new, but it doesn't work for fractions, sums or exponents.

## What I measured

Nothing benchmarked. I checked that all four formulas render in both themes on the
article pages, and that pages with dollar prices (token-pricing, llm-use-cases, rlhf) are
unchanged. Cost on article pages: `katex.min.css` (25 KB) plus the KaTeX fonts a formula
actually uses, out of 20 woff2 files (296 KB in total).

## What I picked and why

KaTeX at build time. The formulas are plain LaTeX in the article, render with no
client-side script, and pick up the page's text color, so both themes work.

Only `$$ … $$` counts as math (`singleDollarTextMath: false`). Articles use `$` for
prices ("$2 to $10"), and single-dollar math would turn those into formulas. Inline math
uses `$$x$$` inside a sentence.

## What I gave up

KaTeX draws math in its own serif font, which doesn't match Public Sans; formulas made of
words (the cost and KV cache ones) show this most. Long formulas have to be split over
lines by hand to fit a phone; they scroll sideways otherwise. Figures in `visuals/` can't
use KaTeX, so math inside a figure stays plain text or words.
