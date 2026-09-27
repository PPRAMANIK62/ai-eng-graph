---
id: chroma-evaluating-chunking
title: Evaluating Chunking Strategies for Retrieval (Chroma technical report)
author: Brandon Smith, Anton Troynikov (Chroma)
url: https://www.trychroma.com/research/evaluating-chunking
published: 2024-07-03
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

Chroma's technical report measuring how the way you cut documents into chunks changes retrieval. Standard benchmarks score whole documents, so they can't see chunking. The report scores retrieval by tokens instead: how many of the relevant tokens came back (recall), and how much of what came back was relevant (precision, IoU). It tests the common splitters at several sizes and overlaps, two semantic chunkers and an LLM-based one, over five corpora.

## Key claims

- Chunking choice matters. "We demonstrate that the choice of chunking strategy can have a significant impact on retrieval performance, with some strategies outperforming others by up to 9% in recall." (Abstract)
- What chunking is for. "Chunking serves to divide documents into units of information, with semantic content suitable for embeddings-based retrieval and processing by an LLM." (Introduction)
- Why not put everything in the prompt: it's wasteful and distracting. "in practice doing so is often inefficient, and can distract the model." (Introduction)
- Benchmarks like MTEB can't see chunking. "retrieval performance is typically evaluated with respect to the relevance of entire documents, rather than at the level of passages or tokens, meaning they cannot take chunking into account." (Introduction)
- Chunks mix relevant and irrelevant text, and relevant text can be split. "Chunks may contain both relevant and irrelevant tokens, and relevant excerpts may be split across chunks." (Introduction)
- The metrics: recall, precision and IoU (Jaccard) measured on retrieved tokens; overlap is penalized because repeated tokens count in the denominator. (Evaluating Retrieval for AI Applications; Metrics)
- Setup: five corpora (State of the Union 2024, Wikitext, UltraChat JSON, ConvFinQA, PubMed), 328,208 tokens, 472 queries; n=5 retrieved chunks; tokens counted with cl100k. (Chunking Evaluation Dataset; Results)
- What the RecursiveCharacterTextSplitter does: splits on separators by position, up to a maximum length, ignoring meaning. "These chunking methods are insensitive to the semantic content of the corpus, relying instead on the position of character sequences to divide documents into chunks, up to a maximum specified length." (Chunking Algorithms)
- They changed its separators to include sentence ends, because the defaults gave very short chunks: ["\n\n", "\n", ".", "?", "!", " ", ""]. (Chunking Algorithms)
- Semantic chunking (Kamradt): embed a sliding window and cut where the cosine distance between neighbours jumps, by default above the 95th percentile. (Chunking Algorithms, KamradtSemanticChunker)
- Results with text-embedding-3-large (recall / IoU, in %): Recursive 800 tok, 400 overlap: 85.4 / 1.5. TokenText 800/400: 87.9 / 1.4. Recursive 400/200: 88.1 / 3.3. Recursive 400/0: 89.5 / 3.6. TokenText 400/0: 89.2 / 2.7. Recursive 200/0: 88.1 / 6.9. TokenText 200/0: 87.0 / 5.1. Kamradt default: 83.6 / 1.5. Cluster 200: 87.3 / 8.0. LLM (GPT-4o): 91.9 / 3.9. (Results, table for text-embedding-3-large)
- The winner for everyday use. "We find that the heuristic RecursiveCharacterTextSplitter with chunk size 200 and no overlap performs well. While it does not achieve the best result, it is consistently high performing across all evaluation metrtics." (Results; "metrtics" is their typo)
- Less overlap, better IoU. "Unsurprisingly, reducing chunk overlap improves IoU scores, as this metric penalizes redundant information." (Results)
- OpenAI's default did worst. With 800 tokens and 400 overlap, "this setting results in slightly below-average recall and the lowest scores across all other metrics, suggesting particularly poor recall-efficiency tradeoffs." (Results)
- Size has a sweet spot (their guess). "We speculate that recall could reach a maximum before relevant information is diluted within chunks, making it more difficult to retrieve, while chunks which are too small fail to capture necessary context within a single unit." (Results)
- With a small embedding model (all-MiniLM-L6-v2), overlap helped recall: TokenText 250 tokens with 125 overlap got 0.824, dropping to 0.771 with no overlap, "suggesting that for smaller context, overlapping chunks are necessary for high recall." (Results, all-MiniLM-L6-v2 table)
- Limitation: they didn't measure how long chunking takes, which ranges "from almost instantaneous to tens of minutes in the case of the LLMChunker". (Limitations & Future Work)

## Visuals worth redrawing

- The results table as recall vs IoU per strategy: recall barely moves (84–92%), IoU moves several-fold. Good as paired bars.

## My notes

- Read via curl (HTML stripped to text), 2026-09-27. Table numbers copied from the text version of the page.
- Chroma sells a vector database. The code and data are public.
- It measures retrieval only, not the final answer. Small dataset (472 queries), acknowledged in Limitations.
- The Precision_Ω column (precision if every needed chunk were retrieved) isn't used here.
