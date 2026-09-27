---
id: context-window
title: What is the context window?
depth: deep
phase: 1
note: >-
  The most tokens a model can take in and put out in one call, and what happens near the limit.
needs: [tokenization, attention]
leads_to: [chat-api, rag, context-engineering, long-context]
compare_with: []
updated: 2026-09-23
---

# What is the context window?

The context window is the most text a model can work with in one call:
everything you send it plus everything it writes back, counted in tokens.
It sets how big a document you can hand over, how long a conversation can
run, and how long an answer can be. And long before you hit the limit, a
fuller window starts to cost you accuracy, money and time.

## One number covers the question and the answer

Say you paste a 300-page contract into a request and ask for a summary.
Three things have to fit in the window together:

1. Your instructions and the contract.
2. Anything else in the request you didn't type yourself.
3. The summary the model writes.

That third part surprises people. The window isn't just the input limit.
The model's answer is written into the same space, one token at a time, and
each new token is read along with everything before it. So a request that
fills the window with input leaves no room to reply.

The window is measured in tokens, not words or pages. How much text a token
covers depends on the tokenizer and the language, covered in
[[tokenization]]. The same window holds less text in some languages than in
others, and less on a tokenizer that splits text more finely.

The window is also different from what the model learned in training. The
training data is what the model knows. The window is its working memory for
this one call: the only text it can look at while it writes.

