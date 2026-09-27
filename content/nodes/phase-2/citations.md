---
id: citations
title: How do citations work in an LLM answer?
depth: short
phase: 2
note: >-
  Tying each claim in an answer to the source it came from, and showing it.
needs: [grounding]
leads_to: []
compare_with: [structured-output]
updated: 2026-09-27
---

# How do citations work in an LLM answer?

A citation ties one claim in an answer to the exact place in a source that
backs it. It's how [[grounding]] becomes visible: the user can see where
each sentence came from, and your code can check it. Getting citations
right has two halves, the data coming back from the model and what you
show on screen.

## A citation is a pointer into your document

Start with a two-sentence document: "The grass is green. The sky is blue."
Ask what color the grass and sky are, with citations switched on in
Claude's API, and the answer doesn't come back as one string. It comes
back as a run of text blocks:

- "According to the document, " (no citation)
- "the grass is green", citing characters 0 to 20 of document 0: "The
  grass is green."
- " and " (no citation)
- "the sky is blue", citing characters 20 to 36: "The sky is blue."

Join the blocks and you get the answer. Keep them apart and you know which
words rest on which source.

![An answer made of four text blocks: two plain connecting blocks and two cited claims. The claim “the grass is green” points to characters 0 to 20 of the document, the sentence “The grass is green.” The claim “the sky is blue” points to characters 20 to 36, “The sky is blue.” Each citation carries the document index, the character range and the cited text.](img/citations-pointers.svg)

What the pointer holds depends on the document. For plain text it's a
character range, for a PDF a page range, and for "custom content" (chunks
you've already split yourself) the index of the block. In every case the
API first chops the document into the smallest units it can cite. By
default that's sentences. If you want the model to cite a single sentence
of a retrieved chunk, pass each chunk as its own plain text document; if
you don't want it split further, use custom content.

## Prompted citations and API citations

You can get citations two ways.

**Ask for them in the prompt.** Number the retrieved passages and tell the
model to put `[1]`, `[2]` after each claim. This works on any model, but
nothing checks the output. A passage number or a copied "quote" is only as
good as the model's attention, so your code has to check it.

**Let the API produce them.** With a built-in feature like Claude's, the
API extracts the cited text itself, so every pointer is guaranteed to land
on real text in your documents. The quoted text also doesn't count as
output tokens, which makes long quotes cheaper than asking the model to
write them out. In Anthropic's own evaluations the built-in feature also
picked more relevant quotes than prompting did, though that's a vendor
claim with no number attached.

Either way, a valid pointer isn't proof. The API guarantees the cited
sentence exists. It doesn't guarantee the sentence supports the claim
next to it. Checking that is the job of grounding evals.

## Citations and JSON don't mix on Claude

On Claude you can't have both in one request. If citations are on for any
document and you also ask for [[structured-output]] (a strict JSON
schema), the API returns a 400 error. The reason is the shape: citations
come back as text blocks interleaved with citation data, and a strict
schema only allows the JSON you defined.

So you pick one per call. If you need a structured result and sources,
either use citations and build your structure from the blocks afterwards,
or put a quote field in your schema and accept that nothing guarantees
the quote is real.

## Showing citations on screen

The data only helps if people can use it. Three things matter.

- **Put the source next to the claim.** An inline marker or chip right
  after the sentence it supports, not a list of links at the bottom.
- **Label it.** Show the document or article title, not a bare number or
  URL, and link to the relevant part of the source, not just the top.
- **Style it apart from the answer**, so a citation doesn't read as more
  of the model's text.

Also plan for the fact that people rarely click citations. In one
usability study, a participant said they trusted the chatbot because they
could always click the source, then never clicked one during the whole
session. A citation makes an answer look checked whether or not
anyone checks it. That's a reason to verify citations in code, not a
reason to drop them.

When the answer streams, citations stream too: on Claude, each one arrives
as its own delta attached to the text block being written. Placing them
while text is still arriving is part of [[streaming-ui]].

## Where it gets tricky

**Real links can still be wrong.** Chat products have shown citations
that point to pages that don't exist, or to real pages that don't say what
the answer claims. Built-in citations over your own documents avoid the
first problem, not the second.

**It's all or nothing per request.** On Claude, citations must be on for
every document in a request or for none.

**Only text can be cited.** Images can't be, and a scanned PDF with no
extractable text can't be cited at all.

## What this means when you build

- Use the provider's citation feature when you can, over `[1]` markers
  parsed from free text.
- Pass retrieved chunks as separate documents so citations point at the
  chunk your retriever found.
- Don't request strict JSON and citations in the same Claude call. Decide
  which one this step needs.
- Show sources inline, labeled, and styled apart from the answer.
- Check in your evals that cited text supports the claim. Users won't.

## Further reading

- [Citations](https://platform.claude.com/docs/en/build-with-claude/citations),
  Anthropic, undated (checked 2026-09-27). The whole mechanism: chunking,
  the response format, streaming deltas, and the conflict with structured
  outputs.
- [Explainable AI in Chat Interfaces](https://www.nngroup.com/articles/explainable-ai/),
  Megan Chan (Nielsen Norman Group), 2025. How to show citations, and why
  users rarely check them.
