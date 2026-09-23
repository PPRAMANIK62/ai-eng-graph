---
id: sampling
title: How does a model pick the next token?
depth: deep
phase: 1
note: >-
  Picking one token from the probability list: always the top one (greedy), or at random by weight.
needs: [softmax, next-token-prediction]
leads_to: [temperature, top-p]
compare_with: []
status: review
updated: 2026-09-23
---

# How does a model pick the next token?

At every step, a model hands you a probability for every token in its
vocabulary, and something has to choose one. That choice is called
**sampling** (or decoding). It's a separate step from the model itself, and
it decides whether the same model writes dull loops, fluent text, or
nonsense. It's also why you get a different answer every time you ask.

## The model gives you a list, not an answer

The loop from [[next-token-prediction]] ends each step with a list of
scores, one per token, which [[softmax]] turns into probabilities. The
model's work stops there. What happens next is a rule someone chooses: you, or on many newer
models, the provider.

Take a toy example. After the word "The", say the model gives:

| Next word | Probability |
|---|---|
| nice | 0.5 |
| dog | 0.4 |
| car | 0.1 |

There are two basic ways to pick from this: always take the top one, or
roll a weighted die.

## Greedy: always take the top token

**Greedy decoding** takes the most likely token at every step. Here that's
"nice". It's simple, and in theory it's deterministic: same prompt in, same
text out.

It has two problems.

**It can miss better sentences.** Suppose after "The nice" the best next
word is "woman" at 0.4, and after "The dog" the best is "has" at 0.9. The
whole sentence "The nice woman" has probability 0.5 × 0.4 = 0.2. "The dog
has" has 0.4 × 0.9 = 0.36. Greedy committed to "nice" at step one and
never saw the better path.

**It repeats itself.** Run greedy on GPT-2 with "I enjoy walking with my
cute dog" and you get:

> I enjoy walking with my cute dog, but I'm not sure if I'll ever be able
> to walk with my dog. I'm not sure if I'll ever be able to walk with my
> dog.

This is typical, not bad luck. Once a phrase has appeared, the model rates
repeating it as more likely, and each repeat makes the next one more likely
still. It's a feedback loop.

![A probability tree. After "The", the model gives nice 0.5, dog 0.4 and car 0.1. After "nice" the best word is woman at 0.4; after "dog" it is has at 0.9. Greedy follows The, nice, woman for a total of 0.2. The path The, dog, has totals 0.36 but greedy never sees it. A dashed path shows random sampling sometimes picking car.](img/sampling-tree.svg)

## Beam search: look a few steps ahead

**Beam search** fixes the first problem. It keeps the few most likely
partial sentences (the "beams") alive at each step and picks the best full
sequence at the end. In the toy example it finds "The dog has".

It doesn't fix the repetition. It's still hunting for the most probable
text, and it still loops. Beam search does well when the output is tightly
tied to the input, like translation or summarizing, and badly for open-ended
writing like stories or chat.

## The surprise: the most likely text isn't human text

You'd expect a good model's most probable output to be its best writing.
In 2019, Ari Holtzman and colleagues measured this on GPT-2 Large and found
the opposite.

Human text isn't the most probable text. People pick less obvious words all
the time. So text that maximizes probability comes out bland and repetitive,
nothing like what a person writes. Their conclusion: for open-ended text,
maximizing probability is the wrong goal.

## Pure sampling: roll a weighted die

The other option is to pick at random, weighted by the probabilities. In
the toy example, "nice" comes up half the time, "dog" 40% and "car" 10%.
If a model thinks one answer has a 70% chance and another 30%, it gives the
first one about 70% of the time.

This is why the same prompt gives different answers. The model's
probabilities are the same each run. The dice are not.

Pure sampling fixes the repetition, but brings a new problem: the text
wanders off into nonsense. The reason is the **long tail**. Tens of
thousands of tokens each have a tiny probability, but together they add
up to a real chance. Every so often you pick one of them, the text goes
somewhere strange, and the model then has to continue from that strange
place.

## How the methods compare

Holtzman's team generated 5,000 passages with GPT-2 Large using each method
and compared them with human text. Two of their measures:

| Method | Passages stuck repeating | How surprising the text is (perplexity) |
|---|---|---|
| Human text | 0.28% | 12.38 |
| Greedy | 73.66% | 1.50 |
| Beam search (16 beams) | 28.94% | 1.48 |
| Pure sampling | 0.22% | 22.73 |
| Top-p (p = 0.95) | 0.36% | 13.13 |

Greedy and beam search are far too predictable and loop constantly. Pure
sampling is more surprising than people are, which in practice means
incoherent. The last row, which trims away the long tail and samples from
what's left, is the only one near the human numbers on both.

