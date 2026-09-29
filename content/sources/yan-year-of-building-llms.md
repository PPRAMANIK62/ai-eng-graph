---
id: yan-year-of-building-llms
title: What We’ve Learned From A Year of Building with LLMs
author: Eugene Yan, Bryan Bischof, Charles Frye, Hamel Husain, Jason Liu, Shreya Shankar
url: https://applied-llms.org/
published: 2024-06-08
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

A long practical guide from six practitioners after a year of shipping LLM products, split into tactical (prompting, RAG, workflows, evals), operational (data, models, product, team) and strategic parts. For this project it's the best source on where LLMs are brittle in production: hallucination rates that are hard to push down, output produced even when there's nothing to say, agents that fail step by step, and small models that beat LLMs on narrow tasks. It also argues structured output is the lasting pattern for putting LLMs inside software.

## Key claims

- Where things stood in mid-2024. "Over the past year, LLMs have become “good enough” for real-world applications." (intro)
- Brittle but useful when scoped. "Right now, LLM-powered applications are brittle." (3.2.5 AI in the loop; Humans at the center)
- Same paragraph: "Additionally, when tightly scoped these applications can be wildly useful. This means that LLMs make excellent tools to accelerate user workflows." (3.2.5)
- Humans should drive, LLMs assist (in 2024). "LLM-driven systems should not be the primary drivers of most workflows today, they should merely be a resource." (3.2.5)
- Agents fail step by step. "Each step an agent takes has a chance of failing, and the chances of recovering from the error are poor." (1.3.2 Prioritize deterministic workflows for now)
- So success falls off with length. "the likelihood that an agent completes a multi-step task successfully decreases exponentially as the number of steps increases." (1.3.2)
- LLMs answer when they shouldn't, e.g. extraction that returns values not in the document. "an LLM may confidently return values even when those values don’t actually exist." (1.4.7 LLMs will return output even when they shouldn’t)
- Hallucination rates in practice. "They’re more common and occur at a baseline rate of 5 - 10%, and from what we’ve learned from LLM providers, it can be challenging to get it below 2%, even on simple tasks such as summarization." (1.4.8 Hallucinations are a stubborn problem)
- Structured output is how LLM output enters software; examples: Rechat (real-estate CRM widgets), Boba (product strategy ideas with typed fields), LinkedIn (YAML to pick a skill and its parameters). "For most real-world use cases, the output of an LLM will be consumed by a downstream application via some machine-readable format." (2.2.1 Generate structured output to ease downstream integration)
- The pattern as Postel's Law. "be liberal in what you accept (arbitrary natural language) and conservative in what you send (typed, machine-readable objects)." (2.2.1)
- In 2024, Instructor (for API models) and Outlines (for self-hosted) were the go-to tools for structured output. (2.2.1)
- Don't build what providers will build: custom tooling to validate structured output from proprietary models was an example of wasted depth. "OpenAI needs to ensure that when you ask for a function call, you get a valid function call—because all of their customers want this." (3.2.4 Don’t Build LLM Features You Can Buy)
- Model upgrades can break you: Voiceflow saw a 10% drop in intent classification moving from gpt-3.5-turbo-0301 to gpt-3.5-turbo-1106. (2.2.2 Migrating prompts across models is a pain in the ass)
- Pin model versions (section title of 2.2.3, which follows the migration example). "Version and pin your models" (2.2.3)
- Small models can beat LLMs on narrow tasks: a fine-tuned 400M DistilBART spotted hallucinations with ROC-AUC 0.84, "surpassing most LLMs at less than 5% of the latency and cost." (2.2.4 Choose the smallest model that gets the job done)
- Temperature doesn't give you the variety you expect. "increasing temperature does not guarantee that the LLM will sample outputs from the probability distribution you expect" (1.3.3 Getting more diverse outputs beyond temperature)
- Cost falling fast: running a model at davinci-equivalent performance dropped from $20 to under 10¢ per million tokens in four years, "a halving time of just six months." (3.4 The high-level trend of low-cost cognition)
- Multi-step flows. "It’s common knowledge that decomposing a single big prompt into multiple smaller prompts can achieve better results." Cites AlphaCodium's 19% → 44%. "Small tasks with clear objectives make for the best agent or flow prompts." (1.3.1 Step-by-step, multi-turn “flows” can give large boosts)
- Deterministic execution. Have the agent produce a plan that "is executed deterministically", because "Deterministic execution makes the system more reliable, and thus easier to test and debug. In addition, failures can be traced to the specific steps in the plan." (1.3.2 Prioritize deterministic workflows for now)
- Assertions from real samples: "Create unit tests (i.e., assertions) consisting of samples of inputs and outputs from production, with expectations for outputs based on at least three criteria." Fewer than three "might indicate that your task isn’t sufficiently defined or is too open-ended". They "should be triggered by any changes to the pipeline". (1.4.1 Create a few assertion-based unit tests from real input/output samples)
- What assertions look like: "Consider beginning with assertions that specify phrases that let us include or exclude responses. Also try checks to ensure that word, item, or sentence counts lie within a range." (1.4.1)
- Execution-based checks for code: "you run the generated code and check if the state of runtime is sufficient for the user request." Example: if the user asks for a function named foo, "foo should be callable!" (1.4.1)
- Loosen checks to what any right answer must satisfy: "It can be effective to “relax” assertions to the absolute most weak assumptions that any viable answer would satisfy." (1.4.1)
- LLM-as-Judge verdict: "when implemented well, LLM-as-Judge achieves decent correlation with human judgments". In pairwise comparisons it "typically gets the direction right though the magnitude of the win/loss may be noisy." (1.4.2 LLM-as-Judge can work (somewhat), but it’s not a silver bullet)
- Judge tips: "Use pairwise comparisons" ("This tends to lead to more stable results."); "do each pairwise comparison twice, swapping the order of pairs each time"; "Allow for ties"; "Use Chain-of-Thought"; "LLMs tend to bias toward longer responses. To mitigate this, ensure response pairs are similar in length." (1.4.2)
- Iterating a judge with stakeholders over three rounds: "agreement with humans and LLM improved from 68% to 94%!" (1.4.2)
- Limits: "conventional classifiers and reward models can achieve higher accuracy than LLM-as-Judge, and with lower cost and latency. For code generation, LLM-as-Judge can be weaker than more direct evaluation strategies like execution-evaluation." (1.4.2)
- Human labels: Likert ratings are "cognitively demanding" and the data "more noisy". "Two tasks that work well are binary classifications and pairwise comparisons." Binary decisions "are more precise, have higher consistency among raters, and lead to higher throughput." (1.4.5 Simplify annotation to binary tasks or pairwise comparisons)
- Pairwise labels are cheaper than written answers: at a Llama 2 meetup, pairwise comparisons cost "$3.5 per unit" vs "$25 per unit" for written responses. (1.4.5)
- Reference-free evals: "if your evals are reference-free, they can be used as guardrails too." They "don’t rely on a “golden” reference, such as a human-written answer". (1.4.6 (Reference-free) evals and guardrails can be used interchangeably)

## Visuals worth redrawing

- The cost-vs-capability chart in 3.4 (created by Charles Frye from public data on 2024-05-13). Dated; only useful as a 2024 snapshot.
- Our own: probability that an agent finishes an n-step task if each step succeeds 95% of the time (0.95^n). Illustrates 1.3.2; the numbers would be our arithmetic, not theirs.

## My notes

- Published 2024-06-08, before coding agents took off. Its "prioritize deterministic workflows" advice contrasts with `willison-2025-year-in-llms` (end of 2025: agents "happened", especially coding agents). Show the date moving, don't pick a winner.
- The 5–10% / 2% hallucination figures are practitioner estimates ("from what we’ve learned from LLM providers"), not a measured benchmark.
- Also useful for `structured-output` (the Postel's Law framing) and `hallucination` (the rates and the "output even when it shouldn’t" section).
