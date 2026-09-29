---
id: lindenbauer-complexity-trap
title: "The Complexity Trap: Simple Observation Masking Is as Efficient as LLM Summarization for Agent Context Management"
author: Tobias Lindenbauer, Igor Slinko, Ludwig Felder, Egor Bogomolov, Yaroslav Zharov (JetBrains)
url: https://arxiv.org/abs/2508.21433
published: 2025-08-29
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

JetBrains researchers compared two ways of keeping a coding agent's context short, inside SWE-agent on SWE-bench Verified: hiding old tool outputs behind a placeholder (observation masking) and having an LLM summarize old turns. Masking halved cost against the unmanaged agent and solved about as many tasks as summarization, and summarization made agents run longer. A hybrid (mask first, summarize as a last resort) saved a bit more. v3 (2025-10-27) is the NeurIPS 2025 DL4C workshop version; details below from its HTML.

## Key claims

- Headline. "a simple environment observation masking strategy halves cost relative to the raw agent while matching, and sometimes slightly exceeding, the solve rate of LLM summarization." (Abstract)
- Masking replaces "environment observations older than the window with a placeholder", keeping "the complete reasoning chain while reducing distant observation fidelity." Window M=10 turns. (Method, observation masking)
- Summarization (OpenHands-style) "condenses older turns into a running summary and preserving a few recent turns in full"; N=21 turns summarized, M=10 kept. (Method, LLM summarization)
- Qwen3-Coder 480B: masking 54.8% solved at $0.61 per instance (−52.7% vs raw); summary 53.8% at $0.64 (−50.4%). (Results table)
- Gemini 2.5 Flash: masking 35.6% at $0.18 (−56.1%); summary 36.0% at $0.24 (−41.5%). (Results table)
- Longer runs with summaries: for Gemini, "the mean trajectory length using LLM-Summary is 52 turns, which is a 15% increase over the mean trajectory length of the Observation Masking (44 turns)." Suggested reason: summaries "act as a reinforcing signal, encouraging the agent to keep going." (Analysis) Note: 52 vs 44 is an 18% increase; the paper's "15%" doesn't match its own means, so don't repeat the percentage.
- Five model setups were tested (Qwen3-32B with and without thinking, Qwen3-Coder 480B, Gemini 2.5 Flash with and without thinking); the Qwen3-Coder and Gemini 2.5 Flash (no thinking) rows are the ones quoted above. On Qwen3-32B (thinking), masking cut cost only 9.8%. (Table 1)
- Placeholder example: "Previous 8 lines omitted for brevity." (Method, observation masking)
- Summary calls cost "up to 7.2% of the total instance cost", and each "requires processing a unique sequence of turns, limiting cache reuse." (Analysis)
- Hybrid: masking during the run, summarization as a last resort, "reduces costs by 7% and 11% compared to just Observation Masking or LLM-Summary, respectively". (Hybrid)
- Limits: only software engineering on SWE-bench with "long, verbose tool outputs"; results "may not generalize to domains where agent-environment interactions are more succinct"; all strategies "use simple, non-adaptive heuristic triggers." (Limitations)

## Visuals worth redrawing

- Cost vs solve rate for raw, masking and summary, per model.

## My notes

- Measured on SWE-bench Verified, which OpenAI stopped reporting in 2026-02 (see latent-space-end-of-swe-bench-verified). The comparison between methods on the same tasks still stands.
