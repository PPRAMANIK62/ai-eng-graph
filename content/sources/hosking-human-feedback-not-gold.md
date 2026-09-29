---
id: hosking-human-feedback-not-gold
title: Human Feedback is not Gold Standard
author: Tom Hosking, Phil Blunsom, Max Bartolo
url: https://arxiv.org/abs/2309.16349
published: 2023-09-28
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Tests whether a single human preference score captures what matters in an LLM answer. Crowdworkers rated outputs overall and also marked ten specific error types. Overall scores barely reflected factual errors. Then the authors made models answer more or less assertively: crowdworkers missed more factual errors in confident answers and rated confident answers higher overall. Accepted at ICLR 2024. Read from the arXiv PDF.

## Key claims

- The question: "it is not clear which properties of a generated output this single ‘preference’ score captures." (Abstract)
- Factuality is under-weighted: "while preference scores have fairly good coverage, they under-represent important aspects like factuality." (Abstract)
- Confidence fools raters: "the assertiveness of an output skews the perceived rate of factuality errors, indicating that human annotations are not a fully reliable evaluation metric or training objective." (Abstract)
- Training on human feedback may make models more confident: "using human feedback as a training objective disproportionately increases the assertiveness of model outputs." (Abstract)
- Some errors are easier to spot: agreement between annotators ranged "between 0.64 (for Factuality) and 0.94 (for Refusal)"; "refusal is straightforward to detect, whereas checking for factual errors involves significantly more effort." (2.1)
- In the overall score, "Factuality and inconsistency errors both contribute but with much lower weighting, indicating that a single preference score is likely to obscure failures in these important criteria." (2.2)
- Method for the second study: the authors "carefully annotate a subset of 300 examples for each error type, to act as a set of ‘expert’ annotations." (3.1)
- Crowdworkers vs those careful labels: "Crowdworkers underestimate the rate of factuality and inconsistency errors. This difference is increased for high assertiveness responses". "annotators are more trusting of assertive responses, and are less likely to identify factuality or inconsistency errors within them." (3.2)
- Figure 4 numbers, factuality error rate, crowdworkers minus expert annotations: −5.3% for low-assertiveness answers, −16.2% for the baseline, −22.3% for high-assertiveness answers. (Figure 4)
- Confidence and quality: "Assertiveness is strongly positively correlated with overall quality scores, with a Pearson correlation coefficient of 0.68". (4)
- The advice: "We encourage future work to carefully consider whether preference scores are well aligned with the desired objective." (Abstract)

## Visuals worth redrawing

- Figure 4's factuality row as three bars (low assertiveness, baseline, high assertiveness): how many factual errors crowdworkers missed compared with careful annotation.

## My notes

- The raters are crowdworkers (Prolific) and the "experts" are the authors. It says more about quick crowd ratings than about a domain expert with time and tools, which is what the Husain/Shankar method uses. Still the best evidence here that a person's verdict isn't automatically the truth.
- The Figure 4 values are differences in error rates in percentage points.
