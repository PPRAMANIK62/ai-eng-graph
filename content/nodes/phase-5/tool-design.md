---
id: tool-design
title: How do you design tools for agents?
depth: deep
phase: 5
note: >-
  Tools a model uses well: names, descriptions, error messages and output size.
needs: [tool-calling]
leads_to: []
compare_with: [mcp]
updated: 2026-09-29
---

# How do you design tools for agents?

A tool is a function you let the model call. Designing one means choosing
what it does, what it's called, how it's described, what it returns and
what it says when something goes wrong. The model can only work with what
you give it here, so a well-built agent with badly designed tools still
fails. Tool design is often where the cheapest gains are.

## A tool has a caller that guesses

With [[tool-calling]], the model reads your tool definitions (a name, a
description and a JSON schema for the inputs), decides whether to call
one, and writes the arguments. Your code runs it and sends back the
result. In an [[agent-loop]] this happens again and again, and each
result shapes the next step.

When you write a normal function, the caller is another program. It reads
the docs once, calls the function the same way every time, and never
invents arguments. A model is a different kind of caller. Asked "should I
bring an umbrella today?", it might call your weather tool, answer from
memory, or first ask where you are. Sometimes it misreads what a tool is
for, or makes up an argument. So a tool is a contract between code that
behaves the same way every time and a caller that doesn't.

That changes what "good" means. A good tool for an agent is one the model
picks at the right moment, calls with the right arguments, and gets back
something it can act on, without filling its [[context-window]] with junk.

## Start from the task, not from your API

The usual first move is to wrap your existing API: one tool per endpoint.
Say you're building a scheduling assistant. Your API has `list_users`,
`list_events` and `create_event`, so you expose all three. To book a
meeting, the model now has to list users, find the right one, list their
events, work out a free slot, and create the event. Each step is a chance
to go wrong, and every listing lands in the context.

Think about how you'd search an address book. A program can scan every
contact cheaply. A model reads every returned contact token by token, and
each one uses up space it needs for the actual task. People don't read an
address book front to back; they jump to the right page. Give the model
the same shortcut.

So design around the job the agent is doing:

- Instead of `list_users`, `list_events` and `create_event`, one
  `schedule_event` that finds a free slot and books it.
- Instead of `read_logs`, a `search_logs` that returns only matching lines
  with a little context.
- Instead of `get_customer_by_id`, `list_transactions` and `list_notes`, one
  `get_customer_context` that gathers what's relevant about a customer.

![Two ways to give an agent the same abilities. Left, tools that mirror the API: list_users, list_events, create_event, read_logs, get_customer_by_id, list_transactions and list_notes, seven tools, with each intermediate result passing through the model. Right, tools built around tasks: schedule_event (finds availability and books), search_logs (only matching lines with context) and get_customer_context (everything relevant about one customer), three tools. Arrows show which API tools each task tool replaces.](img/tool-design-api-vs-task.svg)

The same idea from a different angle: if two functions are always called
one after the other, merge them. And don't make the model fill in an
argument your code already knows, such as the current user's ID. Anything
code can do reliably, code should do.

## The description is a prompt

The model decides when and how to use a tool mostly from its description.
The API turns your tool definitions into part of the model's instructions,
so a description is prompt text, and it deserves the same care as your
[[system-prompt]]. As of 2026, Anthropic's docs call detailed descriptions
the most important factor in tool performance and suggest at least three
or four sentences per tool.

Compare two descriptions of the same stock-price tool. The weak one says
"Gets the stock price for a ticker." The strong one says what the tool
returns (the latest trade price in USD), what inputs are valid (a ticker
on a major US exchange), when to use it (the user asks for a current
price), and what it doesn't do (no other company information). The second
one answers the questions the model would otherwise guess at.

A useful check is the intern test: could a new hire use this tool
correctly with nothing but the name, description and schema? If they'd
have to ask you something, put the answer in the description. The things
you know without thinking (special query formats, internal jargon, how
resources relate) are exactly what the model is missing.

Small wording choices matter:

- Name parameters exactly: `user_id` is clearer than `user`. The model can't
  tell if `user` wants a name, an email or an ID.
- Constrain the inputs. Use enums and structured objects so invalid
  combinations can't be expressed. Turn on strict mode where your provider
  offers it, so the arguments always match the schema (see
  [[structured-output]]).
