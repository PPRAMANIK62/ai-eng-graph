---
id: chunking
title: What is chunking?
depth: deep
phase: 2
note: >-
  Cutting documents into pieces for retrieval. Size, overlap, structure-aware splits.
needs: [semantic-search, tokenization]
leads_to: [rag]
compare_with: []
updated: 2026-09-27
---

# What is chunking?

Chunking is cutting your documents into smaller pieces before you embed
them. The chunk is the unit that search returns and the model reads, so
where you cut decides what retrieval can find. It happens once, early in
the pipeline, and a bad choice doesn't throw errors. It just makes answers
worse.

## Why not embed whole documents?

[[semantic-search|Semantic search]] turns each stored piece of text into
one vector and returns the pieces closest to the question. You could
store one vector per document. Three things go wrong.

**A question needs a few sentences, not a document.** Ask "What was Pellow
Foods' revenue growth in Q3 2025?" against a 40-page financial filing. The answer
is one sentence. Returning the whole filing wastes the model's context
window, costs tokens on every call, and buries the answer among text that
can distract the model.

**One vector can't hold a whole document well.** A long document covers
many topics, and a single vector has to stand for all of them at once.
The one sentence you need gets diluted by everything around it, which
makes it harder to find.

**Documents don't split cleanly by topic either.** Any piece you cut will
hold some text that matters for a question and some that doesn't. And the
text that matters can end up split across two pieces.

So you cut. The question is how big, where, and whether pieces should
share text at their edges.

## Four ways to cut the same text

Take a short, made-up piece of a company report: two sections, each under
its own heading.

![The same short document split three ways. Fixed-size chunks cut every N tokens, so a border falls in the middle of a sentence. Recursive splitting tries paragraph breaks first, then sentence ends, so each chunk ends on a boundary. Structure-aware splitting follows the headings, so each chunk is one section with its heading.](img/chunking-three-ways.svg)

**Fixed-size.** Count tokens and cut every N, say every 400. It's the
simplest method, and it ignores meaning completely: a border can fall in
the middle of a sentence, or between a number and what it measures.
Sizes are in tokens, so they depend on the model's [[tokenization|tokenizer]].

**Recursive.** Set a maximum size, then try the most natural break first.
Split on blank lines (paragraphs). Any piece still too big gets split on
single line breaks, then on spaces. Chunks end on the biggest boundary
that fits. It knows nothing about meaning, only where the text has
natural breaks. This is what LangChain's popular
`RecursiveCharacterTextSplitter` does. Chroma found its default
separators often left very short chunks, so for its tests it added
sentence ends (".", "?", "!") to the list.

**Structure-aware.** Use the document's own structure: one chunk per page
of a PDF, or one per section under a heading. The boundaries are ones the
author chose. The catch is size: a page or section can be tiny or huge.
In NVIDIA's tests, tables and charts were pulled out and kept whole
instead of being cut, so no one gets half a table.

**Semantic.** Embed small windows of text in order, and cut wherever
meaning shifts, which shows up as a jump in cosine distance between
neighboring windows. The version built into LangChain, by default, cuts
at jumps bigger than 95% of all the jumps in the document. Variants group small pieces by similarity,
or simply ask an LLM where to cut. These cost more: you embed everything
an extra time, or pay an LLM to read the whole corpus.

### Overlap

Any of these can add **overlap**: each chunk repeats the last part of the
one before it. If a key sentence straddles a border, overlap means one
chunk still has it whole. The price is duplicate text: more chunks to
store, and search can return the same sentence twice.

OpenAI's file search, as documented on 2026-09-27, cuts every file into
800-token chunks with 400 tokens of overlap by default. You can set the
size anywhere from 100 to 4,096 tokens, with overlap up to half of it.

## What the measurements say

Two studies measured chunking choices, and they don't measure the same
thing.

**Chroma (2024) measured retrieval only, by tokens.** They had an LLM
write test questions over five text collections, each with the exact
passages that answer it. Then, for each chunking method, they retrieved
the top 5 chunks and asked two questions. **Recall**: how much of the answer text
came back? **IoU** (intersection over union): of all the text that came
back, how much was answer? IoU drops when chunks are big, since most of
each chunk is filler, and when chunks overlap, since the repeated text
counts against it.

![Paired bars for six chunking settings, measured with text-embedding-3-large. Recall stays between 84% and 92% for all of them. IoU, the share of retrieved text that is actually answer, ranges from 1.4% for 800-token chunks with 400 overlap up to 6.9% for recursive 200-token chunks with no overlap and 8.0% for a cluster-based semantic chunker.](img/chunking-recall-vs-iou.svg)

Recall hardly changes across methods, but how much junk comes along with
the answer changes a lot:

- Recursive splitting at 200 tokens with no overlap was consistently
  good on every metric, without being the single best anywhere.
- OpenAI's 800/400 default had slightly below-average recall and the
  lowest scores on everything else.
- Cutting overlap raised IoU, as you'd expect.
- An LLM deciding where to cut got the best recall (91.9%). A
  cluster-based semantic chunker at 200 tokens got the best IoU (8.0%).
- The common semantic chunker with default settings scored slightly below
  average on every metric.

