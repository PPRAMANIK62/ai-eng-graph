---
id: llm-as-judge
title: What is LLM-as-judge?
depth: deep
phase: 4
note: >-
  A model grading another model's output, checked against human labels before you trust it.
needs: [evals, error-analysis]
leads_to: [judge-bias]
compare_with: [code-based-evals, human-review, evaluator-optimizer]
updated: 2026-09-29
---

# What is LLM-as-judge?

LLM-as-judge means using a language model as the grader in an
[[evals|eval]]: you show it an output and a rubric, and it returns a
verdict. It fills the gap between [[code-based-evals|code checks]], which
can't judge meaning, and [[human-review|human review]], which can't keep up
with every change. A judge is a classifier you built with a prompt, so
before you trust its numbers you measure it against labels from a person.

## A judge is a prompt that returns a verdict

Take a support assistant for an online shop. Reading its conversations,
you notice one failure over and over: a user asks about their bill, and the
assistant asks for their account number and full name without first
verifying who they are. No regex can catch that reliably. The wording
varies, and whether it's a failure depends on what happened earlier in the
conversation.

So you write a second prompt, for a second model call:

```text
You are reviewing a support conversation for one failure:
asking for sensitive account details before the user's identity
is verified through the secure login flow.

<examples>
  ...three or four past conversations, each with an expert's
  critique and a verdict of pass or fail...
</examples>

<conversation>{conversation}</conversation>

First write a short critique explaining your reasoning.
Then give a verdict: pass or fail.
```

Run it over your test set and you get a pass rate for that one failure,
without a person reading every conversation. That's the whole idea. The
rest of this article is about the parts that make the number worth
believing.

A few things about that prompt are deliberate:

- **One failure per judge.** A judge that checks one specific thing is
  easier to write, to test and to fix than one that scores "overall
  quality". If you find five failure types, build five small judges, and
  only for the ones code can't check.
- **Examples with critiques.** The examples are real outputs graded by the
  person who knows the domain best, each with a written reason. They teach
  the judge where the line is, the way [[few-shot-prompting]] teaches any
  task.
- **Reasoning before the verdict.** Asking for the critique first, then the
  verdict, is [[chain-of-thought]] applied to grading. A verdict written
  first can't be informed by reasoning that comes after it.
- **Pass or fail.** Not a score from 1 to 5. More on that under "Where it
  gets tricky".

## Three ways to ask

The support example grades one output on its own. There are two other
shapes, and the choice matters.

![Three ways to ask a judge. Single output: the judge sees one answer and a rubric, and returns pass or fail (or a score). Pairwise: the judge sees two answers to the same input and picks the better one or calls a tie; run it twice with the order swapped. Reference-guided: the judge sees one answer next to a known-good reference answer and checks it against that. Below, when each fits: single output for objective checks like faithfulness or a policy rule, pairwise for subjective qualities like tone when comparing two versions, reference-guided when a correct answer exists, such as math.](img/llm-as-judge-three-ways.svg)

**Single output.** The judge sees one answer and says whether it passes.
This works for anything you'd phrase as a rule: is this answer faithful to
the source, did it ask for data it shouldn't, did it refuse when it should
have. It works on live traffic too, since there's nothing to compare with.

**Pairwise.** The judge sees two answers to the same input, say from your
old prompt and your new one, and picks the better one or calls a tie. This
is how you compare versions on qualities with no fixed bar, like tone or
persuasiveness. It's how the idea took off: the 2023 paper that named
LLM-as-a-judge used it to rank chat models. It has two costs. With many
versions, the number of pairs grows fast. And it only says which is better,
not whether either one is good. The better of two answers can still be a
failure.

**Reference-guided.** The judge gets a known-good answer next to the one it
grades. This helps a lot where the judge might get the answer wrong itself.
In that same 2023 paper, GPT-4 judging answers to 10 math questions (20
judgments) was wrong 14 times with the default prompt, 6 times when told to
solve the problem first, and 3 times when given a reference answer. It had
been misled by the wrong answers it was grading, on problems it could solve
on its own.

A rule of thumb that falls out of the research: if the quality is
objective, like faithfulness, a policy violation or instruction following,
grade single outputs. If it's subjective, like tone or style, compare
pairs.

