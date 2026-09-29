---
id: agent-memory
title: How do agents remember?
depth: deep
phase: 5
note: >-
  What an agent keeps across steps and sessions, and where it lives.
needs: [agent-loop, context-engineering]
leads_to: [context-compaction]
compare_with: [rag]
updated: 2026-09-29
---

# How do agents remember?

An agent's memory is whatever it can get back to later: earlier steps of
the task it's doing now, and what it learned in earlier sessions. The model
itself keeps nothing between calls, so all of that has to live somewhere
you choose, either inside the context window or outside it. Getting this
right is what lets an agent finish a task that runs for hours, or pick up
tomorrow where it stopped today.

## The model forgets everything between calls

Take a coding agent building a small web app. It runs the
[[agent-loop]]: read some files, write code, run the tests, read the
output, repeat. Each of those steps is a fresh call to the model. The only
reason step 30 knows what happened in step 12 is that step 12 is still in
the messages you send, the same way a chat resends its history in
[[chat-api]].

That's the first kind of memory, and it comes for free: the history of the
current run, sitting in the [[context-window]]. Put simply, what an agent
"remembers" at any moment is exactly what's in its window at that moment.

It has two limits. The window fills up, and a full window gets less
accurate well before it's out of room. And when the run ends, or the
window gets cleared, all of it is gone. Tomorrow's session starts from
nothing.

So agent memory comes down to two questions:

1. **Where does it live?** Inside the window, where the model sees it on
   every call, or outside, where it has to be fetched.
2. **How long does it need to last?** Across the steps of one run, or
   across sessions.

## Inside the window: history and small notes

Within one run, the history is the main memory. You manage its size with
[[context-compaction]]: summarize old turns, or drop old tool output the
agent has already used.

A second in-window piece is a small, editable block of notes that stays at
the top of the context on every call. MemGPT, a 2023 research system,
called this the working context: a fixed-size block of text that the model
can rewrite only by calling a function. Letta, a company that builds agent
memory tools, uses the same idea and calls them core memory blocks. One block might hold what the agent
knows about the user, another its current goal. The model edits them with
tools as it learns something new.

Because these blocks are in every call, they cost tokens every call. They
suit a few facts that matter all the time, not a growing log.

## Outside the window: files and stores the agent searches

Everything else lives outside, and the agent reads it back with tools. This
is the "write" move from [[context-engineering]], and there are two common
shapes.

**Files the agent writes itself.** The simplest version is a notes file or
a to-do list. Anthropic's agent playing Pokémon kept notes like "for the
last 1,234 steps I've been training my Pokémon in Route 1, Pikachu has
gained 8 levels toward the target of 10". When its context was reset, it
read its notes and carried on.

Claude's API ships this as a tool. With the memory tool turned on, the
model gets a `/memories` directory and six commands: `view`, `create`,
`str_replace`, `insert`, `delete` and `rename`. The API also adds an
instruction to the system prompt telling the model to check that directory
before doing anything else, and to assume its context might be reset at
any moment, so any progress not written down could be lost. The tool runs
on your side: the model asks for a file operation, and your code carries it
out against whatever storage you pick, a folder per user or rows in a
database. As of 2026-09 it works on Claude 4 and later models.

**Stores the agent searches.** MemGPT split outside memory into two stores.
Recall storage holds the full message history, so the agent can search old
conversations even after they've left the window. Archival storage holds
longer-lived knowledge as text the agent can write to and search, often
with vector search ([[semantic-search]]). In both cases the model decides
when to look something up, by calling a function, the same way it calls
any other tool ([[tool-calling]]).

MemGPT also showed the plumbing that connects inside and outside. When the
prompt passed a warning level (70% of the window in their example), the
system warned the model that old messages were about to be pushed out, so
it could save what mattered to its notes or the archive first. When the
window was full, the oldest messages left the window, stayed readable in
recall storage, and were folded into a running summary.

