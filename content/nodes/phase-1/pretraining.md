---
id: pretraining
title: What is pretraining?
depth: deep
phase: 1
note: >-
  Next-token prediction over a huge pile of text. Where a model's knowledge comes from.
needs: [next-token-prediction]
leads_to: [post-training, hallucination]
compare_with: []
updated: 2026-09-23
---

# What is pretraining?

Pretraining is the first and by far the biggest stage of making an LLM: show a
model a huge amount of text and train it to predict the next token, over and
over. Almost everything a model knows comes from this stage. If you want to
understand why a model knows some things and not others, why its knowledge
stops at a date, and why it can't simply "learn" your company's data, this is
where to look.

## One exercise, repeated trillions of times

The whole of pretraining is one practice exercise. You take a real piece of
text, hide the next token, let the model guess, and check the guess against
what actually came next. Then you nudge every parameter in the model a tiny
bit so the right token becomes more likely next time. That's
[[next-token-prediction]], used as a training signal.

Take this sentence from some web page:

> The capital of France is Paris.

Once it's split into [[tokenization|tokens]], it becomes several practice
questions at once. Predict "capital" from "The". Predict "of" from "The
capital". Predict "Paris" from "The capital of France is". Every position in
every document is a question with a known answer. Nobody has to label
anything, because the text is its own answer key.

Now repeat that over a pile of text so big it's hard to picture. GPT-3 (2020)
was trained on 300 billion tokens. Reading that much text non-stop, day and
night, would take a person over 2,600 years. Done across trillions of
examples, the model gets good at predicting its training text, and also
starts making sensible predictions on text it has never seen.

![The sentence The capital of France is Paris, split into tokens, turns into five practice questions: The predicts capital, The capital predicts of, and so on up to The capital of France is predicts Paris. This repeats at every position in every document; GPT-3 was trained on 300 billion tokens.](img/pretraining-practice-questions.svg)

## Where the text comes from

Most pretraining text is scraped from the public web. The usual starting
point is Common Crawl, an archive of web pages collected in regular
snapshots. Raw web text is messy: menus, ads, duplicated pages,
keyword lists. So a lot of the work goes into cleaning it.

The clearest public account of that cleaning is Hugging Face's FineWeb
dataset (2024). Their pipeline, roughly:

1. **Extract the text.** Pull readable text out of the raw HTML. Their own
   extraction beat Common Crawl's ready-made text files, which kept too much
   boilerplate.
2. **Filter.** Drop URLs on an adult-content blocklist, keep only pages a
   classifier is confident are English, and apply quality and repetition
   rules. From 96 snapshots, that left about 36 trillion tokens.
3. **Remove duplicates.** Deduplicating each snapshot on its own brought it to
   about 20 trillion tokens.
4. **More quality filters.** The final dataset, FineWeb, is 15 trillion
   tokens.

![The FineWeb pipeline as a funnel. 96 Common Crawl snapshots go through text extraction and base filtering to about 36 trillion tokens, per-snapshot deduplication to about 20 trillion, extra filters to FineWeb at 15 trillion, and an educational classifier to FineWeb-Edu at 1.3 trillion.](img/pretraining-fineweb-funnel.svg)

Builders also mix sources on purpose. GPT-3's mix, for example:

| Source | Tokens | Share of training |
|---|---|---|
| Filtered Common Crawl | 410 billion | 60% |
| WebText2 | 19 billion | 22% |
| Books1 | 12 billion | 8% |
| Books2 | 55 billion | 8% |
| Wikipedia | 3 billion | 3% |

The share isn't proportional to size. Sources judged higher quality were
shown more often: GPT-3 saw Wikipedia about 3.4 times over, but less than half
of its Common Crawl data.

## Quality beats quantity, up to a point

What goes into the pile shapes what comes out. FineWeb's team ran a neat
experiment. They had a larger model (Llama-3-70B-Instruct) rate 460,000 web
pages for how educational they were, trained a small classifier on those
ratings, and used it to keep only the educational pages. That left 1.3
trillion tokens, called FineWeb-Edu.

A small model (1.71 billion parameters) trained on this smaller, cleaner set
did clearly better on knowledge and reasoning tests. On MMLU it went from
33% to 37%, and on ARC from 46% to 57%, two common knowledge-and-reasoning
benchmarks. Less text, better chosen, gave a smarter model.

## How big a model, how much text

Pretraining is a budget decision. You have a fixed amount of compute, and you
can spend it on a bigger model or on more text for a smaller one.

In 2022, DeepMind trained over 400 models of different sizes on different
amounts of text to find the best split. Their answer: grow both together. Each
time you double the model size, double the training tokens too. By that rule,
the big models of the time were too big for how little text they saw:

