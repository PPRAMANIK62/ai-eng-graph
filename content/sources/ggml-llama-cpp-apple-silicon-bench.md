---
id: ggml-llama-cpp-apple-silicon-bench
title: Performance of llama.cpp on Apple Silicon M-series (discussion #4167)
author: Georgi Gerganov and llama.cpp community contributors
url: https://github.com/ggml-org/llama.cpp/discussions/4167
published: 2023-11-22
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

A community benchmark thread started by llama.cpp's maintainer. Everyone runs the same `llama-bench` command on Llama 2 7B at F16, Q8_0 and Q4_0 and reports prompt processing (512 tokens at once) and text generation (one token at a time) in tokens per second, next to each chip's memory bandwidth and GPU core count. The main table uses one fixed 2023 build so chips are comparable. These are contributed measurements, not a spec.

## Key claims

- What is measured. "PP means "prompt processing" (bs = 512), TG means "text-generation" (bs = 1), t/s means "tokens per second"" (Description)
- Fixed build for fairness. "Note that in this benchmark we are evaluating the performance against the same build 8e672ef (2023 Nov 21) in order to keep all performance factors even." (Description)
- Newer builds are faster: M2 Ultra Q4_0 TG went from 94.27 t/s (2023-11-21 build) to 108.80 t/s (2024-11-12 build with flash attention). (Description, over-time table)
- Summary table, build 8e672ef (chip, bandwidth GB/s, GPU cores, F16 PP, F16 TG, Q8_0 TG, Q4_0 PP, Q4_0 TG): M1 68/8 — no F16, Q8_0 TG 7.91, Q4_0 TG 14.15; M2 100/10 201.34, 6.72, 12.21, 179.57, 21.91; M4 120/10 230.18, 7.43, 13.54, 221.29, 24.11; M3 Pro 150/18 357.45, 9.89, 17.53, 341.67, 30.74; M2 Pro 200/16 312.65, 12.47, 22.70, 294.24, 37.87; M4 Pro 273/20 464.48, 17.18, 30.69, 439.78, 50.74; M2 Max 400/30 600.46, 24.16, 39.97, 537.60, 60.99; M4 Max 546/40 922.83, 31.64, 54.05, 885.68, 83.06; M2 Ultra 800/60 1128.59, 39.86, 62.14, 1013.81, 88.64; M2 Ultra 800/76 1401.85, 41.02, 66.64, 1238.48, 94.27. (Summary table)
- File size of the test model, from the raw `llama-bench` output posted for each chip: "llama 7B mostly F16 | 12.55 GiB | 6.74 B" (Q8_0 6.67 GiB, Q4_0 3.56 GiB). (M1 Pro and M2 Ultra results)
- Same bandwidth, more GPU cores: M2 Ultra 60 vs 76 cores, PP F16 1128.59 vs 1401.85, TG F16 39.86 vs 41.02. Prompt processing follows cores; generation barely moves. (Summary table)

## Visuals worth redrawing

- The thread's own plot: "TG vs Bandwidth" and "PP vs GPU Cores". Redraw TG vs bandwidth for F16 and Q4_0.

## My notes

- Community-contributed data; the table rows are the maintainer-curated summary in the first post.
- M5 rows use a newer build, so they aren't comparable with the rest; left out.
