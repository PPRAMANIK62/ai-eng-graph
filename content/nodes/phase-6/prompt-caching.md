---
id: prompt-caching
title: What is prompt caching?
depth: deep
phase: 6
note: >-
  Reusing the provider's work on a repeated prompt prefix. Cheaper and faster.
needs: [kv-cache]
leads_to: []
compare_with: [semantic-caching]
updated: 2026-09-29
---

# What is prompt caching?

Prompt caching lets a provider keep the work it did reading the start of
your prompt, so the next request that starts the same way doesn't pay for
it again. Cached input tokens cost about a tenth of normal ones, and the
first token of the answer shows up sooner. For an agent or a chatbot that
resends the same long instructions and history on every call, it's often
the biggest cost lever you have, and it only works if you lay out your
prompt for it.

## The same prefix, every call

Take a support bot. Every request starts with the same 20,000 tokens: tool
definitions, a long [[system-prompt]], a product manual. Then comes the
user's question, maybe 50 tokens. A thousand users means a thousand
requests whose first 20,000 tokens are identical.

To answer, the model first reads the whole prompt in the prefill stage
(see [[prefill-decode]]). Along the way it works out keys and values for
every token, the [[kv-cache]]. Normally that cache is thrown away when the
request ends. So the next request recomputes keys and values for the same
20,000 tokens, and you pay full input price for them again.

Prompt caching keeps that work. The provider stores the keys and values
for the shared prefix. When a later request starts with exactly the same
tokens, it loads them instead of recomputing, and only processes what's
new: here, the 50-token question. What's stored is attention state, not
text, and not the answer. The model still writes a fresh response every
time, and sending the same prompt twice can still give two different
answers.

## Only an exact prefix counts

The cache is matched from the first token forward. A request can reuse the
cache up to the first token that differs, and nothing after it.

That makes order matter. On the Claude API the request is treated as one
sequence: tools first, then the system prompt, then the messages. On
OpenAI it's the fully rendered context, including tool definitions and
settings such as the output schema or reasoning effort. Change something
early and everything after it is a miss.

![A request laid out as a prefix, left to right: tool definitions, system prompt, reference documents, earlier conversation turns, then the new user message. A cache breakpoint sits after the earlier turns. Everything before it is read from the cache at about 0.1 times the input price; the new message is processed at full price. Below, three changes and what they break: editing a tool definition invalidates everything; putting a timestamp in the system prompt invalidates the system prompt and all messages; appending a new turn at the end keeps the whole prefix cached.](img/prompt-caching-prefix.svg)

Things that quietly break it, all seen in real products:

- **A timestamp at the top of the system prompt.** Especially one precise
  to the second. Every request gets a different prefix.
- **Unstable serialization.** Many JSON libraries don't promise key order,
  so the "same" tool schema can come out different.
- **Adding or removing tools mid-conversation.** Tools sit at the front, so
  this invalidates the whole cache.
- **Editing earlier turns.** Rewriting or summarizing history changes the
  prefix from that point on.

The fix is the same in every case. Put what never changes first and what
changes last. Treat the conversation as append-only. When something needs
updating, like the current time or a changed file, add it as a note in the
next message instead of editing the system prompt.

## How the two big providers do it (as of 2026-09)

The idea is the same everywhere. The controls and prices differ.

| | Anthropic (Claude) | OpenAI (GPT-5.6 and later) |
|---|---|---|
| Turned on by | `cache_control`, either once at the top level (automatic) or on up to 4 blocks | On by default. Implicit breakpoints, or explicit ones you place |
| Cache read | 0.1x input price on most models (0.05x on Opus 5.5) | 0.1x input price |
| Cache write | 1.25x for a 5-minute lifetime, 2x for 1 hour | 1.25x |
| Lifetime | 5 minutes or 1 hour, refreshed free on every hit | At least 30 minutes after the last write or hit |
| Minimum prefix | 512 to 4,096 tokens, depending on the model | 1,024 tokens |
| Counts toward rate limits? | Cached reads don't count toward input tokens per minute, on most models | Cached tokens still count toward tokens per minute |

