---
id: huyen-ai-engineering-stack
title: The AI Engineering Stack
author: Chip Huyen (book excerpt), with an introduction by Gergely Orosz (The Pragmatic Engineer)
url: https://newsletter.pragmaticengineer.com/p/the-ai-engineering-stack
published: 2025-05-20
accessed: 2026-09-23
kind: book
primary: true
---

## Summary

A free excerpt of Chapter 1 of Chip Huyen's *AI Engineering*, published in
The Pragmatic Engineer newsletter with a short intro and outro by Gergely
Orosz. It is the book's full section on how AI engineering differs from ML
engineering: three layers of the stack (application, model,
infrastructure), three main differences (someone else trains the model,
bigger compute, open-ended outputs), and a shift toward product and
full-stack work.

## Key claims

- The shortest definition of the difference: less building models, more adapting and evaluating them. "In short, AI engineering differs from ML engineering in that it’s less about model development, and more about adapting and evaluating models." ("2. AI engineering versus ML engineering")
- Difference 1: you use a model someone else trained. "With AI engineering, you use a model someone else has trained." (same section, first of three differences)
- Difference 2: bigger models mean more compute and latency pressure. "AI engineering works with models that are bigger, consume more compute resources, and incur higher latency than traditional ML engineering." (same section, second difference)
- Difference 3: open-ended outputs make evaluation the big problem. "This makes evaluation a much bigger problem in AI engineering." (same section, third difference)
- Two ways to adapt a model, split by whether weights change. Prompting: "Prompt-based techniques, which includes prompt engineering, adapt a model without updating the model weights." Fine-tuning: "Fine-tuning, on the other hand, requires updating model weights." (same section, "model adaptation")
- Many real products need only prompting. "Many successful applications have been built with just prompt engineering." (same section, prompt-based techniques paragraph)
- ML knowledge is optional for building AI apps but still useful. "With the availability of foundation models, ML knowledge is no longer a must-have for building AI applications." ("Modeling and training")
- The roles overlap, and people come from both sides. "Existing ML engineers can add AI engineering to their list of skills to enhance their job prospects, and there are also AI engineers with no ML experience." (intro of the excerpt, before "1. Three layers of the AI Stack")
- The three layers of any AI application stack, and you start from the top. "There are three layers to any AI application stack: application development, model development, and infrastructure." ("1. Three layers of the AI Stack")
- What each layer holds (Figure 1-14 text). Model development: "This layer provides tooling for developing models, including frameworks for modeling, training, fine-tuning, and inference optimization." Infrastructure: "At the bottom of the stack is infrastructure, which includes tooling for model serving, managing data and compute, and monitoring." Application development: "This layer requires rigorous evaluation and good applications demand good interfaces." ("1. Three layers of the AI Stack", re-opened 2026-09-23)
- Terms: fine-tuning is what app developers do, post-training is what model makers do. "It’s fine-tuning when it’s done by application developers." ("Differences between training, pre-training, fine-tuning, and post-training")
- Prompting is not training, even when people say it is. "if you teach a model what to do via the context input into it, then that is prompt engineering." (same box, last paragraph)
- Since many teams use the same models, the edge comes from the application. "With foundation models, where many teams use the same model, differentiation must be gained through the application development process." ("3. Application development in AI engineering")
- AI engineers are closer to the product than ML engineers were. "However, with foundation models, AI engineers tend to be much more involved in building the product." ("4. AI Engineering versus full-stack engineering")
- More AI engineers now come from web and full-stack work, and their edge is fast iteration. "While many AI engineers come from traditional ML backgrounds, more increasingly come from web development or full-stack backgrounds." (same section)
- Orosz (intro): AI engineers are mostly software engineers who learned to work with LLMs. "However, closer inspection reveals AI engineers are often regular software engineers who have mastered the basics of large language models (LLM), such as working with them and integrating them." (Orosz intro, second paragraph)
- Orosz (outro): most AI engineering jobs are building apps on APIs or self-hosted models. "However, most AI engineering positions at startups, scaleups and Big Tech, are about building AI applications on top of AI APIs, or self-hosted LLMs." (Orosz outro)

## Visuals worth redrawing

- **Figure 1-14, "Three layers of the AI engineering stack"** (section 1): application development on top, model development in the middle, infrastructure at the bottom, with example responsibilities per layer. Best candidate for the article's main visual, with the AI engineer shaded mostly in the top layer and the ML engineer in the middle.
- **Table 1-4, how model development responsibilities changed with foundation models** (end of "Inference optimization"): modeling and training, dataset engineering, inference optimization, each rated for ML vs AI engineering. The table is an image; the text doesn't give its cell values, so redraw only from what the prose says.
- **Table 1-6, importance of app development categories for AI vs ML engineering** (end of section 3): evaluation, prompt engineering, AI interface. Same caveat, the values are in the image.
- **Figure 1-16, the new AI engineering workflow** (section 4): product first, then data, then model, versus the old data-model-product order. The caption says it is "recreated from “The Rise of the AI Engineer” (Shawn Wang, 2023)", so it links this source to `swyx-rise-of-the-ai-engineer`.
- **Figures 1-12 and 1-13** (intro): LinkedIn job headlines from 2023-12-17, some companies merging AI and ML engineering into one title, others splitting them. A simple way to show the title is still fuzzy.

## My notes

- Why I added this note: it's by the same author as `huyen-ai-engineering-book` and is primary, but it has the full Chapter 1 comparison that the README only points to. It's the most precise primary source I found on AI engineer vs ML engineer.
- Kind is `book` because the body is a book excerpt ("Copyright © 2025 Chip Huyen", used with permission). The intro and outro are Orosz's own newsletter writing; quote them as Orosz, not Huyen.
- Where it agrees and differs from swyx: both say ML knowledge isn't required. swyx goes further (effective AI engineers don't know PyTorch); Huyen says ML knowledge is "still extremely valuable". Huyen also puts fine-tuning and inference optimization inside the stack AI engineers touch, which supports "sometimes fine-tunes".
- Numbers in the excerpt: 920 AI repos with 500+ stars (GitHub search, March 2024), InstructGPT pre-training "up to 98%" of compute and data, the Gemini MMLU jump from 83.7% to 90.04% with a different prompt. These belong to other nodes (pretraining, prompt engineering), not this one.
- Orosz says Meta, Google and Amazon pay AI engineers higher base salaries than regular software engineers, but gives no figures. Don't cite it as data.
- Missing: nothing on the AI-assisted developer. The Anton Bacaj footnote ("AI engineering is just software engineering with AI models thrown in the stack.") is the closest line to "it's still software engineering", but it's a quote of a quote.
