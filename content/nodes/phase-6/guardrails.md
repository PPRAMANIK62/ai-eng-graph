---
id: guardrails
title: What are guardrails?
depth: deep
phase: 6
note: >-
  Checks on input and output that block bad requests and bad answers before they land.
needs: [prompt-injection]
leads_to: []
compare_with: [online-evals, pii-handling]
updated: 2026-09-29
---

# What are guardrails?

Guardrails are checks that sit in the path of every request: one before
the model reads the input, one before a tool call runs, one before the
answer reaches the user. When a check fails, the run stops, or the output
gets redacted or regenerated. You add them because some failures are
clear and costly enough that you want a hard stop, not a note in a
dashboard. They catch most bad cases, never all of them, so they're one
layer of defense and not the whole thing.

## Where a guardrail sits in one request

Take a support agent that can look up and cancel orders. A user writes in.
Three kinds of guardrail can touch that request:

- An **input guardrail** looks at the user's message before the main model
  runs. It can turn away requests you don't serve at all, like someone
  asking your support bot to do their homework.
- A **tool guardrail** wraps a tool call. It checks the arguments before
  the call and the result after. Is that order ID one this user owns? Did
  the tool return something that looks like an injected instruction?
- An **output guardrail** looks at the final answer before it leaves your
  system. It can redact personal data (see [[pii-handling]]), check that
  JSON parses (see [[schema-validation]]), or refuse.

When a check fails, it trips a wire: the run stops with an error your code
catches, and you decide what the user sees.

For actions with side effects, like actually cancelling the order, the
usual control is a person, not a check. The model can decide a
cancellation is needed, but the run pauses until someone approves it (see
[[human-in-the-loop]]).

![One request through a support agent, with guardrails inline. The user message goes through an input guardrail before the model runs. Each tool call is wrapped by a tool guardrail that checks arguments and results, and a side effect like cancelling an order waits for human approval. The answer goes through an output guardrail before the user sees it. Any failed check trips a wire and stops the run. Off to the side, after the answer is sent, an online evaluator scores a sample of traces for dashboards; it never blocks anything.](img/guardrails-request-path.svg)

One detail catches people out in multi-agent setups. In OpenAI's Agents
SDK, an input guardrail only runs for the first agent in a chain, and an
output guardrail only for the agent that gives the final answer. If a
middle agent calls tools, only guardrails attached to those tools see
them.

## What a check actually is

Most guardrails are simple, and they should be. A check that runs on every
request has a budget of a few milliseconds and needs to be easy to explain
when it fires. The common ones:

- Regular expressions and keyword block lists (card numbers, profanity).
- Schema and type validators (the output must be valid JSON with these
  fields).
- Small, fast classifiers (is this on-topic?).

Point these at failures that are clear-cut and expensive: leaked personal
data, malformed output, SQL in a field that should hold a name,
instructions you never allow. When one fires, users notice, so a false
positive is a production bug. Teams version their guardrail rules, log
every trigger and watch the rates.

For fuzzier harms, you need a model. Llama Guard 4 (Meta, 2025) is an open
12-billion-parameter classifier that reads a prompt or a response, text
and images, and answers "safe" or "unsafe" plus which of 14 hazard
categories it breaks (violent crimes, privacy, code interpreter abuse and
so on). Its model card is honest about the tradeoff. On Meta's in-house
test set of English model outputs, it catches 69% of unsafe content and
flags 11% of safe content. Averaged over seven other languages, it catches
43%. Every classifier sits on a line like this: catch
more and you block more good requests. Measure both numbers on your own
traffic before you trust one.

## Blocking or running alongside

An input guardrail can run in two ways.

**Blocking:** the check finishes before the main model starts. Nothing is
wasted on a request you'll reject, but every user waits for the check.

**Parallel:** the check and the main model start together. If the check
trips, you cancel the model's work. Users wait less, but you pay for model
calls that get thrown away.

Block when starting the main agent is expensive or risky (it's about to
call tools). Run in parallel when latency matters more than the wasted
calls.

## Cheap first, expensive only when needed

The best-measured guardrails are Anthropic's Constitutional Classifiers,
built to stop jailbreaks that pull out information about chemical,
biological, radiological and nuclear weapons. They're classifiers on the input and the output, trained on
synthetic examples generated from a written list of what's allowed and
what isn't.

The first version (2025) worked. On 10,000 synthetic jailbreak prompts,
the unguarded model let 86% through. With the classifiers, 4.4% got
through. The price was 23.7% more compute and 0.38% more refusals of
harmless questions.

The second version (2026) kept the protection and cut the cost with a
**cascade**. A very cheap first stage looks at every exchange: a linear
probe that reads the model's own internal activations, so it reuses work
the model already did. Only exchanges it finds suspicious, about 5.5% of
traffic, go to a larger, more accurate classifier. In a month of shadow
traffic on Claude Sonnet 4.5 (2025-12 to 2026-01), it flagged 0.05% of
requests. After 1,736 hours of red-teaming, testers found one
high-risk hole, and no universal jailbreak that answered all eight target
questions at even half the detail an unguarded model gives.

