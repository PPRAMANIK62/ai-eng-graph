---
id: top-p
title: What is top-p sampling?
depth: short
phase: 1
note: >-
  Samples only from the smallest set of tokens that covers p of the probability. Top-k is covered here too.
needs: [sampling]
leads_to: []
compare_with: [temperature]
updated: 2026-09-23
---

# What is top-p sampling?

Top-p sampling (also called nucleus sampling) throws away the unlikely
tokens before the model picks one. It keeps only the most likely tokens
that together cover a share p of the probability, say 95%, and draws from
those. Its older sibling, top-k, keeps a fixed number instead.

## Why cut anything at all

Picking tokens at random by weight ([[sampling]]) has a weak spot: the long
tail. Thousands of tokens each have a tiny chance, but together they add up.
Pick from the tail once and the text can go off the rails. Cutting the tail
off before you pick fixes most of that, while keeping enough randomness to
avoid the loops greedy decoding falls into.

## Top-k: keep the k most likely

The simplest cut: keep the k most likely tokens, rescale their
probabilities so they add up to 1 again, and sample from them. GPT-2 used
this.

The problem is that k is fixed, and the right number of candidates keeps
changing:

- After "The", lots of words work. The probability is spread flat across
  tens or hundreds of good options. A small k throws good ones away.
- After "The car", only a few words fit. Nearly all the probability sits
  on one or two. A large k lets in words that make no sense, and rescaling
  even makes them more likely than before.

In one small example with k = 6, top-k cut reasonable words like "people"
and "house" in the flat step, and let in poor fits like "down" and "a" in
the sharp step.

## Top-p: keep enough to cover p

Top-p fixes this by cutting on probability instead of count. Sort the
tokens from most to least likely, add their probabilities as you go, and
stop as soon as the total reaches p. Keep that set, rescale, sample.

Here's a made-up example with p = 0.9:

| Token | Probability | Running total |
|---|---|---|
| yes | 0.60 | 0.60 |
| maybe | 0.30 | 0.90 ← stop |
| no | 0.06 | 0.96 |
| sure | 0.02 | 0.98 |
| banana | 0.01 | 0.99 |

Only "yes" and "maybe" survive. After rescaling, "yes" gets two thirds of
the chance and "maybe" one third.

The size of the kept set now follows the model's confidence. In the same
small example as above, p = 0.92 kept 9 words in the flat step and just 3
in the sharp one. The idea's authors found the kept set usually ranges from
one token to about a thousand.

![Two bar charts of next-token probabilities. On the left the probability is spread flat over many tokens; on the right most of it sits on one or two. A top-k cut at k = 6 is the same line in both: on the left it throws away good options, on the right it lets in tokens with almost no chance. A top-p cut at p = 0.92 keeps 9 tokens on the left and only 3 on the right.](img/top-p-k-vs-p.svg)

Try it on a real model. Lower top-p and see how many tokens survive the
cut, then pick a few tokens and watch that number change with the model's
confidence.

{{widget:next-token}}

## Where it came from, and how well it works

Top-p was introduced in 2019 by Ari Holtzman and colleagues. On GPT-2
Large, text sampled with p = 0.95 came closest to human text on how
surprising it was, rarely got stuck repeating, and scored best in their
combined human-and-statistical evaluation. It was the only method that met
all of their criteria at once. Typical values of p sit between 0.9 and
just under 1.

You can also combine the two: top-k to rule out very low-ranked tokens,
top-p to adapt to the context. One standard example pairs k = 50 with
p = 0.95.

## Where it gets tricky

**Top-p vs temperature.** They're easy to confuse. [[temperature]]
reshapes the whole list: it makes the favorite more or less dominant, but
leaves every token in play. Top-p leaves the shape of the head alone and
removes the tail. Many setups use both.

**Set it too low and you're back to greedy.** A small p, like a small k,
keeps only the top token or two. The output then repeats the way greedy
decoding does.

**It may struggle at high temperature.** A 2024 paper argues top-p has
trouble balancing quality and variety when temperature is turned up,
producing text that is incoherent or repetitive. Its alternative, min-p,
keeps tokens whose probability is at least a set fraction of the top
token's. It's now in Hugging Face Transformers and vLLM. Worth knowing if
you run open models and like high temperatures.

**On the newest closed models you can't set it.** As of 2026-09, Claude
models released after Opus 4.6 accept top-p only at 0.99 or above, and
reject any top-k value at all. Temperature is locked the same way; see
[[temperature]].

## What this means when you build

- If you run an open model, top-p around 0.9 to 0.95 is the usual place to
  start for open-ended text. Change one knob at a time and compare outputs.
- If you use a closed reasoning model, don't send top-p or top-k. Steer
  with the prompt.

## Further reading

- [The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751),
  Holtzman et al., 2020. The paper that introduced top-p, with the case
  against fixed top-k and the comparison with human text.
- [How to generate text](https://huggingface.co/blog/how-to-generate),
  Patrick von Platen (Hugging Face), 2020, updated 2023. Top-k and top-p
  side by side, with the k = 6 and p = 0.92 examples.
- [Turning Up the Heat: Min-p Sampling](https://arxiv.org/abs/2407.01082),
  Nguyen et al., ICLR 2025. The case that top-p breaks down at high
  temperature, and the min-p alternative.
- [Create a Message](https://platform.claude.com/docs/en/api/messages/create),
  Anthropic API reference, 2026. Claude's top-p and top-k settings and
  their deprecation.
