---
id: rag
title: What is RAG?
depth: deep
phase: 2
note: >-
  Retrieve relevant text, put it in the prompt, answer from it.
needs: [semantic-search, chunking, context-window]
leads_to: [grounding, retrieval-evaluation, context-engineering]
compare_with: [long-context, fine-tuning]
updated: 2026-09-27
---

# What is RAG?

RAG, retrieval-augmented generation, means searching your own documents for
the passages that fit a question, pasting them into the prompt, and asking
the model to answer from them. It's the usual way to get a model to answer
about things it never saw in training: your docs, your tickets, last week's
changes. Much of the work, and many of the bugs, sit in the search step,
not the model.

## Start with one question

Say you run a docs site and a user asks: "How do I rotate the API key for a
staging project?"

The model has never read your docs. What it knows came from
[[pretraining]], and your docs weren't in that pile, or were in it in an
older version. Ask it cold and it'll write a plausible answer in a confident
voice, which is how [[hallucination]] happens.

There are two ways to give it the knowledge:

1. **Change the model.** Train it further on your docs, covered in
   [[fine-tuning]].
2. **Hand it the right page when the question comes in.** Find the few
   paragraphs about key rotation, put them in the prompt next to the
   question, and tell the model to answer from them.

RAG is the second one. Nothing about the model changes. You change what it
reads on this one call.

## Two halves: an index you build ahead, a lookup per question

A RAG system has one part that runs before anyone asks anything, and one
that runs on every question.

**Ahead of time, you build the index.**

1. Split every document into small pieces. This is [[chunking]], and the
   choices you make here decide what can be found later.
2. Turn each chunk into an [[embeddings|embedding]], a list of numbers that
   places similar meanings close together.
3. Store the chunks and their embeddings in a database you can search.

**On each question, you look things up and answer.**

1. Embed the question the same way.
2. Find the chunks whose embeddings sit closest to it. This is
   [[semantic-search]].
3. Put the best few chunks into the prompt, with instructions and the
   question.
4. The model writes the answer.

![A RAG pipeline in two rows. The top row runs ahead of time: documents are split into chunks, each chunk is embedded, and the embeddings go into an index. The bottom row runs on each question: the question is embedded, the index is searched, the top chunks go into the prompt, and the model writes an answer. Seven numbered markers show where things fail: missing content at the documents, the right chunk ranked too low at search, retrieved but cut from the prompt, and four failures at the answer: not extracted, wrong format, wrong specificity, incomplete.](img/rag-pipeline.svg)

Semantic search alone misses exact strings like an error code or a product
ID, because meaning-based search blurs them. So real systems often run a
keyword search like [[bm25]] next to it, merge the two lists with
[[hybrid-search]], and sometimes re-order the top results with a second
model, covered in [[reranking]].

## What the model actually sees

