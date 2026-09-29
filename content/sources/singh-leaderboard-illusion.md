---
id: singh-leaderboard-illusion
title: The Leaderboard Illusion
author: Shivalika Singh, Yiyang Nan, Alex Wang, et al. (Cohere Labs and others)
url: https://arxiv.org/abs/2504.20879
published: 2025-04-29
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

A study of how Chatbot Arena (now LMArena, or Arena), the most-cited human-vote leaderboard, can be tilted. Big providers test many private variants and publish only the best, closed models get more battles and are removed less often, and access to Arena data can raise scores on the Arena distribution. The authors argue this rewards fitting Arena rather than being a better model. Revised 2025-05-12 (v2). Arena disputes several numbers (see `lmarena-leaderboard-illusion-response`). Only the abstract page was read.

## Key claims

- Private testing plus selective disclosure biases scores. "undisclosed private testing practices benefit a handful of providers who are able to test multiple variants before public release and retract scores if desired." (abstract)
- The extreme case. "we identify 27 private LLM variants tested by Meta in the lead-up to the Llama-4 release." (abstract)
- Closed models get more battles. "proprietary closed models are sampled at higher rates (number of battles) and have fewer models removed from the arena than open-weight and open-source alternatives." (abstract)
- Data shares. "Providers like Google and OpenAI have received an estimated 19.2% and 20.4% of all data on the arena, respectively. In contrast, a combined 83 open-weight models have only received an estimated 29.7% of the total data." (abstract)
- Arena data helps on Arena. "even limited additional data can result in relative performance gains of up to 112% on the arena distribution, based on our conservative estimates." (abstract)
- The conclusion. "these dynamics result in overfitting to Arena-specific dynamics rather than general model quality." (abstract)
- Choosing the best of many private scores inflates the published one. "We establish that the ability of these providers to choose the best score leads to biased Arena scores due to selective disclosure of performance results." (abstract)

## Visuals worth redrawing

- None used.

## My notes

- Arena says the 112% experiment ran on Arena-Hard (a static, LLM-judged benchmark), not on live Arena. I haven't read the paper body to check which.
