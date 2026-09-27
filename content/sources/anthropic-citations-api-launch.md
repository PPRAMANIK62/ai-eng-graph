---
id: anthropic-citations-api-launch
title: Introducing Citations on the Anthropic API
author: Anthropic
url: https://claude.com/blog/introducing-citations-api
published: 2025-06-23          # date shown on the page; see notes
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

Anthropic's launch post for the Citations feature. Before it, developers prompted Claude to include sources, which was inconsistent. Now you add documents and Claude cites the sentences it used. The post gives two numbers, both from Anthropic or a customer: up to 15% better recall accuracy than custom setups, and one customer's source hallucinations going from 10% to 0%.

## Key claims

- What it is. "Claude can now provide detailed references to the exact sentences and passages it uses to generate responses" (intro)
- The problem before. Developers "relied on complex prompts that instruct Claude to include source information, often resulting in inconsistent performance and significant time investment in prompt engineering and testing." (intro)
- Vendor claim, internal evals. "Our internal evaluations show that Claude's built-in citation capabilities outperform most custom implementations, increasing recall accuracy by up to 15%." (intro)
- How it works: documents are chunked into sentences and passed with the query; users can supply their own chunks. "the API processes user-provided source documents (PDF documents and plain text files) by chunking them into sentences." (How it works)
- Pricing. "users will not pay for output tokens that return the quoted text itself." (Pricing)
- Customer claim (Endex, CEO quote). "we reduced source hallucinations and formatting issues from 10% to 0% and saw a 20% increase in references per response." (customer section)
- Launched for "the new Claude 3.5 Sonnet and Claude 3.5 Haiku." (Availability)

## Visuals worth redrawing

- None.

## My notes

- The page shows "June 23, 2025" and an update "Now available in Amazon Bedrock. (June 30, 2025)". The candidates list had it as 2025-01, and the models named (Claude 3.5 Sonnet/Haiku) fit an early-2025 launch. The page date may be a re-post date. Say "2025" in articles.
- Both numbers are unaudited: "up to 15%" against unnamed "custom implementations", and 10%→0% from one customer. Label them as vendor claims.
