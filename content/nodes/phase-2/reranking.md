---
id: reranking
title: What is reranking?
depth: deep
phase: 2
note: >-
  A second, slower model that re-orders the top results.
needs: [hybrid-search]
leads_to: []
compare_with: []
updated: 2026-09-27
---

# What is reranking?

Reranking is a second pass over search results. A fast search pulls, say,
the top 150 candidates out of the whole collection. Then a slower, more
accurate model scores each candidate against the query, and only the best
few go to the LLM. It fixes the order of results without making the first
search expensive, and it can also be a lot of cost for little gain, so it's
worth measuring before you ship it.

## Why the first search gets the order wrong

The first stage of retrieval is usually [[semantic-search]], [[bm25]], or
both together as [[hybrid-search]]. The vector half uses a
**bi-encoder**: the model turns each document into a vector on its own,
ahead of time, and stores it. At query time it embeds the query and finds
the nearest stored vectors. That's what makes it fast over millions of
documents.

The catch is in "on its own". Each document's vector was made before
anyone asked a question, and the query's vector is made without looking at
any document. The model never sees the two side by side, so it can't check
how a particular query word relates to a particular passage.

BM25 has a similar blind spot from the other side. It knows which words
match, but not what they mean in the query.

Here's a real case. The query "John Lennon Yoko Ono album Starting Over"
has a clear right answer: the page for "(Just Like) Starting
Over", which contains every query word in its first two sentences. Vector
search ranked it 35th. Keyword search ranked it 45th, behind pages whose
titles named both Lennon and Ono. After merging the two lists, it sat at
49th out of 200.

## A reranker reads the query and the document together

A reranker is usually a **cross-encoder**. Instead of encoding the query
and the document separately, it feeds both into one model as a single
input, and the model outputs one number: how relevant this document is to
this query.

Because the model sees both texts at once, it can check how the words in
the query relate to the words in the document, which two separate vectors
can't. In the Lennon example, a cross-encoder read the query and the page
together and moved the page from 49th to first.

![Two ways to score a document against a query. Left, the first stage (a bi-encoder): the query and the document go through the model separately, each becomes a vector, and the vectors are compared. Document vectors are made ahead of time and stored, so this is fast over millions of documents. Right, the reranker (a cross-encoder): the query and one document go into the model together as one input, and it outputs a single relevance score. Nothing can be stored ahead of time, so it runs once per candidate at query time. Below, the two-stage pipeline: first stage over the whole collection, top 150 candidates to the reranker, top 20 to the model.](img/reranking-bi-vs-cross.svg)

The price is that nothing can be computed in advance. A cross-encoder
produces no embedding to store. Every query-document pair needs its own
pass through the model, at query time. For a sense of scale: comparing
every pair among 10,000 sentences with a cross-encoder means about 50
million passes and roughly 65 hours. A bi-encoder embeds the same 10,000
sentences in about 5 seconds.

## Two stages: retrieve many, rerank few

So you use both. The cheap first stage narrows millions of documents down
to a candidate list. The expensive reranker only sees that list.

In 2019, a BERT model reranking the top 1,000 BM25 results on the MS MARCO
benchmark beat the previous best system by 27% (relative, on MRR@10). The
two-stage shape is the same in the 2024 and 2026 tests below. Typical
numbers:

- Retrieve 100 to 200 candidates. Anthropic's 2024 experiments used 150.
- Rerank them and keep the top 10 to 20. Anthropic kept 20.

Reranking also makes the prompt smaller. Passing 20 good chunks instead of
150 so-so ones means the LLM reads less, which saves cost and latency on
the generation step.

In Anthropic's experiments, the share of relevant chunks missing from the
top 20 went from 5.7% with their best plain embeddings, to 2.9% with
improved embeddings plus BM25, to 1.9% once reranking was added.

## A reranker can only reorder what it's given

If the right document isn't in the candidate list, the reranker can't find
it. That's a first-stage problem, fixed by better retrieval or a deeper
list.

This gives you a way to measure the most a reranker could ever help,
before you try one. Take your labeled queries, reorder each candidate list
perfectly (relevant documents first), and score it. The gap between that
score and your current ranking is everything a better ordering could win
back. In Qdrant's 2026 tests on five public datasets, that gap at 200
candidates was 0.25 to 0.49 in nDCG@10. That's a lot of room, but a real
reranker only closes part of it.

## Does it pay off? The honest numbers

Qdrant tested four open cross-encoders on top of hybrid search, on
five public datasets. The key choice was the baseline. Against hybrid
search with the default merge settings, the best reranker gained on all
five. Against hybrid search with its merge tuned on labeled queries, the
picture changed:

![Horizontal bar chart of the nDCG@10 change from adding the best of four cross-encoder rerankers, measured against hybrid search with tuned fusion, on five datasets. CodeSearchNet +0.135 and DBPedia-entity +0.115 held up on held-out queries. SciFact +0.033 and ArguAna +0.017 did not hold up. WANDS −0.008: the reranker lost. Against untuned default fusion, all five looked like gains, from +0.031 to +0.169.](img/reranking-results.svg)

