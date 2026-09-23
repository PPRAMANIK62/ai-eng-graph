# Tentative shape of the map

Written 2026-09-23. **Not final.** This is a first guess at every node across
all seven phases, so I can see where the project is going. Each phase still
gets planned properly at its start (see `CLAUDE.md`), and these lists will
change as I learn. No node files exist yet.

How to read the tables:
- **needs** lists what to read first. `leads_to` is the mirror of `needs`,
  so it isn't listed separately.
- **compare** lists what the node gets confused with or weighed against.
- Nodes marked `*` aren't in `PLAN.md`'s concept lists. I added them
  because other nodes lean on them.

## Totals

| Phase | Theme | Deep | Short | Total |
|---|---|---|---|---|
| 1 | Foundations | 19 | 12 | 31 |
| 2 | Retrieval | 11 | 10 | 21 |
| 3 | Workflows and structured data | 6 | 5 | 11 |
| 4 | Evals and choosing models | 7 | 9 | 16 |
| 5 | Agents | 8 | 3 | 11 |
| 6 | Production and security | 5 | 10 | 15 |
| 7 | Beyond text, open models | 5 | 5 | 10 |
| | | **61** | **54** | **115** |

That's a lot of writing. Roughly 61 × 2,000 + 54 × 700 words, around 160,000
words. Phase 1 is the heaviest because everything else builds on it.

## The spine

The shortest path through the graph, from zero to the agent. If I only
wrote these, the site would still hold together:

```
next-token-prediction → tokenization → embeddings → attention → transformer
  → sampling → context-window → kv-cache → prompting nodes
  → structured-output → rag → evals → tool-calling → agent-loop
```

## Phase 1: Foundations (skills 1–4)

**Who and why**

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `ai-engineer` | short | Builds products on top of models, usually through an API. Rarely trains models, sometimes fine-tunes them. | | |
| `llm-use-cases` | deep | What LLMs do well (messy text to structure, classifying, Q&A, agents) and what they do badly (anything that must give the same answer every time). | ai-engineer, next-token-prediction | |
| `hallucination`* | deep | The model says something false in a confident voice. Why prediction produces this. | next-token-prediction | grounding |

**How a model reads and writes**

| id                      | depth | note                                                                                                       | needs                          | compare |
| ----------------------- | ----- | ---------------------------------------------------------------------------------------------------------- | ------------------------------ | ------- |
| `next-token-prediction` | deep  | An LLM does one thing: predict the next token, then repeat.                                                |                                |         |
| `tokenization`          | deep  | How text becomes the integer tokens a model actually sees, and why that explains odd behavior and pricing. | next-token-prediction          |         |
| `bpe`                   | short | Byte-pair encoding: the merge algorithm most tokenizers use.                                               | tokenization                   |         |
| `embeddings`            | deep  | A token or text turned into a list of numbers where similar meanings sit close together.                   | tokenization                   |         |
| `attention`             | deep  | How each token decides which earlier tokens matter for predicting the next one.                            | embeddings                     |         |
| `transformer`           | deep  | The architecture: stacked attention and feed-forward layers. Concept level, no math derivations.           | attention                      |         |
| `softmax`*              | short | Turns the model's raw scores into probabilities that add up to 1.                                          |                                |         |
| `logprobs`              | short | The log-probability the model gave each token. Some APIs return them; many newer models don't.                                    | softmax, next-token-prediction |         |

**Picking the next token**

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `sampling` | deep | How one token gets picked from the probability list: greedy vs random. | softmax, next-token-prediction | |
| `temperature` | short | Flattens or sharpens the probabilities before sampling. Newer closed reasoning models no longer let you set it. | sampling | top-p |
| `top-p` | short | Samples only from the smallest set of tokens that covers p of the probability. Top-k covered here too. | sampling | temperature |

**Running a model: time and money**

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `context-window` | deep | The max tokens a model can take in and put out in one call, and what happens near the limit. | tokenization | |
| `prefill-decode` | deep | The two stages of a call: read the whole prompt at once, then write one token at a time. | transformer | |
| `kv-cache` | deep | Keeping attention results for past tokens so each new token doesn't redo the work. | attention, prefill-decode | |
| `token-pricing` | short | Why output tokens cost several times more than input tokens. | prefill-decode | |

