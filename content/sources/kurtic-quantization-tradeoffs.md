---
id: kurtic-quantization-tradeoffs
title: "\"Give Me BF16 or Give Me Death\"? Accuracy-Performance Trade-Offs in LLM Quantization"
author: Eldar Kurtic, Alexandre Marques, Shubhra Pandit, Mark Kurtz, Dan Alistarh (Red Hat and others)
url: https://arxiv.org/abs/2411.02355
published: 2024-11-04
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

ACL 2025 paper (v4 2026-05-26). Over 500,000 evaluations of the Llama-3.1 Instruct family (8B, 70B, 405B) at FP8, INT8 and INT4 weight-only, on academic and real-world benchmarks, plus speed and cost in vLLM on A6000, A100 and H100 GPUs. With well-tuned methods, all three formats keep about 99% of BF16 accuracy. INT4 weight-only wins on latency and cost when requests are served one at a time; 8-bit weights-and-activations win on throughput under heavy batching. Read in full (HTML v4).

## Key claims

- Headline. "(1) FP8 (W8A8-FP) is effectively lossless across all model scales, (2) well-tuned INT8 (W8A8-INT) achieves surprisingly low (1-3\%) accuracy degradation, and (3) INT4 weight-only (W4A16-INT) is more competitive than expected, rivaling 8-bit quantization." (Abstract)
- Naming: W4A16 means 4-bit weights, 16-bit activations; W8A8 means 8-bit weights and activations. (Introduction)
- The INT4 method is GPTQ, tuned. "Weights are compressed using GPTQ with MSE-optimal clipping, applied in 128-element groups." Calibration uses OpenPlatypus data because "random token calibration degrades accuracy". (Section 3, W4A16-INT)
- Calibration for INT8: "For calibration, random tokens suffice at 8B, but larger models require higher-quality calibration data". (Section 3, W8A8-INT)
- Plain rounding struggles at 4 bits. "However, RTN struggles at INT4 precision and suffers from lossy activation quantization even at INT8 (Dettmers et al., 2022)." (Background)
- Recovery on Open LLM Leaderboard V1: "On average, 8-bit quantization achieves 99.75% recovery, while W4A16-INT reaches a competitive 99.36%." Lowest task: TruthfulQA at 96.88% for W4A16-INT at 8B. (Section 4)
- Coding and long context: "8-bit achieving 99.9% recovery and 4-bit recovering 98.9%"; on RULER "quantized models achieve average score recovery of 98% across all formats". (Section 4, real-world)
- GPTQ vs AWQ at INT4: near-identical on academic benchmarks (AWQ ahead by 0.23 and 0.35 points out of 100), GPTQ ahead on real-world tasks by 2.9 and 0.8 points. They explain the gap with earlier studies (including Huang et al., 2024) by MSE-optimal clipping, better calibration data than the C4 default, and real-world benchmarks. (Section 3, INT4 Quantization Algorithms)
- Tuning changes the verdict. "the lack of hyperparameter tuning in some studies leads to misleading conclusions about accuracy, as we demonstrate in our experiments." (Related work)
- Why the best format depends on workload. "Weight quantization primarily accelerates decode by reducing memory movement, whereas weight-and-activation quantization improves computational efficiency in prefill." (Section 5)
- One request at a time: "For 8B and 70B models, W4A16-INT reduces cost per query by 2–3× and improves latency by 1.5–2.5× compared to the full-precision BF16 baseline." 405B on 4 A100 or H100 GPUs with W4A16 met thresholds that "previously required 16 GPUs in BF16". (Section 5.1)
- Many requests batched: "W8A8-INT and W8A8-FP yield the highest throughput, though W4A16-INT remains competitive and can outperform W8A8 in some scenarios." (Section 5.2)
- Smallest models drop most: on DeepSeek-R1-Distill reasoning tests, recovery is above 99% "except for the smallest models at INT4 which exhibit a bit larger but reasonable drops." (Section 4)
- Limits: KV cache, input embeddings and LM head compression not studied; multilingual effects not explored. (Limitations)

## Visuals worth redrawing

- Figure 4, accuracy recovery per format and model size.

## My notes

- Authors are affiliated with Red Hat (per the paper). Results are on Llama-3.1 only.