## Check the judge like any classifier

A judge makes the same two kinds of mistakes as any classifier. It can miss
real failures, and it can raise false alarms on good outputs. The only way
to know how often is to compare it with labels from a person, on outputs
the person graded without seeing the judge's verdict.

The current practitioner method goes like this:

1. **Get labels from one domain expert.** Pass or fail, with a critique,
   on real or realistic outputs. Aim for about 100 labeled examples per
   failure the judge will check, with enough of both passes and fails.
   Below about 60, the numbers are too uncertain to conclude much.
2. **Split them three ways.** A small training set (10 to 20% of labels)
   supplies the examples in the judge's prompt. A dev set (40 to 45%) is
   what you test against while you revise the prompt. A test set (40 to
   45%) stays untouched until the prompt is final. Never put dev or test
   examples in the prompt.
3. **Revise on dev until it agrees.** Read each disagreement, fix the
   prompt, run again.
4. **Measure once on test.** Many rounds of fixing against the dev set can
   tune the judge to those examples, even if none of them is ever in the
   prompt. The test set tells you how it does on outputs that didn't shape
   it.

And measure two numbers, not one:

- **True positive rate**: of the real failures, how many the judge
  catches. If the expert found 10 failures and the judge caught 8, that's
  80%.
- **True negative rate**: of the good outputs, how many the judge passes.
  If the expert passed 100 and the judge passed 95, that's 95%, and the
  other 5 are false alarms.

![Why a judge needs two numbers, not one. Left, a judge checked against 110 expert labels: of 10 real failures it catches 8 (true positive rate 80%), and of 100 good outputs it passes 95 (true negative rate 95%). Right, a judge that always says pass, on a set where 5% of outputs fail: its agreement with the expert is 95%, yet it catches none of the failures (true positive rate 0%). Raw agreement looks high whenever failures are rare.](img/llm-as-judge-tpr-tnr.svg)

A single agreement percentage hides the trap. If 5% of outputs fail and
the judge always says pass, it agrees with the expert 95% of the time and
catches nothing. Which of the two rates matters more is a product call. A
missed failure in a medical answer costs more than a false alarm. But if
failures are rare, even a small false-alarm rate can bury a reviewer in
flags.

How long does this take? For Honeycomb's query assistant, three rounds of
revision got a judge above 90% agreement with the domain expert, on a set
that was about half failures. Another team, over three rounds of reviewing
the judge's critiques with stakeholders, went from 68% to 94%.

## Building it changes the expert, too

Criteria drift shows up here. Nobody can fully write down what "good" means
before they start grading outputs, because grading is how they find out.
Writing critiques forces the expert to say what they expect, and reading
the judge's critiques shows them where they've been inconsistent.

That has a practical consequence. Treat the first rubric as a draft. Expect
the expert's labels, and so the judge, to change over the first few rounds.
Rerun the comparison whenever something material changes, such as a new
model behind your feature or behind the judge.

One practitioner who has helped over 30 companies build judges goes
further: the process is worth more than the judge. It makes someone look
closely at a hundred outputs, which is where you find bugs to fix before
any judge is needed (see [[error-analysis]]).

## How far do judges agree with people?

It depends on the task, and the headline numbers need care.

The founding 2023 paper found that GPT-4, comparing pairs of chat answers,
agreed with human experts 85% of the time on cases where neither side
called a tie. Experts agreed with each other 81% of the time. Random
guessing would get 50%. Agreement rose from about 70% to nearly 100% as the
gap between the two models grew. In other words, judges are most reliable
when the difference is obvious and least reliable on close calls, which are
often the ones you care about.

Broader studies are less rosy. A 2024 study built 20 datasets with human
labels and tested 11 models as judges. Some tasks, like instruction
following, worked well. Toxicity and safety worked worst, with agreement
sometimes below chance. Asking the judge to reason first didn't reliably
help. In one summarization study, a GPT-3.5 judge correlated with human
ratings at 0.3 to 0.6, while each expert correlated with the experts'
average at 0.8 to 0.9. In another, a judge checking summaries for factual errors passed over
95% of the good ones but caught only 30 to 60% of the bad ones.

