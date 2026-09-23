---
id: zhong-distserve
title: "DistServe: Disaggregating Prefill and Decoding for Goodput-optimized Large Language Model Serving"
author: Yinmin Zhong, Shengyu Liu, Junda Chen, Jianbo Hu, Yibo Zhu, Xuanzhe Liu, Xin Jin, Hao Zhang
url: https://arxiv.org/abs/2401.09670
published: 2024-01-18
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

An OSDI 2024 paper arguing that running prefill and decode on the same GPUs makes them get in each other's way. It ties each phase to its own latency number (time to first token for prefill, time per output token for decode), puts the phases on different GPUs, and serves many more requests within latency targets.

## Key claims

- Common practice is to run both phases together, which causes interference. "this strategy not only leads to strong prefill-decoding interferences" (Abstract)
- Each phase has its own latency metric: TTFT for prefill, TPOT for decode. "time to first token (TTFT) for the prefill phase and time per output token (TPOT) of each request for the decoding phase" (Abstract)
- The fix: different GPUs per phase. "DistServe assigns prefill and decoding computation to different GPUs, hence eliminating prefill-decoding interferences" (Abstract)
- Result: 7.4x more requests or 12.6x tighter latency targets, with over 90% of requests within limits. "can serve 7.4x more requests or 12.6x tighter SLO" (Abstract)

## Visuals worth redrawing

- None used.

## My notes

- Abstract only (revised 2024-06-06).
- The TTFT-to-prefill, TPOT-to-decode mapping is the part the prefill-decode article needs.
