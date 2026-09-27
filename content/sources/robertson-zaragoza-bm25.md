---
id: robertson-zaragoza-bm25
title: "The Probabilistic Relevance Framework: BM25 and Beyond"
author: Stephen Robertson, Hugo Zaragoza
url: https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf
published: 2009              # Foundations and Trends in Information Retrieval 3(4), 333–389, DOI 10.1561/1500000019
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

The reference text on BM25, written by one of its authors. It builds the formula from the probabilistic model of relevance: a rarity weight for each query term (close to classic IDF), a term-frequency part that saturates instead of growing forever, and a soft correction for document length. It also gives the usual parameter ranges and says the model gives no guidance on setting them. Opened on 2026-09-27 by downloading the author's PDF and extracting its text (the WebFetch tool had returned binary for it earlier).

## Key claims

- BM25 comes out of 1970s–80s probabilistic retrieval work and is among the most successful text-retrieval algorithms. "grounded in work done in the 1970–1980s, which led to the development of one of the most successful text-retrieval algorithms, BM25." (Abstract)
- Documents are treated as a bag of words: which terms appear and how often, not their order. "For documents and queries, we generally assume a bag or set of words model." (2.4 Some Notation, p. 339)
- With no relevance information, the term weight becomes close to classic IDF: w = log((N − n + 0.5) / (n + 0.5)), where N is the number of documents and n the number containing the term. "The resulting formula is a close approximation to classical idf" (3.1, Eq. 3.3, p. 349)
- Saturation: one term's contribution has a ceiling no matter how often it appears. "any one term's contribution to the document score cannot exceed a saturation point (the asymptotic limit), however, frequently it occurs in the document." (3.4.2, p. 356)
- Saturating tf has been shown to beat traditional tf*idf, which is linear in tf. "the non-linear, saturating function of tf developed below (also combined with an idf component) has frequently been shown to work better than traditional tf *idf ." (3.4.3, p. 356)
- The saturation curve is the simple tf / (k + tf). Low k saturates fast. "for low k, the additional contribution of a newly observed occurrence tails off very rapidly." (3.4.4, Eq. 3.10, Fig. 3.3, pp. 357–358)
- Length normalisation is soft, relative to the average document length, via B = (1 − b) + b·dl/avdl. "setting b = 1 will perform full document-length normalisation, while b = 0 will switch normalisation off." (3.4.5, Eq. 3.12, p. 359)
- Why soft: longer documents can be wordy (verbosity) or cover more ground (scope), so neither full nor no normalisation is right. "each hypothesis represents some partial explanation for the observed variation. This in turn suggests that we should apply some kind of soft normalisation." (3.4.5, p. 359)
- The full formula: weight = tf / (k1((1 − b) + b·dl/avdl) + tf) × w_RSJ, summed over the query terms. "This is the classic BM25 term-weighting and document-scoring function." (3.4.5, Eq. 3.15, p. 360)
- The document score is the sum of these weights over query terms. "the full document score is obtained by summing these term-weights over the (original or expanded) set of query terms." (p. 360)
- BM25 looks like tf*idf, except that its tf part saturates. "In this case, the BM25 weight looks very much like a traditional tf ∗idf weight" and "However, there is one significant difference. The tf component involves the saturation function discussed" (3.5, p. 360)
- Parameters: no theory for setting them; typical good ranges from experiments. "the model provides no guidance on how these should be set." and "values such as 0.5 < b < 0.8 and 1.2 < k1 < 2 are reasonably good in many circumstances." (3.5, pp. 360–361)
- Best values depend on the data. "there is also evidence that optimal values do depend on other factors (such as the type of documents or queries)." (3.5, p. 361)
- Versions vary. "Published versions of BM25 can vary somewhat" (3.5.1)
- The original BM25 is reference [46]: S. E. Robertson and S. Walker, "Some Simple Effective Approximations to the 2-Poisson Model for Probabilistic Weighted Retrieval," SIGIR 1994. "the original BM25 [46] was a little more complicated than that of Equation (3.15)" (3.5.1 and References). So Robertson co-wrote the original.
- The common (k1 + 1) in the numerator doesn't change rankings. "This is the same for all terms, and therefore does not affect the ranking produced." (3.5.1)
- Adding related words (query expansion) introduces synonyms on purpose, since plain term matching doesn't find them. "we are likely to introduce synonyms or closely related words (indeed, this is why we do query expansion in the first place)." (3.2, p. 351)

## Visuals worth redrawing

- Fig. 3.3 (p. 358): saturation curves tf/(k + tf) for k = 0.2, 1, 3, and the same with length normalisation for short, average and long documents. Redraw with our own numbers.

## My notes

- The formula as printed has no (k1 + 1) in the numerator; Lucene/Elastic-style versions add it. Same ranking either way.
- The IDF in Eq. 3.3 goes negative for terms in more than half the documents (arithmetic, not stated as a problem in the text). Engines use variants; I haven't verified which.
- Lucene in 2009 did not implement BM25 (3.9). That's history now; don't use it as a current fact.
