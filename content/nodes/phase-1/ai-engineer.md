---
id: ai-engineer
title: What is an AI engineer?
depth: short
phase: 1
note: >-
  Builds products on top of models, usually through an API. Rarely trains models, sometimes fine-tunes them.
needs: []
leads_to: [llm-use-cases]
compare_with: []
updated: 2026-09-23
---

# What is an AI engineer?

An AI engineer builds products on top of AI models that someone else
trained, usually by calling them through an API. If you've built web apps,
you're closer to this job than you might think. Most of the work is software
engineering, with a model as one of the parts.

## The model is a part, not the product

A wide range of AI tasks that took a research team years in 2013 needed
only API docs and a spare afternoon by 2023. The model went from something
you had to build to something you call.

That shift created the job. The hard part used to be building the model.
Now the model is something you rent, and the hard part is everything around
it: what you send it, how you check what comes back, and how it fits into a
product people want to use.

## How it differs from an ML engineer

Both roles work with models. They spend their time in different places.

| | ML engineer | AI engineer |
|---|---|---|
| Starting point | Collects data and trains a model | Uses a model someone else trained |
| Main work | Data labelling, features, training | Prompts, context, evaluation, product |
| Output of the model | A label or a number, easy to score | Open-ended text, hard to score |
| Model size | Smaller, cheaper to run | Large, so cost and speed matter |

A useful picture is a stack with three layers. At the bottom is the
infrastructure that runs models. In the middle is model development:
training, fine-tuning, making inference fast. On top is application
development: the product. ML engineers traditionally live in the middle
layer. AI engineers mostly live on top and reach down only when they need
to.

![Three stacked layers: application development on top, model development in the middle, infrastructure at the bottom. The AI engineer spends most of their time in the top layer and sometimes reaches into the middle for fine-tuning. The ML engineer spends most of their time in the middle layer.](img/ai-engineer-stack.svg)

## What the work looks like

**Adapting the model.** There are two ways, and the difference is whether
the model's weights change. Prompting changes only what you send the model.
[[fine-tuning]] trains it a bit further on your own examples, so its weights
change. Plenty of successful products use prompting alone, so that's where
you start.

**Building the context.** Deciding what goes into each request the model
sees.

**Evaluating.** A classifier is either right or wrong. A paragraph of text
can be good, bad or somewhere in between, so checking quality is a real
engineering problem, and a big part of the job.

**Building the product.** Your competitors can call the same models you can.
What sets your product apart is everything you build around the model. This
is why more and more AI engineers come from web and full-stack backgrounds.

The order of work flips too. Classic ML went data, then model, then product.
With a model behind an API, you can build a working prototype with a prompt
first, and only later collect data to improve it.

## Where the name came from

"AI engineer" became a job title in mid-2023. Shawn Wang (swyx) argued in
"The Rise of the AI Engineer" that software engineering was spawning a new
specialty, the way it had spawned SRE and data engineering. At the time, ML
engineer jobs outnumbered AI engineer jobs about ten to one on Indeed. He
predicted that would flip within five years, so by 2028. The title is still
fuzzy: some companies merge AI and ML engineering into one role, others
split them.

## Where it gets tricky

**"AI engineers don't train models" is too strong.** Fine-tuning is part of
the job, just not the everyday part. When model makers do the same kind of
training, they call it [[post-training]]. "Rarely trains, sometimes
fine-tunes" is closer to the truth.

**How much ML do you need?** Opinions differ. Some very effective AI
engineers have never taken the classic ML courses or learned PyTorch. Others
say ML knowledge is optional but still valuable, because real systems often
mix large models with classic ML ones. Both agree it's no longer a
must-have.

**It's not the same as using AI to code.** This site separates the AI
engineer from the AI-assisted developer. An AI-assisted developer uses AI
tools to write ordinary software faster. An AI engineer ships software that
has a model inside it. The line is our own. The job-title debates above
don't draw it.

## What this means when you build

- Start with the product and a prompt. Move down the stack only when
  prompting runs out.
- Treat evaluation as core work from the first day. With open-ended output,
  it's one of the hardest parts of the job.
- The product layer is where your work sets you apart, since everyone can
  call the same models.

To see what the model inside your product is actually good at, read
[[llm-use-cases]] next.

## Further reading

- [The Rise of the AI Engineer](https://www.latent.space/p/ai-engineer),
  Shawn Wang (swyx), 2023. The essay that named the role. Good on why it
  appeared, though the tools and job numbers are dated.
- [The AI Engineering Stack](https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack),
  Chip Huyen, 2025. A book chapter on how AI engineering differs from ML
  engineering, with the three-layer stack.
- [AI Engineering: book repo and chapter summaries](https://github.com/chiphuyen/aie-book),
  Chip Huyen, 2025. A short definition, and the questions the job has to
  answer.
