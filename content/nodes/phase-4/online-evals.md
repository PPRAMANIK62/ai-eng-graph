---
id: online-evals
title: What are online evals?
depth: short
phase: 4
note: >-
  Scoring real traffic after shipping, next to the fixed test set you run before.
needs: [evals]
leads_to: [data-flywheel, model-upgrades]
compare_with: [guardrails]
updated: 2026-09-29
---

# What are online evals?

Online evals grade what your AI feature does with real users, after it has
shipped. You take a sample of live traces, run graders on them in the
background, and track the results over time. Your test set can only catch
the failures you already know about. Online evals are how you find the ones
you don't, and how often they happen.

## Before shipping and after

The [[evals]] you run before shipping are a fixed test set. It's small and
curated: core features, past bugs, known edge cases. It runs on every
change, so each check has to be cheap, and code checks like assertions are
preferred over model graders. Its job is to stop known problems from coming
back.

Once real users arrive, a different question matters: what's going wrong
that nobody thought to test, and how common is it? A fixed set can't answer
that, because it only contains what you put in it.

| | Test set before shipping | Online evals after |
|---|---|---|
| Inputs | A fixed, curated set | A sample of live traffic |
| When | On every change, before deploy | Continuously, in the background |
| Reference answers | Often, since you wrote the cases | Usually none |
| Typical grader | Code checks | LLM judges that need no reference |
| What it tells you | Did a known thing break? | What new failures exist, and how often? |

## How it works, on one feature

Take a support assistant that has been live for a month. Every session is
logged as a trace. Each day, a sample of those traces goes to a set of
graders that run on their own schedule, away from the user's request.

The catch is that you have no correct answer to compare against. Nobody
wrote the ideal reply to each real user. So online graders are usually
reference-free: an [[llm-as-judge|LLM judge]] asked a question like "did
the reply answer what the user asked?" or "did it promise a refund the
policy doesn't allow?". That makes them more expensive per trace than the
code checks in your test set, which is one reason you grade a sample
rather than everything.

Because the sample is only part of the traffic, each rate you get is an
estimate. Track a confidence interval around it, not just the number. When
the bound of that interval crosses the threshold you care about, look
closer. Looking closer means reading the flagged traces, which is
[[error-analysis]].

![Where online evaluators sit compared with guardrails. A user's request goes through an input guardrail, the model, and an output guardrail, then the reply reaches the user. Guardrails are inline: fast rule-based checks taking a few milliseconds that can block, redact or regenerate. Every trace is logged. A sample of the logs goes to evaluators such as LLM judges, which run afterwards in the background and never block the reply. Their scores feed a dashboard, and new failure patterns are added to the test set you run before shipping.](img/online-evals-inline-vs-after.svg)

## Online evals vs guardrails

Both look at inputs and outputs, so they're easy to confuse.
[[guardrails|Guardrails]] sit inline, in the path of the request. They
have to be fast, a few milliseconds, so they're simple rules: a regex, a
blocklist, a schema check, a small classifier. They catch clear-cut,
high-impact failures like leaked personal data or broken JSON, and when
one fires, the system refuses, redacts or regenerates the answer before
the user sees it.

Online evaluators run after the answer has already gone out. They never
block anything. That's what lets them be slow and heavy, like an LLM judge
scoring factual correctness or completeness. Their results go to
dashboards, the test set and improvement work. A slow judge can run inline
only if your latency budget allows it, for example on a small share of
borderline cases. The two work as layers: guardrails stop the obvious
failures now, and evaluators measure the subtle ones for later.

## Where it gets tricky

**Users see the failure first.** An online eval finds a problem only after
it has reached someone. It's for learning, not protection. If a failure
must never reach a user, it needs a guardrail or a test before shipping.

**The judge is a model too.** A reference-free judge on live traffic gives
you a model's opinion, not the truth. How to check one against people
before you trust its numbers is covered in [[llm-as-judge]].

**Nobody publishes the numbers.** As of 2026-09 we couldn't find a public
write-up from a company running online evals with real sample rates,
judge costs or alert thresholds. The advice is guidance from
practitioners, not case data. Your own logs will have to set these.

## What this means when you build

- Log every trace from day one. You can't grade traffic you didn't keep.
- Sample live traces and grade them in the background, with judges that
  need no reference answer.
- Report rates with a confidence interval, and set a threshold that
  triggers a closer look.
- When online grading finds a new failure pattern, add examples of it to
  your test set so it can't quietly come back. That loop is the
  [[data-flywheel]].
- Anything that must be blocked before the user sees it belongs in a
  guardrail, not an evaluator.

## Further reading

- [Q: How are evaluations used differently in CI/CD vs. monitoring production?](https://hamel.dev/blog/posts/evals-faq/how-are-evaluations-used-differently-in-cicd-vs-monitoring-production.html),
  Hamel Husain and Shreya Shankar, 2025. The split between a small test set
  in CI and sampled, reference-free grading of live traces, and how the
  two connect.
- [Q: What’s the difference between guardrails & evaluators?](https://hamel.dev/blog/posts/evals-faq/whats-the-difference-between-guardrails-evaluators.html),
  Hamel Husain and Shreya Shankar, 2025. Inline, fast guardrails vs
  evaluators that run afterwards and never block the answer.
