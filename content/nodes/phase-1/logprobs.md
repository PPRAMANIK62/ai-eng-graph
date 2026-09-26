---
id: logprobs
title: What are logprobs?
depth: short
phase: 1
note: >-
  The log-probability the model gave each token. Some APIs return them; many newer models don't.
needs: [softmax, next-token-prediction]
leads_to: []
compare_with: []
updated: 2026-09-23
---

# What are logprobs?

A logprob is the probability the model gave a token, written as a
logarithm. Some APIs will hand them back alongside the answer, and they're
the closest thing you get to seeing how sure the model was. As of 2026-09,
fewer and fewer models let you have them.

## One number per token, from the model's own list

Every time a model writes a token, it first scores every token in its
vocabulary and turns those scores into probabilities with [[softmax]]. Then
it picks one. That's the loop from [[next-token-prediction]].

A logprob is just the log of the probability the chosen token had at that
moment. If the model gave a token a 97% chance, its logprob is log(0.97),
about −0.03.

Some quick conversions:

| Probability | Logprob |
|---|---|
| 100% | 0 |
| 97% | −0.03 |
| 50% | −0.69 |
| 1% | −4.6 |

So a logprob is always 0 or negative. Closer to 0 means the model was more
sure. To get back to a percentage, take e to the power of the logprob.

## Why use logs at all

Logs turn multiplying into adding. The probability of a whole answer is the
probability of each token multiplied together, and those products get tiny
fast. With logs you just add the token logprobs up, and exponentiate the
sum if you want the answer's overall probability back.

## What the API gives you

On OpenAI's Chat Completions API, you turn on `logprobs` and you get, for
every token in the reply:

- the token itself, and its logprob
- its raw bytes (handy when one emoji is split across two tokens)
- optionally, the top few alternatives the model considered at that spot,
  each with its own logprob (`top_logprobs`, 0 to 5 in OpenAI's
  cookbook)

Here's a real example from that cookbook. Ask gpt-4o-mini to classify the
headline "Tennis Champion Showcases Hidden Talents in Symphony Orchestra
Debut" as Technology, Politics, Sports or Art. It answers "Art" with a
logprob of −0.028, which is 97.2%. The runner-up, "Sports", sits at −4.28,
about 1.4%.

![Two headlines classified by gpt-4o-mini. For the tennis headline, Art gets 97.2% (logprob −0.028) and Sports 1.4% (logprob −4.28). For a clear tech headline, Technology gets 100% (logprob 0.0). A logprob near 0 means the model was sure; a big negative number means it wasn't.](img/logprobs-headlines.svg)

You can see the same numbers for any text on a small open model. The
logprob column is the log of the chance next to it.

{{widget:next-token}}

## What people use them for

- **Confidence thresholds.** Accept a classification automatically when
  it's above some probability, and send the rest to a person.
- **"Can I answer this from the retrieved text?"** Ask the model for a
  one-word True/False and read the probability on that word.
- **Autocomplete.** Only suggest the next word when its probability is
  high. The cookbook example used 95%.
- **Comparing answers.** Average the token logprobs of an answer to score
  it. Perplexity, e to the minus average logprob, is the same idea: lower
  means a more confident answer, higher a less certain one.

## Where it gets tricky

**Confident isn't the same as correct.** In the same cookbook, the model
was asked whether an article contained enough to answer two questions it
only partly covered. It said "False" with 99.1% confidence for one and
"True" with 99.6% for the other. The number tells you how sure the model
was, not whether it was right. That matters when you think about
[[hallucination]].

**Many newer models don't return them.** As of 2026-09:

- **OpenAI GPT-6.** The migration guide says to remove `logprobs` and
  `top_logprobs` whenever reasoning effort isn't `none`. GPT-6 Astra can't
  turn reasoning off at all, so you never get logprobs from it. Sol and Luna
  can, with reasoning set to `none`.
- **Anthropic Claude.** The Messages API reference lists no logprobs
  parameter.

The cookbook's examples use gpt-4o and gpt-4o-mini, and OpenAI now marks
the notebook as archived.

**Parameter limits change.** The 0-to-5 range for alternatives comes from
that archived notebook. Check the current reference for the model you use.

## What this means when you build

- If a feature depends on logprobs (a confidence threshold, a classifier
  score), check that your chosen model returns them before you design
  around it. Reasoning models often don't.
- If you can't get logprobs, you can still ask for several answers and
  see how often they agree, or run an open model yourself, where you have
  the raw probabilities.
- Treat a logprob as a signal to combine with others, never as a
  guarantee.

## Further reading

- [Using logprobs](https://developers.openai.com/cookbook/examples/using_logprobs),
  Hills and Anadkat (OpenAI), 2023. The definition plus five worked uses
  with real outputs. Now archived; the examples use gpt-4o-mini.
- [Model guidance (GPT-6)](https://developers.openai.com/api/docs/guides/latest-model),
  OpenAI docs, 2026. The migration list that drops `logprobs`,
  `top_logprobs`, `temperature` and `top_p` when reasoning is on.
- [Create a Message](https://platform.claude.com/docs/en/api/messages/create),
  Anthropic API reference, 2026. Claude's request parameters, with the
  sampling settings deprecated and no logprobs option.
