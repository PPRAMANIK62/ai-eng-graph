---
id: mrr
title: What is MRR?
depth: short
phase: 2
note: >-
  Mean reciprocal rank: how high the first right result ranks, on average.
needs: [retrieval-evaluation]
leads_to: []
compare_with: [recall-at-k]
updated: 2026-09-27
---

# What is MRR?

MRR, mean reciprocal rank, scores a search system by where the first right
result lands. First place scores 1, second place 1/2, third 1/3, and so on,
averaged over your test questions. It's the number to watch when what
matters is getting one good result to the top.

## One question, one number

For each test question, look down the ranked results until you hit the
first one your labels mark as relevant (labels are covered in
[[retrieval-evaluation]]). Its position is the rank. The question's score
is one over that rank, the **reciprocal rank**. If nothing relevant came
back, the score is 0.

Then average over all questions. For a set of questions $$Q$$, where
$$\text{rank}_i$$ is the position of the first relevant result for
question $$i$$:

$$
\text{MRR} = \frac{1}{|Q|} \sum_{i=1}^{|Q|} \frac{1}{\text{rank}_i}
$$

A worked example with three questions:

| Question | First relevant result at | Reciprocal rank |
|---|---|---|
| 1 | rank 2 | 1/2 = 0.50 |
| 2 | rank 1 | 1/1 = 1.00 |
| 3 | rank 5 | 1/5 = 0.20 |
| **MRR** | | (0.50 + 1.00 + 0.20) / 3 = **0.57** |

![A bar chart of the score a question gets by the rank of its first relevant result: 1 at rank 1, 0.5 at rank 2, 0.33 at rank 3, 0.25 at rank 4, 0.2 at rank 5, and 0 if nothing relevant is in the top 5. Half the score is gone by rank 2.](img/mrr-reciprocal.svg)

The shape of that curve is the point of the metric. Moving the right result
from rank 2 to rank 1 adds 0.5. Moving it from rank 5 to rank 4 adds 0.05.
MRR cares a lot about the very top and hardly at all about the rest.

## Where it came from

MRR was the official score of the first large question answering
evaluation, the TREC-8 QA track, run by NIST (the report came out in
2000). Systems got 200 fact
questions and returned five ranked answer snippets for each, and people
judged each snippet right or wrong. The best run scored an MRR of 0.66.

The report gave the reasons for the choice. The score sits between 0 and 1
and averages well across questions. A system loses points for a miss, but
not a crushing amount. It also listed the drawbacks, which still hold:

- **Only a few possible scores.** With five answers allowed, a question can
  only score 0, 0.2, 0.25, 0.33, 0.5 or 1.
- **Only the first right answer counts.** Finding three good answers scores
  the same as finding one.
- **No credit for "I don't know".** Every question had to get answers, so a
  system that could tell it had nothing gained nothing for saying so.

## MRR vs recall@k

[[recall-at-k|Recall@k]] asks whether the relevant chunks made it into the
top k at all. It ignores order: rank 1 and rank k score the same. MRR asks
how high the first one is. It ignores everything after that first hit.

That makes MRR a good fit when one result is enough and it needs to be at
the top: a chatbot answering from a single passage, a question answering
system, or checking whether a reranker puts the best chunk first. It's a
poor fit when you need several relevant results, like a list of product
recommendations, because one hit at rank 1 scores a perfect 1 however bad
the rest of the list is. It's also harder to explain than recall: "0.57"
isn't a share of anything.

In a RAG pipeline where all k chunks go into the prompt, recall@k is
usually the main number, since the model reads the whole top k. MRR is a
useful second number that tells you how often the answer is right at the
top.

## What this means when you build

- Report MRR with a cutoff, like MRR@10: results below rank 10 count as 0.
- Use it next to recall@k, not instead of it.
- If your questions often have several relevant chunks and you need them
  all, MRR will look better than your search really is. Lean on recall@k.

## Further reading

- [The TREC-8 Question Answering Track Report](https://trec.nist.gov/pubs/trec8/papers/qa_report.pdf),
  Ellen Voorhees (NIST), 2000. Where MRR was defined for QA, why it was
  chosen, and its drawbacks. The PDF is scanned, with no text layer.
- [Evaluation Measures in Information Retrieval](https://www.pinecone.io/learn/offline-evaluation/),
  Laura Carnevali (Pinecone), 2023. MRR with Python code and the worked
  example above, and when it's the wrong metric.
