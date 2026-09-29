---
id: routing
title: What is routing?
depth: deep
phase: 3
note: >-
  Classify the input first, then send it to the right prompt, model or path.
needs: [llm-workflows, classification]
leads_to: []
compare_with: [fine-tuning, model-selection]
updated: 2026-09-29
---

# What is routing?

Routing puts a classifier in front of your system. It looks at each input,
decides what kind it is, and sends it down the path built for that kind: a
different prompt, a different model, different tools, or a polite refusal.
It's one of the [[llm-workflows]], and it's how one product handles very
different requests without one giant prompt that's mediocre at all of
them.

## One question, several possible paths

Picture a docs assistant for a learning site. People ask it:

- "What is a KV cache?" (explain one concept)
- "Reranking vs hybrid search?" (compare two)
- "How do I build a RAG chatbot?" (a build plan)
- "What's a good pizza place?" (off-topic)

Each wants a different answer. An explanation needs one article. A
comparison needs two, side by side. A build plan needs a sequence of
concepts. Off-topic needs a short "that's not what I'm for".

You could write one prompt that handles all four. The trouble is that
tuning it for one kind of question tends to hurt the others. Routing
splits the problem:

1. A router call reads the question and returns one label from a fixed
   list. That step is [[classification]].
2. Code looks up the label and runs the matching path, each with its own
   prompt, retrieval and output format.

