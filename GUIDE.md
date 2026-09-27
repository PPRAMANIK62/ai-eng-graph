# The guide: what gets built

Written 2026-09-27. This replaces the build lists that used to sit in
`PLAN.md`, and the in-browser widgets (decision
`content/decisions/0007-one-guide-not-widgets.md`).

The site is a map of AI engineering concepts. The AI part of the site is one
assistant, **the guide**, that helps a reader find their way around that map.
It starts small in phase 2 and learns one new skill each phase. Next to it
sit a few **author tools** that check my own writing.

Two things make this worth building instead of a set of demos:

- **It grows with the content.** Every new node is more for the guide to
  answer from, more to quiz on, more links to suggest, more claims to check.
  Every real question asked becomes a possible test case.
- **Each phase's build uses that phase's concepts.** Phase 2 writes about
  retrieval and builds retrieval. The articles explain the thing the site is
  made of, and the build is the proof I understood them.

## How each phase runs

Every phase, 2 to 7, goes through the same steps. The details are in
`CLAUDE.md`.

1. Start the phase.
2. Check its part of `tentative-shape.md`.
3. Suggest changes, based on what the written nodes already cover and what
   the build needs.
4. Check the sources in `content/sources/_candidates.md` for the phase.
5. Build the planned nodes, with links.
6. Write them.
7. Build the phase's piece of the guide and its author tools, with evals.

The phase is done when its "done when" line below is true, with evidence.

## Rules for every piece

- **Write what "good" means first.** Each piece below has success criteria.
  Before building, turn them into numbers I can measure. The targets below
  are starting points, not promises; they get fixed in a decision record
  once there's a baseline.
- **Evals ship with the piece.** A small eval set and a recorded baseline
  score, in the same change as the feature.
- **Real choices get a decision record.** Model, provider, database,
  chunking, prompt design: `content/decisions/`, with what was measured.
- **Log everything real.** From phase 2 on, every question, answer, the
  chunks it used, token counts and latency get logged. Failures become test
  cases.
- **The guide never answers from memory.** It answers from the graph, or it
  says the graph doesn't cover it yet.

## Phase 1: the map

Already built. The site shows the graph as a metro map, with hover notes,
"you haven't read this yet" warnings, trips through the map, and a map that
fills in as the reader marks stations as understood. No AI feature yet.

## Phase 2: the guide answers questions

**What it does.** A chat panel on the map. You ask a question, it searches
the articles and source notes, and streams an answer built only from what it
found. Every claim links to the node it came from, and the cited stations
light up on the map. If the graph doesn't cover the question, it says so,
and names the closest stations it does have.

**What gets built**
- Ingestion: articles and source notes cut into chunks and embedded, rebuilt
  whenever content changes. Two chunking strategies, so they can be compared.
- Search: Postgres with pgvector, keyword search with real BM25, merged with
  reciprocal rank fusion, then a reranker.
- Answering: a grounded prompt, citations to node ids, a streamed reply.
- "Not covered yet": a decision, from retrieval scores and the model's own
  judgment, on when to decline.
- Logging of every question and answer.

