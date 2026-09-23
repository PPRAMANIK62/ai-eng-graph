---
id: penedo-fineweb
title: "The FineWeb Datasets: Decanting the Web for the Finest Text Data at Scale"
author: Guilherme Penedo, Hynek Kydlíček, Loubna Ben allal, Anton Lozhkov, Margaret Mitchell, Colin Raffel, Leandro Von Werra, Thomas Wolf (Hugging Face)
url: https://arxiv.org/abs/2406.17557
published: 2024-06-25        # v2 2024-10-31; NeurIPS 2024 Datasets and Benchmarks
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

Hugging Face's account of building FineWeb, an open 15-trillion-token pretraining dataset made from 96 Common Crawl snapshots, and FineWeb-Edu, a 1.3-trillion-token subset of "educational" pages picked by a classifier trained on Llama 3 ratings. It's the clearest public description of where pretraining text comes from and how it gets cleaned: text extraction, language and quality filters, deduplication. Each step was tested by training small models on the result.

## Key claims

- Data quality and size drive model quality. "The performance of a large language model (LLM) depends heavily on the quality and size of its pretraining dataset." (Abstract)
- Big labs keep their pretraining data secret. "pretraining dataset curation strategies are often treated as closely guarded trade secrets." (§1 Introduction)
- FineWeb: 15 trillion tokens from 96 Common Crawl snapshots. "we introduce FineWeb, a 15-trillion token dataset derived from 96 Common Crawl snapshots" (Abstract)
- Raw web text extraction matters: extracting from raw HTML (WARC) beat Common Crawl's own text files (WET), which "retained too much boilerplate and menu text." (§3.2 Text extraction)
- Base filtering: a URL blocklist to remove adult content, a language classifier keeping English with score ≥ 0.65, and quality and repetition filters. "we applied URL filtering using a blocklist [51] to remove adult content" (§3.3 Base filtering)
- After base filtering, about 36 trillion tokens remained. "we obtained roughly 36 trillion tokens of data when tokenized with the GPT-2 tokenizer." (§3.3)
- Deduplicating across all snapshots at once removed up to 90% of old snapshots and didn't help; the kept data was worse. "the data from it that was kept (10% of the original data) was actually of worse quality than the 90% of data that was removed." (§3.4 Deduplication)
- Deduplicating each snapshot on its own gave 20 trillion tokens and matched RefinedWeb. "This resulted in 20 trillion tokens of data." (§3.4)
- FineWeb-Edu: Llama-3-70B-Instruct scored 460,000 pages for educational value on a 0–5 scale; a small classifier trained on those scores filtered the whole set, keeping pages scoring 3 or more. "we use Llama-3-70B-Instruct to score 460,000 randomly sampled webpages" (§4 FineWeb-Edu)
- FineWeb-Edu is 1.3 trillion tokens. "The resulting dataset, FineWeb-Edu, contains 1.3 trillion tokens." (§4)
- Filtering for educational text improved knowledge benchmarks a lot: MMLU from 33% to 37%, ARC from 46% to 57%, in a 1.71B-parameter model trained on 350B tokens. "MMLU score increases from 33% to 37%, a relative improvement of approximately 12%, and ARC score goes from 46% to 57%" (§4)
- Running the classifier over 15T tokens cost 6,000 H100 GPU hours. "Applying the classifier to the 15 trillion tokens of FineWeb required 6,000 H100 GPU hours." (§4)
- The objective the data serves is next-token prediction. "At their core, LLMs aim to produce a distribution over the next token of text conditioned on past tokens" (§2 Background)

## Visuals worth redrawing

- The pipeline as a funnel: Common Crawl WARC files → text extraction → base filtering (URL, language, quality) → per-snapshot MinHash dedup → extra heuristic filters → FineWeb (15T) → educational classifier → FineWeb-Edu (1.3T). Good main visual for the pretraining article.
- Figures 10–11: FineWeb-Edu vs other open datasets on MMLU and ARC over training tokens.

## My notes

- 2024. English only. The token counts use the GPT-2 tokenizer.
- The finding that global dedup can keep the worst data is a nice "where it gets tricky" point: cleaning isn't simply "remove duplicates".
- The paper says Llama 3 and Phi-3 used the same classifier-filtering idea on their non-public data ("This technique was notably used in the non-public pretraining datasets of Llama 3 [6] and Phi-3 [8]").