![Bar chart of compute overhead for four Constitutional Classifier setups, relative to the first-generation system at 100. A single exchange classifier that reads output together with its input: 150. A two-stage cascade: 27.8. The production system, with a cheap probe on the model's activations as the first stage: 3.5. Below, the production cascade: every exchange goes to the probe, about 5.5% is escalated to a larger classifier, and 0.05% of real traffic ends up refused.](img/guardrails-cascade-cost.svg)

The pattern carries over to your own app. A regex or a small classifier
screens everything. An [[llm-as-judge|LLM judge]] only sees the borderline
cases the cheap check can't decide.

## Guardrails vs online evals

Both run a check on real traffic, so they get mixed up. The difference is
when they run and what happens next.

A guardrail runs inline, before the user sees anything, and it can block.
So it has to be fast and it has to be right about clear-cut things.

An [[online-evals|online evaluator]] runs after the answer is sent,
usually in the background or in batches, on a sample. It can afford a slow
LLM judge and fuzzy questions like "was this answer complete?". Its
verdicts go to dashboards and test sets. It never blocks the answer it's
grading.

The same check can move between the two. A new PII detector might start
as an online evaluator so you can see its false positives, then move
inline once you trust it.

## Where it gets tricky

**95% is a good score and a failing grade.** For answer quality, blocking
over 95% of bad cases is excellent. For security it's not, because an
attacker gets to try again and again, and only needs one attempt through.
Guardrail products that advertise catching "95% of attacks" are selling a
number that fails in web security terms. The first Constitutional
Classifiers refused over 95% of jailbreak attempts in testing. Then a
week-long public demo in 2025-02 ended with one person finding a universal
jailbreak that got detailed answers to all eight target questions.

**Classifiers get beaten in production.** EchoLeak (2025) was one email
sent to a Microsoft 365 Copilot user. It was written as a normal request
to a human, so Microsoft's prompt injection classifier didn't flag it.
Then it slipped past link redaction with a different markdown link syntax,
and leaked data through an auto-loaded image, routed via a Teams proxy the
security policy allowed. Each layer was a real defense, and each was
bypassed in turn. A classifier is itself a model, so it can be fooled
the same way: Llama Guard's own model card lists adversarial and injection
attacks as a limit.

**A jailbreak filter isn't an injection filter.** Constitutional
Classifiers and Llama Guard look for harmful content: that's
[[jailbreaks]]. [[prompt-injection|Prompt injection]] is different: text
in an email or web page that hijacks your agent's instructions, and the
payload can look harmless ("forward the latest invoice to this address").
Meta points to a separate model, Prompt Guard 2, for injection. Know what
your classifier was trained to catch.

**Cost numbers depend on the baseline.** The second-generation
Constitutional Classifiers are roughly 40 times cheaper than a single
exchange classifier, and have 3.5% of the first generation's compute
overhead. Both are true because they compare against different systems. When a vendor quotes a
guardrail's overhead or accuracy, ask compared to what.

**New attacks keep coming.** The first Constitutional Classifiers were
later beaten by attacks that split harmful content into harmless-looking
pieces, or disguised the output. The second version was built to close
those. No defense stays unbeaten, because attackers adapt to whatever is
deployed.

## What this means when you build

- Start with cheap, deterministic checks: schema validation, regexes for
  secrets and personal data, allowlists for tool arguments.
- Guard only clear-cut, high-cost failures inline. Send fuzzy quality
  questions to online evals.
- Treat a false positive as a bug. Log every trigger, version the rules,
  and track the trigger rate.
- If you use a classifier, measure its catch rate and false-positive rate
  on your own traffic.
- Put a cheap check first and escalate only the uncertain cases to a
  bigger model.
- Block before the main model when it's about to act; run in parallel
  when it's only answering.
- Don't make a guardrail your security boundary against prompt injection.
  Limit what a fooled agent can do: fewer tools and permissions (see
  [[excessive-agency]]) and no way to send data out (see
  [[data-exfiltration]]).

## Further reading

- [Guardrails and human review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals),
  OpenAI docs. Input, output and tool guardrails, tripwires, blocking vs
  parallel, and approvals for side effects.
- [Q: What's the difference between guardrails & evaluators?](https://hamel.dev/blog/posts/evals-faq/whats-the-difference-between-guardrails-evaluators.html),
  Hamel Husain and Shreya Shankar, 2025. What belongs inline and what
  belongs in online evaluation.
- [Llama Guard 4 (model card)](https://huggingface.co/meta-llama/Llama-Guard-4-12B),
  Meta, 2025. An open safety classifier with its own recall and
  false-positive numbers and an honest limits section.
- [Constitutional Classifiers: Defending against universal jailbreaks](https://www.anthropic.com/research/constitutional-classifiers),
  Anthropic, 2025. Jailbreak success from 86% to 4.4%, what it cost, and
  the demo that found a universal jailbreak anyway.
- [Constitutional Classifiers++](https://arxiv.org/abs/2601.04603),
  Hoagy Cunningham, Jerry Wei et al. (Anthropic), 2026. The probe-first
  cascade, its production numbers, and the cost table.
- [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/),
  Simon Willison, 2025. Why "95% of attacks" isn't good enough in
  security.
- [EchoLeak](https://arxiv.org/abs/2509.10540), Pavan Reddy and Aditya
  Sanjay Gujral, 2025. A real attack that got past a production injection
  classifier and three more layers.