- Make mistakes hard. While building a coding agent for the SWE-bench
  benchmark, Anthropic found the model misused a tool that took relative
  file paths once it had changed directory. Requiring absolute paths fixed
  it. The team said it spent more time on its tools than on the overall
  prompt.

Descriptions also cause bugs you only see in use. When Anthropic launched
its web search tool, Claude kept adding "2025" to search queries, which
skewed the results. A change to the tool description fixed it.

## Names that stay clear in a long list

Once an agent has tools from several services, names start to collide.
Two servers might each have a `search`. The fix is a prefix by service,
and by resource if needed: `github_list_prs`, `slack_send_message`,
`asana_projects_search`. Prefixes also help tool search (below), because
one search for "github" finds the whole group.

Two practical limits. Claude's API accepts names of 1 to 128 characters
made of letters, digits, underscores and hyphens. The [[mcp]] spec (as of
2026-07-28) asks for the same length, also allows dots, and suggests that
clients combining servers add a server prefix when names clash. Whether the
prefix goes first or last made a measurable difference in Anthropic's
evals, and the better choice varied by model, so test it.

## Return what the model can use next

Whatever a tool returns goes into the context and stays there for the
rest of the run. So return what helps the next step and nothing else.

Prefer names over IDs. Models do much better with names and readable
identifiers than with random strings. Anthropic found that swapping
arbitrary UUIDs for meaningful names, or even simple numbers like 0, 1, 2,
made Claude noticeably more precise in retrieval tasks and cut
hallucinated IDs.

Let the model choose how much detail it gets. Sometimes the model needs IDs to make a
follow-up call, and sometimes it only needs the content. A
`response_format` parameter with `"concise"` and `"detailed"` values lets
it pick. In Anthropic's Slack example, the detailed reply to a thread
lookup was 206 tokens, with IDs like `thread_ts` and `channel_id` for
later calls. The concise one was 72 tokens, just the thread content.

![Bar chart of tokens for the same Slack thread returned two ways: detailed format 206 tokens, including thread_ts, channel_id and user_id for follow-up calls; concise format 72 tokens, thread content only. The concise response uses about a third of the tokens.](img/tool-design-response-format.svg)

Cap big outputs. Any tool that can return a lot should have
pagination, filters, range selection or truncation, with sensible
defaults. As of 2025, Claude Code capped tool responses at 25,000 tokens
by default. If
you truncate, say so in the output and tell the model how to narrow the
request, for example "use a filter or ask for page 2."

The format matters too. Whether you return JSON, XML or Markdown changes eval scores,
and no format wins everywhere. Pick by testing on your own tasks.

## Errors that say what to do next

An error message is the model's only clue about how to recover. A stack
trace or a bare error code doesn't help. A message that names the problem
and the fix does: "Invalid departure date: must be in the future. Current
date is 08/08/2025." The model reads that, fixes the argument and tries
again.

MCP makes this a rule with two kinds of errors. Protocol errors (unknown
tool, malformed request) go to the client and are hard for a model to
fix. Tool execution errors (bad input, an API failure, a business rule)
come back as a normal result marked `isError: true`, written so the model
can correct itself. Clients should pass those to the model.

The same thinking applies to tools that keep state. As of 2026-07-28, MCP
has no sessions, so a tool that needs state across calls (a shopping
cart, a database transaction) returns a handle like `bsk_a1b2c3` and takes
it as an argument on later calls. Put the handle's lifetime in the tool
description ("baskets expire after 24 hours of inactivity"), and when a
handle has expired, return an error that says so, so the model knows to
create a new one.

## How many tools is too many?

Every tool definition costs tokens on every request, and every extra tool
is one more option the model can pick wrongly. The vendors agree more
tools isn't better, but they suggest different fixes.

- OpenAI (as of 2026-09) suggests fewer than 20 functions available at
  the start of a turn, calling it a soft limit.
- Anthropic says to merge related operations into one tool with an
  `action` parameter, so `create_pr`, `review_pr` and `merge_pr` become one
  tool. Its docs say Claude's ability to pick the right tool drops once
  you go past 30 to 50 tools.

Past that point, both point to tool search. You send all the
definitions but mark most as deferred. The model starts with only a
search tool and your most-used few, searches the catalog with a regex or
a plain-language query, and gets back the handful of definitions it needs. Anthropic's docs
give an example: five MCP servers (GitHub, Slack, Sentry, Grafana, Splunk)
can use about 55,000 tokens of definitions before any work starts, and
tool search usually cuts that by more than 85%. Tool search is itself a
small retrieval problem, so namespaced names and keywords in descriptions
help it the way good text helps [[bm25]].

