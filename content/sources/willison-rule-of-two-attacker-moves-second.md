---
id: willison-rule-of-two-attacker-moves-second
title: "New prompt injection papers: Agents Rule of Two and The Attacker Moves Second"
author: Simon Willison
url: https://simonwillison.net/2025/Nov/2/new-prompt-injection-papers/
published: 2025-11-02
accessed: 2026-09-29
kind: blog
primary: false
---

## Summary

Willison reviews Meta's Agents Rule of Two and the "Attacker Moves Second" paper. He likes the Rule of Two because it adds state changes, which his lethal trifecta leaves out. He then points out a flaw: untrusted input plus the ability to change state is still dangerous without private data. Meta relabeled those overlaps from "safe" to "lower risk". On the paper: 12 defenses fell to adaptive attacks and human red-teamers beat all of them. His conclusion is that reliable defenses aren't coming soon, so design by the Rule of Two. Not primary for the papers themselves; primary for his critique.

## Key claims

- The trifecta's gap: "it only covers the risk of data exfiltration: there are plenty of other, even nastier risks that arise from prompt injection attacks against LLM-powered agents with access to tools which the lethal trifecta doesn’t cover." (Agents Rule of Two section)
- What the Rule of Two adds: "anything that can change state triggered by untrustworthy inputs is something to be very cautious about." (same)
- Design, don't filter: "attempts to block or filter them have not proven reliable enough to depend on. The current solution is to design systems with this in mind". (same)
- The critique: the diagram "marks the combination of untrustworthy inputs and the ability to change state as “safe”, but that’s not right. Even without access to private systems or sensitive data that pairing can still produce harmful results." (Update)
- Meta's reply, from Mick Ayzenberg: [B] covers "any sensitive system", so an agent without [B] can act but "not with any systems that matter", e.g. one that "can take actions in a tight sandbox or is isolated from production." (Update 2)
- Meta changed the label: "The Meta team also updated their post to replace “safe” with “lower risk” as the label on the intersections between the different circles." (Update 2)
- Human red-teaming beat everything: "Notably the “Human red-teaming setting” scored 100%, defeating all defenses. That red-team consisted of 500 participants in an online competition they ran with a $20,000 prize fund." (The Attacker Moves Second)
- The key point: "static example attacks—single string prompts designed to bypass systems—are an almost useless way to evaluate these defenses." (same)
- Conclusion. "I do not share their optimism that reliable defenses will be developed any time soon." The Rule of Two is "the best practical advice for building secure LLM-powered agent systems today in the absence of prompt injection defenses we can rely on." (end)

## Visuals worth redrawing

- None beyond Meta's Venn.

## My notes

- The 100% human red-team figure comes from this review of the paper; only the paper's abstract was read.
