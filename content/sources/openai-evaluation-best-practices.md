---
id: openai-evaluation-best-practices
title: Evaluation best practices
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/evaluation-best-practices
published: undated           # no date on the page; mentions gpt-6-astra and the Evals platform shutting down 2026-11-30
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

OpenAI's guide to designing evals for your own LLM app. It separates three meanings of "evals" (benchmarks, standard metrics, your own tests), gives a five-step process (objective, dataset, metrics, run and compare, evaluate continuously), lists anti-patterns, and describes metric-based, human and LLM-judge evaluators with their weak spots. It also notes that OpenAI's hosted Evals platform is being shut down, which doesn't change the method.

## Key claims

- Why normal tests aren't enough: "Models sometimes produce different output from the same input, which makes traditional software testing methods insufficient for AI architectures." (intro)
- Platform deprecation: "Evals will become read-only for existing users on October 31, 2026, and the platform is scheduled to shut down on November 30, 2026." (notice at top)
- Definition: "Evals are structured tests for measuring a model’s performance." (What are evals?)
- Three meanings of "evals": "Industry benchmarks for comparing models in isolation, like MMLU", "Standard numerical scores—like ROUGE, BERTScore", and "Specific tests you implement to measure your LLM application’s performance". (Types of evals)
- Scores alone aren't enough: "There’s more to evals than just scores. Combine metrics with human judgment to ensure you’re answering the right questions." (How to read evals)
- Tips: "Adopt eval-driven development: Evaluate early and often." "Design task-specific evals". "Log everything: Log as you develop so you can mine your logs for good eval cases." "Automate when possible". "Maintain agreement: Use human feedback to calibrate automated scoring." (Evals tips)
- Anti-patterns: "Overly generic metrics: Relying solely on academic metrics like perplexity or BLEU score." "Biased design: Creating eval datasets that don’t faithfully reproduce production traffic patterns." "Vibe-based evals: Using “it seems like it’s working” as an evaluation strategy, or waiting until you ship before implementing any evals." "Ignoring human feedback". (Anti-patterns)
- Process: "Define eval objective", "Collect dataset", "Define eval metrics", "Run and compare evals", "Continuously evaluate". Continuous evaluation means "run evals on every change, monitor your app to identify new cases of nondeterminism, and grow the eval set over time." (Design your eval process)
- Dataset sources to consider: "synthetic eval data, domain-specific eval data, purchased eval data, human-curated eval data, production data, and historical data." (Design your eval process)
- Test data mix: "Ensure your test data includes typical cases, edge cases, and adversarial cases." (Example: Q&A over docs)
- LLMs grade comparisons better than open writing: "LLMs are better at discriminating between options." (Example: Summarizing transcripts)
- Metric-based evals, e.g. "Exact match, string match, ROUGE/BLEU scoring, function call accuracy, executable evals", but they "May not be tailored to specific use cases, may miss nuance". (Metric-based evals)
- Human evals "provide the highest quality but are slow and expensive." Tip: "Include a pass/fail threshold in addition to the numerical score". (Human evals)
- LLM judges are "cheaper to run and more scalable than human evaluation", with "Position bias (response order), verbosity bias (preferring longer responses)". Advice: "Use pairwise comparison or pass/fail for more reliability". (LLM-as-a-judge and model graders)
- "No strategy is perfect." (end of evaluator section)
- Edge cases to include: non-English input, other formats, typos, "Multiple questions or intents in a single request", "Short requests with minimal context (e.g., if a user just says: “returns”)", jailbreak attempts. (Handle edge cases)

## Visuals worth redrawing

- The five-step eval process as a loop (objective, dataset, metrics, run and compare, continuous).

## My notes

- Pairs with anthropic-develop-tests: same broad advice (task-specific, automate, calibrate against humans) from a second vendor.
- The hosted Evals platform going away mirrors OpenAI's prompt-object deprecation (openai-prompt-engineering): keep evals in your own code.
