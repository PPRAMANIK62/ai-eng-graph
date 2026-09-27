---
id: retrieval-evaluation
title: How do you measure retrieval?
depth: deep
phase: 2
note: >-
  Measuring the search step on its own, separate from the answer.
needs: [rag, evals]
leads_to: [recall-at-k, mrr]
compare_with: []
updated: 2026-09-27
---

# How do you measure retrieval?

A [[rag]] system does two things: it searches for chunks, then a model
answers from them. Retrieval evaluation tests the first half on its own.
For each test question you write down which chunks should come back, run
the search, and count how often they did. If the right chunk never reaches
the prompt, no prompt change will fix the answer, so this is the first
number worth having.

## A wrong answer has two possible causes

Say you've built a chat over a set of articles, and someone asks "Why does
temperature 0 still give different answers?" The answer comes back wrong.
Either:

- **Search missed.** The paragraph that explains it never made it into the
  top results, so the model never saw it.
- **The model fumbled.** The paragraph was right there in the prompt, and
  the model ignored it, misread it or mixed it up with something else.

An end-to-end [[evals|eval]] that only grades the final answer can't tell
these apart. It says "wrong" either way. The fixes are completely
different: the first needs better chunking, a different embedding model or
keyword search added, and the second needs a better prompt or a better
model.

So you measure search separately. For each question, you only ask one
thing: did the chunks that answer it come back near the top? No model call
and no grading of prose are involved, so the test is cheap and fast to
run after every change.

## What you need: questions, chunks and labels

Search engineers worked out how to test this long before RAG, and the
setup carries over as is. You need three things:

1. **The collection.** Everything search can return. In RAG, that's your
   chunks.
2. **Test questions.** Written the way real users would ask.
3. **Relevance labels.** For each question, which chunks are relevant. This
   is the answer key, usually called the ground truth or gold standard.
   The BEIR benchmark calls this part `qrels`.

A label is usually a plain yes or no: this chunk answers the question, or
it doesn't. Relevance means "this helps with what the person wanted to
know", not "this contains the words they typed". A chunk can share every
word with the question and still not answer it.

| Question | Relevant chunks |
|---|---|
| Why does temperature 0 still give different answers? | `sampling#tricky-1` |
| What does BM25 add on top of embeddings? | `hybrid-search#why-2` |
| How big should a chunk be? | `chunking#size-1` |

That table is the whole dataset. The ids are made up for this example.
A question can have more than one relevant chunk; here each has one.

How many questions? A long-standing rule of thumb in IR is that 50 is a
reasonable minimum. Scores swing a lot from one question to the next, often
more than they swing between two search systems on the same question, so
you need enough questions for the average to mean something.

## Scoring a ranked list

Search returns a ranked list, and you usually keep the top k: that's how
many chunks go into the prompt. So the metrics look at the top k.

![Three test questions, each with the top 5 chunks search returned. For "Why does temperature 0 vary?" the labelled chunk is at rank 1. For "What does BM25 add?" it is at rank 3. For "How big should a chunk be?" it is at rank 8, outside the top 5. Recall at 5 per question is 1, 1 and 0, an average of 0.67. Reciprocal rank is 1, one third and 0, so MRR at 5 is 0.44. Made-up worked example.](img/retrieval-evaluation-scorecard.svg)

The two you'll use most:

- **[[recall-at-k|Recall@k]].** Of the chunks that should come back, what
  share is in the top k? It answers "did the model get to see the right
  text?", which for RAG is the question that matters most.
- **[[mrr|MRR]]** (mean reciprocal rank). How high the first right chunk
  sits, averaged over questions. Rank 1 scores 1, rank 2 scores 1/2, rank 3
  scores 1/3, and a miss scores 0.

There are others. Precision@k is the share of the top k that's relevant; it
tells you how much noise you're sending the model. MAP and nDCG look at the
whole ranking, and nDCG also handles graded labels like "very relevant" and
"a bit relevant". Recall@k and MRR each have a short article with the
formula and a worked example.

