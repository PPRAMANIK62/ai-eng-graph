---
id: cormack-reciprocal-rank-fusion
title: Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods
author: Gordon V. Cormack, Charles L. A. Clarke, Stefan Büttcher
url: https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf
published: 2009-07            # SIGIR '09, Boston; DOI 10.1145/1571941.1572114
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The two-page SIGIR paper that introduced reciprocal rank fusion. Each document gets 1/(k + rank) from every ranked list it appears in, and the sums are sorted. It uses only ranks, not scores. With k = 60 it beat the best single system and the standard fusion method (Condorcet) in TREC experiments, and k mattered little in their pilot. Opened on 2026-09-27 by downloading the author's PDF and extracting its text (WebFetch had returned binary for it earlier).

## Key claims

- The formula: RRFscore(d) = Σ over rankings r of 1/(k + r(d)). "RRF simply sorts the documents according to a naive scoring formula." (§1)
- k = 60 was picked in a pilot and never changed. "where k = 60 was fixed during a pilot investigation and not altered during subsequent validation." (§1)
- Why this shape: top ranks count more, but low ranks still count. "while highly-ranked documents are more important, the importance of lower-ranked documents does not vanish as it would were, say, an exponential function used." (§1)
- What k does. "The constant k mitigates the impact of high rankings by outlier systems." (§1)
- k wasn't critical in their pilot. "indicated that k = 60 was near-optimal, but that the choice was not critical." (§1) Table 1 MAP by k: 0 → .2072, 10 → .2123, 20 → .2134, 30 → .2139, 40 → .2138, 50 → .2144, 60 → .2145, 70 → .2146, 80 → .2147, 90 → .2145, 100 → .2142, 500 → .2098; best single system .2016. (Table 1, 30 systems, TREC topics 351–400)
- It usually beats every input system. "RRF, when used to combine the results of IR methods (including learning to rank), almost invariably improved on the best of the combined results." (§1)
- Size of the gain. "RRF outperforms Condorcet, CombMNZ and the best system by 4% to 5% on average." (§1)
- Exception: TREC 9, where the best run used a human in the loop (MAP .3519 vs RRF .2830). (Table 2)
- It ignores the raw scores, which live on arbitrary scales. "it combines ranks without regard to the arbitrary scores returned by particular ranking methods" (§2)
- No training or global information needed. "RRF requires no special voting algorithm or global information; ranks may be computed and summed one system at a time" (§2)
- Why it works: a document that one or two systems rank highly gets lifted. "One or two systems that rank a document highly can substantially improve its rank relative to the more popular documents." (§2)
- Unsupervised: "unsupervised methods are attractive because they require no training examples." (§1)

## Visuals worth redrawing

- Table 1 as a line: MAP against k from 0 to 500. Flat between about 20 and 100.

## My notes

- Their experiments fuse many runs (30 systems, TREC submissions, LETOR learners), not the two-list keyword + vector case of modern hybrid search. The "k doesn't matter much" finding comes from that setting.
- Ranks are one-based here (a permutation on 1..|D|).