- Two datasets had big gains that held up on queries not used for
  choosing the setup (CodeSearchNet +0.135, DBPedia-entity +0.115).
- Two had small gains that didn't hold up on those held-out queries.
- On one (WANDS), the reranker lost to tuned merging at every candidate
  count.

What decided the wins was fit between the model and the data. The three
older models cut each query-document pair at 512 tokens and weren't trained
on code. The one that won both confirmed cases reads 1,024 tokens and was
trained on a broader mix that includes code. It turned a loss on code
search into the biggest win in the table. Model choice moved the results
more than any other setting.

## How many candidates to rerank

More candidates give the reranker more chances to find buried documents,
but cost more and can hurt. In Qdrant's tests:

- A reranker that lost at 10 candidates still lost at 200. A deeper list
  doesn't rescue a bad fit.
- On one dataset, 90% of queries already had their answer in the top 25.
  Going to 200 raised that to 98% but turned the gain into a loss: the
  extra candidates pushed relevant ones out of the top 10.
- On another, 96% of the gain came by 50 candidates. Going to 200
  quadrupled the work for the last 4%.

The advice that falls out: test at 10 candidates first, and only go deeper
while the share of queries with their answer in the list is still climbing.

## What it costs

On a CPU, small cross-encoders are slow. On an Apple M5 Pro, the smallest
model Qdrant tested (ms-marco-MiniLM-L-6-v2) scored 64 to 212 documents per
second, depending on document length. At 100 candidates, that's half a
second to five seconds per query across the three smaller models. The
second search in hybrid search, for comparison, added under 2 ms.

A hosted reranker moves that work off your servers. As of 2026-09, Voyage's
rerankers (rerank-2.5 stable, rerank-3 in preview) have a 32,000-token
context length and take up to 1,000 documents per request, returning the
`top_k` you ask for.

## Where it gets tricky

**Compare against a tuned first stage.** A reranker measured against
default settings can look like a win that tuning the merge would have
delivered for far less work at query time. Tune [[reciprocal-rank-fusion]] or your
score weights first, then make the reranker beat that.

**Silent truncation.** Three of the four models Qdrant tested cut the
input at 512 tokens, as the 2019 BERT reranker did. Long queries eat into
the space left for the document. On a dataset whose
queries averaged 168 words, the 512-token models lost. If your chunks are
long (see [[chunking]]), check the 95th-percentile length of query plus
chunk against the model's window.

**Small label sets lie.** A gain on 200 queries can vanish on the next 200.
Three of the five results above didn't survive that check. Split your labels, pick the
setup on one half, and check it on the other.

**Different studies, different verdicts.** Anthropic found reranking helped
across the domains they tried. Qdrant confirmed it on only two of five.
The setups differ: Anthropic used a hosted reranker (Cohere's) and doesn't
describe tuning its first stage, while Qdrant used open models against a
tuned baseline. Both are real results. They tell you to test on your own
data rather than assume.

**Not the only second stage.** Late-interaction models rerank from vectors
stored ahead of time instead of reading each pair from scratch. They're a
different tradeoff, not covered here.

## What this means when you build

- Get [[hybrid-search]] working and tuned, with a labeled query set (see
  [[retrieval-evaluation]]), before adding a reranker.
- Measure the headroom first: how much would a perfect ordering of your
  candidates gain?
- Pick a model whose context window and training data fit your documents.
  Check its languages and domains.
- Test at 10 candidates against the tuned first stage, on held-out queries.
  Go deeper only if it wins.
- Measure latency on your real hardware and document lengths. A hosted API
  may be cheaper than a CPU in your request path.
- Put only the top few reranked chunks in the prompt. What goes in the
  context window, and in what order, is [[context-engineering]].

## Further reading

- [Passage Re-ranking with BERT](https://arxiv.org/abs/1901.04085),
  Rodrigo Nogueira and Kyunghyun Cho, 2019. BERT reranking BM25's top
  1,000 passages on MS MARCO, with the query and passage fed into one
  model.
- [Cross-Encoders](https://www.sbert.net/examples/cross_encoder/applications/README.html),
  Sentence Transformers docs. Bi-encoders vs cross-encoders, the 65-hours
  vs 5-seconds comparison, and how to combine them.
- [When Is a Reranker Worth It?](https://qdrant.tech/documentation/search-tuning/when-a-reranker-is-worth-it/),
  Dylan Couzon (Qdrant), 2026. A careful test of four rerankers against a
  tuned first stage, with candidate counts and CPU speeds.
- [Introducing Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval),
  Anthropic, 2024. Reranking as one step of a full pipeline, with failure
  rates before and after, and the latency tradeoff.
- [Rerankers](https://docs.voyageai.com/docs/reranker), Voyage AI docs,
  updated 2026-09-01. What current hosted rerankers offer: models, context
  length and request limits.
