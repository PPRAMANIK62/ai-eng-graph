---
id: owasp-llm01-prompt-injection
title: "LLM01:2025 Prompt Injection"
author: OWASP GenAI Security Project
url: https://genai.owasp.org/llmrisk/llm01-prompt-injection/
published: 2025
accessed: 2026-09-29
kind: spec
primary: true
---

## Summary

OWASP's entry for prompt injection, the first item in its 2025 Top 10 for LLM applications. It defines direct and indirect injection, says it's unclear whether any method prevents injection completely, lists seven mitigations that reduce the impact, and gives nine attack scenarios. It treats jailbreaking as a kind of prompt injection, which differs from Willison's split.

## Key claims

- Definition. "A Prompt Injection Vulnerability occurs when user prompts alter the LLM’s behavior or output in unintended ways." (Description)
- Injected text doesn't have to be visible. "prompt injections do not need to be human-visible/readable, as long as the content is parsed by the model." (Description)
- RAG and fine-tuning don't fix it. "research shows that they do not fully mitigate prompt injection vulnerabilities." (Description)
- Jailbreaking is filed under injection. "Jailbreaking is a form of prompt injection where the attacker provides inputs that cause the model to disregard its safety protocols entirely." (Description)
- Different defenses for each. "Developers can build safeguards into system prompts and input handling to help mitigate prompt injection attacks, but effective prevention of jailbreaking requires ongoing updates to the model’s training and safety mechanisms." (Description)
- Direct. "Direct prompt injections occur when a user’s prompt input directly alters the behavior of the model in unintended or unexpected ways." Can be intentional or unintentional. (Types)
- Indirect. "Indirect prompt injections occur when an LLM accepts input from external sources, such as websites or files." (Types)
- No known complete fix. "it is unclear if there are fool-proof methods of prevention for prompt injection." (Prevention and Mitigation Strategies)
- Seven mitigations: constrain model behavior; define and validate expected output formats; input and output filtering; privilege control and least privilege; human approval for high-risk actions; segregate and identify external content; adversarial testing. (Prevention and Mitigation Strategies)
- Least privilege detail: "handle these functions in code rather than providing them to the model." (Mitigation 4)
- Indirect scenario with exfiltration: "A user employs an LLM to summarize a webpage containing hidden instructions that cause the LLM to insert an image linking to a URL, leading to exfiltration of the the private conversation." (Scenario #2)
- Other scenarios: a poisoned document in a RAG store (#4), split payloads in a resume (#6), a prompt hidden in an image (#7), an adversarial suffix (#8), multilingual or obfuscated attacks (#9). (Example Attack Scenarios)
- An unintentional case: a job ad hides an instruction to detect AI-written applications, and an applicant's LLM trips it. (Scenario #3)

## Visuals worth redrawing

- None.

## My notes

- This is the 2025 page. The 2026 list (2026-08-04) keeps prompt injection at #1 per `_candidates.md`; I didn't find a 2026 per-risk page.