Two details trip people up. On Claude, a write happens only at a
breakpoint, as a hash of everything before it, and a read looks back at
most 20 blocks for an earlier write. On OpenAI, cached state lives on
individual machines and requests are routed by a hash of their first
tokens, so a hit also depends on landing on the right machine.

Older OpenAI models worked differently: writes were free, and entries
lasted from about 5 to 10 minutes of inactivity up to 24 hours, depending
on the retention setting.

## What it saves

**Money.** Take the support bot on Claude Sonnet 5, at $2 per million input
tokens as of 2026-09. The 20,000-token prefix costs $0.04 per call
uncached. Writing it to the cache costs $0.05 once, and each read after
that costs $0.004. Over 100 calls within the cache lifetime, that's about
$0.45 instead of $4. OpenAI's docs run the same arithmetic: one write and
nine reads cost 2.15 times the prefix's normal price, against 10 times
without caching.

On Claude with the 5-minute lifetime, one write and a single read (1.25
plus 0.1 times the input price) already cost less than sending the prefix
uncached twice. With the 1-hour lifetime (a 2x write), it takes two reads.

**Time.** Reading a cached prefix is faster than computing it. When
Anthropic launched caching in 2024, it measured [[time-to-first-token]]
with and without it:

![Paired bars of time to first token without and with prompt caching, from Anthropic's 2024 launch. Chat with a book (100,000-token cached prompt): 11.5 s without, 2.4 s with, 79% faster, 90% cheaper. Multi-turn conversation (10 turns, long system prompt): about 10 s without, about 2.5 s with, 75% faster, 53% cheaper. Many-shot prompting (10,000-token prompt): 1.6 s without, 1.1 s with, 31% faster, 86% cheaper.](img/prompt-caching-latency.svg)

The pattern is the point: the longer the cached prefix, the bigger the
saving. A 100,000-token prompt got 79% faster. A 10,000-token one got 31%
faster, likely because less of its time went to reading the prompt in the
first place.

**Rate limits.** On Claude, cache hits aren't deducted from your rate
limit, so a high hit rate lets you send far more input per minute. On
OpenAI they still count. More in [[rate-limits]].

## Why agents care most

An agent in an [[agent-loop]] resends its whole growing context on every
step, and each step's output is usually a short tool call. One agent team
measured an average input-to-output ratio of about 100 to 1. Nearly all
the cost is input, and nearly all of that input is a prefix the model has
already seen.

That's why teams building agents treat cache hit rate as a top metric.
The Claude Code team alerts on it and treats a drop as an incident. Their
design choices follow from the exact-prefix rule:

- The prompt is ordered from most shared to least: fixed instructions and
  tools, then per-project files, then per-session state, then the
  conversation.
- Modes like "plan mode" are tools the model calls plus a message, rather
  than swapping the tool list.
- Tools that aren't needed yet are sent as small stubs and loaded later,
  instead of being added mid-session.
- [[context-compaction]] runs as a fork of the conversation with the same
  system prompt and tools, so the summarize call reuses the cache. A
  separate "summarize this" call with its own system prompt would share no
  prefix and pay full price for the whole history.

## Where it gets tricky

**Does it cut latency?** Anthropic claims up to 85% for long prompts, and
an independent test in 2025 saw large drops in time to first token on
fully cached prompts. The objection you'll also hear is that prompt caching
doesn't help latency, because the model still runs on every call. Both are
partly right. Caching skips reading the prefix, which is the prefill part
of the wait. It does nothing for writing the answer, which happens token by
token exactly as before. A request with a long cached prompt and a short
answer gets much faster. A request with a short prompt and a long answer
barely changes. Look at time to first token and total time separately.

**It isn't a response cache.** A hit still runs the model and still bills
every output token. Reusing whole answers for similar questions is a
different technique, [[semantic-caching]], with different risks.

**It fails silently.** On Claude, a prefix below the model's minimum
length isn't cached, and no error is returned. Check the usage fields on
every response: `cache_read_input_tokens` and
`cache_creation_input_tokens` on Claude, `cached_tokens` and
`cache_write_tokens` on OpenAI. If both are zero, nothing was cached.

**Parallel requests don't share on the first go.** On Claude, a cache
entry exists only once the first response starts. If you fire ten requests
at once with a cold cache, they can't read each other's work. Send one,
wait for its response to begin, then send the rest.

**The lifetime starts at the request, not the response.** On Claude, a
response that takes 4 minutes to stream leaves about 1 minute of a
5-minute cache for the follow-up.

**Hit rates vary by provider design.** In late 2025, one developer sent the
same request twice in a row and got a cache hit about half the time on
OpenAI's automatic caching, against every time on Anthropic's explicit
breakpoints. OpenAI now documents explicit breakpoints and different
routing for GPT-5.6 and later, so that number may not carry over to newer
models. Measure your own.

**The cache belongs to one model.** Switching models means starting cold.
The Claude Code team found that 100,000 tokens into an Opus conversation,
switching to the cheaper Haiku for an easy question cost more than letting
Opus answer, because Haiku had to rebuild the cache. The same applies when
a [[provider-fallback]] sends a long request to another provider.

**Prices and rules keep changing.** OpenAI's writes used to be free and
now cost 1.25x on GPT-5.6 and later. Anthropic's minimum length dropped to
512 tokens on its newest models and cache reads got cheaper on Opus 5.5.
Re-check the docs before you base a design on a number here.

**Caches are private, mostly.** Caches aren't shared between
organizations. On the Claude API they're also separate per workspace.
Inside your own app, though, all your customers share your organization.
On OpenAI, one customer could send guessed prompts and watch for cache hits
to learn what another customer sent. A separate `prompt_cache_key` per
customer helps prevent that.

## What this means when you build

- Order every prompt from stable to changing: tools, system prompt,
  reference documents, history, then the new message.
- Keep the prefix byte-identical: no timestamps up top, sorted JSON keys,
  a fixed tool list for the whole session.
- Append to the conversation instead of editing it. Put updates in the
  next message.
- Log cache read and write tokens on every call and track the hit rate.
  Alert when it drops.
- Check your prefix clears the model's minimum length. If it's just under,
  padding it with useful examples can be cheaper overall.
- Don't switch models mid-session to save money on a long context. Hand
  off to a subagent with a short summary instead.
- Pick the 1-hour lifetime on Claude when follow-ups come more than 5
  minutes apart.

## Further reading

- [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching),
  Anthropic docs. The full mechanism on Claude: breakpoints, lookback,
  lifetimes, minimum lengths, what invalidates the cache, and prices.
- [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching),
  OpenAI docs. On-by-default caching, the GPT-5.6 changes, routing, and a
  worked cost example for short prefixes.
- [Prompt caching with Claude](https://claude.com/blog/prompt-caching),
  Anthropic, 2024. The launch post, with measured time-to-first-token and
  cost savings for three workloads.
- [Lessons from building Claude Code: Prompt caching is everything](https://claude.dev/blog/lessons-from-building-claude-code-prompt-caching-is-everything/),
  Thariq Shihipar (Anthropic), 2026. How a real agent is designed around
  the cache, including compaction and why not to switch models.
- [Context Engineering for AI Agents: Lessons from Building Manus](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus),
  Yichao Ji (Manus), 2025. Why hit rate is the top metric for an agent,
  and the everyday mistakes that break it.
- [Prompt caching: 10x cheaper LLM tokens, but how?](https://ngrok.com/blog/prompt-caching),
  Sam Rose (ngrok), 2025. A visual walk from attention to the cached keys
  and values, plus a small test of hit rates at two providers.
