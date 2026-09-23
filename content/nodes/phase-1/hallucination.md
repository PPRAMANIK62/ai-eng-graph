---
id: hallucination
title: Why do LLMs make things up?
depth: deep
phase: 1
note: >-
  The model says something false in a confident voice. Why a next-token predictor does this.
needs: [next-token-prediction, pretraining, post-training]
leads_to: []
compare_with: [grounding]
status: review
updated: 2026-09-23
---

# Why do LLMs make things up?

A hallucination is when a model states something false, fluently and with
full confidence: a date that's wrong, a paper that doesn't exist, a field
value that isn't in the document. It isn't a rare glitch you can patch out.
It follows from how models are trained and how they're graded, and knowing
why tells you which fixes work.

## Start with one question

In May 2025, researchers asked a leading open model, DeepSeek-V3, for one
of the authors' birthdays, with the instruction "If you know, just respond
with DD-MM." Over three tries it gave three different dates: 03-07, 15-06
and 01-01. All wrong. It never said it didn't know, even though it had been
told it could.

They also asked three popular models for the title of that author's PhD
dissertation. ChatGPT (GPT-4o), DeepSeek and Llama each gave a different
title, a different university or year, and a confident tone. None was
right.

Notice what these answers have in common. They're plausible. A birthday
that looks like a birthday, a title that sounds like a thesis. They're
specific. And they change from run to run, which is a clue: when the model
really knows something, it tends to say the same thing each time.

## Two kinds of made-up

It helps to split hallucinations by what they contradict:

- **Against the context.** You gave the model a document, and its answer
  doesn't match the document. Or it gets something wrong that's right there
  in your prompt: asked how many Ds are in DEEPSEEK, DeepSeek-V3 answered 2
  or 3 across ten tries, and other chat models went as high as 6 or 7.
- **Against the world.** The answer doesn't match reality or what the model
  should have learned in training. The birthday and the thesis title are
  this kind.

The word "hallucination" also gets used loosely for any mistake. The
useful, narrower meaning is output that's made up and not supported by
either the context or real knowledge. Avoiding it takes two things: being
right when you answer, and saying so when you don't know.

## Reason 1: the loop always produces a next token

An LLM works by [[next-token-prediction]]: at every step it gives a
probability to every possible next token and picks one. There's no "blank"
option in that loop. Something always comes out. At a basic level, then,
training pushes toward guessing, because the model is always supposed to
produce a guess for the next word.

That explains why an answer always appears. It doesn't explain why a
well-trained model guesses instead of saying "I don't know", which is also
just a sequence of tokens. For that you need the next two reasons.

## Reason 2: some facts have no pattern to learn

Think of the facts in the training data as two kinds. Some follow a
pattern, like spelling. A model gets these right because there's a rule to
learn, and it learns it.

Others are arbitrary. There's no rule that gives you a person's birthday.
You either saw it enough times or you didn't. A 2025 paper from OpenAI and
Georgia Tech works out what that means: even if the training text had no
errors at all, a model trained to match the patterns of text will make
errors on these arbitrary facts. They give a rule of thumb. If 20% of
birthday facts show up exactly once in the training data, expect the base
model to get at least 20% of birthday questions wrong. Facts seen once are
the ones it can't pin down.

Real training data makes it worse. Text crawled from the internet has
outdated, missing and simply wrong information in it, and the model learns
that too. Error rates are higher for rarer people and things, which fits
the "seen only once" picture.

The paper makes a point worth remembering: none of this depends on the
model predicting one word at a time, or on the transformer design. It
comes from fitting any model to the distribution of text. The next-token
loop is how the error comes out, not the root cause.

## Reason 3: tests reward guessing

After [[pretraining]], models go through [[post-training]], and a lot of
effort there goes into reducing hallucinations. So why do they survive?

The same paper's answer is the exam. Picture a multiple-choice test that
gives 1 point for a right answer and 0 for a wrong answer or a blank. If
you're unsure, you should always guess. A blank can never score, and a
guess sometimes does. Students learn this, and they learn to bluff on
written exams too, with confident specific answers like "September 30"
rather than "sometime in autumn".

Models are graded the same way. Of ten popular benchmarks the authors
checked (including GPQA, MMLU-Pro, SWE-bench and HLE),
nine score strictly right or wrong and give nothing for "I don't know".
Under that scoring, holding back is never the best move.

| For one uncertain question | Right | Wrong | "I don't know" |
|---|---|---|---|
| Binary grading (most benchmarks) | 1 | 0 | 0 |
| With a penalty for wrong answers | 1 | −9 | 0 |

With binary grading, a model that always guesses beats an otherwise
identical model that honestly says when it's unsure, even if the honest one
never hallucinates. Training aims at the scores, so it learns to guess. The
paper's proposed fix is to change the scoring of the mainstream benchmarks,
not to add a few more hallucination tests. For example, tell the model
"answer only if you're more than 90% confident; a wrong answer costs 9
points, 'I don't know' costs nothing". Then guessing only pays when the
model really is that confident.

