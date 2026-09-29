---
id: fine-tuning
title: What is fine-tuning?
depth: deep
phase: 7
note: >-
  Training an existing model further on your own examples. When it beats prompting or retrieval.
needs: [post-training]
leads_to: [lora, distillation]
compare_with: [rag, few-shot-prompting, routing, classification]
updated: 2026-09-29
---

# What is fine-tuning?

Fine-tuning means taking a model that already works and training it a bit
more on your own examples, so its weights change and it gets better at one
job. It's good at teaching a model a shape of answer: a format, a label
set, a style, a narrow decision. It's bad at teaching new facts. As of
2026-09 it's also mostly something you do with open models, because the
big providers have pulled back from offering it.

## One task, three ways to teach it

Say you want a router: for each incoming question, decide whether a small,
cheap model can answer it or whether it needs the big one. The output is
one word, `small` or `large`.

You have three ways to get a model to do this:

1. **Tell it.** Write a [[system-prompt]] that describes what makes a
   question hard, and ask for one word back. Nothing about the model
   changes.
2. **Show it.** Add a few labeled questions to the prompt, which is
   [[few-shot-prompting]]. Still nothing about the model changes, but every
   call now carries the examples, and you pay for them every time.
3. **Train it.** Collect a few thousand questions with the right label,
   and train a model on them. Now the model itself has changed. The prompt
   can shrink to just the question, and a small model may do the job.

The third one is fine-tuning. It's the same thing model makers do in
[[post-training]], when they turn a raw text predictor into an assistant by
training it on example answers. Fine-tuning is that step again, done by
you, on your data, for your task.

## What training on examples actually does

The most common kind is **supervised fine-tuning** (SFT). Each training
example is a pair: a prompt and the completion you want. For the router:

```json
{"prompt": [{"role": "user", "content": "What's 2 + 2?"}],
 "completion": [{"role": "assistant", "content": "small"}]}
```

Training works the same way the model learned language in the first place,
through [[next-token-prediction]]. The model reads the prompt, predicts the
completion one token at a time, and gets penalized for how unlikely it
thought each correct token was. The weights move a little to make the right
tokens more likely next time. Repeat over thousands of examples.

One detail matters: the loss is usually counted only on the completion,
not the prompt. You're teaching the model what to answer, not how to write
questions. The common open-source trainer, Hugging Face's TRL, does this by
default for prompt-completion data.

After training, you have a new set of weights. There are two ways to get
them:

- **Full fine-tuning** updates every weight in the model. It's the
  heaviest option, and you end up with a whole new copy of the model for
  each task.
- **Adapters** leave the original weights alone and train a small add-on
  instead. The most common method is [[lora]]. It's much cheaper, and many
  adapters can share one base model on one server.

## Fine-tuning teaches form, not facts

This is the most important thing to know about fine-tuning, and the most
common way to waste money on it.

In 2023, Anyscale fine-tuned Llama-2 models on three tasks and compared
them with GPT-4:

- **Structured output.** Turn a sentence about a video game into a fixed
  "functional representation" with attributes in the right order. A 13B
  model went from 58% to 98% accuracy. GPT-4 did much worse once attribute
  order was checked.
- **Text to SQL.** Fine-tuned 7B and 13B models beat both the 70B chat
  model and GPT-4.
- **Grade-school math** (GSM8k). The 13B model went from 28% to 47%, after
  two rounds of fine-tuning. Better, but still behind GPT-4.

