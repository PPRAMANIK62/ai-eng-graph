---
id: data-flywheel
title: What is the data flywheel?
depth: deep
phase: 4
note: >-
  Log real use, turn failures into test cases, fix, and repeat.
needs: [online-evals, error-analysis]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# What is the data flywheel?

The data flywheel is the habit of improving an AI feature from its own
traffic. You log what real users do, find where it goes wrong, turn those
failures into test cases, fix them, ship, and go round again. Each turn
leaves you with a better feature and a test set that looks more like real
use, which makes the next turn easier. Without it, you're fixing whatever
someone happened to complain about last.

## One turn, from one bad answer

Take a support assistant for a software product that has been live for a
few weeks. Here's one full turn of the loop.

1. **Log.** Every session is saved as a trace: the user's messages, what
   was retrieved, every model call and the final reply.
2. **Pick traces to read.** This week you take some at random, plus the
   ones users gave a thumbs-down.
3. **Find the pattern.** Reading them, you notice the assistant keeps
   quoting the monthly refund policy to people on annual plans. After
   grouping and counting your notes, it's one of the biggest categories.
4. **Turn it into tests.** You add a handful of annual-plan refund
   questions, with the right answer, to the test set you run before every
   release.
5. **Fix it.** You change the prompt, or what gets retrieved, until those
   new cases pass and the old ones still do.
6. **Ship and watch.** The online judge that checks refund answers keeps
   running on sampled traffic, so you'll see if the rate slips back.

Then you do it again with next week's traces. This example is ours, for
illustration, but every step is standard practice, and each has its own
article on this map.

![The data flywheel as a loop of five steps. Log every trace in production. Sample traces to read: some random, some flagged by feedback or judges. Find and count failures with error analysis and online evals. Add examples of each new failure to the test set you run before shipping. Fix the prompt, retrieval, code or model, check the test set passes, and ship, which produces new traces. In the middle: humans label a sample regularly to keep the graders honest.](img/data-flywheel-loop.svg)

## Log everything first

You can only learn from what you kept. The loop starts with a log of every
trace, and ideally the scores your graders gave it, stored where you can
search and filter it. This is also the setup you need for debugging, so
you're building one thing for both jobs. Recording traces well is its own
topic: [[llm-tracing]].

Make reading them easy, too. If looking at a trace means opening three
tools, nobody will do it often. A simple viewer that shows everything
about one session on one screen is worth building early.

## Choosing which traces to read

You can't read everything, so you sample. There are five common ways to
pick traces, and each has a blind spot:

