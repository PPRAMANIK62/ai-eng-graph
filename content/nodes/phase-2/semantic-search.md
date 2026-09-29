---
id: semantic-search
title: What is semantic search?
depth: deep
phase: 2
note: >-
  Search by meaning: embed the query, find the nearest chunks.
needs: [cosine-similarity, embedding-models]
leads_to: [vector-index, hybrid-search, chunking, rag, semantic-caching]
compare_with: [bm25]
updated: 2026-09-27
---

# What is semantic search?

Semantic search finds text by meaning instead of by matching words. You
turn every document and every question into an embedding, then return the
documents whose vectors sit closest to the question's. It's the usual
retrieval step in a RAG system, and the first thing to get right when you
want an LLM to answer from your own content.

## Nine sentences and a question

Start small. Here's a corpus of nine sentences: three about machine
learning, three about space, three about climate. And one question: "How
do artificial neural networks work?"

Embed all nine sentences with a small open model (`all-MiniLM-L6-v2`,
which returns 384 numbers per text). Embed the question with the same
model. Score the question against each sentence with
[[cosine-similarity]], and sort.

This example comes from the Sentence Transformers docs, which print the
top five scores. We ran it on 2026-09-27 with Transformers.js and got the
same five to four decimal places, plus the other four:

![Bar chart of cosine scores for the question 'How do artificial neural networks work?' against nine sentences. The three machine-learning sentences score highest: neural networks 0.593, deep learning 0.529, machine learning 0.465. The six space and climate sentences all score between 0.02 and 0.14.](img/semantic-search-scores.svg)

The sentence about neural networks comes first, which is no surprise, since
it shares the words. But "deep learning" comes second, and the question
never says "deep" or "learning". The machine-learning sentence is third.
Then there's a clear drop to everything about Mars, telescopes and carbon
capture.

That's semantic search. Return the top few, and you have the text an LLM
needs to answer the question.

## Two phases: index once, search many times

The work splits in two.

**Index time**, once per document:

1. Cut documents into pieces small enough to embed well. This is
   [[chunking]].
2. Embed each chunk.
3. Store the vectors next to the chunk text.

**Query time**, on every question:

1. Embed the question with the **same** model.
2. Score it against the stored vectors.
3. Sort, and keep the top k.

![Two rows. Index time: documents are cut into chunks, each chunk goes through the embedding model, and the vectors are stored. Query time: the question goes through the same embedding model, its vector is scored against every stored vector with cosine similarity, and the top k chunks come back.](img/semantic-search-pipeline.svg)

The "same model" rule is not optional. Each [[embedding-models|embedding
model]] builds its own space, and a query vector from one model can't be
compared with document vectors from another.

The chunk embeddings are made once, at index time. Each question then
costs one embedding call plus the comparison.

## What searching by meaning buys you

Keyword search can only find documents that contain the words you typed.
Semantic search can also handle synonyms, abbreviations and misspellings,
because similar meanings land close together even when the letters don't
match.

We tried two extra questions in the same run. "neural net" put the
neural-networks sentence first with a score of 0.552. The misspelled
"nueral netwroks" still put it first, but at 0.222, barely ahead of the
deep-learning sentence at 0.201. So typos don't break it, but they do
weaken the signal.

Dense Passage Retrieval (DPR, 2020) put a number on it. Two encoders, one
for questions and one for passages, trained on a modest set of
question-passage pairs, found the right passage in their top 20 results 9 to 19 percentage points more often than
a strong [[bm25|BM25]] keyword system on open-domain question answering.

## Short questions, long answers

The nine-sentence example is a little too easy, because every entry is a
single short sentence. Search comes in two shapes:

- **Symmetric**: the query and the entries look alike. Finding duplicate
  questions is the classic case: "How to learn Python online?" should
  find "How to learn Python on the web?". You could swap query and entry
  and nothing would change.
- **Asymmetric**: a short question has to find a longer passage that
  answers it. "What is Python" should find a paragraph describing the
  language. This is the RAG case, and swapping them makes no sense.

