---
id: benchmarks
title: What do LLM benchmarks measure?
depth: deep
phase: 4
note: >-
  Public scores like MMLU and SWE-bench: what they measure, and how they get contaminated.
needs: [evals]
leads_to: [model-selection]
compare_with: [agent-evals, evals]
updated: 2026-09-29
---

# What do LLM benchmarks measure?

A benchmark is a public test that every lab runs its models on, so the
scores can be compared. It's how a model launch says "better than last
time". Benchmarks are useful for ruling out weak models, but a high score
can mean the model saw the test during training, the test itself is
broken, or the leaderboard was played. You need to know which before a
number changes what you build.

## A benchmark is a shared exam

A benchmark is an [[evals|eval]] that belongs to nobody's product: a fixed
set of tasks, a scoring rule, and a table of results for many models.

Take MMLU, from 2020. It's a set of multiple-choice questions across 57
subjects, from elementary math to US history to law. To score well a model
needs broad knowledge and some problem solving. When it came out, most
models scored close to chance. The largest GPT-3 was the standout, at
almost 20 percentage points above chance on average. The paper also found
that models often didn't know when they were wrong.

SWE-bench Verified is a different kind. Each task is a real GitHub issue
plus the codebase it came from. The model has to write a patch, and the
patch is graded by running the project's tests. Verified is 500 bug fixes
from 12 Python repositories, picked out of the original 2,294 SWE-bench
tasks. Each task was checked by three experts, and nearly a hundred
software engineers worked on the review, to remove tasks that were unfair.

So there are at least three kinds of public score you'll run into:

- **Static question sets** like MMLU: fixed questions, fixed answers.
- **Task benchmarks** like SWE-bench: the model does work and a program
  checks it.
- **Human-vote leaderboards** like Arena, where people vote between
  models head to head and the votes become a ranking.

None of them know anything about your prompts, your data or your users.
That's the gap between a benchmark and a product eval.

## A benchmark is only useful for a while

A benchmark gets popular when it measures something that matters and models
score low on it, say 20% or less. Labs then have something to climb. As
scores climb, each new point means less. Near the top, a 0.1% change is
noise.

SWE-bench Verified went through the whole arc. By early 2026, most frontier
models reported around 80%, and new releases moved the score by tiny
amounts. On 2026-02-23 OpenAI, whose team had built Verified, stopped
reporting it and switched to SWE-Bench Pro. They gave two reasons, and each
one is a way a benchmark score stops meaning what it says.

![A bar standing for all 500 SWE-bench Verified tasks. OpenAI audited 27.6% of them, focusing on tasks models kept failing. In 59.4% of the audited tasks, the tests rejected correct fixes. That makes at least 16.4% of the whole benchmark broken, a floor, since the rest was never audited.](img/benchmarks-swe-bench-audit.svg)

## Broken tests: the grader rejects right answers

OpenAI audited 27.6% of the tasks, focusing on ones that models kept
failing.
In 59.4% of them, the test was the problem, not the model. That's at least
16.4% of the whole benchmark, a floor, since most tasks weren't audited.

The bad tests came in two kinds:

- **Too narrow.** The test checks an implementation detail the issue never
  mentioned. A correct fix done a different way fails.
- **Too wide.** The test checks for extra features the issue never asked
  for.

A task-based benchmark is only as good as its grader. A grader can also
be too loose: one research group found a reward hack that gets a perfect
score on SWE-bench Verified. Epoch AI, which reviews benchmarks, rates
Verified "Flawed". Its bar is that 20% or more of an inspected sample has
errors.

## Contamination: the model has seen the test

The second reason was contamination. The benchmark's tasks, or text close
to them, end up in a model's training data. Then a high score measures
memory, not skill.

It often happens without anyone cheating. SWE-bench tasks come from popular
open-source repositories, which are exactly the kind of code labs train on.
And a famous benchmark gets copied, discussed and quoted all over the web,
so its tasks leak into other training data over time. For a static
benchmark built from public code, the safe assumption is that every
current and future model has trained on it. As of 2026-09, every
SWE-bench Verified task and solution is public.

The way OpenAI caught it is a good story. GPT-5.2 solved some tasks that
the team believed were unsolvable, because the tests demanded things the
issue never mentioned. Reading the model's chain of thought showed it knew
about those unstated requirements. It had seen the fix. A follow-up audit
found models from several labs could reproduce the original fix or the
issue text almost word for word, given only the task ID.

You can also measure contamination from the outside, by writing a new test
that looks like the old one. GSM1k did this in 2024: 1,000 new
grade-school math problems matched to the public GSM8k benchmark on
difficulty, number of steps and answer size. If a model is really good at
grade-school math, it should score about the same on both.

