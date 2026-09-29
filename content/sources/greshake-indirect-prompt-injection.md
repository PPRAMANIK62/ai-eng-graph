---
id: greshake-indirect-prompt-injection
title: "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection"
author: Kai Greshake, Sahar Abdelnabi, Shailesh Mishra, Christoph Endres, Thorsten Holz, Mario Fritz
url: https://arxiv.org/abs/2302.12173
published: 2023-02-23
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The paper that defined indirect prompt injection. Until then, attacks assumed the user typed the malicious prompt. The authors show that an attacker can plant instructions in data the app will later retrieve (web pages, documents), and the model follows them. They give a taxonomy of what this enables (data theft, worming, contaminating information, and more) and demonstrate it against Bing's GPT-4 chat and code-completion tools. Latest version 2023-05-05.

## Key claims

- Before this, the assumed attacker was the user. "So far, it was assumed that the user is directly prompting the LLM. But, what if it is not the user prompting?" (Abstract)
- The core point. "We argue that LLM-Integrated Applications blur the line between data and instructions." (Abstract)
- The new vector: planting prompts in data. Indirect injection lets adversaries "remotely (without a direct interface) exploit LLM-integrated applications by strategically injecting prompts into data likely to be retrieved." (Abstract)
- Impacts include "data theft, worming, information ecosystem contamination, and other novel security risks." (Abstract)
- Demonstrated on real systems, "such as Bing's GPT-4 powered Chat and code-completion engines". (Abstract)
- Retrieved prompts act like code. "We show how processing retrieved prompts can act as arbitrary code execution, manipulate the application's functionality, and control how and if other APIs are called." (Abstract)
- No mitigations yet in 2023. "effective mitigations of these emerging threats are currently lacking." (Abstract)

## Visuals worth redrawing

- None used; only the abstract was read.

## My notes

- Only the abstract was read. Don't cite numbers or specific demos from the body.
