---
id: willison-lethal-trifecta
title: "The lethal trifecta for AI agents: private data, untrusted content, and external communication"
author: Simon Willison
url: https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
published: 2025-06-16
accessed: 2026-09-29
kind: blog
primary: false
---

## Summary

Names the three capabilities that, combined in one agent, let an attacker steal data: access to private data, exposure to untrusted content, and a way to communicate externally. Argues guardrail products that catch "95%" of attacks aren't enough and the safe move is to never combine all three.

## Key claims

- The three: private data, untrusted content, and "The ability to externally communicate in a way that could be used to steal your data". (The lethal trifecta)
- "If your agent combines these three features, an attacker can easily trick it into accessing your private data and sending it to that attacker." (same)
- Ways to send data out "are almost limitless". (same)
- On guardrail products claiming "95% of attacks": "in web application security 95% is very much a failing grade." (Guardrails won’t protect you)
- Why. "LLMs follow instructions in content." and "LLMs are unable to reliably distinguish the importance of instructions based on where they came from. Everything eventually gets glued together into a sequence of tokens and fed to the model." (The problem is that LLMs follow instructions in content)
- Telling the model not to isn't reliable: "you can try telling it not to in your own prompt, but how confident can you be that your protection will work every time?" (same)
- "Researchers report this exploit against production systems all the time." (This is a very common problem)
- Common in practice: seen against Microsoft 365 Copilot, GitHub's official MCP server and GitLab's Duo Chatbot in the weeks before the post, and earlier against ChatGPT (April 2023), ChatGPT Plugins (May 2023), Google Bard, Amazon Q, Google NotebookLM, Slack, Anthropic's Claude iOS app, ChatGPT Operator and others. (This is a very common problem)
- How vendors fix it. "Almost all of these were promptly fixed by the vendors, usually by locking down the exfiltration vector such that malicious instructions no longer had a way to extract any data that they had stolen." (same)
- But not for tools you combine yourself: "once you start mixing and matching tools yourself there’s nothing those vendors can do to protect you!" (same)
- MCP makes mixing easy. "The problem with Model Context Protocol—MCP—is that it encourages users to mix and match tools from different sources that can do different things." (It’s very easy to expose yourself to this risk)
- The channels. "If a tool can make an HTTP request—to an API, or to load an image, or even providing a link for a user to click—that tool can be used to pass stolen information back to an attacker." (same)
- Email is untrusted input: "an attacker can literally email your LLM and tell it what to do!" (same)
- GitHub MCP: one tool had all three. It "can read issues in public issues that could have been filed by an attacker, access information in private repos and create pull requests in a way that exfiltrates that private data." (same)
- No full prevention. "we still don’t know how to 100% reliably prevent this from happening." (Guardrails won’t protect you)
- Design rule quoted from the design-patterns paper: "once an LLM agent has ingested untrusted input, it must be constrained so that it is impossible for that input to trigger any consequential actions." (same)
- Term drift: many assume prompt injection means directly tricking a model; "I call those jailbreaking attacks and consider them to be a different issue than prompt injection." (This is an example of the “prompt injection” class of attacks)
- "The only way to stay safe there is to avoid that lethal trifecta combination entirely." (same)

## Visuals worth redrawing

- The three circles; the danger is the overlap.

## My notes

- Not primary; widely cited. Willison coined "prompt injection".
