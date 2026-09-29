---
id: owasp-llm-top-10-2026-publication
title: OWASP GenAI LLM Top 10 2026 (publication)
author: OWASP GenAI Security Project
url: https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/
published: 2026-08-03
accessed: 2026-09-29
kind: spec
primary: true
---

## Summary

The official download page for the 2026 list, and the 122-page PDF linked from it (opened and read as text). The PDF holds the same entries as the repo, a revision history, and appendices mapping each risk to NIST, MITRE ATLAS, CWE and the OWASP Top 10 for Agentic Applications (ASI01–ASI10).

## Key claims

- What it is. "OWASP Top 10 for LLM Applications 2026 is the latest community-driven guide to the most critical security risks facing applications powered by large language models." (resource page)
- Past versions: "2023-08-01 Version 1.0 Release", "2023-10-16 Version 1.1 Release", "2024-11-18 Version 2025 Release". (PDF, Revision History, page 2)
- Incident corpus, same as the repo preface: "a corpus of 7,714 real incidents" of which classifiers placed "the 6,639 that carried enough detail to sort." (PDF, Letter from the Project Leads)
- The Agentic list is a separate document: "OWASP Top 10 for Agentic Applications (ASI) — 2026 (announced 2025-12-09)". (PDF, appendix, page 59)
- Agentic risks named in the mappings: ASI01 Agent Goal Hijack, ASI02 Tool Misuse & Exploitation, ASI03 Identity & Privilege Abuse, ASI04 Agentic Supply Chain Vulnerabilities, ASI05 Unexpected Code Execution (RCE), ASI06 Memory & Context Poisoning, ASI07 Insecure Inter-Agent Communication, ASI08 Cascading Failures, ASI09 Human-Agent Trust Exploitation, ASI10 Rogue Agents. (PDF, appendix mapping tables)
- Excessive Agency maps to agent risks: ASI02 is "A manifestation of Excessive Agency, where extensions/tools carry functionality beyond what the task needs". (PDF, appendix, LLM03 row)
- Prompt injection's reach in agents: when output drives tool calls, "the blast radius extends from the chat surface to whatever the agent's tools can reach". (PDF, LLM01 Description, page 10)

## Visuals worth redrawing

- The bullseye "at a glance" figure (page 9) is an image only; not redrawn.

## My notes

- The resource page gives no incident numbers; the exact numbers are in the preface of the PDF and repo.
