---
id: hinton-distilling-knowledge
title: Distilling the Knowledge in a Neural Network
author: Geoffrey Hinton, Oriol Vinyals, Jeff Dean (Google)
url: https://arxiv.org/abs/1503.02531
published: 2015-03-09
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The paper that named distillation. A big model (or an ensemble) is expensive to run, so train a small model to match the big one's full probability distribution over classes, its "soft targets", rather than only the right answers. A higher softmax temperature makes those distributions softer so the small model can learn from the small probabilities too. Results on MNIST and on Google's speech recognition model. Read in full as text from the PDF.

## Key claims

- Why: the big model is costly to deploy. Using a whole ensemble "may be too computationally expensive to allow deployment to a large number of users, especially if the individual models are large neural nets." (Abstract)
- Wrong answers carry information. "An image of a BMW, for example, may only have a very small chance of being mistaken for a garbage truck, but that mistake is still many times more probable than mistaking it for a carrot." (§1)
- The small probabilities show how the model generalizes. "The relative probabilities of incorrect answers tell us a lot about how the cumbersome model tends to generalize." (§1)
- But at normal temperature they barely count. For MNIST the useful information "has very little influence on the cross-entropy cost function during the transfer stage because the probabilities are so close to zero." (§1)
- Soft targets. Use "the class probabilities produced by the cumbersome model as “soft targets” for training the small model." (§1)
- Soft targets teach more per example. "When the soft targets have high entropy, they provide much more information per training case than hard targets and much less variance in the gradient between training cases" (§1)
- Temperature. "Our more general solution, called “distillation”, is to raise the temperature of the final softmax until the cumbersome model produces a suitably soft set of targets." After training, the student uses a temperature of 1. (§1, §2)
- Mix with the real labels. They use "a weighted average of two different objective functions": cross-entropy with the soft targets at high temperature, and with the correct labels at temperature 1. (§2)
- MNIST: big net 67 test errors, small net trained normally 146, small net trained on soft targets at temperature 20: 74. (§3)
- Speech (Android voice search acoustic model, about 85M parameters): baseline 58.9% frame accuracy and 10.9% word error rate; 10-model ensemble 61.1% / 10.7%; one distilled model 60.8% / 10.7%. (Table 1, §4.1)
- Soft targets as a regularizer: trained on 3% of the data, hard targets overfit to 44.5% test frame accuracy, soft targets reached 57.0% (the full-data baseline was 58.9%). (§6, Table 5)

## Visuals worth redrawing

- A hard target (one-hot) beside a soft target at T=1 and at a high T, for one example.

## My notes

- The classic setup needs the teacher's probabilities. LLM "distillation" today often trains only on the teacher's sampled text (see `deepseek-r1`).
