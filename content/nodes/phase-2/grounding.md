---
id: grounding
title: What is grounding?
depth: deep
phase: 2
note: >-
  Answering only from the given sources, and nothing the model remembers.
needs: [rag, hallucination]
leads_to: [citations, saying-i-dont-know]
compare_with: []
updated: 2026-09-27
---

# What is grounding?

Grounding means the model answers only from the sources you hand it, not
from what it remembers. It's the main defence against
[[hallucination|made-up answers]] in a [[rag]] system, and it's something
you can check claim by claim. This article covers the two ways to get it
(the prompt and the API) and how people measure it.

## Start with one answer

Say your support bot retrieves one paragraph from the refund policy:
"Refunds are available within 30 days of purchase. Opened software is not
refundable." A user asks: "I bought a game 45 days ago and never opened it.
Can I get a refund?"

An ungrounded answer might say "Yes, most stores allow refunds on unopened
items." That sounds reasonable, and it comes from the model's general
sense of how stores work. It's also wrong for your shop.

A grounded answer says no, because the purchase is past the 30-day window,
and it can point to the sentence that says so. Every claim in it traces
back to the paragraph you retrieved. Nothing comes from memory.

That's the whole idea. The model still does the reading and the writing,
but the facts have to come from the page in front of it.

## Grounded is a property of each claim

It helps to think of an answer as a list of claims, and to ask of each
one: is this supported by the sources?

- **Supported.** The source says it, or it follows directly. "Your
  purchase is past the 30-day refund window."
- **Unsupported.** It might be true, but the source doesn't say it. "Most
  stores allow refunds on unopened items."
- **Contradicted.** The source says the opposite.

An answer is grounded when every claim is in the first group. FACTS
Grounding, a 2024 benchmark from Google DeepMind, uses exactly this test:
a response passes only if it's fully grounded in the provided document,
with nothing made up.

There's a catch. The easiest way to be fully grounded is to say almost
nothing, or to paste the source back. So good definitions add a second
test: the answer also has to address what the user asked. FACTS
Grounding checks that first, and throws out answers that don't
sufficiently address the request, before it looks at grounding at all.
A factually correct answer that dodges the question still fails.

## The prompt-level way

The simplest way to ground a model is to tell it to. On any chat model
you can do four things in the prompt.

1. **Restrict it to the documents.** Say explicitly that it should use only
   the provided documents and not its general knowledge.
2. **Quotes first.** For long documents (over about 20k tokens), have it
   pull out word-for-word quotes that matter for the question, then answer
   only from those quotes. Give it a fixed phrase for the empty case, such
   as "No relevant quotes found."
3. **Check each claim afterwards.** Ask it to find a supporting quote for
   every claim it made, and to remove any claim it can't back. One useful
   trick is to mark where a claim was removed, with empty brackets, so you
   can see what went.
4. **Let it say it doesn't know.** Give it permission, and a phrase to use,
   for when the documents don't cover the question. That decision has its
   own article: [[saying-i-dont-know]].

These moves reduce made-up claims a lot, but they're instructions, not
guarantees. The model can still quote something that isn't in the
document, or cite a passage that doesn't support the claim next to it.

## The API-level way

Some APIs now do the grounding bookkeeping for you. Anthropic's citations
feature (launched 2025, available on all current Claude models) is a
clear example of how it works.

You pass your documents as document blocks and switch citations on. The
API splits each document into sentences, which become the smallest thing
the model can cite. The answer comes back as a series of text blocks, and
each block that makes a claim carries a list of citations: which document,
which character range (or page range for a PDF), and the exact cited text.

Two things change compared with asking for quotes in the prompt. The
pointers are guaranteed to point at real text in your documents, because
the API extracts the cited text itself rather than trusting the model to
copy it. And that cited text isn't billed as output tokens.

There are numbers, but they're vendor claims: in Anthropic's internal
tests, built-in citations beat most custom setups by up to 15% on recall
accuracy, and one customer reported source hallucinations and formatting
issues going from 10% to 0%. Neither was measured independently.

A valid pointer isn't the same as a supporting one. The API guarantees the
cited sentence exists; it doesn't guarantee the sentence backs the claim.
How to show citations and what can go wrong with them is in
[[citations]].

## How grounding is measured

If grounding is a property of each claim, you measure it by checking
claims against sources. The ALCE benchmark (Princeton, 2023) made this
concrete with two numbers.

- **Citation recall.** For each sentence in the answer: do the passages it
  cites, taken together, fully support it? Score 1 or 0, then average over
  sentences. A sentence with no citation scores 0.
- **Citation precision.** For each citation: is it needed? A citation is
  irrelevant if it can't support the sentence on its own and removing it
  doesn't hurt the others.

