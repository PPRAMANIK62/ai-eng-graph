---
id: llm-latency
title: Where does LLM latency come from?
depth: deep
phase: 4
note: >-
  Where the time goes in a model call, and how to measure it.
needs: [prefill-decode]
leads_to: [model-selection, time-to-first-token, tail-latency, llm-tracing]
compare_with: []
updated: 2026-09-29
---

# Where does LLM latency come from?

When an LLM feature feels slow, the time is spread across several places:
the network, the provider's queue, reading the prompt, any hidden thinking,
and writing the answer. Each has its own cause and its own fix. If you know
which one dominates your calls, you know what to change, and you stop
spending effort on the parts that barely move the total.

## Follow one call from start to finish

Take one call from a support bot. Your server sends a system prompt, a few
retrieved documents and the user's question. The model sends back a
paragraph. Here's everything that happens between the request leaving
your server and the last token arriving.

1. **Network out.** The request travels to the provider. How long depends
   on where your server is and where theirs is.
2. **Queue.** A hosted model is shared. When the provider is busy, your
   request waits for a slot before any work starts.
3. **Prefill.** The model reads the whole prompt in one parallel pass. This
   ends with the first output token.
4. **Thinking.** A [[reasoning-models|reasoning model]] writes thinking
   tokens before the answer. You may never see them, but they're generated
   one at a time like any other output.
5. **Decode.** The model writes the answer one token at a time. Each token
   waits for the one before it.
6. **Network back.** The tokens travel back to you, either one by one as
   they're written, or all at once at the end.

Steps 3 and 5 are [[prefill-decode|prefill and decode]], covered in their
own article: prefill is parallel and fast per token, decode is sequential
and slow per token. This article is about the whole path around them, and
what you can do about each part.

