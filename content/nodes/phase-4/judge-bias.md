---
id: judge-bias
title: Where do LLM judges go wrong?
depth: short
phase: 4
note: >-
  The ways model graders are biased: answer order, length, their own style.
needs: [llm-as-judge]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# Where do LLM judges go wrong?

An [[llm-as-judge|LLM judge]] can be swayed by things that have nothing to
do with quality: which answer it read first, which one is longer, and
possibly which one sounds like itself. These biases are large enough to
flip an eval result, and they're cheap to test for, so check your judge for
them before you believe a comparison.

## Position: the first answer (or the second) wins

Ask a judge which of two answers is better, then ask again with the order
swapped. A fair judge gives the same answer both times. In 2023 tests,
judges often didn't.

In one study, researchers compared answers from Vicuna-13B and ChatGPT on
80 questions. With ChatGPT as the judge, Vicuna won 2.5% of the time when
its answer came first and 82.5% when it came second. The judge's verdict
flipped on 66 of the 80 questions just from the swap. GPT-4 was steadier
but still flipped on 37 of 80, and it leaned the other way, toward the
first answer. The prompt already told both judges not to let order affect
their judgment.

![Two bar charts of the same answers judged differently. Left, position: Vicuna-13B's win rate against ChatGPT depends on where its answer appears. With GPT-4 judging, 51.3% when shown first and 23.8% when shown second. With ChatGPT judging, 2.5% when first and 82.5% when second. Right, length: the same GPT-4 Turbo model judged against its own answers on AlpacaEval scores a 22.9% win rate when prompted to be concise and 64.3% when prompted to be verbose. With length control the spread shrinks to 41.9% to 51.6%.](img/judge-bias-order-length.svg)

A second 2023 study found the same thing across judges. Given two similar
answers, GPT-4 kept its verdict after a swap 65% of the time, GPT-3.5 46%,
and Claude-v1 24%. Claude-v1 picked the first answer 75% of the time.

The flips cluster where the answers are close in quality. When one answer
is clearly better, order barely matters. When they're near-equal, which is
exactly when you're comparing two versions of a prompt, order can decide.

## Length: longer looks better

Judges tend to prefer the longer answer, even when the extra length adds
nothing. In one test, researchers took answers containing a numbered list
and padded each list with a rephrased copy of its own items, so a 5-item
list became 10 items with no new information. GPT-3.5 and Claude-v1
preferred the padded version in 91% of 23 cases. GPT-4 did in 9%.

The AlpacaEval leaderboard shows the effect at scale. There, a GPT-4 Turbo
judge compares a model's answers against a baseline's. When the baseline
model itself was told to be concise, it won 22.9% against its own normal
answers. Told to give as much detail as possible, it won 64.3%. Same model,
same knowledge, and the only change was how much it wrote. A statistical
fix that estimates each preference at equal length cut that spread to
41.9% to 51.6% and made the leaderboard agree more closely with human
votes on Chatbot Arena (a rank correlation of 0.98, up from 0.94).

## Self-preference: maybe it likes its own style

The third suspected bias is a judge favoring answers written by itself, or
by models like it. In the 2023 tests, GPT-4 as judge gave its own answers a
10% higher win rate than human judges did, and Claude-v1 gave itself 25%
higher. But GPT-3.5 didn't favor itself, the judges also favored some other
models, and the authors said their data couldn't settle whether the bias
was real. Treat it as a risk to test for, not a known size.

## Where it gets tricky

**The numbers are from 2023 judges.** GPT-4 was already much less biased
than GPT-3.5 or Claude-v1 in the same tests, and today's models may be
better again. Nobody can tell you how biased your judge is on your data.
You have to measure it.

**Telling the judge not to be biased doesn't work.** Both position studies
used prompts that said to ignore order. The fixes that helped were
structural.

**A consistent judge isn't necessarily a right one.** Adding examples to
the prompt raised GPT-4's consistency under swaps from 65% to 78%, but
being consistent only means it's no longer swayed by order. It can still be
consistently wrong.

## What this means when you build

- **Run pairwise comparisons in both orders.** Count a win only if the same
  answer wins both times. If the verdict flips, call it a tie.
- **Ask for reasons before the verdict.** In one study, having the judge
  write its evidence first, sampling it a few times, and averaging over both
  orders improved agreement with human labels by 10 to 14 points.
- **Send close calls to a person.** The cases where the verdict flips are
  the ones a judge can't settle. In the same study, having a person review
  the 20% most order-sensitive cases brought the judges level with an
  average human annotator.
- **Keep compared answers close in length,** or tell the judge length isn't
  a criterion and test that it listens.
- **Test your judge for these directly.** Swap the order, pad an answer, and
  see if the verdict moves.
- **Be careful when a model grades itself.** If the judge and the model
  under test are the same, check its verdicts against [[human-review|human
  labels]] with extra care.

## Further reading

- [Large Language Models are not Fair Evaluators](https://arxiv.org/abs/2305.17926),
  Peiyi Wang et al., 2023. Position bias measured, the 66-of-80 flip, and
  three fixes: evidence first, both orders, humans for close calls.
- [Length-Controlled AlpacaEval](https://arxiv.org/abs/2404.04475),
  Yann Dubois, Balázs Galambosi, Percy Liang and Tatsunori Hashimoto, 2024.
  How much answer length moves a judge, and a regression that removes it.
- [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685),
  Lianmin Zheng et al., 2023. Names all three biases and measures them
  across three judges, with the swap-and-tie fix.
