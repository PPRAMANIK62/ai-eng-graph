---
id: patil-bfcl
title: "The Berkeley Function Calling Leaderboard (BFCL): From Tool Use to Agentic Evaluation of Large Language Models"
author: Shishir G. Patil, Huanzhi Mao, Fanjia Yan, Charlie Cheng-Jie Ji, Vishnu Suresh, Ion Stoica, Joseph E. Gonzalez
url: https://proceedings.mlr.press/v267/patil25a.html
published: 2025
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The ICML 2025 paper behind the Berkeley Function Calling Leaderboard, the most used benchmark for tool calling. It scores single-turn calls by comparing the model's call against the expected one as a syntax tree (AST), and adds real user queries, multi-turn tasks (including missing parameters and missing functions), and agentic tasks (web search, memory, SQL). The finding: single calls are mostly solved, multi-turn and memory are not. Read the full PDF (linked from the proceedings page). The live leaderboard (https://gorilla.cs.berkeley.edu/leaderboard.html) was at v4, last updated 2026-04-12, with overall accuracy as "the unweighted average of all the sub-categories"; its table didn't load as text, so no current model scores here.

## Key claims

- Definition. "Function calling, also called tool use, refers to an LLM's ability to invoke external functions, APIs, or user-defined tools—an essential capability for agentic LLM applications." (Abstract)
- Main finding. "while state-of-the-art LLMs excel at single-turn calls, memory, dynamic decisionmaking, and long-horizon reasoning remain open challenges." (Abstract; line break hyphen dropped)
- Single-turn categories: simple (one tool, one call), multiple (several tools, pick one), parallel (one tool called several times), parallel multiple, and irrelevance ("cases where tools are available but not invoked"). (3.1 Single-turn Dataset)
- AST checking correlates with actually running the call. "we observe a strong correlation between AST scores and execution-based performance." (4.3 AST Matching Performance)
- Crowd-sourced set: 64,517 real single-turn queries collected 2024-02-26 to 2024-04-01. (3.2 Crowd-sourced Dataset)
- Multi-turn categories: Base; Missing Parameters ("recognize when critical parameter information is missing from the user request and cannot be inferred"); Missing Functions ("identify when no available function can fulfill the user request"); Long Context. (3.3 Multi-turn Dataset)
- Results summary. "While the top-performing models excel in singleturn, crowd-sourced, and hallucination-related metrics, there remains significant room for improvement in multi-turn and agentic tasks, particularly in memory management." (5.1 Accuracy)
- Table 1, second row, gpt-4o-2024-11-20 (FC): overall 65.8 (the top row is the same model in prompting mode, 66.4); single-turn AST simple 77.2, multiple 93.5, parallel 93.0; irrelevance 83.1; multi-turn base 62.5, missing function 6.0, missing parameter 37.5, long context 58.0; web search 82.0; memory 0.0; SQL 81.0. (Table 1)
- Table 1, claude-3.5-sonnet-20241022 (FC): single-turn AST multiple 94.5 but parallel 3.5 and parallel multiple 5.0. (Table 1)
- Memory is the weak spot. "Current models struggle with memory tasks; even the benchmark leader, openai o1-2024-12-17 (FC), reaches only 12% accuracy." (Conclusion area)
- Native tool-calling ("FC") mode vs prompting mode: FC outputs are structured and parse more easily, "However, these structural constraints of the FC mode can limit the flexibility of a model in complex function calling scenarios." (Section 5, FC vs prompting)
- "Prompting models exhibit on average three times more decoding issues than FC models (412.93 vs. 182.5 out of 4,251 total entries)". (5.2; line-break hyphen dropped. The two counts give about 2.3 times, not three, so the article doesn't use the multiplier.)
- Parallel calls cut latency for independent calls ("checking the stock prices of 20 different stocks simultaneously is far more efficient than making 20 separate requests"), but flagship models in late 2024 seemed to drop parallel calls; the authors guess one-at-a-time calls "might ultimately be both faster and more accurate" when each call depends on the last. (5.3 Parallel Function Call Ability)
- Most common multi-turn failure: "Failed to Understand Environment State". (5.4 Multi Turn Error Analysis)
- "many models give up after a single failure, mistakenly concluding that the information is unavailable" (memory analysis)

## Visuals worth redrawing

- One model's row of Table 1 as bars: high on single-turn, low on missing functions and memory.

## My notes

- Model rows are late-2024 models. Say "in the 2025 paper" and don't present them as current.
