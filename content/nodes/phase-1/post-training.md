---
id: post-training
title: What is post-training?
depth: deep
phase: 1
note: >-
  Turning a text predictor into an assistant: instruction tuning, preference tuning, and RL on tasks with checkable answers.
needs: [pretraining]
leads_to: [rlhf, reasoning-models, hallucination]
compare_with: []
status: review
updated: 2026-09-23
---

# What is post-training?

Post-training is everything done to a model after [[pretraining]] to turn a
text predictor into an assistant you can talk to. It's why a model answers
your question instead of continuing your text, why it has a house style, why
it refuses some requests, and, since 2024, a big part of why some models are
good at math and code. When two models built on similar base models feel very
different to use, post-training is usually the difference.

## Before and after, on one prompt

Give this text to a strong base model, Llama 3.1 405B Base, straight out of
pretraining:

> The president of the united states in 2006 was

It gets the answer, George W. Bush, and then keeps going: other politicians
from 2006, an executive order, a gambling law, and some calendar trivia about
2009. It's continuing a web page, metadata and all.

Give the same text to Tülu 3 405B, which is that base model plus
post-training. It answers in one clean sentence: Bush was president in 2006,
and served two terms from 2001 to 2009.

Same knowledge, very different behavior. Post-training didn't teach the model
who the president was. It taught it what kind of reply to write.

![The same prompt, The president of the united states in 2006 was, given to two models. The base model, Llama 3.1 405B Base, says George W. Bush and then drifts on to Jeb Bush, John McCain, an executive order and more. The post-trained model, Tülu 3 405B, answers in two sentences and stops.](img/post-training-before-after.svg)

## Stage 1: show it good answers (supervised fine-tuning)

The first step is the simplest. Collect examples of prompts paired with the
answers you'd like, and keep training the model on them with the same
[[next-token-prediction]] objective as before. The only change is the data:
now it's all question-and-answer pairs in an assistant's voice. This is
called **supervised fine-tuning** (SFT) or instruction tuning.

SFT teaches format. After it, the model knows that a question should get an
answer, in a certain shape and tone.

It doesn't take much data to see the effect. For InstructGPT (2022), OpenAI's
40 contractors wrote answers for about 13,000 prompts. Meta's LIMA experiment
(2023) went further: just 1,000 carefully chosen examples turned a 65B base
model into a decent assistant. Modern recipes use far more. Ai2's open Tulu 3
recipe (2024) used about 939,000 prompts in its SFT stage, many with
synthetic answers.

## Stage 2: teach it which answers people prefer

Showing good answers only goes so far. It's often easier to say which of
two answers is better than to write the ideal one yourself. So the second
stage collects **preferences**: the model writes several answers to a prompt, someone picks
the better one, and the model is trained to make preferred answers more
likely and rejected ones less likely.

The classic way to do this is RLHF: train a separate reward model on the
preferences, then use reinforcement learning to push the model toward answers
the reward model scores highly. A simpler method called DPO trains directly on
the preference pairs. Both are covered in [[rlhf]].

This stage is what made assistants feel helpful. In the InstructGPT paper,
labelers preferred answers from a 1.3B post-trained model over the raw 175B
GPT-3, a model more than 100 times bigger. The 175B post-trained version beat
raw GPT-3 85% of the time, and still beat GPT-3 71% of the time even when
GPT-3 was given example answers in its prompt.

## Stage 3: reward answers that check out

The newest stage works on tasks where you can check the answer
automatically: a math problem with a known result, code that has to pass
tests, an instruction like "mention at least three people by name". The model
tries the task, a program checks the result, and the model is rewarded only
when it's correct. Tulu 3 named this **reinforcement learning with verifiable
rewards** (RLVR). In their setup the reward was a flat 10 for a correct answer
and 0 otherwise.

No human judges each answer, and no reward model has to guess at quality. The
check is the reward.

DeepSeek-R1 (2025) showed how far this goes. Trained this way on math, code
and logic, with rewards only for correct final answers, the model learned to
write long chains of reasoning, check its own work, and try other approaches,
without anyone showing it how. This is the stage that produces
[[reasoning-models]].

## The three stages side by side

| | Learns from | What it mostly changes |
|---|---|---|
| Supervised fine-tuning | Example answers, imitated token by token | Format: answer the question, in an assistant's voice |
| Preference tuning | Pairs of answers, one marked better | Style and subtle preferences that are hard to write down |
| RL with verifiable rewards | A check that says right or wrong | Skill on tasks with checkable answers, like math and code |

