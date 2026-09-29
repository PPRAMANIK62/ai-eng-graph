---
id: evaluator-optimizer
title: What is the evaluator-optimizer pattern?
depth: deep
phase: 3
note: >-
  One call writes, another checks it against clear criteria, and they loop until it passes.
needs: [llm-workflows, grounding]
leads_to: []
compare_with: [llm-as-judge]
updated: 2026-09-29
---

# What is the evaluator-optimizer pattern?

In the evaluator-optimizer pattern, one LLM call writes an answer and a
second call grades it against clear criteria. If it fails, the grader's
feedback goes back to the writer for another try, and the two loop until
the answer passes or you run out of tries. It's one of the five
[[llm-workflows]], and the one people reach for when they want a model to
check its own work. Whether that works depends almost entirely on what
the checker can check against.

## The loop, one step at a time

Take a docs assistant that answers from retrieved articles. You want a
checking step: no claim in the answer that the articles don't support.

1. **Generate.** The writer call gets the question and the articles and
   drafts an answer.
2. **Evaluate.** The evaluator call gets the draft, the task, and the
   criteria. It returns a verdict (`PASS`, `NEEDS_IMPROVEMENT` or `FAIL`)
   and feedback: which sentences aren't supported, and why.
3. **Decide in code.** On `PASS`, return the answer. Otherwise, build a new
   prompt for the writer with the earlier drafts and the latest feedback.
4. **Repeat,** up to a limit you set.

![The evaluator-optimizer loop. The generator writes a draft. The evaluator checks it against the criteria and, ideally, against something outside the model (tests, retrieved sources). On pass, the answer is returned. Otherwise, the feedback and earlier drafts go back to the generator. A counter stops the loop after a fixed number of rounds, and the code then returns the best draft or drops the claims that failed.](img/evaluator-optimizer-loop.svg)

Anthropic's cookbook version fits in one short notebook cell. The
evaluator prompt lists the criteria, says "evaluate only, don't solve",
and asks for the verdict and feedback in XML tags. The writer sees every
previous attempt, so it has a chance to avoid repeating a mistake.

Two roles in separate calls is the point. The evaluator prompt can be
strict and narrow ("only pass if every criterion is met"), and it doesn't
carry the writer's reasoning, so it reads the draft fresh.

## When it fits

The pattern pays off under two conditions:

- **Clear criteria.** "Every claim must be supported by the retrieved
  text" can be checked. "Make it better" can't.
- **Feedback that actually improves the output.** A good test: would a
  person's written feedback make the answer better, and can a model write
  that kind of feedback? Good fits: literary translation, where a critic
  can catch nuances the translator missed, and multi-round search, where
  the evaluator decides whether another search is needed.

It's also the most common chain in practice. As of 2026-09, Anthropic's
prompting guide names draft, review against criteria, refine as the most
common chaining pattern, each step a separate call so you can log and
evaluate it.

## What the evidence says: it helps on open-ended work

The case for the pattern is Self-Refine (2023). One model wrote, critiqued
its own output and rewrote, up to four times, on seven tasks: dialogue
replies, code optimization, code readability, math, sentiment reversal,
acronyms, and writing a sentence that uses 20 to 30 given words. With
GPT-3.5, ChatGPT and GPT-4, refined outputs beat one-shot outputs by about
20 points on average.

The details matter more than the average:

- **Gains were biggest where "better" is a matter of judgment.** For
  dialogue replies, GPT-4's preference score went from 25.4% to 74.6%.
- **Most of the gain came early.** On the constrained writing task the
  score went 29.0, 40.3, 46.7, 49.7 over three rounds. On code
  optimization, 22.0, 27.0, 27.9, 28.8.
