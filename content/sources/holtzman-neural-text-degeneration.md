---
id: holtzman-neural-text-degeneration
title: The Curious Case of Neural Text Degeneration
author: Ari Holtzman, Jan Buys, Li Du, Maxwell Forbes, Yejin Choi
url: https://arxiv.org/abs/1904.09751
published: 2020-02-14         # v2, ICLR 2020; v1 2019-04-22
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The paper that showed why "always pick the most likely text" goes wrong, and introduced nucleus (top-p) sampling. On GPT-2 Large, greedy and beam search produce bland text that loops, while sampling from the full distribution drifts into nonsense because of the long tail of unlikely tokens. Nucleus sampling cuts the tail by keeping only the smallest set of top tokens that covers probability p, and its output came closest to human text on every measure they used. Read the abstract and the full PDF.

## Key claims

- Maximizing likelihood when decoding makes bad text. "maximization-based decoding methods such as beam search lead to degeneration — output text that is bland, incoherent, or gets stuck in repetitive loops." (Abstract, PDF)
- The decoding method alone changes quality, same model. "decoding strategies alone can dramatically effect the quality of machine text, even when generated from exactly the same neural language model." (Abstract, arXiv page)
- Why pure sampling goes wrong: unlikely picks create context the model can't recover from. "This indicates that the model is confusing itself: sampling too many unlikely tokens and creating context that makes it difficult to recover the human distribution of text" (§4.2)
- Pure sampling is the other failure: incoherent text, blamed on the tail. "This unreliable tail is composed of tens of thousands of candidate tokens with relatively low probability that are over-represented in the aggregate." (§1)
- The nucleus: most probability sits on a small set that "tends to range between one and a thousand candidates." (§1)
- Top-p definition: the smallest set of tokens whose probabilities add up to at least p; renormalize and sample from it. "we define its top-p vocabulary V (p) ⊂ V as the smallest set such that" the sum is ≥ p. (§3.1)
- In practice. "In practice this means selecting the highest probability tokens whose cumulative probability mass exceeds the pre-chosen threshold p. The size of the sampling set will adjust dynamically based on the shape of the probability distribution at each time step." (§3.1)
- Top-k's problem: a fixed k is wrong for some contexts. Sometimes the head is "flat across tens or hundreds of reasonable options", sometimes nearly all mass is on one or a few tokens; small k gives bland text, large k lets bad candidates in. (§3.2)
- Temperature definition: divide logits by t before softmax; t below 1 skews towards likely tokens. "Setting t ∈ [0, 1) skews the distribution towards high probability events, which implicitly lowers the mass in the tail distribution." (§3.3, Eq. 4)
- Lower temperature trades diversity for quality. "while lowering the temperature improves generation quality, it comes at the cost of decreasing diversity" (§3.3)
- Repetition feeds itself: "The probability of a repeated phrase increases with each repetition, creating a positive feedback loop." (Figure 4)
- Setup: GPT-2 Large (762M parameters), 5,000 passages, up to 200 tokens each. (§4.1)
- Table 1, repetition %: human 0.28, greedy 73.66, beam (b=16) 28.94, pure sampling 0.22, top-k=40 with t=0.7 8.86, nucleus p=0.95 0.36. Perplexity: human 12.38, greedy 1.50, beam (b=16) 1.48, pure sampling 22.73, nucleus 13.13. (Table 1; beam perplexity re-checked on 2026-09-23 via the ar5iv HTML version, https://ar5iv.labs.arxiv.org/html/1904.09751.) Caption: "Main results for comparing all decoding methods with selected parameters of each method." (Table 1)
- Top-p is the only method meeting all their criteria. "we conclude that only Nucleus Sampling satisfies all the distributional criteria for desirable generations." (§5.3) and it has the best HUSE score, 0.97 (Table 1, §6).
- Usual p values. "values of p are usually in [0.9, 1)" and "Sampling with temperatures lower than 0.9 severely increase repetition." (Figure 9 caption)
- Too-low settings of any method collapse to greedy. "all stochastic methods face repetition issues when their tuning parameters are set too low, which tends to overtruncate, mimicking greedy search." (§5.3)
- Beam search still fits tasks where the output is tightly tied to the input (translation, summarization): "since output is tightly scoped by the input, repetition and genericness are not as problematic." (§2)

## Visuals worth redrawing

- Figure 1: the unicorn prompt continued by beam search (loops, highlighted) vs pure sampling (incoherent). Two side-by-side boxes.
- Figure 5: a flat next-token distribution vs a peaked one, showing why a fixed k fails. Best visual for `top-p`.
- Table 1 as a bar chart of repetition % by method (greedy 73.66 vs nucleus 0.36 vs human 0.28).

## My notes

- 2019-2020, GPT-2 Large, open-ended story-like continuation. The numbers don't transfer directly to chat models tuned with RLHF.
- Some "Table 1" HUSE column values were misaligned in the PDF text; only nucleus = 0.97 (the best) is safe to use.
- They call top-k popular before them (Fan et al. 2018; GPT-2). They don't claim to invent top-k.
- `nguyen-min-p-sampling` (2024-25) argues top-p itself struggles at high temperature.