**Decisions to record:** model provider, embedding model, how citations are
produced (a provider's citation feature vs structured output with node ids),
BM25 in Postgres (`pg_textsearch` or ParadeDB), chunking strategy.

**Success criteria (starting targets)**
- Every answer that makes a claim cites at least one node.
- It declines on questions the graph doesn't cover, and doesn't decline on
  ones it does.
- Retrieval finds the right chunk in the top k for most questions (recall@k
  and MRR, measured).
- First token shows fast enough to feel live (time to first token, measured).

**Evals**
- 30 or more questions with the node(s) that answer them, including ones the
  graph doesn't cover.
- Retrieval metrics on their own: recall@k and MRR, for both chunking
  strategies.
- Answer checks: cites a node, cited node is one of the right ones, declines
  when it should.

**Done when:** every answer cites a node, it says "not covered yet" when the
graph doesn't cover the question, and I can show retrieval numbers for at
least two chunking strategies.

## Phase 3: the guide understands what you want

**What it does.** Before answering, the guide works out what kind of
question it is: explain a concept, compare two, "how do I build X", "where
do I start", or off-topic. Each kind takes its own path. Its reply can carry
actions the map carries out: highlight a route, open a station, show two
stations side by side. A checking step reads the draft answer against its
sources and fixes or drops any claim they don't support.

**Author tools**
- **Link suggester.** Reads a new node and proposes `needs`, `leads_to` and
  `compare_with` links as structured output. I accept or reject each one.
- **Fact checker.** Checks every sentence of an article against the source
  notes it cites, and flags claims no note supports. Runs in CI. The same
  checking step the guide uses, pointed at my own writing.

**Success criteria (starting targets)**
- The router picks the right kind of question for most of a labelled set.
- The checking step removes unsupported claims without removing supported
  ones, and I know what it costs in latency.
- Map actions are always valid (real node ids, real routes).
- Link suggestions I accept, and fact-checker flags that turn out right, go
  up over time.

**Evals:** a labelled set of questions for the router; answers with known
supported and unsupported claims for the checker; accept rate for the link
suggester; precision of the fact checker's flags.

**Done when:** each workflow has its own evals, and I can show where the
router and the checking step raised quality and what they cost in latency.

## Phase 4: the guide proves it works

**What it does.** Nothing new for the reader to click. This phase makes the
measuring real.
- One eval harness that runs every eval set from phases 2 and 3 in CI, on
  every prompt, model, or retrieval change.
- The flywheel: logged failures (thumbs down, declined questions the graph
  does cover, fact-checker misses) become new test cases.
- A public page with the guide's scores over time.
- A model comparison: at least 3 models, including one open model, through
  the same evals, with cost, speed and quality side by side.

**Success criteria:** I can point at any change and show its effect on the
scores; any LLM-as-judge grader agrees with my own grading on a sample I
labelled by hand.

**Done when:** the harness runs in CI, the flywheel has added real cases, and
the model comparison is published.

## Phase 5: the guide becomes a tutor

**What it does.** The guide becomes an agent with tools: search the graph,
read a node, see what the reader has marked understood, plan a trip, quiz,
mark progress.
- "I want to build a RAG app" turns into a trip through the map, skipping
  what you already know.
- It explains a station differently when you haven't read what it needs.
- It quizzes you on a station and grades your answer against the article,
  then updates your map, with you confirming the change.
- The same tools are exposed as an **MCP server**, so Claude Code or any
  other agent can use the graph.

**Success criteria:** plans respect `needs` order and skip understood nodes;
quiz grading agrees with my own grading on a labelled sample; the agent
never changes progress without the reader confirming; it doesn't loop or
call tools it doesn't need.

**Evals:** end-state checks (the right trip, the right grade) and step
checks (the tools it called, in what order, how many).

**Done when:** readers with different progress get different trips and
explanations, and the agent's step evals pass.

## Phase 6: the guide is safe to run in public

**What it does**
- Tracing of every call and tool step, a public cost and latency page,
  prompt caching, rate limits, retries and fallback to a second provider.
- Prompt versions tracked, with a way to roll back and a safe way to switch
  models (evals first).
- A public red-team page: prompt injection and other attacks I write against
  the guide and the tutor, what happened, and the fixes. Checked against
  the OWASP Top 10 for LLM apps.

**Success criteria:** every number on the cost page is explainable; a
provider outage doesn't take the guide down; the attack set's pass rate is
recorded and goes up.

**Done when:** the cost and latency page shows real traffic, the fallback
has been tested, and the security review is published.

## Phase 7: the guide goes beyond text

**What it does**
- **Drop a paper.** Paste a link or upload a PDF. The guide pulls out its
  ideas, places them on the map, and shows what's new, not yet in the graph.
- **Source watcher** (author tool). Re-fetches every source, spots pages
  that changed or died, and points at the claims in articles that depend on
  them.
- **Voice.** Ask the guide out loud and hear the answer.
- **Open models.** The guide runs on a local open model, compared with the
  hosted one on the same evals. A small open model fine-tuned for the
  phase 3 router, compared with the prompt-based router on accuracy, cost
  and latency.

**Success criteria:** "drop a paper" places ideas on the right stations for
a labelled set of papers; the watcher catches changes I planted; the
fine-tuning result has a clear answer to "was it worth it?"

**Done when:** the fine-tuning and local-model comparisons are published,
and "drop a paper" has an eval score.
