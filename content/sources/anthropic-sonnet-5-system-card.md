---
id: anthropic-sonnet-5-system-card
title: "System Card: Claude Sonnet 5"
author: Anthropic
url: https://www.anthropic.com/claude-sonnet-5-system-card
published: 2026-06-30
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The system card for Claude Sonnet 5. Section 5.2 covers prompt injection in agents: a definition, why it's dangerous when a model has private data and can act, why static benchmarks mislead, and attack success rates from several tests (Gray Swan's benchmarks, a live bug bounty, adaptive attackers on coding, computer use and browser use). The numbers vary a lot by surface, attacker budget and whether product safeguards are on. The URL redirects to a PDF on www-cdn.anthropic.com; read as extracted text.

## Key claims

- Definition. "Prompt injection is a malicious instruction hidden in tool results that an agent processes during a task." (5.2)
- Example: "an email the agent is asked to summarize might contain hidden text instructing it to exfiltrate all recent internal communications." (5.2)
- It scales for attackers: "a single payload embedded in a public webpage or shared document can compromise any agent that processes it, without the attacker needing to target specific users or systems." (5.2)
- The dangerous combination: "They are especially dangerous when a model can both access private data and take actions on the user’s behalf, since that combination lets attackers exfiltrate sensitive information or trigger unauthorized actions." (5.2)
- Benchmarks saturate. "Claude models have saturated most public benchmarks, as well as those produced by third-party research organizations." ART is being deprecated as the primary benchmark. (5.2, 5.2.1)
- Static tests mislead. "Fixed datasets of known attacks can provide a false sense of security, as a model may perform well against established attack patterns while remaining vulnerable to novel approaches." (5.2.2; cites Nasr et al.)
- The adaptive tests are deliberately harsh: "the attacker optimizes directly against the test scenarios and gets many attempts per scenario. Real-world attackers typically lack both affordances". (5.2.2)
- Bug bounty (one week, Gray Swan, 11 scenarios, models without product protections): "only 0.19% of unique attacks succeeding" against Sonnet 5 and Opus 4.8; Sonnet 4.6 1.41%, GPT-5.5 3.08%, Gemini 3.5 Flash 6.66%; range across models "0.19% to 14.29%". (5.2.2.1)
- The bug bounty numbers are "a lower bound on the practical robustness of deployed systems" because Claude was tested without "harness-level defenses and prompt injection probes". (5.2.2.1)
- Coding (Shade adaptive attacker, 40 scenarios, 200 attempts each), without safeguards, with thinking: Sonnet 5 0.31% of attempts, 7/40 scenarios; Sonnet 4.6 12.71%, 36/40. With safeguards: Sonnet 5 0.09%, 5/40. (Table 5.2.2.2.A)
- Computer use (Shade, 14 scenarios, 200 attempts each), with thinking: Sonnet 5 2.25% of attempts, 4/14 scenarios without safeguards; 1.46%, 4/14 with safeguards. Sonnet 4.6 12.0%, 6/14 without. (Table 5.2.2.3.A)
- Browser use (129 environments, professional red-teamers, 10 attempts each), with thinking: Sonnet 5 0.93% of attempts, 9/129 scenarios without safeguards, 0%, 0/129 with safeguards. Sonnet 4.6 50.7%, 98/129 without; 1.16%, 7/129 with. Opus 4.8 31.5%, 81/129 without; 0.08%, 1/129 with. (Table 5.2.2.4.A)
- "With the new safeguards we are deploying across Browser Use surfaces, no successful attacks were observed against Sonnet 5 under both thinking settings". (5.2.2.4)
- Attempt vs scenario rates: "Attempt-level ASR is the fraction of all attempts that succeed; scenario-level ASR is the fraction of scenarios where at least one attempt succeeded." (table captions)

## Visuals worth redrawing

- Attempt-level vs scenario-level success for the same model and surface (e.g. coding, Sonnet 4.6: 12.71% of attempts vs 36 of 40 scenarios), to show why one number hides the other.
- Per-surface numbers for Sonnet 5 with and without safeguards.

## My notes

- The Sonnet 4.6 system card (2026-02-17) has different Sonnet 4.6 browser numbers (1.29% of 389 scenarios, Best-of-N attacker) from a different evaluation. Not comparable with the table here; I used only this card.
- Mythos 5 and Fable 5 were left out of the bug bounty because they "had been de-deployed" after a US export control directive (footnote 5).
