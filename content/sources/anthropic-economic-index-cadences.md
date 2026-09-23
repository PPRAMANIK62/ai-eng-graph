---
id: anthropic-economic-index-cadences
title: "Anthropic Economic Index report: Cadences"
author: Maxim Massenkoff, Eva Lyubich, Szymon Sacher, Zoe Hitzig, Shaoyi Zhang, Ryan Heller, Peter McCrory (Anthropic)
url: https://www.anthropic.com/research/economic-index-june-2026-report
published: 2026-06-26
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

Anthropic's June 2026 usage report. It opens by noting that Claude usage has moved from chat toward long-running agentic tasks (Claude Code and Cowork), then looks at timing (personal use rises on weekends), what each conversation produces (a new "artifact" classifier), how much autonomy Claude is given, and a first user survey.

## Key claims

- The shift from chat to agents over one year. "One year ago, most Claude usage took the form of a conversation between a user and an assistant. With the rapid growth of Claude Code and Cowork, Claude sessions now increasingly consist of long-running agentic tasks." (Introduction)
- Personal vs work by day. "spikes from around 35% on weekdays to just under 50% on weekends during the sample period" (The workweek)
- Almost every conversation produces something. "Our classifier identified 93% of Claude conversations as producing an artifact" (Chapter 2)
- Most common outputs. "The most common artifacts are explanations (17% of conversations), documents and reports (15%), and guidance (11%)." (Chapter 2)
- Rough split of outputs in chat and Cowork: conversational outputs about a third, written deliverables about a third, "code and technical work (like apps or scripts) for about a sixth." (Chapter 2)
- Output type depends on product. "Chat and Cowork provide more explanations than Claude Code, for example." (Introduction, chapter preview)
- Autonomy is lowest for tasks with a clear answer (math, translation, Q&A) and highest for open-ended building (apps, websites, games, presentations). "the lowest-autonomy outputs are math or calculations, translations, and Q&As." (How much autonomy does Claude have to decide on its own?)
- Claude Code sessions run on the biggest models far more often. "Claude Code sessions run on the most capable models far more often (54% are served by Opus, against 10% of chat and Cowork conversations)." (autonomy section)
- More autonomy goes with more compute. "across artifacts, mean autonomy and median token use rise together" (autonomy section)
- Personal outputs: "More than 80% of conversations producing creative writing, guidance, and recipes were classified as personal." (What is each artifact used for?)

## Visuals worth redrawing

- Figure 2.1 (Claude's outputs): the twelve most common output types. Redraw the top five as a bar chart, dated 2026-06.
- Figure 1.1 (personal share by day): weekday ~35%, weekend ~50%.

## My notes

- Artifact numbers cover chat and Cowork ("Claude conversations"); Claude Code is compared separately, and the 1P API mix is only in the appendix. The report doesn't give a single "coding share" headline.
- Vendor report about its own product; classifiers, not human labels.
- Pairs with `chatterji-how-people-use-chatgpt` (consumer ChatGPT to 2025-07) to show two different user bases.
