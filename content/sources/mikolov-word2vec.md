---
id: mikolov-word2vec
title: Efficient Estimation of Word Representations in Vector Space
author: Tomas Mikolov, Kai Chen, Greg Corrado, Jeffrey Dean (Google)
url: https://arxiv.org/abs/1301.3781
published: 2013-01-16          # v1; v3 revised 2013-09-07
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The word2vec paper. It proposes two cheap model designs (CBOW and Skip-gram) that learn a vector for every word from a large pile of text, and shows the vectors capture relationships: you can do arithmetic like "biggest − big + small" and land near "smallest", or "Paris − France + Italy" and land near "Rome". It made "similar meanings sit close together" practical at scale.

## Key claims

- What it does: learn continuous word vectors from very large text. "We propose two novel model architectures for computing continuous vector representations of words from very large data sets." (Abstract)
- It was cheap: under a day for 1.6 billion words. "it takes less than a day to learn high quality word vectors from a 1.6 billion words data set." (Abstract)
- The goal: similar words close, and more than one kind of similarity. "not only will similar words tend to be close to each other, but that words can have multiple degrees of similarity" (1.1 Goals of the Paper)
- The famous example, reported from earlier work: King − Man + Woman lands nearest Queen. "vector(”King”) - vector(”Man”) + vector(”Woman”) results in a vector that is closest to the vector representation of the word Queen" (1.1 Goals of the Paper)
- How analogy questions are answered: compute X = vector("biggest") − vector("big") + vector("small"), then find the closest word by cosine distance. "we search in the vector space for the word closest to X measured by cosine distance" (4 Results)
- Relationships beyond grammar, like city and country. "France is to Paris as Germany is to Berlin." (4 Results)
- More examples from their best vectors (Skip-gram, 300 dimensions, 783M words): Paris − France + Italy = Rome; and pairs like copper→Cu, zinc→Zn; Japan→sushi, Germany→bratwurst. (5, Table 8, no quotable sentence)
- The analogies are far from perfect: Table 8 would score about 60% with exact matching, and it shows mistakes like "small: larger". "the results in Table 8 would score only about 60%" (5 Examples of the Learned Relationships)
- Training data: a Google News corpus of about 6 billion tokens, vocabulary cut to the 1 million most frequent words. "This corpus contains about 6B tokens." (4.2 Maximization of Accuracy)
- Quality depends on both vector size and data size. "we have to increase both vector dimensionality and the amount of the training data together." (4.2)

## Visuals worth redrawing

- Not a figure in the paper, but the classic picture follows from Table 8: arrows from France→Paris and Italy→Rome running parallel in a 2D projection. Draw as our own illustration, clearly labelled as a sketch.

## My notes

- 2013 and static: one vector per word, no context. It's the ancestor of the idea, not how LLM embeddings or embedding APIs work today.
- The King/Queen result is cited from the authors' earlier paper [20], not first shown here. 3Blue1Brown (`3blue1brown-transformers-gpt`) notes the Queen example only "kind of" works in the model he tried.
- Abstract read on arXiv; full text read from the arXiv PDF (pdftotext), so quotes with straight vs curly quote marks may differ from the typeset PDF.
