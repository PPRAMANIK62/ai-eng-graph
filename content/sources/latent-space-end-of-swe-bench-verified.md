---
id: latent-space-end-of-swe-bench-verified
title: "The End of SWE-Bench Verified — Mia Glaese & Olivia Watkins, OpenAI Frontier Evals & Human Data"
author: swyx (Latent Space), with Mia Glaese and Olivia Watkins (OpenAI)
url: https://www.latent.space/p/swe-bench-dead
published: 2026-02-23
accessed: 2026-09-29
kind: talk
primary: true
---

## Summary

A podcast episode with a written intro and transcript, published the day OpenAI stopped reporting SWE-bench Verified. Two people from the OpenAI team that built Verified explain why: the benchmark is saturated, many remaining tests reject correct fixes, and frontier models have seen the tasks. They switch to SWE-Bench Pro. Primary for OpenAI's reasoning (the speakers are the builders); the intro is swyx's commentary. The transcript is auto-generated and has transcription errors, so quotes below come from the written intro or are clearly legible transcript lines.

## Key claims

- Frontier scores had bunched up near 80%. "most frontier model numbers consistently report around 80%" (intro)
- The two kinds of bad test found in a deeper look at problematic tasks: tests "too narrowly defined (so that they also reject functionally correct submissions)" and tests "looking for extra features that were never mentioned in the problem description." (intro)
- Why contamination happens without cheating. "SWE-bench problems are sourced from open-source repositories many model providers use for training purposes, and the sheer popularity of SWE-bench means examples leak into other corpuses over time." (intro)
- How it was found: a model solved "unsolvable" problems, and its chain of thought showed it knew unstated test requirements. "Taking a closer look at how GPT-5.2 somehow solved "unsolvable" problems then led the team to read the chain of thought and find test requirements that were never specified, and yet known by the model." (intro)
- Models could reproduce gold patches from the task ID alone: frontier models were "able to reproduce the original gold patch or problem statements from the eval verbatim with minimal prompting, just from SWE-Bench Verified Task ID alone" (intro, "Contamination")
- The thesis, from the OpenAI side. "we realized that this is because the eval is effectively saturated and also highly contaminated." (transcript, ~00:01:00)
- How Verified was built: close to a hundred software engineers reviewed the tasks. "hiring like almost a hundred real world software engineers to go through the problems" (transcript, 00:02:32)
- Benchmarks have a lifecycle: useful when models score around 20%, meaningless at the top. "by the time that you hit like very high performance on the benchmarks, like additional like 0.1% improvements, it's become sort of like meaningless" (transcript, ~00:08:56)
- Why SWE-Bench Pro: harder, more diverse, less contaminated. "the SWE-Bench Pro problems are just bigger and harder." (transcript, 00:10:41)
- Most Verified tasks were small: "90% of the problems are things that were estimated to take like an expert software engineer like less than an hour." (transcript, 00:10:41)
- Contamination was found across labs' models, including Claude Opus 4.5 and Gemini Flash, using a "contamination auditor agent". (transcript, ~00:11:00–00:11:42)
- The next frontier: open-ended design decisions and code quality, which are "harder to measure, frankly." (transcript, ~00:14:48)
- Not everyone agrees it's saturated: the original SWE-bench authors "still assert that the "ceiling" for a saturation call should be closer to 87-95%". (intro)
- It still measures something real, just not progress at the top. "Now that we are like 80%, we don't really trust like further improvements on it, but like it does match on something that is like a via, via like capability of motors." (transcript, 00:14:05; "motors" is the transcript's error for "models")
- SWE-Bench Pro showed only "very light evidence" of contamination in the same audit. (transcript, 00:12:01)
- New frontier releases barely moved the score: "the very very minor bumps on SWE-Bench Verified scores every time a new frontier model is released" (intro)

## Visuals worth redrawing

- None.

## My notes

- The transcript is machine-made ("Suite bench", "murders" for "models"). Paraphrase from it carefully.
- Published 2026-02-23, the same day as OpenAI's audit post per Epoch.
- The intro gives counts for that deeper look (a number of tasks, and counts of narrow and wide tests) that don't reconcile with Epoch's quote of OpenAI's audit (27.6% of tasks audited, 59.4% of those flawed). Don't cite the counts; use Epoch's percentages.
