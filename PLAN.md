# The plan

Written 2026-09-23. Checked against Matt Pocock's AI Engineer Roadmap
(aihero.dev/ai-engineer-roadmap, all 7 lessons) on 2026-09-23. Every topic in
it is covered below.

## Why I'm doing this

I want to land a job as an AI engineer. I'm a full-stack engineer and know
almost nothing about AI engineering yet or maybe just on the surface of it.

Three things come out of this project:

1. **A learning resource.** Every concept gets a research article built
   from the best published engineering writing: how it really works, where
   the sources disagree, with citations. I learn by reviewing the articles
   and building the features.
2. **Proof I learned it.** The writing lives on a site I build myself. The
   site uses AI features I designed, measured and shipped.
3. **Stories for interviews.** Every build decision is written down with the
   evidence behind it, and every phase ends with a case study. That's what I
   talk about when someone asks "tell me about something you built."

Books are linear, but knowledge is a graph. The site is a graph of full
articles. Every node is a real research article, not a one-line glossary
entry.

## AI engineering only

This folder is AI engineering, standalone. Backend and distributed systems
are handled separately, outside this project.

An AI engineer builds applications on top of models, usually through an API.
An ML engineer builds and trains the models. An AI-assisted developer uses AI
tools to write code faster. This project is about the first one. No linear
algebra, no training models from scratch.

Every concept is its own node in `content/nodes/`, linked to the others. Each phase
starts by planning its part of the map (see "Planning the map" in
`WRITING.md`). The concept lists below are the starting point for that
planning, not the final list.

## What an AI engineer job asks for

1. **How LLMs work, at an engineering level.** Tokens, the context window,
   sampling, why output costs more than input, where latency goes. How a
   model gets made (pretraining, post-training, reasoning models), enough to
   explain why models behave the way they do.
2. **Knowing when to use an LLM at all.** Good at turning messy text into
   structured data, classifying, answering questions, running agents. Bad at
   anything that must give the same answer every time, and bad as a bare
   chatbot with nothing behind it.
3. **Using model APIs well.** Streaming, structured output, tool calling,
   prompt caching, batch APIs.
4. **Prompting as engineering.** Role prompts, XML tags, examples in the
   prompt, asking the model to reason first. Prompts kept in version control
   and tested like code.
5. **Context engineering.** Deciding what goes into the context window and
   what stays out. Long context vs retrieval, memory, compacting long
   conversations.
6. **Retrieval (RAG).** Embeddings, chunking, vector search, hybrid search,
   reranking, answers with citations, measuring retrieval on its own.
7. **Workflow patterns.** Chaining calls, running calls in parallel, routing
   to the right model or prompt, evaluator-optimizer loops. Most real
   products run on these, not on agents.
8. **Agents.** The tool loop, MCP, memory, a human approving risky steps,
   sandboxing, evaluating what the agent did step by step. Knowing when an
   agent is the wrong tool.
9. **Evals and the data flywheel.** Success criteria set before building.
   Deterministic checks, human review, LLM-as-judge. Real usage logged,
   failures turned into new test cases, repeat. Most candidates skip this,
   which makes it the place to stand out.
10. **Choosing a model.** Open vs closed, hosting it yourself vs an API,
    cost per token, latency, benchmarks vs my own evals, reasoning models,
    context window size.
11. **Running it in production.** Cost and latency tracking, caching, rate
    limits, retries and fallback to another provider, tracing, prompt
    versioning, safe model upgrades.
12. **Security and safety.** Prompt injection, data leaking through tools,
    agents allowed to do too much, personal data, guardrails. The OWASP Top
    10 for LLM apps as a checklist.
13. **Beyond text.** Images and PDFs as input, turning documents into clean
    text, speech in and out.
14. **Open models and fine-tuning.** Running a model locally, what
    quantization trades away, and when fine-tuning beats prompting or
    retrieval.
15. **AI product UX.** Streaming UI, showing sources, handling "I don't
    know", making slow things feel fast. My full-stack background is an
    advantage here, so I use it.

