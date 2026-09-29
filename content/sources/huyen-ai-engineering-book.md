---
id: huyen-ai-engineering-book
title: "AI Engineering book and other resources (README and chapter summaries)"
author: Chip Huyen
url: https://github.com/chiphuyen/aie-book
published: 2025
accessed: 2026-09-23
kind: book
primary: true
---

## Summary

The GitHub repo for Chip Huyen's book *AI Engineering* (O'Reilly, 2025).
The README says what the book covers and draws a short line between AI
engineering (building on foundation models: prompts, context,
parameter-efficient finetuning) and traditional ML engineering (tabular
data, feature engineering, model training). This note also covers the
repo's `chapter-summaries.md`
(https://github.com/chiphuyen/aie-book/blob/main/chapter-summaries.md),
whose Chapter 1 summary says AI engineering grew out of ML engineering and
lists common use cases.

## Key claims

From the README (https://github.com/chiphuyen/aie-book):

- Foundation models turned AI from a specialist field into a general tool. "The availability of foundation models has transformed AI from a specialized discipline into a powerful development tool everyone can use." ("About the book")
- The book's scope, and a working definition of the job: adapting existing models to real problems. "This book covers the end-to-end process of adapting foundation models to solve real-world problems" ("About the book")
- The core contrast between the two disciplines, in one pair of sentences. "DMLS focuses on building applications on top of traditional ML models, which involves more tabular data annotations, feature engineering, and model training." ("Reading AI Engineering (AIE) with Designing Machine Learning Systems (DMLS)")
- The AI engineering side of that contrast puts parameter-efficient finetuning inside the job. "AIE focuses on building applications on top of foundation models, which involves more prompt engineering, context construction, and parameter-efficient finetuning." (same section)
- Real systems mix both kinds of model, so the two skill sets overlap. "A real-world system often involves both traditional ML models and foundation models, so knowledge about working with both is often necessary." (same section)
- Day-to-day questions the job has to answer, as listed by the book: whether to build, evaluation, hallucinations, prompting, RAG, agents, finetuning, data, speed and cost, feedback loops. "When to finetune a model? When not to finetune a model?" ("What this book is about", question 7)
- Fundamentals over tools. "Tools become outdated quickly, but fundamentals should last longer." ("What this book is about", last paragraph)
- The book is written partly for people trying to become AI engineers. "Job candidates seeking clarity on the skills needed to pursue a career as an AI engineer." ("Who this book is for")

From `chapter-summaries.md`, Chapter 1:

- AI engineering exists as a discipline because foundation models became available. "One is to explain the emergence of AI engineering as a discipline, thanks to the availability of foundation models." (Chapter 1 summary, first paragraph after Table 1-3)
- AI engineering is a new name for something that grew out of ML engineering. "While AI engineering is a new term, it evolved out of ML engineering, which is the overarching discipline involved with building applications with all ML models." (Chapter 1 summary)
- Most ML engineering principles still apply, with new problems on top. "Many principles from ML engineering are still applicable to AI engineering." (Chapter 1 summary)
- The field is young. "we're still in the early stages of AI engineering, with countless more innovations yet to be built." (Chapter 1 summary)
- Table 1-3 examples, consumer / enterprise (re-checked 2026-09-23): Coding: coding / coding. Image and video: photo and video editing, design / presentations, ad generation. Writing: email, social media and blog posts / copywriting, SEO, reports, memos, design docs. Education: tutoring, essay grading / employee onboarding, upskill training. Conversational bots: general chatbot, AI companion / customer support, product copilots. Information aggregation: summarization, talk-to-your-docs / summarization, market research. Data organization: image search, memex / knowledge management, document processing. Workflow automation: travel planning, event planning / data extraction, entry and annotation, lead generation. "Table 1-3. Common generative AI use cases across consumer and enterprise applications." (Chapter 1 summary)

From `chapter-summaries.md`, Chapter 10 (AI Engineering Architecture and User Feedback):

- Conversational feedback feeds the flywheel: the conversational interface "enables new types of user feedback, which you can leverage for analytics, product improvement, and the data flywheel." (Chapter 10 summary)
- Engineers now own feedback design: "since user feedback is a crucial source of data for continuously improving AI models, more AI engineers are now becoming involved in the process to ensure they receive the data they need." (Chapter 10 summary)
- The flywheel as an edge: "the increasing importance of data flywheel and product experience as competitive advantages." (Chapter 10 summary)
- Observability means "understanding how your system fails, designing metrics and alerts around failures, and ensuring that your system is designed in a way that makes these failures detectable and traceable." (Chapter 10 summary)

From `chapter-summaries.md`, Chapter 4 ("Evaluate AI Systems"):

- For most app builders, the hard part is choosing a model, not building one. "for most application developers, the challenge is no longer in developing models but in selecting the right models for your application." (Chapter 4 summary)
- What public benchmarks are good for. "Public benchmarks can help you weed out bad models, but won't help you find the best models for your applications." (Chapter 4 summary)
- Why to distrust them. "Public benchmarks are also likely contaminated, as their data is included in the training data of many models." (Chapter 4 summary)
- Leaderboards aggregate benchmarks in an unclear way. "how benchmarks are selected and aggregated is not a clear process." (Chapter 4 summary)
- Model selection as your own leaderboard. "model selection is akin to creating a private leaderboard to rank models based on your needs." (Chapter 4 summary)
- Host vs API is weighed on several axes. "this chapter outlined the pros and cons of each approach along seven axes, including data privacy, data lineage, performance, functionality, control, and cost." (Chapter 4 summary)

## Visuals worth redrawing

- **Table 1-3, "Common generative AI use cases across consumer and enterprise applications"** (`chapter-summaries.md`, top of Chapter 1): eight categories (coding, image and video production, writing, education, conversational bots, information aggregation, data organization, workflow automation), each with consumer and enterprise examples. Mainly useful for `llm-use-cases`, but a trimmed version could show what AI engineers actually build.
- A two-column "ML engineering vs AI engineering" table can be built from the README's DMLS/AIE paragraph: tabular data annotation, feature engineering, model training vs prompt engineering, context construction, parameter-efficient finetuning. That's our own table, credited to Huyen.

## My notes

- The README gives no exact publish date, only "O'Reilly Media, 2025" in the citation block. The Pragmatic Engineer excerpt (`huyen-ai-engineering-stack`) says it was published in January (2025). The repo is still updated; the README now lists translations into 13 languages.
- The README says the full ML-vs-AI comparison is in Chapter 1, which isn't in the repo. The excerpt in `huyen-ai-engineering-stack` has that section in full, with more detail (three differences, the three-layer stack). Cite that one for the detailed contrast and this one for the short definition.
- Key point for the article's note: Huyen counts parameter-efficient finetuning as part of AI engineering. That supports "rarely trains models, sometimes fine-tunes them" over "doesn't train them".
- Bias: it's the author's own book page, so it describes the book favourably. The definitions are still the most careful ones available.
- Missing: nothing on AI-assisted developers, and no job-market numbers.