**NVIDIA (2025) measured final answers.** They ran the whole pipeline on
five sets of PDFs, mostly financial and business reports, and had LLM
judges grade the answers. Page-level chunks scored best on average
(0.648) and varied least across datasets. Fixed-size chunks from 128 to
2,048 tokens all landed between 0.603 and 0.645. The extremes lost: 128
tokens and 2,048 tokens usually did worse than the middle sizes.

The best size also changed with the questions. Short factual questions
did well with 256–512-token chunks. Questions that needed analysis did
better with 1,024 tokens or whole pages. Even three sets of financial
documents each had a different winner: 1,024 tokens, 512 tokens and
whole pages.

## Chunks lose their context

A chunk cut from the middle of a document forgets where it came from.
Take this one from a made-up company filing:

> Revenue rose 4% on the quarter before.

Which company? Which quarter? Nothing in the chunk says, so a question
about Pellow Foods' Q3 2025 revenue has little to match against, even
though this is the answer.

One fix is to add the missing context back before embedding. For each
chunk, give an LLM the whole document and the chunk, and ask for a short
note placing the chunk in the document, usually 50–100 tokens. Prepend
the note and embed the result:

> From Pellow Foods' Q3 2025 quarterly filing, in the section on sales;
> Q2 2025 revenue was $52 million. Revenue rose 4% on the quarter before.

Anthropic calls this contextual retrieval. In its 2024 tests, measured as
how often the right chunk was missing from the top 20:

| Setup | Top-20 failures |
|---|---|
| Plain embeddings | 5.7% |
| Contextual embeddings | 3.7% (35% fewer) |
| + contextual keyword search | 2.9% (49% fewer) |
| + reranking | 1.9% (67% fewer) |

Generating the notes cost $1.02 per million document tokens, using
Claude 3 Haiku with prompt caching, so each document is loaded into the
cache once instead of being sent in full with every chunk. Adding a
generic summary of the whole document to every chunk helped much less.

A cheaper step in the same direction needs no LLM: keep the document
title and section heading with each chunk. We haven't measured how much
of the gain that gets back.

## Where it gets tricky

**The size advice disagrees.** Chroma's data favors about 200 tokens with
no overlap. NVIDIA's favors 512–1,024 tokens or whole pages. OpenAI's
default is 800 with 400 overlap, the setting Chroma scored worst. Part of
the gap may come from what was measured: retrieved tokens with the top 5
chunks on plain text, versus final answers with the top 10 on PDFs. Neither
result transfers to your data automatically.

**Overlap cuts both ways.** It adds duplicate text, which hurts
efficiency. But with a small embedding model (`all-MiniLM-L6-v2`), Chroma
found overlap helped recall: 250-token chunks got 82.4% with 125 tokens of
overlap and 77.1% with none.

**"Semantic chunking" isn't one thing.** A 2024 study comparing semantic
chunking with plain fixed-size chunks on three retrieval tasks found the
extra compute wasn't justified by consistent gains. Chroma found one
semantic method near the bottom and another at the top for precision.
Test the specific method, not the label.

**Chunk sizes are in tokens, and tokens depend on the tokenizer.** Chroma
counted with OpenAI's `cl100k` tokenizer. The same text is a different
number of tokens for another model.

**Stable boundaries make citing easier.** A page number stays the same no
matter how you chunk. A fixed-size chunk's position changes whenever you
change the size. If you plan to show sources, keep a stable location
(page, section, character offset) with every chunk. See [[citations]].

**Speed is part of the cost.** Chunking time ranges from almost instant
for a splitter to tens of minutes for the LLM-based chunker in Chroma's
tests, and you pay it again whenever documents change.

## What this means when you build

- Start with a recursive splitter at a few hundred tokens and little or
  no overlap. For documents with clear structure, split on headings or
  pages first, and use the size limit only for long sections.
- Store the title, heading and location with each chunk. It gives you
  something to cite, and a chunk that says where it came from is easier
  to match.
- Build a small test set and compare two or three settings before you
  settle. The measurement side is in [[retrieval-evaluation]].
- If chunks keep coming back without the facts that tie them to their
  document, try contextual notes before trying fancier splitters.
- Chunks are what [[rag]] puts in front of the model, so a bad cut shows
  up as a bad answer, not as an error.

## Further reading

- [Evaluating Chunking Strategies for Retrieval](https://www.trychroma.com/research/evaluating-chunking),
  Smith and Troynikov (Chroma), 2024. The token-level measurements:
  recall and IoU for fixed, recursive, semantic and LLM chunking.
- [Finding the Best Chunking Strategy for Accurate AI Responses](https://developer.nvidia.com/blog/finding-the-best-chunking-strategy-for-accurate-ai-responses/),
  Steve Han (NVIDIA), 2025. End-to-end answer accuracy on PDFs, page-level
  vs token sizes, and how question type changes the best size.
- [Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval),
  Anthropic, 2024. Why chunks lose context, the LLM-written notes that
  put it back, and the failure-rate numbers.
- [Is Semantic Chunking Worth the Computational Cost?](https://arxiv.org/abs/2410.13070),
  Qu, Tu and Bao, 2024. The skeptic's result on semantic chunking.
- [Retrieval](https://developers.openai.com/api/docs/guides/retrieval),
  OpenAI docs. The file search default (800 tokens, 400 overlap) and
  its limits.