## Rules for every phase

- **Evals from day one.** Every AI feature ships with a small eval set when
  it's built, not later. Phase 4 makes the eval system complete, it doesn't
  start it.
- **Decide with evidence.** Every build choice with real alternatives gets a
  decision record in `content/decisions/`: the options, what I measured, what I
  picked and why.
- **End with a case study.** Every phase ends with a write-up in
  `content/case-studies/`: what I built, what broke, the numbers, what I'd do
  differently. This is the interview story.
- **Articles about what I built.** The concepts a phase uses get articles in
  that phase. The site explains the things it's made of.

## What I build

Seven phases. Each has concepts to write about, things to build, and a
"done when" line. A phase isn't done until its case study is written.

### Phase 1: Foundations and the graph
Skills: 1, 2, 3, 4.

Concepts, roughly:
- what an AI engineer is (vs ML engineer, vs AI-assisted developer)
- what LLMs are good for, and what they're bad for
- next-token prediction, tokens and tokenization, embeddings (the idea only)
- the transformer and attention, at concept level
- sampling, temperature, top-p, logprobs
- context window, prefill and decode, the KV cache, why output costs more
- how a model gets made: pretraining, post-training, RLHF, reasoning models
- prompting: system prompts, role prompts, XML tags, examples, reasoning
  first
- structured output, streaming

Build:
- A static site that shows the graph, hover notes, "you haven't read this
  yet" warnings, and trails. A map that fills in as the reader marks nodes
  as understood.
- Three widgets on a real open model, run in the reader's browser (no API,
  no keys, no cost): a tokenizer playground comparing open tokenizers, a
  next-token explorer (real logits, with temperature, top-p and sampling
  applied on top), and a request timer that measures time to first token
  and time per token. Decision record 0006.
- A written success criteria doc for the AI features coming in later
  phases: what "good" means for each, before building any of them.
- Stack decision records: language (TypeScript with the Vercel AI SDK, or
  Python, or both), model provider, hosting.

Done when: the site is live with the phase's articles, the graph and widgets
work, and the success criteria are written.

### Phase 2: Ask the graph (retrieval)
Skills: 5, 6, 15.

Concepts, roughly:
- embeddings in depth, cosine similarity, embedding model choice
- vector indexes (HNSW), keyword search (BM25), hybrid search
- chunking strategies, reranking
- RAG, grounding and citations
- measuring retrieval: recall@k, MRR
- context engineering, long context vs RAG
- AI product UX: streaming answers, showing sources, saying "I don't know"

Build:
- A chat box that answers only from my articles and source notes, streams
  its answer, and links every claim to the node it came from.
- Postgres with pgvector, hybrid search, reranking. Postgres's built-in
  text ranking isn't BM25 (no IDF); real BM25 needs `pg_textsearch` or
  ParadeDB. Decision record.
- A first eval set: 30 or more questions with known good answers, plus
  retrieval metrics. Every chunking or search change gets measured against
  it.
- Logging of every real question and answer. The start of the data
  flywheel.

Done when: every answer cites a node, it says "I don't know" when the graph
doesn't cover the question, and I can show retrieval numbers for at least two
chunking strategies.

### Phase 3: Workflows and structured data
Skills: 2, 3, 7.

Concepts, roughly:
- tool calling
- chaining calls, running calls in parallel, routing, evaluator-optimizer
- extraction and classification as LLM use cases
- structured output in depth: constrained decoding, schemas, validation
- batch APIs

Build:
- A router in the chat: classify the question first (concept, comparison,
  "how do I build", off-topic) and send each kind down its own path.
- A grounding check: an evaluator-optimizer step that checks an answer is
  supported by its sources before showing it.
- A link suggester for my own writing: reads a new node and proposes
  `needs`, `leads_to` and `compare_with` links as structured output. I
  approve or reject every one. Its accept rate is its eval.

Done when: each workflow has its own evals, and I can show where the router
and the grounding check raised quality and what they cost in latency.

### Phase 4: Evals, models and the flywheel
Skills: 9, 10.

