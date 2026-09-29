---
id: retries
title: How should you retry LLM calls?
depth: short
phase: 6
note: >-
  Retrying failed calls with backoff, jitter and timeouts, without making an outage worse.
needs: [rate-limits]
leads_to: [provider-fallback]
compare_with: []
updated: 2026-09-29
---

# How should you retry LLM calls?

LLM APIs fail often enough that you have to plan for it: a 429 when you hit
a [[rate-limits|rate limit]], a 503 when the model is overloaded, a
dropped connection. Many of these clear up if you try again a moment
later. Retrying well means waiting longer each time, adding randomness,
capping the attempts, and retrying in only one place. Retrying badly turns
a small blip into an outage and a bigger bill.

## Retry the failures that can pass

A retry helps only when the same request could succeed later. Sort errors
into two groups:

- **Worth retrying.** A 429 from a temporary rate limit, especially one
  with a `Retry-After` header. A 503 overload. Other server errors,
  timeouts and dropped connections.
- **Not worth retrying.** Errors in your request (bad input, a prompt too
  long), authentication errors, and anything about quota or billing. The
  same request fails again. A 429 from a spent monthly budget belongs
  here too: it looks like a rate limit, but only a person can fix it.
  Check the error code in the body, not just the status.

## Wait longer each time, and add randomness

Retrying at once, in a tight loop, is the worst option. It adds load to
an overloaded server, and on OpenAI failed requests still count toward
your per-minute limit.

**Exponential backoff** waits a short time after the first failure and
multiplies the wait after each one, so it grows fast. Cap the wait at some
maximum so it doesn't grow forever.

**Jitter** adds randomness to each wait. Without it, every client that
failed at the same moment backs off by the same amount and comes back at
the same moment, overloading the server again. Randomized waits spread the
retries out.

**`Retry-After` wins.** If the response says how long to wait, wait at
least that long (plus a little random delay) before retrying. Retrying
sooner just fails.

A concrete setting, from OpenAI's own example using the Python Tenacity
library: random exponential waits between 1 and 60 seconds, stopping after
6 attempts. Also cap the total time spent retrying, not just the count. A
timeout on each attempt isn't a deadline for the whole operation.

## Cap retries with a budget

Retries are selfish. Each one asks an already-struggling server to spend
more on your request. Google's SRE team puts two limits on them:

- **Per request:** at most 3 attempts. If a request failed three times,
  the whole service is probably overloaded, and a fourth try won't help.
- **Per client:** retry only while retries are under 10% of the client's
  requests.

When a service rejects most requests, the 3-attempt cap alone lets
traffic grow to almost 3 times normal. The 10% budget keeps it to about
1.1 times.

## Retry in one place only

Retries multiply across layers. Amazon's example: a request passes through
five layers of services down to a database, and each layer tries 3 times.
When the database starts failing, it gets 3 × 3 × 3 × 3 × 3 = 243 times the
load, and it may never recover. The advice from both Amazon and Google is
the same: retry at a single layer.

An LLM app stacks retries easily without meaning to. Official SDKs, like
OpenAI's, retry 429s and 503s on their own. Then you wrap the call in your own retry
loop. Then a gateway tries other models as a
[[provider-fallback|fallback]]. Say your loop makes 3 attempts, the SDK
makes 3 for each of those, and the gateway tries 3 models for each SDK
call: one user question can become 27 calls during an outage.

![How retries stack in an LLM app. One user question goes through your own retry loop of 3 attempts; each attempt goes through the SDK, which retries 3 times; each SDK call reaches a gateway that tries 3 models: 3 × 3 × 3 = 27 calls to model providers for one question. Below, Amazon's example: five layers of services, each retrying 3 times, send 243 times the load to the database at the bottom. The fix in both cases is to retry at one layer and turn the others off.](img/retries-stacking.svg)

Pick one layer to own retries. If you write your own loop, turn the SDK's
retries off or count them.

## Where it gets tricky

**Streams can fail halfway.** A streaming response can start with a 200
and then fail partway through, as an error event in the stream. By then
the user may have seen half an answer. Don't automatically replay a
request after you've consumed output. Decide what the user sees: an error,
or a clear restart. Provider docs say little more than that.

**Some calls have side effects.** If the model's reply triggers a tool
call that sends an email or charges a card, a timeout doesn't tell you
whether it happened. Retrying can do it twice. Only retry operations that
are safe to repeat, or make them safe with an idempotency key your code
checks.

**Retrying into an outage makes it worse.** When the provider is down for
everyone, retries add load and delay recovery. Past your budget, fail fast
or switch to a fallback.

**Timeouts are hard to pick for LLMs.** Amazon sets a timeout from the
downstream service's high-percentile latency, like p99.9. LLM calls run
from under a second to minutes depending on output length, so one fixed
timeout either cuts off long answers or waits too long on a stuck one.

## What this means when you build

- Retry only transient errors: temporary 429s, overloads, 5xx, timeouts,
  dropped connections. Never quota, billing or bad-request errors.
- Use exponential backoff with jitter, honor `Retry-After`, and cap both
  attempts and total time.
- Retry in one layer. Turn off or account for SDK retries if you add your
  own loop, and count gateway fallbacks too.
- Keep a per-client retry budget so an outage can't triple your traffic.
- Don't replay a stream the user has already seen, and don't retry side
  effects that aren't idempotent.
- Log every retry with its reason.

## Further reading

- [Timeouts, retries, and backoff with jitter](https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf),
  Marc Brooker (Amazon Builders' Library), 2019. Why retries are selfish,
  the 243x example, jitter, and idempotency.
- [Handling Overload](https://sre.google/sre-book/handling-overload/),
  Alejandro Forero Cuervo (Google SRE book), 2016. Retry budgets per
  request and per client, and retrying at one layer.
- [Rate limits](https://developers.openai.com/api/docs/guides/rate-limits),
  OpenAI docs. LLM-specific retry advice: `Retry-After`, SDK retries,
  nested loops, and not replaying streams.
