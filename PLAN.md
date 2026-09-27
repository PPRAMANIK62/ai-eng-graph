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
   evidence behind it. That's what I talk about when someone asks "tell me
   about something you built."

Books are linear, but knowledge is a graph. The site is a graph of full
articles, with one AI assistant, the guide, that helps readers find their way
around it. What gets built, phase by phase, is in `GUIDE.md`. Every node is a real research article, not a one-line glossary
entry.

## AI engineering only

This folder is AI engineering, standalone. Backend and distributed systems
are handled separately, outside this project.

An AI engineer builds applications on top of models, usually through an API.
An ML engineer builds and trains the models. An AI-assisted developer uses AI
tools to write code faster. This project is about the first one. No linear
algebra, no training models from scratch.

Every concept is its own node in `content/nodes/`, linked to the others. The
concept lists below are the starting point for each phase's planning, not the
final list. `tentative-shape.md` has the first guess at every node.

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

- **One loop per phase.** Plan the phase's nodes, write them, then build the
  phase's piece of the guide. The steps are in `GUIDE.md` and `CLAUDE.md`.
- **Evals from day one.** Every AI feature ships with a small eval set when
  it's built, not later. Phase 4 makes the eval system complete, it doesn't
  start it.
- **Decide with evidence.** Every build choice with real alternatives gets a
  decision record in `content/decisions/`: the options, what I measured, what I
  picked and why.
- **Articles about what I built.** The concepts a phase uses get articles in
  that phase. The site explains the things it's made of.

## The phases

Seven phases. Each has concepts to write about here, and a piece of the guide
to build in `GUIDE.md`, with its own "done when" line.

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

### Phase 2: Ask the graph (retrieval)
Skills: 5, 6, 15.

Concepts, roughly:
- cosine similarity, embedding model choice (the embeddings idea is in
  phase 1)
- vector indexes (HNSW), keyword search (BM25), hybrid search
- chunking strategies, reranking
- RAG, grounding and citations
- measuring retrieval: recall@k, MRR
- context engineering, long context vs RAG
- AI product UX: streaming answers, showing sources, saying "I don't know"
- evals and success criteria, the basics (phase 2 builds the first eval
  set; phase 4 goes deep)

### Phase 3: Workflows and structured data
Skills: 2, 3, 7.

Concepts, roughly:
- tool calling
- chaining calls, running calls in parallel, routing, evaluator-optimizer
- extraction and classification as LLM use cases
- structured output in depth: constrained decoding, schemas, validation
- batch APIs

### Phase 4: Evals, models and the flywheel
Skills: 9, 10.

Concepts, roughly:
- evals in depth (the basics are in phase 2): deterministic, human
  review, LLM-as-judge and its biases
- synthetic test data, offline vs online evals
- the data flywheel
- choosing a model: open vs closed, cost, latency, benchmarks, reasoning
  models
- measuring latency: time to first token, total time, p95

### Phase 5: The tutor agent
Skills: 5, 8.

Concepts, roughly:
- the agent loop, tool design for agents
- memory, and context engineering for long runs
- MCP
- a human approving risky steps, sandboxing
- evaluating agents step by step
- multi-agent setups, and when not to use an agent

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

### Phase 7: Beyond text, open models, fine-tuning
Skills: 13, 14.

Concepts, roughly:
- vision models, images and PDFs as input
- turning documents into clean text
- speech to text, text to speech
- running open models locally, quantization
- fine-tuning: when it beats prompting or retrieval, and when it doesn't

## Stack

- Next.js (App Router) and TypeScript on bun, deployed on Vercel, with the
  articles, source notes and decisions as markdown in the same repo
  (decisions 0001 and 0002).
- Postgres with pgvector from phase 2.
- The model provider is chosen in phase 2 with a decision record, plus a
  second provider for fallback in phase 6.
- Python where it's the better tool (eval scripts, data work,
  fine-tuning). Many job listings ask for Python, so it shouldn't be
  avoided.

## What I walk into an interview with

- A live site and a public GitHub repo.
- Research articles that show I understand how things work.
- The guide: one AI feature that grew from retrieval to a tutor agent, with
  evals at every step.
- Public eval and cost pages that show I measure my work.
- Decision records behind every real choice, like "I tried chunk size 512,
  recall dropped from 0.81 to 0.64, here's the eval run."
- A security review of my own system.

## How the work gets done

- What gets built: `GUIDE.md`.
- Articles: `WRITING.md`.
- The agent workflow: `CLAUDE.md`.
- Decision records: `content/templates/decision.md`.