**How a model gets made**

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `pretraining` | deep | Next-token prediction over a huge pile of text. Where knowledge comes from. | next-token-prediction | |
| `post-training` | deep | Turning a text predictor into an assistant: instruction tuning, preference tuning. | pretraining | |
| `rlhf` | deep | Training on human preferences between answers. Why models are helpful, and why they flatter. | post-training | |
| `reasoning-models` | deep | Models trained to think in tokens before answering. More accurate on hard tasks, slower and pricier. | post-training, chain-of-thought | |

**Using the API and prompting**

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `chat-api`* | short | A list of messages with roles, sent every call. The model remembers nothing; some APIs store history for you, but you still pay for all of it. | context-window | |
| `system-prompt` | short | Instructions that sit above the conversation and set the model's job. | chat-api | |
| `role-prompting` | short | Telling the model who it is ("you're a senior editor"). What it changes and what it doesn't. | system-prompt | |
| `xml-tags` | short | Wrapping parts of the prompt in tags so the model can tell instructions from data. | system-prompt | |
| `few-shot-prompting` | deep | Putting worked examples in the prompt. | chat-api | fine-tuning |
| `chain-of-thought` | deep | Asking the model to reason before answering, and why that helps. | next-token-prediction | reasoning-models |
| `prompts-as-code`* | short | Prompts in version control, tested like code. | system-prompt | |
| `structured-output` | deep | Getting JSON that matches a schema instead of free text. | chat-api | |
| `streaming` | deep | Sending tokens to the client as they come out, over server-sent events. | prefill-decode, chat-api | |

## Phase 2: Retrieval (skills 5, 6, 15)

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `cosine-similarity` | short | How close two embeddings are, by the angle between them. | embeddings | |
| `embedding-models` | short | Choosing an embedding model: size, dimensions, cost, benchmark vs my own data. | embeddings | |
| `semantic-search`* | deep | Search by meaning: embed the query, find the nearest chunks. | cosine-similarity, embedding-models | bm25 |
| `vector-index` | deep | Why exact nearest-neighbor search is too slow, and what approximate indexes trade away. | semantic-search | |
| `hnsw` | deep | The graph-based index most vector databases use. | vector-index | |
| `pgvector`* | short | Vectors inside Postgres. What it supports and where it runs out. | hnsw | |
| `bm25` | short | Keyword search that scores rare words higher. Still hard to beat. | | semantic-search |
| `hybrid-search` | deep | Running keyword and vector search together and merging the results. | bm25, semantic-search | |
| `reciprocal-rank-fusion`* | short | The simple formula most hybrid search uses to merge two ranked lists. | hybrid-search | |
| `chunking` | deep | Cutting documents into pieces for retrieval. Size, overlap, structure-aware splits. | semantic-search | |
| `reranking` | deep | A second, slower model that re-orders the top results. | hybrid-search | |
| `rag` | deep | Retrieve relevant text, put it in the prompt, answer from it. | semantic-search, chunking, context-window | long-context, fine-tuning |
| `grounding` | deep | Answering only from the given sources, with a citation for each claim. | rag | hallucination |
| `retrieval-evaluation` | deep | Measuring the search step on its own, separate from the answer. | rag | |
| `recall-at-k` | short | Of the chunks that should come back, how many are in the top k. | retrieval-evaluation | mrr |
| `mrr` | short | How high the first right result ranks, on average. | retrieval-evaluation | recall-at-k |
| `context-engineering` | deep | Deciding what goes in the context window and what stays out. | context-window, rag | |
| `long-context` | deep | Putting whole documents in the prompt instead of retrieving pieces. When it wins. | context-window | rag |
| `lost-in-the-middle`* | short | Models use the start and end of a long prompt better than the middle. | long-context | |
| `streaming-ui` | short | Showing a streamed answer well: partial text, sources, loading states. | streaming | |
| `saying-i-dont-know` | short | Designing for the answer the system doesn't have, in the prompt and in the UI. | grounding | |

