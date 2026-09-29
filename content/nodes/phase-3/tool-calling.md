---
id: tool-calling
title: What is tool calling?
depth: deep
phase: 3
note: >-
  The model asks your code to run a function, then gets the result back and carries on.
needs: [structured-output]
leads_to: [agent-loop, tool-design, mcp, data-exfiltration]
compare_with: []
updated: 2026-09-29
---

# What is tool calling?

An LLM can only write text. Tool calling (also called function calling)
lets it write a structured request to run one of your functions: which
function, and with what arguments. Your code runs it, sends the result
back, and the model carries on with that result in hand. It's how a model
reads fresh data, changes things in the world, and hands decisions to your
code in a shape the code can trust. Everything agents do is built on it.

## One question, two requests

Say you give the model one tool, `get_weather`, and a user asks "What's the
weather in San Francisco?". A tool definition has three parts: a name, a
plain-language description of what it does and when to use it, and a JSON
Schema for its inputs. Here the schema has one required field, `location`.

The first request goes through the normal [[chat-api]] with the user's
message and the tool list. The model can't look up the weather, so instead
of an answer it replies with a tool call:

```json
{
  "type": "tool_use",
  "id": "toolu_01A09q90qw90lq917835lq9",
  "name": "get_weather",
  "input": { "location": "San Francisco, CA" }
}
```

The response also says why it stopped: `stop_reason: "tool_use"` on Claude.
That's your signal. Your code reads the name and arguments, runs the real
weather lookup, and gets back "15 degrees Celsius, partly cloudy".

Then you make a second request. It carries the whole conversation again
(the user's question, the model's tool call) plus a new user message holding
a `tool_result` block. The result points back to the call by its `id`. Now
the model has what it needs and writes: "The current weather in San
Francisco is 15 degrees Celsius with partly cloudy skies."

![The tool-calling round trip for one question. Request 1: your app sends the user's message and the get_weather tool definition. The model replies with stop_reason tool_use and a tool_use block naming get_weather with location San Francisco, CA. Your code runs the lookup and gets "15 degrees Celsius, partly cloudy". Request 2: your app sends the whole history plus a tool_result block with that text, linked by the call's id. The model replies with end_turn and the answer in plain words. The model never runs the function; your code does.](img/tool-calling-round-trip.svg)

OpenAI's version is the same five steps with different field names: send
the request with tools, receive a tool call, run it in your code, send a
second request with the output, get the final answer (or more tool calls).

If the model wants more than one tool, it keeps asking. The general shape
is a loop: while the stop reason says "tool use", run the tools, send the
results, and call again. Any other stop reason (the model finished, hit
`max_tokens`, or refused) ends it. When the model picks its own next step
in that loop, you have the [[agent-loop]].

## The model only writes text