The first two stages shape how the model talks. The third can change what it
can do, but only where there's a reliable check. For writing an essay or
giving advice, there's no program that can say "correct".

## How the recipe has changed

The stages get combined differently over time:

| Recipe | Stages |
|---|---|
| InstructGPT (OpenAI, 2022) | SFT → reward model → RL (PPO) |
| Tulu 3 (Ai2, 2024) | SFT → preference tuning with DPO → RLVR |
| DeepSeek-R1 (2025) | small SFT → RL on reasoning → more SFT on reasoning and general data → RL for reasoning, helpfulness and safety |

![Three post-training recipes drawn as pipelines from base model to assistant. InstructGPT (2022): SFT, reward model, RL with PPO. Tulu 3 (2024): SFT, DPO, RL with verifiable rewards. DeepSeek-R1 (2025): small SFT, RL on reasoning, more SFT, then RL for reasoning, helpfulness and safety. Same building blocks, different orders, and RL on checkable answers takes a bigger share over time.](img/post-training-recipes.svg)

Early recipes were one pass of each. Current ones run multiple rounds, mix
human and synthetic data, and use several training methods. Most labs don't
say exactly what they do. The data and recipe for post-training are among the
least-shared parts of building a model.

## It's small next to pretraining, but growing

Post-training used to be cheap by comparison. Training InstructGPT 175B took
about 60 petaflop/s-days of compute, against 3,640 for pretraining GPT-3. That
gap is closing. DeepSeek spent roughly 5% of its total compute on R1's
post-training, and reinforcement learning is taking a growing share of
frontier training budgets as of 2026.

## Where it gets tricky

**Does post-training add ability, or just style?** Two views here. One says
almost all knowledge comes from pretraining, and post-training mostly teaches
the model which format to answer in. The evidence: 1,000 examples were enough
to make LIMA a decent assistant. The other view says that's out of date. RL on
math problems can make a model reason at length and score higher on hard
reasoning tests, which is more than style. Both can be true: a light recipe
mostly shapes style, and a heavy RL stage adds real skill on checkable
tasks.

**The model aligns to someone's taste.** InstructGPT was tuned to the
preferences of a specific group, mostly its labelers and researchers, not to
some universal idea of good behavior. Different labs, different labelers,
different instructions: different assistants.

**Preferences leak in, including bad ones.** InstructGPT hedged too much on
simple questions, giving several answers when one was clear. The authors think
it's partly because labelers were told to reward humility, and the reward
model picked that up. It also tended to accept false premises in a question.
A related effect, flattery, is covered in [[rlhf]].

**There's an alignment tax.** RL made InstructGPT worse on some standard
benchmarks. Mixing in some pretraining-style updates during RL fixed most of
it.

**"Human feedback" is often AI feedback now.** Tulu 3's preference labels came
from GPT-4o rating answers, not from people. DeepSeek-R1's reasoning rewards
came from rule-based checks.

## What this means when you build

- **A model's style and habits are a product decision.** Its tone, format,
  verbosity and refusals come from post-training. Two models with similar
  knowledge can behave very differently, so test the ones you're choosing
  between on your own prompts.
- **Your prompt works on top of post-training.** A [[system-prompt]] steers
  within the habits the model was trained into. It can't fully undo them.
- **Expect the biggest gains on checkable tasks.** Math and code improved the
  most from RL because answers can be verified. Open-ended writing has no such
  check.
- **Fine-tuning is post-training you do yourself.** If you ever train a model
  on your own examples, it's usually a small SFT or preference stage on top of
  someone's model. See [[fine-tuning]].

## Further reading

- [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155),
  Ouyang et al. (OpenAI), 2022. The InstructGPT paper: the classic three-step
  recipe, with its costs and side effects.
- [Tulu 3: Pushing Frontiers in Open Language Model Post-Training](https://arxiv.org/abs/2411.15124),
  Lambert et al. (Ai2), 2024. A fully open modern recipe: SFT, DPO and RL with
  verifiable rewards.
- [Introduction to the RLHF book](https://rlhfbook.com/c/01-introduction),
  Nathan Lambert, 2026. The clearest overview of post-training's stages and
  history, and the base-vs-post-trained example.
- [LIMA: Less Is More for Alignment](https://arxiv.org/abs/2305.11206),
  Zhou et al. (Meta), 2023. The case that post-training mostly teaches
  format.
- [DeepSeek-R1](https://arxiv.org/abs/2501.12948), DeepSeek-AI, 2025. RL on
  checkable tasks, and the full multi-stage recipe of an open reasoning model.
