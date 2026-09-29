---
id: lmarena-leaderboard-illusion-response
title: "Our Response to 'The Leaderboard Illusion' Writeup"
author: Arena (LMArena) team
url: https://arena.ai/blog/our-response/
published: 2025-05-09
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Arena's reply to "The Leaderboard Illusion" (last updated 2025-06-13). It accepts some recommendations (state openly that every provider may test multiple private variants, mark retired models, mark scores "provisional" after heavy pre-release testing) and disputes several numbers: the size of the pre-release boost, the share of open models, and whether the 112% gain was measured on Arena at all. Primary for Arena's policies; it's also the defendant, so read its rebuttals as one side.

## Key claims

- Policy changes promised. "we will mark model scores as "provisional" until additional 2,000 fresh votes have been collected after model release, if more than 10 models were pre-release tested in parallel." (preliminary plans)
- All providers may test variants. "In a future policy release, we will explicitly state that model providers are all allowed to test multiple variants of their models pre-release, subject to our system's constraints." (preliminary plans)
- Their estimate of the pre-release boost is small. "Our analysis shows the effect of pre-release testing is smaller than claimed with finite data (around +11 Elo after 50 tests and 3000 votes) and diminishes to zero as fresh evaluation data accumulates." (Claim: Pre-release testing can boost Arena Score by 100+ points)
- Why: new votes keep arriving. "Because Arena is constantly collecting fresh data from new users, selection bias quickly goes to zero." (same)
- The 112% figure came from a different benchmark. "The experiment cited for this gain was conducted on "Arena-Hard," a static benchmark with 500 data points that uses an LLM judge, and no human labels." (Claim: A 112% performance gain)
- Open model share. Official stats (2025-04-27) "show Open Models at 40.9%"; the paper missed open-weight models such as Llama and Gemma. (Claim: Open source models represent 8.8%)
- Same checkpoint, overlapping intervals: "scores like 1069 (±27) and 1054 (±18/22) have overlapping confidence intervals" (Claim: Submitting the same model checkpoint)
- Upsampling the best models is deliberate. "The best models, regardless of provider, are upsampled to improve the user experience." (Clarification)
- The pre-release testing policy was published 2024-03-01. (Claim: unstated policy)
- Retired models. "We will increase clarity about how models are retired from battle mode and explicitly mark which models are retired." (preliminary plans)

## Visuals worth redrawing

- None.

## My notes

- Arena later open-sourced its ranking code (Arena-Rank, 2025-12-18, https://arena.ai/blog/arena-rank, Bradley-Terry with style control and closed-form confidence intervals). Opened, not cited here.
- The two sides disagree on facts, not just framing. Neither has been checked by a third party that I've read.
