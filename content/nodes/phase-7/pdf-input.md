---
id: pdf-input
title: How do you send a PDF to a model?
depth: short
phase: 7
note: >-
  As extracted text, as page images, or both, and what each costs.
needs: [vision-models]
leads_to: []
compare_with: [document-parsing]
updated: 2026-09-29
---

# How do you send a PDF to a model?

You can attach a PDF to an API call and ask about it, but the model never
reads the PDF file itself. The provider turns it into things the model can
read: the text pulled out of each page, a picture of each page, or both.
Which one you get decides what the model can see (charts, tables, layout)
and what you pay per page.

## Claude and OpenAI send two copies of every page

Say you send a 3-page report with one chart. On Claude, the API does two
things to each page. It pulls out the page's text, and it renders the page
as an image. The model gets both, side by side. OpenAI does the same on
its vision-capable models (gpt-4o and later).

The text lets the model quote words exactly. The image lets it read the
chart, the table borders and the layout, using the same machinery as any
other image (see [[vision-models]]).

You pay for both. Claude's docs put the text at 1,500 to 3,000 tokens per
page, depending on how dense it is, plus the image tokens for each page.
The clearest number comes from Amazon Bedrock, which runs Claude in two
modes. For a 3-page PDF:

- **Text only:** about 1,000 tokens. The model can't see charts, images
  or layout.
- **Text plus page images:** about 7,000 tokens.

So the page images made that document about seven times more expensive.
That's the price of the model seeing the chart.

On OpenAI, a `detail` field sets how sharp the page images are. `low`
uses fewer tokens; `high` is for dense charts and small print. The
default depends on the model: on GPT-5.6 and later, `auto` means `high`, on
earlier models it means `low`. The same PDF costs more on a newer model
unless you set it yourself.

## Gemini charges per page

Gemini reads PDF pages with vision too, but prices the page as a unit. On
Gemini 3 (as of 2026-09), each page image costs about 560 tokens by default, 280
at low resolution and 1,120 at high. The text that's already in the PDF
is read too, and you're not charged for it. Google recommends medium (560)
for documents: quality usually stops improving there.

![Bar chart of input tokens for a 3-page PDF. Claude on Amazon Bedrock, text only: about 1,000 tokens, and the model can't see charts. Claude, text plus page images: about 7,000. Gemini 3, page images at low resolution: 840; default: 1,680; high: 3,360. On Gemini 3 the PDF's own text is read but not charged.](img/pdf-input-costs.svg)

Token counts aren't dollars. Each model charges a different price per
token (see [[token-pricing]]), so compare the final bill, not the counts.

The limits differ too, as of 2026-09:

| | Max size | Max pages |
|---|---|---|
| Claude | 32 MB per request | 600 per request (100 if the context window is under 1M tokens) |
| OpenAI | 50 MB per file and per request | not stated |
| Gemini | 50 MB | 1,000 |

On Claude, a dense PDF can fill the [[context-window]] long before it
hits the page limit.

## Where it gets tricky

**Google's own pages disagree.** The Gemini document page says each page
is 258 tokens, without naming a model. The Gemini 3 media-resolution
table says 560 by default. 258 looks like the figure for older models.
Check the usage numbers in a real response before you plan costs.

**Order advice differs.** Claude's docs say put the PDF before your
question. Gemini's say that for a single page, put the prompt after the
page. Both agree the document goes first.

**The page image has the limits of any image.** PDF reading runs on the
same vision machinery, so it has the same weak spots with small, blurry
or rotated text. Claude's and Gemini's docs both tell you to rotate pages
upright before sending them.

## What this means when you build

- Count tokens on a few of your real PDFs before you estimate cost.
- If the answer only needs the words, text only is several times cheaper.
  Send page images when charts, tables or layout matter.
- Set the resolution (`detail`, `media_resolution`) yourself instead of
  trusting a default that can change between models.
- If you ask many questions about one PDF, [[prompt-caching]] saves you
  from paying for it every time. For many PDFs at once, use the
  [[batch-api]].
- Sending the whole PDF on every call works for one document. For a large
  collection, convert it to clean text once with [[document-parsing]] and
  retrieve from it with [[rag]].

## Further reading

- [PDF support](https://platform.claude.com/docs/en/build-with-claude/pdf-support),
  Anthropic docs. How Claude turns pages into text plus images, per-page
  costs, limits, and the text-only vs full comparison on Bedrock.
- [File inputs: PDF files](https://developers.openai.com/api/docs/guides/file-inputs),
  OpenAI docs. The same text-plus-images design, the 50 MB limit and the
  `detail` default that changed with GPT-5.6.
- [Document understanding](https://ai.google.dev/gemini-api/docs/document-processing),
  Google, 2026. Gemini's page limits, page scaling, and free native text
  on Gemini 3.
- [Media resolution](https://ai.google.dev/gemini-api/docs/media-resolution),
  Google, 2026. Tokens per PDF page at each resolution on Gemini 3.
