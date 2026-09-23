---
id: next-token-prediction
title: What is next-token prediction?
depth: deep
phase: 1
note: >-
  An LLM does one thing: predict the next token, add it to the text, and repeat.
needs: []
leads_to: [llm-use-cases, hallucination, tokenization, logprobs, sampling, pretraining, chain-of-thought, prefill-decode]
compare_with: []
status: review
updated: 2026-09-23
---

# What is next-token prediction?

Every LLM, however clever it seems, does one thing. It looks at some text,
predicts what comes next, adds that piece, and does it again. Once this loop
clicks, a lot of LLM behavior stops being mysterious: why the same prompt
gives different answers, why long answers are slow, and why models sometimes
make things up.

## Start with one sentence

Give a model this text:

> The best thing about AI is its ability to

The model doesn't answer with one word. It gives a probability to *every*
possible next piece of text. For GPT-2, the top five looked like this:

| Next word | Probability |
|---|---|
| learn | 4.5% |
| predict | 3.5% |
| make | 3.2% |
| understand | 3.1% |
| do | 2.9% |

Two things stand out. None of them is likely: the favorite is under 5%. And
all of them are reasonable. The model isn't looking for *the* right answer.
It's ranking plausible ways to continue.

## It predicts tokens, not words

The pieces a model predicts are **tokens**. A token is a chunk of text:
often a whole word, sometimes part of one, sometimes a space or a
punctuation mark. Each model has a fixed list of tokens, its vocabulary.
GPT-3's had 50,257. So "a probability for every possible next piece" means
50,257 numbers, one per token, adding up to 100%.

How text gets cut into tokens is its own topic, covered in
[[tokenization]].

## The loop

Here's what happens each time the model produces one token:

1. **Read everything so far.** The prompt plus every token the model has
   written already go in as one sequence. The model's own output becomes its
   input.
2. **Score every token.** The network ends with one number per token in the
   vocabulary. These raw scores are called **logits**. A high logit means
   "this fits well here".
3. **Turn scores into probabilities.** A function called [[softmax]] makes
   the scores positive and makes them add up to 1.
4. **Pick one.** Usually at random, weighted by the probabilities. More on
   this below and in [[sampling]].
5. **Append it and go again.** The chosen token is added to the text, and
   the whole thing runs again for the next one.

![The generation loop. The text so far, The best thing about AI is its ability to, goes into the model. The model gives a probability to every token in the vocabulary: learn 4.5%, predict 3.5%, make 3.2%, understand 3.1%, do 2.9%. One token, learn, is picked and appended to the text, and the longer text goes back into the model for the next step.](img/next-token-prediction-loop.svg)

An essay, a JSON object and a block of code all come out of this same step,
repeated once per token.

## Why it doesn't always pick the top token

Always taking the most likely token sounds safest. In practice it reads
badly: the text comes out flat and often starts repeating itself word for
word. Picking a less likely token now and then, at random, makes the text
sound far more natural.

That's where variety comes from. The model itself is deterministic: the
same text in gives the same probabilities out. The randomness is in the
pick. That's why the same prompt gives a different answer each time you run
it.

How adventurous the pick is gets controlled by [[temperature]]. Low
temperature sticks close to the top choices. High temperature spreads the
chance out to less likely ones. At a temperature of zero, in theory, the
model always takes the top token.

## Why it needs a model, not a lookup table

Couldn't you just count which word usually follows each phrase in a big
pile of text? The numbers kill that idea fast. Take about 40,000 common
English words. There are 1.6 billion possible two-word pairs and 60 trillion
three-word sequences. No amount of text covers all of those, and real prompts
are hundreds of words long, not three.

So instead of counting, you train a model that has learned the patterns well
enough to give sensible probabilities for text it has never seen.

## How it learns to predict

Training is the same task, used as a practice exercise. Take a real piece of
text, hide the next token, let the model guess, and compare its guess with
what actually came next. Then nudge every one of its parameters slightly so
the right token becomes a bit more likely.

Every position in a text is a practice question at once: predict word 2 from
word 1, word 3 from words 1 and 2, and so on. Repeat that over a huge amount
of text. For GPT-3, reading its training text non-stop would take a person
over 2,600 years. The model gets good at the training text, and also starts
making sensible predictions on text it has never seen.

This stage is called [[pretraining]].

## One simple task goes surprisingly far

Predicting the next token sounds like autocomplete. The surprise of the
last few years is how much ability falls out of it at scale.

