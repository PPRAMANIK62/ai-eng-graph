---
id: patel-splitwise
title: "Splitwise: Efficient generative LLM inference using phase splitting"
author: Pratyush Patel, Esha Choukse, Chaojie Zhang, Aashaka Shah, Íñigo Goiri, Saeed Maleki, Ricardo Bianchini (Microsoft)
url: https://arxiv.org/abs/2311.18677
published: 2023-11-30
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

A Microsoft paper showing that the two phases of an LLM request need different hardware: prompt processing needs compute, token generation needs memory and barely uses the compute of the newest GPUs. They run the phases on separate machines and get more throughput for the same cost.

## Key claims

- Prompt processing is compute-heavy. "a compute-intensive prompt computation" (Abstract)
- Token generation is memory-heavy. "a memory-intensive token generation" (Abstract)
- Generation doesn't need top-end compute. "token generation phases do not require the compute capability of the latest GPUs" (Abstract)
- Mixing them wastes compute. Token generation "underutilizes compute resources" when run on the same hardware. (Abstract)
- The fix: separate machines per phase. "splitting the two phases of a LLM inference request on to separate machines" (Abstract)
- Results: 1.4x throughput at 20% lower cost, or 2.35x throughput at the same cost and power. "1.4x higher throughput at 20% lower cost than current designs" (Abstract)

## Visuals worth redrawing

- None used.

## My notes

- Only the abstract page was opened (v2, 2024-05-20).
- Disagrees in design with Sarathi-Serve (keep phases together, chunk the prefill). Agrees with DistServe.