Who decides "supports"? Another model. ALCE used an NLI model (one trained
to tell whether one text entails another), and its scores agreed well with
human judges. FACTS Grounding uses three LLM judges from three companies
(Gemini 1.5 Pro, GPT-4o and Claude 3.5 Sonnet), so no judge grades its own
family's answers alone, and averages their scores.

![One answer split into three sentences, each checked against the passages it cites. The first sentence cites passage 1, which supports it: recall 1. The second cites passages 2 and 3; passage 2 supports it and passage 3, about support hours, adds nothing, so recall is 1 but passage 3 is an irrelevant citation. The third sentence, that most stores accept returns of unopened items, has no citation and comes from the model's memory: recall 0. Citation recall is 2 of 3 sentences, citation precision is 2 of 3 citations.](img/grounding-claim-check.svg)

The results show how far off "fully grounded" still is. On ALCE's ELI5
questions (open "why" and "how" questions), about half of the answers from
the best 2023 models, ChatGPT and GPT-4, weren't fully supported by the
passages they cited. By December 2025, FACTS had grown into a suite of
four factuality benchmarks, with grounding updated to a v2, and no model
scored above 70% overall. That overall score mixes grounding with
answering from memory, web search and images, so it isn't a grounding
number on its own, but it says the problem isn't solved.

## Where it gets tricky

**Grounded isn't the same as true.** A grounded answer is faithful to the
sources. If the refund policy on file is out of date, the grounded answer
is out of date too. Grounding moves the question from "does the model
know?" to "are the right documents in front of it?", which is why
retrieval quality matters so much.

**Grounded isn't the same as useful.** An answer that copies the top
retrieved passage looks perfect on citations. ALCE tried exactly that: it
scored 99.4 on both citation recall and precision, but its answers read
badly and were less correct than ChatGPT's. That's why both benchmarks
check more than support.

**Citing after the fact is weaker.** One tempting shortcut is to let the
model answer from memory, then search for passages that match each
sentence and attach them. ALCE tested this and found citation recall 47%
lower than answering from the retrieved passages in the first place (on
ASQA, 2023 models). The citations have to come from the reading, not be
bolted on.

**The judge is a model too.** An NLI checker can miss partial support,
where a passage backs half a sentence, and then call a useful citation
irrelevant. LLM judges can favor answers from their own model family,
which is why FACTS mixes three. Automatic grounding scores are good
signals, not ground truth.

**Vendor numbers aren't benchmarks.** "Up to 15%" and "10% to 0%" come
from the company selling the feature and one of its customers. They're
worth knowing, not worth quoting as a result.

**Some features don't combine.** On Claude, citations can't be used in the
same request as strict JSON [[structured-output]]; the API returns a 400.

## What this means when you build

- **Tell the model where its facts come from.** "Use only the documents
  below. If they don't answer the question, say so." It's the cheapest
  grounding you'll get.
- **Use the API's citation feature if your provider has one.** You get
  real pointers into your documents instead of parsing quotes out of
  free text.
- **Retrieve first, answer second.** Don't generate an answer and then
  look for sources to attach.
- **Measure it per claim.** In your evals, check whether each sentence is
  supported by what it cites (citation recall) and whether the citations
  are needed (precision). An LLM judge is fine, but check it against a
  few hand-labeled answers first.
- **Also check the answer answers the question.** A grounding score alone
  rewards saying little.
- **Keep the sources current.** Grounding makes the model exactly as right
  as your documents.

## Further reading

- [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations),
  Anthropic, undated (checked 2026-09-27). The prompt-level moves: restrict
  to documents, quotes first, verify and retract.
- [Citations](https://platform.claude.com/docs/en/build-with-claude/citations),
  Anthropic, undated (checked 2026-09-27). How API-level grounding works:
  sentence chunking, the response format, and what it can't do.
- [Introducing Citations on the Anthropic API](https://claude.com/blog/introducing-citations-api),
  Anthropic, 2025. The launch post, with the vendor's "up to 15%" and a
  customer's "10% to 0%".
- [Enabling Large Language Models to Generate Text with Citations](https://arxiv.org/abs/2305.14627),
  Gao, Yen, Yu and Chen (Princeton), 2023. The ALCE benchmark: citation
  recall and precision, and why citing after the fact fails.
- [FACTS Grounding](https://deepmind.google/discover/blog/facts-grounding-a-new-benchmark-for-evaluating-the-factuality-of-large-language-models/),
  Google DeepMind, 2024. A working definition of grounded, and how three
  LLM judges score it.
- [FACTS Benchmark Suite](https://deepmind.google/blog/facts-benchmark-suite-systematically-evaluating-the-factuality-of-large-language-models/),
  Google DeepMind and Kaggle, 2025. Grounding v2 next to memory, search and
  image factuality.
