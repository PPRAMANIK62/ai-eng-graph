---
id: recall-at-k
title: What is recall@k?
depth: short
phase: 2
note: >-
  Of the chunks that should come back, how many are in the top k.
needs: [retrieval-evaluation]
leads_to: []
compare_with: [mrr]
updated: 2026-09-27
---

# What is recall@k?

Recall@k is the share of the relevant chunks for a question that show up
in the top k search results. In a RAG system, the top k is usually exactly
what goes into the prompt, so recall@k answers the question you care about
most: did the model get to see the text it needed?

## Counting what came back

Recall itself is an old idea from search: the fraction of the relevant
documents that the system actually retrieved. Recall@k applies it to a
ranked list cut off at position k. You need labels first, meaning for each
test question a list of which chunks are relevant (how to get those is in
[[retrieval-evaluation]]).

For one question:

$$
\text{recall@}k = \frac{\text{relevant chunks in the top } k}{\text{all relevant chunks for the question}}
$$

Then you average it over all your test questions.

Here's a worked example. Say search returns 8 chunks for a question, and
your labels say the chunks at ranks 2, 4, 5 and 7 are the relevant ones.
That's 4 relevant chunks in total.

| k | Relevant in top k | recall@k |
|---|---|---|
| 1 | 0 | 0/4 = 0.00 |
| 2 | 1 | 1/4 = 0.25 |
| 3 | 1 | 1/4 = 0.25 |
| 4 | 2 | 2/4 = 0.50 |
| 5 | 3 | 3/4 = 0.75 |
| 6 | 3 | 3/4 = 0.75 |
| 7 | 4 | 4/4 = 1.00 |
| 8 | 4 | 4/4 = 1.00 |

![A step chart of recall at k for one question with 8 results, where the relevant chunks sit at ranks 2, 4, 5 and 7. Recall is 0 at k = 1, 0.25 at k = 2 and 3, 0.5 at k = 4, 0.75 at k = 5 and 6, and 1 from k = 7. It steps up at each relevant chunk and never goes down.](img/recall-at-k-steps.svg)

Two things show up straight away. Recall can only go up as k grows, since
a bigger k only adds results. And it goes up in steps, one step per
relevant chunk.

In RAG, many questions have exactly one relevant chunk. Then recall@k for
that question is simply 1 if the chunk is in the top k and 0 if it isn't,
and the average over questions is the share of questions where search
found the answer.

## Recall vs precision

Recall has a partner, **precision@k**: the share of the top k that's
relevant. Recall asks "did we find everything?", precision asks "how much
of what we sent is noise?" In the table, at k = 8 recall is 1.00 but
precision is 4/8 = 0.50.

They pull against each other. Return more results and recall rises, while
precision usually falls. Which one matters more depends on who's reading.
A person scanning a page of web results wants the first few to be good. A
paralegal wants nothing missed and will put up with plenty of junk to get
there. A RAG pipeline is closer to the paralegal: the model can skip an
irrelevant chunk, but it can't use one that never arrived.

## Where it gets tricky

**You can always get a perfect score.** Set k to the size of your
collection and recall is 1.00, since you returned everything. The score
only means something at a fixed, realistic k. Use the k your system
actually sends to the model, and compare systems at the same k.

**It ignores order.** With one relevant chunk and k = 4, finding it at
rank 1 or at rank 4 scores the same. If order matters to you, pair recall
with [[mrr]], which rewards finding the first right chunk early.

**It needs to know all the relevant chunks.** The bottom of the fraction is
"all relevant chunks", and your labels rarely list every one. Say search
returns a chunk that answers the question just as well as the labelled
one, and the labelled one falls out of the top k. That question scores 0,
though the model had what it needed. Precision@k has the advantage of not
needing to know how many relevant chunks exist, since it only looks at
what came back. When recall drops, read a few of the misses before
trusting the number.

**Questions with nothing relevant break it.** If no chunk is relevant, the
bottom of the fraction is 0 and recall is undefined. Keep those questions
out of the average and test them separately.

## What this means when you build

- Report recall at the k you put in the prompt. If that's 10, it's
  recall@10.
- Report k next to the number, always. "Recall 0.9" means nothing on its
  own.
- When you raise k to push recall up, look at precision too, and at what
  the extra chunks cost you in tokens.
- Recall@k is the headline number for RAG retrieval. Add MRR when you care
  whether the right chunk comes first.

## Further reading

- [Evaluation in information retrieval](https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-in-information-retrieval-1.html),
  Manning, Raghavan and Schütze, Introduction to Information Retrieval,
  2008. The textbook definitions of recall and precision, the tradeoff
  between them, and why recall of 1 is always within reach.
- [Evaluation Measures in Information Retrieval](https://www.pinecone.io/learn/offline-evaluation/),
  Laura Carnevali (Pinecone), 2023. Recall@K with Python code and the
  worked example above, next to MRR, MAP and NDCG.
