---
id: sbert-semantic-search
title: Semantic Search (Sentence Transformers documentation)
author: Sentence Transformers (sbert.net; Nils Reimers, now maintained by Hugging Face)
url: https://sbert.net/examples/sentence_transformer/applications/semantic-search/README.html
published: 2026              # undated docs page; uses the current encode_query / encode_document API
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

The Sentence Transformers library's page on semantic search: embed every entry in your corpus once, embed the query into the same space, return the closest entries. It separates symmetric search (query and entries alike) from asymmetric search (short question, long passage), gives a small runnable example with printed scores, and points to approximate nearest neighbor indexes and retrieve-and-rerank for larger or harder cases.

## Key claims

- What it is and what it handles. "Semantic search can also perform well given synonyms, abbreviations, and misspellings, unlike keyword search engines that can only find documents based on lexical matches." (Semantic Search, opening)
- The mechanism. "The idea behind semantic search is to embed all entries in your corpus, whether they be sentences, paragraphs, or documents, into a vector space. At search time, the query is embedded into the same vector space and the closest embeddings from your corpus are found." (Background)
- Symmetric search: query and entries of similar length and content, e.g. "How to learn Python online?" vs "How to learn Python on the web?". "For symmetric tasks, you could potentially flip the query and the entries in your corpus." (Symmetric vs. Asymmetric Semantic Search)
- Asymmetric search. "For asymmetric semantic search, you usually have a short query (like a question or some keywords) and you want to find a longer paragraph answering the query." (same section)
- Model choice follows from that split. "It is critical that you choose the right model for your type of task." (same section)
- For asymmetric search, encode queries and documents with separate methods (`encode_query`, `encode_document`), which apply the model's "query" or "document" prompt if it has one; for models trained without such prompts all three encode methods return identical embeddings. (Tip box)
- Exact search is fine up to about a million entries. "For small corpora (up to about 1 million entries), we can perform semantic search with a manual implementation" (Manual Implementation)
- Worked example with all-MiniLM-L6-v2 and a nine-sentence corpus. For "How do artificial neural networks work?" the top five scores are 0.5926 (neural networks), 0.5288 (deep learning), 0.4647 (machine learning), 0.1381 (Mars rovers), 0.0912 (carbon capture). For "What technology is used for modern space exploration?" the top is 0.3754 (Mars rovers). For "How can we address climate change challenges?" the top is 0.3760 (global warming) and the fourth and fifth are 0.0420 and 0.0411 (machine learning, deep learning). (Manual Implementation, Output block)
- The library's `semantic_search()` uses cosine similarity by default with top_k=10. "This function performs by default a cosine similarity search between a list of query embeddings and a list of corpus embeddings." (Optimized Implementation)
- With normalized embeddings you can use dot product. "we can normalize the corpus embeddings so that each corpus embeddings is of length 1. In that case, we can use dot-product for computing scores." (Speed Optimization)
- Exact search gets slow at millions of vectors; ANN trades exactness for speed. "However, the results are not necessarily exact. It is possible that some vectors with high similarity will be missed." (Approximate Nearest Neighbor)
- ANN libraries named: "Three popular libraries for approximate nearest neighbor are Annoy, FAISS, and hnswlib." (Approximate Nearest Neighbor)
- For harder cases, a second stage. "For complex semantic search scenarios, a two-stage retrieve & re-rank pipeline is advisable" (Retrieve & Re-Rank)
- In their Wikipedia example, a bi-encoder retrieves by cosine similarity, then "the retrieved candidates are scored by a Cross-Encoder re-ranker and the 5 passages with the highest score from the Cross-Encoder are presented to the user." (Examples)

## Visuals worth redrawing

- The printed output of the worked example: one query, nine sentences, a score per sentence. Good as a bar chart.

## My notes

- Read via curl (HTML stripped to text), 2026-09-27.
- **We ran the example ourselves** on 2026-09-27: the same nine sentences and three queries, with Transformers.js 4.3 (`Xenova/all-MiniLM-L6-v2`, fp32, mean pooling, normalized, dot product) under bun. The top-five scores matched the page to four decimals (0.5926, 0.5288, 0.4647, 0.1381, 0.0912 for the neural-networks query). The full ranking we got for "How do artificial neural networks work?": 0.5926, 0.5288, 0.4647, 0.1381, 0.0912, 0.0729 (Webb telescope), 0.0624 (renewables), 0.0465 (global warming), 0.0196 (Starship). The climate query's bottom four were negative: −0.0056, −0.0121, −0.0385, −0.0540. Vectors had 384 numbers and length 1.0000.
- Two extra queries we added in the same run: "neural net" put the neural-networks sentence first at 0.5520; the misspelled "nueral netwroks" still put it first, but at 0.2219, with deep learning close behind at 0.2006.
- Script kept outside the repo (scratchpad); the numbers above are what it printed.
