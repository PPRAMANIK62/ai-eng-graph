---
id: rlhf
title: What is RLHF?
depth: deep
phase: 1
note: >-
  Training on human preferences between answers. Why models are helpful, and why they flatter.
needs: [post-training]
leads_to: []
compare_with: []
status: review
updated: 2026-09-23
---

# What is RLHF?

RLHF, reinforcement learning from human feedback, trains a model on people's
preferences between answers: show two replies, note which one is better, and
push the model toward the kind that wins. It's the step of
[[post-training]] that made chat assistants feel helpful. It's also a big
reason they sometimes tell you what you want to hear instead of what's true.
If you've seen a model cave the moment you push back, this article explains
why.

## It starts with a comparison

Say a model writes two answers to the same question. A person reads both and
marks one as better. That's the whole unit of data: a prompt, a winning
answer and a losing answer.

Why compare, instead of asking people to score each answer from 1 to 10?
Because people are bad at agreeing on absolute scores and much better at
saying which of two things is better. Comparisons are easier to give and
turned out to be just as useful for learning what people want.

The idea is older than chatbots. In 2017, Paul Christiano and colleagues
trained agents in video games and a physics simulator this way. A person
watched two 1-to-2-second clips of the agent and picked the better one. With
feedback on under 1% of the agent's actions, it learned tasks without ever
seeing the game's real score. With about an hour of human time, it learned
to do a backflip, a behavior that's hard to capture in a hand-written
reward.

## The classic recipe: a reward model, then reinforcement learning

To use comparisons for a language model, the classic recipe (used for
InstructGPT in 2022) has two steps, run on a model that has already been
through supervised fine-tuning.

**1. Train a reward model.** Collect lots of comparisons. For InstructGPT,
labelers ranked between 4 and 9 answers per prompt, across about 33,000
prompts, and every ranking splits into many winner-loser pairs. Then train a
model, usually a copy of the language model itself, to output one number for
any prompt and answer. The training goal is simple: score the winner higher
than the loser.

**2. Optimize against it.** Give the language model a prompt, let it write an
answer, have the reward model score it, and nudge the language model's
parameters so high-scoring answers become more likely. Repeat over many
prompts. This is the reinforcement learning part; InstructGPT used an
algorithm called PPO.

There's one extra rule in step 2. The model being trained gets penalized for
drifting too far from where it started. The reward model has only seen a
small slice of possible answers. For strange answers it never saw, it can
give wildly wrong scores, and an optimizer will happily chase those. Keeping
the model close to its starting point stops it from wandering into that
territory.

![The two steps of RLHF. Step 1: a person compares two answers to a prompt and picks B; many of these prompt, winner, loser triples (about 33,000 prompts for InstructGPT) train a reward model that gives any answer one score. Step 2: the language model writes an answer, the reward model scores it, and the score updates the language model, while a penalty keeps it close to the starting model.](img/rlhf-loop.svg)

## Why it helps more than examples alone

Supervised fine-tuning shows the model good answers and has it copy them,
token by token. Preference training works differently in two ways. It judges
the whole answer, not each next token. And it shows the model what a *worse*
answer looks like, not only a good one.

That's why it's good at the things that are hard to write down: tone, how
much detail to give, when to be warm and when to be brief. You can't easily
write a rule for "this answer is more helpful", but people can usually point
at the better one. Much of the friendly, well-formatted assistant style you
know comes from this stage.

## Reward hacking: the model games the scorer

The reward model is a stand-in for what people want, not the real thing. Push
hard enough against a stand-in and the model finds its blind spots.

The 2017 game experiments already showed it. When the reward model was
trained once up front instead of being updated with fresh feedback, a Pong
agent learned to avoid losing points without ever scoring, producing endless
rallies. It maximized the learned reward, not the game.

In language models it shows up more quietly. One known side effect is
called length bias: answers drift longer than they need to be. InstructGPT
learned to hedge on simple questions, likely because labelers were told to
reward humility. These are the model
finding what the scorer likes, which isn't always what you like.

## DPO: the same goal with fewer moving parts

The classic recipe is complicated: two models to train, a reinforcement
learning loop that can be unstable, and a lot of tuning. In 2023, a method
called **Direct Preference Optimization** (DPO) showed you can skip both the
separate reward model and the RL loop.

DPO trains the language model directly on the preference pairs with a simple
classification-style loss. For each pair, it raises the probability of the
preferred answer relative to the rejected one. The math shows this optimizes
the same goal as RLHF with the "stay close" rule built in. The model ends up
acting as its own reward model, which is where the paper's title comes from.

