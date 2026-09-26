---
id: temperature
title: What does temperature do?
depth: short
phase: 1
note: >-
  Flattens or sharpens the probabilities before sampling. Newer closed reasoning models no longer let you set it.
needs: [sampling]
leads_to: []
compare_with: [top-p]
updated: 2026-09-23
---

# What does temperature do?

Temperature is the setting that makes a model's picks more predictable or
more adventurous. It's one number, applied right before the model turns its
scores into probabilities. As of 2026-09, the newest closed models have
mostly taken it away.

## One division before softmax

Recall how a token gets picked ([[sampling]]): the model scores every token,
[[softmax]] turns the scores into probabilities, and one token is drawn at
random by weight.

Temperature slips in between. Every score is divided by the temperature T
before softmax runs. That's all it does.

Take a model with just two possible tokens, A and B, with scores 1 and 3:

| Temperature | Chance of A | Chance of B |
|---|---|---|
| 0.5 | 2% | 98% |
| 1 (no change) | 12% | 88% |
| 2 | 27% | 73% |

Dividing by a number below 1 pushes the scores further apart, so the
favorite gets even more likely. Dividing by a number above 1 squeezes them
together, so the underdog gets a real chance.

![Line chart of the chance of picking B, the token with the higher score (scores 1 and 3), as temperature goes from 0 to 2. It stays near 100% below about 0.3, then falls smoothly: 98% at 0.5, 88% at 1 and 73% at 2, heading toward the 50% of a coin flip.](img/temperature-dial.svg)

## Low for consistency, high for variety

- **Low temperature** means the top tokens win almost every time. Output is
  more consistent, and also more boring.
- **High temperature** gives rarer tokens more chances. Output is more
  varied and creative, and also more likely to lose the thread.

For creative work, 0.7 is a common starting point. Treat it as a first
guess to test, not a rule.

Move the temperature slider below and watch the same list of logits turn
into sharper or flatter chances.

{{widget:next-token}}

## Temperature 0 is a special case

You can't divide by zero. So when you set temperature to 0, the software
doesn't do the math at all. It just takes the token with the highest score.
That's greedy decoding from [[sampling]].

## Where it gets tricky

**Temperature 0 doesn't guarantee the same answer.** It was long the
standard advice for "make it consistent", but even at 0, Claude's results
were documented as not fully deterministic. Why that happens on real
servers is covered in [[sampling]].

**Scales differ between providers.** Providers commonly allow 0 to 2.
Claude's range was 0 to 1, with 1 as the default. A value copied from one
provider's docs doesn't mean the same thing on another.

**The newest closed models don't let you set it.** As of 2026-09:

- **Claude.** Models released after Claude Opus 4.6 reject any temperature
  other than the default 1.0 with an error. The parameter is marked
  deprecated.
- **OpenAI GPT-6.** The guide says to remove `temperature` whenever
  reasoning effort isn't `none`. GPT-6 Astra has no `none` setting, so you
  can't set it there at all.

On these models the provider controls sampling, and you steer tone and
style through the prompt instead.

**Temperature vs top-p.** Both change how adventurous the pick is, in
different ways. Temperature reshapes the whole list, tail included. [[top-p]]
cuts off the tail and keeps the shape of what's left.

## What this means when you build

- Where you can still set it, the classic advice is low for analytical
  tasks and multiple choice, higher for creative writing. Test it on your
  own examples.
- Don't rely on temperature 0 for identical outputs. Build tests that
  accept some variation.
- Check your model before you add a temperature setting to your code.
  Claude's newest models reject the request with an error, and OpenAI's
  guide says to drop it for GPT-6 with reasoning on. Put the style you want
  in the prompt instead.

## Further reading

- [Generation configurations: temperature, top-k, top-p, and test time compute](https://huyenchip.com/2024/01/16/sampling.html),
  Chip Huyen, 2024. The mechanism with the worked two-token example, the
  temperature 0 special case and typical values.
- [Create a Message](https://platform.claude.com/docs/en/api/messages/create),
  Anthropic API reference, 2026. Claude's temperature parameter: its range,
  its old advice, the determinism caveat and the deprecation.
- [Model guidance (GPT-6)](https://developers.openai.com/api/docs/guides/latest-model),
  OpenAI docs, 2026. The rule to remove temperature when reasoning is on.