Models are trained for one shape or the other, so pick one trained for
yours. Some retrieval models also want to know which side each text is on.
They put a different prompt in front of queries and documents, and the
libraries give you separate calls for each (`encode_query` and
`encode_document` in Sentence Transformers). For a model trained without
those prompts, the calls return identical vectors, so using them costs
nothing.

## Comparing against everything, and when that stops working

The simplest version scores the question against every stored vector. It
sounds slow, but it's just multiplication, and it's exact: you always get
the true top k. The Sentence Transformers docs put the comfortable limit
for this at about a million entries.

Past that, you switch to an approximate nearest neighbor index. It groups
similar vectors so a search only looks at a small part of the collection.
Results come back in milliseconds even over millions of vectors, but
they're no longer guaranteed exact: some close matches can be missed. How
those indexes work, and what they trade away, is in [[vector-index]].

## Where it gets tricky

**It always returns something.** Nearest isn't the same as relevant. Ask
"How can we address climate change challenges?" against the nine
sentences, and the fourth and fifth results are the machine-learning ones,
with scores near zero (0.042 and 0.041). Ask for the top 5 and you get
them anyway. A system that answers from retrieved text needs a way to
notice when nothing good came back. That's
[[saying-i-dont-know]].

**Scores don't have a fixed meaning.** In the same run, the best match for
the neural-networks question scored 0.593, while the best match for "What
technology is used for modern space exploration?" (the Mars rovers
sentence) scored only 0.375, though it's a perfectly good answer. A single
cut-off score across all questions would drop good results for some
questions and keep bad ones for others.

**Exact terms slip through.** A query like "Error code TS-999" needs that
exact string. An embedding model may return chunks about error codes in
general and miss the one that mentions TS-999. Keyword search catches
these, so a common fix is to run both and merge the results:
[[hybrid-search]].

**It may not travel well to new domains.** DPR's win was measured on the
kind of data it was trained on. BEIR (2021) tested retrieval models on 18
datasets they hadn't seen, and there plain BM25 held up as a strong
baseline while dense retrievers often fell behind. The models tested are
from 2020–2021, so the gap may look different today, but the lesson
stands: measure on your own data before you
assume embeddings beat keywords.

**The first ranking isn't the last step.** For harder searches, a second
model re-scores the top candidates and keeps the best few. That's
[[reranking]].

## What this means when you build

- Embed queries and documents with the same model, and use its query and
  document modes if it has them.
- If your vectors are normalized, score with a dot product. It ranks the
  same as cosine and does less work.
- Start with exact search. A collection the size of this site's articles
  is far below the million-entry mark where you'd need an approximate
  index.
- Don't return the top k blindly. Look at the scores on real questions
  and decide what "nothing relevant" looks like for your model.
- Plan for keyword search next to it, for names, codes and exact phrases.
- Semantic search is the "R" in [[rag]]: the chunks it returns become the
  context the model answers from.

## Further reading

- [Semantic Search](https://sbert.net/examples/sentence_transformer/applications/semantic-search/README.html),
  Sentence Transformers docs. The mechanism in a few lines of code, the
  nine-sentence example, symmetric vs asymmetric search, and when to
  switch to an approximate index.
- [Dense Passage Retrieval for Open-Domain Question Answering](https://arxiv.org/abs/2004.04906),
  Karpukhin et al., 2020. The paper that showed dense
  vectors beat BM25 for finding passages.
- [BEIR: A Heterogenous Benchmark for Zero-shot Evaluation of Information Retrieval Models](https://arxiv.org/abs/2104.08663),
  Thakur et al., 2021. The counterweight: out of domain, BM25 is hard to
  beat.
- [Vector embeddings](https://developers.openai.com/api/docs/guides/embeddings),
  OpenAI docs. The API view: embed the query with the same model, rank by
  cosine, and why normalized vectors make dot product enough.
- [Contextual Retrieval](https://www.anthropic.com/engineering/contextual-retrieval),
  Anthropic, 2024. Where embeddings miss exact matches like error codes,
  and how keyword search fills the gap.
