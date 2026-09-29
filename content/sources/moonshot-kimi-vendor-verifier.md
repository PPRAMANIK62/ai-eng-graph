---
id: moonshot-kimi-vendor-verifier
title: 'Rebuilding the "Chain of Trust": Kimi Vendor Verifier'
author: Moonshot AI
url: https://www.kimi.ai/blog/kimi-vendor-verifier
published: 2026
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Moonshot AI, which makes the open-weight Kimi models, explains why it built a verifier for third-party hosts: the same model served by different providers scored differently, often because of wrong decoding settings, and sometimes because of subtler serving bugs. The verifier runs a set of benchmarks chosen to catch specific infrastructure failures. Released alongside Kimi K2.6; the page is undated.

## Key claims

- The problem. "we learned the hard way that open-sourcing a model is only half the battle. The other half is ensuring it runs correctly everywhere else." (intro)
- First cause found: wrong decoding parameters. "a significant portion of these cases stemmed from the misuse of Decoding parameters." Their fix was to enforce "Temperature=1.0 and TopP=0.95 in Thinking mode" at the API. (From Isolated Incidents to Systemic Issues)
- It's widespread. "we observed a stark contrast between third-party API and official API. After extensive testing of various infrastructure providers, we found this difference is widespread." (same)
- The trade-off. "The more open the weights are, and the more diverse the deployment channels become, the less controllable the quality becomes." (same)
- What long tests catch. AIME2025 as a "Long-output stress test. Catches KV cache bugs and quantization degradation that short benchmarks hide." (Our Solution)
- Tool calls. "Tool errors compound in agents; we catch them early." (Our Solution, K2VV ToolCall)
- Cost of checking. A full run took "approximately 15 hours" on two 8-GPU NVIDIA H20 servers. (Testing Cost Estimation)
- The line. "Weights are open. The knowledge to run them correctly must be too." (An Open Invitation)

## Visuals worth redrawing

- None; the numbers are in the companion repo (`moonshot-k2-vendor-verifier`).

## My notes

- Moonshot has an interest in steering users to its official API. The repo's numbers still show real spread across hosts.
