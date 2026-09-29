---
id: document-parsing
title: How do you turn documents into clean text?
depth: deep
phase: 7
note: >-
  Getting text, tables and layout out of PDFs and scans, before a model or search index sees them.
needs: [rag]
leads_to: []
compare_with: [pdf-input]
updated: 2026-09-29
---

# How do you turn documents into clean text?

Document parsing turns a PDF or a scan into clean text, usually Markdown,
with the paragraphs in the right order and the tables still shaped like
tables. You do it once, before anything else touches the document: before
[[chunking]], before [[rag|retrieval]], before [[extraction]]. If the
parse is wrong, every step after it works from wrong text, and the tools
that do it disagree loudly about which one is best.

## Why a PDF doesn't just hand you its text

Take a two-column research paper with a results table and a few
equations. It looks like text. But a PDF is closer to a set of drawing
instructions. It stores single characters and where to place each one on
the page, plus spacing and fonts. It doesn't store "this is a paragraph",
"this is a heading" or "read the left column first".

So a naive text dump goes wrong in predictable ways:

- **Reading order.** Lines from the two columns get interleaved, so
  sentences from different paragraphs run into each other.
- **Tables.** The numbers come out as a stream of values with no rows or
  columns, and you can't tell which number belongs to which label.
- **Scans.** A scanned page is only a picture. There's no text layer at
  all, so something has to read the pixels (OCR).

A parser's job is to rebuild what the PDF threw away: which blocks are
text, headings, tables, figures and formulas, what order to read them in,
and what the tables' rows and columns are.

## Three ways to build a parser

### A pipeline of small models

Docling (IBM, 2024) is a clear example. It works in steps:

1. A PDF reader pulls out every piece of text with its position on the
   page, and also renders each page as an image.
2. A layout model looks at the page image and finds the layout. Docling's
   is a detector trained on DocLayNet, a human-labeled layout dataset.
3. A table model (TableFormer) rebuilds each table's structure.
4. OCR runs only if you turn it on, because it's slow. The OCR engine
   Docling used took upwards of 30 seconds per page on a CPU.
5. A last step works out the reading order across the page and assembles
   one structured document you can export.

The appeal is that it runs on ordinary hardware. In the 2024 report,
Docling did about 1.3 pages per second on an Apple M3 Max using 4 CPU
threads.

### A vision model that reads the page

The other approach skips most of the pipeline. Render the page as an
image and ask a vision model to write out the text, the way it would
answer any question about an image (see [[vision-models]]).

olmOCR (Ai2, 2025) is a 7B vision model fine-tuned for exactly this, on
260,000 pages from over 100,000 PDFs. It adds a trick called document
anchoring: along with the page image, the prompt includes the text and
positions the PDF already has, so the model isn't guessing every word
from pixels. It costs about $176 per million pages, against over $6,240
for sending the same pages to GPT-4o.

The anchoring matters because general vision models make a specific kind
of mistake here. Without it, GPT-4o would skip content, rewrite or finish
sentences in its own words, or describe images it wasn't asked about.
That's [[hallucination]] in your source text, and it's hard to spot
because the output reads well.

### A hybrid that uses the model only where needed

Marker (Datalab) mixes the two. It takes the PDF's own text first, in
reading order. It detects the layout. Then, page by page, it decides
whether that text is usable. Only garbled or scanned pages go to a vision
model for OCR. Tables are rebuilt from the text layer with simple rules,
and only the uncertain ones are sent to the model.

This gives you a speed dial. On Marker's own benchmark runs, its
balanced mode processed 2.9 pages per second on one GPU host. A fast mode
with no OCR, on CPU, did 23.7 pages per second, but it scored zero on
arXiv math pages and on old scanned math: without OCR, there's nothing
usable to read.

![Three ways to parse a PDF page. Pipeline (Docling): the PDF's text with positions and a page image go through a layout model, a table model and optional OCR, then reading order is worked out and the parts are assembled. Vision model (olmOCR): the page image, plus the PDF's own text and positions as an anchor, go into one fine-tuned vision model that writes the page out as text. Hybrid (Marker): the PDF's own text is used where it's usable; only garbled or scanned pages and uncertain tables go to a vision model.](img/document-parsing-approaches.svg)

There's also the hosted route. Mistral OCR 4 (2026-06) is an API: $4 per
1,000 pages, $2 through its batch API, and it returns Markdown with
bounding boxes, block types and confidence scores. The confidence scores
are useful: they point you at the parts worth checking by hand.

And there's skipping the parse entirely: send the PDF straight to a
general model and let it read the pages each time you ask a question.
That's [[pdf-input]]. It's fine for one document and one question. For a
collection you'll search over and over, parsing once and storing the
text is cheaper and gives you something you can check.

## How parsers get scored

Two public benchmarks come up everywhere.

**OmniDocBench** has 1,651 PDF pages across 10 document types, from
academic papers and financial reports to newspapers, textbooks and
handwritten notes. For each page, it compares the parser's output with
its reference answers and scores three things: text (by edit distance),
tables (TEDS) and formulas (CDM). The overall score is the average of the
three.

