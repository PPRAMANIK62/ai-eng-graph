---
id: moonshot-k2-vendor-verifier
title: K2 Vendor Verifier
author: Moonshot AI
url: https://github.com/MoonshotAI/K2-Vendor-Verifier
published: 2025-11-15
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

The repo behind Moonshot's vendor checks for Kimi K2. It sends 4,000 tool-call requests to each provider hosting the model and compares the results with Moonshot's own API: how often a tool call is triggered like the official one, and how many tool calls match the JSON schema. Results are dated 2025-11-15. Some providers match the official API; several fall to around 72% schema accuracy.

## Key claims

- Why it exists. "We have observed significant differences in the toolcall performance of various open-source solutions and vendors." (What's K2VV)
- The blind spot when picking a host. "When selecting a provider, users often prioritize lower latency and cost, but may inadvertently overlook more subtle yet critical differences in model accuracy." (What's K2VV)
- Method. "We test toolcall's response over a set of 4,000 requests. Each provider's responses are collected and compared against the official Moonshot AI API." (How we do the test)
- Kimi K2 0905 results (test time 2025-11-15, temperature 0.6), schema accuracy: MoonshotAI 100.00%, Moonshot AI Turbo 100.00%, DeepInfra 100.00%, Fireworks 100.00%, Infinigence 100.00%, NovitaAI 100.00%, SiliconFlow 99.77%, Chutes 96.70%, vLLM 76.00%, SGLang 73.13%, Volc 72.86%, Baseten 72.49%, AtlasCloud 72.44%, Together 71.96%, Groq 100.00%, Nebius 84.47%. Groq and Nebius sit below the 80% trigger-similarity line (69.52% and 50.60%). (K2 0905 Evaluation Results table)
- Kimi K2 Thinking results (2025-11-15, temperature 1.0), schema accuracy ranges from 100.00% (MoonshotAI, Fireworks) to 83.05% (Chutes). (K2-thinking Evaluation Results table)
- Advice to vendors includes guided encoding for schemas: "Even with careful prompting, the model may omit fields, add extra ones, or nest them incorrectly. So please add guided encoding to ensure the correct schema." (Suggestions to Vendors)

## Visuals worth redrawing

- Schema accuracy by provider for the same model, as horizontal bars.

## My notes

- vLLM and SGLang rows are open-source serving engines at a pinned version, not hosted providers. That's the self-hosting case: running it yourself with default settings scored 73–76% on K2 0905.
- A provider's result can change as they fix their stack; these are one date's numbers.
