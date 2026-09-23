---
id: agrawal-sarathi-serve
title: Taming Throughput-Latency Tradeoff in LLM Inference with Sarathi-Serve
author: Amey Agrawal, Nitin Kedia, Ashish Panwar, Jayashree Mohan, Nipun Kwatra, Bhargav S. Gulavani, Alexey Tumanov, Ramachandran Ramjee
url: https://arxiv.org/abs/2403.02310
published: 2024-03-04
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

A paper that keeps prefill and decode on the same GPUs but cuts each prefill into chunks, so a long new prompt doesn't freeze the token generation of everyone else in the batch. The opposite design choice to Splitwise and DistServe.

## Key claims

- Prefill is slow but uses the GPU fully. "Prefill iterations have high latency but saturate GPU compute due to parallel processing of the input prompt." (Abstract)
- Decode is fast per step but uses the GPU poorly. "In contrast, decode iterations have low latency but also low compute utilization because a decode iteration processes only a single token per request." (Abstract)
- Mixing them in one batch makes it hard to get both throughput and latency. "Batching multiple requests leads to an interleaving of prefill and decode iterations which makes it challenging to achieve both high throughput and low latency." (Abstract)
- The fix: chunked prefills that never pause ongoing decodes. "Sarathi-Serve introduces chunked-prefills which splits a prefill request into near equal sized chunks and creates stall-free schedules that adds new requests in a batch without pausing ongoing decodes." (Abstract)
- Results: 2.6x capacity for Mistral-7B on one A100, 3.7x for Yi-34B on two A100s, up to 5.6x for Falcon-180B, compared with vLLM. (Abstract)

## Visuals worth redrawing

- None used.

## My notes

- Abstract only (revised 2024-06-17).
- The "generation stall" idea explains a real symptom: a user's stream can pause while the server processes someone else's long prompt.
