---
id: dong-xgrammar
title: "XGrammar: Flexible and Efficient Structured Generation Engine for Large Language Models"
author: Yixin Dong, Charlie F. Ruan, Yaxing Cai, Ruihang Lai, Ziyi Xu, Yilong Zhao, Tianqi Chen
url: https://arxiv.org/abs/2411.15100
published: 2024-11-22
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The paper behind XGrammar, a grammar engine for constrained decoding (MLSys 2025, v3 2025-05-12). JSON needs a context-free grammar, which needs a stack, so you can't precompute a token mask for every state the way you can for a regex. XGrammar's trick: most tokens can be checked from the current position in the grammar alone ("context-independent"), so their validity is precomputed; only a small rest needs the full stack at run time. It also runs the grammar work on the CPU while the GPU computes the next logits. Read the intro, background, method (3.1, 3.2) and the headline evaluation numbers in the HTML version.

## Key claims

- Constrained decoding sets invalid tokens to minus infinity before softmax, so the rest keep their relative odds. "Their logits are set to −∞, effectively assigning them zero probability after the softmax operation and preserving the relative probabilities of other valid tokens." (2.1)
- Why context-free grammars: they allow nesting, which regexes don't, so they can describe JSON and SQL. "Compared to alternative formats such as regular expressions, CFGs offer greater flexibility by allowing recursive structures" (1 Introduction)
- Three problems with running a CFG naively: checking every token in a vocabulary as large as 128k per step; a stack state that can't be fully precomputed; and tokens that cross grammar boundaries. "each token in the LLM generation comprises multiple characters, which may cross the boundaries of grammar elements and cause further recursion or stack pop during runtime execution." (1 Introduction)
- The stack is why you can't precompute everything. "the unbounded stack length results in an infinite number of possible states, making it impractical to precompute token masks for all scenarios" (2.2)
- The main idea. "XGrammar accelerates context-free grammar execution by dividing the vocabulary into context-independent tokens that can be prechecked and context-dependent tokens that need to be interpreted during runtime." (abstract)
- Tokens are handled byte by byte, so tokens that split a character or cross grammar edges still work. "This byte-level design allows each character edge to include one or more bytes, handling irregular token boundaries and supporting tokens containing sub-UTF8 characters." (3)
- Few tokens need the stack. "Experiments show that context-dependent tokens account for only a minor proportion, amounting to less than 1% (1134 out of 128k) for the Llama-3.1 model using JSON grammar." (3.1)
- Context expansion cuts those further. "this technique reduces context-dependent tokens by 90% (from 1,134 to 120)." (3.2)
- Storing the cache cleverly cuts memory for Llama-3.1 with a JSON grammar "from 160 MB to 0.46 MB". (3.1, Adaptive storage)
- Grammar work overlaps with GPU work. "we co-design the grammar engine with LLM inference engine to overlap grammar computation with GPU executions." (abstract)
- Headline speed claim. "Evaluation results show that XGrammar can achieve up to 100x speedup over existing solutions." (abstract)
- Per-token cost in their tests: "under 40 µs per token for JSON Schema and CFG (JSON)", with up to 3x speedup on JSON Schema and over 100x on CFG over the best baseline. (Evaluation, Figure 9 text)
- Authors' affiliations: Carnegie Mellon University, NVIDIA, Shanghai Jiao Tong University, UC Berkeley. (title page footnote)

## Visuals worth redrawing

- Figure 1 / Figure 4: vocabulary split into context-independent (precomputed) and context-dependent (checked at run time) tokens. Good as a simple two-bucket diagram.

## My notes

- These are the authors' own benchmarks. JSONSchemaBench (`geng-jsonschemabench`), written by people who build a competing engine, measured XGrammar slower per token than Guidance, and found it the most under-constrained on the JSON Schema Test Suite. The llguidance README says XGrammar's precomputation "often runs into seconds, and sometimes minutes". Three parties, three stories.