![Two scoreboards for the same ten questions, where the model truly knows 3 answers. The guesser answers all ten and gets 4 right and 6 wrong. The honest model answers 3 and says I don't know to 7. With binary grading the guesser scores 4 and the honest model 3, so guessing wins. With a penalty of 9 points per wrong answer the guesser scores 4 minus 54, which is minus 50, and the honest model still scores 3.](img/hallucination-scoreboards.svg)

## What it looks like inside the model

Anthropic's interpretability team looked at how this plays out inside a
real model (Claude 3.5 Haiku, 2025), and what they found was the reverse of
what you might expect.

Declining to answer is the default. There's a circuit that's on by default
and makes the model say it doesn't have enough information. When you ask
about something it knows well, like the basketball player Michael Jordan, a
"known entity" feature switches on and turns that default off, so it
answers. Ask about an unknown name like Michael Batkin, and nothing turns the
default off, so it declines.

Hallucinations happen when that switch misfires. If the model recognizes a
name but doesn't actually know anything about the person, the "known"
feature can fire anyway and turn off the "don't know" circuit. Once the
model has decided to answer, it produces something plausible and untrue.
The researchers could cause this on purpose: forcing the "known answer"
features on made the model claim, quite consistently, that Michael Batkin
plays chess.

![Three rows showing a switch inside Claude 3.5 Haiku. By default a “can't answer” circuit is on. For Michael Jordan, a known-entity feature turns on and switches it off, so the model answers basketball. For Michael Batkin, nothing is recognized, the default stays on, and the model declines. In the red row, a name the model recognizes but knows nothing about makes the known-entity feature fire by mistake, the “can't answer” circuit is switched off, and the model makes up a confident, false answer.](img/hallucination-known-entity-switch.svg)

## Where it gets tricky

**Three explanations, one story.** The data view (wrong and rare facts in
training), the statistical view (arbitrary facts plus grading that rewards
guesses) and the circuit view (a "known" switch that misfires) describe the
same thing at different levels. They point to different fixes: better data,
different grading during training, or grounding at run time.

**You can't fix it by making the model refuse more.** A model that always
says "I don't know" never hallucinates, and is useless. The goal is a model
that answers when it's confident and holds back when it isn't. That's
harder to train and harder to measure.

**Fine-tuning in new facts can make it worse.** One 2024 study (Gekhman et
al.) found that a model learns new facts from [[fine-tuning]] more
slowly than facts it already knew, and once it does learn them, it
hallucinates more. Fine-tuning is a risky way to teach a model knowledge.

**It doesn't go away in production.** Practitioners writing in 2024 put the
baseline rate of factual inconsistencies at 5 to 10%, and said getting it
under 2% is hard even for simple tasks like summarization. Those are field
estimates, not a benchmark, but they set expectations. Models also produce
output when they shouldn't: asked to extract a field that isn't in a
document, they may confidently return a value anyway. A strict JSON schema
won't stop that, because it only controls the shape (see
[[structured-output]]).

**Grounding helps but doesn't finish the job.** Giving the model the
relevant text and telling it to answer only from that text cuts
hallucinations a lot. That's [[grounding]], the main defence covered in
phase 2. It still can't guarantee every claim is supported, so you check.

## What this means when you build

- **Let the model say "I don't know".** Say so explicitly in the prompt,
  and give it a concrete phrase to use. For extraction, allow empty or
  `null` fields.
- **Ground answers in text you provide.** For long documents (over about
  20k tokens), have the model pull out word-for-word quotes first, then
  answer from the quotes. Tell it to use only the provided documents.
- **Make claims checkable.** Ask for a supporting quote for each claim, and
  have the model drop any claim it can't support.
- **Use disagreement as a signal.** Run the same prompt a few times and
  compare. Answers that change between runs are likely made up; this idea
  also powers detection methods like SelfCheckGPT.
- **Score abstaining fairly in your own evals.** If your eval gives zero
  for "I don't know" and zero for a wrong answer, you're rewarding the
  guessing you're trying to remove.
- **Don't fine-tune to add facts.** Put facts in the context instead.
- **Keep a human or a check on anything high-stakes.** These techniques
  reduce hallucinations; none of them eliminate them.

## Further reading

- [Why Language Models Hallucinate](https://arxiv.org/abs/2509.04664),
  Kalai, Nachum, Vempala and Zhang (OpenAI, Georgia Tech), 2025. The
  statistical "why": arbitrary facts in pretraining, and benchmarks that
  reward guessing.
- [Tracing the thoughts of a large language model](https://www.anthropic.com/research/tracing-thoughts-language-model),
  Anthropic, 2025. The default "can't answer" circuit and how a misfiring
  "known entity" feature produces a hallucination.
- [Extrinsic Hallucinations in LLMs](https://lilianweng.github.io/posts/2024-07-07-hallucination/),
  Lilian Weng, 2024. A thorough survey: definitions, causes in data and
  fine-tuning, and methods to detect and reduce hallucinations.
- [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations),
  Anthropic, undated (checked 2026-09-23). Short, practical prompt
  techniques, with examples.
- [What We've Learned From A Year of Building with LLMs](https://applied-llms.org/),
  Yan et al., 2024. Hallucination rates seen in production and why models
  answer when they shouldn't.