![A router in front of four paths. The question goes to the router, which returns one label. Code maps the label to a path: explain (one article), compare (two articles), build plan (a route through concepts), off-topic (a short refusal). A fifth arrow, dashed, goes to a default path when the label is unknown or the router isn't confident.](img/routing-router.svg)

Each path can now be tuned and tested on its own. That's the main win:
separation of concerns.

Routing fits when the categories are distinct, are better handled
separately, and the classification itself can be done accurately. If the
router is often wrong, the specialist behind it answers the wrong
question, and it does so confidently.

## Three ways to build the router

**An LLM call.** The simplest router is a prompt: here are the categories
with a line each, here's the input, give your reasoning, then one label.
Anthropic's ticket-routing guide does exactly this with its fastest,
cheapest model (Claude Haiku 4.5 as of 2026-09), and points to a larger
model only for many categories or subtle ones. An LLM router is a good
choice when you have few labeled examples (a few dozen can be enough),
when the categories will change, and when the input is messy free text.

**Nearest examples in embedding space.** You describe each route with a
handful of example phrases, embed them once, and at query time embed the
input and pick the route whose examples are closest. That's
[[semantic-search]] used as a classifier, with no LLM call at all. The
semantic-router library works this way, and returns nothing when no route
is close enough, which gives you an off-topic signal for free. It trades
some understanding for speed and cost, and the thresholds need tuning on
labeled data.

**A trained classifier.** A small model trained on your own labeled
inputs. This takes data up front but is cheap and fast per call. The
honest comparison of a fine-tuned small classifier against an LLM router,
on cost and accuracy, is something you'll have to run yourself: we found
no published head-to-head.

## Routing by kind vs routing by difficulty

There are two quite different reasons to route.

**By kind of task**, as above: refunds to one process, technical questions
to another. The paths differ in prompt, data and tools.

**By difficulty**, to save money: easy questions to a small cheap model,
hard ones to a big expensive one. The path is the same; only the model
changes. See [[model-selection]].

RouteLLM (2024) studied the second kind. It trained routers to choose
between GPT-4 and Mixtral-8x7B for each query, using human preference
votes. A threshold sets how often the strong model gets called. On MT
Bench, the best router reached 95% of GPT-4's score while sending only
about 13% of questions to GPT-4. A router that picked at random needed
about 49% to get there. Measured that way (GPT-4 calls needed by a random
split over GPT-4 calls needed by the router, at the same quality), its
best routers cut cost 3.66x on MT Bench, 1.41x on MMLU and 1.49x on
GSM8K.

![Bar chart of cost savings from RouteLLM's best routers, counted as how many fewer GPT-4 calls they needed than a random split to reach the same quality. MT Bench 3.66 times cheaper at 95% of GPT-4's score. GSM8K 1.49 times at 87%. MMLU 1.41 times at 92%, but only after adding about 1,500 labeled MMLU examples: routers trained only on chat preference data did no better than random on MMLU.](img/routing-routellm.svg)

The router itself is cheap to run. The fastest RouteLLM router handled
about 155 requests a second on one small GPU, at about $3.32 per million
requests. In the same paper, GPT-4 was estimated at $24.70 per million
tokens.

## When there are many categories

A single router with a long list of categories gets harder to prompt:
each category needs its own examples, and the prompt grows. Two fixes
from the ticket-routing guide:

- **A hierarchy.** For 20 or more intents, route in stages: a first
  classifier picks "technical", "billing" or "general", and each has its
  own sub-classifier. It's more accurate and more specific, but each level
  is another call, so it's slower.
- **Retrieved examples.** Instead of fixed examples in the prompt, fetch
  the labeled examples most similar to this input from a vector store and
  put those in the prompt ([[few-shot-prompting]]). Anthropic reports
  this took one classification task from 71% to 93% accuracy.

## Where it gets tricky

**The label might not be one you expect.** Anthropic's cookbook router
asks the model for a label in an XML tag, pulls it out with a regex, and
looks it up in a dictionary of routes. If the model returns anything that
isn't a key, a typo or an extra word, the lookup throws. Nothing handles
it, because the notebook is marked as a demo. In a real router, constrain
the answer to your label list with [[structured-output]] (a tool with an
enum, or a strict schema) and always have a default path. The ticket
guide and the cookbook both parse tags with regex, while Anthropic's
prompting guide now recommends a tool with an enum of labels, or
structured outputs, for classification.

**A router trained on one kind of traffic can fail on another.** RouteLLM's
routers, trained on chat-arena conversations, did no better than random
on MMLU questions, which looked nothing like their training data. About
1,500 labeled MMLU examples (under 2% of the training set) fixed it. If
your users' questions drift, your router's accuracy can drop without any
error message.

**Mistakes are silent.** A misrouted question doesn't crash. It gets a
fluent answer to the wrong question. You only see it if you log the label
with every answer and review them. The categories themselves are the
biggest lever: routing accuracy depends directly on how clearly they're
defined.

**Real inputs don't fit one box.** People ask indirectly ("I've been
waiting two weeks for my package" is an order-status question), mix two
issues in one message, or lead with emotion. The ticket guide's fix is
examples and explicit rules for these cases in the router prompt.

**The router adds latency to every request.** It runs before anything
else, so its time is added to every answer. A small model, an embedding
router, or a trained classifier keeps that low. A hierarchy of routers
adds a call per level.

**Routing between models ties you to their prices and quality.** The
RouteLLM numbers are GPT-4 versus Mixtral from 2024. The gap between cheap
and expensive models changes with every release, so re-measure the
savings when either model changes.

## What this means when you build

- Write each category down with a one-line definition and a few real
  examples. Add an "other" or "off-topic" category.
- Build a labeled set of real inputs before you tune the router, and
  track accuracy per category. The ticket guide's general targets are
  90% to 95% routing accuracy and under 10% rerouting.
- Constrain the router's output to your labels, and send anything else to
  a default path.
- Start with a small, fast LLM as the router. Try an embedding router if
  cost or latency matters more than subtle distinctions.
- Log the chosen route with every answer, and review misroutes. They're
  your next eval cases.
- Measure what the router adds in latency, and what it saves by sending
  work to cheaper paths.

## Further reading

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents),
  Erik Schluntz and Barry Zhang (Anthropic), 2024. Routing as a workflow
  pattern: when it fits, and routing by kind vs by difficulty.
- [Ticket routing](https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing),
  Anthropic docs. A full worked router: when an LLM beats trained ML,
  success criteria, hierarchies for many intents, and common misroutes.
- [RouteLLM: Learning to Route LLMs with Preference Data](https://arxiv.org/abs/2406.18665),
  Isaac Ong et al., 2024. Routing between a strong and a weak model to
  save money, with the cost of the router itself.
- [Basic Multi-LLM Workflows](https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/basic_workflows.ipynb),
  Anthropic cookbook, 2025. A minimal `route()` function, and a good
  example of what a production router needs on top.
- [Semantic Router](https://github.com/aurelio-labs/semantic-router),
  Aurelio AI. Routing by nearest example phrases in embedding space, with
  no LLM call.
- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices),
  Anthropic docs, current as of 2026-09. Why a classification step should
  return a label through a tool enum or structured output, not free text.
