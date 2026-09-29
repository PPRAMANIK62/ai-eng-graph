---
id: llm-tracing
title: What is LLM tracing?
depth: deep
phase: 6
note: >-
  Recording every call, prompt, token count, cost and step, so you can debug and measure.
needs: [llm-latency]
leads_to: [pii-handling]
compare_with: []
updated: 2026-09-29
---

# What is LLM tracing?

Tracing means recording every step your app takes to answer one request:
each model call with its prompt, reply, token counts and timing, plus the
retrieval and tool steps around it. It's how you find out why an answer was
wrong, where the seconds went, and what each feature costs. Without it you're
guessing.

## One question, one trace

Take a user asking a docs assistant "How do I rotate my API key?". Behind
that one question, your app does several things:

1. Embeds the question and searches the docs ([[rag]]).
2. Calls the model with the question and the chunks it found.
3. The model asks to call a tool, say `get_account_settings`
   ([[tool-calling]]).
4. Your code runs the tool and calls the model again with the result.
5. The final answer streams back to the user.

A **trace** is the record of that whole request, from the question coming
in to the answer going out. Each step inside it is a **span**: it has a
start time, an end time, a parent, and whatever details you attach. Spans
nest, so the two model calls and the tool call sit under the request, and
the search sits beside them.

Tools name these parts differently. Langfuse calls every step an
observation, with types such as a generation (a model call) or a span, and
groups the traces of one conversation into a **session**. The shape is the
same everywhere: sessions hold traces, traces hold a tree of steps.

