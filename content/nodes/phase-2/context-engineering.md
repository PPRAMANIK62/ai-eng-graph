---
id: context-engineering
title: What is context engineering?
depth: deep
phase: 2
note: >-
  Deciding what goes in the context window and what stays out.
needs: [context-window, rag]
leads_to: []
compare_with: []
updated: 2026-09-27
---

# What is context engineering?

Context engineering is deciding, on every call, what goes into the model's
[[context-window]] and what stays out: instructions, tool definitions,
retrieved documents, conversation history, tool results, notes. It's what
prompt engineering grew into once apps started calling a model many times
in a loop. A capable model with a cluttered window gives worse answers than
the same model with a clean one.

## Everything the model sees, not just the prompt

Prompt engineering is about writing and organizing the instructions. That
still matters, but in a real app the instructions are a small slice of what
the model reads.

Picture a support agent thirty turns into a conversation. On its next call,
the window holds:

- the [[system-prompt]]
- definitions for a dozen tools
- a few worked examples ([[few-shot-prompting]])
- three help articles pulled in by [[rag]]
- all thirty earlier turns, resent in full as in [[chat-api]]
- eight tool results, some of them long blobs of raw JSON

The model reads all of it to decide its next step. Context engineering is
the work of choosing that set. And because the window gets rebuilt on every
call, the choice gets made again every turn, not once.

The term caught on in June 2025. Shopify's CEO Tobi Lütke described it as
giving the model all the context it needs for the task to be plausibly
solvable. Andrej Karpathy called it filling the window with just the right
information for the next step, and compared the model to a CPU and its
window to RAM: working memory you manage on purpose. One reason the name
stuck is that people guess what a term means from its name. Many took
"prompt engineering" to mean typing things into a chatbot. "Context
engineering" is harder to misread.

## Why more context isn't better

It's tempting to include everything, just in case. Windows are big. But as
a window fills, models get less precise at using what's in it, a slow
slide covered in [[context-window]]. Every token you add spends a bit of
the model's attention.

One 2025 test makes it concrete. Chroma gave models a question about a long
chat history in two forms. The focused version held only the relevant
parts, about 300 tokens. The full version held the whole history, about
113,000 tokens. Every model tested did clearly better on the focused one.
The question and the facts were the same. Only the amount of noise
changed.

So aim for the smallest set of useful tokens that gets the job done.

## Four ways a context goes bad

Drew Breunig named four failure modes in 2025, each with an example from
someone else's study:

1. **Poisoning.** A mistake gets into the context, like a
   [[hallucination]] in an earlier step, and the model keeps referring
   back to it. A Gemini 2.5 agent playing Pokémon sometimes wrote down a
   wrong game state and then chased goals that were impossible.
2. **Distraction.** The context grows so long that the model leans on it
   instead of what it learned in training. The same Pokémon agent, past
   about 100,000 tokens, tended to repeat actions from its history instead
   of making new plans.
3. **Confusion.** Extra material that isn't needed drags the answer down. A
   small, compressed Llama 3.1 8B model failed a task when given 46 tools,
   and succeeded when given only 19.
4. **Clash.** New information conflicts with what's already there. When a
   task was fed in pieces across several turns instead of all at once,
   scores dropped 39% on average, and OpenAI's o3 fell from 98.1 to 64.1.

The common thread is that more in the window means more ways to go wrong.
A bigger window only gives you room for more text.

## Four moves: write, select, compress, isolate

Most techniques fall into four moves. The figure shows them around one
window.

![A context window in the middle, with four moves around it. Write: save notes, plans and memories outside the window. Select: pull in only the documents, tools and memories this step needs. Compress: summarize or trim old turns and tool results. Isolate: hand a subtask to a sub-agent with its own window, and take back only a short summary.](img/context-engineering-four-moves.svg)

### Write: keep it outside the window

An agent can save things to a file or a store instead of holding them in
the window: a plan, a to-do list, notes on what it's learned. It reads them
back when it needs them. This is called structured note-taking, or agentic
memory. If the window gets compacted or cleared, the important state is still
there to read back.

### Select: bring in only what this step needs

[[rag]] is the classic select move: search your documents and add only the
relevant chunks. The same idea works for tools. Instead of listing every
tool on every call, retrieve the few that fit the task, which is the fix for
the 46-tools problem above.

There's a choice here about *when* you select.