A third approach replaces direct tool calls with code: the model writes a
script that calls your tools, so definitions are read on demand and big
intermediate results never pass through the context. That comes up in
[[mcp]], and it needs a [[sandboxing|sandbox]].

## Improve tools with evals

You can't tell from the definition alone whether a tool is easy to use.
You find out by watching the model use it. The loop:

1. Build a quick prototype of the tools.
2. Write realistic tasks that need several tool calls, each with a
   checkable outcome. "Schedule a meeting with Jane next week about the
   Acme project, attach last meeting's notes and book a room" tests more
   than "schedule a meeting with jane@acme.corp".
3. Run each task in a simple agent loop and record accuracy, number of
   tool calls, tokens, time and tool errors.
4. Read the transcripts. Lots of repeated calls suggests the pagination or
   limits are wrong. Lots of invalid-argument errors suggests the
   description or examples are unclear.
5. Change the tools and run again, checking on tasks you didn't tune on.

This is ordinary [[evals]] practice applied to tools, and grading the
whole run is covered in [[agent-evals]]. Anthropic also had Claude read
the transcripts and rewrite its tools. On held-out tasks those rewrites
beat both the versions its researchers wrote by hand and the ones Claude
first generated.

## Where it gets tricky

**Consolidation has limits.** Merging tools cuts choices, but a tool that
does too much gets a vague description and a large schema. The advice
from both vendors is a clear, distinct purpose per tool, and neither gives
a rule for where to stop. Your evals decide.

**The number is soft.** "Fewer than 20" and "30 to 50" come from
different vendors, models and tasks. With tool search the limit moves.
Don't treat either as a law.

**Examples cost tokens.** Adding `input_examples` to a Claude tool helps
with complex or format-sensitive inputs, but costs about 20 to 50 tokens
for a simple example and 100 to 200 for a nested one, on every request.

**Tool metadata isn't trustworthy by default.** If tools come from
someone else's MCP server, their descriptions and annotations (like "this
tool is read-only") are claims, not guarantees. The MCP spec says to
treat them as untrusted unless the server is. A description is text the
model obeys, which makes it a path for [[prompt-injection]].

**Advice moves with the models.** Anthropic's tool guidance in 2024 and
2025 was measured on older Claude models. The mechanisms keep changing
too: as of 2026-09, Claude Opus 5.5 and several other current Claude
models reject forced tool choice, and MCP dropped sessions in 2026-07. Re-run your tool evals when
you change models.

## What this means when you build

- Design tools around the tasks in your evals, not around your API.
  Merge steps that always go together.
- Write each description for a new hire: what it does, when to use it,
  when not to, what each parameter means, what it doesn't return.
- Name parameters exactly (`user_id`), use enums, turn on strict mode, and
  fill known values in code.
- Prefix tool names by service once you have more than one.
- Return names instead of raw IDs, offer a concise mode, and cap and
  paginate large outputs.
- Write error messages that say what to change.
- Keep the starting tool set small, and use tool search when it grows.
- Measure with realistic multi-step tasks and read the transcripts.

## Further reading

- [Writing effective tools for agents — with agents](https://www.anthropic.com/engineering/writing-tools-for-agents),
  Ken Aizawa (Anthropic), 2025. The main guide: task-shaped tools,
  namespacing, concise responses, token caps, helpful errors, and the
  eval loop.
- [Define tools](https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools),
  Anthropic docs. Name rules, what a good description covers, merging
  operations with an `action` parameter, and the cost of input examples.
- [Function calling](https://developers.openai.com/api/docs/guides/function-calling),
  OpenAI docs. A second vendor's rules: the intern test, fewer than 20
  functions, merging sequential calls, strict mode.
- [Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool),
  Anthropic docs. Why large tool sets hurt, the 55,000-token example, and
  deferred loading.
- [Model Context Protocol specification 2026-07-28: Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools),
  MCP maintainers, 2026. The two kinds of errors, name rules, and handles
  for stateful tools.
- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents),
  Erik Schluntz and Barry Zhang (Anthropic), 2024. Appendix 2 on the
  agent-computer interface, formats models find easy, and the absolute
  file path fix.