![Bar chart of Llama-2-13B accuracy before and after full fine-tuning, from Anyscale's 2023 case study. On a structured-output task (ViGGO), accuracy went from 58% to 98%. On grade-school math (GSM8k), it went from 28% to 47%. Fine-tuning closed the gap on the format task and only partly helped on the reasoning task, where the model stayed behind GPT-4.](img/fine-tuning-form-vs-reasoning.svg)

The first two tasks are about the shape of the answer. The model already
knows what a video game is and what SQL looks like; it needs to learn your
exact format. That's what example pairs teach well. The math task needs
reasoning the small model doesn't have. Its 8,000 training examples weren't
enough to put it there, and an extra round on a second, noisier math dataset
only got it part of the way.

Facts are worse still. A 2023 Microsoft study took knowledge-heavy question
sets and compared two ways of giving a model the knowledge: fine-tuning it
on the text, or retrieving the text at question time with [[rag]]. RAG won
every time, both for facts the model had seen during pretraining and for
facts that were new to it. Models struggled to learn new facts from
fine-tuning at all, unless they saw the same fact phrased many different
ways.

So if your problem is "the model doesn't know our product", fine-tuning is
the wrong tool. Put the documents in the prompt. If your problem is "the
model knows enough but won't answer in our format, with our labels, in our
tone", fine-tuning may be the right one.

## Narrow tasks are where it pays

The strongest case for fine-tuning is a narrow, repeated task where a small
model can learn the whole job.

In 2024, Predibase fine-tuned 10 open base models on 31 narrow tasks with
4-bit LoRA, 310 models in all. On average the fine-tuned models beat their
base models by 34 points and GPT-4 by 10 points. They also served 25 of
those adapters on one 80 GB GPU, since the adapters share one copy of the
base model.

A router like the one above is a good example of such a task, and it's
been done. In 2024, Anyscale fine-tuned Llama 3 8B as a
[[classification|classifier]] that sends each query either to Mixtral-8x7B
or to GPT-4. The labels came from GPT-4 grading Mixtral's answers on a 1 to
5 scale, an [[llm-as-judge]] setup, over about 109,000 examples from a
public dataset. Across the routers in the accompanying paper, routing
matched the baselines' quality at up to 70% lower cost on MT Bench, 30% on
MMLU and 40% on GSM8K, and the best of them, this one included, beat two
public routing services. [[routing|Routing]] itself is covered in its own article.

Notice the pattern in both. The task has a small, fixed output space. You
can get or make thousands of labeled examples. And a small fine-tuned model
replaces a big general one, which is where the savings come from.

## Fine-tuning, few-shot prompting and RAG side by side

The three get compared all the time because they overlap. Here's how they
differ:

| | Few-shot prompting | RAG | Fine-tuning |
|---|---|---|---|
| What changes | The prompt | The prompt, per question | The model's weights |
| When you pay | Every call, for the examples | Every call, for search and context | Once for training, then cheaper calls |
| Good for | Format and labels, quick to try | Facts, especially ones that change | Format, style, narrow decisions at scale |
| Bad for | Hundreds of examples, cost at volume | Teaching a behavior | New or changing facts |
| To update it | Edit the prompt | Update the documents | Retrain |

![A decision flow for choosing between prompting, RAG and fine-tuning. Start by measuring the task with evals. If the model is missing facts, use RAG. If the output is wrong in format, labels or style, first try instructions and few-shot examples. If that works, stop. If it still fails, or the prompt got long and costly at high volume, and you have enough good labeled examples, fine-tune. Each path ends in running the evals again.](img/fine-tuning-choose.svg)

They also combine. A fine-tuned model can still take retrieved documents in
its prompt. Fine-tuning teaches it how to use them and how to answer; RAG
supplies what's true today.

Few-shot prompting and fine-tuning sit closest together. Both teach by
example. The difference is where the examples live: in every prompt, paid
for on every call, or baked into the weights, paid for once in training.
How far many examples in a long prompt can go is covered in
[[few-shot-prompting]].

## Where you can fine-tune now

This changed a lot in 2026.

**OpenAI is closing its fine-tuning platform.** From 2026-05-07,
organizations that had never fine-tuned can't start. From 2026-07-02,
organizations that hadn't run a fine-tuned model in the past 60 days lost
access too. From 2027-01-06, nobody can create new fine-tuning jobs.
Fine-tuned models that already exist keep serving until their base model
is retired. OpenAI's deprecations page gives no reason.

**Anthropic fine-tuning is available only on Amazon Bedrock, and only for
Claude 3 Haiku** (as of 2026-09), a model from 2024.

So in practice, fine-tuning today means an open-weights model (see
[[open-vs-closed-models]]), trained with an open library. The usual pair is
TRL for the training loop and PEFT for LoRA adapters. The whole thing can
be this short:

```python
from datasets import load_dataset
from trl import SFTTrainer
from peft import LoraConfig

trainer = SFTTrainer(
    "Qwen/Qwen3-0.6B",
    train_dataset=load_dataset("trl-lib/Capybara", split="train"),
    peft_config=LoraConfig(),
)
trainer.train()
```

That's TRL's own example (version 1.14.0), training a 0.6B model on a
public chat dataset. For your task, you'd swap in your prompt-completion
pairs. Passing a `quantization_config` as well turns this into QLoRA:
the adapter trains on top of a quantized base model (see
[[quantization]]). The result runs
wherever you run open models, including on your own machine (see
[[local-models]]).

## Where it gets tricky

**"Fine-tune it on our docs" usually doesn't work.** It's the most common
request and the one the evidence is clearest against. The model will pick
up the style of your docs, not reliably the facts in them, and it may
answer confidently with the wrong details. That's a road to
[[hallucination]]. Use retrieval for facts.

**The comparisons are old.** Most of the "fine-tuned small model beats
GPT-4" results are from 2023 and 2024, against GPT-4 as it was then.
Frontier models have moved a lot since. The pattern (narrow tasks, small
models, format over facts) has held up. The exact margins won't transfer
to today's models. Measure against the best prompted model you'd actually
use.

**Reasoning doesn't come cheap.** The math result is a warning. If the task
needs the model to think, a few thousand examples of right answers may not
teach it. Newer work gets small models to reason by training them on a big
model's worked solutions, which is [[distillation]], or with reinforcement
learning, which is a different kind of training.

**LoRA or full fine-tuning?** Whether the cheap adapter loses quality
has been argued for years, and the answer shifted in 2025. The details
are in [[lora]].

**Your fine-tune is tied to one base model.** On OpenAI's platform, a
fine-tuned model is served only until its base model is retired. And when
a better base model comes out, you retrain. Keep your dataset and training
script as the real asset, not the weights.

**The provider picture keeps moving.** OpenAI's platform went from open
to closed for new customers on 2026-05-07, with eight months
until the last jobs. Check the current docs before you
plan around a hosted option.

## What this means when you build

- Start with [[evals]] and a prompt. Only reach for fine-tuning when a
  well-built prompt, with examples, still fails your evals or costs too
  much at your volume.
- Use it for form: output format, a fixed label set, a tone, a narrow
  decision like routing. Use [[rag]] for facts.
- Plan for an open model, TRL and LoRA. Hosted fine-tuning is shrinking.
- Your training data is the product: clean, labeled pairs drawn from real
  inputs. The router above trained on about 109,000. An LLM judge can help
  label them, if you've checked it against human labels.
- Hold out a test set the model never trains on, and compare the
  fine-tuned model with the prompted one on accuracy, cost and latency.
- If you want a small model to copy a big one's answers, that's
  [[distillation]], a specific way of making the training data.

## Further reading

- [Deprecations](https://developers.openai.com/api/docs/deprecations),
  OpenAI, 2026. The dates of the fine-tuning wind-down, and what happens to
  existing fine-tuned models.
- [Customize a model with fine-tuning in Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/custom-model-fine-tuning.html),
  AWS docs. Which models Bedrock can fine-tune, including the one Claude
  model.
- [Fine-Tuning or Retrieval? Comparing Knowledge Injection in LLMs](https://arxiv.org/abs/2312.05934),
  Ovadia, Brief, Mishaeli and Elisha (Microsoft), 2023. The study behind
  "use RAG for facts".
- [Fine-Tuning Llama-2: A Comprehensive Case Study for Tailoring Models to Unique Applications](https://www.anyscale.com/blog/fine-tuning-llama-2-a-comprehensive-case-study-for-tailoring-models-to-unique-applications),
  Kourosh Hakhamaneshi and Rehaan Ahmad (Anyscale), 2023. Three tasks with
  before-and-after numbers, and the "form, not facts" rule.
- [LoRA Land: 310 Fine-tuned LLMs that Rival GPT-4](https://arxiv.org/abs/2405.00732),
  Justin Zhao et al. (Predibase), 2024. Narrow LoRA fine-tunes at scale,
  and serving many adapters on one GPU.
- [Building an LLM Router for High-Quality and Cost-Effective Responses](https://www.anyscale.com/blog/building-an-llm-router-for-high-quality-and-cost-effective-responses),
  Amjad Almahairi (Anyscale), 2024. A fine-tuned router, start to finish,
  with judge-made labels.
- [SFT Trainer](https://huggingface.co/docs/trl/sft_trainer), Hugging Face
  TRL docs. The trainer you'll likely use: data formats, the loss, and
  LoRA through PEFT.
