---
id: multi-agent
title: When do multiple agents help?
depth: deep
phase: 5
note: >-
  Several agents splitting a task. When it helps and what it costs.
needs: [agent-loop]
leads_to: []
compare_with: [orchestrator-workers]
updated: 2026-09-29
---

# When do multiple agents help?

A multi-agent system splits one task across several [[agent-loop|agent
loops]], usually a lead agent that hands pieces of the work to helpers.
It can cover more ground in parallel and keep each agent's context clean.
It also spends far more tokens and adds a new way to fail: agents that
don't know what the others decided. Whether it helps depends mostly on the
shape of the task, and the honest average across tasks is close to zero.

## Two ways to split the work

Every agent in the system is its own loop, with its own prompt, tools and
context. What differs is who stays in charge.

- **Manager, or agents as tools.** A lead agent calls the helpers the way
  it calls any tool. It sends a task, gets back a result, and keeps
  control of the reply to the user.
- **Handoffs.** One agent passes control to another, which takes over the
  conversation. A triage agent handing a customer to a refunds agent is
  the classic case.

OpenAI's agent docs name these two shapes. The rest of this article is mostly about the first one, because that's where the
arguments and the data are.

## The case for: breadth, in parallel, in separate contexts

In June 2025 Anthropic described the system behind Claude's Research
feature. Ask it to find all the board members of the companies in the
Information Technology sector of the S&P 500. That question breaks into
many separate lookups, and the system splits it up:

1. A lead agent reads the question, plans, and saves the plan.
2. It starts several subagents, each with a slice of the job and its own
   fresh context window.
3. Each subagent searches in its own loop, then sends back only a short
   summary of what it found.
4. The lead combines the summaries, and a separate citation agent ties
   each claim to its source.

On Anthropic's internal research eval, this setup (Claude Opus 4 as the
lead, Claude Sonnet 4 as subagents) beat a single Opus 4 agent by 90.2%.
It did best on breadth-first questions that branch into many independent
directions at once. Running subagents and their tool calls in parallel
cut research time by up to 90% on complex queries.

The explanation is mostly about tokens. On the BrowseComp benchmark, three
factors explained 95% of the variation in results, and token usage alone
explained 80%. Each subagent is a way to spend more tokens on the problem
without overflowing one context window. The price is real: agents use
about 4 times the tokens of a chat, and multi-agent systems about 15
times. Anthropic's own conclusion is that this only pays off for tasks
worth that much.

The team also had to teach the lead how much to spawn. Early versions
started 50 subagents for simple questions, searched endlessly for sources
that didn't exist, and had subagents repeat each other's searches. The fix was rules in the prompt: 1 agent with 3 to
10 tool calls for simple fact-finding, 2 to 4 subagents for comparisons,
more than 10 only for complex research.

## The case against: actions carry decisions nobody else sees

One day earlier, on 2025-06-12, Cognition (the team behind the Devin coding
agent) published "Don't Build Multi-Agents". Its example: you ask for a
Flappy Bird clone, and the lead splits it into "build the background with
pipes" and "build the bird". One subagent builds a background that looks
like Super Mario Bros. The other builds a bird that doesn't look or move
like the one in Flappy Bird. The lead is left trying to glue together two
misunderstandings.

The post boils it down to two rules. Agents should share the full context,
including the whole trace of what others did, not just the messages
passed to them. And every action carries implicit decisions (a style, an
assumption, an interpretation of the task), so agents working in parallel
make conflicting ones. Its advice was to keep one agent working in a
single thread, and to compress its history when it gets too long.

