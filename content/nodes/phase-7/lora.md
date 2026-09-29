---
id: lora
title: What is LoRA?
depth: short
phase: 7
note: >-
  Fine-tuning a small add-on instead of the whole model.
needs: [fine-tuning]
leads_to: []
compare_with: [quantization]
updated: 2026-09-29
---

# What is LoRA?

LoRA, low-rank adaptation, is the cheap way to do [[fine-tuning]]. Instead
of changing every weight in the model, you freeze them all and train a
small add-on next to each weight matrix. You get most or all of the effect
of full fine-tuning for a fraction of the memory, and the add-on is small
enough to store, swap and serve by the dozen.

## A small correction on top of each big matrix

A [[transformer]] is mostly big weight matrices. Take one of them, $$W$$,
with $$N \times N$$ numbers in it. Full fine-tuning learns a change to every
one of those numbers.

LoRA bets that the change you need is much simpler than the matrix. So it
leaves $$W$$ frozen and learns the change as the product of two thin
matrices: $$B$$, which is $$N \times r$$, and $$A$$, which is
$$r \times N$$. The rank $$r$$ is small: the studies below use anything from 1 to a few
hundred. The
layer now computes with

$$
W' = W + \gamma BA
$$

where $$\gamma$$ is a fixed scaling factor. $$B$$ starts at zero, so at the
start of training the model behaves exactly like the original. Only $$A$$
and $$B$$ get trained.

![Diagram of one LoRA layer. The input goes through the frozen weight matrix W, N by N, and also through two small trainable matrices, A (r by N) then B (N by r), whose output is scaled and added to W's output. Below, parameter counts from Thinking Machines for Llama-3.1-8B: LoRA on all layers at rank 256 trains 0.70 billion parameters, attention-only at rank 256 trains 0.25 billion, against all of the roughly 8 billion for full fine-tuning. The original LoRA paper reports 10,000 times fewer trainable parameters than full fine-tuning of GPT-3 175B.](img/lora-mechanism.svg)

The savings are large. On GPT-3 175B in 2021, LoRA trained 10,000 times
fewer parameters than full fine-tuning and needed 3 times less GPU memory,
with no extra latency at inference. Memory is the big one: full
fine-tuning keeps gradients and optimizer state for every weight, often in
higher precision than the weights themselves, so it usually needs an order
of magnitude more accelerators than just running the model. LoRA only
keeps that state for the small matrices.

## Why the small add-on is handy

Because the base model never changes, the add-on (the "adapter") is a
separate, small file. That gives you some practical wins:

- **Many tasks, one base model.** A server can hold many adapters in memory
  on top of one copy of the base model and serve requests for all of them
  in the same batch. vLLM and SGLang support this.
- **Easy to ship.** An adapter is quick to save, load and move between
  machines.
- **Less compute per step.** A LoRA training pass costs a bit more than
  two-thirds of the compute of a full fine-tuning pass.

In practice you rarely write this yourself. The code in [[fine-tuning]]
shows LoRA as one extra argument to an open-source trainer.

## Does it match full fine-tuning? The answer changed

This has flipped back and forth, and the timeline is worth knowing.

![A timeline of findings on LoRA versus full fine-tuning. 2021, the LoRA paper: on par or better on RoBERTa, DeBERTa, GPT-2 and GPT-3. 2024, LoRA Learns Less and Forgets Less: on code and math, with about 100,000 instruction pairs or 20 billion tokens of continued pretraining, LoRA substantially underperformed, but forgot less outside the target domain. 2025, LoRA Without Regret: with LoRA on all layers and about a 10 times higher learning rate, it matched full fine-tuning on post-training-sized data and in reinforcement learning, and still fell short only when the data was too big for the adapter.](img/lora-timeline.svg)

**2021.** The original paper found LoRA on par with or better than full
fine-tuning on the models of the day (RoBERTa, DeBERTa, GPT-2, GPT-3).

**2024.** A study on code and math found the opposite. With about 100,000
instruction pairs, or 20 billion tokens of continued pretraining, LoRA
substantially underperformed full fine-tuning. It did have an upside: it
forgot less of what the base model could do outside the target domain. The
authors also measured that full fine-tuning learns changes with 10 to 100
times higher rank than typical LoRA setups, which may explain the gap.

**2025.** A careful study by Thinking Machines swept the learning rate for
every run and found that most of the gap came from setup. Their findings:

- On instruction and reasoning datasets of post-training size, LoRA
  performs the same as full fine-tuning.
- Apply it to **all** weight matrices, especially the MLP layers.
  Attention-only LoRA underperforms, even with the same number of trainable
  parameters.
- Use a learning rate about **10 times higher** than you would for full
  fine-tuning. The best rate barely changes with rank.
- For reinforcement learning, even very small ranks match full
  fine-tuning, because RL gives the model very little information per
  episode.

Everyone agrees on one limit. When the dataset is so big it looks like
pretraining, it holds more than the adapter can absorb, and LoRA falls
behind. LoRA also pays a bigger penalty than full fine-tuning at very large
batch sizes, and raising the rank doesn't fix that.

## Where it gets tricky

**The setup decides the result.** If you put LoRA only on the attention
layers, or reuse the learning rate you'd use for full fine-tuning, you're
in the setup that underperforms. Much of the old disagreement may come
down to this.

**"Matches" is measured in loss.** The 2025 study mostly compares training
and test loss, plus RL rewards. Your task might differ. Run your own evals
on a held-out set.

## What this means when you build

- Default to LoRA for fine-tuning an open model. It's cheaper to train,
  store and serve, and on post-training-sized data you lose little or
  nothing.
- Target all layers, and tune the learning rate starting around 10 times
  the full fine-tuning rate.
- To cut memory further, look at storing the base model in fewer bits
  (see [[quantization]]).
- Consider full fine-tuning only when your data is huge, and check it
  actually beats LoRA on your evals.

## Further reading

- [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685),
  Edward Hu et al. (Microsoft), 2021. The original method and the GPT-3
  savings numbers.
- [LoRA Learns Less and Forgets Less](https://arxiv.org/abs/2405.09673),
  Dan Biderman et al., 2024. The case that LoRA falls short on code and
  math, and forgets less.
- [LoRA Without Regret](https://thinkingmachines.ai/blog/lora/), John
  Schulman and Thinking Machines Lab, 2025. When LoRA matches full
  fine-tuning, with the settings that make it work.
