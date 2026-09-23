---
id: d2l-softmax-regression
title: Softmax Regression (Dive into Deep Learning, section 4.1)
author: Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola
url: https://d2l.ai/chapter_linear-classification/softmax-regression.html
published: 2023              # book v1.0.3; Cambridge University Press edition 2023
accessed: 2026-09-23
kind: book
primary: false
---

## Summary

The textbook explanation of softmax. Raw model outputs can be negative and don't add up to 1, so they can't be probabilities. Softmax fixes both: raise e to each score (always positive, keeps the order), then divide by the sum (now they add up to 1). It also explains where "temperature" comes from (Boltzmann's physics), why you work with logs of probabilities, and the overflow problem.

## Key claims

- Raw outputs aren't probabilities: nothing makes them sum to 1 or stay non-negative. "There is no guarantee that the outputs \(o_i\) sum up to \(1\) in the way we expect probabilities to behave." (4.1.1.2 The Softmax)
- Exponentiate first: that makes everything non-negative and keeps bigger scores bigger. "This does indeed satisfy the requirement that the conditional class probability increases with increasing \(o_i\) , it is monotonic, and all probabilities are nonnegative." (4.1.1.2)
- Then divide by the sum. "We can then transform these values so that they add up to \(1\) by dividing each by their sum. This process is called normalization." (4.1.1.2)
- The formula: softmax(o)_i = exp(o_i) / Σ_j exp(o_j). (Equation 4.1.3)
- Softmax keeps the order, so the top score is the top probability and you don't need softmax to find it. "because the softmax operation preserves the ordering among its arguments, we do not need to compute the softmax to determine which class has been assigned the highest probability." (4.1.1.2, Eq. 4.1.4)
- History and the name "temperature": the idea goes back to Gibbs (1902) and Boltzmann, who modelled gas energy states with exp(−E/kT), where T is temperature. "When statisticians talk about increasing or decreasing the “temperature” of a statistical system, they refer to changing \(T\) in order to favor lower or higher energy states." (4.1.1.2)
- Numerics: exponentiating big numbers overflows; frameworks handle it. "care must be taken to avoid exponentiating and taking logarithms of large numbers, since this can cause numerical overflow or underflow. Deep learning frameworks take care of this automatically." (4.1.1.3 Vectorization)
- A probability of exactly 1 is never reached with finite scores. "taking a softmax output towards \(1\) requires taking the corresponding input \(o_i\) to infinity" (4.1.2.1 Log-Likelihood)
- Training uses the negative log of the probability of the right answer (cross-entropy loss), because products of probabilities are awkward and logs turn them into sums. "Since maximizing the product of terms is awkward, we take the negative logarithm" (4.1.2.1)
- Subtracting the largest score before exponentiating is the stable way to compute it (posed as an exercise about the log-sum-exp). "Show that if we choose \(b = \mathrm{max}_i x_i\) we end up with a numerically stable implementation." (Exercises)
- Temperature exercises: what happens as temperature goes to 0 or to infinity. "What happens if we let the temperature approach \(0\) ?" (Exercises)

## Visuals worth redrawing

- None needed from the page. Our own: three logits as bars → exponentiated bars → normalized bars that sum to 1.

## My notes

- The max-subtraction trick is posed as an exercise, not stated as a result. Don't lean on it in an article beyond "frameworks handle overflow for you".
- Written for classification in general, not LLMs. Pair with `3blue1brown-transformers-gpt` for the LLM setting (logits over a vocabulary).