After retrieval, the prompt for the key-rotation question looks roughly
like this (a sketch, not a real system's prompt):

```
Answer the question using only the documents below.
If they don't contain the answer, say you don't know.

<document source="docs/auth/api-keys.md">
...the two chunks about key rotation...
</document>
<document source="docs/projects/staging.md">
...the chunk about staging projects...
</document>

Question: How do I rotate the API key for a staging project?
```

That's all RAG is at the model's end: text pasted into the prompt. The
model doesn't know a search happened. Wrapping each chunk in tags keeps
documents apart from instructions, as in [[xml-tags]]. Everything retrieved
has to fit in the [[context-window]] along with the instructions and the
answer.

The instruction to answer only from the documents, and to say so when they
don't cover it, is its own topic, [[grounding]]. Pointing each claim back to
the chunk it came from is [[citations]]. The fallback when nothing relevant
comes back is [[saying-i-dont-know]].

## Where the name comes from

The term comes from a 2020 paper by Lewis and others at Facebook AI
Research. They framed it as two kinds of memory. What the model learned in
training is **parametric** memory: it lives in the weights. A searchable
index of text is **non-parametric** memory: it lives outside the model and
can be read at question time.

Their system paired a text generator (BART, a 2020 model) with a retriever
that searched a vector index of Wikipedia. It set the best scores of its
time on three open-domain question-answering benchmarks, and wrote more
specific and more factual text than the same generator without retrieval.

The reasons they gave for adding retrieval still hold. Knowledge in the
weights is hard to change, hard to inspect, and prone to made-up answers.
Knowledge in an index can be edited, read and checked. Swap the index and
the system knows something new, with no retraining.

One thing is different now. In the original paper, the retriever and
generator were trained together on each task. When people say RAG in 2026
they usually mean a frozen model behind an API plus a separate search step,
with nothing trained at all. Same idea, different build.

## Chunks lose their surroundings

The most common quiet problem is that a chunk makes sense in its document
but not on its own.

Take a chunk from a made-up company's quarterly filing: "Revenue rose 4% on
the quarter before." Which company? Which quarter? The paragraph before it
said so, but that paragraph is a different chunk. A question like "How did
Pellow Foods' revenue change in Q3 2025?" may never find it.

One fix is to have a model write a short line of context for every chunk
before you embed it ("From Pellow Foods' Q3 2025 filing; Q2 revenue was $52
million"), and store that line with the chunk.
Anthropic measured this in 2024 by how often the right chunk was missing
from the top 20 results:

| Setup | Failed to retrieve | Change |
|---|---|---|
| Plain embeddings | 5.7% | |
| Embeddings with added context | 3.7% | 35% fewer failures |
| Plus keyword search on the same context | 2.9% | 49% fewer |
| Plus reranking | 1.9% | 67% fewer |

Generating those lines isn't free. With prompt caching, Anthropic put the
one-time cost at $1.02 per million document tokens.
More on the choices here in [[chunking]].

## Seven places it breaks

A 2024 paper from Deakin University built three RAG systems, for research
papers, teaching and biomedical questions, and listed where they failed.
Seven failure points, in the order a question meets them:

1. **Missing content.** The answer isn't in your documents at all. The best
   case is the system saying it doesn't know.
2. **Missed the top results.** The answer is in the documents but didn't
   rank high enough to be returned.
3. **Not in the context.** It was retrieved, but got cut when the results
   were trimmed to fit the prompt.
4. **Not extracted.** It's in the prompt, and the model still didn't pull it
   out.
5. **Wrong format.** You asked for a table or a list and got prose.
6. **Wrong specificity.** The answer is there but too vague, or too
   detailed, for what the user needed.
7. **Incomplete.** Not wrong, but missing part of what was in the context.

The first three are search problems. The model can't answer from a page it
never saw, so no prompt tweak fixes them. That's why you measure the search
step on its own, covered in [[retrieval-evaluation]]. The last four happen
after retrieval worked, and they're about the model and the prompt.

The paper's two lessons are worth keeping. You can only really validate a
RAG system once it's running on real questions. And robustness grows as
you fix what you see; it isn't designed in on day one.

## How much to retrieve

More chunks means a better chance the right one is in the prompt. It also
means more text for the model to wade through.

Databricks tested this in 2024 with over 2,000 runs on 13 models, growing
the retrieved text from 2,000 up to 192,000 tokens. The more they
retrieved, the more often the right passage made it into the prompt. But
answer quality rose and then fell for most models. Llama-3.1-405b started
getting worse after 32,000 tokens, and GPT-4-0125-preview after 64,000.
Only a few models held steady on every dataset.

The models also failed in different ways. Claude 3 Sonnet increasingly
refused to answer on copyright grounds as the context grew: 3.7% of the time
at 16,000 tokens, 49.5% at 64,000. DBRX summarized the documents instead of
answering. Mixtral wrote repeated or random text.

At the small end, Anthropic's tests found passing the top 20 chunks worked
better than the top 10 or top 5. So the right amount is a number you tune on
your own data. Where in
the prompt the best chunk lands can matter too, covered in
[[lost-in-the-middle]].

## Where it gets tricky

**Sometimes you don't need RAG.** If the whole knowledge base fits in the
window, you can skip the search and paste everything in. Anthropic's 2024
rule of thumb was under 200,000 tokens, about 500 pages. A 2024 Google study
found putting the full text in the prompt beat RAG on answer quality by 3.6%
to 13.1% depending on the model, while RAG cost far less; on 63% of
questions both gave the exact same answer. When each wins is covered in
[[long-context]].

**Bigger windows didn't kill RAG.** The Databricks team's reading of their
results is that long windows and RAG help each other: a longer window lets
a RAG system include more of what it retrieved. And when your documents
are far bigger than any window, some search step has to pick what goes
in.

**"RAG" means two things.** The 2020 paper trained the retriever and the
generator together. Today's version calls a frozen model and trains
nothing. Papers that compare "RAG" to something else may mean either.

**Why RAG loses when it loses.** In the Google study, RAG's misses came from
questions that need several steps of reasoning, broad questions ("what is
this book about?"), long and complicated questions, and questions whose
answer is implied across the text rather than stated in one place. A few
retrieved chunks can't cover those.

**The research models are old.** The numbers here come from 2023 and 2024
models. Newer ones may use long prompts better. The shape of the lessons
(search is the ceiling, more isn't always better, measure your own case) is
better supported than any one number.

## What this means when you build

- **Treat search as the product.** If the right chunk isn't retrieved, no
  model or prompt can save the answer. Measure retrieval on its own first
  ([[retrieval-evaluation]]).
- **Check whether you need it.** If your corpus fits comfortably in the
  window and the cost is fine, try pasting it all in before building a
  pipeline.
- **Keep keyword search in the mix** for IDs, error codes and exact names.
- **Give chunks their context back**, by prepending a title or a generated
  line, so a chunk makes sense alone.
- **Tune how many chunks you send.** Start around 20 and measure, rather
  than guessing 3.
- **Plan for "not in the documents".** Some questions have no answer in your
  data. Decide what the system says then ([[saying-i-dont-know]]).
- **Log real questions.** Most failures only show up in use.

## Further reading

- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks](https://arxiv.org/abs/2005.11401),
  Lewis et al. (Facebook AI Research), 2020. The paper that named RAG:
  parametric vs non-parametric memory, and why retrieval helps.
- [Seven Failure Points When Engineering a Retrieval Augmented Generation System](https://arxiv.org/abs/2401.05856),
  Barnett et al. (Deakin University), 2024. Where RAG breaks, from three
  real systems.
- [Introducing Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval),
  Anthropic, 2024. The standard pipeline, the lost-context problem and a
  measured fix, plus the "under 200k tokens, skip RAG" rule.
- [Long Context RAG Performance of LLMs](https://www.databricks.com/blog/long-context-rag-performance-llms),
  Leng et al. (Databricks), 2024. How much retrieved text helps before it
  hurts, over 2,000 runs on 13 models.
- [Retrieval Augmented Generation or Long-Context LLMs?](https://arxiv.org/abs/2407.16833),
  Li et al. (Google DeepMind), 2024. RAG vs full text in the prompt, head
  to head, and why RAG misses.
