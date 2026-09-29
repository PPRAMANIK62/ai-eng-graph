---
id: cunningham-constitutional-classifiers-pp
title: "Constitutional Classifiers++: Efficient Production-Grade Defenses against Universal Jailbreaks"
author: Hoagy Cunningham, Jerry Wei, et al. (Anthropic)
url: https://arxiv.org/abs/2601.04603
published: 2026-01-08
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The second generation of Anthropic's Constitutional Classifiers. Three changes: one "exchange" classifier that reads the output together with its input, a cascade where a cheap first stage screens all traffic and escalates only suspicious exchanges, and linear probes on the model's own activations as that cheap first stage. The production system flagged 0.05% of real traffic, escalated about 5.5% to the second stage, and cost a small fraction of the previous generation. Read from the arXiv PDF.

## Key claims

- The old system's cost. "Sharma et al. (2025) report a 23% computational overhead and a refusal rate of 0.38% on production traffic, which limited the deployment viability of their system." (Introduction)
- Two attack classes beat the first generation: reconstruction attacks that split harmful content into pieces, and output obfuscation attacks. (Introduction)
- The cascade. "We use a lightweight first-stage classifier to screen all exchanges, while a" more expensive classifier handles what it escalates. (Introduction, Section 4)
- Production design: "a weighted two-stage cascade, using a linear probe as the first stage and a probe-external classifier ensemble as the second stage." (Introduction)
- Shadow deployment on Claude Sonnet 4.5 traffic, 2025-12-01 to 2026-01-01: "The flag rate—the proportion of queries refused—was 0.05%". "The first-layer probe escalated approximately 5.5% of traffic to the second-stage classifier." (Section 6, Deployment metrics)
- Compute: "roughly an 8x reduction compared to the two-stage system described in Section 4, and approximately a 40x reduction compared to the single exchange classifier in Section 3." (Section 6)
- Table 1, "compute overhead relative to the last-generation system" (last generation = 100): exchange classifier 150.0, two-stage cascade 27.8, production grade 3.5. (Table 1)
- Red-teaming: "an estimated 1736 cumulative hours of red-teaming effort across approximately 198K attempts. Only one high-risk vulnerability was discovered". "No universal jailbreak was found capable of answering all eight target questions at half the level of detail provided by a model without safeguards." (Section 6, Robustness results)
- No defense is final: "no defenses are perfectly robust, and adversaries typically develop new attacks to circumvent previously effective defenses". (Introduction)
- Probes are cheap because they "reuse representations already computed during model sampling". (Section 5)
- Scope: jailbreak defenses "particularly those involving chemical, biological, radiological, and nuclear (CBRN) weapons". (Introduction)

## Visuals worth redrawing

- The cascade: all traffic → probe → ~5.5% escalated → classifier → block or allow.

## My notes

- The "40x" and the "3.5%" measure against different baselines (the single exchange classifier vs the previous generation), so they don't conflict. Anthropic's blog post on this system rounds the overhead to about 1% of compute; I didn't make a note of that page, so don't cite that figure.