![Five ways to choose production traces to read, from exploratory to targeted. Random: a small batch can miss rare cases. Clustering: depends on how you grouped them. Data analysis of extremes like latency or tool count: an extreme may have nothing to do with quality. Classification by an evaluator: favors problems it already knows how to find. User feedback: misses problems users don't report. Start near the exploratory end; lean on targeted signals as you learn; keep some random traces in every batch.](img/data-flywheel-sampling.svg)

Early on, lean toward exploring: random and clustered samples show you
things you didn't know to look for. As you learn what goes wrong, lean on
the targeted signals. Always keep some random traces in each batch. They give
you a chance to meet a failure none of your signals describe.

For a rare failure you already know about, search for something that
tends to come with it: a certain sequence of tool calls, unusually long
sessions, retries, a particular kind of input. Then read that batch.

User feedback deserves a word of caution. It comes with real examples,
which is valuable, but it's sparse, it skews toward severe problems, and
users rarely say why something failed. Treat it as one signal among
several.

## Find, name and count

With a batch in hand, you do [[error-analysis]]: a short note on what's
wrong in each trace, then group the notes into categories and count them.
This tells you which failure to fix first and which new graders are worth
writing.

Between these reading sessions, [[online-evals]] keep watch. The graders
you've built run on sampled live traffic in the background and track how
often each known failure happens. A rise sends you back to reading traces.

A rhythm practitioners suggest (2025):

- A big pass after any significant change: a new feature, a prompt
  update, a model switch, a major bug fix. Aim for at least 100 fresh
  traces per cycle. Cycles of 2 to 4 weeks are common.
- In between, 10 to 20 traces a week, picked from the outliers: long
  conversations, sessions with retries, traces the monitors flagged.
- Weekly while the system is new, until the failure patterns settle.
  Mature systems may need only monthly passes.
- Always after an incident, a spike in complaints, or a metric drifting.

## Close the loop: failures become test cases

This is the step that makes it a flywheel rather than a series of fixes.
When you find a new kind of failure in production, add a few examples of
it to your test set, the fixed set of [[evals]] you run before each
release. From then on, that failure can't quietly come back.

Over time, the test set fills up with cases taken from real users instead
of guesses. That's what keeps it honest: an eval set only knows what you
put in it, and this is how real usage gets in. Prioritize by how much each
failure hurts users, so the effort goes where it counts.

The two sides do different jobs. The test set guards against known
problems before you ship, cheaply, on every change. Online grading finds
new problems after you ship, and tells you how common they are. The
flywheel is the path from the second into the first.

## Fix it, in whatever way fits

The fix depends on the failure. Most are prompt changes, better
retrieval, or a code change around the model. Two fixes use the logged
data directly.

**Fixed examples as few-shot demonstrations.** Keep a store of traces with
their scores and any corrections a person made. Low-scoring outputs get
reviewed and rewritten on a daily or weekly cadence: what went wrong, what
the right output is, and why. At request time, retrieve the corrected
traces most similar to the incoming query and put them in the prompt as
examples (see [[few-shot-prompting]]). The prompt improves as corrections
pile up, without anyone editing it by hand.

**Curated data for fine-tuning.** Most of the work in
[[fine-tuning]] is assembling good examples that cover what your product
does. The flywheel produces exactly that as a side effect: labeled traces,
corrected outputs, filters that throw out bad data. One team made the
assistant's final output editable in their review tool so reviewers could
fix small mistakes and save the result as training data.

## Keep the graders honest

The loop runs on graders, and graders drift. Two things change under
them. Your idea of "good" shifts once you see real outputs, and people's
preferences about LLM outputs change over time. The traffic changes too,
and the model behind an API can change without notice.

So the graders need regular human labels. For each thing you measure,
label a fresh sample of production outputs on a schedule, store the labels
with their dates, and check your [[llm-as-judge|LLM judges]] still agree
with them. Human labels are the slowest part of the loop and the easiest
to let slip. One shortcut is to let an LLM draft the labels and have
people correct them. It saves time, but nobody knows yet how well such
labels hold up over months, especially if people stop checking.

It also helps to score several narrow things (did it answer the question,
was it the right policy, was it short enough) rather than one overall
"good". Narrow checks are easier for people to label consistently and for
a judge to match, and when outputs fail, the scores show which part is
failing.

## Where it gets tricky

**Nobody publishes before/after numbers for the whole loop.** As of
2026-09 we couldn't find a company write-up that runs the flywheel for
months and reports how quality changed. The public material is methods
and advice from practitioners and researchers. The closest thing is
reports of single fixes found through [[error-analysis]], which show one
turn of the loop, not many. Treat claims that a flywheel
"compounds" as a reasonable expectation, not a measured fact.

**Feeding production data straight into the prompt has risks.** If
corrected traces are retrieved as examples automatically, someone could
write inputs designed to end up in other users' prompts, a form of
[[prompt-injection]]. Some teams, legal ones for instance, may also want
to sign off on every prompt change, which an automatic loop skips. And
whether smarter ways of picking examples beat random picks is still
untested.

**Signals are biased toward what you already know.** Feedback only
catches what users report. Classifiers only find what they were built to
find. Without random samples and regular reading, the loop keeps fixing
the same known problems while new ones go unseen.

**Multi-step pipelines are harder.** When one LLM call feeds another, an
early mistake can spread through everything after it, and a person has to
grade many intermediate outputs. How to run the loop well over chains of
calls and agents is still an open question (see [[agent-evals]]).

**The "flywheel" name promises more than the loop guarantees.** It
suggests the thing spins on its own once started. In practice, each turn
needs someone to read traces, label data and decide what to fix. The loop
makes that work pay off. It doesn't remove it.

## What this means when you build

- Log every trace from the first user, with grader scores next to it, and
  build a viewer that makes reading one easy.
- Read traces on a schedule: a small weekly batch, a bigger pass every few
  weeks and after every big change or incident.
- Sample from several signals, and always include some random traces.
- Every new failure you find gets a few examples in the test set before
  it's fixed.
- Label a fresh sample by hand regularly and check your judges against it.
- Be careful about feeding user data back into prompts automatically.
- Record what each turn changed and what the numbers did. Almost nobody
  publishes this, so your own log is the evidence.

## Further reading

- [Data Flywheels for LLM Applications](https://www.sh-reya.com/blog/ai-engineering-flywheel/),
  Shreya Shankar, 2024. The framework: evaluate, monitor, improve, with
  keeping judges aligned, fixed traces as few-shot examples, and the open
  problems.
- [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/),
  Hamel Husain, 2024. Evaluation, debugging and changing the system as one
  cycle, and how the same setup produces fine-tuning data.
- [Q: How are evaluations used differently in CI/CD vs. monitoring production?](https://hamel.dev/blog/posts/evals-faq/how-are-evaluations-used-differently-in-cicd-vs-monitoring-production.html),
  Hamel Husain and Shreya Shankar, 2025. The test set vs production
  monitoring, and adding new production failures to the test set.
- [Q: How can I efficiently sample production traces for review?](https://hamel.dev/blog/posts/evals-faq/how-can-i-efficiently-sample-production-traces-for-review.html),
  Hamel Husain and Shreya Shankar, 2025. Five ways to pick traces to read,
  each with its blind spot.
- [Q: How often should I re-run error analysis on my production system?](https://hamel.dev/blog/posts/evals-faq/how-often-should-i-re-run-error-analysis-on-my-production-system.html),
  Hamel Husain and Shreya Shankar, 2025. The review rhythm, with numbers.
- [Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents),
  Grace, Hadfield, Olivares and De Jonghe (Anthropic), 2026. Turning
  user-reported failures into test cases, and what production monitoring
  and user feedback can and can't tell you.
