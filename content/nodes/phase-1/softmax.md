---
id: softmax
title: What is softmax?
depth: short
phase: 1
note: >-
  Turns the model's raw scores into probabilities that add up to 1.
needs: []
leads_to: [logprobs, sampling]
compare_with: []
status: review
updated: 2026-09-23
---

# What is softmax?

Softmax is the small function at the very end of an LLM that turns its raw
scores into probabilities. Every time a model picks a token, softmax ran
just before. You'll meet it again in temperature, logprobs and sampling, so
it's worth understanding once.

## The problem: scores aren't probabilities

At each step, a language model ends with one number per token in its
vocabulary. For GPT-3 (2020) that's 50,257 numbers. These raw scores are
called **logits**. A high logit means "this token fits well here".

Logits can be anything: 7.2, 0.3, −4.1. They can be negative, and they
don't add up to anything in particular. You can't pick a token "with 30%
chance" from a list like that. You need numbers that are all positive and
add up to 1.

## Two steps: exponentiate, then divide by the total

Softmax does it in two moves.

1. **Raise e to the power of each score.** e to any power is positive, so
   every negative score becomes a small positive number. Bigger scores
   stay bigger.
2. **Divide each result by their sum.** Now they add up to 1.

As a formula, for scores o₁, o₂, …:

> softmax(o)ᵢ = e^oᵢ / (e^o₁ + e^o₂ + …)

Here's a worked example with three tokens. The numbers are made up, the
arithmetic is real:

| Token | Logit | e^logit | ÷ total (30.19) |
|---|---|---|---|
| learn | 3 | 20.09 | 0.665 |
| predict | 2 | 7.39 | 0.245 |
| make | 1 | 2.72 | 0.090 |

Three scores in, three probabilities out, summing to 1. In a real model the
same thing happens across the whole vocabulary at once.

![Three bar charts for learn, predict and make: raw scores 3, 2, 1 become 20.09, 7.39, 2.72 after exponentiating, then 0.665, 0.245, 0.090 after dividing by the total, which sums to 1.](img/softmax-two-steps.svg)

## What softmax keeps, and what it changes

**It keeps the order.** The highest logit always becomes the highest
probability. If all you want is the single most likely token, you can skip
softmax and just take the biggest logit.

**It stretches the gaps.** Look at the table again. "learn" was only one
point ahead of "predict", but it ends up with almost three times the
probability. Exponentiating rewards the leader.

**Only the differences matter.** Add 10 to every logit (13, 12, 11) and
you get exactly the same probabilities, 0.665, 0.245 and 0.090. What moves
the result is how far apart the scores are. Double the gaps (6, 4, 2) and
"learn" jumps to 0.867. Halve them (1.5, 1, 0.5) and it falls to 0.506.

That last point is exactly what [[temperature]] does. It divides every
logit by one number before softmax runs, spreading the scores apart or
squeezing them together.

## Where it gets tricky

**Nothing ever gets exactly 0 or 1.** e to any finite power is above zero,
so every token in the vocabulary keeps some small chance, however unlikely.
To reach exactly 1, a logit would have to be infinite. This long tail of
tiny chances is why picking tokens purely at random can go wrong, covered
in [[sampling]].

**Big numbers overflow.** e to a large logit is too big for a computer to
store. Deep learning libraries handle this for you, so you'll only hit it
if you write softmax by hand.

**The word "temperature" comes from physics.** The idea behind softmax goes
back to Boltzmann and Gibbs, who used the same exponential to describe how
likely a gas molecule is to be in each energy state. Temperature in that
formula shifts which states are favored, and LLMs borrowed the name.

**A probability isn't a fact about the world.** Softmax always produces a
tidy distribution, even when the model has no good idea what comes next.
A clean 0.665 says the model preferred "learn" at that step, not that it's
right.

## What this means when you build

- When an API shows you token probabilities or [[logprobs]], you're looking
  at softmax output (or its log).
- Temperature works on the logits, before softmax runs. Once you see that
  it only stretches or squeezes the gaps, its effect is easy to predict.
  The other ways to pick from the probabilities are in [[sampling]].

## Further reading

- [Softmax Regression](https://d2l.ai/chapter_linear-classification/softmax-regression.html),
  Zhang, Lipton, Li and Smola, Dive into Deep Learning, 2023. The textbook
  version: why raw outputs need fixing, the formula, the order-preserving
  property and the physics history.
- [Transformers, the tech behind LLMs](https://www.3blue1brown.com/lessons/gpt),
  3Blue1Brown, 2024. Softmax where an LLM uses it: from the last vector to
  logits to next-token probabilities, with temperature built in.
