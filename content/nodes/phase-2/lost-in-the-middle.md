---
id: lost-in-the-middle
title: What is lost in the middle?
depth: short
phase: 2
note: >-
  Models use the start and end of a long prompt better than the middle.
needs: [long-context]
leads_to: []
compare_with: []
updated: 2026-09-27
---

# What is lost in the middle?

Lost in the middle is a position effect: put the one passage that holds the
answer at the start or the end of a long prompt, and a model finds it more
often than when the same passage sits in the middle. It was measured in
2023, and it's one reason [[rag]] systems put their best chunk first.

## The experiment: move one passage, watch accuracy

The setup is simple enough to picture.

1. Take a question from a standard question-answering dataset.
2. Build a prompt with 20 Wikipedia passages. One contains the answer. The
   other 19 were picked by a search system because they look related, but
   don't answer it.
3. Ask the question. Then move the answer passage from slot 1 to slot 2,
   slot 3, and so on to slot 20, and ask again each time.

If the model used its whole input equally, accuracy would be flat. It
wasn't. It traced a U: highest with the answer first or last, and lowest
in between.

![An illustrative U-shaped curve of accuracy against the position of the answer passage, from first to twentieth. Accuracy is highest at position 1, dips to its lowest in the middle positions, and rises again at the last position. A dashed horizontal line marks closed-book accuracy, 56.1% for GPT-3.5-Turbo with no passages at all; the bottom of the U falls below it. The shape is illustrative, not data.](img/lost-in-the-middle-u-curve.svg)

The drop was large. For GPT-3.5-Turbo, accuracy fell by more than 20% as
the answer moved away from the edges. In the worst case, with 20 or 30
passages, it did worse than when it got no passages at all and answered
from memory, which scored 56.1%. Handing it the right document, in the
wrong spot, made it worse than handing it nothing.

The study ran it with 10, 20 and 30 passages, on models from OpenAI,
Anthropic and open ones, and on a second, synthetic task: find the value
for one key in a long list of key-value pairs. The middle was usually the
weak spot.

The shape has a name in psychology, the **serial-position effect**: people
also remember the first and last items of a list best.

## Bigger windows and better prompts didn't fix it

**Longer windows didn't help.** The study compared models with their
extended-window versions, like GPT-3.5-Turbo and its 16K variant. When the
prompt fit in both, they scored nearly the same. A bigger window lets you
send more text. It doesn't make the model read it more evenly.

**Instruction tuning isn't the cause.** A base model that only predicts
text, with no assistant training, showed the same U as its tuned version.

**Repeating the question helped only on the easy task.** Putting the
question both before and after the passages fixed the key-value task, but
barely changed the results on real questions.

**More passages stopped paying off.** Going from 20 retrieved passages to
50 gained about 1.5% for GPT-3.5-Turbo and about 1% for Claude 1.3, even
though the search found more right answers with 50. The model wasn't making
use of the extra text.

Not every model showed the U on every task. Claude 1.3 was near perfect on
the key-value task at every length tested.

## Where it gets tricky

**These are 2023 models.** A 2025 study by Chroma tested newer models and
moved a single fact through 11 positions in a long text. It found no clear
position effect on that task. On a different task, spotting one odd word in
a long list of repeated words, accuracy was best when the odd word came
early, more so as the text grew. So position still matters on some tasks
and not on others, and there's no controlled study on 2026 models.

**Position is only one of the things that go wrong.** The same 2025 study
found that length, how similar the question is to the answer, and
look-alike passages all hurt too. Most of that is covered in
[[context-window]]. When a long prompt fails, don't assume position is the
reason.

**It's a reason to send less, not just to reorder.** If the model barely
gains from 50 passages over 20, the fix is often fewer, better passages.
When a whole document goes in instead, as in [[long-context]], you can't
choose where the key sentence lands.

## What this means when you build

- **Put the best chunk first.** If your search ranks results (for example
  with [[reranking]]), keep that order in the prompt.
- **Don't bury what matters.** Instructions and the question go at the
  start or the end, not between documents.
- **Send fewer, better chunks** before sending more.
- **Test your own model.** Move the answer passage through the prompt and
  see if accuracy changes. It's a cheap test, and the result depends on the
  model and the task.

## Further reading

- [Lost in the Middle: How Language Models Use Long Contexts](https://aclanthology.org/2024.tacl-1.9/),
  Liu et al., TACL 2024. The original experiment, the
  U-shaped curve, and what didn't fix it.
- [Context Rot: How Increasing Input Tokens Impacts LLM Performance](https://www.trychroma.com/research/context-rot),
  Chroma, 2025. Newer models: little position effect on one task, some on
  another, and the other things that make long prompts fail.
