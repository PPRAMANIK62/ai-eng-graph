---
id: epoch-open-closed-gap
title: Open models lag state-of-the-art closed models by 4 months
author: Jack Edwards and Luke Emberson (Epoch AI)
url: https://epoch.ai/data-insights/open-closed-eci-gap
published: 2026-05-29
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

A data insight measuring how far the best open-weight model trails the best closed model on Epoch's Capabilities Index (ECI), a composite of many benchmarks, from 2026-01-01 to 2026-05-28. The average gap was about four months, or 8 ECI points. The number depends on the definition (six months under a stricter one), and Epoch says it probably understates the gap because open models tend to do worse on private benchmarks.

## Key claims

- The headline. "Since January 2026, the most capable open-weight models have lagged frontier closed models by an average of four months in the Epoch Capabilities Index (ECI), our aggregate measure of model capability." (top)
- In points. "The average ECI gap was 8 points, similar to the gap between GPT-5 and GPT-5.5." (top)
- What ECI is. "ECI is a composite measure that captures performance across many benchmarks." (Learn more about this graph)
- How the time gap is computed: for each day, take the best open model so far and find "the most recent date on which the SOTA model was not significantly better than this open-weight model". (Analysis)
- Definition matters. "This estimate would grow to six months if we required that the open-weight model's point estimate for ECI be strictly higher than the closed-weight model it is catching up to" (Analysis)
- Uncertainty on the point gap. "We find an average ECI gap of 8 points, with a 90% confidence interval of 7 to 11 units." (Analysis)
- Probably understated, reason 1. "evidence suggests that open-weight models tend to perform worse on private benchmarks compared to closed models, plausibly because they more aggressively hillclimb on public benchmarks." (Limitations)
- Probably understated, reason 2. "Leading closed labs do not always release their most capable models, for safety, commercial, or competitive reasons." (Limitations)
- Trend. The gap is "slightly larger" than in Epoch's October 2025 insight, "which found that open models lagged by an average of three months between January 2023 and October 2025." (below chart)

## Visuals worth redrawing

- The frontier of closed vs open ECI over time (their chart is interactive; redraw only with their CSV).

## My notes

- Only models with enough public benchmark coverage get an ECI, so the measure is built from public benchmarks, the ones open models are said to hill-climb.
