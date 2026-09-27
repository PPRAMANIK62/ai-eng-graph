---
id: anthropic-contextual-retrieval
title: Introducing Contextual Retrieval
author: Anthropic
url: https://www.anthropic.com/engineering/contextual-retrieval
published: 2024-09-19
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

Anthropic's post on a fix for chunks losing their context: before embedding, have a model write a short note placing each chunk in its document, and prepend it. It walks through the standard RAG pipeline, adds BM25 and reranking, and reports how much each step cuts retrieval failures. It also says small knowledge bases don't need RAG at all.

## Key claims

- Small knowledge bases: skip retrieval. "If your knowledge base is smaller than 200,000 tokens (about 500 pages of material), you can just include the entire knowledge base in the prompt that you give the model" (A note on simply using a longer prompt)
- Standard RAG preprocessing: split documents into chunks, embed them, store the embeddings in a vector database, retrieve by semantic similarity at query time. (A primer on RAG: scaling to larger knowledge bases)
- The lost-context example. Original chunk: "The company's revenue grew by 3% over the previous quarter." Contextualized: "This chunk is from an SEC filing on ACME corp's performance in Q2 2023; the previous quarter's revenue was $314 million." (The context conundrum in traditional RAG)
- BM25 catches exact matches embeddings miss. "It's particularly effective for queries that include unique identifiers or technical terms" with the example "Error code TS-999". (A primer on RAG: scaling to larger knowledge bases)
- Top-20 retrieval failure rate: contextual embeddings cut it 35% (5.7% → 3.7%); plus contextual BM25, 49% (5.7% → 2.9%); plus reranking, 67% (5.7% → 1.9%). (Performance improvements; Further boosting performance with Reranking)
- The metric they report is a retrieval failure rate, measured on its own before any answer. "We use 1 minus recall@20 as our evaluation metric, which measures the percentage of relevant documents that fail to be retrieved within the top 20 chunks." (Performance improvements)
- They tested across several kinds of content. "We experimented across various knowledge domains (codebases, fiction, ArXiv papers, Science Papers), embedding models, retrieval strategies, and evaluation metrics." (Performance improvements)
- Passing more chunks helped. "the top-20 chunks to the model is more effective than just the top-10 or top-5" (Implementation considerations)
- Cost with prompt caching. "the one-time cost to generate contextualized chunks is $1.02 per million document tokens" (Using Prompt Caching to reduce the costs of Contextual Retrieval)
- Chunks are usually small: split the corpus "into smaller chunks of text, usually no more than a few hundred tokens" (A primer on RAG; added 2026-09-27)
- The added context is short. "The resulting contextual text, usually 50-100 tokens, is prepended to the chunk before embedding it and before creating the BM25 index." (Implementing Contextual Retrieval; added 2026-09-27)
- Plain document summaries didn't help much: "adding generic document summaries to chunks (we experimented and saw very limited gains)" (Implementing Contextual Retrieval; added 2026-09-27)
- Chunking choices still matter. "The choice of chunk size, chunk boundary, and chunk overlap can affect retrieval performance" (Implementation considerations; added 2026-09-27)
- The rule ends with "with no need for RAG or similar methods." (A note on simply using a longer prompt)
- Prompt caching makes the long-prompt route cheaper and faster: "reducing latency by > 2x and costs by up to 90%" (A note on simply using a longer prompt)
- It stops scaling. "However, as your knowledge base grows, you'll need a more scalable solution." (A note on simply using a longer prompt)
- BM25 and embedding results are merged by rank. "Combine and deduplicate results from (3) and (4) using rank fusion techniques" (A primer on RAG: scaling to larger knowledge bases; added 2026-09-27)
- Reranking steps: retrieve many, score each against the query, keep a few. "Perform initial retrieval to get the top potentially relevant chunks (we used the top 150)" then "select the top-K chunks (we used the top 20)". They used the Cohere reranker. (Further boosting performance with Reranking; added 2026-09-27)
- Why rerank. "Reranking provides better responses and reduces cost and latency because the model is processing less information." (Further boosting performance with Reranking; added 2026-09-27)
- Cost. "Because reranking adds an extra step at runtime, it inevitably adds a small amount of latency, even though the reranker scores all the chunks in parallel." and "There is an inherent trade-off between reranking more chunks for better performance vs. reranking fewer for lower latency and cost." (Cost and latency considerations; added 2026-09-27)
- The headline numbers are averages across domains with their best embedding setup. "The graphs below show the average performance across all knowledge domains with the top-performing embedding configuration (Gemini Text 004) and retrieving the top-20-chunks." (Performance improvements; added 2026-09-27)
- Reranking helped across domains. "Our experiments showed that, across various domains, adding a reranking step further optimizes retrieval." (Further boosting performance with Reranking; added 2026-09-27)

## Visuals worth redrawing

- The preprocessing + runtime pipeline diagram (chunk → embed → store; query → retrieve → prompt). Redraw as a two-row pipeline.

## My notes

- Used Claude 3 Haiku for the context notes (2024). The 200k rule was written when Claude's window was 200k; as of 2026-09 many Claude models have 1M (see anthropic-context-windows), so the threshold is tied to the window of its time.
- Vendor post, measured on their own datasets.
