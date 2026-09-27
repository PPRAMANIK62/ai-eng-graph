---
id: saying-i-dont-know
title: How does a system say it doesn't know?
depth: deep
phase: 2
note: >-
  Deciding when the system doesn't have the answer, from retrieval scores or the model's judgment, and saying so.
needs: [grounding, logprobs]
leads_to: []
compare_with: []
updated: 2026-09-27
---

# How does a system say it doesn't know?

A question-answering system will get questions it can't answer: the
knowledge base doesn't cover them, or search didn't find the right page.
The honest move is to say so. That takes two decisions: noticing that the
retrieved text isn't enough, and telling the user in a way that helps.
Neither happens by default.

## Start with a question your documents don't cover

Your docs chatbot knows your product's manual. A user asks, "Does the app
work offline?" The manual never mentions offline mode.

Here's what happens in a typical [[rag]] pipeline. Search takes the top
five chunks most similar to the question. It always returns five, because
"top five" has no notion of "none of these are any good". So the model
gets five chunks about sync settings, caching and network errors. They're
close in topic and don't answer the question.

Now the model has two options. It can say the manual doesn't cover
offline use. Or it can piece together something plausible from the
caching chunk and answer "Yes, recently viewed pages are available
offline." The second answer looks [[grounding|grounded]], since it cites real text, and
it's made up.

## Retrieved text makes models answer more, not less

You'd hope a model that's told to use only the documents would notice
they don't answer the question. Often it doesn't. There's a general
reason for that, covered in [[hallucination]]: training and benchmarks
reward a guess over "I don't know". Retrieval adds a specific one.

A Google study (2024) labeled each question by whether the retrieved text
was actually enough to answer it, which they called "sufficient context",
then watched what models did. The big models of the time (Gemini 1.5 Pro,
GPT-4o, Claude 3.5) answered well when the context was sufficient. When it
wasn't, they often gave a wrong answer instead of abstaining.

Worse, adding retrieved text made them abstain less. On one dataset,
Claude 3.5 Sonnet declined 84.1% of questions it was asked without any
documents, and only 52% once retrieved documents were added. Gemini 1.5
Pro went from 100% to 18.6%. Some of that is good, because the documents
did help it answer more questions correctly. The likely reason for the
rest is that any context makes a model more confident, including context
that doesn't contain the answer.

So you can't leave the decision entirely to the model's good sense. You
need signals.

## Signal 1: the retrieval score

The cheapest signal comes before the model runs. Every search returns a
score with each result. If even the best one is low, there's probably
nothing relevant, and you can answer "I couldn't find that in the docs"
without calling the model at all.

