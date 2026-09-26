---
id: few-shot-prompting
title: What is few-shot prompting?
depth: deep
phase: 1
note: >-
  Putting worked examples in the prompt so the model copies the pattern.
needs: [chat-api]
leads_to: []
compare_with: [fine-tuning]
updated: 2026-09-23
---

# What is few-shot prompting?

Few-shot prompting means showing the model a few worked examples of the task
before giving it the real one. No training happens and no weights change.
The model reads the examples and continues the pattern. It's one of the
most reliable ways to pin down an output format, and it has a few traps
worth knowing before you rely on it.

## Showing beats telling

Say you're sorting support tickets into `billing`, `bug` or `account`. You
could write a paragraph describing each label. Or you could show three
tickets with their answers and then ask about the fourth.

In a [[chat-api]] call, one easy way is to write the examples as earlier
turns of the conversation, with `assistant` replies you wrote yourself:

```json
"messages": [
  {"role": "user", "content": "I was charged twice this month."},
  {"role": "assistant", "content": "billing"},
  {"role": "user", "content": "The export button does nothing."},
  {"role": "assistant", "content": "bug"},
  {"role": "user", "content": "How do I change my login email?"},
  {"role": "assistant", "content": "account"},
  {"role": "user", "content": "The app crashes when I upload a PNG."}
]
```

The model sees a conversation where it has always answered with one
lowercase word, and it keeps doing that. The other common way is to put the
examples inside the system prompt, wrapped in tags like `<example>` so the
model can tell them apart from your instructions (see [[xml-tags]]).

![A few-shot prompt drawn as a stack: an instruction to sort tickets into billing, bug or account, then three example tickets each followed by its one-word answer, then the real ticket with an empty answer and a question mark. Arrows run from the three example answers to the empty one, labelled: format, labels and length are copied from here.](img/few-shot-prompting-prompt-stack.svg)

## Where the name comes from

The term comes from the GPT-3 paper (2020). OpenAI showed that a 175-billion
parameter model could do new tasks from text alone, with no weight updates.
The paper named three setups:

| Setup | What's in the prompt |
|---|---|
| Zero-shot | Just the instruction |
| One-shot | Instruction plus one example |
| Few-shot | Instruction plus K examples |

K was usually 10 to 100, simply because that's what fit in GPT-3's
2,048-token [[context-window]]. With few-shot examples alone, GPT-3 got
100% on two-digit addition. The paper called this **in-context learning**:
the "learning" happens inside one pass over the prompt, while the weights
stay frozen. Bigger models got more out of the same examples.

The authors were careful with the word "learning". They left open whether
the model learns a new task at that moment or recognizes a pattern it saw
in training. That question turns out to matter.

## What the examples actually teach

You'd expect the model to learn the task from the correct answers in the
examples. A 2022 study tested that directly, and the result is surprising.

The researchers took few-shot prompts for classification and
multiple-choice tasks and replaced the correct labels with random ones. A
review marked "positive" might now say "negative". Across 12 models up to
GPT-3, accuracy dropped by only 0 to 5 percentage points. Examples with
random labels still beat no examples at all.

So what were the examples doing? Three things:

1. **Showing the set of possible answers.** The model learns the answer is
   one of `billing`, `bug` or `account`, not a sentence.
2. **Showing what inputs look like.** Short tickets, not essays.
3. **Showing the format.** Even random English words as labels worked much
   better than no labels, because the shape of input-then-answer was still
   there.

The model mostly already knew how to do the task. The examples told it
*which* task and *what shape* of answer you wanted.

![Three bars, drawn as an illustrative shape rather than data: no examples is clearly lowest, while examples with correct labels and examples with random labels are almost the same height. A note gives the measured result: across 12 models up to GPT-3, random labels cost only 0 to 5 points, 2.6 on average for classification and 1.7 for multiple choice.](img/few-shot-prompting-random-labels.svg)

There are limits. On one dataset the gap reached almost 14 points, later
work found that deliberately flipped labels do hurt, and the study only
covered classification and multiple choice. Don't take this as "correctness
doesn't matter". Take it as "format and coverage are what the model picks up
first".

## Order and balance can swing results

The same examples in a different order can give very different results. On
GPT-3-era models, this was dramatic. A 2021 study took four sentiment
examples and tried every ordering. On a 2.7B GPT-3 model, accuracy ranged
from 54.3% (close to a coin flip) to 93.4%, with nothing changed but the
order. Adding more examples, up to 16, didn't make the spread go away.
Neither did bigger models.

The cause is three biases:

- **Majority label bias.** The model leans toward whatever answer appears
  most often in the examples. Three `billing` examples and one `bug` push
  answers toward `billing`.
- **Recency bias.** It leans toward the answers near the end. Examples
  ordered positive, positive, positive, negative led to nearly 90%
  "negative" predictions, even though three of four examples were positive.
- **Common token bias.** It leans toward answers that are common in its
  training data, such as a well-known place name instead of a rare correct
  one.