![Two bar charts from Holtzman et al. on GPT-2 Large. Share of passages stuck repeating: greedy 73.66%, beam search 28.94%, pure sampling 0.22%, top-p 0.36%, human text 0.28%. Perplexity: greedy 1.50, beam 1.48, pure sampling 22.73, top-p 13.13, against human text at 12.38. Only top-p lands near the human value on both.](img/sampling-holtzman-table.svg)

## Two ways to tame the dice

In practice, sampling is usually paired with a change to the
probabilities first, in one of two ways.

- **Reshape them.** [[temperature]] makes the list sharper (the top tokens
  get even more likely) or flatter (the tail gets more chance). Near zero,
  it becomes greedy.
- **Cut the tail off.** Keep only the top few tokens and sample among them.
  [[top-p]] keeps the smallest set that covers, say, 95% of the
  probability. Top-k keeps a fixed number.

Each has its own article. Both push toward the sweet spot in the table:
random enough to avoid loops, careful enough to stay on topic.

## Where it gets tricky

**Temperature 0 isn't reliably deterministic.** In theory, greedy gives the
same text every time. In practice it often doesn't. In 2025, Thinking
Machines Lab ran one open model (Qwen3-235B) 1,000 times at temperature 0
on "Tell me about Richard Feynman". They got 80 different completions. All
1,000 matched for the first 102 tokens. At token 103, 992 said "Queens,
New York" and 8 said "New York City". The cause was the server: your
request gets batched with other people's, and the math comes out very
slightly different at different batch sizes. Since server load keeps
changing, so do your results. They made it fully repeatable by rewriting
the server's math to give the same numbers at any batch size, at some cost
in speed. That's a change on the server, so with a hosted API it's up to
your provider.

**On many closed models you can't choose anymore.** As of 2026-09, Claude
Sonnet 5, and Claude Opus 4.7 and later, reject any non-default
temperature, top-p or top-k with an error. Anthropic's advice is to steer
the model with instructions in the system prompt instead. OpenAI's GPT-6
guide says to remove temperature and top-p whenever reasoning is on. The
provider picks the sampling settings, and you steer with the prompt.

**Is repetition the decoder's fault or the model's?** One view, from the
Holtzman paper, is that the decoding goal is wrong and sampling fixes it.
Another line of research argues the repetition comes from how models are
trained, and notes that top-k and top-p still repeat sometimes. Both can be
partly true. No method wins everywhere.

**Randomness has a product cost.** Chip Huyen went through three months of
support requests at an AI startup and found about a fifth came from users
confused by the model giving different answers. Sampling is great for
creative work and a headache for anything that must be consistent.

**The numbers are old.** The comparison table is GPT-2 Large, 2019, on
story-like text. Today's chat models get extra training on top
([[post-training]]) and are used for different tasks, so read the
percentages as an illustration of the pattern, not as current figures.

## What this means when you build

- **Expect different outputs for the same input,** even at temperature 0.
  Design your tests and your UI for that. Don't write a test that checks
  for one exact string.
- **Variation can be useful.** Asking several times and taking the most
  common answer can improve accuracy, but two answers cost about twice as
  much as one.
- **Check which knobs your model has.** On Claude's newest models and on
  GPT-6 with reasoning, you can't set temperature or top-p. Steer with the
  prompt instead, and see [[logprobs]] for what you can still read back.
- **If you run an open model yourself,** you choose the method. Sampling
  with a trimmed tail is the usual starting point for open-ended text.

## Further reading

- [The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751),
  Holtzman et al., 2020. Why the most likely text is bad text, the long
  tail, and the method comparison on GPT-2 Large.
- [How to generate text](https://huggingface.co/blog/how-to-generate),
  Patrick von Platen (Hugging Face), 2020, updated 2023. Greedy, beam,
  sampling, top-k and top-p side by side on GPT-2, with the probability
  tree.
- [Generation configurations: temperature, top-k, top-p, and test time compute](https://huyenchip.com/2024/01/16/sampling.html),
  Chip Huyen, 2024. Sampling from a product point of view: inconsistency,
  sampling many answers, and what it costs.
- [Defeating Nondeterminism in LLM Inference](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/),
  Horace He (Thinking Machines Lab), 2025. Why temperature 0 still varies on
  real servers, with the 1,000-run experiment.
- [What's new in Claude Sonnet 5](https://platform.claude.com/docs/en/models/sonnet-5/whats-new-sonnet-5),
  Anthropic docs, 2026. The rule that Claude's newest models reject
  sampling settings.
- [Model guidance (GPT-6)](https://developers.openai.com/api/docs/guides/latest-model),
  OpenAI docs, 2026. Which parameters to remove when reasoning is on.
