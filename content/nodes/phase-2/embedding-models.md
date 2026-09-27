---
id: embedding-models
title: How do you choose an embedding model?
depth: short
phase: 2
note: >-
  Choosing an embedding model: size, dimensions, cost, and a benchmark score vs a test on your own data.
needs: [embeddings]
leads_to: [semantic-search]
compare_with: []
updated: 2026-09-27
---

# How do you choose an embedding model?

An embedding model turns a piece of text into one vector, the kind of
[[embeddings|embedding]] you store and search. Every vector in your index
comes from the model you pick, so switching later means embedding
everything again. The choice is a trade between quality, vector size and
price, and the published leaderboard score is only a starting point.

## What's on the menu

Here's OpenAI's own lineup, as listed in its docs on 2026-09-27. The
quality column is the average score on MTEB, a public benchmark for
embedding models. "Pages per dollar" assumes about 800
tokens a page.

| Model | Numbers per vector | Pages per dollar | MTEB score | Max input |
|---|---|---|---|---|
| `text-embedding-3-small` | 1,536 | 62,500 | 62.3% | 8,192 tokens |
| `text-embedding-3-large` | 3,072 | 9,615 | 64.6% | 8,192 tokens |
| `text-embedding-ada-002` (older) | | 12,500 | 61.0% | 8,192 tokens |

Read it as a set of trades:

- **Price.** The large model costs about 6.5 times as much per page as the
  small one, for 2.3 points on the benchmark.
- **Size.** It also returns twice as many numbers per text. Bigger vectors
  cost more to store and to search, and that cost repeats for every chunk
  you index.
- **Max input.** Anything longer than 8,192 tokens has to be split before
  it can be embedded at all. In practice you split much smaller than that,
  for search quality reasons covered in [[chunking]].

Whatever vendor you look at, compare the same columns: vector size,
price, input limit and a benchmark score.

## Vector size is a knob, not a fixed fact

Some models let you ask for shorter vectors. For OpenAI's
`text-embedding-3` models, the `dimensions` parameter cuts numbers off the
end of the vector, and the model was trained so that what's left still
works. You give up a little accuracy for a smaller vector. If your
vector store only accepts 1,024 numbers, you can still use the large
model and ask for 1,024 instead of 3,072.

The loss can be small. On MTEB, the large model cut down to 256 numbers
still beats the older `text-embedding-ada-002` at its full 1,536. So
"large model, short vectors" can beat "small model, full vectors". Only a
test on your data tells you which.

## The benchmark score and your data can disagree

MTEB averages a model's results over many public tasks. That's useful for
a shortlist, and misleading as a final answer, for three reasons:

- The benchmark data is generic. Your documents are about one product or
  one field.
- It's clean. Real user questions are vague and messy.
- Models may have seen it. Benchmark datasets are public, so they may be
  in a model's training data, and a high score can partly be memory.

A 2025 study from Chroma and Weights & Biases shows what that looks like.
They took real questions users had asked W&B's documentation chatbot in
2023, hand-checked 693 of the 2,003, and measured how often each model
put the right document in its top 10 results (its [[recall-at-k|recall@10]]).

![Bar chart of recall@10 on real questions to the Weights & Biases docs chatbot: voyage-3-large 0.670, text-embedding-3-large 0.552, jina-embeddings-v3 0.511, text-embedding-3-small 0.439. A note marks that jina-embeddings-v3 beats text-embedding-3-large on every MTEB English task, yet ranks below it here.](img/embedding-models-benchmark-vs-real.svg)

Two things stand out. First, the order changed: `jina-embeddings-v3`
beats `text-embedding-3-large` on every MTEB English task, and loses to
it on these real questions. Second, the spread is wide. On this data
the best model found the right document in the top 10 for 67% of
questions and the weakest for 44%. That's a much bigger difference than
the 2.3 MTEB points between OpenAI's small and large models would
suggest, though the two numbers measure different things.

## Testing on your own data

The same study describes a cheap way to build a test set:

1. Take your own documents and drop the ones nobody would ask about.
2. Have an LLM write questions for each remaining document. Give it a
   few real user questions as examples, so the generated ones sound like
   your users and not like a textbook.
3. You now know which document each question should find. Embed
   everything with each candidate model and measure recall@10.

In their test, generated questions put the four models in the same order
as the real questions did. That's the point: the test only has to rank
the candidates correctly, not predict the exact score. Measuring
retrieval this way is covered in [[retrieval-evaluation]].

## Where it gets tricky

**The numbers age fast.** Everything above is from the 2024–2025
generation of models. Treat any table like it as a snapshot and re-check
what's current before you pick.

**One study, one dataset.** The W&B test is technical documentation for
one company. It shows the ranking *can* flip, not which model wins for
you. The study also comes from Chroma, which sells a vector database.

**Switching is expensive.** Vectors from two models can't be compared, so
a new model means re-embedding every document. Pick with a test, not on a
whim, and write down why.

## What this means when you build

- Shortlist two or three models by benchmark score, price and vector size.
- Build a small test set from your own documents, with some real
  questions if you have them, and pick by recall on that.
- Try the shortened vectors of a bigger model before settling for the
  full vectors of a smaller one.
- Record the choice and the scores, so the next person can re-run the
  test when a new model comes out. The chosen model then drives
  [[semantic-search]].

## Further reading

- [Vector embeddings](https://developers.openai.com/api/docs/guides/embeddings),
  OpenAI docs. One vendor's lineup with prices, vector sizes and MTEB
  scores, and how shortening vectors works.
- [Generative Benchmarking](https://www.trychroma.com/research/generative-benchmarking),
  Hong, Troynikov, Huber (Chroma) and McGuire (W&B), 2025. Why public
  benchmarks mislead, real-query results for four models, and a method
  for building a test set from your own documents.
