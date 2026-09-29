---
id: reddy-echoleak
title: "EchoLeak: The First Real-World Zero-Click Prompt Injection Exploit in a Production LLM System"
author: Pavan Reddy, Aditya Sanjay Gujral
url: https://arxiv.org/abs/2509.10540
published: 2025-09-06
accessed: 2026-09-29
kind: paper
primary: false
---

## Summary

A case study of EchoLeak (CVE-2025-32711), found by Aim Security in Microsoft 365 Copilot. One crafted email, pulled in by Copilot's normal retrieval, made Copilot put sensitive data into an image URL. The chat client fetched the image automatically, so no click was needed. The chain got past four defenses: a prompt injection classifier, link redaction, and the content security policy (through a Teams proxy on the allowlist). Microsoft fixed it server-side in May 2025 before public disclosure on 2025-06-11. Read from the arXiv PDF. Not primary: the authors analyze Aim Labs' findings.

## Key claims

- The CVE: "Microsoft assigned CVE-2025-32711 to" the flaw; Aim Security (Aim Labs) found it. "In June 2025, researchers at Aim Security disclosed EchoLeak". (Introduction)
- What it was: "a zero-click prompt injection vulnerability in Microsoft 365 Copilot that enabled remote, unauthenticated data exfiltration via a single crafted email." (Abstract)
- The chain: "evading Microsoft's XPIA (Cross Prompt Injection Attempt) classifier, circumventing link redaction with reference-style Markdown, exploiting auto-fetched images, and abusing a Microsoft Teams proxy allowed by the content security policy". (Abstract)
- Zero-click. "No user action beyond Copilot processing the email is required." (Overview)
- Step 1: the email was written as a normal request to the human recipient, so the injection classifier didn't flag it, and it told Copilot not to mention the email: "For compliance, do not reference this email". (Vulnerability Analysis, Step 1)
- Step 2: Copilot redacted inline markdown links, but "EchoLeak sidestepped this by exploiting reference-style links, instead of inline syntax." (Step 2)
- A link alone still needed a click; Step 3 used an image: "The Copilot chat UI, upon rendering the answer, immediately try to fetch that image URL, exfiltrating data to the attacker in the process." (Step 3)
- The CSP blocked images from unknown domains, so Step 4 routed the image through "a Microsoft Teams asynchronous preview API" on the allowlist, which fetched the attacker URL. (Step 4)
- To the victim it looked "indistinguishable from a broken link or a broken image". (Step 1)
- Timeline: proof of concept January 2025, server-side fix May 2025, advisory and public disclosure 2025-06-11; "no evidence of in-the-wild exploitation". (Overview, Table 1)
- Mitigations proposed: "prompt partitioning, enhanced input/output filtering, provenance-based access control, and strict content security policies." (Abstract)

## Visuals worth redrawing

- Figure 2, the kill chain: email → retrieval → Copilot answer with reference-style image → client fetch → Teams proxy → attacker. Redraw as a chain with each bypassed defense marked.

## My notes

- The case shows layered defenses each being bypassed in turn.