- **Specific feedback beat vague feedback.** On code optimization, the
  score was 27.5 with specific feedback ("avoid repeated calculations in
  the loop"), 26.0 with generic feedback ("improve the efficiency of the code"), and 24.8 with
  none.
- **Failures were mostly bad feedback, not bad rewrites.** When refining
  didn't help, the critique had usually pointed at the wrong problem.
- **Weak models couldn't do it.** Vicuna-13B couldn't reliably produce
  feedback in the required format.

And one result that sets up the next section: gains on math were small.
ChatGPT's feedback on math answers said "everything looks good" 94% of the
time. When an outside signal said the answer was wrong, math gains were
much bigger.

## The catch: a model can't find its own reasoning errors

A 2023 study (published at ICLR 2024) tested the same idea on reasoning
tasks with a clean setup: the model reviews its own answer with no outside
information, then revises. Accuracy didn't go up. It often went down.

![Line chart of accuracy after each round of self-correction with no outside feedback. GPT-3.5 on GSM8K: 75.9, 75.1, 74.7. GPT-3.5 on CommonSenseQA: 75.8, 38.1, 41.8. GPT-4 on GSM8K: 95.5, 91.5, 89.0. GPT-4 on CommonSenseQA: 82.0, 79.5, 80.0. For comparison, when the correct answer was used to decide when to stop, GPT-3.5 reached 84.3 on GSM8K and 89.7 on CommonSenseQA.](img/evaluator-optimizer-self-correction.svg)

The reason: the model can't reliably judge whether its own reasoning is
right. On GSM8K, GPT-3.5 kept its answer about three times in four. When
it did change, it was more likely to turn a right answer wrong than the
reverse. On CommonSenseQA, where the wrong options sound plausible, being
asked to review pushed it to switch away from correct answers, and
accuracy fell by almost half.

The same study found why earlier papers had reported gains:

- **They peeked at the answer.** Some stopped the loop as soon as the
  answer was correct, using the true label. With that oracle, GPT-3.5 went
  from 75.9 to 84.3 on GSM8K. Without it, the gain vanished. In a product,
  you don't have the label.
- **They compared against a cheaper baseline.** A review loop makes more
  calls. At equal cost, plain majority voting ([[parallel-calls]]) did
  better: with nine responses on GSM8K, voting scored 88.2 and a
  multi-agent debate 83.0.
- **The first prompt was weaker than the feedback prompt.** On Self-Refine's
  constrained writing task, just telling the first prompt to use *all* the
  words scored 81.8, higher than the 75.1 that self-correction reached
  from it. Part of the "refinement" was the feedback prompt stating the
  task properly.

## Give the evaluator something outside the model

Both papers point the same way. Self-correction works when the evaluator
has real information the writer didn't use:

- **Run the code.** AlphaCodium (2024) generated code, ran it against
  public tests and extra model-written tests, and fixed it from the error
  messages. A code executor is a near-perfect judge when the tests exist.
- **Check against the sources.** For a grounded answer ([[grounding]]),
  the evaluator gets the retrieved text and checks each claim against it.
  That's a lookup task, not "is my reasoning right?".
- **Check against rules in code.** Length limits, required sections,
  schema validity: let code decide what code can.

This is the design lesson for any checking step. An evaluator that only
re-reads the draft and asks "is this right?" is the setup that failed. An
evaluator that compares the draft to something it can see is the setup
that works.

## Where it gets tricky

**Self-Refine and the self-correction study disagree less than it seems.**
Self-Refine's big wins were on open-ended tasks judged by preference, where
there's no single right answer and specific feedback can always find
something to improve. The self-correction study tested reasoning tasks
with one right answer and no outside signal. Neither found math improving
without outside feedback. Read them as two halves of one rule: refining
helps style and completeness; it doesn't find hidden reasoning errors.

**Newer models may check themselves better, but we found no published
numbers.** As of 2026-09, Anthropic's prompting guide recommends asking
the model to verify its answer against test criteria before finishing,
especially for coding and math. It also notes that Claude Opus 5 verifies
its own work well unprompted, so extra verification instructions waste
tokens and time on it. That's vendor guidance with no published
measurements, and it's about checking inside one call. Treat it as a reason to measure, not a result.

**The cookbook loop never stops by itself.** The cookbook's loop is
`while True`, and only `PASS` ends it. `FAIL` doesn't. With a strict
evaluator ("pass only if there's nothing left to improve"), that can run
for a long time. Self-Refine capped its loop at four rounds, and most of
its gains came in the first one or two.

**The evaluator is a judge, and judges make mistakes.** An evaluator that
wrongly fails good drafts wastes calls. One that wrongly passes bad drafts
is worse, because now the output looks checked. It needs its own eval set
([[llm-as-judge]]).

**It costs a lot of calls.** Every round is at least two calls, each
carrying the growing history. AlphaCodium used 15 to 20 calls per
solution. Compare against a baseline with the same budget, like voting,
before you credit the loop.

## What this means when you build

- Write the criteria down as checks. If you can't, this pattern won't
  help.
- Give the evaluator the evidence: the retrieved sources, test results,
  or rule checks in code. Don't ask it to re-judge reasoning it can't see
  past.
- Cap the rounds (two or three is a good start) and decide what happens
  at the cap: return the best draft, or drop the claims that failed.
- Ask for specific feedback tied to the criteria, not a general grade.
- Put the full task in the first prompt, so the loop has to earn its gain.
- Measure the evaluator on its own: how often it flags real problems and
  how often it flags fine ones.
- Record the added latency and tokens per round, and compare with a
  same-cost baseline.

## Further reading

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents),
  Erik Schluntz and Barry Zhang (Anthropic), 2024. The pattern and its two
  signs of good fit.
- [Evaluator-Optimizer Workflow](https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/evaluator_optimizer.ipynb),
  Anthropic cookbook, 2025. A short working loop with a PASS / NEEDS_IMPROVEMENT
  / FAIL evaluator, and no iteration cap.
- [Self-Refine: Iterative Refinement with Self-Feedback](https://arxiv.org/abs/2303.17651),
  Aman Madaan et al., 2023. The case for the pattern, with per-round
  scores, feedback ablations and an honest note on math.
- [Large Language Models Cannot Self-Correct Reasoning Yet](https://arxiv.org/abs/2310.01798),
  Jie Huang et al., 2023 (ICLR 2024). The case against self-correction
  without outside feedback, and why earlier gains were inflated.
- [Code Generation with AlphaCodium](https://arxiv.org/abs/2401.08500),
  Tal Ridnik, Dedy Kredo and Itamar Friedman, 2024. A loop whose evaluator
  runs real tests.
- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices),
  Anthropic docs, current as of 2026-09. Draft, review, refine as the most
  common chain, and the current advice on self-checks.