![One long bar standing for a 1M-token context window. From left to right: system prompt, tool definitions, earlier turns, the pasted document and the new question make up the input. Then the model's thinking and answer, then room reserved by max_tokens, then unused space. Input and output share the same window.](img/context-window-one-budget.svg)

## What counts toward it

Everything in the request counts. On Claude, as of 2026-09, that's:

- the system prompt
- every message in the conversation, including tool results, images and
  documents
- your tool definitions
- the output for this turn, including any thinking the model does before it
  answers

Thinking is easy to forget. Thinking tokens come out of the same `max_tokens`
budget as the answer, count toward the window, and are billed as output.

Caching doesn't free up space either. Prompt caching changes what you pay
for repeated tokens, not whether they count.

## How big windows have got

Windows have grown fast. GPT-3 (2020) was trained with a context of 2,048
tokens. Early generative models handled about 8,000 tokens at a time, and
newer ones pushed that to 32,000 and then 128,000.

As of 2026-09, many Gemini models take 1 million tokens or more. On the
Claude side, the newer models (Opus 5.5, Sonnet 5, Fable 5.1 and others) have
a 1M-token window and can write up to 128k tokens in a single reply. Other
Claude models, like Sonnet 4.5, have 200k.

To get a feel for 1 million tokens, it's about:

| What | Roughly fits in 1M tokens |
|---|---|
| Code | 50,000 lines at 80 characters per line |
| Novels | 8 average-length English novels |
| Podcasts | transcripts of 200+ average episodes |

Tokens aren't the only limit. A single Claude request can include up to 600
images or PDF pages (100 on 200k models), and a request full of large files
can hit the size limit on the request itself before it hits the token limit.

## A conversation fills the window turn by turn

In a chat, each turn sends the whole history again: every earlier message
and reply, plus the new message. The model's reply then becomes part of the
input for the next turn. Earlier turns are kept in full, so the window fills
up a little more with every exchange. How the history gets sent is covered
in [[chat-api]].

![Four stacked bars, one per call in a chat. Each bar repeats all earlier turns in grey, then adds the new user message and the new reply in colour. The bars get longer each call until the fourth one reaches the dashed context window limit.](img/context-window-turns.svg)

Chat apps and long-running agents need a plan for when the history gets too
long. The main options:

- **Drop the oldest turns.** Chat apps can treat the window as first in,
  first out.
- **Summarize.** Replace old turns with a summary and carry on in a fresh
  window. This is called **compaction**, and some APIs will now do it for
  you on the server.
- **Fetch only what's needed.** Instead of sending everything, look up the
  relevant pieces and send only those.

## What happens when you go over

On Claude there are two cases, and they fail differently:

1. **The input alone is too long.** The request is rejected with a 400 error
   ("prompt is too long"). Nothing gets generated.
2. **The input fits, but the answer runs out of room.** On Claude 4.5 models
   and newer, the API accepts a request even if input plus `max_tokens` is
   bigger than the window. If the answer then hits the limit, it stops early
   with `stop_reason: "model_context_window_exceeded"`. You get a cut-off
   answer, not an error.

The second case is the one to watch. Your code has to check the stop reason,
or it'll treat half an answer as a whole one. To avoid both cases, count the
tokens before you send; providers offer a counting endpoint for this.

## A bigger window isn't a better one

Fitting in the window doesn't mean the model will use everything well. As
the token count grows, accuracy and recall drop. This has a name: **context
rot**.

Here's what the measurements show.

**Models don't treat every token the same.** A 2025 study by Chroma tested 18
models, including GPT-4.1, Claude 4 and Gemini 2.5, on tasks where only the
length of the input changed. Results got less reliable as the input grew,
even on simple tasks like copying out a list of repeated words with one odd
word inserted. The assumption that a model handles the 10,000th token as
reliably as the 100th didn't hold.

**Claimed and usable windows differ.** A 2024 benchmark called RULER tested
17 models that all claimed windows of 32,000 tokens or more. Only half of them
still performed well at 32,000.

**The popular test flatters models.** The usual long-context check is the
"needle in a haystack": hide one fact in a pile of filler text and ask for
it. Models do very well on it, around 99% for a single fact on Gemini. But
it's close to a word-matching lookup. Real tasks are harder:

- Ask for **several facts at once** and accuracy drops.
- Add **distractors**, passages that look like the answer but aren't, and
  even one hurts. Four hurt more, and the damage grows with length.
- Ask the model to **trace or combine** information across the text, and
  models that aced the needle test drop a lot as length grows.

One odd result: in Chroma's tests, models did *better* when the filler text
was shuffled into nonsense than when it read as a coherent document. So
length isn't the only thing that matters. How the text is laid out matters
too.

![An illustrative line chart of accuracy against input length. The needle-in-a-haystack line stays flat near the top. A second line for harder tasks, such as several facts at once or distractors, starts high and slopes down as the input gets longer. The shape is illustrative, not data.](img/context-window-needle-vs-harder.svg)

## Why long context gets harder

Two likely reasons, both from how models are built.

**Pairs grow fast.** Inside the model, [[attention]] lets every token look at
every other token. With n tokens, that's n² pairs. Double the input and there
are four times as many relationships to keep track of. Think of it as an
attention budget that gets spread thinner as the window fills.

**Long inputs are rarer in training.** Models learn how to use context from
their training data, where short sequences are far more common than long
ones. They get less practice at the far end of their window.

The result is a slope, not a cliff. Models stay capable at long lengths but
get less precise. So the goal isn't to fill the window. It's to find the
smallest set of useful tokens that gets the job done.

## Where it gets tricky

**Providers sell big windows and warn about them at the same time.** As of
2026-09, Anthropic bills a full 1M-token Claude request at the same
per-token rate as a small one, and its own docs say more context isn't
automatically better. Both are true. The window is how much you *can* send.
How much you *should* send is a separate question you answer by testing.

**The research models are old.** RULER tested early-2024 models and Chroma
tested 2025 ones. Newer models may do better. None of the sources here test
2026 models, so treat the size of the drop as unknown, and the direction as
well supported.

**You pay for the whole window every call.** A document in the window isn't
stored for free. Each request sends it again, and you pay for those input
tokens every time, unless you use caching. Longer inputs also take longer
before the first token comes back.

**Where you put the question may matter.** Google's advice for Gemini is to
put your question at the end, after the long context. That's one provider's
advice for its own models, not a proven rule for all of them.

## What this means when you build

- **Budget both sides.** Input plus the longest answer you expect (thinking
  included) must fit. Leave room.
- **Count, don't guess.** Count tokens on the model you'll actually use, and
  count the parts you didn't type: tools, images, documents.
- **Check why a response stopped.** A reply cut off by the window looks like
  a normal reply unless you read the stop reason.
- **Plan for long conversations.** Decide early whether you'll drop old
  turns, summarize them, or fetch only what's relevant.
- **Don't dump everything in.** Send the smallest set of text that answers
  the question, and test accuracy at the lengths you'll really use, not on a
  needle test.
- How the conversation is sent on each call is covered in [[chat-api]].

## Further reading

- [Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows),
  Anthropic docs. What counts toward the window, sizes per Claude model, and
  exactly what happens on overflow.
- [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://www.trychroma.com/research/context-rot),
  Chroma, 2025. Tests on 18 models showing accuracy drops with input length,
  and why the needle test misleads.
- [RULER: What's the Real Context Size of Your Long-Context Language Models?](https://arxiv.org/abs/2404.06654),
  Hsieh et al. (NVIDIA), 2024. The claimed-vs-usable window gap, measured.
- [Long context](https://ai.google.dev/gemini-api/docs/long-context),
  Google Gemini API docs, 2026. How windows grew, what 1M tokens holds, and
  the limits of long context.
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents),
  Anthropic, 2025. Why long context degrades, and compaction.
- [Transformers, the tech behind LLMs](https://www.3blue1brown.com/lessons/gpt),
  3Blue1Brown, 2024. Where GPT-3's 2,048-token context fits in the model.