The catch is that raw scores don't mean much on their own. Take a
[[reranking|reranker]]'s relevance score. Cohere's reranker, for example,
gives scores between 0 and 1, but they depend on the query. You can't
read them as ratios (a score twice as high isn't twice as relevant), and
the same number can mean different things for different questions. So
you calibrate. Cohere's suggested method:

1. Pick 30 to 50 real queries from your domain.
2. For each, find a document that's only borderline relevant.
3. Score all the pairs.
4. Use their average as a starting threshold for "not relevant".

A threshold like this is good at catching questions that are clearly off
topic. It's bad at the offline example, where the chunks are on topic and
score well but still don't hold the answer. Similar isn't the same as
sufficient.

## Signal 2: ask the model

The second signal is the model's own judgment, which can tell "about the
same topic" from "answers the question".

**In the prompt.** Give the model explicit permission to say it doesn't
know, and give it the exact words: "If the documents don't contain the
answer, say 'I don't have enough information to answer that.'" For long
documents, have it pull out relevant quotes first, with a fixed phrase for
the empty case like "No relevant quotes found." A fixed phrase is easy for
your code to detect and turn into a proper UI state.

**As a separate check.** Ask a yes/no question before answering: does
this text contain what's needed to answer this question? If your API
returns [[logprobs]], the probability of "yes" becomes a confidence score
you can set a threshold on.

Be careful with that confidence. In an OpenAI example that did exactly
this over an article about Ada Lovelace, the model was 99.14% sure the
article didn't answer one partly covered question, and 99.59% sure it did
answer another partly covered one. Confidence tells you how sure the
model is of its yes or no, not whether the yes or no is right. Check any
such threshold against your own labeled examples before trusting it.

## Signal 3: combine them, and pick a dial setting

The Google study's fix was to combine two signals: an automatic "is the
context sufficient?" label, and the model's own confidence in its answer.
They fed both into a small logistic regression that predicts whether the
answer will be wrong, and the system abstains when that prediction crosses
a threshold. On the questions the system still answered, this improved
correctness by 2 to 10%, and it beat using the model's confidence alone.

The important idea is the threshold. It's a dial between two numbers:

- **Coverage.** The share of questions the system answers.
- **Accuracy on answered questions.** How often those answers are right.

Turn the dial toward caution and it answers fewer questions, with more of
them right. Turn it the other way and it answers more, with more wrong.
There's no correct setting in general. A medical or legal tool should sit
near the cautious end; a brainstorming tool can answer almost everything.

![A question goes through three checks. First, the retrieval score: if the best result is below a threshold calibrated on borderline examples, the system says it couldn't find anything, without calling the model. Second, a sufficiency check: the model or a classifier judges whether the retrieved text answers the question. Third, the model's confidence. The last two are combined into one score, and a threshold on it decides between answering with citations and saying it doesn't know. A side panel shows the threshold as a dial: stricter means fewer questions answered with more of them right; looser means more questions answered with more wrong. The curve is an illustrative shape, not data.](img/saying-i-dont-know-checks.svg)

## Saying it well

Detecting the gap is half the work. The other half is the message.

**Say it first.** In a 2026 usability study of site chatbots, one bot
couldn't search for rental cars, but instead of saying so it gave a long
explanation of how to search the site. The user mistook it for a request
for more details, typed them in, and got the same kind of answer again
before realizing the bot couldn't help. Another bot opened with "I can't
rank listings" and put a useful alternative in the second paragraph. The
user read the first sentence and stopped.

**Don't pad it.** A reply that amounts to "sorry, I can't help with that"
should be short. Long explanations around a no waste the user's time.

**Offer what you can do, in the first lines.** If the system can do
something nearby (filter instead of rank, point to a related page), put it
right after the "no", not below it.

**Be specific about what's missing.** "I couldn't find this in the
product manual" is more useful than "I don't know", because it tells the
user where the system looked and that another source might have the
answer.

## Where it gets tricky

**Not enough context doesn't mean a wrong answer.** In the Google study,
models still answered 35 to 62% of questions correctly when the context
wasn't sufficient: a yes/no guess that happened to be right, a fragment
of context plus what the model already knew, or a fact it knew from
training. Refusing every time the context falls short throws
those away. That's why the combined signal worked better than a hard
filter.

**Confident isn't correct.** Logprob confidence and self-rated confidence
measure the model's certainty, which can be high and wrong, as the
99.59% example shows.

**Thresholds don't travel.** Scores depend on the query even within one
reranker, so a threshold is only as good as the examples you tuned it on.
Re-check it when the model, the documents or the kind of questions
change.

**Training it in doesn't fully work.** The same study fine-tuned models
with "I don't know" as the answer on some training examples. They
abstained more, but still gave wrong answers more often than they
abstained.

**Too cautious is also a failure.** A system that says "I don't know" to
everything never makes things up and is useless. In the usability study
above, users were let down when a bot sent them to other pages instead
of answering. The goal is to answer
when you can and decline when you can't, and you have to measure both.

## What this means when you build

- **Give the model the words.** A fixed "I don't have enough information"
  phrase in the prompt, which your code can detect.
- **Add a cheap gate before the model.** If the best retrieval or rerank
  score is below a calibrated threshold, skip generation and say nothing
  was found.
- **Add a sufficiency check for the rest.** A yes/no "does this text
  answer the question?" catches on-topic chunks that don't hold the answer.
- **Tune the threshold on labeled questions,** including ones your docs
  can't answer. Pick your spot on the coverage vs accuracy dial on
  purpose.
- **Score "I don't know" separately in [[evals]].** Track right, wrong and
  abstained as three numbers. If abstaining scores the same as a wrong
  answer, you'll tune the system toward guessing.
- **Put the "no" in the first sentence,** and what the system can do
  instead right after it.

## Further reading

- [Sufficient Context: A New Lens on Retrieval Augmented Generation Systems](https://arxiv.org/abs/2411.06037),
  Joren et al. (Google), 2024. How models behave when retrieved text isn't
  enough, and the combined-signal method for deciding when to abstain.
- [Best Practices for using Rerank](https://docs.cohere.com/docs/reranking-best-practices),
  Cohere, undated (checked 2026-09-27). Why rerank scores need a
  calibrated threshold, and a concrete way to set one.
- [Using logprobs](https://developers.openai.com/cookbook/examples/using_logprobs),
  Hills and Anadkat (OpenAI), 2023. A yes/no "is there enough context?"
  check with logprob confidence, and where it fails.
- [Reduce hallucinations](https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations),
  Anthropic, undated (checked 2026-09-27). Prompt wording for permission
  to say "I don't know" and for the no-quotes case.
- [Less Chat, More Answer](https://www.nngroup.com/articles/less-chat-more-answer/),
  Rosala, Kenderova and Kohler (Nielsen Norman Group), 2026. What users
  need when a chatbot can't help.
