---
id: nvidia-chunking-strategies
title: Finding the Best Chunking Strategy for Accurate AI Responses
author: Steve Han (NVIDIA)
url: https://developer.nvidia.com/blog/finding-the-best-chunking-strategy-for-accurate-ai-responses/
published: 2025-06-18
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

NVIDIA's experiment comparing token-based chunks (128 to 2,048 tokens), page-level chunks and section-level chunks, scored by end-to-end answer accuracy on five PDF-heavy datasets. Page-level chunking had the best average and the least spread; the best token size changed by dataset and by the kind of question.

## Key claims

- Setup: token sizes 128, 256, 512, 1,024 and 2,048 with 15% overlap, page-level, and section-level (by document layout). "we tested 10%, 15%, and 20% overlap values and found 15% to perform the best on FinanceBench with 1,024 token chunks." (Chunking strategies tested)
- Five datasets: DigitalCorpora767, Earnings, FinanceBench, KG-RAG, RAGBattlePacket — mostly PDFs, financial and business reports. (Datasets)
- Tables and charts were pulled out as whole units, not chunked. (Experimental setup)
- Metric: end-to-end answer accuracy judged by LLMs (RAGAS answer accuracy, scores 0/2/4, averaged over two judge models). Pipeline fixed: nvidia/llama-3.2-nv-embedqa-1b-v2 embeddings, a reranker, top-k 10, a 70B generator. (Evaluation methodology; RAG system implementation)
- Page-level wins on average. "page-level chunking achieved the highest average accuracy (0.648) with the lowest standard deviation (0.107)" and "all token-based approaches maintained consistent performance between 0.603 and 0.645." (Overall performance by chunking strategy, Figure 2)
- The best setting varies even across similar documents: FinanceBench best at 1,024 tokens (0.579), Earnings at 512 (0.681), KG-RAG with page-level (0.520). (Results and analysis)
- Extremes lose. "Very small (128 tokens) and very large (2,048 tokens) chunks generally underperformed medium-sized chunks." KG-RAG at 128 tokens: 0.421. RAGBattlePacket 2,048 vs 1,024: 0.749 vs 0.804. (Results and analysis)
- Query type matters: factoid questions did well with 256–512-token chunks; analytical questions with 1,024 tokens or whole pages. (Results and analysis)
- Page boundaries are stable for citations. Page chunks give "easier citation and reference capabilities since pages are static boundaries, unlike token-based chunking, where chunk indices depend on the chosen chunk size" (1. Consider page-level chunking first)
- Test on your data. "We recommend evaluating these strategies on your own data to confirm they work well for your specific use case." (3. Query characteristics impact performance)

## Visuals worth redrawing

- Figure 4, accuracy by chunk size per dataset: shows the best size differs by dataset.

## My notes

- Read via curl, 2026-09-27. Vendor post promoting the NVIDIA RAG Blueprint.
- Different metric from Chroma's (final answer accuracy vs retrieved tokens), different data (PDFs with pages vs plain text). "Page" only exists for paged documents.
