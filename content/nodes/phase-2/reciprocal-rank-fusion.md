---
id: reciprocal-rank-fusion
title: What is reciprocal rank fusion?
depth: short
phase: 2
note: >-
  A simple formula that merges ranked lists using only positions, not scores.
needs: [hybrid-search]
leads_to: []
compare_with: []
updated: 2026-09-27
---

# What is reciprocal rank fusion?

Reciprocal rank fusion (RRF) merges several ranked lists into one using
only each document's position, never its score. In [[hybrid-search]], it's
how you merge a keyword list and a vector list without any tuning, and
without caring that the two searches score on different scales.

## The formula

Every list gives each document it contains a few points: one over a
constant $$k$$ plus the document's rank in that list. Add up the points
across lists and sort.

$$
\text{RRF}(d) = \sum_{\text{lists } r} \frac{1}{k + \text{rank}_r(d)}
$$

Ranks start at 1. A document missing from a list gets nothing from it. The
original paper, from 2009, fixed $$k = 60$$ in a pilot and never changed
it.

## A worked example

Say the keyword search returns A, B, C, D and the vector search returns F,
A, B, C. At $$k = 60$$:

- A is 1st and 2nd: $$\frac{1}{61} + \frac{1}{62} = 0.0325$$
- B is 2nd and 3rd: $$\frac{1}{62} + \frac{1}{63} = 0.0320$$
- C is 3rd and 4th: $$\frac{1}{63} + \frac{1}{64} = 0.0315$$
- F is 1st in one list only: $$\frac{1}{61} = 0.0164$$
- D is 4th in one list only: $$\frac{1}{64} = 0.0156$$

Documents that both searches found come first. F topped the vector list,
but because the keyword search didn't find it at all, it ends up fourth.

![Two ranked lists merged with reciprocal rank fusion. Keyword list: A, B, C, D. Vector list: F, A, B, C. With k = 60 the fused order is A 0.0325, B 0.0320, C 0.0315, F 0.0164, D 0.0156: documents found by both lists come first, and F, top of the vector list only, drops to fourth. With k = 1 the order is A 0.833, B 0.583, F 0.500, C 0.450, D 0.200: F now beats C.](img/reciprocal-rank-fusion-worked-example.svg)

## Why ranks instead of scores

The scores from different searches live on their own, arbitrary scales. A
BM25 score and a cosine similarity can't be added in any meaningful way.
Ranks are always comparable: first is first.

That gives RRF some nice properties. It needs no training data and no
statistics about the whole collection. You can compute it one list at a
time. And a document that one or two lists rank highly gets a real boost,
even if others don't rank it at all.

The price is that it ignores how big a lead was. Rank 1 gets the same
points whether it beat rank 2 by a mile or by a hair.

## What k does

$$k$$ controls how much the top of a list outweighs the rest. Compare the
points for rank 1 and rank 10:

- At $$k = 60$$: $$\frac{1}{61}$$ vs $$\frac{1}{70}$$, so rank 1 is worth
  only 1.15 times rank 10. Being in the list at all matters almost as much
  as where.
- At $$k = 1$$: $$\frac{1}{2}$$ vs $$\frac{1}{11}$$, so rank 1 is worth 5.5
  times rank 10. The top few places dominate.

You can see this in the example. At $$k = 1$$, F's single first place
(0.500) now beats C's two middling places (0.450). Low $$k$$ trusts a
strong opinion from one list. High $$k$$ rewards agreement between lists.

## Where it gets tricky

**Is 60 right?** In the original experiments, which fused 30 search systems
on TREC data, the choice hardly mattered. Anything from about 20 to 100
scored within a whisker of the best, and every value beat the best single
system.

![Line chart from Cormack et al. (2009): retrieval quality (MAP) of reciprocal rank fusion over 30 search systems as k goes from 0 to 100. It rises from 0.2072 at k = 0 to about 0.214 by k = 30 and stays nearly flat through k = 100, peaking at 0.2147 at k = 80; at k = 60 it is 0.2145. At k = 500 it drops to 0.2098. Every value is above the best single system, 0.2016.](img/reciprocal-rank-fusion-k-sweep.svg)

Modern hybrid search fuses just two lists, and there $$k$$ matters more.
Qdrant tested it in 2026 on five public datasets. The best $$k$$ ranged
from about 1 to 60, and it tracked one thing: how many relevant documents
each query has. With about one right answer per query, small $$k$$ won.
With tens or hundreds, large $$k$$ won. On one dataset (WANDS),
switching from a small $$k$$ to 60 changed the top result for 42% of
queries.

**Not every engine means the same k.** Some count positions from 0 instead
of 1. Qdrant does, and its default $$k = 2$$ is the same as $$k = 1$$ in the
formula above. To match the paper's 60 there, you set 61. Check the docs
before copying a number from one system to another.

**Ties.** At low $$k$$, different documents end up with the same score
more often. On one dataset, 12.5% of the top-10 results at Qdrant's default
tied with a neighbor, against 2.8% at 61. Qdrant then returns tied
documents in whatever order storage gives, so the same query can come back
in a different order.

**Throwing away scores has a cost.** When one search is very sure about a
document, RRF can't tell. Methods that normalize the scores and keep the
gaps can beat it: in the same 2026 tests, one did on three of five
datasets. That comparison is
in [[hybrid-search]].

## What this means when you build

- Start with the paper's $$k = 60$$ in the 1-based formula.
- If you have labeled queries, try a few values (Qdrant's sweep used 1, 2,
  5, 20 and 61 in its own convention). Fewer right answers per query points
  toward a smaller $$k$$.
- Break ties yourself: sort by score, then by document ID.
- If your engine lets you weight each list, settle $$k$$ first, then try
  weights.

## Further reading

- [Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods](https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf),
  Gordon Cormack, Charles Clarke and Stefan Büttcher, SIGIR 2009. The
  original two-page paper: the formula, why $$k = 60$$, and the $$k$$ sweep.
- [How to Tune Hybrid Search in Qdrant](https://qdrant.tech/documentation/search-tuning/how-to-tune-hybrid-search/),
  Dylan Couzon (Qdrant), 2026. How $$k$$ and list weights behave on five
  modern datasets, the zero-based convention, and ties.