| Model | Parameters | Training tokens |
|---|---|---|
| GPT-3 | 175 billion | 300 billion |
| Gopher | 280 billion | 300 billion |
| Chinchilla | 70 billion | 1.4 trillion |

Chinchilla used the same compute as Gopher but was 4 times smaller and saw
about 4 times more text. It beat Gopher, GPT-3 and several larger models. And
because it was smaller, it was also cheaper to run afterwards, which matters
because every request you send pays for running the model.

## What you get at the end: a base model

The result of pretraining is called a **base model**. It's a very good
document continuer. Give it the start of a web page and it writes a plausible
rest of the page.

That's different from being a helpful assistant. Continuing a random passage
from the internet is a different goal from answering your question well. Ask
a base model a question and it treats your question as the start of a
document to continue, which may or may not turn out to be an answer. A
second round of training, [[post-training]], turns the base model into an
assistant.

Most of what the model knows is already there after pretraining. One striking
piece of evidence: Meta took a 65-billion-parameter base model and fine-tuned
it on just 1,000 carefully picked question-and-answer examples. People rated
its answers as good as or better than GPT-4's in 43% of cases (in a 2023
comparison). A thousand examples can't teach much knowledge. What they
mostly teach is how to present what the model already has.

## Why this explains a lot of model behavior

**Knowledge has a cutoff.** The model knows what was in its training text,
and that text was collected up to some date. GPT-3's web data covered 2016 to
2019. Anything after the crawl isn't in the model unless you put it in the
prompt.

**Common things get more practice than rare ones.** Every appearance of a
fact in the training text is another practice question about it. A topic
that shows up on thousands of pages gets far more practice than one on a
single obscure page. When you ask about something the model barely saw, see
[[hallucination]] for what can go wrong.

**It learned from the internet, flaws included.** The web is full of
low-quality and wrong text. Filtering removes some of it, not all.

**It learns slowly.** Pretraining uses far more text than a person sees in a
lifetime. A few hundred pages of your internal docs are a drop in that
ocean, which is one reason training isn't a practical way to add them.

## Where it gets tricky

**Nobody tells you what's in the pile.** The big labs treat their pretraining
data as a trade secret. Even many "open" models release their weights but
not their training data. So you usually can't check whether a model saw a
particular source.

**Test questions leak into training data.** Benchmarks live on the web, and
the web goes into training. GPT-3's authors tried to remove benchmark
questions from their data, but a bug meant some overlaps stayed in. A model
that scores well on a public benchmark may partly be remembering it.

**Cleaning can backfire.** Removing duplicates sounds like it can only help.
FineWeb's team first deduplicated across all 96 snapshots at once, which
removed up to 90% of the older snapshots. The model trained on the result
didn't improve. When they looked closer, the 10% of old data that survived was
worse than what was removed: more ads and keyword lists. Deduplicating each
snapshot separately worked better.

**The Chinchilla rule is about training cost only.** It tells you the best
model for a fixed training budget. The Chinchilla authors themselves point
out that a smaller model is also cheaper to run afterwards, so the best model
to train isn't automatically the best model to serve.

## What this means when you build

- **Assume a cutoff.** Anything recent, private or niche probably isn't in
  the model, or is in there badly. Put the facts in the prompt instead.
- **Don't expect training on your docs to add knowledge cheaply.** Retraining
  from scratch is out of reach, and small amounts of extra training mostly
  change style. See [[fine-tuning]] for when it's worth it.
- **Treat benchmark scores with care.** Public benchmarks may have leaked
  into the training data. Test on your own examples.
- **Pretraining is why the base model is so capable, and post-training is
  why it's usable.** The next step in the story is [[post-training]].

## Further reading

- [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165),
  Brown et al. (OpenAI), 2020. The GPT-3 paper: training data mix, the 2016–2019
  crawl, and the contamination problem.
- [Large Language Models explained briefly](https://www.3blue1brown.com/lessons/mini-llm),
  3Blue1Brown, 2024. The training loop and the sheer scale of it, in plain
  pictures.
- [The FineWeb Datasets](https://arxiv.org/abs/2406.17557), Penedo et al.
  (Hugging Face), 2024. The most detailed public account of turning the web
  into pretraining data, with experiments for every step.
- [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556),
  Hoffmann et al. (DeepMind), 2022. The Chinchilla paper on splitting a
  budget between model size and data.
- [LIMA: Less Is More for Alignment](https://arxiv.org/abs/2305.11206),
  Zhou et al. (Meta), 2023. Evidence that knowledge comes from pretraining,
  and later stages mostly teach format.
