---
id: huyen-sampling
title: "Generation configurations: temperature, top-k, top-p, and test time compute"
author: Chip Huyen
url: https://huyenchip.com/2024/01/16/sampling.html
published: 2024-01-16
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

An AI-engineering view of sampling: why the same question gets different answers, how temperature, top-k and top-p change the pick, and how to use extra samples ("test time compute") to get better answers. Clear worked numbers for temperature. Ties sampling to real product problems: inconsistency, hallucination and user confusion.

## Key claims

- Models answer the same question differently because answers are sampled. If the model gives Vietnamese cuisine 70% and Italian 30%, "it’ll answer “Vietnamese” 70% of the time, and “Italian” 30%." (intro)
- The cost of randomness. "this probabilistic nature also causes inconsistency and hallucinations." (intro)
- Real-world signal: in 3 months of support requests at an AI startup she advises, "⅕ of the questions are because users don’t understand or don’t know how to work with this probabilistic nature." (intro)
- Greedy is fine for a classifier, bad for text. "for a language model, always picking the most likely token, greedy sampling , creates boring outputs." (Sampling)
- Sampling by weight: if red has 30% and green 50%, "red will be picked 30% of the time, and “green” 50% of the time." (Sampling)
- Temperature: divide logits by T, then softmax. "Logits are divided by temperature." (Temperature)
- Worked example, logits [1, 3]: T=1 → [0.12, 0.88]; T=0.5 → [0.02, 0.98]; T=2 → [0.27, 0.73]. (Temperature)
- Providers typically cap temperature at 0–2. "Model providers typically limit temperature to be between 0 and 2." (Temperature)
- 0.7 as a common creative default, but test it. "A temperature of 0.7 is often recommended for creative use cases" (Temperature)
- T=0 is really argmax, not division by zero. "In practice, when we set the temperature to 0, the model just picks the token with the value with the largest logit" (Temperature)
- Logprobs are log-scale probabilities, used because tiny probabilities underflow with a ~100,000-token vocabulary. "Log scale helps reduce this problem." (Temperature)
- Top-k: softmax over the top k logits only; "k can be anywhere from 50 to 500". Smaller k = more predictable, less interesting. (Top-k)
- Top-p: add probabilities from most likely down until the sum reaches p. "Common values for top-p (nucleus) sampling in language models typically range from 0.9 to 0.95." (Top-p)
- The right number of candidates depends on the prompt: a yes/no question needs two, "What's the meaning of life?" many more. (Top-p)
- Top-p is justified by practice more than theory. "In theory, there doesn’t seem to be a lot of benefits to top-p sampling. However, in practice, top-p has proven to work well" (Top-p)
- Sequence logprob = sum of token logprobs; to avoid favouring short outputs, use the average. "we use the average logprob by dividing the sum by its sequence length." (Test Time Compute)
- Sampling several outputs and picking the best or the most common answer can improve results; it costs roughly linearly. "On average, generating two outputs costs approximately twice as much as generating one." (Test Time Compute)
- Constrained sampling: filter the logits to only tokens allowed by a grammar before sampling. "we filter this logit vector to keep only the values that meet our constraints." (Constraint sampling)

## Visuals worth redrawing

- The probability of token B (logits [1, 3]) as temperature goes from 0 to 2: a curve that goes to 1 near 0. Good for `temperature`.
- Top-p cut on a yes/maybe/no distribution (p=90% keeps yes and maybe; 99% adds no).

## My notes

- 2024-01. Her statement that top-k is mainly for cutting compute is her framing; Holtzman and Hugging Face frame top-k as cutting the unreliable tail. Both can be true.
- The `best_of` parameter she mentions is from the OpenAI API "as of writing" (2024); not checked for current models. Don't use.
- The 0–2 range is OpenAI's; Claude's temperature ran 0–1 (`anthropic-messages-api-reference`).