## Phase 3: Workflows and structured data (skills 2, 3, 7)

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `tool-calling` | deep | The model asks your code to run a function and gets the result back. | structured-output | |
| `llm-workflows` | deep | LLM calls wired together by fixed code paths. Most products run on these. | chat-api | agent-loop |
| `prompt-chaining` | short | Output of one call becomes input to the next. | llm-workflows | |
| `parallel-calls` | short | Several calls at once, for speed or for voting. | llm-workflows | |
| `routing` | deep | Classify the input first, then send it to the right prompt or model. | llm-workflows, classification | |
| `evaluator-optimizer` | deep | One call writes, another checks, loop until it passes. | llm-workflows | |
| `extraction` | deep | Pulling structured fields out of messy text. | structured-output | |
| `classification` | short | Putting inputs into fixed buckets with an LLM. | structured-output | |
| `constrained-decoding` | deep | Forcing valid output by blocking tokens that would break the schema. | structured-output, sampling | |
| `schema-validation` | short | Checking the output after the fact and retrying when it fails. | structured-output | constrained-decoding |
| `batch-api` | short | Send many requests, get results hours later, pay about half. | chat-api | |

## Phase 4: Evals and choosing models (skills 9, 10)

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `evals` | deep | Tests for AI features: a fixed set of inputs, a way to score outputs, a number to track. | llm-use-cases | benchmarks |
| `success-criteria` | short | Writing down what "good" means before building. | evals | |
| `code-based-evals` | short | Checks a script can run: exact match, regex, schema, contains-citation. | evals | llm-as-judge |
| `human-review` | short | People grading outputs. Slow and costly, and the usual reference point, though people miss things too. | evals | llm-as-judge |
| `llm-as-judge` | deep | A model grading another model's output. | evals | human-review |
| `judge-bias` | short | Where judges go wrong: position, length, self-preference. | llm-as-judge | |
| `synthetic-test-data` | short | Generating test cases with a model, and the traps in that. | evals | |
| `offline-evals` | short | Scoring against a fixed test set before shipping. | evals | online-evals |
| `online-evals` | short | Scoring real traffic after shipping. | evals | offline-evals |
| `data-flywheel` | deep | Log real use, turn failures into test cases, fix, repeat. | offline-evals, online-evals | |
| `benchmarks` | deep | Public scores like MMLU and SWE-bench, what they measure, and contamination. | evals | |
| `model-selection` | deep | Picking a model on my evals, cost and latency, not the leaderboard. | benchmarks, token-pricing | |
| `open-vs-closed-models` | deep | Open weights vs API-only: control, cost, quality, hosting. | model-selection | |
| `llm-latency` | deep | Where time goes in a call and how to measure it. | prefill-decode | |
| `time-to-first-token` | short | How long before the first token shows. What users feel. | llm-latency | |
| `tail-latency` | short | p95 and p99: why the average hides the slow calls. | llm-latency | |

## Phase 5: Agents (skills 5, 8)

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `agent-loop` | deep | A model calls tools in a loop, deciding its own next step, until it's done. | tool-calling | llm-workflows |
| `react-pattern`* | short | The paper that named the reason-then-act loop. | agent-loop, chain-of-thought | |
| `tool-design` | deep | Designing tools a model uses well: names, descriptions, errors, output size. | tool-calling | |
| `agent-memory` | deep | What an agent keeps across steps and sessions, and where it lives. | agent-loop, context-engineering | |
| `context-compaction` | short | Summarizing old turns so a long run fits in the window. | context-window, agent-memory | |
| `mcp` | deep | Model Context Protocol: one standard way to plug tools and data into any model app. | tool-calling | |
| `human-in-the-loop` | short | Pausing for a person to approve risky steps. | agent-loop | |
| `sandboxing` | deep | Running agent actions where they can't do real damage. | agent-loop | |
| `agent-evals` | deep | Grading what an agent did: the outcome first, then its steps to find where it went wrong. | agent-loop, evals | |
| `multi-agent` | deep | Several agents splitting a task. When it helps and what it costs. | agent-loop | |
| `when-not-to-use-agents` | deep | Why a fixed workflow is usually the better choice. | agent-loop, llm-workflows | |