Pick k to match your system. If you put 20 chunks in the prompt, measure
recall@20. Anthropic's Contextual Retrieval work (2024) reported exactly
that, framed as a failure rate: 1 minus recall@20, the share of relevant
chunks that didn't make the top 20. Their baseline missed 5.7%, and each
change they tried was scored by how much it cut that number. They also
found that passing 20 chunks to the model worked better than 10 or 5.

## Where the labels come from

The questions and labels are the expensive part. There are three ways to
get them, and you can mix them.

**Write them by hand.** Someone who knows the content writes realistic
questions and marks the chunks that answer each one. It's slow and
expensive. Nobody reads every chunk for every question, so
the usual shortcut is **pooling**: run a few different search methods, take
their top results, and judge only those. Anything outside the pool is
assumed not relevant. Keep that assumption in mind; it comes back below.

**Generate them from your chunks.** For each chunk, ask an LLM to write a
question that chunk answers. Now you have a question and its label
without anyone writing labels. Search for each question and check whether
its chunk comes back. On issues pulled from a code repository, this
showed keyword search at about 55% recall and embeddings at about 65%. On
a set of essays, the two were about equal and keyword search was about 10
times faster. You can't know which case you're in until you measure.

Generated questions have a catch: they can be easier to search for than
what real users type, so search looks better than it is. Chroma tested
this in 2025 against real user questions from Weights & Biases' docs
chatbot. Questions generated with no guidance kept the
embedding models in the right order but scored higher than the real
questions did. What fixed it was giving the LLM context about the users
and a few real example questions to copy the style of, and first filtering
out documents nobody would ask about (13,319 documents down to 8,490). With
that, generated questions scored close to the real ones.

**Label real questions.** Once people use your system, log what they ask
and label a sample. It's the closest match to real use, and it's also
work. In the
same Chroma study, labelling went like this: search with each of four
embedding models, have a person check the top 10 from each, and if none
was relevant, search the docs by hand. Of 693 real questions, 560 had an
answer in the docs, and for 76 of those, the answer was in a document
none of the four models had put in its top 10. The other 133 had no
answer in the docs at all.

## Why a public benchmark isn't enough

Public retrieval benchmarks exist, like BEIR (2021, 18 datasets) and MTEB.
They're good for building a shortlist of [[embedding-models]]. They can't
tell you how search will do on your chunks, for three reasons: their data
is generic, it's cleaner than real questions, and models have likely seen
it in training.

The BEIR paper showed the first problem: many models that beat BM25 on
the kind of data they were trained for did worse than it on new domains.
Chroma showed it on real data. jina-embeddings-v3 beat
text-embedding-3-large on every MTEB English task, but on the chatbot's real questions it scored lower,
with recall@10 of 0.511 against 0.552. Neither result says which model is
better in general. It says the ranking depends on the data, and you only
have one dataset that matters.

## Where it gets tricky

**Unlabelled doesn't mean irrelevant.** Pooled labels only cover what the
pooling systems found. A new search method that finds different, perfectly
good chunks gets marked wrong for them. BEIR measured this on TREC-COVID,
whose labels were pooled from many teams' systems and still leaned toward
keyword matching. For the dense retriever ANCE, 14.4% of its top-10
results had never been judged; for BM25 only 6.4%. When the authors judged the missing ones by hand, ANCE's
nDCG@10 went from 0.654 to 0.735 and BM25's from 0.656 to 0.668. Before,
ANCE looked slightly worse than BM25. After, it was clearly better. The
same thing happens in a small way with generated questions: each question
gets one labelled chunk, but a second chunk may answer it too. Before
trusting a drop in recall, read the misses. Some of them are label errors.

**Some questions have no right chunk.** Recall is undefined when nothing is
relevant, so those questions quietly drop out of the score. Chroma's study
had the same gap: its metrics only covered questions that had an answer in
the docs. But questions with no answer are exactly where a system should
decline instead of making something up. That needs its own test, covered
in [[saying-i-dont-know]].

