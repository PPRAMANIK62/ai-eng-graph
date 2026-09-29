---
id: zaharia-compound-ai-systems
title: The Shift from Models to Compound AI Systems
author: Matei Zaharia, Omar Khattab, Lingjiao Chen, Jared Quincy Davis, Heather Miller, Chris Potts, James Zou, Michael Carbin, Jonathan Frankle, Naveen Rao, Ali Ghodsi (Berkeley AI Research)
url: https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems/
published: 2024-02-18
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Argues that the best AI results now come from systems of several parts (several model calls, retrievers, tools, code) rather than one model call, and explains why: some tasks improve faster through system design than through training, systems can use fresh data, they're easier to control, and they let you tune the cost and quality trade. Lists example systems (AlphaCode 2, AlphaGeometry, Medprompt, Gemini's CoT@32) and the new problems they create: a huge design space, optimizing parts together, and monitoring.

## Key claims

- The thesis. "state-of-the-art AI results are increasingly obtained by compound systems with multiple components, not just monolithic models." (intro)
- Definition. "We define a Compound AI System as a system that tackles AI tasks using multiple interacting components, including multiple calls to models, retrievers, or external tools." (Why Use Compound AI Systems?)
- Enterprise usage (Databricks): "60% of LLM applications use some form of retrieval-augmented generation (RAG), and 30% use multi-step chains." (intro)
- System design can beat scale. Hypothetical: a model solving 30% of coding contest problems might reach 35% with triple the training budget, while a system that samples many times and tests each sample "might increase performance to 80% with today’s models". Also "iterating on a system design is often much faster than waiting for training runs." (Some tasks are easier to improve via system design)
- Control. "Using an AI system instead of a model can help developers control behavior more tightly, e.g., by filtering model outputs." (Improving control and trust is easier with systems)
- Fresh data and access control. Models are "trained on static datasets, so their “knowledge” is fixed", and a system can add search and retrieval for timely data, and access controls ("answer a user’s questions based only on files the user has access to"). (Systems can be dynamic)
- Trust: "a system combining, say, LLMs with retrieval can increase user trust by providing citations or automatically verifying facts." (Improving control and trust is easier with systems)
- Cost and quality vary per application: "Each AI model has a fixed quality level and cost, but applications often need to vary these parameters." (Performance goals vary widely)
- Gemini's CoT@32 on MMLU samples 32 chain-of-thought answers and returns the top choice if enough agree: 90.04% vs 86.4% for GPT-4 with 5-shot prompting. (The AI System Design Space, table)
- An open design question: should "control logic" be "written in traditional code (e.g., Python code that calls an LLM), or should it be driven by an AI model (e.g. LLM agents that call external tools)?" (Developing Compound AI Systems)
- Budgets split across parts: "if you want to answer RAG questions in 100 milliseconds, should you budget to spend 20 ms on the retriever and 80 on the LLM, or the other way around?" (Key Challenges, Design Space)
- Harder to operate: tracking success for a system that "might use a variable number of “reflection” steps or external API calls" is harder than for a single classifier. (Operation)
- Routing for cost: FrugalGPT learns to route inputs across model cascades and "can outperform the best LLM services by up to 4% at the same cost, or reduce cost by up to 90% while matching their quality." Gateways and routers "work even better when an AI task is broken into smaller modular steps". (Optimizing Cost: FrugalGPT and AI Gateways)

## Visuals worth redrawing

- The design-space table (system, components, design, result). Could be a small table in `llm-workflows`.

## My notes

- Examples are from early 2024. The 80% figure is a hypothetical, not a measurement.
- FrugalGPT numbers are reported here second-hand; the FrugalGPT paper itself wasn't opened.
