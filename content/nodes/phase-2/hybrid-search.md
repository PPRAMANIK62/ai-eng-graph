---
id: hybrid-search
title: What is hybrid search?
depth: deep
phase: 2
note: >-
  Running keyword and vector search together and merging the results.
needs: [bm25, semantic-search]
leads_to: [reciprocal-rank-fusion, reranking]
compare_with: []
updated: 2026-09-27
---

# What is hybrid search?

Hybrid search runs a keyword search and a vector search on the same query,
then merges the two ranked lists into one. The two searches fail on
different queries, so together they miss less. It's cheap to add and
usually helps, but not always, and the merge step has real choices in it.

## Two searches that miss different things

Here are two real queries from a public product-search test set,
and what each kind of search put first:

- **"french molding"**. Keyword search matched the words "french" and
  "mold" and returned a french bread mold. Vector search returned a
  decorative rosette applique, which the dataset marks as the right
  kind of result.
- **"bathroom vanity knobs"**. Vector search understood the topic and
  returned a whole bathroom vanity set. Keyword search matched "knobs" and
  returned a knob, which the dataset marks as right.

Each search wins one and loses the other. The reasons are built into how
they work.

[[bm25]] scores documents on the exact words they share with the query,
giving rare words more weight. It's precise: a part number, an error code
or a name matches only itself. But it has no idea what words mean. If the
query and the right document use different words for the same thing, it
misses.

[[semantic-search]] turns the query and each document into
[[embeddings]] and finds the nearest ones. It catches paraphrases and
related ideas. But an exact string can get lost among documents that are
about the same topic. Paste a part number into the query and you may get
pages on the right subject without the one that has that number.

Neither failure shows up in your logs. The search returns something
plausible either way.

## How it works: two lists, one merge

A hybrid search has four steps:

1. Run keyword search and take the top candidates, say 100.
2. Run vector search on the same query and take its top 100.
3. Merge the two lists into one ranking. This is called **fusion**.
4. Pass the top few to the model, or first to a [[reranking|reranker]].

![Diagram of hybrid search. One query goes to two searches at once: keyword search (BM25) and vector search. Each returns its own ranked list of about 100 candidates. A fusion step merges the two lists into one ranking, and the top 10 go on to the model or a reranker. Below, two real product queries: for "french molding", vector search found the right product and keyword search found a french bread mold; for "bathroom vanity knobs", keyword search found the right knob and vector search found a vanity set.](img/hybrid-search-pipeline.svg)

One thing to hold on to: fusion only reorders. It works on the union of
the two lists, so a document that neither search returned can't appear. If
the right answer sits at position 250 in both lists and you only took 100,
no merge method will find it.

## Why you can't just add the scores

The obvious merge is to add each document's two scores. That doesn't work,
because the scores live on different scales.

Vector similarity is bounded (with [[cosine-similarity]] it can't go above
1), and the top results can sit very close together. BM25 has no fixed
range. Its size depends on how many query words matched and how rare
they are, so it changes from query to query.

Here's what that looks like. Four documents, one query:

| | doc1 | doc2 | doc3 | doc4 |
|---|---|---|---|---|
| Vector score | 0.347 | 0.350 | 0.348 | 0.346 |
| BM25 score | 100 | 1.5 | 1 | 0.5 |

Add them and BM25 decides everything: the vector scores barely differ. Now
a second query where the BM25 scores are 0.63, 0.01, 0.3 and 0.4. Here the
two are on similar scales. A fixed weight on the raw scores can balance one
query and let BM25 drown out the other. No single weight works for both.

## Three ways to merge

**1. Use ranks, not scores.** [[reciprocal-rank-fusion]] (RRF) ignores the
scores entirely. Each document gets points for its position in each list,
roughly one over its rank, and the points add up. First place in the
keyword list is worth the same as first place in the vector list, whatever
the raw scores were. It needs no normalization and no tuning, which is why
it's the usual starting point.

The cost is that it throws away the size of the gaps. In the table above,
doc1's BM25 score is 67 times doc2's. RRF only sees "first" and "second".
It ranks doc2 above doc1: doc2 is first in the vector list (by 0.002) and
second in BM25, while doc1 is first in BM25 but third in the vector list.

**2. Normalize, then weight.** Rescale each list's scores to 0–1 for this
query (the top score becomes 1, the lowest 0), then take a weighted sum:

$$
\text{score} = \alpha \cdot \text{vector} + (1 - \alpha) \cdot \text{keyword}
$$

This is called a convex combination. $$\alpha$$ is a knob between 0 and 1.
Unlike RRF, it keeps the gaps: doc1's huge BM25 lead survives. Elastic's
linear retriever and Weaviate's relativeScoreFusion both work this way.

**3. Normalize by the spread.** Distribution-based score fusion (DBSF)
rescales each list using its average score and how spread out the scores
are, then adds them. Like the weighted sum, it keeps the size of a lead. It
has no knob to tune.

The tradeoff is the same for 2 and 3. Keeping the gaps helps when a big lead
means something. It hurts when one odd score is just noise, because now
that noise moves the result.

## Does it actually help?

Qdrant ran the comparison in 2026 on five public datasets, with a small
open embedding model (all-MiniLM-L6-v2), BM25 and default RRF, scoring the
top 10 results with nDCG@10:

