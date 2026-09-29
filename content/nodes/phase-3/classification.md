---
id: classification
title: How do you classify text with an LLM?
depth: short
phase: 3
note: >-
  Putting each input into one of a fixed set of buckets, with a prompt instead of a trained classifier.
needs: [structured-output]
leads_to: [routing]
compare_with: [fine-tuning]
updated: 2026-09-29
---

# How do you classify text with an LLM?

Classification means putting each input into one of a fixed set of
buckets: which team a support ticket goes to, whether a review is positive,
what kind of question a user is asking. With an LLM you describe the
buckets in a prompt instead of training a model on thousands of labelled
examples. It's the first step of [[routing]], and one of the easiest LLM
features to measure, because every answer is simply right or wrong.

## A prompt instead of a trained model

Take an insurance company's support inbox with ten categories: billing
inquiries, billing disputes, claims assistance, claims disputes, policy
comparisons, and so on. The classic approach is to label a big pile of
tickets and train a classifier. An LLM can start from a few dozen labelled
examples.

It's the better fit when:

- you have little labelled data,
- the categories will change (a new one means editing a prompt, not
  relabelling and retraining),
- the rules depend on meaning ("a complaint about a claim decision is a
  dispute, not a claim"),
- you want a readable reason for each decision,
- tickets come in several languages.

The biggest lever is the category list itself. The model can only route as
well as the categories are defined. Vague or overlapping buckets
(billing inquiry vs billing dispute) are where the errors pile up.

## How accuracy climbs, step by step

Anthropic's classification cookbook builds that insurance classifier on
Claude Haiku 4.5 and measures each step on 68 test tickets:

![Bar chart of accuracy on 68 test tickets with 10 categories, from Anthropic's classification cookbook. Random guessing: about 10%. A prompt with category definitions only: about 70%. Adding the 5 most similar labelled tickets as examples: 94%. Adding step-by-step reasoning before the label: 97%. A separate re-run with Promptfoo gave 70.6%, 94.1% and 95.6% for the same three setups. The ticket-routing guide quotes the retrieval step as 71% to 93%.](img/classification-accuracy.svg)

1. **Guessing at random**: about 10%, as you'd expect with ten buckets.
2. **A prompt with the category definitions**: about 70%. Most errors
   are between similar categories.
3. **Plus examples**: for each new ticket, fetch the five most similar
   labelled tickets (by [[embeddings]] similarity) and put them in the
   prompt as [[few-shot-prompting|few-shot examples]]. 94%.
4. **Plus reasoning**: ask the model to think through the ticket before
   giving the label ([[chain-of-thought]]). 97%.

In this test, the retrieved examples did most of the work: showing the
model how real tickets map to the categories, one close match at a time.

## Getting the label out

The label has to reach your code as one of the allowed values, nothing
else. You'll see three ways:

- **Tags plus a regex.** Ask for the reasoning in `<reasoning>` tags and
  the label in an `<intent>` tag ([[xml-tags]]), then pull them out with a
  regular expression.
- **Prefill and stop.** Start the model's reply with `<category>` and stop
  at `</category>`, so all it writes is the label.
- **An enum in a schema.** List the labels as an enum in a
  [[structured-output]] schema or a tool, and the API can only return one
  of them.

If you want reasoning, put a reasoning field *before* the label field so
the model thinks first.

## Where it gets tricky

**The numbers don't agree, and the test set is small.** The ticket-routing
guide says the retrieved-examples recipe takes accuracy from 71% to 93%.
The cookbook it links reports about 70%, then 94%, then 97% with
reasoning. The same notebook prints 74% for the simple prompt in its own
report, and a separate Promptfoo re-run gave 70.6%, 94.1% and 95.6%. With 68 test
tickets, one ticket is about 1.5 points, so 94% vs 97% is two tickets.
Read these as "examples help a lot, reasoning helps a little", not as
exact figures.

**Regex vs a tool call.** Both official guides parse the label out of
text. If the tag is missing, the regex quietly returns an empty string,
and exact-match scoring counts it as a plain miss. The tool-use docs from
the same provider say that a regex pulling out a decision is a sign it
should have been a tool call (see [[tool-calling]]). An enum schema makes
"no valid label" impossible instead of silent (with some fine print,
covered in [[structured-output]]).

**Many classes.** Past about 20 categories, the prompt and its examples
get unwieldy. A tree of classifiers (first "technical, billing or
general", then a sub-classifier for each) is more accurate but adds a call,
and latency, at every level.

**Is an LLM the right tool at all?** Once you have enough labelled
tickets, would a small classifier fine-tuned on them be cheaper, faster or
more accurate? None of the sources here measure that head to head, so it's
an open question for your data. In this project, the phase 7
build compares a fine-tuned small model with the prompt-based router on
accuracy, cost and latency (see [[fine-tuning]]).

## What this means when you build

- Write the category definitions first, then set a target (see
  [[success-criteria]]).
- Label a test set from real inputs before tuning anything ([[evals]]).
  Report accuracy per category, not just overall.
- Start with definitions only, then add retrieved examples, then
  reasoning. Measure each step, and record cost and latency too.
- Return the label as an enum, not as text you parse.
- Keep the baseline numbers. They're what any later router, including a
  fine-tuned one, has to beat.

## Further reading

- [Classification with Claude](https://platform.claude.com/cookbook/capabilities-classification-guide),
  Garvan Doyle (Anthropic), 2024. The insurance-ticket example with
  accuracy at every step, and the Promptfoo re-run.
- [Ticket routing](https://platform.claude.com/docs/en/about-claude/use-case-guides/ticket-routing),
  Anthropic, undated. When an LLM beats a trained classifier, success
  criteria with target numbers, and hierarchies for many classes.