![One model call as a row of stages, not to scale. Network out and waiting in the provider's queue, then prefill of the whole prompt, then, for reasoning models only, thinking tokens, then the answer tokens one at a time, then the last bytes back. Brackets above: time to first token covers network, queue and prefill. For a reasoning model, time to first answer token runs on through the thinking. End-to-end time covers everything. Under each stage, what makes it longer: distance and region, how busy the server is, prompt length, how much the model thinks, and answer length.](img/llm-latency-request-path.svg)

## The numbers that describe the time

Nobody measures each stage separately from the outside. You get a handful
of numbers that cover several stages each.

**[[time-to-first-token|Time to first token]] (TTFT)** runs from sending
the request to receiving the first token. It covers the network, the queue
and prefill. Benchmark tools also count turning the text into tokens and the
first token back into text.

**Inter-token latency (ITL)**, also called time per output token (TPOT), is
the average gap between tokens after the first one:

$$
\text{ITL} = \frac{\text{end-to-end time} - \text{TTFT}}{\text{output tokens} - 1}
$$

The first token is left out on purpose, since it carries all of prefill.

**End-to-end time** runs from sending the request to receiving the last
token. It's roughly TTFT plus ITL times the number of output tokens, the
formula from [[prefill-decode]].

**Output speed** is ITL turned around: tokens per second for one request,
counted after the first token. A TPOT of 100 ms is 10 tokens per second.

**Throughput** is different. It counts output tokens per second, or finished
requests per second, across *all* users of a server at once. It's what the
provider optimizes. Output speed is what your user sees.

That last distinction trips people up. "Tokens per second" can mean either,
and the two pull against each other, as the section on load explains.

## The answer's length decides most of the time

For a typical call, decode dominates. The rules of thumb are lopsided:
cutting the output in half can cut about half the response time, while
cutting the prompt in half saves only 1 to 5%. In one set of measurements
from 2023, adding 512 tokens to the prompt added less time than generating
8 more output tokens.

![Two bars comparing rules of thumb for cutting latency. Cutting the output by half cuts about 50% of the response time. Cutting the prompt by half cuts only 1 to 5%, unless the context is very large.](img/llm-latency-output-vs-prompt.svg)

The exception is a very large context: long documents or images. Then
prefill grows big enough to matter, and it shows up in TTFT.

So the first question for a slow call is how many tokens it writes. A model
asked for "a short answer" that writes 600 tokens will be slow on any
provider.

## Thinking tokens are output you don't see

Reasoning models change the picture. The thinking comes before the
answer, and it's decoded like any output, so it adds to the total the same
way answer tokens do.

It also muddies TTFT. The first token back may be a thinking token, or
nothing visible at all. For that reason, public benchmarks such as Artificial Analysis report
two numbers for reasoning models: time to first token, and **time to first
answer token**, which runs until the thinking is done. End-to-end time
includes the thinking. If you compare a reasoning model with a regular one
on TTFT alone, you're comparing different things.

## A shared server trades your speed for everyone's

A provider doesn't run one request at a time. It batches many users'
requests through the GPU together, which raises total throughput but slows
each request. In one 2023 measurement, a batch of 64 gave 14 times the
throughput at 4 times the latency per request.

Load shows up in two places:

- **The queue.** When the server is busy, incoming requests wait. That
  wait lands in TTFT.
- **Sharing the GPU.** More requests in flight means each gets a smaller
  share, so TTFT, inter-token latency and end-to-end time all go up. One
  request's prefill can overlap with another's decode on the same GPU.

You can't control a hosted provider's load, but you should expect it. The
same request at a busy hour can be slower than at a quiet one, which is why
the spread of your latencies matters as much as the typical value. That's
[[tail-latency]].

## Several calls per request add up

Many features make more than one model call per user request: classify,
then retrieve, then answer. Each call pays its own round trip, queue and
prefill. Called one after another, as in [[prompt-chaining]], the times add.

Two fixes follow:

- **Make fewer calls.** If two steps can go in one prompt, merging them
  saves a whole round trip.
- **Run independent calls side by side.** If steps don't depend on each
  other, [[parallel-calls]] make the wait as long as the slowest call
  instead of the sum.

## The levers, stage by stage

Before cutting latency, get the quality right. Make a prompt that works
without speed constraints first. Otherwise you never learn what the best
result looks like, and you can't tell what a faster setup costs you.

Then work through the stages:

- **Pick a smaller model.** Model size is the main factor in how fast
  tokens come out. Smaller models are usually faster and cheaper, and with a
  good prompt they can match bigger ones on a narrow task. As of 2026-09,
  Anthropic points to Claude Haiku 4.5 as its fastest model. Choosing a
  model on quality, cost and speed together is [[model-selection]].
- **Write fewer tokens.** Ask for concise answers. Ask for a number of
  sentences or paragraphs, which models follow better than word counts.
  For structured output, drop anything the code doesn't need.
- **Cap the output with care.** `max_tokens` is a hard stop that cuts the
  answer mid-sentence. It suits short answers where the useful part comes
  first, not prose.
- **Trim the prompt only if it's huge.** Cutting a normal prompt barely
  helps. With very long contexts it does, and so does reusing a long shared
  prefix with [[prompt-caching]].
- **Use fewer, parallel calls**, as above.
- **Stream.** [[streaming|Streaming]] doesn't make the answer finish
  sooner, but the wait before something appears drops to about a second or
  less. There's a large difference between waiting and watching progress
  happen. How to show it is [[streaming-ui]].
- **Skip the LLM when you can.** A lookup, a regex or a plain classifier is
  faster than any model call.

## How to measure it yourself

Measure from your own server, the way your users feel it. For every call,
record the time you sent it, the time the first token with content arrived,
the time the last token arrived, and the number of output tokens. From
those four you get TTFT, ITL and end-to-end time. Recording this for every
call is part of [[llm-tracing]].

Then look at the distribution, not the average. A few very slow calls can
hide behind a fine-looking mean, so track the median and the 95th and 99th
percentiles.

Public speed charts are a starting point, not your answer. As of 2026-09,
Artificial Analysis tests each hosted API with prompts of roughly 1,000 to
100,000 tokens, the shorter ones about every three hours, from one virtual
machine in a Google Cloud zone in the central US. For most workloads it reports the median
over the last 72 hours. Your region, prompt sizes and time of day will differ.

## Where it gets tricky

**Does prompt length matter?** Sources seem to disagree. One camp says a
longer prompt hardly changes total time: halving it saves 1 to 5%. The
other says longer prompts raise TTFT, because prefill has to read every
input token before the first output token. Both are right about different
numbers. Prompt length drives TTFT. Output length drives total time. On a
normal prompt with a long answer, the prompt's share of the total is
small. With a very large context and a short answer, the prompt is where
trimming starts to pay off, and TTFT is where you'll see it.

**Medians hide the calls people complain about.** Public speed charts
report the median. Half of all calls are slower than that, and a few are
much slower. We found no trustworthy public source, as of 2026-09, that
measures p95 or p99 TTFT across LLM APIs. For the tail, you need your own
measurements.

**"Tokens per second" is two numbers.** A provider's throughput and your
request's output speed are different, and they trade against each other.
Check which one a chart or a spec sheet means.

**TTFT for reasoning models is ambiguous.** A fast first token may be the
start of a long silent think. Use time to first answer token, or
end-to-end time, when comparing.

**The mechanism numbers are old.** The 512-input-vs-8-output comparison and
the batching example come from a 2023 post on 2023 hardware. The shape
holds. The milliseconds don't.

## What this means when you build

- Log TTFT, end-to-end time and output tokens for every call from day one.
- When a call is slow, check its output length first.
- Stream anything a person waits on.
- Try a smaller model on your own evals before tuning anything else.
- Merge sequential calls where you can, and run independent ones in
  parallel.
- Judge speed by p95 and p99 on your own traffic, not by a median on a
  public chart.

## Further reading

- [LLM Inference Performance Engineering: Best Practices](https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices),
  Databricks, 2023. The latency formula, why output length dominates, and
  the batching tradeoff between throughput and each request's speed.
- [Metrics — NVIDIA NIM LLMs Benchmarking](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html),
  NVIDIA docs, updated 2026. Exact definitions of TTFT, inter-token latency,
  end-to-end time and throughput, and what each one includes.
- [Latency optimization](https://developers.openai.com/api/docs/guides/latency-optimization),
  OpenAI docs. Seven principles for cutting latency, with the output-vs-prompt
  rules of thumb.
- [Reducing latency](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency),
  Anthropic docs. The API user's view: quality first, then model choice,
  fewer tokens, `max_tokens` and streaming.
- [Understand LLM latency and throughput metrics](https://docs.anyscale.com/llm/serving/benchmarking/metrics),
  Anyscale docs. What raises TTFT, how load trades throughput for latency,
  and why to track percentiles.
- [Language Model API Performance Benchmarking Methodology](https://artificialanalysis.ai/methodology/performance-benchmarking),
  Artificial Analysis, 2026. How the best-known public speed charts are
  measured, including time to first answer token for reasoning models.