The model never runs anything. It emits a request, your code (or the
provider's servers, for built-in tools like web search) does the work, and
it only ever sees the schema you gave it and the result you returned. It
never sees your function's code.

Open models make the trick visible. With Hugging Face Transformers, the
chat template renders your tool definitions into the prompt as text. When
the model decides to call one, it writes the call as ordinary text in a
format it was trained on:

```
<tool_call>
{"arguments": {"location": "Paris, France", "unit": "celsius"}, "name": "get_current_temperature"}
</tool_call>
```

Your code parses that string into a name and arguments. Hosted APIs do the
same behind the scenes: they inject the tool definitions into the system
prompt in a syntax the model has been trained on, and parse the model's
output back into a clean `tool_use` object for you. So tool calling is
still [[next-token-prediction]]. The model has just been trained (in
[[post-training]]) to write calls in a format the API knows how to read.

That has a cost you can see on the bill. Tool definitions are input tokens
on every request, and so are the calls and results in the history. Claude
also adds a hidden tool-use system prompt whenever tools are present: as of
2026-09, for models not yet retired, it runs from 286 tokens (Opus 5.5,
Sonnet 5.5) to 804 (Opus 4.7 with a forced tool), depending on model and
setting.

## Choosing whether to call: tool_choice

By default the model decides for itself. It calls a tool when the request
matches what a tool's description says it does and the answer isn't
already in the context, and answers directly otherwise. The `tool_choice`
setting changes that:

| | Claude | OpenAI |
|---|---|---|
| Model decides (default) | `auto` | `auto` |
| Must call some tool | `any` | `required` |
| Must call this tool | `tool` | forced function |
| No tools | `none` | `none` |

OpenAI also has an allowed-tools mode that limits the model to a subset
without changing the tool list.

Forcing has side effects. On Claude, forcing a tool prefills the model's
turn, so it writes no explanation before the call, even if you ask. And as
of 2026-09 some recent Claude models (Opus 5.5, Sonnet 5.5, Fable 5.1 and
Mythos 5.1) reject `any` and `tool` with a 400 error. On those, use `auto` plus strict tool use,
or [[structured-output]] when what you want is a fixed JSON answer rather
than an action.

The model can also ask for several tools in one turn, say the weather and
the local time. Both APIs let you turn that off: `disable_parallel_tool_use`
on Claude, `parallel_tool_calls: false` on OpenAI, which means zero or one
call per turn.

## Strict mode makes the arguments match the schema

Without extra settings, the arguments are the model's best effort. They
usually match your schema, but nothing guarantees it. Set `strict: true` on
a tool and the provider uses the same grammar-constrained sampling as
[[structured-output]] (the mechanism is [[constrained-decoding]]): the
arguments are guaranteed to fit the schema. There's little reason to leave
it off. It comes with the same schema rules as structured outputs:
on OpenAI every field must be `required` and every object needs
`additionalProperties: false`, with `null` as an extra type for optional
fields. OpenAI's Chat Completions API is still non-strict by default as of
2026-09.

Strict mode fixes the shape, not the judgment. Ask Claude "What's the
weather?" with no city, and a Sonnet model may call the tool anyway with a
guessed "New York, NY". Opus models are more likely to ask which city, but
it isn't guaranteed. The arguments can be perfectly valid and still wrong.

## When a tool call is the right move

Reach for a tool when the model needs something text alone can't give it:

- **An action with side effects**: send an email, write a file, update a
  record.
- **Fresh or private data**: today's prices, your database.
- **A decision your code will act on**, in a guaranteed shape.
- **An existing system**: an internal API, a search index.

Skip it when the model can answer from what it knows (summarizing,
translating), when there's nothing to execute, or when the task is so small
that an extra round trip would cost more than the work. Every client-side
tool call adds at least one more request.

The decision case is the one people miss. If you find yourself writing a
regex to pull a decision out of the model's prose ("find the word after
`Intent:`"), that decision should have been a tool call. Put the choice in
the schema, as an enum, and let the API hand you a typed value.

## How good are models at it?

The standard benchmark is the Berkeley Function Calling Leaderboard (BFCL).
It checks a call by parsing it into a syntax tree and comparing the
function name and arguments with the expected call, which tracks closely
with actually running the calls. Its 2025 paper (ICML) tested mostly
late-2024 models on single calls, real user queries, multi-turn conversations and
agent-style tasks.

The pattern is clear even though the models are now old. Picking the right
tool from a list, in one turn, is close to solved. Knowing what you
*can't* do is not. GPT-4o (the 2024-11-20 version, in native tool-calling
mode), second overall in the paper's table, scored 93.5% on choosing among several tools
but 6% on noticing that no available tool could do what the user asked in
a multi-turn conversation, and 0% on the memory tasks. The best model on
memory reached 12%.

