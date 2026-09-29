---
id: kim-scaling-agent-systems
title: Towards a Science of Scaling Agent Systems
author: Yubin Kim, Ken Gu, et al. (Google Research, Google DeepMind, MIT)
url: https://arxiv.org/abs/2512.08296
published: 2025-12-09
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

A controlled study of single-agent vs four multi-agent architectures (independent, centralized, decentralized, hybrid) across 260 configurations: six agentic benchmarks, three model families, matched tools, prompts and token budgets. Multi-agent helps a lot on decomposable tasks, hurts badly on sequential ones, and averages out to roughly nothing. v3 (2026-04-08) read in full as PDF.

## Key claims

- Scope: "Across 260 configurations spanning six agentic benchmarks, five canonical architectures (Single-Agent and four Multi-Agent: Independent, Centralized, Decentralized, Hybrid), and three LLM families". Models: GPT-5 nano/mini/5, Gemini 2.0 Flash/2.5 Flash/2.5 Pro, Claude Sonnet 3.7/4/4.5. (Abstract; 4.1)
- Matched compute: "All MAS and SAS configurations were matched for total reasoning-token budget (mean 4,800 tokens per trial)". (4.4)
- The range. Relative change vs single agent "ranges from +80.8% on decomposable financial reasoning to −70.0% on sequential planning". (Abstract)
- Finance Agent: centralized +80.8% (0.631 vs 0.349), decentralized +74.5%, hybrid +73.1%. PlanCraft: centralized −50.3%, decentralized −41.5%, hybrid −39.1%, independent −70.0%. BrowseComp-Plus: decentralized +9.2%. Workbench: −1.2% to +5.6%. (4.2)
- SWE-bench Verified: all multi-agent variants slightly worse than single agent (mean 0.522): hybrid −2.1%, centralized −3.1%, decentralized −5.4%, independent −14.9%. (4.2)
- Average. "the overall mean MAS improvement is −0.3% (95% CI: [−58.7%, +77.2%])". (4.2)
- Capability ceiling: "tasks where single-agent performance already exceeds 45% accuracy experience negative returns from additional agents, as coordination costs exceed diminishing improvement potential." (Introduction)
- Error amplification: "Independent systems amplify trace-level errors 17.2× through unchecked error propagation", while "Centralized coordination, however, contains this to 4.4× by enforcing validation bottlenecks that intercept errors before aggregation." (Introduction; Table 5)
- Tool-heavy tasks: "tool-heavy tasks (e.g., 16-tool business workflows) suffer from multi-agent coordination overhead". Mechanism: multi-agent systems "fragment the per-agent token budget". (Introduction)
- Why: a single agent keeps one unified memory; multi-agent systems pay "an unavoidable coordination tax in which the global context must be compressed into inter-agent messages." (Introduction)
- Overhead (Table 5): turns per trial 7.2 single agent vs 26.1 to 44.3 for decentralized, centralized and hybrid; success per 1K tokens 67.7 single vs 13.6 to 42.4 multi-agent. (Table 5)
- The fitted model picks the best architecture for 87% of held-out configurations. (Abstract)
- "architecture-task alignment, not number of agents, determines collaborative success." (Introduction)
- Figure 2 ranges, relative change of multi-agent variants vs single agent: BrowseComp-Plus independent "-35%" up to decentralized +9.2%; Finance Agent "from +57% to +80.8%"; PlanCraft "from -70% to -39%"; Workbench "from -11 to +6%" (text: best +5.6%); SWE-bench Verified "from -15% to -2%" (text: −14.9% to −2.1%); Terminal-Bench independent +1.7% (caption "+2%"), centralized −19.2%. (Figure 2 caption; 4.2)

## Visuals worth redrawing

- Figure 2: relative change per benchmark and architecture. A bar chart of best and worst per benchmark is enough.

## My notes

- Equal token budgets, unlike Anthropic's research system, which spent about 15x chat tokens. Part of why the two disagree.
- SWE-bench Verified and Terminal-Bench used only 20-instance subsets.
