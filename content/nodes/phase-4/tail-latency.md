---
id: tail-latency
title: What is tail latency?
depth: short
phase: 4
note: >-
  p95 and p99: why the average hides the slow calls users complain about.
needs: [llm-latency]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# What is tail latency?

Tail latency is how slow your slowest calls are. You measure it with high
percentiles: p95 is the time 95% of calls beat, p99 the time 99% beat. The
average and the median say what a typical call feels like. The tail says
what the unlucky users feel, and they're the ones who write in.

## The average describes nobody

Picture a service where most requests take about 50 ms, but 5% of them take
20 times longer, a full second. The average works out to roughly 100 ms. No
request actually takes 100 ms. The fast ones are twice as quick as that,
and the slow ones ten times slower. The average also hides changes in
that slow 5%.

So treat latency as a distribution, and read it with percentiles:

- **p50, the median.** Half of calls are faster. The typical experience.
- **p95.** One call in 20 is slower than this.
- **p99.** One call in 100 is slower. Close to the worst case you'll
  regularly see.

People also care about the spread itself. User studies have found that
people usually prefer a slightly slower system to one whose response time
jumps around.

For a model call, the causes of a slow tail are the ones from
[[llm-latency]]: an answer that runs long, a busy provider queue, a huge
prompt, a reasoning model that thinks for a while. On top of that come the
causes any shared service has: machines shared with other work, background
jobs, and layers of queues along the way.

## Many calls turn a rare slowdown into a common one

This is where the tail stops being a detail. Say one call is slow 1 time in
100. If a user request makes that call once, 1% of users wait. If the
request waits on 100 such calls, 63% of users wait, because it only takes
one slow call to hold up the whole request. The share of requests that hit
at least one slow call is 1 − (1 − rate)^calls.

![A chart of how often a user request hits at least one slow call, against how many calls it waits on, from 1 to 2,000 on a log scale. Two curves: calls that are slow 1 time in 100, and 1 time in 10,000. With 1 in 100, one call is slow 1% of the time, 10 calls about 10%, and 100 calls 63%. With 1 in 10,000, 2,000 calls are slow almost one time in five.](img/tail-latency-fan-out.svg)

Even a slowdown that hits 1 call in 10,000 reaches almost one request in
five once each request waits on 2,000 calls. In one real Google service,
waiting for the slowest 5% of sub-requests made up half of the p99 time.

LLM apps rarely fan out to 2,000 servers, but they do stack calls. A RAG
answer might embed the query, search, rerank and then generate. An agent
might make ten model calls and a dozen tool calls to finish one task. With
ten calls, each slow 1% of the time, almost 10% of tasks hit at least one
slow step. So your app's p99 is set by the p99 of its parts, not their
medians.

## Cutting the tail by asking twice

One fix from large web services is the **hedged request**. Send the
request, and if it hasn't come back within the time 95% of requests take,
send a copy to another server and use whichever answers first. Waiting until
the p95 caps the extra load at about 5% of requests. It works because a
slow response is usually caused by something else on the machine, not by
the request itself, so a second try often lands somewhere faster. In one
Google test, hedging after 10 ms cut the 99.9th-percentile time from 1,800
ms to 74 ms while sending just 2% more requests.

For model calls, the copy isn't free: you pay for the tokens of both
requests. It's worth it where a slow answer costs more than the extra
tokens. Sending a slow call somewhere else is close to [[retries]] with a
timeout, and to [[provider-fallback]].

## Where it gets tricky

**Public speed charts show medians.** The best-known ones for LLM APIs
report the median over recent days (details in [[llm-latency]]). A model
with a great median can still have a bad p99. As of 2026-09 we found no
trustworthy public source that measures p95 or p99 TTFT across LLM APIs, so
you have to measure the tail yourself.

**You need a lot of calls to see it.** With 100 measured calls, your p99
is decided by one call. Collect hundreds or thousands before you trust a
p99, and check it at different times of day.

**The classic research isn't about LLMs.** The fan-out math and hedging
come from 2013 work on Google's web services, where one call is cheap. The
math carries over to any request that waits on several calls. The costs
don't: a duplicate model call costs real money.

## What this means when you build

- Report p50, p95 and p99 for TTFT and end-to-end time. Never the average
  alone.
- Set latency targets on p95 or p99, not the median.
- Count the calls behind each user request. Every extra call makes a slow
  one more likely.
- For latency-critical calls, try a timeout at about your p95 with a
  second attempt, and measure what it does to cost and to the tail.

## Further reading

- [The Tail at Scale](https://www.barroso.org/publications/TheTailAtScale.pdf),
  Jeffrey Dean and Luiz André Barroso (Google), 2013. Why rare slowdowns
  dominate when requests fan out, what causes them, and hedged requests.
- [Service Level Objectives](https://sre.google/sre-book/service-level-objectives/),
  Chris Jones, John Wilkes, Niall Murphy and Cody Smith (Google), 2016.
  Latency as a distribution, why averages hide the tail, and why to use
  percentiles.