**Labels or an LLM judge?** A second approach skips labels entirely.
Ragas (2023) has an LLM read the chunks that came back and extract the
sentences that help answer the question; context relevance is the share
of sentences it kept. That's quick and needs no answer key. It answers a
different question, though: whether what came back is focused, not whether
you found the right chunk among everything you have. A chunk you never
retrieved can't be judged. And the judge is a model, with its own errors
to check. You can use both, as long as you remember they measure
different things.

**Which metric?** BEIR argued that recall and precision ignore order and
that MRR can't use graded labels, and settled on nDCG@10 for comparing
models across datasets. That's a good choice for a benchmark. For RAG,
where every chunk in the top k goes into the prompt, whether the right
chunk is there at all matters more than whether it's first, which is why
recall@k is the usual headline. Order within the prompt still counts for
something: models use the start and end of a long prompt better than the
middle ([[lost-in-the-middle]]).

**Humans don't fully agree either.** When two people label the same
question-document pairs in IR test collections, their agreement is usually
only "fair". That's one reason labels are usually kept to a plain yes or
no: people already disagree on that, and a finer scale asks more of them.

**Good retrieval doesn't guarantee a good answer.** A high recall@k means
the model had what it needed. Whether it used it well is the other half,
and that still needs an eval on the answers.

## What this means when you build

- **Build the retrieval set before you tune search.** Chunk size, the
  embedding model, adding keyword search, a reranker: each is a guess until
  it moves a number. See [[chunking]], [[hybrid-search]] and
  [[reranking]].
- **Aim for about 50 questions to start,** a mix of generated and real.
  Steer generation with a few real questions so they don't come out too
  easy.
- **Report recall@k at the k you actually use,** plus MRR if the order of
  chunks matters to you.
- **Label something that survives re-chunking.** A chunk id changes every
  time you change chunk size. Labelling the source passage (an article and
  section, say) and counting any chunk that overlaps it keeps your labels
  valid while you experiment with chunking.
- **Read the misses.** Some are search failures, some are missing labels.
- **Don't tune on your test set.** Keep a separate set for trying changes,
  and use the test set only to report. Otherwise the score overstates how
  well search will do on new questions.
- **Write down the target first.** "Recall@20 above some number on these
  50 questions" is a [[success-criteria|success criterion]] you can check.

## Further reading

- [Evaluation in information retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-in-information-retrieval-1.html),
  Manning, Raghavan and Schütze, Introduction to Information Retrieval,
  2008. The textbook setup: test collections, relevance labels, precision
  and recall, pooling, judge agreement, and why not to tune on the test
  set.
- [BEIR: A Heterogeneous Benchmark for Zero-shot Evaluation of Information Retrieval Models](https://arxiv.org/abs/2104.08663),
  Thakur et al., 2021. How a retrieval benchmark is built, why nDCG@10, and
  the TREC-COVID study showing how pooled labels penalize new methods.
- [Introducing Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval),
  Anthropic, 2024. Retrieval measured on its own as 1 minus recall@20, with
  each improvement scored against it.
- [Generative Benchmarking](https://www.trychroma.com/research/generative-benchmarking),
  Hong, Troynikov, Huber and McGuire (Chroma), 2025. Generating test
  questions from your own documents, checked against real user questions,
  and a public-benchmark ranking that flips on real data.
- [Systematically Improving Your RAG](https://jxnl.co/writing/2024/05/22/systematically-improving-your-rag/),
  Jason Liu, 2024. The practitioner recipe: a synthetic question per chunk,
  measure recall first, then decide what to change.
- [Ragas: Automated Evaluation of Retrieval Augmented Generation](https://arxiv.org/abs/2309.15217),
  Es et al., 2023, revised 2025. The reference-free alternative, with an
  LLM judging the retrieved context instead of labels.