## Phase 6: Production and security (skills 11, 12)

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `prompt-caching` | deep | Reusing the provider's work on a repeated prompt prefix. Cheaper and faster. | kv-cache | semantic-caching |
| `semantic-caching` | short | Reusing a past answer when a new question means the same thing. | embeddings | prompt-caching |
| `rate-limits` | short | Provider limits on requests and tokens, and designing around them. | chat-api | |
| `retries` | short | Retrying failed calls with backoff and timeouts. | rate-limits | |
| `provider-fallback` | short | Switching to a second provider when the first fails. | retries | |
| `llm-tracing` | deep | Recording every call, prompt, token count and step so you can debug and measure. | llm-latency | |
| `prompt-versioning` | short | Tracking prompt versions and rolling back. | prompts-as-code | |
| `model-upgrades` | short | Moving to a new model without breaking things: evals first. | offline-evals | |
| `prompt-injection` | deep | Text in the input that takes over the model's instructions, directly or through retrieved content. | system-prompt | jailbreaks |
| `jailbreaks` | short | Tricking a model past its own safety training. | post-training | prompt-injection |
| `data-exfiltration` | deep | Data leaking out through tools and links when an agent reads untrusted content. | prompt-injection, tool-calling | |
| `excessive-agency` | short | Agents given more tools and permissions than the task needs. | agent-loop | |
| `guardrails` | deep | Checks on input and output that block bad requests and bad answers. | prompt-injection | |
| `pii-handling` | short | Keeping personal data out of prompts, logs and training. | llm-tracing | |
| `owasp-llm-top-10` | short | The standard checklist of LLM app risks. | prompt-injection | |

## Phase 7: Beyond text, open models, fine-tuning (skills 13, 14)

| id | depth | note | needs | compare |
|---|---|---|---|---|
| `vision-models` | deep | How models take images as input: images turned into tokens. | tokenization, transformer | |
| `pdf-input` | short | Sending PDFs to a model: as images, as text, or both. | vision-models | document-parsing |
| `document-parsing` | deep | Turning PDFs and scans into clean text and tables. | | pdf-input |
| `speech-to-text` | short | Transcribing audio. | | |
| `text-to-speech` | short | Generating speech from text, and the latency problem. | streaming | |
| `local-models` | deep | Running an open model on your own machine. | open-vs-closed-models | |
| `quantization` | deep | Storing weights in fewer bits: smaller and faster, some quality lost. | local-models | |
| `fine-tuning` | deep | Training an existing model further on your own examples. When it beats prompting or RAG. | post-training | rag, few-shot-prompting |
| `lora` | short | Fine-tuning a small add-on instead of the whole model. | fine-tuning | |
| `distillation`* | short | Training a small model to copy a big one's outputs. | fine-tuning | |

## Choices baked into this guess

1. **`embeddings` lives in phase 1, written once.** `PLAN.md` has it in
   phase 1 ("the idea only") and phase 2 ("in depth"). Attention and the
   transformer need it, so it gets written early. Phase 2 adds the parts
   that are really separate concepts: `cosine-similarity`,
   `embedding-models`, `semantic-search`.
2. **`structured-output` lives in phase 1.** Phase 3's "in depth" becomes
   its own nodes: `constrained-decoding` and `schema-validation`.
3. **`streaming` (the mechanism) is phase 1, `streaming-ui` is phase 2.**
   Two concepts, one on the wire and one on the screen.
4. **`prompt-injection` covers direct and indirect injection in one node.**
   It may need splitting once I read the sources.
5. **`when-not-to-use-agents` is its own deep node** instead of a section of
   `agent-loop`. It's a common interview question.

## Worth deciding before phase 1 starts

- **Phase 1 is big: 31 nodes, 19 deep.** Options: move `pretraining`,
  `post-training` and `rlhf` to later, or drop `bpe`, `top-p` and
  `role-prompting` into their parents. I'd keep the model-making nodes,
  since `reasoning-models` and `fine-tuning` need them, and merge the
  small ones if they turn out thin.
- **Some shorts may be too small.** `offline-evals` and `online-evals` might
  make sense only together. `retries` and `provider-fallback` might merge.
- **Missing on purpose:** math behind attention, training from scratch,
  anything about GPUs beyond what explains latency and cost. Out of scope
  per `PLAN.md`.
- **Possibly missing:** `query-rewriting` (phase 2), `prompt-evaluation` vs
  `evals` overlap, `computer-use` (phase 5), `cost-tracking` (phase 6). Add
  them if a build step needs them.
