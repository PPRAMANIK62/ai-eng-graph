---
id: anthropic-claude-code-auto-mode
title: "How we built Claude Code auto mode: a safer way to skip permissions"
author: John Hughes et al. (Anthropic)
url: https://www.anthropic.com/engineering/claude-code-auto-mode
published: 2026-03-25
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Claude Code users approve almost every permission prompt, so prompts protect less than they seem. Auto mode replaces most prompts with a two-stage classifier that checks each risky action against what the user asked for, plus a prompt-injection probe on tool outputs. The post gives measured false-positive and false-negative rates, and is clear that the classifier misses some dangerous actions.

## Key claims

- "Claude Code users approve 93% of permission prompts." (subtitle)
- Approval fatigue: approving often means "people stop paying close attention to what they're approving." (intro)
- The tradeoff: sandboxing "is safe but high-maintenance"; bypassing permissions "is zero-maintenance but offers no protection"; "Manual prompts sit in the middle, and in practice users accept 93% of them anyway." (intro)
- Real incidents: deleting remote git branches from a misread instruction, uploading an engineer's GitHub auth token to an internal cluster, attempting migrations against a production database. (intro)
- Threat model: overeager behavior, honest mistakes, prompt injection, a misaligned model. (Threat model)
- Tiers: a safe-tool allowlist (reads, search), in-project file edits allowed without a classifier call, and a transcript classifier for everything else (shell, web fetches, external tools, subagents, files outside the project). (How permission decisions work)
- The classifier sees only user messages and tool calls: "we strip out Claude's own messages and tool outputs". (How it works)
- Results (full pipeline): 0.4% false positives on 10,000 real tool calls; "17% FNR" on 52 real overeager actions; 5.7% FNR on 1,000 synthetic exfiltration attempts. Stage 1 alone: 8.5% FPR, 6.6% and 1.8% FNR. (Results, Table 1)
- "The 17% false-negative rate on real overeager actions is the honest number." Most misses spot the danger but misjudge whether the user's words cover this specific action. (Results)
- Compared with careful manual approval, auto mode is "arguably a regression"; "It is not a drop-in replacement for careful human review on high-stakes infrastructure." (Results)
- Deny-and-continue: a blocked action returns to the agent as a tool result. "If a session accumulates 3 consecutive denials or 20 total, we stop the model and escalate to the human." In headless mode the process is terminated. (Deny-and-continue)

## Visuals worth redrawing

- Figure 1: permission modes placed by autonomy and security (sandbox, manual prompts, auto mode, skip permissions).
- Table 1 as a small chart.

## My notes

- Search snippets elsewhere quote "97%"; this post says 93%. Use 93%.
- Only data source for approval fatigue; no independent study.
