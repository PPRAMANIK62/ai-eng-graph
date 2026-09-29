---
id: chain-of-thought
title: What is chain-of-thought prompting?
depth: deep
phase: 1
note: >-
  Asking the model to reason step by step before it answers, and when that helps.
needs: [next-token-prediction]
leads_to: [reasoning-models, react-pattern]
compare_with: []
updated: 2026-09-23
---

# What is chain-of-thought prompting?

Chain-of-thought prompting means getting a model to write out its reasoning
before it gives the answer. On math and logic problems it can turn a wrong
answer into a right one. On many other tasks it does little except make the
response slower and more expensive, and on today's reasoning models it's
mostly unnecessary. Knowing which case you're in saves you tokens and
surprises.

## One word problem, two ways

Here's a question from the 2022 paper that named the technique:

> Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has
> 3 tennis balls. How many tennis balls does he have now?

The usual few-shot prompt would show a worked example like this and then a
new question. The example's answer is just:

> The answer is 11.

A chain-of-thought prompt shows the working instead:

> Roger started with 5 balls. 2 cans of 3 tennis balls each is 6 tennis
> balls. 5 + 6 = 11. The answer is 11.

That's the only change. Given examples with the working written out, a large
model writes out its own working on the new question, and gets many more of
them right. With eight such examples, PaLM, a 540-billion-parameter model,
went from 17.9% to 56.9% on GSM8K, a benchmark of math word problems, beating the
previous best (2022).

![Two prompts side by side. Standard prompting: the tennis-ball example answers just The answer is 11, and on the new cafeteria-apples question the model says The answer is 27, which is wrong. Chain-of-thought prompting: the same example shows the working, 2 cans of 3 is 6, 5 + 6 = 11, and on the same new question the model works it out, 23 - 20 = 3, 3 + 6 = 9, and gets 9, which is right.](img/chain-of-thought-standard-vs-cot.svg)

## Why writing it out helps

Recall how a model writes: one token at a time, each new token predicted from
everything written so far (see [[next-token-prediction]]). Each token gets one
pass through the network. So when a model has to jump straight to "11", it
has to do all the arithmetic inside the single pass that produces that
token.

When it writes the steps first, each step becomes text the model can read on
the next pass. "2 cans of 3 is 6" is now sitting in the context, and the
next step only has to add 5 and 6. The written reasoning works like scratch
paper, and harder problems get more steps, which means more passes.

The original paper tested two tempting explanations and ruled them out:

- **Just more tokens?** They had the model output a row of dots before
  answering, as long as the equation it would have needed. No improvement.
  The content of the steps matters, not their length.
- **Just recalling knowledge?** They put the reasoning *after* the answer.
  No improvement either. The model has to write the reasoning first and then
  use it.

## Two ways to ask

**Show it (few-shot).** Put worked examples with reasoning into the prompt,
as above. This is [[few-shot-prompting]] with the working included.

**Tell it (zero-shot).** Later in 2022, another team found you don't need
examples. Adding "Let's think step by step" before the answer was enough to
make the model reason on its own. On one arithmetic benchmark, MultiArith,
accuracy went from 17.7% to 78.7% with OpenAI's text-davinci-002. On GSM8K it
went from 10.4% to 40.7%. Worked examples still did better, but one phrase got
a lot of the way.

The wording matters, as long as it invites reasoning. On MultiArith:

| Phrase before the answer | Accuracy |
|---|---|
| Let's think step by step. | 78.7% |
| Let's think about this logically. | 74.5% |
| Let's think | 57.5% |
| (nothing) | 17.7% |
| Abrakadabra! | 15.5% |
| Don't think. Just feel. | 18.8% |

Phrases that don't lead to written reasoning score about the same as nothing.

## It needed big models

In 2022, chain of thought only helped models of around 100 billion parameters
and up. Smaller models wrote reasoning that sounded fluent but didn't hold
together, and did *worse* than when they answered directly. That's worth
keeping in mind if you run small open models.

## Where it helps, and where it doesn't

A 2024 review of over 100 papers, plus new tests on 14 models, found a clear
pattern: chain of thought helps mostly on math, logic and symbol-manipulation
tasks.

- The biggest average gains were on symbolic reasoning (+14.2 points), math
  (+12.3) and logic (+6.9).
- Across all other kinds of tasks, accuracy was 56.8% with chain of thought
  and 56.1% without. Basically nothing.
- On the MMLU benchmark, up to 95% of the gain came from questions that
  involved an equals sign. Everywhere else, answering directly
  was just as good.
