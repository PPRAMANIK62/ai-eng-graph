---
id: owasp-llm-top-10-2026-repo
title: OWASP Top 10 for Large Language Model Applications (GitHub repository)
author: OWASP GenAI Security Project
url: https://github.com/GenAI-Security-Project/GenAI-LLM-Top10
published: 2026-08-04
accessed: 2026-09-29
kind: spec
primary: true
---

## Summary

The official source repository of the OWASP Top 10 for LLM applications. The README gives the 2026 order, and `2026/final/` holds the canonical Markdown of each entry plus the project leads' preface, which explains the method (community vote weighted with incident data) and what moved. `2025/` holds the previous edition, whose file names give the 2025 order. The old OWASP repo is a legacy archive pointing here.

## Key claims

- Release date. "Current release: 2026 — published August 4, 2026." (README)
- The 2026 order: LLM01 Prompt Injection, LLM02 Sensitive Information Disclosure, LLM03 Excessive Agency, LLM04 Supply Chain, LLM05 Data and Model Poisoning, LLM06 Unbounded Consumption, LLM07 Misinformation, LLM08 Hidden Context Exposure, LLM09 Vector and Embedding Weaknesses, LLM10 Improper Output Handling. (README, "OWASP GenAI LLM Top 10 2026")
- The 2025 order, from the file names in `2025/`: LLM01 PromptInjection, LLM02 SensitiveInformationDisclosure, LLM03 SupplyChain, LLM04 DataModelPoisoning, LLM05 ImproperOutputHandling, LLM06 ExcessiveAgency, LLM07 SystemPromptLeakage, LLM08 VectorAndEmbeddingWeaknesses, LLM09 Misinformation, LLM10 UnboundedConsumption. (repo, `2025/`)
- What it is. "The Top 10 is a community-developed awareness document for developers, architects, data scientists, security practitioners, and organizations building or operating applications that use large language models." (README)
- Method. "The publication combines community judgment with analysis of real-world incidents and updates the ordering, scope, examples, mitigations, and framework mappings across the list." (README, "2026 Release")
- The stance. "Stop trying to build a model that cannot be fooled. Build the system around it, so that when the model is fooled, and it will be, nothing important breaks." (2026/final/LLM00_Preface.md, first paragraph)
- Incident data. "We pulled together a corpus of 7,714 real incidents from public vulnerability databases and an AI-harm database, and we built classifiers that read them and placed the 6,639 that carried enough detail to sort." (Preface)
- Weights. "The community vote carries three-quarters of the weight. The incident data covers the remaining quarter." (Preface)
- Prompt injection stays #1 despite the data: ranked by raw incidents "it falls out of the top 10 entirely. That gap is a defense effect." (Preface)
- Misinformation: voters placed it near the bottom, "The incident record placed it near the top". The list seats it in the middle. (Preface)
- Moves: "Excessive Agency climbed to third, the most consequential move on the list"; "Unbounded Consumption rose four places"; "Improper Output Handling fell the furthest, from fifth to tenth." (Preface, "What's New in the 2026 Top 10")
- Rename. "What used to be System Prompt Leakage is now Hidden Context Exposure" (Preface)
- Folded-in risks: cross-modal injection into Prompt Injection, fine-tuning subversion into Data and Model Poisoning, insecure generated code into Improper Output Handling. (Preface)
- The boundary with agents. When the model "becomes an actor, with tools it can call, memory it carries between sessions, and consequences it sets in motion downstream, the risk moves to the OWASP Agentic Top 10." (Preface)
- Hidden context is not a secret. "Practitioners should design under the assumption that hidden context is discoverable and that any contents of the context should not be considered a secret." (2026/final/LLM08_HiddenContextExposure.md, Description)
- Prompt injection 2026 cites EchoLeak: a crafted email against Microsoft 365 Copilot, "bypassing both the deployed prompt-injection classifier and the link-redaction filter." (2026/final/LLM01_PromptInjection.md, scenarios)
- LLM02 channels: "tool-call arguments, reasoning traces, retrieved chunks, multimodal output, logs, telemetry, embeddings, and observable inference properties" are all disclosure surfaces. (2026/final/LLM02, Description)
- LLM04 covers "third-party pre-trained models, datasets, and model artifacts, which can be manipulated through tampering, poisoning, or malicious artifact replacement." (2026/final/LLM04, Description)
- LLM05 poisoning "can occur anywhere data is ingested, transformed, retrieved, or reused, including during pre-training, fine-tuning, embedding creation, retrieval augmentation (RAG), and model distribution." (2026/final/LLM05, Description)
- LLM06: uncontrolled inference lets attackers "disrupt service availability, inflict unsustainable financial costs, or steal intellectual property through model cloning". (2026/final/LLM06, Description)
- LLM07: "The core risk is that the incorrect output is trusted and acted upon." (2026/final/LLM07, Description)
- LLM09: "Whenever similarity search sits between a data source and the prompt, the embedding layer becomes part of the application's trust boundary." Covers RAG, agent memory, semantic caches. (2026/final/LLM09, Description)
- LLM10: "insufficient validation, sanitization, and handling of the outputs generated by large language models before they are passed downstream to other components and systems." (2026/final/LLM10, Description)
- What hidden context holds: "the system prompt, developer instructions, retrieved policy text (from RAG knowledge bases, configuration stores, or user-profile services), the schemas of tools and functions the application exposes to the model". And "Sensitive data such as credentials, connection strings, and tokens should not be embedded in it". (2026/final/LLM08, Description)
- License: CC BY-SA 4.0. (README, License)
- Earlier editions were a vote. "Every version of this list before now was built on judgment. Hundreds of practitioners weighed in on what matters most." (Preface)
- Why excessive agency moved: "the vote and the record agree that agentic deployments are where the damage is landing." (Preface)

## Visuals worth redrawing

- The preface's bump chart of rank changes 2025 → 2026 (redraw from the two orders above).

## My notes

- Secondary reports disagreed on the 2026 order; this README is the one to trust.
