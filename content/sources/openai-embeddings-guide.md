---
id: openai-embeddings-guide
title: Vector embeddings (OpenAI API guide)
author: OpenAI
url: https://developers.openai.com/api/docs/guides/embeddings
published: 2024              # undated docs page; covers the text-embedding-3 models (released 2024)
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

OpenAI's guide to its embeddings endpoint: send text, get back one fixed-length list of floats, and compare lists by distance to measure how related two texts are. It lists what embeddings are used for (search, clustering, recommendations, classification), the two current models and their sizes, how to shorten vectors with the `dimensions` parameter, and worked examples on a set of Amazon food reviews.

## Key claims

- What they're for: measuring how related two texts are. "OpenAI’s text embeddings measure the relatedness of text strings." (What are embeddings?)
- Uses: search, clustering, recommendations, anomaly detection, diversity measurement, classification. (What are embeddings?, bullet list)
- What one is, and what distance means. "An embedding is a vector (list) of floating point numbers." and "Small distances suggest high relatedness and large distances suggest low relatedness." (What are embeddings?)
- You pay per input token. "Requests are billed based on the number of tokens in the input." (What are embeddings?)
- Getting one is a single API call with a model name and a string; the response holds the vector plus token usage. Example: `text-embedding-3-small`, "Your text string goes here", 5 prompt tokens. (How to get embeddings)
- Sizes: 1536 numbers for `text-embedding-3-small`, 3072 for `text-embedding-3-large`. "By default, the length of the embedding vector is 1536 for text-embedding-3-small or 3072 for text-embedding-3-large ." (How to get embeddings; the page puts the numbers in code formatting)
- Model table: small ≈ 62,500 pages per dollar, MTEB 62.3%; large ≈ 9,615 pages per dollar, MTEB 64.6%; both take up to 8192 input tokens. (Embedding models, table; assumes ~800 tokens per page)
- You can shorten vectors, trading a little accuracy for size, e.g. 3072 → 1024 to fit a vector store that caps at 1024. "trading off some accuracy in exchange for the smaller vector size." (Reducing embedding dimensions)
- Bigger vectors cost more to store and search. "Using larger embeddings, for example storing them in a vector store for retrieval, generally costs more and consumes more compute, memory and storage than using smaller embeddings." (Reducing embedding dimensions)
- Search works by embedding the query with the same model and ranking by cosine similarity. "we embed the query in natural language using the same model. Then we calculate cosine similarity between the resulting query embedding and each of the function embeddings." (Code search using embeddings)
- Recommended distance: cosine; vectors come normalized to length 1. "We recommend cosine similarity. The choice of distance function typically doesn't matter much." and "OpenAI embeddings are normalized to length 1" (FAQ, Which distance function should I use?)
- Embeddings as features: predicting a review's star rating from its embedding gave a mean absolute error of 0.39 stars. "achieves a mean absolute error of 0.39, which means that on average the prediction is off by less than half a star." (Regression using the embedding features)
- The models have a knowledge cutoff too. "the text-embedding-3-large and text-embedding-3-small models lack knowledge of events that occurred after September 2021." (FAQ; model names are in code formatting on the page)
- With length-1 vectors, cosine and Euclidean distance rank results the same way. "Cosine similarity and Euclidean distance will result in the identical rankings" (FAQ, Which distance function should I use?; added 2026-09-27)
- A shortened large vector can beat an older full one. "on the MTEB benchmark, a text-embedding-3-large embedding can be shortened to a size of 256 while still outperforming an unshortened text-embedding-ada-002 embedding with a size of 1536." (Reducing embedding dimensions; code formatting stripped; added 2026-09-27)
- The older model in the same table: text-embedding-ada-002, about 12,500 pages per dollar, MTEB 61.0%, 8192 max input. (Embedding models, table; added 2026-09-27)
- If you cut a vector yourself instead of using the parameter, re-normalize it. "When you change the dimension manually, you need to be sure to normalize the dimensions of the embedding as is shown below." (Reducing embedding dimensions; added 2026-09-27)

## Visuals worth redrawing

- The 2D t-SNE plot of review embeddings colored by star rating (Data visualization in 2D): roughly 3 clusters, one mostly negative reviews. Shows "similar texts land near each other" on real data. Redraw from our own data rather than copying.

## My notes

- Read via the page's markdown version (append `.md`), 2026-09-23. The guide still lists the third-generation models as current.
- Undated page; `text-embedding-3` came out in early 2024 per the linked OpenAI blog post, which I didn't open. The year is a lower bound.
- Cosine similarity, vector databases and model choice belong to phase 2 nodes (`cosine-similarity`, `embedding-models`, `vector-index`); this note keeps the facts so they can reuse it.
- The quotes with model names had code formatting stripped when copied.