Concepts, roughly:
- evals in depth: deterministic, human review, LLM-as-judge and its biases
- synthetic test data, offline vs online evals
- the data flywheel
- choosing a model: open vs closed, cost, latency, benchmarks, reasoning
  models
- measuring latency: time to first token, total time, p95

Build:
- A complete eval harness that runs in CI on every prompt, model or
  retrieval change.
- A public eval page with scores over time.
- The flywheel running: failures from the logs become new test cases.
- A model comparison: at least 3 models, including one open model, run
  through my evals. Published cost, speed and quality tradeoff.

Done when: I can point to a change and show its effect on the score, and the
model comparison is published.

### Phase 5: The tutor agent
Skills: 5, 8.

Concepts, roughly:
- the agent loop, tool design for agents
- memory, and context engineering for long runs
- MCP
- a human approving risky steps, sandboxing
- evaluating agents step by step
- multi-agent setups, and when not to use an agent

Build:
- An agent that knows which nodes the reader has read and walks the graph.
  Ask "explain RAG" and it notices you haven't read embeddings and adjusts.
- An MCP server so anyone can plug the graph into Claude or Cursor, built
  on the 2026-07-28 spec (stateless; older tutorials are out of date).
- Agent evals that check the steps it took, not just the final answer.

Done when: the agent picks different explanations for readers who've read
different nodes, and its step-by-step evals pass.

### Phase 6: Production and security
Skills: 11, 12.

Concepts, roughly:
- prompt caching, semantic caching
- rate limits, retries, timeouts, falling back to another provider
- tracing and observability for LLM apps
- prompt versioning, safe model upgrades
- prompt injection, data leaking through tools, agents allowed to do too
  much
- guardrails, personal data, the OWASP Top 10 for LLM apps

Build:
- Caching, rate limiting, retries with fallback to a second provider,
  tracing.
- A public cost and latency dashboard.
- Prompt versions tracked, with a way to roll back.
- A security review of the site against the OWASP Top 10 for LLM
  Applications 2026, and attacks I write
  myself against the chat and the agent, with the fixes.

Done when: the dashboard shows real cost and latency, I can explain every
number on it, and the security review is published.

### Phase 7: Beyond text, open models, fine-tuning
Skills: 13, 14.

Concepts, roughly:
- vision models, images and PDFs as input
- turning documents into clean text
- speech to text, text to speech
- running open models locally, quantization
- fine-tuning: when it beats prompting or retrieval, and when it doesn't

Build:
- PDF sources: upload a paper, get it into the graph's source notes with
  its text and figures extracted.
- One open model running locally, compared against the API models with my
  evals.
- A fine-tuning experiment: fine-tune a small open model (TRL and PEFT) for
  question routing. OpenAI's fine-tuning API takes no new jobs from
  2027-01-06, so a provider API isn't an option.
  Compare it with the phase 3 prompt-based router on accuracy, cost and
  latency. Publish the result either way.

Done when: the fine-tuning comparison is published, with a clear answer to
"was it worth it?"

## Proposed stack

To be decided in phase 1 with decision records, not before.

- Articles, source notes, decisions and case studies as markdown in this
  folder.
- Astro for the site.
- TypeScript with the Vercel AI SDK for the app. Python where it's the
  better tool (eval scripts, data work, fine-tuning). Many job listings ask
  for Python, so it shouldn't be avoided.
- Postgres with pgvector from phase 2.
- One main model provider, plus a second for fallback in phase 6.

## What I walk into an interview with

- A live site and a public GitHub repo.
- Research articles that show I understand how things work.
- Public eval and cost dashboards that show I measure my work.
- 7 case studies, one per phase.
- Decision records behind every real choice, like "I tried chunk size 512,
  recall dropped from 0.81 to 0.64, here's the eval run."
- A security review of my own system.

## How the work gets done

- Articles: `WRITING.md`.
- The agent workflow: `CLAUDE.md`.
- Decision records: `content/templates/decision.md`.
- Case studies: `content/templates/case-study.md`.