**olmOCR-Bench** takes a different approach. It has about 1,400 PDFs and
thousands of small pass/fail tests: is this sentence present, does this
line come before that one, is this table cell in the right place. The
tests are meant to be unambiguous and checkable by a script, instead of a
fuzzy match against a whole reference page.

Here's the OmniDocBench leaderboard as of 2026-09, for a selection of
tools:

![Bar chart of OmniDocBench overall scores as of 2026-09. Specialized vision models: TeleOCR 96.91, PaddleOCR-VL 94.18, olmOCR 85.74, Mistral OCR (the 2025 model) 85.66. General vision models: Gemini 3 Pro 92.91, GPT-5.2 86.59. Pipeline tools: MinerU pipeline 86.47, Marker 78.44. Mistral OCR 4's self-reported 93.07 is shown separately as a dashed outline, because it isn't on the leaderboard.](img/document-parsing-leaderboard.svg)

Two things stand out. Small models trained only for this job lead:
TeleOCR has 1.2 billion parameters and beats Gemini 3 Pro. And the gap
between the best and the worst tool listed is mostly in tables: on table
structure, TeleOCR scores about 97 and Marker about 66.

## Where it gets tricky

**The benchmarks don't agree.** Marker's README puts its careful mode
ahead of MinerU's pipeline on olmOCR-Bench (76.0 vs 72.7) and far ahead
of Docling (50.3). OmniDocBench puts MinerU's pipeline well ahead of
Marker (86.47 vs 78.44). The olmOCR paper's table on its own benchmark
puts olmOCR first (75.5), ahead of Mistral OCR (72.0) and Marker (70.1).
Each team's table tends to put its own tool on top. That doesn't make
any of them wrong: they test different documents, different versions and
different things.

**Versions drift.** OmniDocBench's Marker row is Marker 1.7.1, added in
mid-2025. Marker's README reports a newer release. The leaderboard's
"Mistral OCR" row is the 2025 model. Mistral OCR 4 reports 93.07 on
OmniDocBench, but that number is Mistral's own run and isn't on the
public leaderboard. If it were, it would sit behind 14 other entries,
just ahead of MinerU-2.5 (93.04) and Gemini 3 Pro (92.91). On
olmOCR-Bench, Mistral claims the top score (85.20)
among the models it tested, which is a narrower claim than "best".

**The answer keys have mistakes.** Mistral's launch post lists how both
benchmarks mark correct output wrong: reference answers with typos or
missing text, two LaTeX formulas that render the same but count as
different, and words split across columns scored as reading-order
failures. OmniDocBench itself fixed typos in its text and table answers
in its 2026-04 update and changed how it matches output to answers. A
score from one benchmark version doesn't compare cleanly with the next.

**One average hides what you need.** OmniDocBench's overall score gives
formulas a full third of the weight. If your documents are invoices with
no formulas, that third tells you nothing. Marker's per-category numbers
show the same thing from the other side: its no-OCR mode is decent on
plain pages and scores zero on math.

**Licenses differ.** Marker's code is Apache 2.0, but its model weights
are free only for research, personal use and startups under $5M in
funding or revenue. Docling is MIT. Check before you ship.

The honest reading of all this is the one Mistral itself gives: treat
public scores as a rough guide and test on your own documents. See
[[benchmarks]] for more on what public scores can and can't tell you.

## What this means when you build

- Build a small eval on your own PDFs before you pick a tool. A few dozen
  pages that look like your real documents, including the hard ones:
  tables, two columns, scans, equations if you have them.
- Write checks a script can run, in the olmOCR-Bench style: this sentence
  appears, this heading comes before that paragraph, this table cell has
  this value. That's a [[code-based-evals|code-based eval]], and it
  avoids the answer-key problems of fuzzy matching. See [[evals]].
- Run two or three candidates on it: a pipeline, a vision model and a
  hosted API. Record pages per second and cost per 1,000 pages next to the
  score.
- Use the PDF's own text layer when it's good, and send only the bad
  pages to OCR or a vision model.
- Keep page numbers and block positions in your output. You'll want them
  later for [[citations]].
- Parse once and store the result. Then chunk and index the clean text.

## Further reading

- [Docling Technical Report](https://arxiv.org/abs/2408.09869),
  Christoph Auer et al. (IBM Research), 2024. How a pipeline parser works,
  step by step, with CPU speeds.
- [olmOCR: Unlocking Trillions of Tokens in PDFs with Vision Language Models](https://arxiv.org/abs/2502.18443),
  Jake Poznanski et al. (Ai2), 2025. Why PDFs are hard, the vision-model
  approach with document anchoring, costs, and the unit-test benchmark.
- [Marker](https://github.com/datalab-to/marker), Datalab. A hybrid
  parser, with its own speed-vs-quality numbers on olmOCR-Bench.
- [OmniDocBench](https://github.com/opendatalab/OmniDocBench),
  OpenDataLab, leaderboard updated 2026-09-11. A public benchmark
  comparing pipeline tools with general and specialized vision models,
  and its version history.
- [Mistral OCR 4](https://mistral.ai/news/ocr-4/), Mistral AI, 2026. A
  hosted OCR API with prices and confidence scores, and a clear list of
  how parsing benchmarks mis-score correct output.
