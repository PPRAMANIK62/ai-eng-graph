---
id: debenedetti-camel
title: Defeating Prompt Injections by Design
author: Edoardo Debenedetti, Ilia Shumailov, Tianqi Fan, Jamie Hayes, Nicholas Carlini, Daniel Fabian, Christoph Kern, Chongyang Shi, Andreas Terzis, Florian Tramèr
url: https://arxiv.org/abs/2503.18813
published: 2025-03-24
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

CaMeL, from Google DeepMind and others: a defense that doesn't rely on the model resisting injection. A privileged LLM turns the user's request into a small program before any untrusted data is seen, so injected text can't change which steps run. A quarantined LLM with no tools parses untrusted data. A custom interpreter tracks where every value came from and who may see it (capabilities), and blocks tool calls that would send data somewhere it isn't allowed, asking the user instead. It solves 77% of AgentDojo tasks with provable security, vs 84% undefended. The authors say injection isn't solved. Version 2 is dated 2025-06-24; read from the arXiv PDF.

## Key claims

- The idea: "CaMeL explicitly extracts the control and data flows from the (trusted) query; therefore, the untrusted data retrieved by the LLM can never impact the program flow." (Abstract)
- Capabilities block exfiltration: CaMeL "uses a notion of a capability to prevent the exfiltration of private data over unauthorized data flows by enforcing security policies when tools are called." (Abstract)
- Result: "solving 77% of tasks with provable security (compared to 84% with an undefended system) in AgentDojo." (Abstract)
- Builds on the Dual LLM pattern: the privileged LLM "only sees the initial user query and never the content from potentially compromised data sources", and the quarantined LLM "is stripped of any tool-calling capabilities". (Introduction)
- Why Dual LLM isn't enough, with the example "Can you send Bob the document he requested in our last meeting?": injected text in the meeting notes can make the quarantined LLM return an attacker's address and file. "while the control flow is protected by the Dual LLM pattern, the data flow can still be manipulated." (Introduction)
- The SQL parallel: "This is analogous to an SQL injection attack in which an adversary manipulates the query parameters rather than the structure of the query itself." (Introduction)
- Capabilities are "metadata assigned to each value passed to a tool that track the sources and allowed recipients of each value." The send would be blocked "(and the user asked for explicit approval)". (Introduction)
- Not covered: attacks that change only text, like a false summary or "prompt-injection induced phishing". (Section 3, limitations)
- Cost: users must write and maintain policies, and approvals can cause "user fatigue, where users become desensitized to security prompts and may inadvertently approve malicious actions". (9.2)
- Not solved. "No, prompt injection attacks are not fully solved." (9.3)

## Visuals worth redrawing

- Figure 1: the Bob example, showing the plan fixed from the query and the blocked send.

## My notes

- Needs changes to the agent runtime, not the model.
