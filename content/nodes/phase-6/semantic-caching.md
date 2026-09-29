---
id: semantic-caching
title: What is semantic caching?
depth: short
phase: 6
note: >-
  Reusing a past answer when a new question means the same thing.
needs: [semantic-search]
leads_to: []
compare_with: [prompt-caching]
updated: 2026-09-29
---

# What is semantic caching?

A semantic cache stores the answers your app has already given, and when a
new question means the same as an old one, it returns the stored answer
without calling the model. A hit takes tens of milliseconds instead of
seconds and costs nothing in tokens. The hard part is deciding when two
questions really mean the same thing, because a wrong match serves a wrong
answer.

## Matching questions by meaning

An ordinary cache looks up the exact text. "What's your return policy?"
and "How do I return an item?" are different strings, so the second one
misses, even though a help desk would give the same answer to both. These
near-duplicates are exactly what fills a support bot's traffic.

A semantic cache runs a small [[semantic-search]] over past questions
instead:

1. Turn the new question into an [[embeddings|embedding]].
2. Find the most similar past question in the cache, usually by
   [[cosine-similarity]] or a distance.
3. If it's close enough, past a threshold you set, return that question's
   stored answer. The model never runs.
4. If not, call the model as usual, then store the new question, its
   embedding and the answer, with an expiry time.

![The semantic cache flow. A new question is embedded and compared with past questions in the cache, filtered by tenant, locale and model version. If the nearest one is closer than the threshold, the stored answer is returned in tens of milliseconds and the model isn't called. If not, the model answers, and the question, embedding and answer are stored with an expiry time. Two example pairs: "Which city is Canada's capital?" and "What is the capital of Canada?" should share an answer; two questions can sit just as close in embedding space and still need different answers.](img/semantic-caching-flow.svg)

Each entry should also carry hard labels, like which customer it belongs
to, the language, and which model version wrote it. The search only looks
at entries with matching labels. One customer's answer should never be
served to another, and an answer written by last month's model or prompt
shouldn't outlive a change.

Unlike [[rag]], which retrieves document chunks to feed into the model, a
semantic cache stores complete answers and skips the model entirely.

## The threshold is the whole problem

Set the threshold too loose and you return answers to questions that were
only similar. Set it too tight and almost nothing hits, so you pay for the
cache and the model.

A single fixed threshold can't solve this well. The trouble is that
closeness in embedding space doesn't track "same answer" evenly. Two
questions can sit very close and still need different answers, while two
others sit further apart and share one. When the vCache researchers
measured this on benchmark datasets (2025, revised 2026), the similarity
scores of correct and wrong hits overlapped heavily. So any one number is either unsafe or so strict
that it wastes most of the possible hits.

Their fix learns a separate threshold for each cached entry as
traffic comes in, and keeps the error rate under a bound you choose. On
their benchmarks it got up to 12.5 times more hits and 26 times fewer
errors than the fixed-threshold and fine-tuned-embedding caches they
compared it with. The practical lesson for any semantic
cache: measure the wrong-answer rate on real questions, don't just pick a
number like 0.8.

## Where it gets tricky

**Semantic caching vs prompt caching.** They're often confused and they do
different things. [[prompt-caching]] reuses the provider's work on a
repeated prompt prefix. The model still runs and still writes every output
token, so it saves money on input and speeds up the first token, not the
whole answer. A semantic cache hit skips the model, so it saves both, but
it can be wrong in a way prompt caching never is. You can use both.

**It can be attacked.** To get hits, a semantic cache has to map similar
questions to the same entry. That same property makes it easy to craft an
input that collides with an entry on purpose, the opposite of what a
secure hash is built for. A 2026 study built an automated attack that
reached an 86% hit rate at hijacking the model's responses, could push an
agent into harmful actions, and carried over between different embedding models.
Treat a shared cache as something an attacker can reach.

**The savings are mostly vendor claims.** Figures like "30% or more"
lower token spend for FAQ bots come without published data. How much you
save depends on how repetitive your real traffic is. Only questions that
recur within the expiry window can hit.

**It doesn't fit everything.** It suits questions with one stable
answer. Be careful with anything personal, time-sensitive, or that depends
on earlier turns in a conversation: the lookup only compares questions, so
anything else that should change the answer has to be a filter label or a
reason to skip the cache.

## What this means when you build

- Start with high-traffic, single-answer questions: FAQ bots, help desks,
  internal knowledge assistants.
- Filter by tenant, locale and model or prompt version inside the search,
  and set an expiry on every entry.
- Build a small labeled set of question pairs (same answer / different
  answer) and measure the wrong-hit rate at your threshold before
  shipping, like any other [[evals|eval]].
- Log cache hits with the matched question, so you can review what got
  served.
- Keep users' caches apart when answers could be sensitive, and assume the
  cache can be poisoned.

## Further reading

- [Redis semantic cache](https://redis.io/docs/latest/develop/use-cases/semantic-cache/),
  Redis docs. A practical design: embeddings, a distance threshold,
  metadata filters and expiry in one lookup.
- [vCache: Verified Semantic Prompt Caching](https://arxiv.org/abs/2502.03771),
  Schroeder et al., ICLR 2026. Why one fixed threshold gives unpredictable
  errors, and per-entry thresholds with an error bound.
- [From Similarity to Vulnerability: Key Collision Attack on LLM Semantic Caching](https://arxiv.org/abs/2601.23088),
  Zhang et al., ICML 2026. The security side: why a cache built for
  similar-question hits is easy to hijack.