![Where an agent's memory lives. Inside the context window, seen on every call: the system prompt and instructions, a few small memory blocks the agent can edit (who the user is, the current goal), and the recent messages and tool results of this run. Outside the window, fetched with tool calls: memory files the agent writes and reads (like a /memories folder or NOTES.md), the full message history it can search, and a knowledge store it can search. When the window fills, old messages move out to the history store and get folded into a summary.](img/agent-memory-where.svg)

## Across sessions: memory as a handoff note

Memory across sessions is a different problem from memory within one run.
A useful picture is a software project staffed by engineers working in
shifts, where each new engineer arrives with no memory of the last shift.
Whatever the last shift didn't write down is lost.

In late 2025, Anthropic tried to get a coding agent (Opus 4.5 on the
Claude Agent SDK) to build a production-quality web app across many
context windows. Compaction alone wasn't enough. The agent tried to do too
much at once, and later sessions declared the job done too early. What
worked was treating memory as a deliberate handoff:

- A first **initializer** session sets up the environment. It writes a
  feature list (over 200 end-to-end features for a clone of claude.ai), a
  progress file, and makes a first git commit.
- Every later session starts the same way: check the working directory,
  read the git log and the progress file, then pick the highest-priority
  feature that isn't done.
- It works on one feature, tests it end to end, commits with a clear
  message, and updates the progress file before it stops.

Two details are worth copying. The feature list was JSON, not Markdown,
because the model was less likely to rewrite a JSON file it shouldn't
touch. And the agent could only flip a `passes` field in it, under strong
instructions never to remove or edit tests. Git did double duty as memory:
the log says what happened, and a bad change can be rolled back.

![Memory across sessions as a handoff. Session 1, the initializer, writes a feature list, a progress file and a first git commit. Each later session starts with an empty context window, reads the progress file and the git log, picks one unfinished feature, builds and tests it end to end, then commits and updates the progress file. The files and the git history persist between sessions; the context windows don't.](img/agent-memory-sessions.svg)

## Names for kinds of memory

You'll see memory described with terms from cognitive science, mostly via
a 2023 framework paper called CoALA. They map onto the pieces above:

| Term | What it means | In practice |
|---|---|---|
| Working memory | What's active for the current step | The context window |
| Episodic memory | Experience from earlier steps or runs | Past conversations, progress logs, trajectories |
| Semantic memory | Knowledge about the world and itself | Facts the agent saved, a knowledge store |
| Procedural memory | How to do things | The model's weights, and the agent's code and instructions |

The terms are handy for design discussions. They don't tell you how to
build anything.

## Where it gets tricky

**Is RAG memory?** Retrieval is a way to *read* memory, not memory itself.
In [[rag]], the documents were written by people ahead of time and don't
change because the agent ran. Memory is written by the agent as it works,
and changes what it does next time. The two often share the same search
machinery, which is why they get mixed up.

**Compaction isn't memory, but they go together.** A compaction summary
keeps a long run going. It doesn't survive the end of the session, and it
can drop a detail you needed. The usual advice is to use both: compaction
keeps the window small, and memory files hold what must survive the
summary. Anthropic's long-running harness shows why summaries alone fall
short for multi-day work.

**Memory can be wrong, and then it stays wrong.** A mistake written to a
file comes back in every later session. That's context poisoning (covered
in [[context-engineering]]) made permanent. The defences are simple: keep
state in formats the agent is less likely to rewrite by accident, let it
change only the fields it should, check claims ("feature done") against
real tests, and delete files nobody has read in a long time.

**The agent writes to your storage.** Since your code carries out every
file operation, a path like `/memories/../../secrets.env` could reach files
outside the memory folder unless you check every path. Models usually
refuse to write sensitive data to memory, but "usually" isn't a guarantee.
Strip it yourself if it matters (see [[pii-handling]]). Cap file sizes too.

**"Memory" means different things in different products.** Letta's four
memory types, Claude's memory tool and a plain `NOTES.md` file all get the
same name. When you compare them, ask the two questions from the start:
where does it live, and how long does it last?

**The evidence is mostly builders' reports.** MemGPT is a 2023 paper on
models with far smaller windows than today's. Most of the rest comes from
the teams selling the tools. There's no shared benchmark here that
settles which design works best.

## What this means when you build

- Decide what must survive the end of a session, and write it to storage
  you own. Don't expect a summary to carry it.
- Keep the in-window part small: a few facts that matter every call.
- Give the agent a fixed routine: read memory first, write progress before
  stopping.
- Prefer structured files (JSON with a few fields it may change) for state
  the agent must not mangle. Use git when the work is code.
- Treat memory writes like any tool with side effects: check paths, cap
  sizes, strip secrets, expire old files.
- For state your app already knows for sure, like which articles a reader
  has marked understood, keep it in your database and hand it to the agent
  as a tool. Don't ask the model to remember it.

## Further reading

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents),
  Anthropic, 2025. Note-taking as memory, the Pokémon example, and how it
  fits with compaction and sub-agents.
- [Memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool),
  Anthropic docs. A current, concrete memory design: the commands, the
  injected prompt, security checks and a multi-session pattern.
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560),
  Packer et al., 2023. The window as RAM and outside storage as disk, with
  the model moving data between them.
- [Agent Memory: How to Build Agents That Learn and Remember](https://www.letta.com/blog/agent-memory/),
  Letta, 2025. Four kinds of memory, and why retrieval isn't memory on its
  own.
- [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents),
  Justin Young (Anthropic), 2025. Memory across sessions in practice:
  progress files, a JSON feature list and git.
- [Cognitive Architectures for Language Agents](https://arxiv.org/abs/2309.02427),
  Sumers et al., 2023. Where working, episodic, semantic and procedural
  memory come from.
