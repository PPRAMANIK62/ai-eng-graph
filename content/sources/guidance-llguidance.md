---
id: guidance-llguidance
title: "Low-level Guidance (llguidance)"
author: guidance-ai (Microsoft), Michał Moskal and contributors
url: https://github.com/guidance-ai/llguidance
published: 2025-06-23
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

The README of llguidance, the Rust grammar engine behind the Guidance library. It computes the allowed-token mask on the fly at each step instead of precomputing it, using an Earley parser over a lexer and a walk over a prefix tree of the vocabulary. The README lists its integrations (OpenAI Structured Outputs, vLLM, SGLang, llama.cpp, Chromium) and compares itself with Outlines and XGrammar. `published` is the v1.0.0 date from the news list.

## Key claims

- What it does and how fast. "It can enforce arbitrary context-free grammar on the output of LLM and is fast - on the order of 50μs of CPU time per token (for 128k tokenizer) with negligible startup costs." (About)
- Formats: a large subset of JSON Schema, regexes, and context-free grammars in a Lark-like format. (About)
- It powers OpenAI's Structured Outputs for JSON Schema. "LLGuidance powers Structured Output (JSON Schema only)" (Integrations). News entry: "2025-05-20 LLGuidance shipped in OpenAI for JSON Schema". (news list)
- Also merged into llama.cpp (2025-02-01), SGLang (2025-02-26), vLLM (2025-03-25) and Chromium (2025-04-11). (news list)
- What a mask is. "Given a context-free grammar, a tokenizer, and a prefix of tokens, llguidance computes a token mask - a set of tokens from the tokenizer - that, when added to the current token prefix, can lead to a valid string in the language defined by the grammar." (Technical details)
- How: Earley parser over a regex-derivative lexer, and a walk over a trie of all tokens. "Mask computation is achieved by traversing the prefix tree (trie) of all possible tokens" (Technical details)
- On Outlines: precomputing a mask per state is fast at sampling time but costly up front. "potentially making sampling fast but inherently limiting constraint complexity and introducing significant startup cost and memory overhead." (Comparison and performance)
- On XGrammar: "The pre-computation often runs into seconds, and sometimes minutes." When it doesn't fit the input, "the mask computation times can run to tens or hundreds of milliseconds." (Comparison and performance)
- Its own worst cases: a full mask for a typical JSON schema takes about 1.5 ms, but a shortcut ("slicer") usually applies, so the average on JSONSchemaBench (2.5M tokens, 10k schemas) is under 50μs, "with less than 1% of masks taking longer than 1ms". (Comparison and performance)
- Why microseconds matter: the mask is CPU work that must finish before the GPU's next step. "with 16 cores and a 10ms forward pass, llguidance can handle batch sizes up to 3200 without slowing down the model." (Comparison and performance)
- It is the grammar engine inside the Guidance library. "2025-01-07 Guidance v0.2.0 released, using llguidance as the grammar engine" (news list)
- SGLang lets you choose it as the grammar backend with `--grammar-backend llguidance`; llama.cpp via a cmake option. (Integrations)

## Visuals worth redrawing

- The MaskBench hero plot (mask time per engine). Not redrawn; numbers are the authors' own.

## My notes

- Vendor source: the comparisons with Outlines and XGrammar are written by a competitor. JSONSchemaBench, which found Guidance best, also comes from this team (several Microsoft authors).
