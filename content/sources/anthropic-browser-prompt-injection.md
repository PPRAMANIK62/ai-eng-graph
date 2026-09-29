---
id: anthropic-browser-prompt-injection
title: Mitigating the risk of prompt injections in browser use
author: Anthropic
url: https://www.anthropic.com/news/prompt-injection-defenses
published: 2025-11-24
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Anthropic's post on prompt injection in its Claude for Chrome browser agent, published with Claude Opus 4.5. It explains why browsing makes injection worse, reports that an internal adaptive attacker succeeds about 1% of the time against the new setup, and describes three layers of defense: reinforcement learning against injections, classifiers over untrusted content, and human red-teaming. It says plainly that the problem isn't solved.

## Key claims

- Definition used: "adversarial instructions hidden within the content that AI models process." (intro)
- Not solved. "prompt injection is far from a solved problem, particularly as models take more real-world actions." (intro)
- Where the risk comes from. "every webpage an agent visits is a potential vector for attack." (What is prompt injection?)
- The example: an email "contains hidden instructions embedded in white text, invisible to you but processed by the agent. These instructions direct the agent to forward emails containing the word "confidential" to an external address before drafting the replies you requested." (Why browser use creates unique prompt injection risks)
- Browsers widen both sides: "the attack surface is vast" and "browser agents can take a lot of different actions —navigating to URLs, filling forms, clicking buttons, downloading files". (same)
- Test setup: an internal adaptive Best-of-N attacker, run against "the version of the Claude browser extension that we’re launching today" and the original launch configuration. "An adaptive attacker is given 100 attempts per environment." (Claude's progress on browser use robustness, chart caption)
- The number and the caveat. "A 1% attack success rate—while a significant improvement—still represents meaningful risk. No browser agent is immune to prompt injection, and we share these findings to demonstrate progress, not to claim the problem is solved." (Claude's progress on browser use robustness)
- Layer 1, training: "We use reinforcement learning to build prompt injection robustness directly into Claude's capabilities." Claude is rewarded for refusing injected instructions in simulated web content. (Training Claude to resist prompt injection)
- Layer 2, classifiers: "We scan all untrusted content that enters the model's context window, and flag potential prompt injections with classifiers." They look for "hidden text, manipulated images, deceptive UI elements". (Improving our classifiers)
- Layer 3, people: "Human security researchers consistently outperform automated systems at discovering creative attack vectors." (Scaled expert human red teaming)

## Visuals worth redrawing

- The attack success chart (original preview vs new extension). Only the ~1% figure is stated in text, so don't redraw the other bars.

## My notes

- Newer numbers are in `anthropic-sonnet-5-system-card` (2026-06-30).
