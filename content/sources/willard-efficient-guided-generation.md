---
id: willard-efficient-guided-generation
title: Efficient Guided Generation for Large Language Models
author: Brandon T. Willard, Rémi Louf
url: https://arxiv.org/abs/2307.09702
published: 2023-07-19
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The paper behind the Outlines library. It recasts text generation as moving between states of a finite-state machine, then builds an index over the model's vocabulary so that, at each step, you know which tokens keep the output valid for a regex or grammar. Only abstract-level claims are recorded here; the body is for the phase 3 `constrained-decoding` node.

## Key claims

- Core idea: generation as transitions in a finite-state machine. "the problem of neural text generation can be constructively reformulated in terms of transitions between the states of a finite-state machine." (abstract)
- Works for regexes and context-free grammars, via an index over the vocabulary. "allowing the construction of an index over a language model's vocabulary." (abstract)
- Model agnostic, and guarantees the structure of the output. "enables the construction of reliable interfaces by guaranteeing the structure of the generated text." (abstract)
- Cheap at run time. "It adds little overhead to the token sequence generation process" (abstract)
- Implemented in Outlines. "An implementation is provided in the open source Python library Outlines" (abstract)
- The naive approach checks every vocabulary token at every step. "This approach entails a fixed O(N ) cost for each token generated, where N is the size of the LLM’s vocabulary." (1 Introduction; the PDF text has a space before the parenthesis)
- Their index turns that into a lookup. "The result is an algorithm that costs O(1) on average." (1 Introduction)
- The mask is a boolean vector over the vocabulary multiplied into the logits, so masked tokens can't be sampled. (2.2 Guiding generation, Algorithm 2)
- Worked example: the regex ([0-9]*)?\.?[0-9]* for floats, with a toy vocabulary of "A", ".", "42", ".2" and "1". At the start "A" is masked. "If we sample ".2", we advance the FSM to state 3. In this case, only "42" and "1" are valid completions" (3, Example 1 and Figure 1)
- Tokens can start anywhere in the pattern, so the index is built from every state. "we consider starting in every viable FSM state, because the strings in the vocabulary could match arbitrary parts of a regular expression" (3)
- The index is a map from state to allowed tokens, built before generation. "since σ is constructed outside of the token sampling procedure, its run-time cost is effectively irrelevant" (3, after Algorithm 3)
- The approach extends to context-free grammars through LALR(1) parsers, for JSON, Python, SQL. (1 Introduction)

## Visuals worth redrawing

- Not checked (abstract only). For phase 3, open the paper's FSM figures.

## My notes

- Submitted 2023-07-19, final version v4 2023-08-19.
- Only the abstract was read. Enough for one paragraph saying "the valid next tokens are worked out ahead of time from the grammar"; anything deeper waits for the phase 3 node.
