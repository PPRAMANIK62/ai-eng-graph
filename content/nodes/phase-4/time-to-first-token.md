---
id: time-to-first-token
title: What is time to first token?
depth: short
phase: 4
note: >-
  How long before the first token shows up. The delay users feel most.
needs: [llm-latency]
leads_to: [voice-agents]
compare_with: []
updated: 2026-09-29
---

# What is time to first token?

Time to first token (TTFT) is how long it takes from sending a request to
getting the first token of the answer back. When you stream, it's the
moment the user stops staring at an empty box, which makes it the part of
[[llm-latency]] that people notice most.

## What's inside the number

Say a user asks your app a question and you forward it to a hosted model.
Before the first token reaches you, three things happen:

- **The network.** The request travels to the provider, and the first
  token travels back.
- **The queue.** If the provider is busy, the request waits for its turn.
- **Prefill.** The model reads the whole prompt and builds its
  [[kv-cache]] before it can write anything. The first output token comes
  out at the end of this step (see [[prefill-decode]]).

Benchmark tools also count the small steps around the model: turning your
text into tokens, and turning that first token back into text.

From your side you only see the total. You can't tell whether a slow TTFT
was a long queue or a long prompt without measuring under different
conditions.

## Why it's the delay people feel

Usability research from 1993 (updated in 2014) gives three rough limits for how long a person will
wait:

- Under **0.1 second**, the system feels instant.
- Under **1 second**, the user notices the delay but keeps their train of
  thought.
- Under **10 seconds**, the user stays focused on the task. Longer than
  that, they start doing something else, so you need to show progress.

![A time axis on a log scale from 0.05 to 30 seconds with three limits marked. Under 0.1 second, the system feels instant. Under 1 second, the user's flow of thought stays unbroken, though the delay is noticed. Under 10 seconds, the user's attention stays on the task. Past 10 seconds, people turn to other tasks, so show progress. With streaming, the user's wait ends at the first token, so time to first token is the number to hold against these limits.](img/time-to-first-token-limits.svg)

A long answer can easily take longer than 10 seconds to finish. Without
[[streaming]], the user waits for all of it. With streaming, the wait ends
at the first token, and after that they're reading, not waiting. So TTFT is
the number to hold against these limits. How to show the stream well is
[[streaming-ui]].

## What makes it longer

**A longer prompt.** Prefill has to read every input token before any
output comes out. A big system prompt, a pile of retrieved documents or a
long chat history all push TTFT up.

**A busier server.** Many requests share the same hardware, so a request
can wait in a queue before its prefill starts. And while it's being
prefilled, other users' requests are being decoded on the same hardware.
The same prompt can have a different TTFT at different times of day.

**Distance.** A server far from the provider's region pays more network
time on every call.

Output length doesn't matter here. A 10-token answer and a 1,000-token
answer have the same TTFT; the difference shows up after the first token.

## Where it gets tricky

**Prompt length matters for TTFT, even if not for total time.** Advice
that "the prompt barely affects latency" is about total response time,
where the answer's length dominates. For TTFT, the prompt is most of the
work. Both are true; they describe different numbers.

**The first event isn't always the first token.** A stream can open with
events that carry no text (see [[streaming]]). Benchmark tools skip
empty first responses, and so should you: start the clock on the first
chunk that has actual text.

**Reasoning models blur it.** A [[reasoning-models|reasoning model]] may
think for a long time before the first answer token, so a fast first event
can still mean a long wait for the user. [[llm-latency]] covers the "time to
first answer token" number used for them.

## What this means when you build

- Stream anything a person waits on, and measure TTFT from your own server.
- Keep what goes in front of the question lean when TTFT matters: a
  shorter system prompt, fewer retrieved chunks.
- Look at TTFT at busy hours, and at p95, not only the median (see
  [[tail-latency]]).
- If TTFT still runs past a second, show something right away (a "thinking"
  state) so the user knows the request landed.

## Further reading

- [Metrics — NVIDIA NIM LLMs Benchmarking](https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html),
  NVIDIA docs, updated 2026. What TTFT includes (queue, prefill, network,
  tokenization), and why longer prompts raise it.
- [Response Times: The 3 Important Limits](https://www.nngroup.com/articles/response-times-3-important-limits/),
  Jakob Nielsen (NN/g), 1993, updated 2014. The 0.1, 1 and 10 second limits
  behind why the first token matters.