- Even on math, chain of thought lost to having the model write the problem
  down formally and handing it to a real solver.

![Average accuracy gain from chain of thought by task type, from a 2024 review of over 100 papers: symbolic reasoning +14.2 points, math +12.3, logic +6.9, and all other kinds of tasks together +0.7 (56.8% with chain of thought versus 56.1% without).](img/chain-of-thought-gain-by-task.svg)

## On today's models, the gains are shrinking

Models have changed since 2022. A 2025 study ran a "think step by step"
prompt against an "answer directly" prompt on hard science questions, 25
times per question, on several models:

- **Regular models** (such as GPT-4o, Claude 3.5 Sonnet and Gemini 2.0 Flash)
  got a small average gain, but answers varied more. Sometimes the step-by-step
  prompt broke questions the model would otherwise get right.
- **Many of them already reasoned a bit without being asked.** For those,
  asking made little difference.
- **Forcing "just the answer" hurt.** Telling a regular model to reply with
  only the answer can take away the reasoning it would have done anyway.
- **Reasoning models** (o3-mini, o4-mini and Gemini 2.5 Flash) gained little
  or nothing from being asked, because they reason by design. See
  [[reasoning-models]].
- **It always costs time.** Step-by-step answers took 35% to 600% longer on
  regular models (5 to 15 seconds), and 20% to 80% longer on reasoning models.

More output tokens also means a bigger bill, since you pay for every token
the model writes. See [[token-pricing]].

## Where it gets tricky

**The written reasoning may not be the real reasoning.** It's tempting to read
the chain of thought as a window into how the model got its answer. Tests say
be careful. In a 2023 study, researchers slipped a hidden bias into prompts,
for example making the right answer always "(A)" in the examples. Models
followed the bias, and their explanations rationalized the biased answer
instead of mentioning it. Of 426 such explanations reviewed, one mentioned the
bias. Accuracy dropped by up to 36% on the biased prompts.

**Reasoning models do it too, a bit less.** A 2025 Anthropic study gave
reasoning models hints, like a note that a professor thinks the answer is
(A). When the models used the hint, their reasoning admitted it only a
fraction of the time: an overall score of 25% for Claude 3.7 Sonnet and 39%
for DeepSeek R1. That's better than the non-reasoning models tested, but far
from reliable. Oddly, the unfaithful explanations were longer than the
faithful ones, not shorter. And they got less faithful on harder questions.

**A plausible chain can still be wrong.** Writing steps gives the model a
chance to get them right. It doesn't guarantee it. Wrong steps can lead to a
wrong answer that now looks well argued.

**The advice is changing.** The 2022 papers made "think step by step" a
standard trick. Studies from 2024 and 2025 find the gains are narrow and
shrinking. Both are right for the models they tested.

## What this means when you build

- **Use it for math, logic and multi-step rules** on regular models. Skip it
  for lookups, classification and simple rewriting, where it mostly adds
  cost.
- **Reasoning comes before the answer.** If your output format puts the
  answer first, the model can't use reasoning that comes after it. When you
  need a machine-readable answer, leave room for the reasoning first, or
  parse the answer out of a clearly marked final line.
- **Don't force "answer only" without testing.** It can quietly remove
  reasoning the model was doing on its own.
- **On reasoning models, don't ask for it.** They already think; asking adds
  little. Control how much they think with their settings instead.
- **Don't treat the explanation as an audit trail.** It can leave out what
  actually drove the answer.
- **Measure.** Run your own prompts with and without it, several times each,
  and compare accuracy, spread and latency.

## Further reading

- [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903),
  Wei et al. (Google), 2022. The paper that named the technique, with the
  tennis-ball example and the ablations.
- [Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916),
  Kojima et al., 2022. "Let's think step by step", and how much the exact
  wording matters.
- [To CoT or not to CoT?](https://arxiv.org/abs/2409.12183), Sprague et al.,
  2024. A large review showing chain of thought helps mainly on math and
  logic.
- [Prompting Science Report 2: The Decreasing Value of Chain of Thought in Prompting](https://arxiv.org/abs/2506.07142),
  Meincke, Mollick, Mollick and Shapiro, 2025. What it does on 2025 models,
  reasoning models included.
- [Language Models Don't Always Say What They Think](https://arxiv.org/abs/2305.04388),
  Turpin et al., 2023. Hidden biases change answers while the explanation
  stays silent.
- [Reasoning Models Don't Always Say What They Think](https://arxiv.org/abs/2505.05410),
  Chen et al. (Anthropic), 2025. The same faithfulness test on reasoning
  models.
