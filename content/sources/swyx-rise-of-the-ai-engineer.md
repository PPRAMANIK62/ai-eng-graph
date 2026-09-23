---
id: swyx-rise-of-the-ai-engineer
title: The Rise of the AI Engineer
author: Shawn Wang (swyx), Latent.Space
url: https://www.latent.space/p/ai-engineer
published: 2023-06-30
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

The essay that made "AI Engineer" a job title. swyx argues that foundation
models moved applied AI "right", from research teams to software engineers
who build products on top of model APIs, and that this group would become
its own discipline, the way SRE and data engineering did. He backs it with a
Karpathy quote, job-posting counts and a supply argument (few researchers,
many software engineers), and announces the AI Engineer Summit.

## Key claims

- Tasks that once needed a research team now need an API and some docs. "A wide range of AI tasks that used to take 5 years and a research team to accomplish in 2013, now just require API docs and a spare afternoon in 2023." (opening, second paragraph)
- The line between AI engineers and research engineers is the model API, and people cross it both ways. "the API line is permeable - AI Engineers can go left to finetune/host models and Research Engineers go right to build atop APIs too!" (caption note under the "shift right" diagram)
- Split of data and evals: researchers own pretraining data and general benchmarks, AI engineers own product-specific data and evals. "AI Engineers should certainly view product-specific data and evals as their job." (note under the "shift right" diagram)
- Karpathy: AI engineers will outnumber ML engineers, and the job doesn't need training. "One can be quite successful in this role without ever training anything." (Karpathy quote block, near the top)
- The effective AI engineers he names haven't taken the classic ML courses or learned PyTorch (re-checked on the page 2026-09-23). "none of the highly effective AI Engineers I named above have done the equivalent work of the Andrew Ng Coursera courses, nor do they know PyTorch" (list after the Karpathy quote)
- The job is a new subdiscipline of software engineering, like earlier split-offs. "I think software engineering will spawn a new subdiscipline, specializing in applications of AI and wielding the emerging stack effectively" (paragraph just before the one that names the role "AI Engineer")
- Day-to-day work named in 2023: evaluating models from GPT-4 and Claude down to small open models, and using chaining, retrieval and vector search tools. "From evaluating the largest GPT-4 and Claude models, down to the smallest open source Huggingface, LLaMA, and other models" (list after the Karpathy quote, "Models")
- Keeping up with research is itself close to a full-time job. "keeping on top of it all is almost a full time job." (same list, "Research/Progress")
- Engineers, not researchers, ship AI products. "When it comes to shipping AI products, you want engineers, not researchers." (end of the section before "The AI vs ML Engineer Flippening")
- Job numbers in mid-2023: ML engineer jobs outnumbered AI engineer jobs 10 to 1, and swyx predicted a flip. "There are 10x as many ML Engineer jobs as AI Engineer jobs on Indeed, but the higher growth rate of “AI” leads me to predict that this ratio will invert in 5 years." ("The AI vs ML Engineer Flippening")
- Supply argument: very few LLM researchers, many software engineers. "There are ~5000 LLM researchers in the world, but ~50m software engineers." ("Why AI Engineers are Emerging Now")
- The workflow flips: prototype with a prompt first, gather data and fine-tune later. "a product manager/software engineer can prompt an LLM, and build/validate a product idea, before getting specific data to finetune." ("Fire, ready, aim" paragraph)
- AI engineers build different products than classic ML (fraud, recommendations, anomaly detection). "Where the existing generation of ML might have been focused on fraud risk, recommendation systems, anomaly detection, and feature stores, the AI Engineers are building writing apps, personalized learning tools, natural language spreadsheets, and Factorio-like visual programming languages." ("Generative AI vs Classifier ML")
- Code generation agents become part of the AI engineer's own toolkit, blurring the line with AI doing engineering. "As human Engineers learn to harness AI, AIs will increasingly do Engineering as well" (paragraph after the startup market map)

## Visuals worth redrawing

- **"Shift right" spectrum** (top of the essay): a horizontal line of roles from ML research / research engineers on the left, through the model API line, to AI engineers and then product engineers on the right (read from the image, which has no text version; check the exact labels on the page before redrawing). The note under it says the API line is permeable and that the diagram was criticized for where it put evals and data. This is the one to redraw for the article: it places the AI engineer between ML engineer and product engineer. Chip Huyen's book redraws a related workflow figure from this essay (see `huyen-ai-engineering-stack`, Figure 1-16).
- **Monthly job trends per HN Who's Hiring** ("The AI vs ML Engineer Flippening"): chart of "AI Engineer" vs "ML Engineer" mentions over time. Numbers are from 2023 and now stale.
- **"software atop intelligence" vs "intelligent software"** (Software 3.0 section): code core with an LLM inside vs LLM core with code around it. Useful if the article wants a line on where code sits in an AI app.

## My notes

- Dated. Written 2023-06-30. The tools it names (LangChain, LlamaIndex, Pinecone, Auto-GPT, BabyAGI, smol-developer, gpt-engineer) are 2023 examples, and the 10x job ratio is a 2023 Indeed snapshot. The "invert in 5 years" prediction lands in 2028, so it can't be checked yet from this source.
- Salary figures ("$300k/yr doing prompt engineering at Anthropic and $900k building software at OpenAI") are anecdotes, not survey data. Don't use them as typical pay.
- Bias: swyx co-founded the AI Engineer conference announced in this same essay, so he has a stake in the title catching on. Worth saying in the article. The essay also notes Karpathy responded "with some disagreement" (Software 3.0 section); I didn't open that response.
- Sharpest disagreement with other views: swyx says effective AI engineers don't know PyTorch or the Andrew Ng courses. Chip Huyen (`huyen-ai-engineering-stack`) agrees ML knowledge isn't a must-have but calls it "still extremely valuable".
- Footnote 1 lists rejected names: "Foundation Model Engineer", "AI API Developer", "LLM Engineer", "Prompt Engineer" (too narrow), "MLOps Engineer" (lower-level ML concerns). Good for the "where the term came from" part.
- Missing: nothing on the AI-assisted developer (someone who uses coding assistants to write ordinary software). The closest is the line about code generation agents joining the AI engineer's toolkit. The article needs another source, or a clear note, for that contrast.