![Two ways to split "build a Flappy Bird clone". Left, parallel writers: a lead splits the task, one subagent builds a background that looks like Super Mario Bros., another builds a bird that moves nothing like Flappy Bird's, and the lead has to merge two mismatched parts. Right, one writer with helpers: a single agent writes all the code, while read-only helpers search, review or advise and send back only what they found.](img/multi-agent-writers.svg)

Anthropic's post agrees more than it seems. Tasks where all agents need
the same context, or where agents depend on each other a lot, don't fit
multi-agent systems yet, and it puts most coding tasks in that group. Research splits into independent searches. Code mostly
doesn't.

## What changed: one writer, several helpers

In April 2026 the same Cognition author wrote a follow-up. The narrower
view: multi-agent systems work today when writes stay in one thread and
the extra agents add intelligence rather than actions. Most multi-agent
setups in use, he notes, are limited to read-only subagents, like web
search and code search helpers.

The patterns that worked at Cognition:

- **A separate reviewer.** A review agent reads the code with none of the
  coder's context. That fresh view is the point, since it isn't worn down
  by the coder's long session. It finds on average 2 bugs per pull
  request, and about 58% of those are severe.
- **A smarter friend.** A primary model escalates hard parts to a
  stronger one. This failed when the primary was Cognition's own SWE
  1.5 model and worked well between frontier models.
- **Manager and workers.** A manager agent splits a big task and starts
  child agents. Two problems remained: managers gave overly detailed
  orders without knowing the codebase well, and workers didn't tell each
  other what they learned unless made to.

Swarms of agents negotiating freely with each other are still mostly a
distraction. The open problems are all about
communication. So the two 2025 positions have moved toward each other:
parallel reading and searching is fine, parallel writing is where things
break.

## What controlled studies found

The builders' posts come from their own products and evals. Two studies
tried to measure the question more broadly.

**The scaling study.** A Google and MIT team tested one single-agent setup
and four multi-agent ones across 260 configurations: six agent
benchmarks, models from OpenAI, Google and Anthropic, and the same total
token budget for every setup (the first version came out in 2025-12, the
current one in 2026-04). Results swung widely by task:

![For each of six agent benchmarks, the range of relative change from four multi-agent setups compared with a single agent at the same token budget. Finance Agent: +57% to +80.8%. BrowseComp-Plus: −35% to +9.2%. Workbench: −11% to +5.6%. Terminal-Bench: −19.2% to +1.7%. SWE-bench Verified: −14.9% to −2.1%. PlanCraft: −70% to −39.1%. Averaged across everything, the change was −0.3%.](img/multi-agent-scaling.svg)

- On financial analysis, which splits into separate calculations,
  multi-agent setups gained 57% to 81%.
- On PlanCraft, a planning task where each step depends on the last,
  every multi-agent setup lost, by 39% to 70%.
- On SWE-bench Verified, a coding benchmark, every multi-agent setup was
  slightly worse than one agent.
- Averaged over everything, the change was −0.3%.

It also found a ceiling: once a single agent already scores above about
45% on a task, adding agents tends to make things worse, because the
coordination costs outweigh what's left to gain. Tasks with many tools
suffer too, since splitting a fixed budget leaves each agent too few
tokens to use them well. And checking matters: when agents worked fully
independently, errors in the traces were amplified 17.2 times, while a
central agent that checked the work before combining it held that to 4.4
times.

**The failure study (MAST).** A Berkeley team read 1,642 runs from seven
open-source multi-agent frameworks, where failure rates ranged from 41% to
86.7%. They sorted the failures into 14 modes in three groups: how the
system was designed (44%), agents misaligned with each other (32%), and
weak checking of the result (24%). Common ones include repeating steps
already done, not knowing when to stop, ignoring the task's
specification, and a reasoning step that doesn't match the action taken. One example:
a generated chess program passed a surface check but didn't follow the
rules of chess.

## Where it gets tricky

**The big number and the average disagree.** Anthropic's +90.2% is one
internal eval of a research task, on mid-2025 models, with a multi-agent
system that spent far more tokens than the single agent it beat. The
scaling study held tokens equal and found a mean of about zero. Both can
be right: much of the gain may come from spending more tokens in
parallel, which a single agent with a bigger budget might also get. No
source tests that directly.

**A position that changed.** Cognition's 2025 post is often quoted as
"never build multi-agents". Its author revised it ten months later. Read
the two together: the point that survived is about writes, not about the
number of agents.

**Most multi-agent systems are one agent with helpers.** A read-only
search subagent is just a tool that happens to run its own loop. That's
the pattern with the fewest problems, and it's different from a team of
peers writing code together.

**Errors spread.** One agent's mistake becomes another agent's input.
Without a step that checks results before they're combined, errors
multiply, as both studies show. Give someone the job of verifying.

**It's harder to evaluate.** Different runs take different paths through
different agents. Anthropic ended up judging the final result with a
single LLM judge rather than checking each step, starting from about 20
real queries. More on this in [[agent-evals]].

## What this means when you build

- Start with one agent. Add helpers only when they clearly improve
  something you can name: keeping capabilities or policies apart, clearer
  prompts, or traces that are easier to read. Splitting early just gives you more prompts,
  more traces and more approval points.
- Split for breadth. Parallel, independent, read-only work (searching,
  reviewing) is where extra agents help.
- Keep one writer. Let one agent own the code, the document or the
  reply.
- Put a check before results are combined.
- Budget for it. Expect many times the tokens of a single agent, and
  compare against a single agent given the same budget.
- If the task is sequential, or one agent already does well, more agents
  will likely make it worse.

## Further reading

- [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system),
  Jeremy Hadfield et al. (Anthropic), 2025. The case for: the architecture,
  the +90.2% result, the token numbers and the production lessons.
- [Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents),
  Walden Yan (Cognition), 2025. The case against: shared context, implicit
  decisions and the Flappy Bird example.
- [Multi-Agents: What's Actually Working](https://cognition.com/blog/multi-agents-working),
  Walden Yan (Cognition), 2026. The revision: single-threaded writes, and
  three patterns that worked.
- [Towards a Science of Scaling Agent Systems](https://arxiv.org/abs/2512.08296),
  Yubin Kim et al. (Google Research, Google DeepMind, MIT), 2025, revised
  2026. A controlled study at equal token budgets, across six benchmarks.
- [Why Do Multi-Agent LLM Systems Fail?](https://arxiv.org/abs/2503.13657),
  Mert Cemri et al. (UC Berkeley), 2025. A taxonomy of 14 failure modes
  from 1,642 runs.
- [Orchestration and handoffs](https://developers.openai.com/api/docs/guides/agents/orchestration),
  OpenAI Agents docs. Handoffs vs agents as tools, and the case for
  starting with one agent.