So a published number for "LLM judges" doesn't carry over to your task.
Your own true positive and true negative rates on your own labels do.

## Where it gets tricky

**Pass/fail or a score?** One camp says binary only. A 1 to 5 scale looks
more precise, but nobody can say what separates a 3 from a 4, different
graders read the scale differently, and a dashboard of averages tells you
nothing to fix. The other camp uses scores: the 2023 paper's judges rated
single answers from 1 to 10. If you do use a scale, put a pass/fail
threshold on top so you can act on it (see [[evals]]).

**Pairwise or single?** Some guides recommend pairwise comparison as more
stable, and for comparing two versions on style it probably is. Others
grade every output alone, pass or fail. Studies surveyed in 2024 found
pairwise closer to human judgment on subjective qualities, but no better on
factual consistency, which is objective. None of the sources here tests
the two head to head on a product eval. Pick by what you're asking: "is this good
enough?" is single-output, "which version is better?" is pairwise.

**The judge has biases of its own.** It can prefer whichever answer comes
first, longer answers, or answers that sound like its own. These are big
enough to flip results and have their own article: [[judge-bias]].

**Which humans?** In the 2024 study, judges agreed more with non-expert
labels than with expert ones. The authors' guess is that non-experts and
models both lean on surface features, while experts apply stricter rules.
That's one more reason to validate against an expert, and to remember that
[[human-review]] has blind spots of its own. Judges can also sway people:
in the 2023 paper, when humans who disagreed with GPT-4 were shown its
reasoning, they found it reasonable 75% of the time and changed their
answer 34% of the time. Keep your labeling blind to the judge.

**A judge isn't always the right tool.** For code, running it beats asking
a model whether it looks right. For a high-volume check in production, a
small trained classifier can be more accurate, faster and cheaper than a
large model. Judges shine in development, where you grade a few hundred
outputs and can afford a slow, capable model.

**Off-the-shelf judges.** Eval libraries ship ready-made judges for
things like "helpfulness". Nothing is wrong with them in principle, but
they tend to cause more confusion than insight, because they weren't built
around the failures you found in your own outputs. If you use one, validate
it the same way.

## What this means when you build

- Read outputs first. Build a judge only for failures that code can't
  check.
- One judge per failure, pass or fail, critique before verdict, with
  expert-graded examples in the prompt.
- Label about 100 examples per failure, split train/dev/test, and never
  leak dev or test into the prompt.
- Report true positive and true negative rates, not raw agreement.
- Use the most capable model your cost and latency budget allows for the
  judge. It runs offline, over hundreds of outputs, not in the user's
  path.
- Rerun the validation when you change the model behind the feature or
  the judge.
- Once a judge is validated, you can run it on sampled live traffic too:
  that's [[online-evals]].

## Further reading

- [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685),
  Lianmin Zheng et al., 2023. The paper that named the idea: three ways to
  ask, early bias measurements, and the 85% vs 81% agreement result.
- [Using LLM-as-a-Judge For Evaluation: A Complete Guide](https://hamel.dev/blog/posts/llm-judge/),
  Hamel Husain, 2024 (updated 2026). The step-by-step practitioner method:
  one expert, pass/fail with critiques, iterate the prompt until it agrees.
- [Q: How do I know if I can trust my automated eval?](https://hamel.dev/blog/posts/evals-faq/how-do-i-know-if-i-can-trust-my-automated-eval.html),
  Hamel Husain and Shreya Shankar, 2026. The train/dev/test split and the
  true positive and true negative rates, in one page.
- [Evaluating the Effectiveness of LLM-Evaluators](https://eugeneyan.com/writing/llm-evaluators/),
  Eugene Yan, 2024. A survey of about two dozen papers: direct scoring vs
  pairwise, which metric to use, and how well judges really agree.
- [LLMs instead of Human Judges?](https://arxiv.org/abs/2406.18403),
  Anna Bavaresco et al., 2024 (ACL 2025). 11 judges on 20 labeled datasets:
  reliable on some tasks, poor on others.
- [What We’ve Learned From A Year of Building with LLMs](https://applied-llms.org/),
  Eugene Yan et al., 2024. Practical judge tips (pairwise, swap order,
  allow ties), and where classifiers or running the code beat a judge.
