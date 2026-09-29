---
id: schroeder-vcache
title: "vCache: Verified Semantic Prompt Caching"
author: Luis Gaspar Schroeder, Aditya Desai, Alejandro Cuadron, Kyle Chu, Shu Liu, Mark Zhao, Stephan Krusche, Alfons Kemper, Matei Zaharia, Joseph E. Gonzalez
url: https://arxiv.org/abs/2502.03771
published: 2026-02-21        # v5; v1 was 2025-02-06. Accepted at ICLR 2026.
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Shows that semantic caches using one fixed similarity threshold for every request can't promise an error rate, because right and wrong cache hits have overlapping similarity scores. vCache learns a separate threshold for each cached entry online and keeps errors under a bound the user sets. Read the abstract page and the introduction of the v5 HTML version.

## Key claims

- How semantic caches work: embed the prompt, find the most similar cached prompt, and if similarity passes a threshold return its response; otherwise call the LLM and add the new prompt and response. (Introduction)
- The example of a correct hit: a cache that answered "Which city is Canada’s capital?" should also answer "What is the capital of Canada?". (Introduction)
- The threshold dilemma: too low gives false positives, "resulting in cache hits where the retrieved response r(nn(x)) differs from the correct output r(x)"; too high misses correct hits. (Introduction)
- Static thresholds fail: "static thresholds do not give formal correctness guarantees, result in unexpected error rates, and lead to suboptimal cache hit rates." (Abstract)
- Why: "two prompts may be close in embedding space yet require different responses." Correct and incorrect hits "have highly overlapping similarity distributions". (Introduction)
- Users typically pick "a predefined threshold (e.g., 0.8)" or test a few values up front. (Introduction)
- Result: vCache meets the error bound and gets "up to 12.5× higher cache hit and 26× lower error rates" than static-threshold and fine-tuned embedding baselines. (Abstract)

## Visuals worth redrawing

- Figure 3: overlapping similarity distributions of correct vs incorrect cache hits.

## My notes

- Academic benchmarks (five datasets, three embedding models, two LLMs), not a production deployment.
