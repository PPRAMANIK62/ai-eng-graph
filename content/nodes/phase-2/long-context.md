---
id: long-context
title: When does long context beat retrieval?
depth: short
phase: 2
note: >-
  Putting whole documents in the prompt instead of retrieving pieces. When it wins.
needs: [context-window]
leads_to: [lost-in-the-middle]
compare_with: [rag]
updated: 2026-09-27
---

# When does long context beat retrieval?

Long context means skipping the search step: you put the whole document, or
the whole knowledge base, into the prompt and let the model find what it
needs. Now that windows hold hundreds of pages, that's a real choice next
to [[rag]]. It tends to give better answers, and it costs more on
every call.

## The same question, two ways

Say you have a 300-page product manual and a user asks how two settings
interact.

- **With retrieval**, you cut the manual into chunks, find the five that
  best match the question, and send only those. Maybe 1,500 words.
- **With long context**, you send the whole manual plus the question, and
  the model reads all of it.

The long-context version has a clear appeal. There's no chunking to tune,
no search that can miss the right page, and the model sees how the parts of
the manual relate. The catch is that you pay for every token of the manual
on every question.

How big a window is, and why accuracy slips as it fills, is covered in
[[context-window]]. This article is about the choice.

## What a head-to-head found

A 2024 Google study ran exactly this comparison on three models of the
time: Gemini-1.5-Pro, GPT-4o and GPT-3.5-Turbo. The retrieval side cut texts
into 300-word chunks and sent the top five.

When the text fit in the window, sending all of it won on answer quality
for every model:

| Model | Long context ahead of RAG by |
|---|---|
| Gemini-1.5-Pro | 7.6% |
| GPT-4o | 13.1% |
| GPT-3.5-Turbo | 3.6% |

But RAG sent far fewer tokens, and API pricing is per input token, so RAG
was much cheaper. And for 63% of the questions, both approaches gave the
exact same answer. For 70%, the scores differed by less than 10 points.
Most of the time, you were paying for the whole text to get the same
result.

Where retrieval lost, the questions had a pattern:

- they needed **several steps of reasoning** across the text
- they were **broad**, about the text as a whole, not one fact in it
- they were **long and complicated** themselves
- the answer was **implied** across the text, not stated in one place

A handful of chunks can't cover those. A lookup for one fact can.

Two results cut the other way. On texts much longer than GPT-3.5-Turbo's
16,000-token window, retrieval won, because the long-context version had to
be cut off to fit. And when retrieval sent more than 50 chunks, the two
approaches scored about the same.

## Try retrieval first, fall back to the full text

The same study proposed a simple router, **Self-Route**, built on that 63%
overlap:

1. Send the question with the retrieved chunks, and ask the model whether
   it can answer from them. It may say the question is unanswerable.
2. If it answers, you're done. If it says it can't, send the full text.

Most questions stopped at step 1: the model said it could answer from the
chunks for 57% of questions on GPT-4o and 82% on Gemini-1.5-Pro. The
answers stayed about as good as sending everything every time, and the cost dropped by 65% for Gemini-1.5-Pro and
39% for GPT-4o. Gemini used 38.6% of the tokens it would have used sending
the full text for every question.

![A flow chart. A question and the top retrieved chunks go to the model, which is asked whether it can answer from them. If yes, it answers, and the call was cheap. If not, the full text is sent and the model answers from all of it. With this router, Gemini-1.5-Pro used 38.6% of the tokens of sending the full text every time, and cost fell 65% for Gemini-1.5-Pro and 39% for GPT-4o.](img/long-context-self-route.svg)

## A simple rule of thumb

Anthropic's 2024 advice was blunt: if your knowledge base is under 200,000
tokens, about 500 pages, skip retrieval and put all of it in the prompt.
Prompt caching, which lets the provider reuse a prompt it has seen before,
makes this cheaper: at the time, Anthropic said caching cut latency by more
than half and cost by up to 90%. Past that size, you need retrieval. The
exact number will move as windows grow, but the idea holds. If your data fits comfortably and the per-call cost is fine, try the
simple version first, and only build retrieval when you have a reason.

## Where it gets tricky

**Fitting isn't the same as being used well.** A model can take in a whole
manual and still get less precise as the window fills, and some models
handle far less than their advertised window. That's covered in
[[context-window]]. Where in the prompt the key passage sits can matter
too, covered in [[lost-in-the-middle]].

**"Long" in these studies isn't that long.** The Google benchmarks averaged
around 7,000 words on one set and around 100,000 tokens on another. The
models were 2024 ones. Newer models with bigger windows may shift the
balance, and no source here tests 2026 models.

**It's not either-or.** Self-Route mixes both. A long window also lets a
RAG system send more chunks. The real question is how much to send for
each request.

## What this means when you build

- If your whole corpus fits in the window with room to spare, start by
  sending all of it, with caching on. Measure quality and cost before you build a pipeline.
- If the cost per call is too high, or the corpus doesn't fit, use
  retrieval.
- Expect retrieval to struggle on broad, multi-step or "what does it all
  mean" questions. If those are common for you, route them to the full
  text.
- A cheap "can you answer from these chunks?" check can save most of the
  cost of long context while keeping most of the quality.

## Further reading

- [Retrieval Augmented Generation or Long-Context LLMs?](https://arxiv.org/abs/2407.16833),
  Li et al. (Google DeepMind), 2024. The head-to-head: quality, cost, the
  63% overlap, why retrieval fails, and Self-Route.
- [Introducing Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval),
  Anthropic, 2024. The "under 200,000 tokens, put it all in the prompt"
  rule of thumb, and what caching does to its cost.
