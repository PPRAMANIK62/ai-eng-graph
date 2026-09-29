---
id: meta-agents-rule-of-two
title: "Agents Rule of Two: A Practical Approach to AI Agent Security"
author: Meta AI
url: https://ai.meta.com/blog/practical-ai-agent-security/
published: 2025-10-31
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Meta's design rule for agents, inspired by Chromium's rule of the same name and Willison's lethal trifecta. Until prompt injection can be reliably detected, an agent should have at most two of three properties in one session: it processes untrusted input, it can reach sensitive systems or private data, and it can change state or communicate externally. If a task needs all three, a human or another reliable check must approve. Worked examples show which property each design gives up. Meta says the rule isn't enough on its own.

## Key claims

- Unsolved. "Prompt injection is a fundamental, unsolved weakness in all LLMs." (intro)
- The rule: "until robustness research allows us to reliably detect and refuse prompt injection, agents must satisfy no more than two of the following three properties within a session". (Agents Rule of Two)
- [A] "An agent can process untrustworthy inputs"; [B] "An agent can have access to sensitive systems or private data"; [C] "An agent can change state or communicate externally". (same)
- All three: "the agent should not be permitted to operate autonomously and at a minimum requires supervision — via human-in-the-loop approval or another reliable means of validation." (same)
- Email-Bot attack: a spam email tells the bot to gather the inbox and forward it with a Send-New-Email tool; it works because the bot has [A], [B] and [C]. (How the Agents Rule of Two Stops Exploitation)
- Three fixes: [BC] only process mail from trusted senders; [AC] no access to sensitive data; [AB] only send to trusted recipients or after a human checks the draft. (same)
- Travel agent [AB]: human confirmation of bookings and payments, and "not visiting URLs constructed by the agent". (Hypothetical Examples)
- Research browser [AC]: "Running the browser in a restrictive sandbox without preloaded session data". (same)
- Internal coder [BC]: filter untrusted data by "author-lineage". (same)
- An agent can switch configurations mid-session, e.g. start in [AC] and make "a one-way switch to [B] by disabling communication when accessing internal systems." (same)
- Not a finish line: designs "can still be prone to failure (e.g., a user blindly confirming a warning interstitial)", and the rule is "a supplement — and not a substitute — for common security principles such as least-privilege." (Limitations)
- Doesn't cover lower-impact injection such as "misinformation in the agent’s response". (Limitations)

## Visuals worth redrawing

- The three-circle Venn with labels on the pair overlaps. Meta changed those labels from "safe" to "lower risk" after Willison's critique (`willison-rule-of-two-attacker-moves-second`).

## My notes

- Compared with the lethal trifecta, the Rule of Two widens "external communication" to "change state or communicate externally".