![A trace for one question to a docs assistant, drawn as a waterfall. The request span runs the whole time. Under it, in order: a retrieval span, a first model call that asks for a tool, a tool span for get_account_settings, and a second model call that streams the answer. The second model call's fields are shown: the model, 6,000 input tokens of which 5,000 were read from the cache, 400 output tokens, and the prompt version. Timings are illustrative.](img/llm-tracing-trace-tree.svg)

## What goes on a model-call span

For the spans that are model calls, there's a shared vocabulary: the
OpenTelemetry GenAI semantic conventions. A span for one call is named after
the operation and the model (`{gen_ai.operation.name}
{gen_ai.request.model}`) and carries fields like these:

- `gen_ai.operation.name` and `gen_ai.provider.name` (required)
- `gen_ai.request.model` and `gen_ai.response.model`
- `gen_ai.usage.input_tokens` and `gen_ai.usage.output_tokens`
- `gen_ai.usage.cache_read.input_tokens` and
  `gen_ai.usage.reasoning.output_tokens`
- `gen_ai.response.finish_reasons`, and `error.type` when it failed
- `gen_ai.prompt.name` and `gen_ai.prompt.version`, so you know which
  [[prompt-versioning|version of the prompt]] produced this output

Tool calls get their own span, with the operation name `execute_tool`.
There are also agent spans (`invoke_agent`) for an [[agent-loop]], and
metrics such as the duration of each call and, when streaming, the time
to the first chunk.

The token counts come straight from the provider's reply. Every response
has a usage block, like `input_tokens: 12, output_tokens: 6`, and the
tracing library copies it onto the span.

The prompt and the reply themselves (`gen_ai.input.messages` and
`gen_ai.output.messages`) are opt-in. The spec leaves them off by default
because they're likely to contain users' personal data. That's the job of
[[pii-handling]], and you'll want them on for debugging, so plan for it.

## Why you trace: debugging and latency

The first use is reading traces. When a user reports a bad answer, you
open its trace and see the chunks retrieval returned, the exact prompt the
model got, the tool result, and the reply. Most bugs show up right there: a
wrong chunk, a tool that returned an error the model ignored, a prompt
missing a rule. Logging traces is the step before any serious
[[evals|eval]] work. You can't grade or label outputs you never saved, and
the value comes from making it easy to look at lots of them.

The second use is latency. The waterfall shows which step took the time.
[[llm-latency]] covers where the time in a model call goes; the trace tells
you which call, in which request, and whether the tool or the retrieval
was the real problem.

## Cost is tokens times price, per call

The third use is cost. The math is simple: for each model call, multiply
each kind of token by its price and add them up. The trace already holds
the token counts, so cost is one more field on the span.

Say the second model call in the example ran on Claude Sonnet 5, which as
of 2026-09 costs $2 per million input tokens and $10 per million output
tokens, with cache reads at a tenth of the input price. The call used 6,000
input tokens, 5,000 of them read from the [[prompt-caching|prompt cache]],
and wrote 400 output tokens:

| Tokens | Count | Price per million | Cost |
|---|---|---|---|
| Uncached input | 1,000 | $2.00 | $0.0020 |
| Cached input | 5,000 | $0.20 | $0.0010 |
| Output | 400 | $10.00 | $0.0040 |
| **Call total** | | | **$0.0070** |

Output is less than a tenth of the tokens and more than half the cost,
which is why output tokens deserve your attention first (see
[[token-pricing]]).

There are two ways a tracing tool gets this number. It can take the cost
you send it, or infer it by matching the model name against a price table
it keeps and multiplying. When both exist, the one you sent wins.

![How one model call's cost is built. Three bars: 1,000 uncached input tokens at $2 per million cost $0.0020, 5,000 cached input tokens at $0.20 per million cost $0.0010, and 400 output tokens at $10 per million cost $0.0040, for a total of $0.0070. Output is 6% of the tokens and 57% of the cost. Below, the roll-up: call costs add up to a request, requests group by a feature tag, and features sum to a daily total.](img/llm-tracing-cost.svg)

## Rolling cost up per feature

One call's cost isn't very useful on its own. The questions you'll get are
"what does the search feature cost per day?" and "which feature got more
expensive last week?".

So tag every trace with the feature it belongs to (the docs assistant, the
summarizer, the nightly batch job) and the prompt version. Then cost rolls
up in three steps: sum the calls in a trace to get the cost of one request,
group requests by feature, and sum over a day. The same grouping gives you
cost per user, per prompt version or per model, which is how you spot that
a prompt change doubled the output length.

The conventions don't define a cost field (as of 2026-09), only token
counts. Price is something you or your tracing tool add, from a table you
have to keep up to date.

## Where it gets tricky

**The standard isn't stable.** The GenAI conventions are marked
"Development", and they've moved out of the main OpenTelemetry spec
into their own GitHub repo; the old pages on opentelemetry.io now only
point there. Field names can still change. Pin the version of your
instrumentation library and expect some renames when you upgrade it.

**Cached tokens can be counted twice.** In the conventions,
`input_tokens` includes cached tokens. Some tools want each token counted
in exactly one bucket, so input, cached input and output don't overlap. If
you copy `input_tokens` as "input" and also send the cache reads, you bill
the 5,000 cached tokens twice, once at full price. Check what your tool
expects before trusting the dashboard.

**Inferred prices go stale.** A tool that computes cost from its own price
table computes it when the trace arrives. Change the table later and old
traces keep the old cost. And the table only knows the discounts you put
in it: batch pricing, cache writes, or a contract rate.

**Reasoning tokens are invisible.** With [[reasoning-models]] you pay for
thinking tokens you never see. You can't get their count by tokenizing the
visible reply, so take the usage the provider reports, not a count you
compute yourself.

**Traces are sent in the background.** Tracing libraries batch spans and
send them later so they don't slow the request. A short script or a
serverless function that exits right away can lose its traces unless you
flush before exit.

**Traces are full of personal data.** The moment you turn on message
capture, your trace store holds everything users typed. That changes who
can see it and how long you keep it.

## What this means when you build

- Trace from the first day, before you have evals. Every model call, tool
  call and retrieval step gets a span under one trace per request.
- Use the OpenTelemetry GenAI field names even though they're not final.
  It keeps you free to switch tracing backends.
- Put the feature name, prompt version and model on every trace. You'll
  group by all three.
- Take token counts from the provider's usage block, and compute cost as
  tokens times price per token type, with cached input priced separately.
- Keep your price table in code, dated, and don't recompute old traces
  when prices change.
- Decide on message capture and masking before real users show up.
- Make reading traces easy. A trace nobody opens doesn't help.

## Further reading

- [Semantic conventions for generative client AI spans](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md),
  OpenTelemetry GenAI SIG, status Development. The standard field names
  for model-call spans, token counts, and why message content is opt-in.
- [Tracing data model](https://langfuse.com/docs/observability/data-model),
  Langfuse docs. A concrete model of sessions, traces and nested
  observations, built on OpenTelemetry.
- [Token & Cost Tracking](https://langfuse.com/docs/observability/features/token-and-cost-tracking),
  Langfuse docs. How cost is ingested or inferred from a price table, and
  the traps with token buckets, reasoning models and stale prices.
- [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/),
  Hamel Husain, 2024. Why logging and reading traces comes before any eval
  work.
- [Pricing](https://platform.claude.com/docs/en/about-claude/pricing),
  Anthropic docs. The per-token prices and cache discounts used in the
  worked example.
- [Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages),
  Anthropic docs. What the usage block in a model response looks like.
