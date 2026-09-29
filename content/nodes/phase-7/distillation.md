---
id: distillation
title: What is distillation?
depth: short
phase: 7
note: >-
  Training a small model to copy a bigger one's outputs.
needs: [fine-tuning, reasoning-models]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# What is distillation?

Distillation means training a small model, the student, to copy a big
model, the teacher. The big model is too slow or expensive to run for
every request, so you use it once to make training data, and ship the
small one. Done well, the student keeps much of the teacher's skill on the
task you care about, at a small model's cost.

## The original idea: learn from the teacher's near-misses

The term comes from a 2015 paper from Google. The setting was image and
speech classifiers, but the idea carries over.

Show a trained image classifier a photo of a BMW. It says "car" with high
confidence. But look at the rest of its output: it gives a tiny chance to
"garbage truck", and a far tinier one to "carrot". Those small numbers are
the model's sense of what looks like what. A plain label ("car") throws
that away.

So instead of training the small model on the right answers only, train
it to match the big model's whole probability spread, its **soft
targets**. Each example then carries much more information, and the small
model learns how the big one generalizes, not just what it answered.

There's a catch: a confident model puts almost all probability on one
class, so the interesting small numbers are nearly zero and barely affect
training. The fix is to raise the [[temperature]] of the final
[[softmax]] while training, which flattens the spread so the small
probabilities count. The student trains at that same high temperature and
goes back to a temperature of 1 when it's used. In practice you mix in the
real labels too, as a second loss.

The results were strong. On handwritten digits (MNIST), a big network made
67 test errors. A small one trained the normal way made 146. The same
small network trained on the big one's soft targets made 74. On the speech
model behind Android voice search, one distilled model got 60.8% frame
accuracy, almost matching an ensemble of 10 models at 61.1%, with the same
word error rate (10.7%).

## Distilling LLMs: train on the teacher's answers

With language models, the common version is simpler. You don't match
probabilities. You have the teacher write answers, and you
[[fine-tuning|fine-tune]] the student on that text, as ordinary supervised
fine-tuning.

The clearest recent example is DeepSeek-R1 (published 2025-01). DeepSeek
generated about 800,000 training samples with R1, their big
[[reasoning-models|reasoning model]], and fine-tuned six open models on
them, from Qwen2.5-Math-1.5B up to Llama-3.3-70B. Only supervised
fine-tuning, no reinforcement learning. The 1.5B student scored 28.9% on
the AIME 2024 math benchmark, where GPT-4o (the 2024-05 version) scored
9.3%.

They also asked the obvious question: why not train the small model
directly, with the same reinforcement learning that made R1? They ran over
10,000 RL steps on a 32B base model. It reached 47.0% on AIME 2024. The
same size of model, distilled from R1, reached 72.6%.

![Bar chart of AIME 2024 pass@1 accuracy for 32B-parameter models, from the DeepSeek-R1 paper (January 2025). Qwen-32B trained with large-scale reinforcement learning scored 47.0%. QwQ-32B-Preview scored 50.0%. Qwen-32B distilled from DeepSeek-R1 with supervised fine-tuning only scored 72.6%.](img/distillation-vs-rl.svg)

Copying a stronger model beat teaching the small one from scratch, without
the huge compute bill that RL at scale runs up.

The same recipe works for everyday tasks. Prompt a big model until it does
your task well on your evals. Save its outputs on real inputs. Keep only
the good ones. Fine-tune a small model on them. OpenAI documented exactly
this, and its old distillation guide now redirects to that section of its
fine-tuning guide. But as of 2026-09 OpenAI is winding down its
fine-tuning platform, so today you'd run the same recipe with an open
student model.

## Where it gets tricky

**The student has a ceiling.** It learns what the teacher shows it.
Distillation is a cheap way to spread what the best models can already
do. Going past that still takes stronger base models and bigger RL runs.

**Text-only distillation throws away the near-misses.** The 2015 method
needs the teacher's probabilities. Training on sampled text, the LLM
version, only sees the answer the teacher picked. It works well, as
DeepSeek shows, but it's a different, cruder signal.

**Narrow wins.** A distilled model is good at what its training data
covered. The DeepSeek students were measured mostly on math, code and
science benchmarks. Don't expect them to match the teacher everywhere.

**The comparison numbers age fast.** The scores above compare early-2025
models with 2024 ones. The method holds; the margins won't.

## What this means when you build

- Use distillation when a big model already does your task well and you
  need it cheaper or faster at volume.
- Treat the teacher's outputs as draft data: filter them against your
  evals before training.
- Keep a held-out test set and compare student with teacher on it. Ship
  the student only if the gap is one you can live with.

## Further reading

- [Distilling the Knowledge in a Neural Network](https://arxiv.org/abs/1503.02531),
  Geoffrey Hinton, Oriol Vinyals and Jeff Dean, 2015. The original idea:
  soft targets, temperature, and the MNIST and speech results.
- [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948),
  DeepSeek-AI, 2025. Distilling a reasoning model into six open models, and
  distillation vs RL on the same small model.
- [Supervised fine-tuning](https://developers.openai.com/api/docs/guides/supervised-fine-tuning),
  OpenAI API docs. The practical recipe in "Distilling from a larger
  model", now under the fine-tuning wind-down notice.