GPT-3 (2020) made that clear. It had 175 billion parameters and was trained
on 300 billion tokens. Its creators found you could hand it a task just by
writing it as text to continue. Show it a few worked examples and then a new
case, and it continues the pattern and does the task. No retraining, no
weight changes, just a well-set-up piece of text. This is called
**in-context learning**, and it's the idea behind [[few-shot-prompting]].

With a few examples in the prompt, GPT-3 got 2-digit addition right 100% of
the time and 2-digit subtraction 98.9%. And bigger models made better use of
the examples they were given.

## A chatbot is the same loop

A chat assistant doesn't work differently. Your conversation is laid out as
a script: a user line, an assistant line, another user line, and an empty
assistant turn at the end. The model predicts what the assistant says next,
token by token, and that's the reply you see.

A model straight out of pretraining is good at continuing internet text, not
at being a helpful assistant. Continuing a random web page and answering
your question well are different goals. A second round of training,
[[post-training]], closes that gap. The loop underneath stays exactly the
same.

## Every token costs a full pass

Because output comes one token at a time, every single token needs a full
run through the network. For GPT-3, that's about 175 billion calculations
per token. A 500-token answer is 500 of those runs, one after another.

The model can also only look at a limited amount of text at once, called
its [[context-window]]. GPT-3's was 2,048 tokens.

## Where it gets tricky

**"It only thinks one token ahead" isn't quite right.** The output is one
token at a time, but the model's internal work can reach further. Anthropic
looked inside one of their models while it wrote a rhyming couplet. Before
writing the second line, it had already picked the rhyme it was aiming for,
then wrote the line to land on it. When they removed that planned word from
its internal state, it wrote a different line ending on a different rhyme.
The researchers had set out to show the model *didn't* plan ahead. So the
output is one token at a time, and the thinking behind each token can
already know where the sentence is going. Keep in mind these tools only see
part of what the model computes, so this is strong evidence from a few
cases, not proof of how every answer is produced.

**Is in-context learning real learning?** The name suggests the model learns
a new skill from your examples. The GPT-3 authors were careful not to claim
that. It might be learning, or it might be recognizing a pattern it already
saw in training. That question is still open.

**The model always has to guess.** At every step it must produce *some* next
token, even when it has nothing solid to go on. Nothing in the loop lets it
leave a blank. That's one root of [[hallucination]].

**Would prediction alone keep scaling?** In 2020 the GPT-3 authors doubted
it and expected pure prediction to hit limits. Today's assistants do add
extra training on top, covered in [[post-training]].

**The numbers here are old.** 175 billion parameters, a 50,257-token
vocabulary and a 2,048-token window are GPT-3's, from 2020. The GPT-2 example
is from 2019. The mechanism is the same today. The sizes aren't.

## What this means when you build

- **Expect different answers to the same prompt.** That's the random pick at
  work, not a bug. If your feature needs the exact same answer every time, an
  LLM may be the wrong tool. See [[llm-use-cases]].
- **Long outputs mean many passes.** Each output token is another full pass
  through the model. Pricing for output tokens is covered in
  [[token-pricing]].
- **Your prompt is the start of a document.** The model continues whatever
  text you give it. That's why a few worked examples in the prompt can get it
  to do a task. Anything the model writes, including reasoning before an
  answer, becomes part of the text it reads next. Asking for that on purpose
  is [[chain-of-thought]].
- The probabilities behind each pick have their own article: [[logprobs]].

## Further reading

- [What Is ChatGPT Doing … and Why Does It Work?](https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/),
  Stephen Wolfram, 2023. A long, clear walk through the loop, with the GPT-2
  probability example and the counting argument.
- [Large Language Models explained briefly](https://www.3blue1brown.com/lessons/mini-llm),
  3Blue1Brown, 2024. A short visual intro: probabilities for every word,
  chatbots as scripts, and how training works.
- [Transformers, the tech behind LLMs](https://www.3blue1brown.com/lessons/gpt),
  3Blue1Brown, 2024. Tokens, logits, softmax, temperature and GPT-3's sizes.
- [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165),
  Brown et al. (OpenAI), 2020. The GPT-3 paper, where in-context learning got
  its name.
- [Tracing the thoughts of a large language model](https://www.anthropic.com/research/tracing-thoughts-language-model),
  Anthropic, 2025. A look inside a model, including the rhyme-planning
  experiment.
