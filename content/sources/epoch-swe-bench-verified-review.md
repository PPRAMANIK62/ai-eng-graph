---
id: epoch-swe-bench-verified-review
title: SWE-bench Verified – Benchmark Review
author: Epoch AI
url: https://epoch.ai/benchmarks/swe-bench-verified/review
published: 2026-09-03
accessed: 2026-09-29
kind: blog
primary: false
---

## Summary

Epoch AI's review of SWE-bench Verified gives it a "Flawed" verdict. It explains what the benchmark is (500 bug fixes from 12 Python repos, a reviewed subset of the original 2,294 SWE-bench tasks) and reports OpenAI's 2026-02-23 audit: many tests reject correct fixes, and every frontier model tested had seen some of the problems in training. Not primary for OpenAI's audit (it quotes OpenAI's post, which returns 403 for us), primary for Epoch's own verdict and rubric.

## Key claims

- What the benchmark asks. "Given a codebase and an issue, a language model is tasked with generating a patch that resolves the described problem." (intro)
- Size and origin. "SWE-bench Verified consists of 500 bug fixes sourced from 12 repos. It is a subset of the original 2,294 SWE-bench problems created through independent review by 3 experts to attempt to remove problems that had issues." (Methodology)
- Static benchmarks get contaminated. "SWE-bench Verified is a static benchmark, so it can be assumed that all current and future models have been trained on the codebases used in its tasks, leading to contamination." (intro)
- OpenAI's audit numbers. "On February 23, 2026, OpenAI released their audit results. They audited 27.6% of the tasks, finding that 59.4% had flawed test cases that rejected functionally correct submissions (floor of 16.4% of tasks broken)." (Methodology)
- Contamination across all frontier models, quoting OpenAI: all frontier models tested "have seen at least some of the problems and solutions during training". (Methodology)
- OpenAI's conclusion, quoted: "improvements on SWE-bench Verified no longer reflect meaningful improvements in models' real-world software development abilities. Instead, they increasingly reflect how much the model was exposed to the benchmark at training time." (Methodology)
- Scaffold dependence, from Epoch's 2025-06-13 review: "results are highly dependent on the scaffold used." (Methodology)
- A reward hack exists. "RDI identified a reward hack that achieves a perfect score." (Methodology)
- Epoch's bar for "Flawed": 20% or more of an inspected sample has errors. "≥20% of inspected sample† contains errors or there is an issue that corrupts grading at scale" (Rubric, Scoring)
- As of 2026-09-03, 100% of tasks and 100% of solutions are public. (Rubric, Evaluation Quality)
- The audit focused on unsolved tasks. "An audit by OpenAI found that over half of commonly unsolved questions had test cases that rejected functionally correct submissions." (intro)

## Visuals worth redrawing

- None. The rubric table is theirs.

## My notes

- The primary OpenAI post (https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/) returned HTTP 403, with WebFetch and with curl. Claims about OpenAI's audit rest on this review and the Latent Space interview (`latent-space-end-of-swe-bench-verified`).
- The review doesn't name the replacement benchmark. The Latent Space piece says SWE-Bench Pro.
