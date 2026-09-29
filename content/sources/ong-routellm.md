---
id: ong-routellm
title: "RouteLLM: Learning to Route LLMs with Preference Data"
author: Isaac Ong, Amjad Almahairi, Vincent Wu, Wei-Lin Chiang, Tianhao Wu, Joseph E. Gonzalez, M Waleed Kadous, Ion Stoica
url: https://arxiv.org/abs/2406.18665
published: 2024-06-26          # v4 2025-02-23
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Trains small router models that decide, per query, whether a strong expensive model (GPT-4) or a weak cheap one (Mixtral-8x7B) should answer. The routers learn from human preference votes (Chatbot Arena), augmented with a little labeled data. A threshold sets how often the strong model is called. On MT Bench the routers cut strong-model calls sharply at the same quality; on MMLU, routers trained only on Arena data were no better than random until in-domain labeled data was added. Router overhead is small next to generation cost.

## Key claims

- The problem: pick "between a stronger and a weaker LLM during inference, aiming to optimize the balance between cost and response quality." (Abstract)
- Headline: "reduces costs-by over 2 times in certain cases-without compromising the quality of responses." (Abstract, v4 abs page)
- Routers transfer: they keep performance "even when the strong and weak models are changed at test time." (Abstract)
- Setup: strong = GPT-4, weak = Mixtral-8x7B; routers include similarity-weighted ranking, matrix factorization, a BERT classifier and a causal LLM classifier, trained on 80k Chatbot Arena battles. (3, 4.1)
- A threshold α trades cost for quality; they report the share of strong-model calls needed to recover 50% of the quality gap (CPT(50%)). (3)
- MT Bench: at CPT(50%) the score, 8.8, "is 95% that of GPT-4’s score (9.3)"; with augmented data, "reducing costs by up to 75% as compared to the random router." (Table 1)
- GPT-4 calls needed at CPT(50%) on MT Bench, trained on Arena + judge data: matrix factorization 13.40%, BERT 19.58%, SW ranking 23.21%, causal LLM 31.50% (random router 49.03%). Strong model was gpt-4-1106-preview. (5.1, Table 1)
- Price assumptions: "We estimate the average cost of using GPT-4 and Mixtral 8x7B to be $24.7 per million tokens and $0.24 per million tokens respectively". (5.4)
- MMLU: "all routers perform poorly at the level of the random router when trained only on Arena dataset", attributed to MMLU questions being out of distribution; adding about 1,500 golden-label samples ("less than 2% of the overall training data") fixed it. (5.1, Table 2)
- Cost savings over GPT-4 of the best routers: MT Bench 3.66x at CPT(50%), MMLU 1.41x, GSM8K 1.49x. How it's computed: "we calculate the inverse of the ratio of GPT-4 calls made by our top-performing router relative to the random baseline". Quality at that point: MT Bench 95%, MMLU 92%, GSM8K 87% of GPT-4. (5.4, Table 6)
- Overhead: "the cost of deploying a router is small". Matrix factorization router: $3.32 per million requests, 155 requests/second on one L4 GPU. (5.5, Table 7)

## Visuals worth redrawing

- Figure 1: quality vs % of calls to the strong model, router curve above the random-router line.

## My notes

- 2024 models. The idea (a cheap classifier in front of two price tiers) is independent of the models.
- The MMLU result is the important warning: a router trained on one kind of traffic can be no better than a coin flip on another.
