---
id: owasp-llm03-2026-excessive-agency
title: "LLM03:2026 Excessive Agency"
author: OWASP GenAI Security Project
url: https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/2026/final/LLM03_ExcessiveAgency.md
published: 2026-08-04
accessed: 2026-09-29
kind: spec
primary: true
---

## Summary

The 2026 OWASP entry for excessive agency, number 3 on the 2026 LLM Top 10 (it was LLM06 in 2025). It defines the risk as damage done because an LLM's output, for whatever reason, drives a tool with more reach than it needs. It names three root causes (too much functionality, too many permissions, too much autonomy), lists seven controls that prevent it and two that only limit the damage, and walks through a hijacked email assistant. This is the canonical Markdown source of the published 2026 text.

## Key claims

- Definition. "Excessive Agency is the vulnerability that enables damaging actions to be performed in response to unexpected, ambiguous or manipulated outputs from an LLM, regardless of what is causing the LLM to malfunction." (Description)
- Two kinds of trigger: hallucination from poor prompts or a weak model, and "direct/indirect prompt injection from a malicious user, an earlier invocation of a malicious/compromised tool, or (in multi-agent/collaborative systems) a malicious/compromised peer agent." (Description)
- Three root causes: "excessive functionality, excessive permissions, excessive autonomy." (Description)
- It is not an output-filtering problem. "Sanitization of model inputs and outputs is not a root control for Excessive Agency" (Description, note)
- In agent terms it shows up as "ASI02: Tool Misuse & Exploitation, ASI03: Identity & Privilege Abuse and ASI08: Cascading Failures." (Description)
- Functionality example: a read-documents tool from a third party "also includes the ability to modify and delete documents." Also: a tool tried during development and dropped "remains available to the LLM agent." (Common Examples 1, 2)
- Permissions example: a read tool connects with an identity that "not only has SELECT permissions, but also UPDATE, INSERT and DELETE permissions." Another uses "a generic high-privileged identity" with access to all users' files. (Common Examples 4, 5)
- Autonomy example: "a tool that allows a user's documents to be deleted performs deletions without any confirmation from the user." (Common Example 6)
- Controls that prevent it: minimize tools, minimize tool functionality, avoid open-ended tools, minimize tool permissions, execute tools in the user's context, require user approval, complete mediation. (Prevention and Mitigation Strategies 1–7)
- Open-ended tools: avoid "run a shell command, fetch a URL, etc." and "build a specific file-writing tool that only implements that specific functionality." (Strategy 3)
- User context: "an LLM tool that reads a user's code repo should require the user to authenticate via OAuth and with the minimum scope required." (Strategy 5)
- Complete mediation: "Implement authorization in logic rather than relying on an LLM to decide if an action is allowed or not." (Strategy 7)
- Graduated enforcement: "A graduated enforcement policy (audit, warn, block, escalate) permits low-consequence or easily reversible actions to auto-approve, while high-consequence or irreversible ones route to human review." Example: refund as store credit auto-processed, external payout to a human. (Strategy 7)
- Two controls only limit damage: "Monitor tool use" and "Rate limiting" with circuit breakers. "The following options will not prevent Excessive Agency but can limit the level of damage caused" (Strategies 8, 9)
- Scenario: an email-summarizing assistant whose tool can also send mail; an injected email makes it "scan the user's inbox for sensitive information and forward it to the attacker's email address." Fixes: a read-only tool, an OAuth session "with a read-only scope", or making the user "manually review and hit 'send' on every mail". (Scenario #1)

## Visuals worth redrawing

- The email scenario as three dials (functionality, permissions, autonomy), each with its fix.

## My notes

- The 2025 page (genai.owasp.org/llmrisk/llm062025-excessive-agency/) has the same three root causes and eight mitigations; 2026 adds complete mediation's graduated policy and splits monitoring and rate limiting out as damage limiters.