The paper's fix, called calibration, measures how the model leans on an
empty input like "N/A" and corrects for it. It needs the model's
probability for each label. The biases are the more useful lesson: balance
your labels and don't end on a run of the same answer.

## From a few examples to thousands

With million-token context windows, "few" became optional. A 2024 Google
DeepMind study put hundreds or thousands of examples into Gemini 1.5 Pro's
prompt, up to 8,192 examples and 1M tokens, across translation,
summarization, math, planning and sentiment tasks. Results were much better
than with a few examples, and the best scores often came only at hundreds
of thousands of tokens.

Two findings stand out:

- **Enough examples can override what the model believes.** With a few
  examples, the model sticks to what it learned in training. When the
  sentiment labels were deliberately rotated, few-shot accuracy was poor.
  With many examples, accuracy on the rotated labels climbed close to
  normal. This is where the "random labels barely matter" result stops
  holding: at scale, the labels do teach.
- **It gets close to [[fine-tuning]] on some tasks.** On translation into
  low-resource languages with 250 and 997 examples, many-shot prompting
  roughly matched fine-tuning for Bemba, with fine-tuning slightly ahead for
  Kurdish.

The trade-off is cost. Fine-tuning pays once, up front, for training.
Many-shot prompting pays on every call, and inference cost grows linearly
with the number of examples. Caching the repeated prompt prefix helps (see
[[kv-cache]]), but every example is still tokens you pay for (see
[[token-pricing]]).

More isn't always better, either. On the MATH and GPQA benchmarks, results
dropped after about 125 examples. And order still mattered at 50
examples: ten shuffles of the same set gave clearly different results.

## Reasoning models may not need examples

Everything above was measured on models that answer right away. As of
2026-09, the vendor advice for [[reasoning-models]], which think before
answering, points in a different direction:

- OpenAI's guide for its o-series models says they often don't need
  examples. Try the prompt without any first, and add them only if the
  output isn't what you need. If you do add examples, they must match your
  instructions closely, because a mismatch can give poor results.
- Anthropic's guide for current Claude models still calls examples one of
  the most reliable ways to steer format, tone and structure, and suggests
  3 to 5. For models that think, it suggests putting the reasoning inside
  `<thinking>` tags in the examples, so the model copies the style of
  reasoning too (related: [[chain-of-thought]]).

These fit together better than they seem. Both treat examples as a way to
pin down format and style. Neither says examples make a strong model
smarter.

## Where it gets tricky

**The model copies more than you meant.** If every example is short, answers
get short. If every example mentions a price, answers may invent one. The
model picks up whatever patterns the examples share, wanted or not. That's
why the advice is to make examples diverse and cover edge cases, so the
only thing they have in common is the thing you want copied.

**Nobody agrees on how many.** Anthropic suggests 3 to 5. GPT-3 used 10 to
100 because that's what fit. The many-shot study kept improving into the
hundreds and thousands, and then some tasks got worse. OpenAI says try zero
for reasoning models. The honest answer is that it depends on the model and
task, and you find out by testing.

**Most of the evidence is old.** The random-label and ordering studies ran
on GPT-3-era models from 2021 and 2022, before instruction tuning and
reasoning were standard. The many-shot study used a 2024 Gemini model. Newer
models may be less fragile, but none of these sources measured it. The vendor advice for 2026 models comes without published numbers.

**Examples and instructions can fight.** If your instructions say "reply in
one word" and an example reply is a full sentence, the model has to pick
one. Keep them consistent.

## What this means when you build

- Reach for examples first when the problem is format or style: a fixed
  label set, a JSON shape, a tone.
- Balance the labels across examples, vary the inputs, and shuffle the
  order. Don't end on a run of one answer.
- Keep examples consistent with your instructions, and mark them clearly
  as examples.
- For reasoning models, start with no examples and add them only if the
  output needs it.
- Many examples can approach fine-tuning, but you pay for them on every
  call. If the example set grows large and stable, compare the cost with
  [[fine-tuning]].
- Test example choice and order on an eval set. Don't trust one lucky run.

## Further reading

- [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165),
  Brown et al. (OpenAI), 2020. The GPT-3 paper that named zero-, one- and
  few-shot and in-context learning.
- [Rethinking the Role of Demonstrations](https://arxiv.org/abs/2202.12837),
  Min et al., 2022. The random-labels experiment, and what examples really
  teach.
- [Calibrate Before Use](https://arxiv.org/abs/2102.09690), Zhao et al.,
  2021. Why example order and label balance swung GPT-3's accuracy, and the
  three biases behind it.
- [Many-Shot In-Context Learning](https://arxiv.org/abs/2404.11018),
  Agarwal et al. (Google DeepMind), 2024. Hundreds to thousands of examples,
  overriding the model's priors, and the comparison with fine-tuning.
- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices),
  Anthropic docs. Current advice on how many examples, how to vary them, and
  examples with thinking.
- [Reasoning best practices](https://developers.openai.com/api/docs/guides/reasoning-best-practices),
  OpenAI docs. Why reasoning models often don't need examples, and what to do
  if you add them.