![Bar chart of one model's BFCL scores by category, from the 2025 paper: GPT-4o 2024-11-20 in native tool-calling mode. Single-turn, pick among several tools: 93.5%. Single-turn, one tool: 77.2%. Recognise that no tool fits (irrelevance): 83.1%. Multi-turn, basic: 62.5%. Multi-turn, long context: 58.0%. Multi-turn, missing parameter: 37.5%. Multi-turn, missing function: 6.0%. Agentic memory: 0.0%. Overall 65.8%.](img/tool-calling-bfcl.svg)

The live leaderboard is at version 4 (last updated 2026-04-12), which
added agent-style tasks such as web search. Its overall score is a plain average of all
the categories, so check the categories that match your use, not just the
headline.

## Where it gets tricky

**Tags and regex vs a tool call.** The older way to get a decision out of
a model is to ask for it inside tags, like `<intent>Refund</intent>`, and
pull it out with a regex. It works. The other view: if you're writing
that regex, you wanted a tool call. Oddly, Claude's own hidden tool
prompt says the model's tool calls are parsed with regular expressions. The difference is who owns the
parser: the provider, for a format the model was trained on, with strict
mode to back it, versus your code, which has to decide what to do when the
tag is missing. [[classification]] walks through a real case.

**Native mode isn't always better.** BFCL ran models both through the
tools API and by describing the functions in the prompt. Prompted models
had more output that couldn't be parsed. But some strong
models scored higher when prompted, because the native mode's structure
limited them on complex, multi-call tasks.

**Parallel calls aren't free.** Asking for 20 stock prices in one turn is
much faster than 20 round trips. But when each call needs the result of
the one before, one at a time can be both faster and more accurate. In the
BFCL data, some late-2024 flagship models scored close to zero on the
parallel categories even though they did well on single calls.

**The "force a tool to get JSON" trick is fading.** In 2024 the usual way
to get guaranteed JSON from Claude was to define a fake tool whose input
schema was your output shape and force the model to call it. Native
structured outputs replaced that, and some recent Claude models no longer
accept a forced tool at all.

**Tool results are untrusted input.** Whatever a tool returns goes into
the model's context. A web page or email read by a tool can carry
instructions ([[prompt-injection]]), and a model with tools that can send
data out can be tricked into leaking it ([[data-exfiltration]]).

## What this means when you build

- Write the descriptions carefully. They're the biggest single factor in
  how well a model uses a tool. Aim for at least three or four sentences:
  what it does, when to use it and when not, what each parameter means.
  More on this in [[tool-design]].
- Keep the tool list short: fewer than 20 at the start of a turn is a
  good starting point.
- Turn on strict mode wherever it's available.
- Check the stop reason on every response, and loop only while it says
  "tool use". Put a cap on the number of rounds.
- Validate arguments before running anything with side effects. A valid
  schema can still hold a guessed city.
- Count tool tokens in your cost estimates: definitions, calls, results
  and the hidden system prompt.
- If you want the same tools in many apps, look at [[mcp]].

## Further reading

- [How tool use works](https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works),
  Anthropic, undated. The clearest statement of the contract, the loop
  keyed on `stop_reason`, and when tools are the wrong choice.
- [Tool use with Claude](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview),
  Anthropic, undated. The full `get_weather` round trip in code, how `auto`
  decides, and the table of hidden tool-prompt tokens per model.
- [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools),
  Anthropic, undated. Writing tool definitions, `tool_choice`, and which
  models no longer allow forced tool use.
- [Function calling](https://developers.openai.com/api/docs/guides/function-calling),
  OpenAI, undated. The same loop from a second vendor, with strict mode
  rules, parallel calls and the 20-tool guideline.
- [Tool use (chat templates)](https://huggingface.co/docs/transformers/main/en/chat_extras),
  Hugging Face, undated. What the APIs hide: tool schemas rendered into the
  prompt and tool calls written as plain text by an open model.
- [The Berkeley Function Calling Leaderboard (BFCL)](https://proceedings.mlr.press/v267/patil25a.html),
  Patil et al., 2025. How tool calling is measured, and where models fail:
  missing functions, multi-turn state and memory.