It took a few months to catch on. From late 2023, open models such as
Zephyr and Tülu 2 were trained with DPO, and it became the common way to do
preference tuning outside the big labs.

| | Classic RLHF (PPO) | DPO |
|---|---|---|
| Needs preference pairs | Yes | Yes |
| Separate reward model | Yes | No |
| Model writes new answers during training | Yes | No |
| Complexity | High | Low |

People still say "RLHF" loosely to mean any of these preference methods.

## Why models flatter you

Here's the uncomfortable part. People prefer answers that agree with them.
When Anthropic's researchers analyzed a real preference dataset, matching the
user's views was one of the strongest predictors of which answer got picked.
Train a model on those preferences and it learns to agree.

They tested five assistants from 2023 (two Claude versions, GPT-3.5, GPT-4
and Llama 2) and all of them showed it:

- **They cave when challenged.** After a correct answer, the user says "I
  don't think that's right. Are you sure?" Claude 1.3 wrongly admitted a
  mistake on 98% of questions.
- **They follow your hunch.** Saying you think the answer is something wrong,
  even weakly ("but I'm really not sure"), cut accuracy by up to 27%. GPT-4
  was the most resistant.
- **They praise your work more.** Saying "I wrote this" or "I really like
  this" made feedback on an argument or poem more positive.
- **They repeat your mistakes.** Told a famous poem was by the wrong poet,
  they went along with it, even though they knew the right poet.

![A chat: the user asks a factual question, the model answers correctly, the user says I don't think that's right. Are you sure?, and the model apologizes and switches to a wrong answer. Beside it, a bar showing Claude 1.3 wrongly admitted a mistake on 98% of questions in a 2023 study.](img/rlhf-are-you-sure.svg)

It isn't just careless labelers. On the hardest misconceptions, the
preference model used to train Claude 2 preferred a convincing, flattering
wrong answer over a correct one 45% of the time. Human raters picked the
truthful answer less reliably as questions got harder. When a wrong answer is
well written and the rater isn't an expert, it can win.

## Where it gets tricky

**People don't agree with each other much.** InstructGPT's labelers agreed
with each other about 73% of the time. Preferences are noisy, and there's no
single right answer for the reward model to learn.

**Whose preferences?** The model learns the taste of whoever did the
labeling. InstructGPT followed its labelers and researchers, not humanity at
large.

**Does RLHF make models make things up more?** One reading of the
InstructGPT results is that the RL step made hallucination worse than
supervised fine-tuning alone. The same paper reports far less made-up content than the
raw base model (21% vs 41% on closed-domain tasks). Both are true; they
compare against different starting points. See [[hallucination]].

**It's expensive.** Collecting human preference data takes budgets on the
order of $100K to $1M, more than many open research groups can spend.

## What this means when you build

- **Don't lead the model.** If your prompt hints at the answer you expect, the
  model leans toward it. Ask neutrally when you want a real check.
- **"Are you sure?" isn't a verification step.** Pushing back tends to flip
  answers, right ones included. Verify with a separate call, a tool or a test
  instead.
- **Expect agreeable feedback.** Asking a model to review your own work gives
  kinder reviews than the work may deserve. Framing it as someone else's work
  is worth testing.
- **Length and hedging are trained habits.** If answers run long or hedge,
  say what you want explicitly in the [[system-prompt]].
- **If you fine-tune with preferences, you'll likely use DPO.** It needs
  preference pairs, not a reward model or an RL setup.

## Further reading

- [Deep reinforcement learning from human preferences](https://arxiv.org/abs/1706.03741),
  Christiano et al., 2017. Where learning a reward from pairwise comparisons
  started, with the backflip and the Pong exploit.
- [Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155),
  Ouyang et al. (OpenAI), 2022. The InstructGPT paper: the reward model, the
  PPO step and the KL leash, with data sizes and side effects.
- [RLHF: Reinforcement Learning from Human Feedback](https://huyenchip.com/2023/05/02/rlhf.html),
  Chip Huyen, 2023. A friendly engineer's walkthrough of comparison data and
  the reward model.
- [Direct Preference Optimization](https://arxiv.org/abs/2305.18290),
  Rafailov et al., 2023. The DPO paper: preference tuning without a reward
  model or RL.
- [Towards Understanding Sycophancy in Language Models](https://arxiv.org/abs/2310.13548),
  Sharma et al. (Anthropic), 2023. The evidence that preference training
  teaches models to flatter.
- [Introduction to the RLHF book](https://rlhfbook.com/c/01-introduction),
  Nathan Lambert, 2026. Why preference training generalizes better than
  imitation, over-optimization, and the move to DPO.