![Grouped bar chart of nDCG@10 on five public datasets for keyword search only, vector search only and hybrid search with reciprocal rank fusion. Hybrid scores highest on four: SciFact 0.718 (best single 0.689), ArguAna 0.522 (0.491), WANDS 0.725 (0.710) and CodeSearchNet 0.656 (0.630). On DBPedia-entity, vector only scores 0.468 and hybrid 0.464, slightly lower.](img/hybrid-search-results.svg)

Three things stand out.

- **Neither search is always better.** Keyword search won on two datasets
  (SciFact, WANDS), vector search on the other three.
- **Hybrid beat the better of the two on four of five,** by 0.016 to 0.031.
  That's modest, but each gain held up statistically.
- **It lost once.** On DBPedia-entity, hybrid scored 0.4638 against 0.4677
  for vector search alone.

The price was small in their setup: the second search added 0.6 to 1.5 ms
of median latency. It also needs a second index, and in Qdrant, adding it to
an existing collection means a full reindex.

On the merge method, the numbers are less settled. In the same study, DBSF
beat default RRF on three of the five datasets, with the other two too
close to call. A 2023 study on MS MARCO and eight BEIR datasets found a
tuned weighted sum beat RRF on every dataset, and that $$\alpha$$ could be
tuned with a handful of labeled queries. Weaviate switched its default from
rank fusion to score fusion in v1.24, citing an internal benchmark on one
dataset (FiQA) with about 6% better recall.

## Where it gets tricky

**Hybrid isn't automatically better.** It usually wins, but DBPedia-entity
shows it can lose, and you can't tell from the queries alone. A workload of
natural-language questions might already be covered by vector search.
Measure on your own data.

**RRF or weighted sum? It depends on whether you have labels.** The two
camps look like they disagree, but they're answering different questions.
With no labeled queries, RRF's default works well out of the box and can't
be thrown off by weird scores. With labeled queries, a tuned weighted sum
usually wins, and RRF's own knob turns out to matter more than people
assumed. A tuned RRF also carries over poorly to a new domain. So "start
with RRF, then compare against score fusion on your labels" and "weighted
sum beats RRF" are both right.

**On Postgres, the keyword half may not be BM25.** The built-in text
ranking, `ts_rank`, is easy to reach for on the keyword side. It has no IDF, no
saturation and no length normalization, so a long page that repeats a
common word can beat the page you want. Its `@@` match also requires every
query word, so a great page missing one word never makes the list. For real
BM25 in Postgres, next to [[pgvector]], you need an extension like
pg_textsearch or ParadeDB's pg_search.

**The line between keyword and vector search is blurring.** Learned sparse
models like SPLADE add related words a document never used, so the
"keyword" side starts catching synonyms. That moves it closer to what the
vector side already covers. Start with BM25 anyway: it needs no model at
query time, and a learned model has to beat it on your data to earn its
place.

**Fusion can't rescue a missed document.** If both searches miss it, it's
gone. Raising the number of candidates per list helps only if one of the
searches has it somewhere deeper.

## What this means when you build

- Start with BM25 plus vector search, merged with RRF at its default, and
  about 100 candidates from each side.
- Build a small set of labeled queries first (see
  [[retrieval-evaluation]]). Score keyword only, vector only and hybrid on
  it, with nDCG@10 or [[recall-at-k]]. Keep hybrid only if it wins.
- With labels in hand, try a weighted sum or DBSF against RRF. Check the
  winner on queries you didn't tune on.
- On Postgres, check whether your keyword side is BM25 or `ts_rank`.
- The next step after a good hybrid ranking is [[reranking]].

## Further reading

- [Hybrid Search in Qdrant](https://qdrant.tech/documentation/search-tuning/hybrid-search/),
  Dylan Couzon (Qdrant), 2026. Why each search misses different things,
  with the product-search examples, the score-scale problem and what the
  second search costs.
- [How to Tune Hybrid Search in Qdrant](https://qdrant.tech/documentation/search-tuning/how-to-tune-hybrid-search/),
  Dylan Couzon (Qdrant), 2026. The five-dataset comparison of keyword,
  vector, RRF and DBSF, with careful statistics.
- [An Analysis of Fusion Functions for Hybrid Retrieval](https://arxiv.org/abs/2210.11934),
  Sebastian Bruch, Siyu Gai and Amir Ingber, 2023. The research case for a
  tuned weighted sum over RRF, and how few labels it takes.
- [Hybrid search revisited: introducing the linear retriever](https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search),
  Panagiotis Bailis (Elastic), 2025. The worked example where RRF misses a
  huge BM25 lead, and min-max normalization.
- [Hybrid Search - A Deep Dive into Weaviate's Fusion Algorithms](https://weaviate.io/blog/hybrid-search-fusion-algorithms),
  Dirk Kulawiak and JP Hwang (Weaviate), 2023. Rank fusion vs score fusion
  side by side, and why Weaviate changed its default.
- [Introducing pg_textsearch: True BM25 Ranking and Hybrid Retrieval Inside Postgres](https://www.tigerdata.com/blog/introducing-pg_textsearch-true-bm25-ranking-hybrid-retrieval-postgres),
  Todd J. Green and Matvey Arye (Tiger Data), 2025. Why Postgres's built-in
  ranking isn't BM25, and how to get BM25 next to pgvector.