![How GSM1k tests for contamination. A model is scored on the public GSM8k benchmark and on GSM1k, a fresh set of 1,000 problems matched to GSM8k in style and difficulty that can't be in the training data. If the model learned the skill, the two scores match. If it memorized GSM8k, it scores lower on GSM1k. Some model families dropped by up to 8%, and the models most likely to generate GSM8k problems had the biggest drops (Spearman r² = 0.36). Frontier models showed little drop.](img/benchmarks-gsm1k.svg)

Some model families dropped by up to 8% on the fresh set, across almost
all their sizes. The drop tracked how likely a model was to generate
GSM8k problems itself, which points to memorization. But many
models, the frontier ones especially, showed little drop, and all of them
could solve new problems.

## Gaming: the leaderboard gets played

Human-vote leaderboards don't have a fixed test set. New votes keep
coming in from new users, so there's nothing to memorize. Arena (formerly
Chatbot Arena, also called LMArena) is the best known. Models meet head to
head in "battles", people vote, and the votes add up to a score.

In 2025 a group of researchers showed ways that score can be tilted:

- **Private testing.** Big providers tested many unreleased variants and
  published only the best one. Meta tested 27 private variants before
  Llama 4 came out. Picking the best of many noisy scores gives you a score
  that's higher than the model deserves.
- **Unequal sampling.** Closed models got more battles and were removed
  less often. By their estimate Google and OpenAI each got about 20% of all
  Arena data, while 83 open-weight models together got about 30%.
- **Data advantage.** More Arena data helps a lab tune for what Arena
  voters like. They reported relative gains of up to 112%.

Arena disputed the size of these effects. Its own estimate of the boost
from private testing was about +11 Elo after 50 tests and 3,000 votes,
shrinking to zero as new votes arrive. It said the 112% came from a
different benchmark, Arena-Hard, which is a static set graded by an LLM,
not live human votes. It also announced changes: every provider may test
private variants, retired models get marked, and when more than 10
variants were tested in parallel, the released model's score stays
provisional until 2,000 fresh votes come in.

Both sides agree on the mechanism: testing many variants and keeping the
best is a real bias. They disagree on how big it is. For you, the lesson
holds either way. A leaderboard rank reflects what that leaderboard's
voters like, which can drift from what your users need.

## Where it gets tricky

**Contaminated doesn't mean the skill is fake.** GSM1k found real
memorization, and also found frontier models solving new problems fine.
OpenAI's team said Verified still measures a real ability, fixing a
described bug. What it lost was the power to show progress at the top.
Contamination makes a score less trustworthy, not worthless.

**People disagree on when a benchmark is done.** OpenAI called Verified
saturated at around 80%. The original SWE-bench authors argued the real
ceiling is 87% to 95%, so there was still room. Saturation is partly a
judgment about how many of the remaining tasks are broken.

**The replacement will age too.** SWE-Bench Pro showed only very light
signs of contamination when OpenAI switched to it in 2026. Its tasks are
bigger and harder. Once its tasks and solutions are public for long
enough, the same forces apply. Benchmarks have a shelf life.

**The same model gets different scores.** Task benchmark results depend a
lot on the scaffold, the code around the model that runs the task. Two
reports of "model X on SWE-bench" may not be the same experiment.

**Aggregated leaderboards hide their choices.** Sites that combine many
benchmarks into one ranking don't always say clearly how they picked and
weighted them. A single "intelligence" number carries all those choices.

## What this means when you build

- Use public benchmarks to rule models out, not to pick the winner. A
  model that's weak on a relevant benchmark is probably weak for you. A
  model that tops one isn't necessarily best for your task.
- Pick benchmarks close to your task (code, math, tool use), and check
  whether they're saturated or known to be flawed. Independent reviews like
  Epoch's help.
- Distrust small gaps near the top of a benchmark, and ranks on a
  leaderboard without confidence intervals.
- Then run your own [[evals]] on your own data. That's how you choose;
  see [[model-selection]].

## Further reading

- [SWE-bench Verified – Benchmark Review](https://epoch.ai/benchmarks/swe-bench-verified/review),
  Epoch AI, 2026. What Verified is, OpenAI's audit numbers, and why Epoch
  rates it "Flawed". The primary OpenAI post returned 403 for us.
- [The End of SWE-Bench Verified](https://www.latent.space/p/swe-bench-dead),
  Latent Space with Mia Glaese and Olivia Watkins (OpenAI), 2026. The team
  that built Verified on why they dropped it: broken tests, contamination,
  and how they found it.
- [A Careful Examination of Large Language Model Performance on Grade School Arithmetic](https://arxiv.org/abs/2405.00332),
  Hugh Zhang et al. (Scale AI), 2024. GSM1k: measuring contamination with
  a fresh look-alike test.
- [The Leaderboard Illusion](https://arxiv.org/abs/2504.20879),
  Shivalika Singh et al., 2025. How Arena scores can be tilted by private
  testing and unequal sampling.
- [Our Response to 'The Leaderboard Illusion' Writeup](https://arena.ai/blog/our-response/),
  Arena team, 2025. Arena's rebuttal of the numbers and the policy changes
  it made.
- [Measuring Massive Multitask Language Understanding](https://arxiv.org/abs/2009.03300),
  Dan Hendrycks et al., 2020. The MMLU paper: what a classic knowledge
  benchmark tests and how models scored when it was new.
- [AI Engineering book resources](https://github.com/chiphuyen/aie-book),
  Chip Huyen, 2025. The chapter 4 summary makes the case that public
  benchmarks weed out bad models but can't find the best one for you.