- **Up front.** Retrieve before the model starts, the usual RAG pattern.
  Fast, but you have to guess what it'll need.
- **Just in time.** Give the model lightweight pointers, like file paths,
  saved queries or links, and tools to open them. It loads what it needs
  as it goes. Claude Code, for example, uses `head`, `tail` and `grep` to
  look into large files without ever loading them whole. This is slower
  than a precomputed lookup, but the window stays clean.

Mixing both is common. Claude Code puts its `CLAUDE.md` project file in up
front and finds everything else with search tools as it works.

### Compress: shrink what's already there

When a conversation nears the window limit, summarize it and start a fresh
window from the summary. This is **compaction**. A good summary keeps
decisions made, open bugs and key details, and drops tool output that's
already been used. Claude Code, as of 2025, did this automatically once the
window passed 95% full.

The lightest form is clearing old tool results. Once an agent has read a
long tool output and acted on it, it rarely needs the raw output again.
Trimming, like dropping the oldest messages by a fixed rule, is the
simplest option of all.

Writing a compaction prompt is a tradeoff. Tune it first so it misses
nothing that matters, then tighten it to cut what doesn't.

### Isolate: split the work across windows

Hand a subtask to a sub-agent with its own clean window. It does its
searching and reading there, and returns only a short summary, often
1,000 to 2,000 tokens, to the main agent. The main window never sees the
mess.

The cost is tokens. Anthropic has reported that multi-agent setups can use
up to 15 times more tokens than a plain chat.

## Tools are context too

Tool definitions sit in the window on every call, and the model has to
choose between them. A common failure is a bloated tool set: tools that cover
too much, so it's unclear which one to use. A simple test: if a human
engineer couldn't say for sure which tool fits a situation, don't expect
the model to either. Fewer, clearly separate tools are easier to use well.

## Where it gets tricky

**Is it just a new name?** Partly. Choosing what goes in the prompt was
always part of prompt engineering. What changed is that apps became loops:
agents make dozens of calls, and each one needs its window rebuilt from a
growing pile of history, tool results and notes. The new name fits that
work better.

**Bigger windows don't retire it.** Windows keep growing, and it's fair to
ask whether this all becomes unneeded. The evidence so far says no: the
slide in accuracy as windows fill shows up on every model tested so far,
the newest from 2025, and the four
failure modes are about what's in the window, not how big it is. Anthropic
expects treating context as a scarce resource to stay central even as
models improve. That's a forecast, not a measurement.

**Every move has a price.** Just-in-time loading is slower. Compaction can
drop the one detail that turns out to matter. Sub-agents multiply token
use. There's no free option, only tradeoffs you measure.

**The numbers are 2025 numbers.** The failure mode examples come from 2025
models and are reported secondhand. Product details like the 95% trigger
change often. Chroma sells a retrieval database, so it has a reason to show
that long windows fall short, though its finding matches other studies
covered in [[context-window]]. Where in the window things sit can also
matter, covered in [[lost-in-the-middle]].

## What this means when you build

- **Look at the actual window.** Log the full context your app sends on a
  real call, late in a real session. It's often surprising.
- **Start small and add.** Include what the step needs, not what might
  help. Test whether each addition actually improves answers.
- **Keep tools few and distinct.** Retrieve tools per task if you have
  many.
- **Clear old tool results** before reaching for a full summary.
- **Plan for long sessions early.** Decide how you'll write notes out,
  compact history and split work before the window fills.
- **Choose between up-front and just-in-time retrieval** based on what the
  task needs: speed or a clean window. [[long-context]] covers when to skip
  retrieval entirely.

## Further reading

- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents),
  Anthropic, 2025. The fullest treatment: definition, tools, just-in-time
  retrieval, compaction, notes and sub-agents.
- [How Long Contexts Fail](https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html),
  Drew Breunig, 2025. Four named failure modes, each with a reported
  example.
- [Context Engineering](https://www.langchain.com/blog/context-engineering-for-agents),
  LangChain, 2025. The write, select, compress, isolate framing, with
  examples from real agents.
- [Context engineering](https://simonwillison.net/2025/Jun/27/context-engineering/),
  Simon Willison, 2025. Where the term came from and why it stuck.
- [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://www.trychroma.com/research/context-rot),
  Chroma, 2025. The focused vs full prompt test, and why more tokens hurt.
